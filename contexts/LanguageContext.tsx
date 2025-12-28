
import React, { createContext, useState, useContext } from 'react';
import type { Language } from '../types';
import { translations } from '../translations';

interface LanguageContextType {
  language: Language;
  // Use React's Dispatch type to match useState's return type exactly
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Ensure 't' is strictly typed as the base translation shape (English)
  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language] as typeof translations.en,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
