import React, { useState, useRef } from 'react';
import { PetCharacter } from '../assets/pets/PetCharacter';
import type { PetKind } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

export type Tab = 'home' | 'generate' | 'bio' | 'play' | 'photo' | 'adopt' | 'partnerships';

interface TabNavigatorProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

// Helper config to map IDs to their mascots, independent of language
const TAB_CONFIG: { id: Tab; pet: PetKind }[] = [
  { id: 'generate', pet: 'dog' },
  { id: 'bio', pet: 'cat' },
  { id: 'play', pet: 'hamster' },
  { id: 'photo', pet: 'lizard' },
  { id: 'adopt', pet: 'rabbit' },
  { id: 'partnerships', pet: 'bird' },
];

export const TabNavigator: React.FC<TabNavigatorProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const [activeDescription, setActiveDescription] = useState<{title: string, desc: string} | null>(null);
  const timerRef = useRef<any>(null);
  const isLongPress = useRef(false);

  // If we are on the landing page ('home'), we can either hide the bottom bar or show it.
  // Usually, a "dashboard" might not need the nav bar, but for quick access let's keep it 
  // or hide it to focus on the cards. Let's hide it on 'home' to match the "Landing Page" feel 
  // and give full screen space to the cards.
  if (activeTab === 'home') return null;

  // Dynamically build the tabs list using translations
  const tabs = TAB_CONFIG.map(config => {
      // Map 'partnerships' tab ID to 'shop' key in translations
      const transKey = config.id === 'partnerships' ? 'partnerships' : config.id;
      // @ts-ignore - We know the keys exist in the translation object
      const textData = t.navigation[transKey];
      
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
    // Reset long press flag slightly after to ensure click handler sees it was a long press
    // if touch ended.
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
            <div className="fixed bottom-24 left-0 right-0 px-4 z-[100] pointer-events-none flex justify-center">
                <div className="bg-black/80 text-white p-4 rounded-xl backdrop-blur-md border border-white/20 shadow-2xl max-w-sm text-center animate-fade-in">
                    <p className="font-bold text-lg mb-1 text-[#e889b5]">{activeDescription.title}</p>
                    <p className="text-sm leading-relaxed">{activeDescription.desc}</p>
                </div>
            </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-black/10 backdrop-blur-xl border-t border-white/20 z-50 pb-2 animate-fade-in select-none">
        <div className="flex justify-around items-end h-full max-w-4xl mx-auto px-1 w-full">
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
                className={`group flex flex-col items-center justify-end pb-4 gap-1 transition-all duration-300 min-w-[60px] w-full ${
                    isActive ? '-translate-y-2' : 'hover:-translate-y-1 opacity-90 hover:opacity-100'
                }`}
                >
                {/* Character Container */}
                <div className={`transition-all duration-300 ${isActive ? 'filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-110' : 'scale-95 opacity-80'}`}>
                    <PetCharacter
                        pet={tab.pet}
                        className={`transition-all duration-300 object-contain ${isActive ? 'w-14 h-14' : 'w-12 h-12'}`}
                    />
                </div>
                
                {/* Label */}
                <span 
                    className={`text-base sm:text-lg font-black tracking-wide transition-all duration-200 uppercase drop-shadow-lg ${
                    isActive ? 'text-white scale-105' : 'text-white/90'
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