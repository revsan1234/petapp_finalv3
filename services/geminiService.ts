import { GoogleGenAI, Type } from "@google/genai";
import type { PetInfo, GeneratedName, ImageStyle, PetPersonalityResult, PetPersonality, NameStyle, PetType, PetGender, AdoptionCenter, Language, ChatMessage } from '../types';

// Hard requirement: obtains API key exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Export a helper to check validity without throwing, for UI states
export const hasValidApiKey = (): boolean => {
    return !!(process.env.API_KEY && process.env.API_KEY.length > 0);
};

const nameGenerationSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: 'The suggested pet name.',
            },
            meaning: {
                type: Type.STRING,
                description: 'A brief, fun meaning or origin of the name.',
            },
            style: {
                type: Type.STRING,
                description: 'The style category of the name (e.g., Trending, Funny).',
            }
        },
        required: ["name", "meaning", "style"],
    }
};

const nameOfTheDaySchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: 'The single, unique pet name.',
        },
        meaning: {
            type: Type.STRING,
            description: 'A brief, fun meaning or origin of the name.',
        }
    },
    required: ["name", "meaning"],
};

const personalityQuizSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A fun, creative, and catchy title for the pet's personality profile."
        },
        description: {
            type: Type.STRING,
            description: "A short, one-sentence, playful description of this personality type."
        },
        keywords: {
            type: Type.OBJECT,
            properties: {
                personality: {
                    type: Type.STRING,
                    description: "The single best-fitting personality keyword from this list: Playful, Calm, Mischievous, Elegant, Goofy, Brave.",
                    enum: ['Playful', 'Calm', 'Mischievous', 'Elegant', 'Goofy', 'Brave']
                },
                style: {
                    type: Type.STRING,
                    description: "The single best-fitting name style keyword from this list: Trending, Unique, Classic, Mythological, Nature-inspired, Funny.",
                    enum: ['Trending', 'Unique', 'Classic', 'Mythological', 'Nature-inspired', 'Funny']
                }
            },
            required: ["personality", "style"]
        }
    },
    required: ["title", "description", "keywords"]
};

export const generatePetNames = async (petInfo: PetInfo, language: Language = 'en'): Promise<GeneratedName[]> => {
  const { type, gender, personality, style } = petInfo;

  let langInstruction = "Output in English.";
  if (language === 'es') {
    langInstruction = "OUTPUT MUST BE IN NATIVE, CONVERSATIONAL SPANISH (Latino Neutral). Do NOT translate English names literally. Provide names that sound natural to a native Spanish speaker.";
  } else if (language === 'fr') {
    langInstruction = "OUTPUT MUST BE IN NATIVE, MODERN FRENCH. Suggest names that are currently popular or culturally relevant in France/Quebec. Do NOT translate English names literally.";
  }

  const prompt = `
    Generate a list of 10 creative, fun pet names for a ${gender} ${type}.
    Personality: ${personality}
    Style: ${style}
    ${langInstruction}
    For each name, provide a short, fun meaning.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: nameGenerationSchema,
            temperature: 1.1,
        }
    });

    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("No response generated");
    const names = JSON.parse(jsonText);
    return names.map((name: any, index: number) => ({ ...name, id: `${Date.now()}-${Math.random()}-${index}` }));

  } catch (error: any) {
    console.error("Error generating pet names:", error);
    throw new Error(error.message || "Failed to generate names.");
  }
};

export const generatePetBio = async (name: string, petType: PetType, personality: PetPersonality, language: Language = 'en'): Promise<string[]> => {
    let langInstruction = "Output in English.";
    if (language === 'es') {
        langInstruction = "OUTPUT MUST BE IN NATIVE, WITTY SPANISH (Latino/Gen Z style). Use terms like 'michi' (cat), 'lomito' (dog). Do not sound like a textbook.";
    } else if (language === 'fr') {
        langInstruction = "OUTPUT MUST BE IN NATIVE, WITTY CONVERSATIONAL FRENCH. Use terms like 'toutou' (dog), 'minou' (cat), 'mimi'. Make it sound like a social media post for a pet.";
    }
        
    const prompt = `Generate 4 short, witty social media bios for a ${petType} named ${name} who is ${personality}. Do not use hashtags. ${langInstruction}`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } },
                temperature: 0.85,
            }
        });
        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("No response generated");
        return JSON.parse(jsonText);
    } catch (error: any) {
        console.error("Error generating bio:", error);
        throw new Error(error.message || "Failed to generate bios.");
    }
};

export const generateNameOfTheDay = async (language: Language = 'en'): Promise<{ name: string; meaning: string }> => {
    const prompt = `Generate one unique pet name and fun meaning for today. Output in ${language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'English'}.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: nameOfTheDaySchema,
            }
        });
        const jsonText = response.text?.trim();
        return jsonText ? JSON.parse(jsonText) : { name: "Aura", meaning: "A magic energy." };
    } catch (error) {
        return { name: "Aura", meaning: "A magic energy." };
    }
};

export const getPetNameMeaning = async (name: string, language: Language = 'en'): Promise<string> => {
    const prompt = `Explain the fun meaning/origin of the pet name "${name}" in ${language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'English'}.`;
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
              responseMimeType: 'application/json',
              responseSchema: { type: Type.OBJECT, properties: { meaning: { type: Type.STRING } }, required: ["meaning"] }
          }
      });
      return JSON.parse(response.text || '{"meaning":""}').meaning;
    } catch (error: any) {
      throw new Error("Could not find meaning.");
    }
};

export const generatePetPersonality = async (quizAnswers: string[], language: Language = 'en'): Promise<PetPersonalityResult> => {
    const prompt = `Analyze these quiz answers: ${quizAnswers.join(', ')}. Generate a pet personality profile in ${language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'English'}.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: personalityQuizSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error: any) {
        throw new Error("Failed to analyze personality.");
    }
};

export const generateQuickFireList = async (style: NameStyle, petType: PetType, petGender: PetGender, language: Language = 'en'): Promise<string[]> => {
    const prompt = `List 20 ${style} names for a ${petGender} ${petType}. Output in ${language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'English'}.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        return JSON.parse(response.text || '[]');
    } catch (error: any) {
        throw new Error("Failed to generate names.");
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

export const editPetImage = async (base64Image: string, mimeType: string, prompt: string, style: ImageStyle): Promise<string> => {
    const fullPrompt = `Transform this pet image. ${prompt}. Style: ${style}.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType: mimeType } },
                    { text: fullPrompt }
                ]
            },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
        throw new Error("No image generated.");
    } catch (error: any) {
        throw new Error(error.message || "Failed to generate image.");
    }
};

export const translatePetName = async (name: string, targetLanguage: string): Promise<{ translation: string; pronunciation: string }> => {
    const prompt = `How would the pet name "${name}" be written/spelled and pronounced in ${targetLanguage}? Return JSON.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            translation: { type: Type.STRING, description: "The name in the target language's script/alphabet." },
            pronunciation: { type: Type.STRING, description: "Phonetic pronunciation guide." }
        },
        required: ["translation", "pronunciation"]
    };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json', responseSchema: schema }
        });
        return JSON.parse(response.text || '{}');
    } catch (error: any) {
        throw new Error("Failed to translate.");
    }
};

export const generatePetHoroscope = async (sign: string, petType: string, name: string, language: Language = 'en'): Promise<{ prediction: string; luckyItem: string }> => {
    const prompt = `Weekly horoscope for ${petType} ${name} who is ${sign}. Output in ${language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'English'}.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: { type: Type.OBJECT, properties: { prediction: { type: Type.STRING }, luckyItem: { type: Type.STRING } }, required: ["prediction", "luckyItem"] }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error: any) {
        throw new Error("Failed reading stars.");
    }
};

export const findAdoptionCenters = async (location: string, language: Language = 'en'): Promise<AdoptionCenter[]> => {
    const prompt = `Find 3 adoption centers near ${location}. Mission in ${language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'English'}.`;
    const schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, mission: { type: Type.STRING }, address: { type: Type.STRING }, phone: { type: Type.STRING }, website: { type: Type.STRING } }, required: ["name", "mission", "address", "phone", "website"] } };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json', responseSchema: schema }
        });
        return JSON.parse(response.text || '[]');
    } catch (error: any) {
        throw new Error("Could not find centers.");
    }
};

export const getPetConsultantResponse = async (history: ChatMessage[], message: string, language: Language = 'en', systemInstruction: string): Promise<string> => {
    try {
        const contents = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));
        
        contents.push({ role: 'user', parts: [{ text: message }] });

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        
        return response.text || "";
    } catch (error: any) {
        console.error("Consultant Error:", error);
        throw new Error("Expert is currently busy. Please try again later.");
    }
};