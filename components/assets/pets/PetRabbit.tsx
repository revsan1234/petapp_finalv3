
import React from 'react';

export const PetRabbit: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Anime Floppy Ear Bunny */}
      <g transform="translate(10, 20)">
        {/* Ears (Floppy) */}
        <path d="M 55 50 Q 20 40 20 90 Q 30 120 50 80" fill="#fff0f5" stroke="#8a7f8d" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M 125 50 Q 160 40 160 90 Q 150 120 130 80" fill="#fff0f5" stroke="#8a7f8d" strokeWidth="3" strokeLinejoin="round"/>
        
        {/* Inner Ear Color */}
        <path d="M 55 55 Q 35 50 35 80 Q 40 95 50 70" fill="#ffb7b2" opacity="0.6"/>
        <path d="M 125 55 Q 145 50 145 80 Q 140 95 130 70" fill="#ffb7b2" opacity="0.6"/>

        {/* Head */}
        <ellipse cx="90" cy="90" rx="55" ry="45" fill="#fff0f5" stroke="#8a7f8d" strokeWidth="3"/>

        {/* Eyes (Starry Anime Eyes) */}
        <circle cx="70" cy="90" r="8" fill="#3e3e3e"/>
        <circle cx="67" cy="87" r="3" fill="white"/>
        <circle cx="110" cy="90" r="8" fill="#3e3e3e"/>
        <circle cx="107" cy="87" r="3" fill="white"/>

        {/* Nose - Tiny X shape or Dot */}
        <path d="M 88 105 L 92 109 M 92 105 L 88 109" stroke="#ff9aa2" strokeWidth="2" strokeLinecap="round"/>

        {/* Mouth */}
        <path d="M 90 112 Q 85 118 80 115 M 90 112 Q 95 118 100 115" fill="none" stroke="#8a7f8d" strokeWidth="2" strokeLinecap="round"/>

        {/* Cheeks */}
        <circle cx="55" cy="105" r="8" fill="#ffb7b2" opacity="0.5"/>
        <circle cx="125" cy="105" r="8" fill="#ffb7b2" opacity="0.5"/>

        {/* Body (Tiny) */}
        <path d="M 60 125 Q 50 160 90 160 Q 130 160 120 125" fill="#fff0f5" stroke="#8a7f8d" strokeWidth="3"/>
        
        {/* Paws holding a carrot? or just paws */}
        <ellipse cx="80" cy="135" rx="8" ry="6" fill="white" stroke="#8a7f8d" strokeWidth="2"/>
        <ellipse cx="100" cy="135" rx="8" ry="6" fill="white" stroke="#8a7f8d" strokeWidth="2"/>
      </g>
    </svg>
  );
};
