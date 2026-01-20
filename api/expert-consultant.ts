
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGemini, MODEL_TEXT } from './lib/common.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { message, systemInstruction } = req.body;
  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: message,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((c: any) => c.web)
      ?.map((c: any) => ({ uri: c.web.uri, title: c.web.title })) || [];

    return res.status(200).json({
      text: response.text,
      sources
    });
  } catch (e) { return res.status(500).json({ text: "Consultant error.", sources: [] }); }
}
