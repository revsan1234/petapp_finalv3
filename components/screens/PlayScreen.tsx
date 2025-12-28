
import React, { useState } from 'react';
import { Header } from '../Header';
import { PersonalityQuiz } from '../PersonalityQuiz';
import { QuickFireDiscovery } from '../QuickFireDiscovery';
import { NameTranslator } from '../NameTranslator';
import { PetHoroscope } from '../PetHoroscope';
import { PetAgeCalculator } from '../PetAgeCalculator';
import { ConsultantScreen } from './ConsultantScreen';
import { GeneratedName, PetInfo, PetPersonalityResult, PetKind } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { BackToHomeButton } from '../../App';
import { PetCharacter } from '../assets/pets/PetCharacter';

interface PlayScreenProps {
  onQuizComplete: (result: PetPersonalityResult) => void;
  savedNames: GeneratedName[];
  addSavedName: (name: GeneratedName) => void;
  petInfo: PetInfo;
  setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
  goHome: () => void;
}

type PlayMode = 'menu' | 'quiz' | 'quickfire' | 'translator' | 'horoscope' | 'calculator' | 'expert';

// The PlayScreen acts as a central hub for all interactive naming games and tools.
// Fix: Renamed exported component to PlayScreen to match App.tsx import.
export const PlayScreen: React.FC<PlayScreenProps> = ({
  onQuizComplete,
  savedNames,
  addSavedName,
  petInfo,
  setPetInfo,
  goHome,
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<PlayMode>('menu');

  const handleBackToMenu = () => setMode('menu');

  const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );

  if (mode === 'menu') {
    const menuItems: { id: PlayMode; title: string; desc: string; pet: PetKind }[] = [
      { id: 'quiz', title: t.quiz.title, desc: t.quiz.subtitle, pet: 'hamster' },
      { id: 'quickfire', title: t.quick_fire.title, desc: t.quick_fire.subtitle, pet: 'cat' },
      { id: 'expert', title: t.expert.title, desc: t.expert.subtitle, pet: 'dog' },
      { id: 'translator', title: t.translator.title, desc: t.translator.subtitle, pet: 'bird' },
      { id: 'horoscope', title: t.horoscope.title, desc: t.horoscope.subtitle, pet: 'lizard' },
      { id: 'calculator', title: t.age_calc.title, desc: t.age_calc.subtitle, pet: 'rabbit' },
    ];

    return (
      <div className="relative min-h-screen">
        <Header leftPet="hamster" rightPet="bird" onLogoClick={goHome} />
        <main className="px-4 pb-24 max-w-4xl mx-auto w-full flex flex-col gap-6 animate-fade-in mt-2">
          <div className="-mt-4">
            <BackToHomeButton onClick={goHome} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className="bg-[var(--card-bg)] backdrop-blur-md rounded-[2rem] p-6 shadow-md border-2 border-white/40 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#AA336A]/20"
              >
                <div className="mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                  <PetCharacter pet={item.pet} className="w-20 h-20 drop-shadow-md" />
                </div>
                <h3 className="text-2xl font-black text-[var(--text-main)] group-hover:text-[#AA336A] transition-colors">{item.title}</h3>
                <p className="text-[var(--text-main)] font-bold text-sm opacity-80 line-clamp-2">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const renderActiveMode = () => {
    switch (mode) {
      case 'quiz':
        return (
          <PersonalityQuiz
            onQuizComplete={onQuizComplete}
            petInfo={petInfo}
            setPetInfo={setPetInfo}
            addSavedName={addSavedName}
            savedNames={savedNames}
          />
        );
      case 'quickfire':
        return (
          <QuickFireDiscovery
            addSavedName={addSavedName}
            savedNames={savedNames}
            petInfo={petInfo}
            setPetInfo={setPetInfo}
          />
        );
      case 'translator':
        return <NameTranslator />;
      case 'horoscope':
        return <PetHoroscope />;
      case 'calculator':
        return <PetAgeCalculator />;
      case 'expert':
        return <ConsultantScreen goHome={handleBackToMenu} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen">
      <Header leftPet="hamster" rightPet="bird" onLogoClick={handleBackToMenu} />
      <main className="py-4 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 w-full">
          <div className="-mt-4 flex gap-3">
            <button
              onClick={handleBackToMenu}
              className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30 active:scale-95"
            >
              <BackIcon className="w-4 h-4" />
              {t.common.menu_label}
            </button>
            <BackToHomeButton onClick={goHome} />
          </div>
          <div className="animate-fade-in">
            {renderActiveMode()}
          </div>
        </div>
      </main>
    </div>
  );
};