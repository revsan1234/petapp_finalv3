
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
        className={`${bgClass} p-8 text-[#666666] flex flex-col items-center justify-between w-[480px] min-h-[700px] shadow-2xl rounded-[3.5rem] overflow-hidden relative border-4 border-white/20`}
        style={{ fontFamily: "'Fredoka', sans-serif" }} 
    >
        <h2 className="text-6xl font-black text-center text-white drop-shadow-xl z-10 mt-8 tracking-tighter leading-[0.9] uppercase">
            {petName || t.bio.card_pet_name_placeholder}
        </h2>
        <div className="flex flex-col items-center gap-6 w-full z-10 flex-grow justify-center mt-4">
             <div className="relative w-[300px] h-[300px]">
                 <svg className="absolute -top-4 -left-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none z-30 drop-shadow-md" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 6,6 C 28,3 72,3 94,6 C 98,28 97,72 94,94 C 72,97 28,97 6,94 C 3,72 2,28 6,6 Z" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white/40 relative rounded-[2.5rem]" onMouseDown={onImageMouseDown}>
                     {imagePreview ? <img src={imagePreview} alt={petName || 'Your pet'} className="pointer-events-none select-none" style={imageStyle} draggable="false" /> : <PetCharacter pet="cat" className="w-full h-full opacity-80 p-12" />}
                </div>
            </div>
            <p className="text-2xl font-black text-center leading-tight px-6 text-white drop-shadow-md flex items-center justify-center tracking-tight">
                {bio || t.bio.fallback_bio}
            </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-black text-white/80 tracking-[0.4em] uppercase text-center z-10 mt-8 mb-4">
            <span>{t.bio.generated_by}</span>
        </div>
    </div>
  );
});