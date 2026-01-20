
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGemini, getKV, MODEL_TEXT, logRequest, cleanJsonResponse } from './lib/common.js';
import { Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  const deviceId = req.headers['x-device-id'] as string || 'unknown';

  if (req.method !== 'POST') return res.status(405).end();

  try {
    // Anti-spam: max 1 request every 5 seconds
    const kv = await getKV();
    const rlKey = `rl:names:${deviceId}`;
    if (kv) {
      if (await kv.get(rlKey)) return res.status(429).json({ message: "Slow down!" });
      await kv.set(rlKey, '1', { EX: 5 });
    }

    const { petInfo, language } = req.body;
    const ai = getGemini();

    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Suggest exactly 6 unique pet names for a ${petInfo.gender} ${petInfo.type} with a ${petInfo.personality} personality in ${language}. Style: ${petInfo.style}. Provide name and meaning. Response must be in ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                },
                required: ["id", "name", "meaning"]
              }
            }
          }
        }
      }
    });

    logRequest('generate-names', deviceId, 200, '-', MODEL_TEXT, Date.now() - startTime);
    return res.status(200).send(cleanJsonResponse(response.text));
  } catch (error) {
    return res.status(500).json({ names: [] });
  }
}
