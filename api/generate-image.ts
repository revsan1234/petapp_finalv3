
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getGemini, verifyTurnstile, checkGlobalMonthlyCap, incrementGlobalMonthlyCap,
  getKV, MODEL_IMAGE, logRequest
} from './lib/common.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  const deviceId = req.headers['x-device-id'] as string || 'unknown';
  const turnstileToken = req.headers['x-turnstile-token'] as string;

  if (req.method !== 'POST') return res.status(405).end();

  try {
    // 1. Bot Check
    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      logRequest('generate-image', deviceId, 401, 'BOT_FAIL');
      return res.status(401).json({ errorCode: 'BOT_VERIFICATION_FAILED', message: 'Bot protection failed.' });
    }

    // 2. Monthly Budget Check
    if (await checkGlobalMonthlyCap()) {
      logRequest('generate-image', deviceId, 403, 'GLOBAL_CAP');
      return res.status(403).json({ errorCode: 'GLOBAL_CAP_REACHED', message: 'Studio at monthly capacity.' });
    }

    // 3. Atomic Daily Limit (1 image per 24 hours per device)
    const kv = await getKV();
    const dailyKey = `daily:image:${deviceId}`;
    let lockAcquired = true;

    if (kv) {
      const result = await kv.set(dailyKey, '1', { NX: true, EX: 86400 });
      lockAcquired = result !== null;
    }

    if (!lockAcquired) {
      logRequest('generate-image', deviceId, 429, 'LIMIT_REACHED');
      return res.status(429).json({ errorCode: 'LIMIT_REACHED', message: 'Daily limit reached.' });
    }

    // 4. Generate Image via Gemini
    const { base64Image, mimeType, prompt, style } = req.body;
    const ai = getGemini();

    const response = await ai.models.generateContent({
      model: MODEL_IMAGE,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: `Edit this pet image to show: ${prompt}. Apply a high-quality ${style} style.` }
        ]
      }
    });

    let outputUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        outputUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    if (!outputUrl) throw new Error("Gemini error");

    // 5. Success: Increment budget counter
    await incrementGlobalMonthlyCap();

    logRequest('generate-image', deviceId, 200, '-', MODEL_IMAGE, Date.now() - startTime);
    return res.status(200).json({ imageUrl: outputUrl });

  } catch (error: any) {
    // If the actual AI call failed, release the 1-per-day lock so they can try again
    const kv = await getKV();
    if (kv) await kv.del(`daily:image:${deviceId}`);

    const status = error?.status === 429 ? 503 : 502;
    logRequest('generate-image', deviceId, status, 'API_ERROR');

    return res.status(status).json({
      message: error?.status === 429 ? "Our artist is busy—try again in a minute." : "Temporary magic glitch—try again."
    });
  }
}
