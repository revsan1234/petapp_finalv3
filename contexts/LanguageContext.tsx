import React, { createContext, useState, useContext } from 'react';
import type { Language } from '../types';
import { translations } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Deep merges translation objects to ensure all keys are present, 
 * falling back to English for missing values.
 */
const getMergedTranslations = (lang: Language) => {
    // Start with a clean copy of English as the foundation
    const base = JSON.parse(JSON.stringify(translations.en));
    const target = (translations as any)[lang];
    
    if (!target || lang === 'en') return base;

    // Deep merge function to handle nested translation objects
    const merge = (b: any, t: any) => {
        Object.keys(t).forEach(key => {
            if (t[key] && typeof t[key] === 'object' && !Array.isArray(t[key])) {
                if (!b[key]) b[key] = {};
                merge(b[key], t[key]);
            } else {
                b[key] = t[key];
            }
        });
    };
    
    merge(base, target);
    return base;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
      const saved = localStorage.getItem('petapp_lang');
      return (saved as Language) || 'en';
  });

  const value = {
    language,
    setLanguage: (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('petapp_lang', lang);
    },
    t: getMergedTranslations(language),
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