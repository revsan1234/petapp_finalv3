import React, { useState } from 'react';
import { Header } from '../Header';
import { ImageEditor } from '../ImageEditor';
import { VideoGenerator } from '../VideoGenerator';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tab } from '../../types';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { useLanguage } from '../../contexts/LanguageContext';

const BioIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

interface PhotoScreenProps {
    setActiveTab: (tab: Tab) => void;
    setImageForBio: (image: string | null) => void;
    goHome: () => void;
}

export const PhotoScreen: React.FC<PhotoScreenProps> = ({ setActiveTab, setImageForBio, goHome }) => {
  const { t } = useLanguage();
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);

  const handleImageUpdate = (image: string | null) => {
      setCurrentPhoto(image);
      setImageForBio(image); 
  };

  return (
    <div className="relative min-h-screen">
        <div className="relative z-10">
            <Header leftPet="lizard" rightPet="rabbit" onLogoClick={goHome} />
            <main className="py-4 md:py-8 px-4 pb-80 sm:pb-96">
                <div className="flex flex-col gap-10 w-full mx-auto max-w-7xl">
                     <div className="-mt-4">
                        <button 
                            onClick={goHome} 
                            className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md font-black text-[10px] uppercase tracking-widest w-fit shadow-lg border border-white/10"
                        >
                            <BackIcon className="w-3 h-3" />
                            {t.common.back_home}
                        </button>
                    </div>

                    <ImageEditor 
                        setImageForBio={handleImageUpdate} 
                        sharedImage={currentPhoto}
                        setActiveTab={setActiveTab}
                    />

                    <Card>
                        <div className="flex flex-col items-center gap-2 mb-6 text-center">
                            <h2 className="text-3xl font-black">{t.bio.turn_photo_into_card}</h2>
                            <p className="opacity-60 text-xl font-medium">
                                {t.bio.turn_photo_desc}
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center gap-10 mt-6 mb-10">
                            <div className="flex items-end justify-center -space-x-4 sm:-space-x-8 md:-space-x-12">
                                <PetCharacter pet="dog" className="w-20 h-20 sm:w-28 sm:h-28 animate-bounce-wiggle z-10 drop-shadow-2xl" style={{ animationDelay: '0ms' }} />
                                <PetCharacter pet="cat" className="w-20 h-20 sm:w-28 sm:h-28 animate-bounce-wiggle z-20 -mb-2 drop-shadow-2xl" style={{ animationDelay: '100ms' }} />
                                <PetCharacter pet="rabbit" className="w-20 h-20 sm:w-28 sm:h-28 animate-bounce-wiggle z-30 drop-shadow-2xl" style={{ animationDelay: '200ms' }} />
                                <PetCharacter pet="bird" className="w-20 h-20 sm:w-28 sm:h-28 animate-bounce-wiggle z-20 -mb-2 drop-shadow-2xl" style={{ animationDelay: '300ms' }} />
                                <PetCharacter pet="hamster" className="w-20 h-20 sm:w-28 sm:h-28 animate-bounce-wiggle z-10 drop-shadow-2xl" style={{ animationDelay: '400ms' }} />
                            </div>

                            <Button onClick={() => setActiveTab('bio')} className="shadow-2xl scale-110 z-40 border-2 border-white/20 px-8 py-4 text-xl">
                                <BioIcon className="w-6 h-6" />
                                {t.bio.go_to_creator}
                            </Button>
                        </div>
                    </Card>

                    <VideoGenerator sharedImage={currentPhoto} />
                </div>
            </main>
        </div>
    </div>
  );
};