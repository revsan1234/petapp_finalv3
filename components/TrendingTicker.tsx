import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const TRENDING_NAMES_EN = [
  "Buddy",
  "Archie",
  "Ollie",
  "Oscar",
  "Luna",
  "Milo",
  "Bear",
  "Nimbus",
  "Pixel",
  "Zephyr",
];

export const TrendingTicker: React.FC = () => {
  const { language } = useLanguage();
  const names = TRENDING_NAMES_EN; // Defaulting to the ones shown in the screenshot

  return (
    <div className="w-full trending-ticker-bar relative shadow-lg">
      <style>
        {`
                    @keyframes scroll-left {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .ticker-content {
                        display: flex;
                        width: max-content;
                        animation: scroll-left 40s linear infinite;
                    }
                `}
      </style>

      <div className="ticker-content">
        {[0, 1].map((setIndex) => (
          <div key={setIndex} className="flex items-center shrink-0">
            {names.map((name, index) => (
              <div key={`${setIndex}-${index}`} className="flex items-center">
                <span className="mx-6 text-white font-black text-2xl drop-shadow-md">
                  {name}
                </span>
                <span className="text-white/40 text-xl mx-2">
                  {index % 2 === 0 ? "❤️" : "✨"}
                </span>
                {index === 4 && (
                  <span className="mx-8 bg-[#AA336A] text-white px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
