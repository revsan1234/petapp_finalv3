import { GoogleGenAI, Type } from "@google/genai";
import { QuotaError } from "../types";
import type { PetInfo, ImageStyle, PetType, PetGender, Language, ChatMessage, NameStyle, PetPersonality } from '../types';

// Simple Anonymous Tracking ID
const getDeviceId = () => {
    if (typeof window === 'undefined') return 'server';
    let id = localStorage.getItem('nmp_device_id');
    if (!id) {
        id = 'nmp_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        localStorage.setItem('nmp_device_id', id);
    }
    return id;
};

// Detect if we have a client-side API key (standard for the Preview tool)
const isPreviewEnv = !!process.env.API_KEY;

async function handleApiResponse(response: Response) {
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.error("Critical: API response was not JSON:", text);
        throw new Error("Invalid response from server. Please try again.");
    }

    if (!response.ok) {
        console.error("API Error Response:", response.status, data);
        // Explicitly handle the 429 Limit reached error for the UI
        if (response.status === 429) throw new QuotaError(data.message || "Limit reached", 'LIMIT_REACHED');
        throw new Error(data.message || "Request failed.");
    }
    return data;
}

const directGeminiCall = async (action: string, body: any) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    switch (action) {
        case 'generate-names': {
            const { petInfo, language } = body;
            const res = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Suggest exactly 6 unique names for a ${petInfo.gender} ${petInfo.type} (${petInfo.personality}) in ${language}. Style: ${petInfo.style}.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            names: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, meaning: { type: Type.STRING } },
                                    required: ["id", "name", "meaning"]
                                }
                            }
                        }
                    }
                }
            });
            return JSON.parse(res.text);
        }
        case 'name-of-the-day': {
            const res = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Suggest one random unique pet name and its meaning.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, meaning: { type: Type.STRING } } }
                }
            });
            return JSON.parse(res.text);
        }
        case 'expert-consultant': {
            const res = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: body.message,
                config: { systemInstruction: body.systemInstruction, tools: [{ googleSearch: {} }] }
            });
            return { text: res.text, sources: [] };
        }
        default:
            return { message: "Action limited in preview mode", names: [], results: [] };
    }
};

const callApi = async (action: string, body: any) => {
    if (isPreviewEnv) {
        return await directGeminiCall(action, body);
    }

    const res = await fetch(`/api?action=${action}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Device-Id': getDeviceId() // Crucial for limit tracking
        },
        body: JSON.stringify(body)
    });
    return await handleApiResponse(res);
};

export const hasValidApiKey = () => true;

export const generatePetNames = async (petInfo: PetInfo, language: Language = 'en') => {
    const data = await callApi('generate-names', { petInfo, language });
    return data.names || [];
};

export const generatePetBio = async (name: string, petType: PetType, personality: PetPersonality, language: Language = 'en') => {
    const data = await callApi('generate-bio', { name, petType, personality, language });
    return data.bios || [];
};

export const generateNameOfTheDay = async (language: Language = 'en') => {
    return await callApi('name-of-the-day', { language });
};

export const getPetNameMeaning = async (name: string, language: Language = 'en') => {
    const data = await callApi('expert-consultant', { 
        message: `Meaning and origin of "${name}" for a pet in ${language}. Short.`, 
        systemInstruction: "Be concise." 
    });
    return data.text;
};

export const generatePetPersonality = async (quizAnswers: string[], language: Language = 'en') => {
    return await callApi('analyze-personality', { quizAnswers, language });
};

export const generateQuickFireList = async (style: NameStyle, petType: PetType, petGender: PetGender, language: Language = 'en') => {
    const data = await callApi('quick-fire-names', { style, petType, petGender, language });
    return data.names || [];
};

export const editPetImage = async (base64Image: string, mimeType: string, prompt: string, style: ImageStyle) => {
    const data = await callApi('generate-image', { base64Image, mimeType, prompt, style });
    return data.imageUrl;
};

export const translatePetName = async (name: string, targetLanguage: string) => {
    return await callApi('translate-name', { name, targetLanguage });
};

export const generatePetHoroscope = async (sign: string, petType: string, name: string, language: Language = 'en') => {
    return await callApi('pet-horoscope', { sign, petType, name, language });
};

export const findAdoptionCenters = async (location: string, language: Language = 'en') => {
    const data = await callApi('search-grounding', { query: `pet adoption near ${location}`, language });
    return data.results || [];
};

export const findPetHotels = async (location: string, language: Language = 'en') => {
    const data = await callApi('search-grounding', { query: `pet hotels near ${location}`, language });
    return data.results || [];
};

export const getPetConsultantResponse = async (history: ChatMessage[], message: string, language: Language = 'en', systemInstruction: string) => {
    return await callApi('expert-consultant', { history, message, language, systemInstruction });
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};