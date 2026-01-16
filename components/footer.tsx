
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language, View } from '../../types';

interface FooterProps {
  setView: (view: View) => void;
  isChillMode?: boolean;
  setIsChillMode?: (mode: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView, isChillMode, setIsChillMode }) => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' }
  ];

  return (
    <footer className="mt-16 pb-12 px-4 flex flex-col items-center gap-10">
      {/* Chill Mode Toggle - Now in Footer */}
      {setIsChillMode && (
        <div className="flex flex-col items-center gap-2">
            <button 
                onClick={() => setIsChillMode(!isChillMode)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 font-black text-[10px] uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
                {isChillMode ? t.common.chill_mode_off : t.common.chill_mode_on}
            </button>
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
          {language === 'en' ? 'Select Language' : language === 'es' ? 'Seleccionar Idioma' : 'Choisir la langue'}
        </p>
        <div className="flex gap-2 bg-black/5 p-1 rounded-full backdrop-blur-sm border border-white/5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-5 py-2 rounded-full text-[10px] font-black transition-all duration-300 ${
                language === lang.code
                  ? 'bg-white text-[#AA336A] shadow-lg scale-110'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
        <button onClick={() => setView('privacy')} className="hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">{t.common.privacy}</button>
        <button onClick={() => setView('terms')} className="hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">{t.common.terms}</button>
        <button onClick={() => setView('contact')} className="hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">{t.common.contact}</button>
      </div>

      <div className="text-center opacity-20 text-[9px] font-black text-white tracking-[0.4em] uppercase">
        namemypet.org
      </div>
    </footer>
  );
};