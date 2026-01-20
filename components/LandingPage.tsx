import React from "react";
import { Header } from "./Header";
import { Tab } from "./layout/TabNavigator";
import { PetCharacter } from "./assets/pets/PetCharacter";
import { useLanguage } from "../contexts/LanguageContext";

interface LandingPageProps {
  setTab: (tab: Tab) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center text-center rounded-[2.5rem] p-10 sm:p-12 transition-all duration-500 bg-[#fffdf2] hover:scale-[1.03] active:scale-95 border-none outline-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.15)]"
  >
    <div className="mb-8 transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500">
      <div className="h-32 w-32 sm:h-40 sm:w-40 flex items-center justify-center filter drop-shadow-2xl">
        {icon}
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <h3 className="text-2xl sm:text-3xl font-semibold text-[#333] font-heading leading-tight tracking-tight uppercase">
        {title}
      </h3>
      <p className="text-base sm:text-lg font-medium text-[#333]/70 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
    </div>
  </button>
);

export const LandingPage: React.FC<LandingPageProps> = ({ setTab }) => {
  const { t } = useLanguage();

  const features = [
    {
      title: t.landing.feature1_title,
      desc: t.landing.feature1_desc,
      pet: "dog",
      target: "generate" as Tab,
    },
    {
      title: t.landing.feature2_title,
      desc: t.landing.feature2_desc,
      pet: "cat",
      target: "bio" as Tab,
    },
    {
      title: t.landing.feature3_title,
      desc: t.landing.feature3_desc,
      pet: "hamster",
      target: "play" as Tab,
    },
    {
      title: t.landing.feature4_title,
      desc: t.landing.feature4_desc,
      pet: "lizard",
      target: "photo" as Tab,
    },
    {
      title: t.landing.feature5_title,
      desc: t.landing.feature5_desc,
      pet: "rabbit",
      target: "adopt" as Tab,
    },
    {
      title: t.landing.feature6_title,
      desc: t.landing.feature6_desc,
      pet: "bird",
      target: "hotels" as Tab,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <Header leftPet="dog" rightPet="cat" />
      <main className="py-12 px-6 pb-48 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
          {features.map((f, i) => (
            <FeatureCard
              key={i}
              title={f.title}
              description={f.desc}
              icon={
                <PetCharacter pet={f.pet as any} className="w-full h-full" />
              }
              onClick={() => setTab(f.target)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
