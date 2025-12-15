

// Initialize the Google GenAI client
// We use a fallback empty string to prevent the constructor from crashing if the env var is undefined during build/init.
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

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
  import { GoogleGenAI, Type } from "@google/genai";
import type { PetInfo, GeneratedName, ImageStyle, PetPersonalityResult, PetPersonality, NameStyle, PetType, PetGender, AdoptionCenter, Language } from '../types';
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

const nameMeaningSchema = {
    type: Type.OBJECT,
    properties: {
        meaning: {
            type: Type.STRING,
            description: 'A brief, fun meaning or origin of the provided pet name.',
        }
    },
    required: ["meaning"],
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

const quickFireSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.STRING,
        description: 'A single pet name.'
    }
};

const bioGenerationSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.STRING,
        description: "A short, witty, social-media-ready bio for the pet. It should be 1-2 sentences and should NOT include any hashtags."
    }
};

const horoscopeSchema = {
    type: Type.OBJECT,
    properties: {
        prediction: {
            type: Type.STRING,
            description: "A funny, mystical, slightly sassy 'vibe check' or horoscope prediction for the pet for the upcoming week."
        },
        luckyItem: {
            type: Type.STRING,
            description: "A random object or treat that is their lucky charm for the week."
        }
    },
    required: ["prediction", "luckyItem"]
};

const adoptionCenterSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Name of the adoption center or shelter." },
            mission: { type: Type.STRING, description: "A very brief (1-2 sentences) mission statement or description." },
            address: { type: Type.STRING, description: "The full address of the location." },
            phone: { type: Type.STRING, description: "Phone number." },
            website: { type: Type.STRING, description: "Website URL (must start with http)." }
        },
        required: ["name", "mission", "address", "phone", "website"]
    }
};


export const generatePetNames = async (petInfo: PetInfo, language: Language = 'en'): Promise<GeneratedName[]> => {
  const { type, gender, personality, style } = petInfo;

  // Persona Filter: Explicitly asking for "Latino Neutral" or "Native" conversational Spanish
  const langInstruction = language === 'es' 
    ? "OUTPUT MUST BE IN NATIVE, CONVERSATIONAL SPANISH (Latino Neutral). Do NOT translate English names literally. Provide names that sound natural to a native Spanish speaker. Use affectionate diminutives (e.g., 'Chispa', 'Canelo', 'Pelusa') if they fit. The 'Meaning' must be written in a fun, friendly tone, not a dictionary definition." 
    : "Output in English.";

  const prompt = `
    Generate a list of 10 creative, fun, and youthful pet names specifically tailored for a ${gender} ${type}.
    
    CRITICAL INSTRUCTION: The names MUST fit the specific animal type (${type}).
    - If it is a Lizard/Reptile: Include names related to dragons, scales, green, or mythology.
    - If it is a Rabbit: Include names related to hopping, ears, softness, or speed.
    - If it is a Fish: Include names related to water, fins, ocean, or bubbles.
    - If it is a Bird: Include names related to flying, wings, sky, or songs.
    
    Personality Context: The pet has a ${personality} personality.
    Style Preference: The desired style is "${style}". 
    
    Target Audience: The names should appeal to a Gen Z (13-28 years old) audience.
    
    ${langInstruction}
    
    For each name, provide a short, fun meaning. Do not repeat names from common lists. Be creative!
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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

  } catch (error) {
    console.error("Error generating pet names:", error);
    throw new Error("Failed to generate names. The model might be busy. Please try again!");
  }
};

export const generateNameOfTheDay = async (language: Language = 'en'): Promise<{ name: string; meaning: string }> => {
    const langInstruction = language === 'es' 
        ? "Output in NATIVE SPANISH. The meaning should be written in a warm, storytelling tone, as if a friend is explaining why the name is cool." 
        : "Output in English.";
    
    const prompt = `Generate one unique, fascinating, and creative pet name for the 'Name of the Day' feature. Provide a short, fun meaning or origin for it. Do not use the name 'Quibble'. ${langInstruction}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: nameOfTheDaySchema,
                temperature: 0.9,
            }
        });
        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("No response generated");
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating Name of the Day:", error);
        return { name: "Aura", meaning: language === 'es' ? "Una energía mágica que rodea a tu mascota, perfecta para alguien con mucha personalidad." : "A distinctive atmosphere or quality that seems to surround and be generated by a person, thing, or place." };
    }
};

export const getPetNameMeaning = async (name: string, language: Language = 'en'): Promise<string> => {
    const langInstruction = language === 'es' 
        ? "Output in NATIVE SPANISH. Use a conversational, friendly tone. Avoid stiff dictionary language. Use phrases like 'Este nombre es ideal para...' or 'Significa...'." 
        : "Output in English.";
    
    const prompt = `Provide a brief, interesting meaning or origin for the pet name "${name}". The tone should be positive, engaging, and fun. Blend factual etymology with creative, whimsical stories if the name is unique. ${langInstruction}`;
  
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              responseMimeType: 'application/json',
              responseSchema: nameMeaningSchema,
              temperature: 0.7,
          }
      });
  
      const jsonText = response.text?.trim();
      if (!jsonText) throw new Error("No response generated");
      const result = JSON.parse(jsonText);
      return result.meaning;
  
    } catch (error) {
      console.error(`Error getting meaning for "${name}":`, error);
      throw new Error(`Could not find a meaning for "${name}". Please try another name!`);
    }
  };

export const generatePetPersonality = async (quizAnswers: string[], language: Language = 'en'): Promise<PetPersonalityResult> => {
    const langInstruction = language === 'es' 
        ? "The title and description must be in NATIVE, SLANG-FILLED SPANISH. Use idioms like 'Travieso', 'Dormilón', 'Todo un personaje', 'Es un amor'. Make it sound like a fun personality test result from a magazine." 
        : "Output in English.";
        
    const prompt = `
        Based on these answers to a fun pet personality quiz, generate a personality profile.
        The answers describe the pet's likely behavior.
        The tone should be playful, fun, and aimed at a 13-28 year old audience.

        Quiz Answers:
        1. ${quizAnswers[0]}
        2. ${quizAnswers[1]}
        3. ${quizAnswers[2]}

        ${langInstruction}

        Based on these answers, generate a result in the specified JSON format.
        The 'title' should be a catchy, 2-3 word phrase.
        The 'description' should be a single, fun sentence.
        The 'keywords' must be selected from the provided enum lists to best match the overall vibe of the answers.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: personalityQuizSchema,
                temperature: 0.8
            }
        });
        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("No response generated");
        const result = JSON.parse(jsonText);

        const validPersonalities: PetPersonality[] = ['Playful', 'Calm', 'Mischievous', 'Elegant', 'Goofy', 'Brave'];
        const validStyles: NameStyle[] = ['Trending', 'Unique', 'Classic', 'Mythological', 'Nature-inspired', 'Funny'];

        if (!validPersonalities.includes(result.keywords.personality)) {
             result.keywords.personality = 'Playful';
        }
        if (!validStyles.includes(result.keywords.style)) {
            result.keywords.style = 'Unique';
        }

        return result;

    } catch (error) {
        console.error("Error generating pet personality:", error);
        throw new Error("Failed to analyze personality. The model might be busy. Please try again!");
    }
};

export const generateQuickFireList = async (style: NameStyle, petType: PetType, petGender: PetGender, language: Language = 'en'): Promise<string[]> => {
    const langInstruction = language === 'es' 
        ? "Output in NATIVE SPANISH. Avoid awkward literal translations. If the style is 'Funny', use culturally relevant funny names in Spanish (e.g., 'Gordo', 'Chilaquil', 'Firulais')." 
        : "Output in English.";
        
    const prompt = `Generate a list of 20 unique and creative pet names for a ${petGender} ${petType} in the "${style}" style. The names should be single words where possible. Do not repeat names. ${langInstruction}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: quickFireSchema,
                temperature: 0.9,
            }
        });
        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("No response generated");
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating quick fire list:", error);
        throw new Error(`Failed to generate names for the game. Please try again!`);
    }
};

export const generatePetBio = async (name: string, petType: PetType, personality: PetPersonality, language: Language = 'en'): Promise<string[]> => {
    // FILTER: Explicitly asking for social media slang in Spanish
    const langInstruction = language === 'es' 
        ? "OUTPUT MUST BE IN NATIVE, WITTY SPANISH (Latino/Gen Z style). Use terms like 'michi' (cat), 'lomito' (dog), 'karen' (owner). Be sarcastic, cute, or dramatic depending on the personality. Do not sound like a textbook." 
        : "Output in English.";
        
    const prompt = `Generate 4 short, witty, and fun social media bios (max 280 chars) for a ${petType} named ${name} who has a ${personality} personality. Ensure the behavior described is biologically appropriate for a ${petType} (e.g., fish swim, dogs wag tails, birds fly). Do not use hashtags. ${langInstruction}`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: bioGenerationSchema,
                temperature: 0.85,
            }
        });
        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("No response generated");
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating bio:", error);
        throw new Error("Failed to generate bios. Please try again.");
    }
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
             if (typeof reader.result === 'string') {
                // Remove the data:image/jpeg;base64, part
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error("Failed to convert file to base64"));
            }
        };
        reader.onerror = error => reject(error);
    });
};

export const editPetImage = async (base64Image: string, mimeType: string, prompt: string, style: ImageStyle): Promise<string> => {
    const fullPrompt = `Transform this pet image. ${prompt}. Style: ${style}. Keep the main pet recognizable but change the environment or accessories as requested.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: fullPrompt,
                    },
                ],
            },
        });

        // Extract image from response
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                }
            }
        }
        throw new Error("No image generated.");
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to generate image. Please try again.");
    }
};

export const generatePetHoroscope = async (sign: string, petType: string, name: string, language: Language = 'en'): Promise<{ prediction: string; luckyItem: string }> => {
    // FILTER: Explicitly asking for "Walter Mercado" style energy
    const langInstruction = language === 'es' 
        ? "Output in NATIVE SPANISH. Channel the energy of a dramatic, loving Latino astrologer (Walter Mercado style). Use words like 'amor', 'energía', 'cosas bellas'. Be funny but mystical." 
        : "Output in English.";

    const prompt = `Generate a fun weekly horoscope for a ${petType} named ${name} who is a ${sign}. Include a lucky item. Keep it lighthearted and funny. ${langInstruction}`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: horoscopeSchema,
                temperature: 0.9,
            }
        });
        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("No response generated");
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating horoscope:", error);
        throw new Error("Failed to read the stars.");
    }
};

export const findAdoptionCenters = async (location: string, language: Language = 'en'): Promise<AdoptionCenter[]> => {
    // FILTER: Practicality check. Addresses must remain in English for GPS, but Mission statement should be translated warmly.
    const langInstruction = language === 'es' 
        ? "The user is likely a Spanish speaker in the US. IMPORTANT: Keep the 'Name' and 'Address' in ENGLISH (so they can find it on a map/GPS). Only translate the 'Mission' and description into warm, inviting Spanish." 
        : "Output in English.";
        
    const prompt = `Find 3 real or plausible adoption centers or animal shelters near ${location}. Provide name, mission (short), address, phone, and website. If specific real data is unavailable, generate realistic placeholder data for the location. ${langInstruction}`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: adoptionCenterSchema,
                temperature: 0.5,
            }
        });
        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("No response generated");
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error finding adoption centers:", error);
        throw new Error("Could not find adoption centers.");
    }
};
