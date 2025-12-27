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
import { GeneratedName, PetInfo, Tab } from './types';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { CustomCursor } from './components/ui/CustomCursor';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { hasValidApiKey } from './services/geminiService';
import { Card } from './components/ui/Card';
import { PetCharacter } from './components/assets/pets/PetCharacter';
import { Button } from './components/ui/Button';

/**
 * REUSABLE COMPONENTS
 */

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

/**
 * INTERNAL BLOG SCREEN
 */
const BlogScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language } = useLanguage();
    return (
        <div className="min-h-screen p-4 flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <header className="mb-12"><BackToHomeButton onClick={onBack} /></header>
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black text-white drop-shadow-lg uppercase tracking-tighter">
                        {language === 'es' ? 'El Blog de Mascotas' : 'The Pet Blog'}
                    </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8">
                        <PetCharacter pet="dog" className="w-16 h-16 mb-4" />
                        <h2 className="text-2xl font-black mb-2">150+ Unique Dog Names for 2025</h2>
                        <p className="opacity-70">Choosing the perfect name for your new best friend is an exciting journey...</p>
                    </Card>
                    <Card className="p-8 opacity-50">
                        <PetCharacter pet="cat" className="w-16 h-16 mb-4" />
                        <h2 className="text-2xl font-black mb-2">Coming Soon: Cat Care Guides</h2>
                        <p className="opacity-70">We are working on expert tips for your feline friends.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

/**
 * INTERNAL CONTACT SCREEN
 */
const ContactUsInternal: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen p-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
                <header className="mb-8"><BackToHomeButton onClick={onBack} /></header>
                <Card className="text-center py-20 border-4 border-[#AA336A]/20">
                    <h1 className="text-5xl font-black mb-6 text-[#AA336A] uppercase tracking-tight">{t.contact_us.title}</h1>
                    <p className="text-2xl opacity-80 mb-10 max-w-md mx-auto leading-relaxed">{t.contact_us.p1}</p>
                    <div className="inline-block p-1 bg-gradient-to-r from-[#FF6B6B] to-[#AA336A] rounded-2xl">
                        <a href={`mailto:${t.contact_us.email}`} className="block bg-white px-8 py-4 rounded-xl text-2xl font-black text-[#AA336A] hover:bg-transparent hover:text-white transition-all">
                            {t.contact_us.email}
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    );
};

/**
 * SCREENSHOT GALLERY / MARKETING MODE
 */
const MarketingGallery: React.FC<{ onBack: () => void; setPetInfo: (info: PetInfo) => void; setSavedNames: (names: GeneratedName[]) => void }> = ({ onBack, setPetInfo, setSavedNames }) => {
    const fillDemoData = () => {
        setPetInfo({ type: 'Dog', gender: 'Female', personality: 'Playful', style: 'Unique' });
        setSavedNames([
            { id: '1', name: 'Luna', meaning: 'The Moon (Classic)', style: 'Classic' },
            { id: '2', name: 'Nimbus', meaning: 'A magical dark cloud', style: 'Unique' },
            { id: '3', name: 'Pixel', meaning: 'Tiny digital adventurer', style: 'Funny' },
            { id: '4', name: 'Zephyr', meaning: 'Gentle summer breeze', style: 'Nature' }
        ]);
        alert("Demo data loaded! You can now go to 'Names' or 'Bio' to see it populated for your screenshots.");
        onBack();
    };

    return (
        <div className="min-h-screen p-8 bg-black/90 text-white animate-fade-in flex flex-col items-center">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-5xl font-black mb-4">📸 App Store Screenshot Mode</h1>
                <p className="text-xl mb-12 opacity-80 font-medium">Capture clean visuals by loading demo data and hiding browser clutter.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 bg-white/10 rounded-3xl border border-white/20 flex flex-col gap-6">
                        <h2 className="text-3xl font-bold">Step 1: Fill Demo Data</h2>
                        <p className="opacity-70">This fills your 'Top Picks' and sets your pet to a cute Dog named Luna.</p>
                        <Button onClick={fillDemoData} variant="primary" className="!w-full py-4 text-xl">Load Demo Data</Button>
                    </div>
                    <div className="p-8 bg-white/10 rounded-3xl border border-white/20 flex flex-col gap-6">
                        <h2 className="text-3xl font-bold">Step 2: Clean View</h2>
                        <p className="opacity-70">Return to the app. Browser chrome is best hidden using 'Inspect' -> 'Device Toggle'.</p>
                        <Button onClick={onBack} variant="secondary" className="!w-full py-4 text-xl">Back to App</Button>
                    </div>
                </div>

                <div className="bg-[#AA336A]/20 p-6 rounded-2xl border border-[#AA336A]/40 text-left">
                    <h3 className="font-bold text-xl mb-2">Pro Tip for Apple:</h3>
                    <p className="opacity-80">Use Chrome DevTools (F12) -> Click the Phone/Tablet icon -> Select 'iPhone 14 Pro Max' to get the exact 6.7" resolution Apple requires.</p>
                </div>
            </div>
        </div>
    );
};

/**
 * MAIN APP CONTENT
 */
type View = 'app' | 'privacy' | 'terms' | 'contact' | 'blog' | 'marketing';

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
    if (view === 'contact') return <ContactUsInternal onBack={() => setView('app')} />;
    if (view === 'blog') return <BlogScreen onBack={() => setView('app')} />;
    if (view === 'marketing') return <MarketingGallery onBack={() => setView('app')} setPetInfo={setPetInfo} setSavedNames={setSavedNames} />;

    return (
        <>
            <CustomCursor />
            <BackgroundPattern />
            {!hasValidApiKey() && (
                 <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 z-[100] text-center font-bold shadow-lg">
                    ⚠️ Configuration Error: API Key not found.
                 </div>
            )}
            <div className="relative min-h-[100dvh] overflow-x-hidden pb-24 transition-colors duration-500">
                {renderActiveTab()}
                <footer className="relative z-10 text-center my-8 space-y-6 w-full max-w-7xl mx-auto px-4 pb-12">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex justify-center gap-6">
                            <button onClick={() => setView('marketing')} className="w-12 h-12 rounded-full bg-[#AA336A] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95" title="Screenshot Mode">
                                📸
                            </button>
                            <button onClick={() => setIsChillMode(!isChillMode)} className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
                                <span className="text-xl">{isChillMode ? '☀️' : '🌙'}</span>
                            </button>
                            <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
                                <span className="text-xl">🌐</span>
                            </button>
                        </div>
                        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm opacity-100 items-center text-white font-bold tracking-tight drop-shadow-md">
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
        </>
    );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);

export default App;