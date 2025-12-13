
import React from 'react';

export const PetHamster: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
      {/* Anime Hamster (Chubby Cheeks) */}
      <g transform="translate(25, 25)">
        {/* Ears */}
        <circle cx="40" cy="40" r="15" fill="#eec170" stroke="#8c6a3e" strokeWidth="3"/>
        <circle cx="110" cy="40" r="15" fill="#eec170" stroke="#8c6a3e" strokeWidth="3"/>
        <circle cx="40" cy="40" r="8" fill="#ffcfd2"/>
        <circle cx="110" cy="40" r="8" fill="#ffcfd2"/>

        {/* Body/Head Combined */}
        <path d="M 75 25 Q 135 25 135 85 Q 145 110 135 135 Q 115 155 75 155 Q 35 155 15 135 Q 5 110 15 85 Q 15 25 75 25 Z" fill="#f2d0a4" stroke="#8c6a3e" strokeWidth="3"/>
        
        {/* White Belly Patch */}
        <ellipse cx="75" cy="115" rx="35" ry="30" fill="#fff8e7"/>

        {/* Eyes */}
        <circle cx="50" cy="75" r="7" fill="#2d2d2d"/>
        <circle cx="48" cy="73" r="3" fill="white"/>
        
        <circle cx="100" cy="75" r="7" fill="#2d2d2d"/>
        <circle cx="98" cy="73" r="3" fill="white"/>

        {/* Nose */}
        <path d="M 72 85 L 78 85 L 75 90 Z" fill="#ff9aa2"/>

        {/* Mouth */}
        <path d="M 75 90 L 75 95 M 75 95 Q 70 100 65 95 M 75 95 Q 80 100 85 95" fill="none" stroke="#8c6a3e" strokeWidth="2" strokeLinecap="round"/>

        {/* Hands holding a seed */}
        <ellipse cx="65" cy="105" rx="8" ry="6" fill="#f2d0a4" stroke="#8c6a3e" strokeWidth="2"/>
        <ellipse cx="85" cy="105" rx="8" ry="6" fill="#f2d0a4" stroke="#8c6a3e" strokeWidth="2"/>
        
        {/* Sunflower Seed */}
        <path d="M 75 95 Q 82 105 75 115 Q 68 105 75 95" fill="#555" stroke="black" strokeWidth="1"/>

        {/* Feet */}
        <ellipse cx="55" cy="150" rx="10" ry="6" fill="#ffcfd2" stroke="#8c6a3e" strokeWidth="2"/>
        <ellipse cx="95" cy="150" rx="10" ry="6" fill="#ffcfd2" stroke="#8c6a3e" strokeWidth="2"/>

        {/* Whiskers */}
        <line x1="25" y1="80" x2="5" y2="75" stroke="#8c6a3e" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="25" y1="85" x2="5" y2="88" stroke="#8c6a3e" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="125" y1="80" x2="145" y2="75" stroke="#8c6a3e" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="125" y1="85" x2="145" y2="88" stroke="#8c6a3e" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
};
