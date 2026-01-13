export type PetType = 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Rabbit' | 'Hamster' | 'Lizard';
export type PetKind = 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'lizard' | 'ferret' | 'other';
export type PetGender = 'Male' | 'Female' | 'Any';
export type PetPersonality = 'Playful' | 'Calm' | 'Mischievous' | 'Elegant' | 'Goofy' | 'Brave';
export type NameStyle = 'Trending' | 'Unique' | 'Classic' | 'Mythological' | 'Nature-inspired' | 'Funny';
export type ImageStyle = 'Photorealistic' | 'Anime' | 'Cartoon';
export type Language = 'en' | 'es' | 'fr';

export interface PetInfo {
  type: PetType;
  gender: PetGender;
  personality: PetPersonality;
  style: NameStyle;
  name?: string;
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

export interface PetHotel {
  name: string;
  summary: string;
  address: string;
  phone: string;
  website: string;
}

/**
 * Interface for chat messages used in the Pet Consultant screen.
 */
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type Tab = 'home' | 'generate' | 'bio' | 'play' | 'photo' | 'adopt' | 'hotel';

// Defines the possible top-level views for the application
export type View = 'app' | 'privacy' | 'terms';