
import React, { useState } from 'react';
import { PersonalityQuiz } from '../PersonalityQuiz';
import { QuickFireDiscovery } from '../QuickFireDiscovery';
import type { PetPersonalityResult, GeneratedName, PetInfo } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PetCharacter } from '../assets/pets/PetCharacter';

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const QuestionMarkIcon = () => (
    <span className="text-4xl font-black text-[#5D4037] opacity-80">?</span>
);

const VSIcon = () => (
    <div className="flex flex-col items-center leading-none">
        <span className="text-2xl font-black text-[#5D4037]">V</span>
        <span className="text-2xl font-black text-[#5D4037]">S</span>
    </div>
);

interface PlayScreenProps {
    onQuizComplete: (result: PetPersonalityResult) => void;
    addSavedName: (name: GeneratedName) => void;
    savedNames: GeneratedName[];
    petInfo: PetInfo;
    setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
    goHome: () => void;
}

type PlayMode = 'menu' | 'quiz' | 'battle';

export const PlayScreen: React.FC<PlayScreenProps> = ({ onQuizComplete, addSavedName, savedNames, petInfo, setPetInfo, goHome }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<PlayMode>('menu');

  // Mascot Row Component
  const MascotRow = () => (
    <div className="flex justify-center gap-2 sm:gap-4 mb-6 px-2 overflow-x-auto no-scrollbar">
        {['dog', 'cat', 'rabbit', 'bird', 'hamster'].map((pet, index) => (
            <div key={pet} className="w-14 h-14 sm:w-16 sm:h-16 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm border border-white/40">
                <PetCharacter pet={pet as any} className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
        ))}
    </div>
  );

  // Custom Header for Play Screens
  const PlayHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center justify-between px-4 py-4 relative z-50">
        <button 
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#AA336A] hover:scale-105 transition-transform"
        >
            <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow-md absolute left-1/2 transform -translate-x-1/2 w-full text-center pointer-events-none">
            {title}
        </h1>
        <div className="w-10" /> {/* Spacer for balance */}
    </div>
  );

  // Menu View
  if (mode === 'menu') {
      return (
        <div className="relative min-h-screen pt-[max(1rem,env(safe-area-inset-top))]">
            <PlayHeader title={t.navigation.play.label + " & Discover!"} onBack={goHome} />
            
            <main className="px-4 pb-20 max-w-lg mx-auto w-full flex flex-col gap-6 animate-fade-in">
                {/* Mascot Row */}
                <div className="mt-2">
                     <MascotRow />
                </div>

                {/* Game Cards */}
                <div className="flex flex-col gap-4">
                    {/* Quiz Card */}
                    <button 
                        onClick={() => setMode('quiz')}
                        className="bg-[#FFF8E7] rounded-[2rem] p-6 shadow-lg border border-[#EBE5D5] flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 group"
                    >
                        <div className="mb-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                            <PetCharacter pet="cat" className="w-24 h-24 drop-shadow-md" />
                        </div>
                        <h3 className="text-2xl font-black text-[#4A3B32]">{t.quiz.title}</h3>
                        <p className="text-[#7D6E65] font-medium leading-tight opacity-80 px-4">
                            {t.landing.feature3_desc}
                        </p>
                    </button>

                    {/* Battle Card */}
                    <button 
                        onClick={() => setMode('battle')}
                        className="bg-[#FFF8E7] rounded-[2rem] p-6 shadow-lg border border-[#EBE5D5] flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 group"
                    >
                        <div className="mb-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                             <PetCharacter pet="dog" className="w-24 h-24 drop-shadow-md" />
                        </div>
                        <h3 className="text-2xl font-black text-[#4A3B32]">{t.quick_fire.title}</h3>
                        <p className="text-[#7D6E65] font-medium leading-tight opacity-80 px-4">
                             {t.landing.feature1_desc}
                        </p>
                    </button>
                </div>
            </main>
        </div>
      );
  }

  // Active Game View Wrapper
  return (
    <div className="relative min-h-screen pt-[max(1rem,env(safe-area-inset-top))]">
        <PlayHeader 
            title={mode === 'quiz' ? t.quiz.title : t.quick_fire.title} 
            onBack={() => setMode('menu')} 
        />
        
        <main className="px-4 pb-24 max-w-xl mx-auto w-full animate-fade-in">
             <div className="mt-2 mb-6">
                 <MascotRow />
             </div>

             {mode === 'quiz' ? (
                <PersonalityQuiz 
                    onQuizComplete={onQuizComplete}
                    petInfo={petInfo}
                    setPetInfo={setPetInfo}
                    addSavedName={addSavedName}
                    savedNames={savedNames}
                />
             ) : (
                <QuickFireDiscovery 
                    addSavedName={addSavedName} 
                    savedNames={savedNames}
                    petInfo={petInfo}
                    setPetInfo={setPetInfo}
                />
             )}
        </main>
    </div>
  );
};