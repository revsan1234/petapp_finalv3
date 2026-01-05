
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AppLogo: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center max-w-full">
      <div className="flex items-center max-w-full">
        <h1 
          className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase font-heading leading-none whitespace-nowrap" 
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
