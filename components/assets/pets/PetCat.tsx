
import React from 'react';

export const PetCat: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
      {/* Kawaii Anime Cat (Round Loaf Style) */}
      <g transform="translate(10, 15)">
         {/* Ears */}
         <path d="M 45 60 L 40 20 L 80 50 Z" fill="#a8a0b0" stroke="#5e5663" strokeWidth="3" strokeLinejoin="round"/>
         <path d="M 135 60 L 140 20 L 100 50 Z" fill="#a8a0b0" stroke="#5e5663" strokeWidth="3" strokeLinejoin="round"/>
         <path d="M 48 55 L 45 30 L 70 52 Z" fill="#ffd1dc"/>
         <path d="M 132 55 L 135 30 L 110 52 Z" fill="#ffd1dc"/>

         {/* Head/Body Blob */}
         <ellipse cx="90" cy="95" rx="65" ry="55" fill="#e6e1eb" stroke="#5e5663" strokeWidth="3"/>

         {/* Patches */}
         <path d="M 90 40 Q 110 40 120 60 Q 100 70 90 40" fill="#a8a0b0"/>
         
         {/* Eyes (Big Anime Style) */}
         <g transform="translate(0, 5)">
             <circle cx="65" cy="90" r="11" fill="#2d2d2d"/>
             <circle cx="60" cy="85" r="4" fill="white"/>
             <circle cx="68" cy="95" r="2" fill="white"/>

             <circle cx="115" cy="90" r="11" fill="#2d2d2d"/>
             <circle cx="110" cy="85" r="4" fill="white"/>
             <circle cx="118" cy="95" r="2" fill="white"/>
         </g>

         {/* Nose & Mouth */}
         <path d="M 86 108 Q 90 112 94 108" fill="#ff9eb5" stroke="#ff9eb5" strokeWidth="1"/>
         <path d="M 90 112 L 90 118 M 90 118 Q 82 125 78 120 M 90 118 Q 98 125 102 120" fill="none" stroke="#5e5663" strokeWidth="2" strokeLinecap="round"/>

         {/* Whiskers */}
         <line x1="45" y1="105" x2="20" y2="100" stroke="#5e5663" strokeWidth="2" strokeLinecap="round"/>
         <line x1="45" y1="115" x2="25" y2="118" stroke="#5e5663" strokeWidth="2" strokeLinecap="round"/>
         <line x1="135" y1="105" x2="160" y2="100" stroke="#5e5663" strokeWidth="2" strokeLinecap="round"/>
         <line x1="135" y1="115" x2="155" y2="118" stroke="#5e5663" strokeWidth="2" strokeLinecap="round"/>

         {/* Paws (tucked in) */}
         <ellipse cx="70" cy="145" rx="12" ry="8" fill="white" stroke="#5e5663" strokeWidth="2"/>
         <ellipse cx="110" cy="145" rx="12" ry="8" fill="white" stroke="#5e5663" strokeWidth="2"/>

         {/* Tail */}
         <path d="M 140 120 Q 170 110 170 80 Q 170 60 155 65" fill="none" stroke="#a8a0b0" strokeWidth="12" strokeLinecap="round"/>
      </g>
    </svg>
  );
};
