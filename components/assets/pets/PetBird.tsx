
import React from 'react';

export const PetBird: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Anime "Birb" (Round Cockatiel/Parakeet style) */}
      <g transform="translate(20, 20)">
        
        {/* Tail Feathers */}
        <path d="M 60 120 L 40 150 L 70 140 Z" fill="#a2d2ff" stroke="#5d737e" strokeWidth="2" strokeLinejoin="round"/>

        {/* Body (The Orb) */}
        <circle cx="80" cy="80" r="55" fill="#bde0fe" stroke="#5d737e" strokeWidth="3"/>
        
        {/* Belly Patch */}
        <ellipse cx="80" cy="100" rx="35" ry="25" fill="#eaf4f4"/>

        {/* Crest / Hair */}
        <path d="M 80 25 Q 90 10 100 30 Q 110 15 110 40" fill="none" stroke="#bde0fe" strokeWidth="8" strokeLinecap="round"/>
        <path d="M 80 25 Q 90 10 100 30 Q 110 15 110 40" fill="none" stroke="#5d737e" strokeWidth="2" strokeLinecap="round"/>

        {/* Wing */}
        <path d="M 35 90 Q 25 110 55 110 Q 65 90 35 90" fill="#a2d2ff" stroke="#5d737e" strokeWidth="2"/>

        {/* Eyes */}
        <circle cx="60" cy="70" r="6" fill="#2b2d42"/>
        <circle cx="58" cy="68" r="2" fill="white"/>
        
        <circle cx="100" cy="70" r="6" fill="#2b2d42"/>
        <circle cx="98" cy="68" r="2" fill="white"/>

        {/* Rosy Cheeks (Cockatiel style) */}
        <circle cx="45" cy="80" r="8" fill="#ffafcc" opacity="0.8"/>
        <circle cx="115" cy="80" r="8" fill="#ffafcc" opacity="0.8"/>

        {/* Beak */}
        <path d="M 75 80 L 80 88 L 85 80 Z" fill="#ffc8dd" stroke="#5d737e" strokeWidth="1.5" strokeLinejoin="round"/>

        {/* Feet */}
        <path d="M 70 135 L 70 145 L 65 150 M 70 145 L 75 150" stroke="#ffafcc" strokeWidth="3" strokeLinecap="round"/>
        <path d="M 90 135 L 90 145 L 85 150 M 90 145 L 95 150" stroke="#ffafcc" strokeWidth="3" strokeLinecap="round"/>

        {/* Music Note (Singing) */}
        <path d="M 140 50 L 140 30 L 155 35 L 155 55" fill="none" stroke="#ffafcc" strokeWidth="2"/>
        <ellipse cx="135" cy="55" rx="6" ry="4" fill="#ffafcc" transform="rotate(-20 135 55)"/>
        <ellipse cx="150" cy="60" rx="6" ry="4" fill="#ffafcc" transform="rotate(-20 150 60)"/>
        <path d="M 140 30 L 155 35" stroke="#ffafcc" strokeWidth="4"/>
      </g>
    </svg>
  );
};
