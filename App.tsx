import React, { useState, useEffect } from 'react';
import { Partnerships } from './components/Partnerships';
import { MainView } from './components/MainView';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { TabNavigator, Tab } from './components/layout/TabNavigator';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { BioScreen } from './components/screens/BioScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { LandingPage } from './components/LandingPage';
import { PetPersonalityResult, GeneratedName, PetInfo } from './types';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { TabMascots } from './components/ui/TabMascots';
import { CustomCursor } from './components/ui/CustomCursor';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { hasValidApiKey } from './services/geminiService';
import { Card } from './components/ui/Card';
import { PetCharacter } from './components/assets/pets/PetCharacter';

// --- Internal Helper: Shared Back Button ---
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

// --- Contact Us Component ---
const ContactUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in flex flex-col items-center pt-[max(0.5rem,env(safe-area-inset-top))]">
            <div className="w-full max-w-4xl">
                <header className="flex items-center justify-start mb-8">
                    <BackToHomeButton onClick={onBack} />
                </header>
                <main>
                    <Card className="text-center py-20 border-4 border-[#AA336A]/10 shadow-2xl rounded-[3rem]">
                        <div className="flex justify-center mb-6">
                             <div className="transform hover:scale-110 transition-transform duration-300">
                                <PetCharacter pet="cat" className="w-32 h-32 drop-shadow-xl" />
                             </div>
                        </div>
                        <h1 className="text-5xl font-black mb-6 text-[#5D4037] uppercase tracking-tight font-heading">
                            {t.contact_us.title}
                        </h1>
                        <div className="space-y-10">
                            <p className="text-2xl font-medium max-w-md mx-auto leading-relaxed text-[#333333] opacity-90 font-['Poppins']">
                                {t.contact_us.p1}
                            </p>
                            <div className="inline-block transition-all duration-300">
                                <a 
                                    href={`mailto:${t.contact_us.email}`} 
                                    className="text-2xl sm:text-4xl font-black text-[#5D4037] hover:text-[#AA336A] transition-all break-all font-heading"
                                >
                                    {t.contact_us.email}
                                </a>
                            </div>
                            <div className="pt-12">
                                <p className="text-sm font-bold opacity-30 tracking-[0.3em] uppercase text-[#5D4037] font-['Poppins']">
                                    namemypet.org
                                </p>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

type View = 'app' | 'privacy' | 'terms' | 'contact';

const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('app');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isChillMode, setIsChillMode] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  useEffect(() => {
    if (isChillMode) document.body.classList.add('chill-mode');
    else document.body.classList.remove('chill-mode');
  }, [isChillMode]);

  useEffect(() => {
    document.title = t.common.app_title;
  }, [t.common.app_title]);

  const [savedNames, setSavedNames] = useState<GeneratedName[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mySavedNames');
        return saved ? JSON.parse(saved) : [];
      } catch (e) { return []; }
    }
    return [];
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
  const handleQuizComplete = (result: PetPersonalityResult) => {
    setPetInfo(prev => ({ ...prev, personality: result.keywords.personality, style: result.keywords.style }));
  };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'home': return <LandingPage setTab={handleSetTab} />;
      case 'generate': return <MainView savedNames={savedNames} addSavedName={addSavedName} removeSavedName={removeSavedName} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
      case 'bio': return <BioScreen petInfo={petInfo} imageForBio={imageForBio} setImageForBio={setImageForBio} goHome={goHome} />;
      case 'play': return <PlayScreen onQuizComplete={handleQuizComplete} savedNames={savedNames} addSavedName={addSavedName} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
      case 'photo': return <PhotoScreen setActiveTab={handleSetTab} setImageForBio={setImageForBio} goHome={goHome} />;
      case 'adopt': return <AdoptScreen goHome={goHome} />;
      case 'partnerships': return <Partnerships goHome={goHome} />;
      default: return <LandingPage setTab={handleSetTab} />;
    }
  };

  if (view === 'privacy') return <PrivacyPolicy onBack={() => setView('app')} />;
  if (view === 'terms') return <TermsAndConditions onBack={() => setView('app')} />;
  if (view === 'contact') return <ContactUs onBack={() => setView('app')} />;

  const ToggleControls = () => (
      <div className="flex justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
            <button 
                onClick={() => setIsChillMode(!isChillMode)}
                className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                aria-label="Toggle Chill Mode"
            >
                <span className="text-xl">{isChillMode ? '☀️' : '🌙'}</span>
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 text-dynamic">dark</span>
        </div>
        <div className="flex flex-col items-center gap-1">
            <button 
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                aria-label="Toggle Language"
            >
                <span className="text-xl">🌐</span>
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 text-dynamic">spanish</span>
        </div>
      </div>
  );

  return (
    <>
      <CustomCursor />
      <BackgroundPattern />
      <TabMascots activeTab={activeTab} />
      {!hasValidApiKey() && (
         <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 z-[100] text-center font-bold shadow-lg flex flex-col items-center justify-center gap-1">
            <span className="text-lg">⚠️ Configuration Error</span>
            <span className="font-normal opacity-90 text-sm">API Key not found.</span>
         </div>
      )}
      <div className={`relative min-h-[100dvh] overflow-x-hidden pb-24 transition-colors duration-500 pt-[max(0rem,env(safe-area-inset-top))]`}>
          {renderActiveTab()}
          <footer className="relative z-10 text-center my-8 space-y-6 w-full max-w-7xl mx-auto px-4 pb-12">
            <div className="flex flex-col items-center gap-6">
                <ToggleControls />
                <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm opacity-100 items-center text-white font-bold tracking-tight drop-shadow-md">
                    <a href="https://namemypet.org" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--card-bg)] transition-colors underline underline-offset-4 decoration-white/30">namemypet.org</a>
                    <span className="hidden sm:inline opacity-30">|</span>
                    <button onClick={() => setView('privacy')} className="hover:text-[var(--card-bg)] transition-colors underline underline-offset-4 decoration-white/30">{t.common.privacy}</button>
                    <span className="hidden sm:inline opacity-30">|</span>
                    <button onClick={() => setView('terms')} className="hover:text-[var(--card-bg)] transition-colors underline underline-offset-4 decoration-white/30">{t.common.terms}</button>
                    <span className="hidden sm:inline opacity-30">|</span>
                    <button onClick={() => setView('contact')} className="hover:text-[var(--card-bg)] transition-colors underline underline-offset-4 decoration-white/30">{t.common.contact}</button>
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