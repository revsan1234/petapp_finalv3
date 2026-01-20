
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGemini, MODEL_TEXT, cleanJsonResponse } from './lib/common.js';
import { Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { sign, petType, name, language } = req.body;
  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Write a fun weekly pet horoscope for a ${petType} named ${name} who is a ${sign} in ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { prediction: { type: Type.STRING }, luckyItem: { type: Type.STRING } }
        }
      }
    });
    return res.status(200).send(cleanJsonResponse(response.text));
  } catch (e) { return res.status(500).json({}); }
}
