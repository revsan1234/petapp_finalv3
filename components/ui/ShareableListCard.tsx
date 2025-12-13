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
  
  let bgClass = "bg-gradient-to-br from-[#e889b5] to-[#ffc4d6]"; // Female Default
  if (gender === 'Male') {
      bgClass = "bg-gradient-to-br from-[#aab2a1] to-[#8da38d]";
  } else if (gender === 'Any') {
      // Light purple/grey hue for Any
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
        className={`${bgClass} p-8 text-[#666666] flex flex-col items-center w-[400px] h-auto min-h-[650px] shadow-2xl overflow-visible relative select-none rounded-3xl`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
    >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-tight drop-shadow-md uppercase relative z-20">
            {t.saved_names.shareable_title}
        </h2>

        {/* Photo Section - FLUID HAND DRAWN FRAME */}
        <div className="w-full flex justify-center mb-8 relative z-20">
             {/* Resized to be smaller: 150px to ensure title is not cut off on download */}
             <div className="relative w-[150px] h-[150px]">
                 {/* Hand Drawn Border SVG - Fluid Look */}
                 <svg 
                    className="absolute -top-2 -left-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none z-30 drop-shadow-md" 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                 >
                    <path 
                        d="M 6,6 C 28,3 72,3 94,6 C 98,28 97,72 94,94 C 72,97 28,97 6,94 C 3,72 2,28 6,6 Z" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                 </svg>
                 
                 <div 
                    className="w-full h-full overflow-hidden flex items-center justify-center bg-white/30 relative rounded-2xl"
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
                        <PetCharacter pet="cat" className="w-[100px] h-[100px] opacity-80" />
                     )}
                </div>
            </div>
        </div>

        {/* The List - Removed backdrop-blur for iOS compatibility */}
        <div className="flex-grow w-full z-10">
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