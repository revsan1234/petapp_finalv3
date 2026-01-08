import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@vercel/kv";

// 1. Initialize Tools
const KV = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const getGemini = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 2. Helper Functions
async function verifyTurnstile(token: string | null) {
  if (!token || !process.env.TURNSTILE_SECRET_KEY) return false;
  const formData = new URLSearchParams();
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY);
  formData.append('response', token);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData, method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const outcome = await res.json();
    return outcome.success;
  } catch { return false; }
}

async function checkAndIncrementGlobalCap() {
  const monthKey = `global:imagecount:${new Date().toISOString().substring(0, 7)}`;
  const count = (await KV.get<number>(monthKey)) || 0;
  if (count >= 2000) return true; // Monthly Cap Reached
  await KV.incr(monthKey);
  return false;
}

// 3. MAIN HANDLER
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { action } = req.query;
  const deviceId = req.headers['x-device-id'] as string || 'unknown';
  const ai = getGemini();

  try {
    switch (action) {
      case 'generate-image': {
        const turnstileToken = req.headers['x-turnstile-token'] as string;
        if (!(await verifyTurnstile(turnstileToken))) return res.status(401).json({ message: "Bot check failed" });
        if (await checkAndIncrementGlobalCap()) return res.status(403).json({ message: "Monthly limit reached" });
        
        const dailyKey = `daily:image:${deviceId}`;
        if (!(await KV.set(dailyKey, '1', { nx: true, ex: 86400 }))) return res.status(429).json({ message: "1 image per day!" });

        const { base64Image, mimeType, prompt, style } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ inlineData: { data: base64Image, mimeType } }, { text: `Edit this pet image to show: ${prompt}. Style: ${style}.` }] }
        });

        let outputUrl = '';
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) outputUrl = `data:image/png;base64,${part.inlineData.data}`;
        }
        return res.status(200).json({ imageUrl: outputUrl });
      }

      case 'generate-names': {
        const { petInfo, language } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Suggest 6 names for a ${petInfo.gender} ${petInfo.type} (${petInfo.personality}) in ${language}. Style: ${petInfo.style}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                names: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, meaning: { type: Type.STRING }, style: { type: Type.STRING } }
                  }
                }
              }
            }
          }
        });
        return res.status(200).send(response.text);
      }

      case 'generate-bio': {
        const { name, petType, personality, language } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Write 3 short social bios for a ${petType} named ${name} (${personality}) in ${language}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { bios: { type: Type.ARRAY, items: { type: Type.STRING } } } }
          }
        });
        return res.status(200).send(response.text);
      }

      case 'analyze-personality': {
        const { quizAnswers, language } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze these pet traits: ${quizAnswers.join(', ')}. Determine personality in ${language}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                keywords: { type: Type.OBJECT, properties: { personality: { type: Type.STRING }, style: { type: Type.STRING } } }
              }
            }
          }
        });
        return res.status(200).send(response.text);
      }

      case 'search-grounding': {
        const { query, language } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: query,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                results: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { name: { type: Type.STRING }, mission: { type: Type.STRING }, address: { type: Type.STRING }, phone: { type: Type.STRING }, website: { type: Type.STRING } }
                  }
                }
              }
            }
          }
        });
        return res.status(200).send(response.text);
      }

      case 'expert-consultant': {
        const { message, systemInstruction } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: message,
          config: { systemInstruction, tools: [{ googleSearch: {} }] }
        });
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
          ?.filter((c: any) => c.web)
          ?.map((c: any) => ({ uri: c.web.uri, title: c.web.title })) || [];
        return res.status(200).json({ text: response.text, sources });
      }

      case 'name-of-the-day': {
        const { language } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Give me a random unique pet name and its meaning in ${language}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, meaning: { type: Type.STRING } } }
          }
        });
        return res.status(200).send(response.text);
      }

      case 'quick-fire-names': {
        const { style, petType, petGender, language } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `List 20 short pet names for a ${petGender} ${petType} in ${language}. Style: ${style}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { names: { type: Type.ARRAY, items: { type: Type.STRING } } } }
          }
        });
        return res.status(200).send(response.text);
      }

      case 'translate-name': {
        const { name, targetLanguage } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Translate the pet name "${name}" to ${targetLanguage} and provide pronunciation.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { translation: { type: Type.STRING }, pronunciation: { type: Type.STRING } } }
          }
        });
        return res.status(200).send(response.text);
      }

      case 'pet-horoscope': {
        const { sign, petType, name, language } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Write a short weekly horoscope for a ${petType} named ${name} who is a ${sign} in ${language}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { prediction: { type: Type.STRING }, luckyItem: { type: Type.STRING } } }
          }
        });
        return res.status(200).send(response.text);
      }

      default: return res.status(400).json({ message: "Unknown action" });
    }
  } catch (e: any) {
    console.error("Backend Error:", e);
    return res.status(500).json({ message: "Magic glitch—try again!" });
  }
}