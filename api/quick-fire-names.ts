
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGemini, MODEL_TEXT, cleanJsonResponse } from './lib/common.js';
import { Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { style, petType, petGender, language } = req.body;
  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `List 20 unique short pet names for a ${petGender} ${petType} in ${language} with a ${style} vibe.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { names: { type: Type.ARRAY, items: { type: Type.STRING } } }
        }
      }
    });
    return res.status(200).send(cleanJsonResponse(response.text));
  } catch (e) { return res.status(500).json({ names: [] }); }
}
