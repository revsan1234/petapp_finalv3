
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AppLogo: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center justify-center gap-4">
        {/* iOS Glass Style Container */}
        <div className="relative group cursor-default">
            {/* Background Blur Layer */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition-all duration-300 group-hover:bg-white/20 group-hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]"></div>
            
            {/* Text Layer */}
            <h1 
              className="relative z-10 text-4xl lg:text-6xl font-black tracking-tight text-white px-8 py-3 drop-shadow-sm select-none"
            >
              {t.common.app_title}
            </h1>
        </div>
      </div>
    </div>
  );
};