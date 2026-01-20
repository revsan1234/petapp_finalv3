
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGemini, MODEL_TEXT, cleanJsonResponse } from './lib/common.js';
import { Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query, language } = req.body;
  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
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
                properties: {
                  name: { type: Type.STRING },
                  mission: { type: Type.STRING },
                  address: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  website: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return res.status(200).send(cleanJsonResponse(response.text));
  } catch (e) { return res.status(500).json({ results: [] }); }
}
