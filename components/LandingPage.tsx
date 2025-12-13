
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
        className="flex flex-col items-center text-center rounded-3xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 border h-full w-full justify-start group gap-4 backdrop-blur-sm"
        style={{ 
            backgroundImage: 'linear-gradient(to bottom, var(--feature-bg-start), var(--feature-bg-end))',
            borderColor: 'var(--feature-border)'
        }}
    >
        <div className="drop-shadow-md flex items-center justify-center min-h-[6rem] group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <div className="flex flex-col gap-2 w-full">
            <h3 className="text-3xl font-black leading-none tracking-wide drop-shadow-sm min-h-[2.5rem] flex items-center justify-center" style={{ color: 'var(--feature-title)' }}>{title}</h3>
            <p className="text-lg font-bold leading-tight opacity-90" style={{ color: 'var(--feature-desc)' }}>{description}</p>
        </div>
    </button>
);

export const LandingPage: React.FC<LandingPageProps> = ({ setTab }) => {
    const { t } = useLanguage();

    const features = [
        {
            title: t.landing.feature1_title,
            description: t.landing.feature1_desc,
            icon: <PetCharacter pet="bird" className="w-24 h-24 filter drop-shadow-lg animate-bounce-wiggle" style={{ animationDelay: '0ms' }} />, 
            target: 'generate' as Tab
        },
        {
            title: t.landing.feature2_title,
            description: t.landing.feature2_desc,
            icon: <PetCharacter pet="rabbit" className="w-24 h-24 filter drop-shadow-lg animate-bounce-wiggle" style={{ animationDelay: '150ms' }} />, 
            target: 'bio' as Tab
        },
        {
            title: t.landing.feature3_title,
            description: t.landing.feature3_desc,
            icon: <PetCharacter pet="hamster" className="w-24 h-24 filter drop-shadow-lg animate-bounce-wiggle" style={{ animationDelay: '300ms' }} />, 
            target: 'play' as Tab
        },
        {
            title: t.landing.feature4_title,
            description: t.landing.feature4_desc,
            icon: <PetCharacter pet="lizard" className="w-24 h-24 filter drop-shadow-lg animate-bounce-wiggle" style={{ animationDelay: '450ms' }} />,
            target: 'photo' as Tab
        },
        {
            title: t.landing.feature5_title,
            description: t.landing.feature5_desc,
            icon: <PetCharacter pet="fish" className="w-24 h-24 filter drop-shadow-lg animate-bounce-wiggle" style={{ animationDelay: '600ms' }} />,
            target: 'adopt' as Tab
        },
        {
            title: t.landing.feature6_title,
            description: t.landing.feature6_desc,
            icon: <PetCharacter pet="ferret" className="w-24 h-24 filter drop-shadow-lg animate-bounce-wiggle" style={{ animationDelay: '750ms' }} />,
            target: 'partnerships' as Tab
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Header with click action to home - updated mascots to Dog and Cat */}
            <Header leftPet="dog" rightPet="cat" />
            
            <main className="py-4 px-4 pb-12">
                <div className="w-full mx-auto max-w-4xl animate-fade-in space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr">
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
