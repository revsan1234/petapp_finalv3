
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

  let bgClass = "bg-gradient-to-b from-[#e889b5] to-[#ffc4d6]";
  if (gender === 'Male') bgClass = "bg-gradient-to-b from-[#aab2a1] to-[#8da38d]";
  else if (gender === 'Any') bgClass = "bg-gradient-to-b from-[#d4c4e0] to-[#bca6c9]";

  return (
    <div 
        ref={ref} 
        className={`${bgClass} p-6 pt-12 text-[#666666] flex flex-col items-center justify-start w-[500px] min-h-[650px] shadow-2xl rounded-[3rem] overflow-hidden relative border-4 border-white/40`}
        style={{ fontFamily: "'Fredoka', sans-serif" }} 
    >
        {/* PET NAME - Positioned high with wide tracking */}
        <h2 className="text-6xl font-bold text-center text-white drop-shadow-2xl z-10 mt-0 mb-8 tracking-[0.18em] leading-none uppercase">
            {petName || t.bio.card_pet_name_placeholder}
        </h2>

        <div className="flex flex-col items-center gap-6 w-full z-10">
             {/* PHOTO CONTAINER - Removed SVG frame to fix "two lines" issue */}
             <div className="relative w-[420px] h-[420px]">
                 <div 
                    className="w-full h-full overflow-hidden flex items-center justify-center bg-white/40 relative rounded-[3rem] shadow-inner border-2 border-white/20"
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
                        <PetCharacter pet={defaultPetKind} className="w-full h-full opacity-80 p-16" />
                     )}
                </div>
            </div>

            {/* BIO TEXT */}
            <p className="text-2xl font-normal text-center leading-relaxed px-8 text-white drop-shadow-lg flex items-center justify-center tracking-tight mt-6">
                {bio || t.bio.fallback_bio}
            </p>
        </div>

        {/* FOOTER */}
        <div className="flex items-center gap-2 text-[10px] font-medium text-white/90 tracking-[0.5em] uppercase text-center z-10 mt-auto mb-4">
            <span>{t.bio.generated_by}</span>
        </div>
    </div>
  );
});