import type { PetInfo, ImageStyle, PetType, PetGender, Language, ChatMessage, NameStyle, PetPersonality } from '../types';
import { getDeviceId } from '../utils/device';

/**
 * NOTE: Initializing GoogleGenAI directly in the browser with your API Key is insecure and 
 * will crash if the key is not prefixed with VITE_. 
 * 
 * To keep your key safe and use rate-limiting, all prompts and logic are handled 
 * by the server in the /api folder.
 */

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-device-id': getDeviceId()
});

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API Error');
    return data;
};

export const generatePetNames = async (petInfo: PetInfo, language: Language = 'en') => {
    const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ petInfo, language })
    });
    const data = await handleResponse(response);
    return data.names || [];
};

export const generatePetBio = async (name: string, petType: PetType, personality: PetPersonality, language: Language = 'en') => {
    const response = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, petType, personality, language })
    });
    const data = await handleResponse(response);
    return data.bios || [];
};

export const findAdoptionCenters = async (location: string, language: Language = 'en') => {
    const response = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ query: `Find real pet adoption centers near ${location}.`, language })
    });
    const data = await handleResponse(response);
    return data.results || [];
};

export const findPetHotels = async (location: string, language: Language = 'en') => {
    const response = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ query: `Find top-rated pet hotels or boarding centers in ${location}.`, language })
    });
    const data = await handleResponse(response);
    return data.results || [];
};

export const editPetImage = async (base64Image: string, mimeType: string, prompt: string, style: ImageStyle) => {
    const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ base64Image, mimeType, prompt, style })
    });
    const data = await handleResponse(response);
    return data.imageUrl;
};

export const generatePetPersonality = async (quizAnswers: string[], language: Language = 'en') => {
    const response = await fetch('/api/analyze-personality', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ quizAnswers, language })
    });
    return await handleResponse(response);
};

export const generateQuickFireList = async (style: NameStyle, petType: PetType, petGender: PetGender, language: Language = 'en') => {
    const response = await fetch('/api/quick-fire-names', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ style, petType, petGender, language })
    });
    const data = await handleResponse(response);
    return data.names || [];
};

export const translatePetName = async (name: string, targetLanguage: string) => {
    const response = await fetch('/api/translate-name', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, targetLanguage })
    });
    return await handleResponse(response);
};

export const generatePetHoroscope = async (sign: string, petType: string, name: string, language: Language = 'en') => {
    const response = await fetch('/api/pet-horoscope', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ sign, petType, name, language })
    });
    return await handleResponse(response);
};

export const getPetConsultantResponse = async (history: ChatMessage[], message: string, language: Language = 'en', systemInstruction: string) => {
    const response = await fetch('/api/expert-consultant', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, systemInstruction, language })
    });
    return await handleResponse(response);
};

export const generateNameOfTheDay = async (language: Language = 'en') => {
    const response = await fetch('/api/name-of-the-day', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ language })
    });
    return await handleResponse(response);
};

export const getPetNameMeaning = async (name: string, language: Language = 'en') => {
    const response = await fetch('/api/name-meaning', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, language })
    });
    const data = await handleResponse(response);
    return data.meaning || '';
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};