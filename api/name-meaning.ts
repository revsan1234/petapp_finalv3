
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGemini, MODEL_TEXT, cleanJsonResponse } from './lib/common.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name, language } = req.body;
  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Meaning and origin of the pet name "${name}" in ${language}.`,
    });
    return res.status(200).json({ meaning: cleanJsonResponse(response.text) });
  } catch (e) { return res.status(500).json({ meaning: '' }); }
}
