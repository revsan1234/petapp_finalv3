import React from 'react';
import { Header } from './Header';
import { NameGenerator } from './NameGenerator';
import { SavedNames } from './SavedNames';
import type { GeneratedName, PetInfo } from '../types';
import { NameOfTheDay } from './NameOfTheDay';
import { NameMeaningFinder } from './NameMeaningFinder';
import { TrendingTicker } from './TrendingTicker';
import { useLanguage } from '../contexts/LanguageContext';

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

interface MainViewProps {
    savedNames: GeneratedName[];
    addSavedName: (name: GeneratedName) => void;
    removeSavedName: (nameId: string) => void;
    petInfo: PetInfo;
    setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
    goHome?: () => void; 
}

export const MainView: React.FC<MainViewProps> = ({ savedNames, addSavedName, removeSavedName, petInfo, setPetInfo, goHome }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header leftPet="dog" rightPet="cat" onLogoClick={goHome} />
      <main className="py-4 md:py-8 px-4 pb-48 sm:pb-56">
        <div className="flex flex-col gap-10 w-full mx-auto max-w-7xl">
          {goHome && (
            <div className="-mt-4">
                <button 
                    onClick={goHome} 
                    className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md font-black text-[10px] uppercase tracking-widest w-fit shadow-lg border border-white/10"
                >
                    <BackIcon className="w-3 h-3" />
                    {t.common.back_home}
                </button>
            </div>
          )}

          <NameGenerator 
            addSavedName={addSavedName} 
            savedNames={savedNames} 
            petInfo={petInfo}
            setPetInfo={setPetInfo}
          />
          <SavedNames 
            savedNames={savedNames} 
            removeSavedName={removeSavedName} 
            petGender={petInfo.gender}
          />
          <TrendingTicker />
          <NameOfTheDay />
          <NameMeaningFinder />
        </div>
      </main>
    </div>
  );
};