
import React, { forwardRef, MouseEvent } from 'react';
import { PetCharacter } from '../assets/pets/PetCharacter';
import type { PetGender } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ShareableListCardProps {
    names: string[];
    imagePreview: string | null;
    gender: PetGender;
    imageZoom?: number;
    imagePosition?: { x: number; y: number };
    onImageMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
    isDragging?: boolean;
}

export const ShareableListCard = forwardRef<HTMLDivElement, ShareableListCardProps>(({ 
    names, 
    imagePreview,
    gender,
    imageZoom = 1,
    imagePosition = { x: 0, y: 0 },
    onImageMouseDown,
    isDragging = false
}, ref) => {
  const { t } = useLanguage();
  
  let bgClass = "bg-gradient-to-br from-[#e889b5] to-[#ffc4d6]";
  if (gender === 'Male') bgClass = "bg-gradient-to-br from-[#aab2a1] to-[#8da38d]";
  else if (gender === 'Any') bgClass = "bg-gradient-to-br from-[#d4c4e0] to-[#bca6c9]";

  const imageStyle: React.CSSProperties = {
    transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
    transition: isDragging ? 'none' : 'transform 0.1s linear',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: imagePreview ? 'grab' : 'default',
  };

  return (
    <div 
        ref={ref} 
        className={`${bgClass} p-8 pt-12 text-[#666666] flex flex-col items-center w-[480px] min-h-[750px] shadow-2xl overflow-visible relative select-none rounded-[3.5rem] border-4 border-white/30`}
        style={{ fontFamily: "'Fredoka', sans-serif" }}
    >
        <h2 className="text-4xl font-black text-center mb-6 text-white tracking-tight drop-shadow-lg uppercase relative z-20" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            {t.saved_names.shareable_title}
        </h2>
        <div className="w-full flex justify-center mb-8 relative z-20">
             <div className="relative w-[280px] h-[280px]">
                 <svg className="absolute -top-4 -left-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none z-30 drop-shadow-md" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 6,6 C 28,3 72,3 94,6 C 98,28 97,72 94,94 C 72,97 28,97 6,94 C 3,72 2,28 6,6 Z" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white/40 relative rounded-[2.5rem]" onMouseDown={onImageMouseDown}>
                     {imagePreview ? <img src={imagePreview} alt="My Pet" style={imageStyle} draggable="false" /> : <PetCharacter pet="cat" className="w-[180px] h-[180px] opacity-80" />}
                </div>
            </div>
        </div>
        <div className="flex-grow w-full z-10 px-2">
             <div className="bg-white/90 rounded-[2.5rem] p-8 border-2 border-white/60 shadow-xl">
                <h3 className="text-xl font-black text-center text-[#AA336A] uppercase tracking-[0.2em] mb-6 border-b-2 border-[#AA336A]/10 pb-2">{t.saved_names.shareable_picks}</h3>
                <ul className="space-y-4 text-center">
                    {names.map((name, i) => (
                        <li key={i} className="text-2xl font-black text-[#666666] tracking-tight">
                             <span className="opacity-40 text-xl mr-3">{i % 2 === 0 ? '✨' : '🐾'}</span>
                             {name}
                        </li>
                    ))}
                </ul>
             </div>
        </div>
        <div className="mt-8 mb-4 flex items-center gap-2 text-xs font-black text-white/90 tracking-[0.4em] uppercase z-20" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <span>{t.saved_names.shareable_footer}</span>
        </div>
    </div>
  );
});
ShareableListCard.displayName = "ShareableListCard";