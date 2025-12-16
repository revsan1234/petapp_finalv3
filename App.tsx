
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

type View = 'app' | 'privacy' | 'terms';

const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('app');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isChillMode, setIsChillMode] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  // Apply chill mode class to body
  useEffect(() => {
    if (isChillMode) {
      document.body.classList.add('chill-mode');
    } else {
      document.body.classList.remove('chill-mode');
    }
  }, [isChillMode]);

  // Update Document Title based on Language
  useEffect(() => {
    document.title = t.common.app_title;
  }, [t.common.app_title]);

  // Initialize savedNames from localStorage if available
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

  const navigate = (newView: View) => { setView(newView); window.scrollTo(0, 0); };
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

  return (
    <div className="pb-24 relative overflow-hidden min-h-[100dvh] transition-colors duration-500">
      <CustomCursor />
      <BackgroundPattern />
      <TabMascots activeTab={activeTab} />
      
      {!hasValidApiKey() && (
         <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 z-[100] text-center font-bold shadow-lg animate-fade-in flex flex-col items-center justify-center gap-1">
            <span className="text-lg">⚠️ API Setup In Progress...</span>
            <span className="font-normal opacity-90 text-sm">Vercel is building your app. If this persists, ensure "API_KEY" is in Vercel Settings.</span>
         </div>
      )}

      {/* Top Right Controls - Positioned to respect iPhone Safe Area */}
      <div className={`fixed top-0 right-0 z-50 flex gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))] ${!hasValidApiKey() ? 'mt-16' : ''}`}>
        
        {/* Chill Mode Toggle */}
        <div className="relative group">
            <button 
                onClick={() => setIsChillMode(!isChillMode)}
                className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                aria-label="Toggle Chill Mode"
            >
                <span className="text-xl filter drop-shadow-sm">{isChillMode ? '☀️' : '🌙'}</span>
            </button>
            {/* Custom Tooltip */}
            <span className="absolute top-full right-0 mt-2 px-3 py-1 bg-black/80 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl">
                {isChillMode ? "Light Mode" : "Dark Mode"}
            </span>
        </div>

        {/* Language Toggle */}
        <div className="relative group">
            <button 
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                aria-label="Toggle Language"
            >
                <span className="text-xl filter drop-shadow-sm">🌐</span>
            </button>
            {/* Custom Tooltip */}
            <span className="absolute top-full right-0 mt-2 px-3 py-1 bg-black/80 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl">
                {language === 'en' ? "Español" : "English"}
            </span>
        </div>

      </div>

      <div className={`relative z-10 ${!hasValidApiKey() ? 'pt-16' : ''}`}>{renderActiveTab()}</div>
      
      <footer className="relative z-10 text-center my-8 space-y-4 w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm opacity-80 items-center text-dynamic">
                <a href="https://namemypet.org" target="_blank" rel="noopener noreferrer" className="hover:underline">namemypet.org</a>
                <span className="hidden sm:inline">|</span>
                <button onClick={() => setView('privacy')} className="hover:underline">{t.common.privacy}</button>
                <span className="hidden sm:inline">|</span>
                <button onClick={() => setView('terms')} className="hover:underline">{t.common.terms}</button>
            </div>
        </div>
      </footer>
      <TabNavigator activeTab={activeTab} setActiveTab={handleSetTab} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
