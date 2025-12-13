
import React from 'react';

export const PetFerret: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
      {/* Anime Ferret (Noodle) */}
      <g transform="translate(10, 20)">
        {/* Long Body (S shape) */}
        <path d="M 120 40 Q 160 40 160 80 Q 160 120 120 120 Q 80 120 80 150 Q 80 170 110 170" fill="none" stroke="#d7ccc8" strokeWidth="35" strokeLinecap="round"/>
        
        {/* Head */}
        <circle cx="110" cy="40" r="35" fill="#d7ccc8" stroke="#8d6e63" strokeWidth="3"/>
        
        {/* Ears */}
        <circle cx="85" cy="25" r="10" fill="#8d6e63"/>
        <circle cx="135" cy="25" r="10" fill="#8d6e63"/>

        {/* Bandit Mask */}
        <path d="M 85 40 Q 110 30 135 40 Q 135 55 110 55 Q 85 55 85 40 Z" fill="#5d4037"/>

        {/* Eyes */}
        <circle cx="100" cy="42" r="4" fill="white"/>
        <circle cx="120" cy="42" r="4" fill="white"/>

        {/* Nose */}
        <circle cx="110" cy="58" r="4" fill="#ffab91"/>

        {/* Mouth */}
        <path d="M 110 62 L 110 65 M 105 68 Q 110 72 115 68" fill="none" stroke="#5d4037" strokeWidth="2" strokeLinecap="round"/>

        {/* Paws */}
        <circle cx="90" cy="110" r="12" fill="#5d4037"/>
        <circle cx="150" cy="90" r="12" fill="#5d4037"/>
        <circle cx="90" cy="170" r="12" fill="#5d4037"/>
        <circle cx="130" cy="170" r="12" fill="#5d4037"/>
        
        {/* Tail */}
        <path d="M 110 170 Q 140 170 160 150" fill="none" stroke="#8d6e63" strokeWidth="15" strokeLinecap="round"/>
      </g>
    </svg>
  );
};
