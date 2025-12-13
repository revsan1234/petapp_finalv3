
import React from 'react';

export const PetFish: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Anime Magical Fish */}
      <g transform="translate(10, 30)">
        {/* Top Fin (Flowy) */}
        <path d="M 90 40 Q 110 10 130 40 Q 110 50 90 40" fill="#8ae1fc" stroke="#4a90e2" strokeWidth="2" opacity="0.8"/>
        
        {/* Tail (Big and Flowy) */}
        <path d="M 140 80 Q 180 60 180 90 Q 170 110 140 100" fill="#8ae1fc" stroke="#4a90e2" strokeWidth="2" opacity="0.8"/>
        <path d="M 140 90 Q 180 100 170 130 Q 140 120 130 100" fill="#8ae1fc" stroke="#4a90e2" strokeWidth="2" opacity="0.8"/>

        {/* Body */}
        <path d="M 30 90 Q 60 50 100 70 Q 140 90 130 110 Q 100 130 60 110 Q 20 110 30 90 Z" fill="#ff9a9e" stroke="#d65d65" strokeWidth="3"/>

        {/* Scale Details */}
        <path d="M 60 80 Q 65 85 60 90" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5"/>
        <path d="M 70 75 Q 75 80 70 85" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5"/>
        <path d="M 70 95 Q 75 100 70 105" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5"/>

        {/* Side Fin */}
        <path d="M 80 100 Q 100 110 90 120 Q 70 110 80 100" fill="#fad0c4" stroke="#d65d65" strokeWidth="2" opacity="0.9"/>

        {/* Eye (Huge) */}
        <circle cx="60" cy="90" r="12" fill="#ffffff"/>
        <circle cx="62" cy="90" r="8" fill="#2d2d2d"/>
        <circle cx="65" cy="86" r="3" fill="white"/>
        
        {/* Mouth */}
        <path d="M 30 100 Q 25 105 30 110" fill="none" stroke="#d65d65" strokeWidth="2" strokeLinecap="round"/>

        {/* Bubbles */}
        <circle cx="20" cy="80" r="5" fill="none" stroke="#8ae1fc" strokeWidth="2"/>
        <circle cx="10" cy="60" r="3" fill="none" stroke="#8ae1fc" strokeWidth="2"/>
        <circle cx="25" cy="40" r="8" fill="none" stroke="#8ae1fc" strokeWidth="2"/>
      </g>
    </svg>
  );
};
