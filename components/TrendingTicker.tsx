import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TRENDING_NAMES_EN = [
    "Luna", "Milo", "Bear", "Nimbus", "Pixel", "Zephyr", "Mochi", "Nova", "Cleo", "Loki", "Sage", "Willow", "Koda", "Hazel",
    "Gizmo", "Nala", "Simba", "Coco", "Bella", "Charlie", "Max", "Daisy", "Rocky", "Buddy", "Archie", "Ollie", "Oscar"
];

const TRENDING_NAMES_ES = [
    "Luna", "Coco", "Thor", "Nala", "Kira", "Simba", "Bruno", "Lola", "Bimba", "Leo", "Mia", "Max", "Rocky", "Zeus",
    "Toby", "Chispa", "Manchitas", "Canela", "Pelusa", "Duque", "Princesa", "Chiquito", "Gordo", "Linda", "Sol", "Pepe"
];

export const TrendingTicker: React.FC = () => {
    const { language } = useLanguage();
    const names = language === 'es' ? TRENDING_NAMES_ES : TRENDING_NAMES_EN;

    return (
        <div className="w-full bg-[#AA336A]/20 backdrop-blur-sm border-y border-white/10 overflow-hidden py-3 mb-4 relative">
            {/* 
                Self-contained CSS for the seamless scrolling animation. 
                This ensures the ticker works robustly regardless of external stylesheets.
            */}
            <style>
                {`
                    @keyframes scroll-left {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .ticker-content {
                        display: flex;
                        width: max-content;
                        /* 80s duration for a very slow, relaxed pace */
                        animation: scroll-left 80s linear infinite;
                    }
                    /* Pause the animation when the user hovers over it to read */
                    .ticker-content:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>
            
            <div className="ticker-content">
                {/* We render the list twice to create a seamless loop effect */}
                {[0, 1].map((setIndex) => (
                    <div key={setIndex} className="flex items-center shrink-0">
                        <span className="text-white font-bold mx-6 bg-[#AA336A] px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-sm">
                            🔥 {language === 'es' ? 'TENDENCIA' : 'LIVE'}
                        </span>
                        {names.map((name, index) => (
                            <div key={`${setIndex}-${index}`} className="flex items-center group cursor-default">
                                <span className="mx-4 text-white font-bold text-lg drop-shadow-sm group-hover:scale-110 transition-transform">
                                    {name}
                                </span>
                                <span className="text-white/60 text-xs mr-4">
                                    {index % 3 === 0 ? '✨' : index % 3 === 1 ? '🐾' : '❤️'}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};