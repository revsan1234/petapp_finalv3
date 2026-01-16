import React, { useState, useRef } from 'react';
import { PetCharacter } from './assets/pets/PetCharacter';
import type { PetKind, Tab } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

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
            <div className="fixed bottom-48 left-0 right-0 px-4 z-[100] pointer-events-none flex justify-center">
                <div className="bg-black/95 text-white p-8 rounded-[3rem] backdrop-blur-md border border-white/20 shadow-2xl max-w-sm text-center animate-fade-in">
                    <p className="font-black text-2xl mb-2 text-[#e889b5] uppercase tracking-[0.2em]">{activeDescription.title}</p>
                    <p className="text-xl leading-relaxed opacity-90 font-medium">{activeDescription.desc}</p>
                </div>
            </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 h-32 sm:h-40 bg-black/95 backdrop-blur-2xl border-t border-white/10 z-50 pb-[env(safe-area-inset-bottom)] animate-fade-in select-none shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
            <div className="flex justify-between items-center h-full max-w-5xl mx-auto px-4 sm:px-12 w-full">
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
                            className="group flex flex-col items-center justify-center flex-1 min-w-0 relative h-full pt-8"
                        >
                            <div className={`transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${isActive ? 'translate-y-[-6rem] sm:translate-y-[-8rem] scale-[2.5]' : 'scale-100 opacity-40 hover:opacity-100 hover:scale-110'}`}>
                                <div className={`${isActive ? 'filter drop-shadow-[0_0_40px_rgba(255,255,255,1)]' : ''}`}>
                                    <PetCharacter
                                        pet={tab.pet}
                                        className={`transition-all duration-300 object-contain ${isActive ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-16 h-16 sm:w-18 sm:h-18'}`}
                                    />
                                </div>
                            </div>
                            
                            <span 
                                className={`text-[10px] sm:text-lg font-black tracking-[0.2em] uppercase transition-all duration-300 mt-2 sm:mt-4 ${
                                    isActive ? 'text-white scale-125 opacity-100' : 'text-white/20'
                                }`}
                            >
                                {tab.label}
                            </span>
                            
                            {isActive && (
                                <div className="absolute bottom-4 w-3 h-3 bg-[#e889b5] rounded-full animate-pulse shadow-[0_0_20px_#e889b5]"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    </>
  );
};