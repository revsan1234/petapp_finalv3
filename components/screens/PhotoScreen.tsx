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
      setImageForBio(image); // Also update Bio screen state
  };

  return (
    <div className="relative min-h-screen">
        <div className="relative z-10">
            <Header leftPet="lizard" rightPet="rabbit" onLogoClick={goHome} />
            <main className="py-4 md:py-8 px-4 pb-32">
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

                    <ImageEditor 
                        setImageForBio={handleImageUpdate} 
                        sharedImage={currentPhoto}
                        setActiveTab={setActiveTab}
                    />

                    <Card>
                        <div className="flex flex-col items-center gap-2 mb-6 text-center">
                            <h2 className="text-3xl font-bold">{t.bio.turn_photo_into_card}</h2>
                            <p className="opacity-80 text-xl">
                                {t.bio.turn_photo_desc}
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center gap-8 mt-4 mb-8">
                            {/* Smaller, balanced decorative elements */}
                            <div className="flex items-end justify-center -space-x-4 sm:-space-x-8 md:-space-x-12">
                                <PetCharacter pet="dog" className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-bounce-wiggle z-10 drop-shadow-lg" style={{ animationDelay: '0ms' }} />
                                <PetCharacter pet="cat" className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-bounce-wiggle z-20 -mb-2 drop-shadow-lg" style={{ animationDelay: '100ms' }} />
                                <PetCharacter pet="rabbit" className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-bounce-wiggle z-30 drop-shadow-lg" style={{ animationDelay: '200ms' }} />
                                <PetCharacter pet="bird" className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-bounce-wiggle z-20 -mb-2 drop-shadow-lg" style={{ animationDelay: '300ms' }} />
                                <PetCharacter pet="hamster" className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-bounce-wiggle z-10 drop-shadow-lg" style={{ animationDelay: '400ms' }} />
                            </div>

                            <Button onClick={() => setActiveTab('bio')} className="shadow-lg scale-105 z-40 border-2 border-white/50 px-6 py-3 text-lg">
                                <BioIcon className="w-5 h-5" />
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