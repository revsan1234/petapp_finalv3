
import React from 'react';

export const PetOther: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
      {/* Mystery Box/Egg for 'Other' */}
      <g transform="translate(40, 40)">
         {/* Egg Shape */}
         <path d="M 60 10 Q 110 10 110 70 Q 110 130 60 130 Q 10 130 10 70 Q 10 10 60 10 Z" fill="#e0f7fa" stroke="#00bcd4" strokeWidth="3"/>

         {/* Question Mark */}
         <text x="60" y="90" textAnchor="middle" fontSize="80" fill="#00bcd4" fontFamily="sans-serif" fontWeight="bold">?</text>
         
         {/* Sparkles */}
         <path d="M 110 20 L 115 30 L 125 30 L 117 40 L 120 50 L 110 45 L 100 50 L 103 40 L 95 30 L 105 30 Z" fill="#ffd700" className="animate-pulse"/>
         <circle cx="20" cy="100" r="5" fill="#ff4081" opacity="0.6"/>
         <circle cx="100" cy="110" r="8" fill="#7c4dff" opacity="0.6"/>
      </g>
    </svg>
  );
};
