import React, { useState, useRef } from 'react';
import { PetCharacter } from '../assets/pets/PetCharacter';
import type { PetKind, Tab } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface TabNavigatorProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TAB_CONFIG: { id: Tab; pet: PetKind }[] = [
  { id: 'generate', pet: 'dog' },
  { id: 'bio', pet: 'cat' },
  { id: 'play', pet: 'hamster' },
  { id: 'photo', pet: 'lizard' },
  { id: 'adopt', pet: 'rabbit' },
  { id: 'hotel', pet: 'bird' },
];

export const TabNavigator: React.FC<TabNavigatorProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const [activeDescription, setActiveDescription] = useState<{title: string, desc: string} | null>(null);
  const timerRef = useRef<any>(null);
  const isLongPress = useRef(false);

  if (activeTab === 'home') return null;

  const tabs = TAB_CONFIG.map(config => {
      const textData = (t.navigation as any)[config.id] || { label: config.id, desc: "" };
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
            <div className="fixed bottom-32 left-0 right-0 px-4 z-[100] pointer-events-none flex justify-center">
                <div className="bg-black/80 text-white p-4 rounded-xl backdrop-blur-md border border-white/20 shadow-2xl max-w-sm text-center animate-fade-in">
                    <p className="font-bold text-lg mb-1 text-[#e889b5]">{activeDescription.title}</p>
                    <p className="text-sm leading-relaxed">{activeDescription.desc}</p>
                </div>
            </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-t from-black/80 to-black/20 backdrop-blur-xl border-t border-white/20 z-50 pb-2 animate-fade-in select-none">
        <div className="flex justify-around items-end h-full max-w-7xl mx-auto px-1 w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
            {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
                <button
                key={tab.id}
                onMouseDown={() => startPress(tab.label, tab.description)}
                onMouseUp={endPress}
                onMouseLeave={endPress}
                onTouchStart={() => startPress(tab.label, tab.description)}
                onTouchEnd={endPress}
                onTouchCancel={endPress}
                onClick={() => handleClick(tab.id)}
                className={`group flex flex-col items-center justify-end pb-3 gap-1 transition-all duration-300 min-w-[65px] sm:min-w-[90px] w-full ${
                    isActive ? '-translate-y-3' : 'hover:-translate-y-1 opacity-90 hover:opacity-100'
                }`}
                >
                <div className={`transition-all duration-300 ${isActive ? 'filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] scale-110' : 'scale-100 opacity-80'}`}>
                    <PetCharacter
                        pet={tab.pet}
                        className={`transition-all duration-300 object-contain ${isActive ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10 sm:w-12 sm:h-12'}`}
                    />
                </div>
                
                <span 
                    className={`text-[9px] sm:text-[10px] font-black tracking-tighter transition-all duration-200 uppercase drop-shadow-lg leading-none ${
                    isActive ? 'text-white scale-105 mt-1' : 'text-white/80'
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