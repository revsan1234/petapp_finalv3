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

// --- Contact Us Component (Defined locally to avoid file creation issues) ---
const ContactUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <header className="flex items-center justify-start mb-8">
                    <button 
                        onClick={onBack} 
                        className="p-3 rounded-full bg-white/30 hover:bg-white/50 transition-all backdrop-blur-md text-[#666666] shadow-sm active:scale-95"
                        aria-label="Go Back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
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
                            <p className="text-2xl font-medium max-w-md mx-auto leading-relaxed text-[#5D4037] opacity-90 font-['Poppins']">
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
    if (isChillMode) {
      document.body.classList.add('chill-mode');
    } else {
      document.body.classList.remove('chill-mode');
    }
  }, [isChillMode]);

  useEffect(() => {
    document.title = t.common.app_title;
  }, [t.common.app_title]);

  const [savedNames, setSavedNames] = useState<GeneratedName[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mySavedNames');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Failed to load saved names", e);
        return [];
      }
    }
    return [];
  });

  const [petInfo, setPetInfo] = useState<PetInfo>({
    type: 'Dog',
    gender: 'Any',
    personality: 'Playful',
    style: 'Trending',
  });
  const [imageForBio, setImageForBio] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('mySavedNames', JSON.stringify(savedNames));
  }, [savedNames]);

  const handleSetTab = (tab: Tab) => { setView('app'); setActiveTab(tab); window.scrollTo(0, 0); };
  const goHome = () => { handleSetTab('home'); };

  const addSavedName = (name: GeneratedName) => {
    setSavedNames((prev) => {
      if (!prev.find(n => n.id === name.id)) { return [...prev, name]; }
      return prev;
    });
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
            <span className="font-normal opacity-90 text-sm">API Key not found. Please check Vercel settings.</span>
         </div>
      )}

      <div className={`relative min-h-[100dvh] overflow-x-hidden pb-24 transition-colors duration-500 ${!hasValidApiKey() ? 'pt-16' : ''}`}>
          {renderActiveTab()}
          
          <footer className="relative z-10 text-center my-8 space-y-6 w-full max-w-7xl mx-auto px-4 pb-12">
            <div className="flex flex-col items-center gap-6">
                <ToggleControls />
                <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm opacity-80 items-center text-dynamic">
                    <a href="https://namemypet.org" target="_blank" rel="noopener noreferrer" className="hover:underline">namemypet.org</a>
                    <span className="hidden sm:inline">|</span>
                    <button onClick={() => setView('privacy')} className="hover:underline">{t.common.privacy}</button>
                    <span className="hidden sm:inline">|</span>
                    <button onClick={() => setView('terms')} className="hover:underline">{t.common.terms}</button>
                    <span className="hidden sm:inline">|</span>
                    <button onClick={() => setView('contact')} className="hover:underline">{t.common.contact}</button>
                </div>
            </div>
          </footer>
      </div>
      
      <TabNavigator activeTab={activeTab} setActiveTab={handleSetTab} />
    </>
  );
};

// Main App component
const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;