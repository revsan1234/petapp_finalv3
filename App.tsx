import React, { useState, useEffect } from 'react';
import { Partnerships } from './components/Partnerships';
import { MainView } from './components/MainView';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { TabNavigator } from './components/layout/TabNavigator';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { BioScreen } from './components/screens/BioScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { LandingPage } from './components/LandingPage';
import { BlogScreen } from './components/screens/BlogScreen';
import { ContactUs } from './components/screens/ContactUs';
import { GeneratedName, PetInfo, Tab } from './types';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { CustomCursor } from './components/ui/CustomCursor';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

export const BackToHomeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const { t } = useLanguage();
    return (
        <button 
            onClick={onClick} 
            className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30 active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            {t.common.back_home}
        </button>
    );
};

type View = 'app' | 'privacy' | 'terms' | 'contact' | 'blog';

const AppContent: React.FC = () => {
    const [view, setView] = useState<View>('app');
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isChillMode, setIsChillMode] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        if (isChillMode) document.body.classList.add('chill-mode');
        else document.body.classList.remove('chill-mode');
    }, [isChillMode]);

    const [savedNames, setSavedNames] = useState<GeneratedName[]>(() => {
        try {
            const saved = localStorage.getItem('mySavedNames');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    const [petInfo, setPetInfo] = useState<PetInfo>({
        type: 'Dog', gender: 'Any', personality: 'Playful', style: 'Trending',
    });
    const [imageForBio, setImageForBio] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('mySavedNames', JSON.stringify(savedNames));
    }, [savedNames]);

    const handleSetTab = (tab: Tab) => { setView('app'); setActiveTab(tab); window.scrollTo(0, 0); };
    const goHome = () => { handleSetTab('home'); };

    const addSavedName = (name: GeneratedName) => {
        setSavedNames((prev) => prev.find(n => n.id === name.id) ? prev : [...prev, name]);
    };
    const removeSavedName = (nameId: string) => { setSavedNames((prev) => prev.filter(n => n.id !== nameId)); };

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'home': return <LandingPage setTab={handleSetTab} />;
            case 'generate': return <MainView savedNames={savedNames} addSavedName={addSavedName} removeSavedName={removeSavedName} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
            case 'bio': return <BioScreen petInfo={petInfo} imageForBio={imageForBio} setImageForBio={setImageForBio} goHome={goHome} />;
            case 'play': return <PlayScreen onQuizComplete={(res) => setPetInfo(p => ({...p, ...res.keywords}))} savedNames={savedNames} addSavedName={addSavedName} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
            case 'photo': return <PhotoScreen setActiveTab={handleSetTab} setImageForBio={setImageForBio} goHome={goHome} />;
            case 'adopt': return <AdoptScreen goHome={goHome} />;
            case 'partnerships': return <Partnerships goHome={goHome} />;
            default: return <LandingPage setTab={handleSetTab} />;
        }
    };

    if (view === 'privacy') return <PrivacyPolicy onBack={() => setView('app')} />;
    if (view === 'terms') return <TermsAndConditions onBack={() => setView('app')} />;
    if (view === 'contact') return <ContactUs onBack={() => setView('app')} />;
    if (view === 'blog') return <BlogScreen onBack={() => setView('app')} />;

    return (
        <div className="relative min-h-[100dvh]">
            <CustomCursor />
            <BackgroundPattern />
            
            <div className="relative min-h-[100dvh] overflow-x-hidden">
                <div className="pb-24">
                    {renderActiveTab()}
                </div>
                
                <footer className="relative z-10 text-center my-8 space-y-6 w-full max-w-7xl mx-auto px-4 pb-12">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex justify-center gap-6">
                            <button onClick={() => setIsChillMode(!isChillMode)} className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
                                <span className="text-xl">{isChillMode ? '☀️' : '🌙'}</span>
                            </button>
                            <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
                                <span className="text-xl">🌐</span>
                            </button>
                        </div>
                        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm items-center text-white font-bold tracking-tight drop-shadow-md">
                            <a href="https://namemypet.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity underline underline-offset-4">namemypet.org</a>
                            <button onClick={() => setView('blog')} className="underline underline-offset-4">{t.common.blog || 'Blog'}</button>
                            <button onClick={() => setView('privacy')} className="underline underline-offset-4">{t.common.privacy}</button>
                            <button onClick={() => setView('terms')} className="underline underline-offset-4">{t.common.terms}</button>
                            <button onClick={() => setView('contact')} className="underline underline-offset-4">{t.common.contact}</button>
                        </div>
                    </div>
                </footer>
            </div>
            <TabNavigator activeTab={activeTab} setActiveTab={handleSetTab} />
        </div>
    );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);

export default App;