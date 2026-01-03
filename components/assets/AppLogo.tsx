
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AppLogo: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-full">
      <div className="flex items-center gap-4 max-w-full px-2">
        <h1 
          className="text-[1.1rem] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase font-heading leading-tight" 
          style={{ 
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          {t.common.app_title}
        </h1>
      </div>
    </div>
  );
};
