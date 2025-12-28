import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AppLogo: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-4">
        <h1 
          className="text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-heading" 
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