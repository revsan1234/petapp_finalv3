import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@vercel/kv";

// Connect to Vercel KV Database
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
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  const deviceId = req.headers['x-device-id'] as string || 'unknown';
  
  if (!apiKey) return res.status(500).json({ message: "Server configuration error: Missing API Key." });

  const ai = new GoogleGenAI({ apiKey });

  try {
    switch (action) {
      case 'generate-image': {
        // Enforce 1 photo per 24 hours per device
        if (kv) {
          const limitKey = `limit:img:${deviceId}`;
          const isLimited = await kv.get(limitKey);
          if (isLimited) {
            return res.status(429).json({ message: "Daily limit reached. Magic is recharging! Come back in 24 hours." });
          }
          // Set a 24-hour expiration lock for this phone/device
          await kv.set(limitKey, '1', { ex: 86400 });
        }

        const { base64Image, mimeType, prompt, style } = req.body;
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: [{ 
            parts: [
              { inlineData: { data: base64Image, mimeType } }, 
              { text: `Edit this pet photo. Instruction: ${prompt}. Style: ${style}. Output only the image data.` }
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
          contents: `6 names for a ${petInfo.gender} ${petInfo.type} (${petInfo.personality}) in ${language}.`,
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
          contents: `3 bios for ${name} (${petType}, ${personality}) in ${language}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { bios: { type: Type.ARRAY, items: { type: Type.STRING } } } }
          }
        });
        return res.status(200).send(cleanJsonResponse(result.text));
      }

      case 'name-of-the-day': {
        const { language } = req.body;
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Random pet name in ${language}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, meaning: { type: Type.STRING } } }
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
        return res.status(200).json({ text: result.text || '', sources: [] });
      }

      default: return res.status(400).json({ message: "Unknown action" });
    }
  } catch (e: any) {
    console.error("Backend Error:", e);
    return res.status(500).json({ message: "AI Error" });
  }
}