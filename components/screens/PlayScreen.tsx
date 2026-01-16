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
            
            <main className="px-4 pb-48 sm:pb-56 max-w-2xl mx-auto w-full flex flex-col gap-8 animate-fade-in mt-6">
                <div className="-mt-4">
                    <button 
                        onClick={goHome} 
                        className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md font-black text-[10px] uppercase tracking-widest w-fit shadow-lg border border-white/10"
                    >
                        <BackIcon className="w-3 h-3" />
                        {t.common.back_home}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { mode: 'quiz' as const, pet: 'cat', title: t.quiz.title, sub: t.quiz.subtitle },
                        { mode: 'battle' as const, pet: 'dog', title: t.quick_fire.title, sub: t.quick_fire.subtitle },
                        { mode: 'translator' as const, pet: 'bird', title: t.translator.title, sub: t.translator.subtitle },
                        { mode: 'expert' as const, pet: 'other', title: t.expert.title, sub: t.expert.subtitle }
                    ].map((item) => (
                        <button 
                            key={item.mode}
                            onClick={() => setMode(item.mode)}
                            className="bg-[var(--card-bg)] rounded-[3rem] p-8 shadow-xl border border-white/20 flex flex-col items-center text-center gap-6 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl active:scale-95 group h-full"
                        >
                            <div className="mb-1 transform group-hover:-translate-y-4 group-hover:scale-110 transition-all duration-700">
                                <PetCharacter pet={item.pet as any} className="w-28 h-28 drop-shadow-2xl" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-[var(--text-main)] leading-none">{item.title}</h3>
                                <p className="text-[var(--text-main)] font-medium leading-tight opacity-50 px-4 text-base italic">{item.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </main>
        </div>
      );
  }

  return (
    <div className="relative min-h-screen pt-[max(1rem,env(safe-area-inset-top))]">
        <Header leftPet="dog" rightPet="cat" onLogoClick={() => setMode('menu')} />
        <main className="px-4 pb-48 sm:pb-56 max-w-4xl mx-auto w-full animate-fade-in mt-6">
            <div className="mb-8">
                <button 
                    onClick={() => setMode('menu')}
                    className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md font-black text-[10px] uppercase tracking-widest shadow-lg border border-white/10"
                >
                    <BackIcon className="w-3 h-3" />
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