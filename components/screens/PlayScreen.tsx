import React from 'react';
import { Header } from '../Header';
import { PersonalityQuiz } from '../PersonalityQuiz';
import { QuickFireDiscovery } from '../QuickFireDiscovery';
import type { PetPersonalityResult, GeneratedName, PetInfo } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

interface PlayScreenProps {
    onQuizComplete: (result: PetPersonalityResult) => void;
    addSavedName: (name: GeneratedName) => void;
    savedNames: GeneratedName[];
    petInfo: PetInfo;
    setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
    goHome: () => void;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({ onQuizComplete, addSavedName, savedNames, petInfo, setPetInfo, goHome }) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden">
        <div className="relative z-10">
            <Header leftPet="hamster" rightPet="rabbit" onLogoClick={goHome} />
            <main className="py-4 md:py-8 px-4">
                <div className="flex flex-col gap-8 w-full mx-auto max-w-7xl">
                    {/* Back Button */}
                    <div className="-mt-4">
                         <button 
                            onClick={goHome} 
                            className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30"
                        >
                            <BackIcon className="w-4 h-4" />
                            {t.common.back_home}
                        </button>
                    </div>

                    <PersonalityQuiz 
                      onQuizComplete={onQuizComplete}
                      petInfo={petInfo}
                      setPetInfo={setPetInfo}
                      addSavedName={addSavedName}
                      savedNames={savedNames}
                    />

                    <QuickFireDiscovery 
                        addSavedName={addSavedName} 
                        savedNames={savedNames}
                        petInfo={petInfo}
                        setPetInfo={setPetInfo}
                    />
                </div>
            </main>
        </div>
    </div>
  );
};