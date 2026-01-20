import React, { forwardRef, MouseEvent } from "react";
import { PetCharacter } from "../assets/pets/PetCharacter";
import type { PetKind, PetGender } from "../../types";
import { useLanguage } from "../../contexts/LanguageContext";

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

export const BioCard = forwardRef<HTMLDivElement, BioCardProps>(
  (
    {
      imagePreview,
      petName,
      bio,
      defaultPetKind = "cat",
      imageZoom,
      imagePosition,
      onImageMouseDown,
      isDragging,
      gender = "Any",
    },
    ref,
  ) => {
    const { t } = useLanguage();

    const imageStyle: React.CSSProperties = {
      transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
      transition: isDragging ? "none" : "transform 0.1s linear",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    };

    let bgColor = "#d4c4e0";
    if (gender === "Male") bgColor = "#aab2a1";
    if (gender === "Female") bgColor = "#e889b5";

    return (
      <div
        ref={ref}
        style={{ backgroundColor: bgColor }}
        className="p-10 flex flex-col items-center w-full max-w-[500px] min-h-[700px] shadow-2xl rounded-[3.5rem] overflow-hidden relative border-[12px] border-white/20 select-none"
      >
        <h2 className="text-white text-7xl mb-8 tracking-tighter leading-none text-center font-heading drop-shadow-md">
          {petName || t.bio.card_pet_name_placeholder}
        </h2>

        <div className="flex flex-col items-center w-full flex-grow">
          <div className="relative w-full aspect-square max-w-[340px] shadow-2xl rounded-[2.5rem] overflow-hidden bg-black/10 border-4 border-white/10 mb-8">
            <div
              className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
              onMouseDown={onImageMouseDown}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={petName || "Your pet"}
                  className="pointer-events-none select-none"
                  style={imageStyle}
                  draggable="false"
                />
              ) : (
                <PetCharacter
                  pet="cat"
                  className="w-[80%] h-[80%] opacity-80 drop-shadow-2xl animate-bounce-wiggle"
                />
              )}
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center px-4 w-full">
            <p className="text-white text-3xl font-semibold text-center leading-snug drop-shadow-md font-heading">
              {bio || t.bio.fallback_bio}
            </p>
          </div>
        </div>

        <div className="mt-8 text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] font-heading">
          {t.bio.generated_by}
        </div>
      </div>
    );
  },
);

BioCard.displayName = "BioCard";
