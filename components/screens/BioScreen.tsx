import React from 'react';
import { Header } from '../Header';
import { BioGenerator } from '../BioGenerator';
import type { PetInfo } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

interface BioScreenProps {
    petInfo: PetInfo;
    imageForBio: string | null;
    setImageForBio: (image: string | null) => void;
    goHome: () => void;
}

export const BioScreen: React.FC<BioScreenProps> = ({ petInfo, imageForBio, setImageForBio, goHome }) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden">
        <div className="relative z-10">
            <Header leftPet="bird" rightPet="fish" onLogoClick={goHome} />
            <main className="py-4 md:py-8 px-4">
                <div className="flex flex-col gap-8 w-full mx-auto max-w-7xl">
                     <div className="-mt-4">
                        <button 
                            onClick={goHome} 
                            className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30 active:scale-95"
                        >
                            <BackIcon className="w-4 h-4" />
                            {t.common.back_home}
                        </button>
                    </div>

                    <BioGenerator 
                        petInfo={petInfo}
                        imageForBio={imageForBio}
                        setImageForBio={setImageForBio}
                    />
                </div>
            </main>
        </div>
    </div>
  );
};