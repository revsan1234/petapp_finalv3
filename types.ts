
export type PetType = 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Rabbit' | 'Hamster' | 'Lizard';
export type PetKind = 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'lizard' | 'ferret';
export type PetGender = 'Male' | 'Female' | 'Any';
export type PetPersonality = 'Playful' | 'Calm' | 'Mischievous' | 'Elegant' | 'Goofy' | 'Brave';
export type NameStyle = 'Trending' | 'Unique' | 'Classic' | 'Mythological' | 'Nature-inspired' | 'Funny';
export type ImageStyle = 'Photorealistic' | 'Anime' | 'Cartoon';
export type Language = 'en' | 'es';

export interface PetInfo {
  type: PetType;
  gender: PetGender;
  personality: PetPersonality;
  style: NameStyle;
}

export interface GeneratedName {
  id: string;
  name: string;
  meaning: string;
  style: string;
}

export interface QuizAnswer {
  text: string;
  value: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

export interface PetPersonalityResult {
  title: string;
  description: string;
  // These will map to PetPersonality and NameStyle
  keywords: {
    personality: PetPersonality;
    style: NameStyle;
  }
}

export interface AdoptionCenter {
  name: string;
  mission: string;
  address: string;
  phone: string;
  website: string;
}