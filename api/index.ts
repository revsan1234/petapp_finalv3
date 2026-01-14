// v2.5.0-forced-refresh
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { kv } from "@vercel/kv";

const getGemini = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

async function verifyTurnstile(token: string | null) {
  if (!token || !process.env.TURNSTILE_SECRET_KEY) return false;
  const formData = new URLSearchParams();
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY);
  formData.append('response', token);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData, method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const outcome = await res.json();
    return outcome.success;
  } catch { return false; }
}

async function checkAndIncrementGlobalCap() {
  const monthKey = `global:imagecount:${new Date().toISOString().substring(0, 7)}`;
  const count = (await kv.get<number>(monthKey)) || 0;
  if (count >= 2000) return true; 
  await kv.incr(monthKey);
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { action } = req.query;
  const deviceId = req.headers['x-device-id'] as string || 'unknown';
  const ai = getGemini();

  try {
    switch (action) {
      case 'generate-image': {
        const turnstileToken = req.headers['x-turnstile-token'] as string;
        if (!(await verifyTurnstile(turnstileToken))) return res.status(401).json({ message: "Bot check failed" });
        if (await checkAndIncrementGlobalCap()) return res.status(403).json({ message: "Monthly limit reached" });
        
        const dailyKey = `daily:image:${deviceId}`;
        if (!(await kv.set(dailyKey, '1', { nx: true, ex: 86400 }))) return res.status(429).json({ message: "1 image per day!" });

        const { base64Image, mimeType, prompt, style } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { 
            parts: [
              { inlineData: { data: base64Image, mimeType } }, 
              { text: `Edit this pet image to show: ${prompt}. Style: ${style}. Wholesome content only.` }
            ] 
          }
        });

        let outputUrl = '';
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    outputUrl = `data:image/png;base64,${part.inlineData.data}`;
                    break;
                }
            }
        }
        return res.status(200).json({ imageUrl: outputUrl });
      }

      case 'generate-names': {
        const { petInfo, language } = req.body;
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Suggest 6 names for a ${petInfo.gender} ${petInfo.type} (${petInfo.personality}) in ${language}. Style: ${petInfo.style}.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                names: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, meaning: { type: Type.STRING }, style: { type: Type.STRING } }
                  }
                }
              }
            }
          }
        });
        return res.status(200).send(response.text);
      }

      default: return res.status(400).json({ message: "Unknown action" });
    }
  } catch (e: any) {
    console.error("Backend Error:", e);
    return res.status(500).json({ message: "Magic glitch—try again!" });
  }
}