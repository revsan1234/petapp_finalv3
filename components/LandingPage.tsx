import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Tab } from '../types';
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
    isDimmed?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onClick, isDimmed }) => (
    <button 
        onClick={isDimmed ? undefined : onClick}
        className={`flex flex-col items-center text-center rounded-3xl p-5 sm:p-6 shadow-md border border-[#EBE5D5] h-full w-full justify-start group gap-4 transition-all duration-300 ${isDimmed ? 'opacity-70 cursor-default bg-gray-50' : 'hover:scale-[1.03] hover:shadow-xl active:scale-95 bg-[#FFF8E7]'} text-[#5D4037] select-none min-h-[220px]`}
    >
        <div className={`transform transition-transform duration-500 ${isDimmed ? '' : 'group-hover:-translate-y-2'}`}>
            <div className="flex items-center justify-center h-24 sm:h-28 w-24 sm:w-28 mb-1">
                {icon}
            </div>
        </div>
        
        <div className="flex flex-col gap-2 w-full flex-grow">
            <h3 className={`text-2xl sm:text-3xl font-bold leading-tight tracking-tight ${isDimmed ? 'text-gray-400' : 'text-[var(--text-main)]'}`}>
                {title}
            </h3>
            <p className={`text-lg font-medium leading-relaxed ${isDimmed ? 'text-[#AA336A] italic font-bold' : 'text-[#666666] opacity-80'}`}>
                {description}
            </p>
        </div>
    </button>
);

export const LandingPage: React.FC<LandingPageProps> = ({ setTab }) => {
    const { t } = useLanguage();
    const [isLimitReached, setIsLimitReached] = useState(false);

    useEffect(() => {
        const lastGen = localStorage.getItem('petapp_last_image_gen');
        const today = new Date().toDateString();
        if (lastGen === today) setIsLimitReached(true);
    }, []);

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
            description: isLimitReached ? t.landing.feature4_desc_used : t.landing.feature4_desc,
            icon: <PetCharacter pet="lizard" className={`w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-md ${isLimitReached ? 'grayscale opacity-30' : ''}`} />,
            target: 'photo' as Tab,
            isDimmed: isLimitReached
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
            target: 'hotel' as Tab
        }
    ];

    return (
        <div className="relative min-h-[100dvh] overflow-hidden">
            <Header leftPet="dog" rightPet="cat" />
            
            <main className="py-2 px-4 pb-24">
                <div className="w-full mx-auto max-w-4xl animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr">
                        {features.map((feature, index) => (
                            <FeatureCard 
                                key={index}
                                title={feature.title}
                                description={feature.description}
                                icon={feature.icon}
                                onClick={() => setTab(feature.target)}
                                isDimmed={feature.isDimmed}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};