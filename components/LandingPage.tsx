import React from 'react';
import { Header } from './Header';
import { Tab } from './layout/TabNavigator';
import { PetCharacter } from './assets/pets/PetCharacter';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
    setTab: (tab: Tab) => void;
}

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onClick }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center text-center rounded-[2.5rem] p-6 sm:p-8 shadow-md border-2 border-white/40 h-full w-full justify-start group gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-[#AA336A]/30 active:scale-95 bg-[var(--card-bg)] backdrop-blur-md text-[#5D4037] select-none min-h-[220px] focus:outline-none focus:ring-4 focus:ring-[#AA336A]/20"
    >
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110">
            <div className="flex items-center justify-center h-24 sm:h-28 w-24 sm:w-28 mb-1">
                {icon}
            </div>
        </div>
        
        <div className="flex flex-col gap-2 w-full flex-grow">
            <h3 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[var(--text-main)] group-hover:text-[#AA336A] transition-colors">
                {title}
            </h3>
            <p className="text-lg font-bold leading-relaxed text-[#333333] opacity-80 group-hover:opacity-100 transition-opacity px-2">
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
            description: t.landing.feature1_desc,
            icon: <PetCharacter pet="dog" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-md" />, 
            target: 'generate' as Tab
        },
        {
            title: t.landing.feature2_title,
            description: t.landing.feature2_desc,
            icon: <PetCharacter pet="cat" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-md" />, 
            target: 'bio' as Tab
        },
        {
            title: t.landing.feature3_title,
            description: t.landing.feature3_desc,
            icon: <PetCharacter pet="hamster" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-md" />, 
            target: 'play' as Tab
        },
        {
            title: t.landing.feature4_title,
            description: t.landing.feature4_desc,
            icon: <PetCharacter pet="lizard" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-md" />,
            target: 'photo' as Tab
        },
        {
            title: t.landing.feature5_title,
            description: t.landing.feature5_desc,
            icon: <PetCharacter pet="rabbit" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-md" />,
            target: 'adopt' as Tab
        },
        {
            title: t.landing.feature6_title,
            description: t.landing.feature6_desc,
            icon: <PetCharacter pet="bird" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-md" />,
            target: 'partnerships' as Tab
        }
    ];

    return (
        <div className="relative min-h-[100dvh] overflow-hidden">
            <Header leftPet="dog" rightPet="cat" />
            
            <main className="py-6 px-4 pb-24">
                <div className="w-full mx-auto max-w-4xl animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 auto-rows-fr">
                        {features.map((feature, index) => (
                            <FeatureCard 
                                key={index}
                                title={feature.title}
                                description={feature.description}
                                icon={feature.icon}
                                onClick={() => setTab(feature.target)}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};