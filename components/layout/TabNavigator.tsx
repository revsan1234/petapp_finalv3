
import React, { useState, useRef } from 'react';
import { PetCharacter } from '../assets/pets/PetCharacter';
import type { PetKind } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

export type Tab = 'home' | 'generate' | 'bio' | 'play' | 'photo' | 'adopt' | 'hotels';

interface TabNavigatorProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

// Helper config to map IDs to their mascots
const TAB_CONFIG: { id: Tab; pet: PetKind }[] = [
  { id: 'generate', pet: 'dog' },
  { id: 'bio', pet: 'cat' },
  { id: 'play', pet: 'hamster' },
  { id: 'photo', pet: 'lizard' },
  { id: 'adopt', pet: 'rabbit' },
  { id: 'hotels', pet: 'bird' },
];

export const TabNavigator: React.FC<TabNavigatorProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const [activeDescription, setActiveDescription] = useState<{title: string, desc: string} | null>(null);
  const timerRef = useRef<any>(null);
  const isLongPress = useRef(false);

  if (activeTab === 'home') return null;

  const tabs = TAB_CONFIG.map(config => {
      // @ts-ignore
      const textData = t.navigation[config.id];
      
      return {
          ...config,
          label: textData.label,
          description: textData.desc
      };
  });

  const startPress = (title: string, desc: string) => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setActiveDescription({ title, desc });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate(50); } catch (e) {}
      }
    }, 500);
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActiveDescription(null);
  };

  const handleInteractionEnd = () => {
      endPress();
  };
  
  const handleClick = (id: Tab) => {
      if (isLongPress.current) {
          isLongPress.current = false;
          return;
      }
      setActiveTab(id);
  };

  return (
    <>
        {activeDescription && (
            <div className="fixed bottom-40 left-0 right-0 px-4 z-[100] pointer-events-none flex justify-center">
                <div className="bg-black/80 text-white p-4 rounded-xl backdrop-blur-md border border-white/20 shadow-2xl max-w-sm text-center animate-fade-in">
                    <p className="font-bold text-lg mb-1 text-[#e889b5]">{activeDescription.title}</p>
                    <p className="text-sm leading-relaxed">{activeDescription.desc}</p>
                </div>
            </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 h-36 sm:h-44 bg-gradient-to-t from-black/90 to-black/30 backdrop-blur-xl border-t border-white/20 z-50 pb-2 animate-fade-in select-none">
        <div className="flex justify-around items-end h-full max-w-6xl mx-auto px-1 w-full">
            {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
                <button
                key={tab.id}
                onMouseDown={() => startPress(tab.label, tab.description)}
                onMouseUp={handleInteractionEnd}
                onMouseLeave={handleInteractionEnd}
                onTouchStart={() => startPress(tab.label, tab.description)}
                onTouchEnd={handleInteractionEnd}
                onTouchCancel={handleInteractionEnd}
                onClick={() => handleClick(tab.id)}
                onContextMenu={(e) => e.preventDefault()}
                className={`group flex flex-col items-center justify-end pb-4 gap-1 transition-all duration-300 min-w-[55px] sm:min-w-[100px] w-full ${
                    isActive ? '-translate-y-5' : 'hover:-translate-y-1 opacity-90 hover:opacity-100'
                }`}
                >
                <div className={`transition-all duration-300 ${isActive ? 'filter drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] scale-150' : 'scale-110 opacity-80'}`}>
                    <PetCharacter
                        pet={tab.pet}
                        className={`transition-all duration-300 object-contain ${isActive ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-16 h-16 sm:w-24 sm:h-24'}`}
                    />
                </div>
                
                <span 
                    className={`text-[9px] sm:text-lg md:text-xl font-black tracking-tighter transition-all duration-200 uppercase drop-shadow-xl leading-none truncate w-full mt-2 ${
                    isActive ? 'text-white scale-125' : 'text-white/80'
                }`}>
                    {tab.label}
                </span>
                </button>
            );
            })}
        </div>
        </div>
    </>
  );
};

