import React, { forwardRef, MouseEvent } from 'react';
import { PetCharacter } from '../assets/pets/PetCharacter';
import type { PetKind, PetGender } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface BioCardProps {
  imagePreview: string | null;
  petName: string;
  bio: string | null;
  defaultPetKind?: PetKind;
  imageZoom: number;
  imagePosition: { x: number; y: number };
  onImageMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  gender?: PetGender;
}

export const BioCard = forwardRef<HTMLDivElement, BioCardProps>(({ 
    imagePreview, 
    petName, 
    bio, 
    defaultPetKind = 'cat',
    imageZoom,
    imagePosition,
    onImageMouseDown,
    isDragging,
    gender = 'Any',
}, ref) => {
  const { t } = useLanguage();
  
  const imageStyle: React.CSSProperties = {
    transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
    transition: isDragging ? 'none' : 'transform 0.1s linear',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  let bgClass = "bg-gradient-to-b from-[#e889b5] to-[#ffc4d6]"; // Female Default
  if (gender === 'Male') {
      bgClass = "bg-gradient-to-b from-[#aab2a1] to-[#8da38d]";
  } else if (gender === 'Any') {
      bgClass = "bg-gradient-to-b from-[#d4c4e0] to-[#bca6c9]";
  }

  return (
    <div 
        ref={ref} 
        className={`${bgClass} p-6 text-[#666666] flex flex-col items-center justify-between w-full max-w-[480px] min-h-[600px] shadow-2xl rounded-3xl overflow-hidden relative`}
        style={{ fontFamily: "'Fredoka', sans-serif" }} 
    >
        {/* HEADLINE */}
        <h2 className="text-6xl font-bold text-center text-white drop-shadow-md z-10 mt-4 tracking-wide leading-tight">{petName || t.bio.card_pet_name_placeholder}</h2>

        <div className="flex flex-col items-center gap-4 w-full z-10 flex-grow justify-center">
             {/* PHOTO FRAME */}
             <div className="relative w-72 h-72">
                 <div 
                    className="w-full h-full overflow-hidden flex items-center justify-center relative rounded-2xl bg-black/5"
                    onMouseDown={onImageMouseDown}
                  >
                     {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt={petName || 'Your pet'} 
                          className="pointer-events-none select-none"
                          style={imageStyle}
                          draggable="false"
                        />
                     ) : (
                        <PetCharacter pet="cat" className="w-full h-full opacity-80 p-4" />
                     )}
                </div>
            </div>

            <p className="text-2xl font-medium text-center leading-snug px-6 text-white drop-shadow-md flex items-center justify-center mt-4">
                {bio || t.bio.fallback_bio}
            </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-white/60 tracking-wider text-center z-10 mb-4">
            <span>{t.bio.generated_by}</span>
        </div>
    </div>
  );
});