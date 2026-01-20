
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGemini, MODEL_TEXT, cleanJsonResponse } from './lib/common.js';
import { Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name, targetLanguage } = req.body;
  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Translate the pet name "${name}" into ${targetLanguage} and provide pronunciation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { translation: { type: Type.STRING }, pronunciation: { type: Type.STRING } }
        }
      }
    });
    return res.status(200).send(cleanJsonResponse(response.text));
  } catch (e) { return res.status(500).json({}); }
}
