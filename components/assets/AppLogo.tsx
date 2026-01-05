
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AppLogo: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-4 text-center max-w-full">
      <div className="flex items-center gap-4 max-w-full px-2">
        <h1 
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase font-heading leading-tight" 
          style={{ 
            textShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}
        >
          {t.common.app_title}
        </h1>
      </div>
    </div>
  );
};
