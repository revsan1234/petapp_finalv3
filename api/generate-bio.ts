
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGemini, getKV, MODEL_TEXT, cleanJsonResponse } from './lib/common.js';
import { Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const deviceId = req.headers['x-device-id'] as string || 'unknown';
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const kv = await getKV();
    const rlKey = `rl:bio:${deviceId}`;
    if (kv) {
      if (await kv.get(rlKey)) return res.status(429).json({ message: "Wait 5s" });
      await kv.set(rlKey, '1', { EX: 5 });
    }

    const { name, petType, personality, language } = req.body;
    const ai = getGemini();

    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Write 3 short, fun social media bios for a ${petType} named ${name} who is ${personality}. Language: ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { bios: { type: Type.ARRAY, items: { type: Type.STRING } } }
        }
      }
    });

    return res.status(200).send(cleanJsonResponse(response.text));
  } catch (e) {
    return res.status(500).json({ bios: [] });
  }
}
