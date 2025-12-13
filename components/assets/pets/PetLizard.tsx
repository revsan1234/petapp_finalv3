
import React from 'react';

export const PetLizard: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Anime Gecko/Lizard */}
      <g transform="translate(20, 20)">
        {/* Tail (Curled) */}
        <path d="M 110 120 Q 140 140 160 120 Q 170 90 150 80 Q 130 70 120 90" fill="none" stroke="#a3e635" strokeWidth="15" strokeLinecap="round"/>

        {/* Body */}
        <path d="M 70 70 Q 120 70 120 120 Q 110 150 70 140 Q 40 130 70 70" fill="#bef264" stroke="#65a30d" strokeWidth="3"/>

        {/* Head (Big) */}
        <path d="M 30 60 Q 10 80 30 100 Q 50 110 70 90 Q 80 60 60 40 Q 40 30 30 60 Z" fill="#a3e635" stroke="#65a30d" strokeWidth="3"/>

        {/* Eyes (Wide set) */}
        <circle cx="30" cy="65" r="10" fill="white" stroke="#65a30d" strokeWidth="1"/>
        <circle cx="32" cy="65" r="5" fill="#2d2d2d"/>
        <circle cx="34" cy="63" r="2" fill="white"/>

        <circle cx="65" cy="55" r="10" fill="white" stroke="#65a30d" strokeWidth="1"/>
        <circle cx="63" cy="55" r="5" fill="#2d2d2d"/>
        <circle cx="61" cy="53" r="2" fill="white"/>

        {/* Smile */}
        <path d="M 35 85 Q 45 95 55 80" fill="none" stroke="#65a30d" strokeWidth="2" strokeLinecap="round"/>

        {/* Feet (Sticky pads) */}
        <circle cx="80" cy="145" r="8" fill="#bef264" stroke="#65a30d" strokeWidth="2"/>
        <circle cx="110" cy="140" r="8" fill="#bef264" stroke="#65a30d" strokeWidth="2"/>
        <circle cx="120" cy="80" r="8" fill="#bef264" stroke="#65a30d" strokeWidth="2"/>

        {/* Spots */}
        <circle cx="90" cy="90" r="5" fill="#ecfccb"/>
        <circle cx="100" cy="110" r="6" fill="#ecfccb"/>
      </g>
    </svg>
  );
};
