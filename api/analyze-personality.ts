
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGemini, MODEL_TEXT, cleanJsonResponse } from './lib/common.js';
import { Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { quizAnswers, language } = req.body;
  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Based on these traits: ${quizAnswers.join(', ')}, describe the pet's personality in ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            keywords: {
              type: Type.OBJECT,
              properties: {
                personality: { type: Type.STRING },
                style: { type: Type.STRING }
              }
            }
          }
        }
      }
    });
    return res.status(200).send(cleanJsonResponse(response.text));
  } catch (e) { return res.status(500).json({}); }
}
