import React, { useState } from 'react';
import { Header } from '../Header';
import { ImageEditor } from '../ImageEditor';
import { VideoGenerator } from '../VideoGenerator';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tab } from '../layout/TabNavigator';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { useLanguage } from '../../contexts/LanguageContext';
import { BackToHomeButton } from '../ui/BackToHomeButton';

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

type PhotoMode = 'menu' | 'scene' | 'video';

export const PhotoScreen: React.FC<PhotoScreenProps> = ({ setActiveTab, setImageForBio, goHome }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<PhotoMode>('menu');
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);

  const handleImageUpdate = (image: string | null) => {
      setCurrentPhoto(image);
      setImageForBio(image); 
  };

  const handleBackToMenu = () => setMode('menu');

  if (mode === 'menu') {
    return (
        <div className="relative min-h-screen">
            <Header leftPet="lizard" rightPet="rabbit" onLogoClick={goHome} />
            <main className="px-4 pb-24 max-w-lg mx-auto w-full flex flex-col gap-6 animate-fade-in mt-2">
                 <div className="-mt-4">
                    <BackToHomeButton onClick={goHome} />
                </div>

                <div className="flex flex-col gap-6">
                    <button 
                        onClick={() => setMode('scene')}
                        className="bg-[var(--card-bg)] backdrop-blur-md rounded-[2rem] p-8 shadow-md border-2 border-white/40 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#AA336A]/20"
                    >
                        <div className="mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                            <PetCharacter pet="lizard" className="w-28 h-28 drop-shadow-md" />
                        </div>
                        <h3 className="text-3xl font-black text-[#5D4037]">{t.image_editor.title}</h3>
                        <p className="text-[#333333] font-bold leading-relaxed text-lg px-4 opacity-100">
                            {t.image_editor.subtitle}
                        </p>
                    </button>

                    <button 
                        onClick={() => setMode('video')}
                        className="bg-[var(--card-bg)] backdrop-blur-md rounded-[2rem] p-8 shadow-md border-2 border-white/40 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#AA336A]/20"
                    >
                        <div className="mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                             <PetCharacter pet="rabbit" className="w-28 h-28 drop-shadow-md" />
                        </div>
                        <h3 className="text-3xl font-black text-[#5D4037]">{t.video_studio.title}</h3>
                        <p className="text-[#333333] font-bold leading-relaxed text-lg px-4 opacity-100">
                             {t.video_studio.subtitle}
                        </p>
                    </button>
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
        <div className="relative z-10">
            <Header leftPet="lizard" rightPet="rabbit" onLogoClick={handleBackToMenu} />
            <main className="py-2 md:py-4 px-4">
                <div className="flex flex-col gap-6 w-full mx-auto max-w-7xl">
                    
                     <div className="-mt-4 flex gap-3">
                        <button 
                            onClick={handleBackToMenu} 
                            className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30 active:scale-95"
                        >
                            <BackIcon className="w-4 h-4" />
                            {t.navigation.photo.label} Menu
                        </button>
                        <BackToHomeButton onClick={goHome} />
                    </div>

                    {mode === 'scene' ? (
                        <>
                            <ImageEditor 
                                setImageForBio={handleImageUpdate} 
                                sharedImage={currentPhoto}
                            />

                            <Card>
                                <div className="flex flex-col items-center gap-2 mb-6 text-center">
                                    <h2 className="text-4xl font-black text-[#5D4037]">{t.bio.turn_photo_into_card}</h2>
                                    <p className="opacity-100 text-xl font-bold text-[#333333]">
                                        {t.bio.turn_photo_desc}
                                    </p>
                                </div>
                                
                                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mt-2 mb-4">
                                    <div className="flex items-end -space-x-6">
                                        <PetCharacter pet="dog" className="w-20 h-20 animate-bounce-wiggle z-10 drop-shadow-lg" style={{ animationDelay: '0ms' }} />
                                        <PetCharacter pet="cat" className="w-20 h-20 animate-bounce-wiggle z-20 drop-shadow-lg" style={{ animationDelay: '100ms' }} />
                                        <PetCharacter pet="rabbit" className="w-20 h-20 animate-bounce-wiggle z-30 drop-shadow-lg" style={{ animationDelay: '200ms' }} />
                                    </div>

                                    <Button onClick={() => setActiveTab('bio')} className="shadow-xl scale-110 z-40 border-2 border-white/50">
                                        <BioIcon className="w-5 h-5" />
                                        {t.bio.go_to_creator}
                                    </Button>

                                    <div className="flex items-end -space-x-6">
                                        <PetCharacter pet="hamster" className="w-20 h-20 animate-bounce-wiggle z-30 drop-shadow-lg" style={{ animationDelay: '300ms' }} />
                                        <PetCharacter pet="bird" className="w-20 h-20 animate-bounce-wiggle z-20 drop-shadow-lg" style={{ animationDelay: '400ms' }} />
                                        <PetCharacter pet="lizard" className="w-20 h-20 animate-bounce-wiggle z-10 drop-shadow-lg" style={{ animationDelay: '500ms' }} />
                                    </div>
                                </div>
                            </Card>
                        </>
                    ) : (
                        <VideoGenerator sharedImage={currentPhoto} />
                    )}
                </div>
            </main>
        </div>
    </div>
  );
};