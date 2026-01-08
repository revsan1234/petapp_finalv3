import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@vercel/kv";

// Connect to Vercel KV Storage to manage limits
const kv = process.env.KV_REST_API_URL ? createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN!,
}) : null;

function cleanJsonResponse(text: string | undefined): string {
  if (!text) return '{}';
  return text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { action } = req.query;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const deviceId = req.headers['x-device-id'] as string || 'unknown';
  
  if (!apiKey) return res.status(500).json({ message: "Server error: Missing API Key." });

  const ai = new GoogleGenAI({ apiKey });

  try {
    switch (action) {
      case 'generate-image': {
        // ENFORCE LIMIT: 1 per 24 hours per unique device
        if (kv) {
          const limitKey = `limit:img:${deviceId}`;
          const isLimited = await kv.get(limitKey);
          if (isLimited) {
            return res.status(429).json({ message: "Daily limit reached. Magic is recharging! Come back in 24 hours." });
          }
          // Set a 24-hour expiration lock for this device
          await kv.set(limitKey, '1', { ex: 86400 });
        }

        const { base64Image, mimeType, prompt, style } = req.body;
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: [{ 
            parts: [
              { inlineData: { data: base64Image, mimeType } }, 
              { text: `Edit this pet photo. Instruction: ${prompt}. Style: ${style}. Return only the image data.` }
            ] 
          }]
        });
        let imageUrl = '';
        const parts = result.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        }
        return res.status(200).json({ imageUrl });
      }

      case 'generate-names': {
        const { petInfo, language } = req.body;
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Suggest 6 names for a ${petInfo.gender} ${petInfo.type} that is ${petInfo.personality} in ${language}. Style: ${petInfo.style}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                names: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, meaning: { type: Type.STRING } },
                    required: ["id", "name", "meaning"]
                  }
                }
              }
            }
          }
        });
        return res.status(200).send(cleanJsonResponse(result.text));
      }

      case 'generate-bio': {
        const { name, petType, personality, language } = req.body;
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `3 social media bios for a ${petType} named ${name} (${personality}) in ${language}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { bios: { type: Type.ARRAY, items: { type: Type.STRING } } } }
          }
        });
        return res.status(200).send(cleanJsonResponse(result.text));
      }

      case 'analyze-personality': {
        const { quizAnswers, language } = req.body;
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze traits: ${quizAnswers.join(', ')}. Return personality profile in ${language}.`,
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
        return res.status(200).send(cleanJsonResponse(result.text));
      }

      case 'expert-consultant': {
        const { message, systemInstruction } = req.body;
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: message,
          config: { systemInstruction, tools: [{ googleSearch: {} }] }
        });
        const sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks
          ?.filter((c: any) => c.web)
          ?.map((c: any) => ({ uri: c.web.uri, title: c.web.title })) || [];
        return res.status(200).json({ text: result.text || '', sources });
      }

      default: return res.status(400).json({ message: "Unknown action" });
    }
  } catch (e: any) {
    console.error("AI Backend Error:", e);
    return res.status(500).json({ message: "Service busy. Try again." });
  }
}