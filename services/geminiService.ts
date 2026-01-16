
import { GoogleGenAI, Type } from "@google/genai";
import type { PetInfo, GeneratedName, ImageStyle, Language, ChatMessage } from '../types';

const nameGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        names: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    style: { type: Type.STRING }
                },
                required: ["name", "meaning", "style"],
            }
        }
    }
};

const translatorSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            language: { type: Type.STRING },
            spelling: { type: Type.STRING },
            meaning: { type: Type.STRING },
            flag: { type: Type.STRING }
        },
        required: ["language", "spelling", "meaning", "flag"]
    }
};

const consultantSchema = {
    type: Type.OBJECT,
    properties: {
        text: { type: Type.STRING, description: "2-3 sentence advice response" },
        url: { type: Type.STRING, description: "A valid, relevant URL for more information" }
    },
    required: ["text", "url"]
};

const cleanJsonString = (str: string): string => {
    if (!str) return "{}";
    return str.replace(/```json\n?|```/g, '').trim();
};

export const generatePetNames = async (petInfo: PetInfo, language: Language = 'en'): Promise<GeneratedName[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const { type, gender, personality, style } = petInfo;
    const prompt = `Generate 8 creative and fitting pet names for a ${gender} ${type}. 
    Vibe: ${personality}. 
    Style: ${style}. 
    For each name, provide:
    1. The name itself.
    2. A brief meaning or origin.
    Keep meanings concise. Do not include any extra commentary. Respond in ${language}.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: "You are a professional pet naming expert. You return strictly valid JSON data.",
                responseMimeType: 'application/json',
                responseSchema: nameGenerationSchema,
            }
        });

        const data = JSON.parse(cleanJsonString(response.text || '{"names":[]}'));
        const names = data.names || [];
        return Array.isArray(names) ? names.map((n: any, i: number) => ({
            id: `gen-${Date.now()}-${i}`,
            name: n.name || "Unknown",
            meaning: n.meaning || "A beautiful name for your pet.",
            style: n.style || style
        })) : [];
    } catch (error) {
        console.error("Name generation failed:", error);
        throw new Error("Failed to generate names.");
    }
};

export const editPetImage = async (base64Image: string, mimeType: string, prompt: string, style: ImageStyle): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType: mimeType } },
                    { text: `Modify this specific pet in the image to be in this scene: ${prompt}. Visual Style: ${style}. Maintain the pet's core features but change the environment or outfit. Wholesome content only.` }
                ]
            },
        });
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image generated.");
    } catch (error: any) {
        throw new Error("Failed to generate image.");
    }
};

export const getPetConsultantResponse = async (history: ChatMessage[], message: string, language: Language = 'en'): Promise<{text: string, url: string}> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: contents,
            config: { 
                systemInstruction: "You are a world-class pet consultant. Return JSON with 'text' and 'url'.",
                responseMimeType: "application/json",
                responseSchema: consultantSchema
            }
        });
        return JSON.parse(cleanJsonString(response.text || '{"text":"I can only help with pet-related questions.","url":""}'));
    } catch (error) {
        throw new Error("Chat failed.");
    }
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const translatePetName = async (name: string, language: Language = 'en') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the pet name "${name}" into 10 diverse global languages. Include a flag emoji, the language name, the spelling, and a brief meaning.`,
        config: { 
            responseMimeType: 'application/json',
            responseSchema: translatorSchema
        }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const generatePetBio = async (name: string, petType: string, personality: string, language: Language = 'en') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate exactly 4 fun social media bios for a pet. Name: ${name || "Your Pet"}. Type: ${petType}. Vibe: ${personality}. Strictly plain text strings, NO emojis or art symbols. Language: ${language}.`,
        config: { 
            responseMimeType: 'application/json',
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const findPetHotels = async (location: string, language: Language = 'en') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Top rated pet hotels in ${location}. Return JSON array of objects with name, summary, address, phone, website.`,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const generateNameOfTheDay = async (language: Language = 'en') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const dateStr = new Date().toDateString();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Pick one unique trending pet name for today, ${dateStr}. Return JSON: {"name": "...", "meaning": "..."}`,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const getPetNameMeaning = async (name: string, language: Language = 'en') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Meaning of pet name "${name}". Return JSON: {"meaning": "..."}`,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || '{"meaning":"Unknown"}')).meaning;
};

export const generatePetPersonality = async (answers: string[], language: Language = 'en') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze behavior: ${answers.join(',')}. Return JSON object with title, description, and keywords (personality and style).`,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const generateQuickFireList = async (style: string, type: string, gender: string, language: Language = 'en') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `20 ${style} names for ${gender} ${type}. Return JSON array of strings.`,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const findAdoptionCenters = async (location: string, language: Language = 'en') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Shelters in ${location}. Return JSON array with name, mission, address, phone, website.`,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const generatePetHoroscope = async (sign: string, type: string, name: string, language: Language = 'en') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Horoscope for ${name} (${sign}). Return JSON: {"prediction": "...", "luckyItem": "..."}`,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};
