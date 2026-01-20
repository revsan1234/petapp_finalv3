import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export const AppLogo: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center max-w-full">
      <div className="flex items-center max-w-full px-4">
        <h1
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase font-heading leading-none whitespace-nowrap"
          style={{
            textShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          {t.common.app_title}
        </h1>
      </div>
    </div>
  );
};
