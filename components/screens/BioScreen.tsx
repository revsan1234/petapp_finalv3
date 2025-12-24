import React from 'react';
import { Header } from '../Header';
import { BioGenerator } from '../BioGenerator';
import type { PetInfo } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { BackToHomeButton } from '../../App';

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
                        <BackToHomeButton onClick={goHome} />
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