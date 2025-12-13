
import React from 'react';

export const PetDog: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
      {/* Kawaii Anime Dog (Shiba style) */}
      <g transform="translate(10, 10)">
        {/* Ears */}
        <path d="M 40 60 L 30 20 Q 50 10 70 40 Z" fill="#e8c4a0" stroke="#8d6e53" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M 140 60 L 150 20 Q 130 10 110 40 Z" fill="#e8c4a0" stroke="#8d6e53" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M 42 55 L 36 28 Q 48 22 60 45 Z" fill="#fcede1"/>
        <path d="M 138 55 L 144 28 Q 132 22 120 45 Z" fill="#fcede1"/>

        {/* Face Shape */}
        <path d="M 30 90 Q 20 140 90 150 Q 160 140 150 90 Q 145 40 90 40 Q 35 40 30 90 Z" fill="#e8c4a0" stroke="#8d6e53" strokeWidth="3"/>
        
        {/* White Face Markings */}
        <path d="M 90 150 Q 50 145 40 100 Q 45 80 60 80 Q 75 80 90 100 Q 105 80 120 80 Q 135 80 140 100 Q 130 145 90 150 Z" fill="#fcede1"/>

        {/* Eyes (Anime Style) */}
        <ellipse cx="65" cy="95" rx="9" ry="12" fill="#4a3b32"/>
        <circle cx="68" cy="90" r="4" fill="white"/>
        <circle cx="62" cy="98" r="2" fill="white" opacity="0.7"/>

        <ellipse cx="115" cy="95" rx="9" ry="12" fill="#4a3b32"/>
        <circle cx="118" cy="90" r="4" fill="white"/>
        <circle cx="112" cy="98" r="2" fill="white" opacity="0.7"/>

        {/* Eyebrows */}
        <path d="M 55 75 Q 65 70 75 75" fill="none" stroke="#8d6e53" strokeWidth="3" strokeLinecap="round"/>
        <path d="M 105 75 Q 115 70 125 75" fill="none" stroke="#8d6e53" strokeWidth="3" strokeLinecap="round"/>

        {/* Nose & Mouth */}
        <ellipse cx="90" cy="110" rx="6" ry="4" fill="#4a3b32"/>
        <path d="M 90 114 L 90 122 M 90 122 Q 80 130 75 125 M 90 122 Q 100 130 105 125" fill="none" stroke="#4a3b32" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Blush */}
        <ellipse cx="50" cy="110" rx="10" ry="6" fill="#ffb6c1" opacity="0.6"/>
        <ellipse cx="130" cy="110" rx="10" ry="6" fill="#ffb6c1" opacity="0.6"/>

        {/* Sparkles */}
        <path d="M 160 60 L 162 65 L 167 67 L 162 69 L 160 74 L 158 69 L 153 67 L 158 65 Z" fill="#ffd700" className="animate-pulse"/>
      </g>
    </svg>
  );
};
