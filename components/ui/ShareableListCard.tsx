
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
        className={`${bgClass} p-8 pt-12 text-[#666666] flex flex-col items-center justify-start w-[500px] min-h-[750px] shadow-2xl overflow-visible relative select-none rounded-[4rem] border-4 border-white/40`}
        style={{ fontFamily: "'Fredoka', sans-serif" }}
    >
        {/* Title - Raised higher with increased tracking */}
        <h2 className="text-5xl font-bold text-center mb-8 text-white tracking-[0.18em] drop-shadow-2xl uppercase relative z-20" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            {t.saved_names.shareable_title}
        </h2>
        
        <div className="w-full flex justify-center mb-10 relative z-20">
             {/* PHOTO CONTAINER - Removed SVG frame */}
             <div className="relative w-[380px] h-[380px]">
                 <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white/40 relative rounded-[3rem] shadow-inner border-2 border-white/20" onMouseDown={onImageMouseDown}>
                     {imagePreview ? <img src={imagePreview} alt="My Pet" style={imageStyle} draggable="false" /> : <PetCharacter pet="cat" className="w-[240px] h-[240px] opacity-80" />}
                </div>
            </div>
        </div>
        
        <div className="flex-grow w-full z-10 px-4 mb-4">
             <div className="bg-white/90 rounded-[3rem] p-8 border-2 border-white/60 shadow-2xl">
                <h3 className="text-xl font-bold text-center text-[#AA336A] uppercase tracking-[0.2em] mb-6 border-b-2 border-[#AA336A]/10 pb-2">{t.saved_names.shareable_picks}</h3>
                <ul className="space-y-4 text-center">
                    {names.map((name, i) => (
                        <li key={i} className="text-2xl font-normal text-[#666666] tracking-normal">
                             <span className="opacity-40 text-xl mr-3">{i % 2 === 0 ? '✨' : '🐾'}</span>
                             {name}
                        </li>
                    ))}
                </ul>
             </div>
        </div>
        
        <div className="mt-auto mb-4 flex items-center gap-2 text-[10px] font-medium text-white/90 tracking-[0.5em] uppercase z-20" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <span>{t.saved_names.shareable_footer}</span>
        </div>
    </div>
  );
});
ShareableListCard.displayName = "ShareableListCard";