import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AppLogo: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-4">
        <h1 
          className="text-5xl lg:text-6xl font-bold tracking-tight text-white" 
          style={{ 
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {t.common.app_title}!
        </h1>
      </div>
    </div>
  );
};