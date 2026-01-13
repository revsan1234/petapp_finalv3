import React, { useState } from 'react';
import { PersonalityQuiz } from '../PersonalityQuiz';
import { QuickFireDiscovery } from '../QuickFireDiscovery';
import { NameTranslator } from '../NameTranslator';
import { ConsultantScreen } from './ConsultantScreen';
import type { PetPersonalityResult, GeneratedName, PetInfo } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { Header } from '../Header';

interface PlayScreenProps {
    onQuizComplete: (result: PetPersonalityResult) => void;
    addSavedName: (name: GeneratedName) => void;
    savedNames: GeneratedName[];
    petInfo: PetInfo;
    setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
    goHome: () => void;
}

type PlayMode = 'menu' | 'quiz' | 'battle' | 'translator' | 'expert';

// Generic Back Icon SVG
const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

export const PlayScreen: React.FC<PlayScreenProps> = ({ onQuizComplete, addSavedName, savedNames, petInfo, setPetInfo, goHome }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<PlayMode>('menu');

  if (mode === 'menu') {
      return (
        <div className="relative min-h-screen pt-[max(1rem,env(safe-area-inset-top))]">
            <Header leftPet="dog" rightPet="cat" onLogoClick={goHome} />
            
            <main className="px-4 pb-20 max-w-2xl mx-auto w-full flex flex-col gap-6 animate-fade-in mt-4">
                {/* Back to Home Button on Play Landing */}
                <div className="-mt-4 mb-2">
                    <button 
                        onClick={goHome} 
                        className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30"
                    >
                        <BackIcon className="w-4 h-4" />
                        {t.common.back_home}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                        onClick={() => setMode('quiz')}
                        className="bg-[#FFF8E7] rounded-[2rem] p-6 shadow-lg border border-[#EBE5D5] flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 group h-full"
                    >
                        <div className="mb-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                            <PetCharacter pet="cat" className="w-24 h-24 drop-shadow-md" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">{t.quiz.title}</h3>
                        <p className="text-[#666666] font-medium leading-tight opacity-80 px-4 text-sm italic">{t.quiz.subtitle}</p>
                    </button>

                    <button 
                        onClick={() => setMode('battle')}
                        className="bg-[#FFF8E7] rounded-[2rem] p-6 shadow-lg border border-[#EBE5D5] flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 group h-full"
                    >
                        <div className="mb-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                             <PetCharacter pet="dog" className="w-24 h-24 drop-shadow-md" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">{t.quick_fire.title}</h3>
                        <p className="text-[#666666] font-medium leading-tight opacity-80 px-4 text-sm italic">{t.quick_fire.subtitle}</p>
                    </button>

                    <button 
                        onClick={() => setMode('translator')}
                        className="bg-[#FFF8E7] rounded-[2rem] p-6 shadow-lg border border-[#EBE5D5] flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 group h-full"
                    >
                        <div className="mb-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                             <PetCharacter pet="bird" className="w-24 h-24 drop-shadow-md" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">{t.translator.title}</h3>
                        <p className="text-[#666666] font-medium leading-tight opacity-80 px-4 text-sm italic">{t.translator.subtitle}</p>
                    </button>

                    <button 
                        onClick={() => setMode('expert')}
                        className="bg-[#FFF8E7] rounded-[2rem] p-6 shadow-lg border border-[#EBE5D5] flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 group h-full"
                    >
                        <div className="mb-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                             <PetCharacter pet="other" className="w-24 h-24 drop-shadow-md" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">{t.expert.title}</h3>
                        <p className="text-[#666666] font-black leading-tight opacity-100 px-4 text-sm italic underline decoration-[#666666]/30">Ask a pet expert!</p>
                        <p className="text-[#666666] font-medium leading-tight opacity-80 px-4 text-xs mt-1">{t.expert.subtitle}</p>
                    </button>
                </div>
            </main>
        </div>
      );
  }

  return (
    <div className="relative min-h-screen pt-[max(1rem,env(safe-area-inset-top))]">
        <Header leftPet="dog" rightPet="cat" onLogoClick={() => setMode('menu')} />
        <main className="px-4 pb-24 max-w-4xl mx-auto w-full animate-fade-in mt-4">
            <div className="mb-6">
                <button 
                    onClick={() => setMode('menu')}
                    className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm shadow-sm hover:bg-white/30"
                >
                    <BackIcon className="w-4 h-4" />
                    {t.common.back_internal}
                </button>
            </div>
             {mode === 'quiz' ? (
                <PersonalityQuiz onQuizComplete={onQuizComplete} petInfo={petInfo} setPetInfo={setPetInfo} addSavedName={addSavedName} savedNames={savedNames} />
             ) : mode === 'battle' ? (
                <QuickFireDiscovery addSavedName={addSavedName} savedNames={savedNames} petInfo={petInfo} setPetInfo={setPetInfo} />
             ) : mode === 'expert' ? (
                <ConsultantScreen goHome={() => setMode('menu')} />
             ) : (
                <NameTranslator />
             )}
        </main>
    </div>
  );
};