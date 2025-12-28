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
    isDragging = false,
}, ref) => {
  const { t } = useLanguage();
  
  let bgClass = "bg-gradient-to-br from-[#e889b5] to-[#ffc4d6]"; // Female Default
  if (gender === 'Male') {
      bgClass = "bg-gradient-to-br from-[#aab2a1] to-[#8da38d]";
  } else if (gender === 'Any') {
      bgClass = "bg-gradient-to-br from-[#d4c4e0] to-[#bca6c9]";
  }

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
        className={`${bgClass} p-8 text-[#666666] flex flex-col items-center w-[400px] h-auto min-h-[700px] shadow-2xl overflow-visible relative select-none rounded-3xl`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
    >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-tight drop-shadow-md uppercase relative z-20">
            {t.saved_names.shareable_title}
        </h2>

        {/* Photo Section */}
        <div className="w-full flex justify-center mb-8 relative z-20 px-2">
             <div className="relative w-[370px] h-[370px]">
                 <div 
                    className="w-full h-full overflow-hidden flex items-center justify-center relative rounded-2xl bg-black/5"
                    onMouseDown={onImageMouseDown}
                 >
                     {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="My Pet" 
                          style={imageStyle}
                          draggable="false"
                        />
                     ) : (
                        <PetCharacter pet="cat" className="w-[200px] h-[200px] opacity-80" />
                     )}
                </div>
            </div>
        </div>

        {/* The List */}
        <div className="flex-grow w-full z-10 px-2">
             <div className="bg-white/80 rounded-xl p-6 border border-white/60 shadow-sm">
                <h3 className="text-lg font-bold text-center text-[#AA336A] uppercase tracking-widest mb-4">{t.saved_names.shareable_picks}</h3>
                <ul className="space-y-3 text-center">
                    {names.map((name, i) => (
                        <li key={i} className="text-2xl font-bold text-[#666666]">
                             {i % 2 === 0 ? '✨' : '🐾'} {name}
                        </li>
                    ))}
                </ul>
             </div>
        </div>

        {/* Footer */}
        <div className="mt-8 mb-2 flex items-center gap-2 text-xs font-bold text-white/80 tracking-wider z-20">
            <span>{t.saved_names.shareable_footer}</span>
        </div>
    </div>
  );
});

ShareableListCard.displayName = "ShareableListCard";