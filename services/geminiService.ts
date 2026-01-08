import { QuotaError } from "../types";
import type { PetInfo, GeneratedName, ImageStyle, PetPersonalityResult, PetPersonality, NameStyle, PetType, PetGender, AdoptionCenter, Language, ChatMessage } from '../types';

export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server';
  let deviceId = localStorage.getItem('nmp_device_id');
  if (!deviceId) {
    deviceId = 'nmp_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('nmp_device_id', deviceId);
  }
  return deviceId;
};

const getBaseHeaders = () => ({
    'Content-Type': 'application/json',
    'X-Device-ID': getDeviceId()
});

async function handleApiResponse(response: Response) {
    if (response.status === 429) throw new QuotaError("Daily limit reached", 'LIMIT_REACHED');
    if (response.status === 403) throw new QuotaError("Monthly capacity reached", 'GLOBAL_CAP_REACHED');
    if (response.status === 401) throw new QuotaError("Bot verification failed", 'RATE_LIMITED');
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Magic glitch—please try again.");
    }
    return response.json();
}

const callApi = (action: string, body: any, extraHeaders = {}) => fetch(`/api?action=${action}`, {
    method: 'POST',
    headers: { ...getBaseHeaders(), ...extraHeaders },
    body: JSON.stringify(body)
});

export const hasValidApiKey = () => true;

export const generatePetNames = async (petInfo: PetInfo, language: Language = 'en') => {
    const res = await callApi('generate-names', { petInfo, language });
    const data = await handleApiResponse(res);
    return data.names;
};

export const generatePetBio = async (name: string, petType: PetType, personality: PetPersonality, language: Language = 'en') => {
    const res = await callApi('generate-bio', { name, petType, personality, language });
    const data = await handleApiResponse(res);
    return data.bios;
};

export const generateNameOfTheDay = async (language: Language = 'en') => {
    const res = await callApi('name-of-the-day', { language });
    return handleApiResponse(res);
};

export const getPetNameMeaning = async (name: string, language: Language = 'en') => {
    const res = await callApi('expert-consultant', { message: `What is the meaning of the pet name "${name}" in ${language}?`, systemInstruction: "Provide 1 short sentence." });
    const data = await handleApiResponse(res);
    return data.text;
};

export const generatePetPersonality = async (quizAnswers: string[], language: Language = 'en') => {
    const res = await callApi('analyze-personality', { quizAnswers, language });
    return handleApiResponse(res);
};

export const generateQuickFireList = async (style: NameStyle, petType: PetType, petGender: PetGender, language: Language = 'en') => {
    const res = await callApi('quick-fire-names', { style, petType, petGender, language });
    const data = await handleApiResponse(res);
    return data.names;
};

export const editPetImage = async (base64Image: string, mimeType: string, prompt: string, style: ImageStyle, turnstileToken: string) => {
    const res = await callApi('generate-image', { base64Image, mimeType, prompt, style }, { 'X-Turnstile-Token': turnstileToken });
    const data = await handleApiResponse(res);
    return data.imageUrl;
};

export const translatePetName = async (name: string, targetLanguage: string) => {
    const res = await callApi('translate-name', { name, targetLanguage });
    return handleApiResponse(res);
};

export const generatePetHoroscope = async (sign: string, petType: string, name: string, language: Language = 'en') => {
    const res = await callApi('pet-horoscope', { sign, petType, name, language });
    return handleApiResponse(res);
};

export const findAdoptionCenters = async (location: string, language: Language = 'en') => {
    const res = await callApi('search-grounding', { query: `Find 3 pet adoption centers near ${location}`, language });
    const data = await handleApiResponse(res);
    return data.results;
};

export const findPetHotels = async (location: string, language: Language = 'en') => {
    const res = await callApi('search-grounding', { query: `Find 3 pet hotels or boarding facilities near ${location}`, language });
    const data = await handleApiResponse(res);
    return data.results;
};

export const getPetConsultantResponse = async (history: ChatMessage[], message: string, language: Language = 'en', systemInstruction: string) => {
    const res = await callApi('expert-consultant', { history, message, language, systemInstruction });
    return handleApiResponse(res);
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};