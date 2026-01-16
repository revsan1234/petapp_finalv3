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
            <div className="fixed bottom-20 left-0 right-0 px-4 z-[100] pointer-events-none flex justify-center">
                <div className="bg-black/90 text-white p-3 rounded-xl backdrop-blur-md border border-white/20 shadow-2xl max-w-sm text-center animate-fade-in">
                    <p className="font-bold text-sm mb-0.5 text-[#e889b5]">{activeDescription.title}</p>
                    <p className="text-xs leading-tight">{activeDescription.desc}</p>
                </div>
            </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 h-14 sm:h-16 bg-black/85 backdrop-blur-xl border-t border-white/10 z-50 pb-[env(safe-area-inset-bottom)] animate-fade-in select-none">
            <div className="flex justify-between items-end h-full max-w-xl mx-auto px-4 w-full">
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
                            className="group flex flex-col items-center justify-end pb-1.5 flex-1 min-w-0 relative"
                        >
                            <div className={`transition-all duration-300 ${isActive ? 'translate-y-[-2.2rem] sm:translate-y-[-2.8rem] scale-125' : 'scale-100 opacity-50'}`}>
                                <div className={`${isActive ? 'filter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]' : ''}`}>
                                    <PetCharacter
                                        pet={tab.pet}
                                        className={`transition-all duration-300 object-contain ${isActive ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-8 h-8 sm:w-10 sm:h-10'}`}
                                    />
                                </div>
                            </div>
                            
                            <span 
                                className={`text-[7px] sm:text-[8px] font-black tracking-tighter uppercase transition-all duration-200 mt-0.5 ${
                                    isActive ? 'text-white opacity-100' : 'text-white/30'
                                }`}
                            >
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