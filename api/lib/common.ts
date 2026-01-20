import { GoogleGenAI } from "@google/genai";
import { createClient } from "redis";

// 1. Configuration - Change these if you want to swap AI models
export const MODEL_IMAGE = 'gemini-2.5-flash-image';
export const MODEL_TEXT = 'gemini-3-flash-preview';

// 2. Initialize Redis (Database for limits)
let redisClient: any = null;
export const getKV = async () => {
  if (!process.env.REDIS_URL) return null;
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
  }
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
};

// 3. Initialize Gemini (This keeps your API Key hidden on the server)
// Rule: obtain API key from process.env.API_KEY
export const getGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) throw new Error("Missing Gemini API Key");
  return new GoogleGenAI({ apiKey });
};

/**
 * Standardized JSON Cleanup for AI Responses
 */
export function cleanJsonResponse(text: string | undefined): string {
  if (!text) return '{}';
  return text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
}

/**
 * Standardized Logging for Vercel Log Streams
 */
export const logRequest = (endpoint: string, deviceId: string, status: number, errorCode: string = '-', model: string = '-', latency: number = 0) => {
  const deviceHash = deviceId.substring(0, 8);
  console.info(`[${new Date().toISOString()}] [${endpoint}] [${deviceHash}] [${status}] [${errorCode}] [${model}] [${latency}ms]`);
};

/**
 * Bot Protection: Verifies the Turnstile token with Cloudflare
 */
export async function verifyTurnstile(token: string | null) {
  if (!token || !process.env.TURNSTILE_SECRET_KEY) return true; // Fail open if no secret set

  const formData = new URLSearchParams();
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY);
  formData.append('response', token);

  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const outcome = await result.json();
    return outcome.success;
  } catch (e) {
    return false;
  }
}

/**
 * Global Budget Protection: Prevents spending more than ~$100/month
 */
export async function checkGlobalMonthlyCap() {
  try {
    const kv = await getKV();
    if (!kv) return false;
    const monthKey = `global:imagecount:${new Date().toISOString().substring(0, 7)}`;
    const count = await kv.get(monthKey);
    return parseInt(count || '0') >= 2000;
  } catch (e) {
    return false;
  }
}

export async function incrementGlobalMonthlyCap() {
  try {
    const kv = await getKV();
    if (!kv) return;
    const monthKey = `global:imagecount:${new Date().toISOString().substring(0, 7)}`;
    await kv.incr(monthKey);
  } catch (e) { }
}