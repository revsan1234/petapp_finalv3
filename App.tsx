import React, { useState, useEffect } from 'react';
import { MainView } from './components/MainView';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { TabNavigator } from './components/layout/TabNavigator';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { BioScreen } from './components/screens/BioScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { HotelScreen } from './components/screens/HotelScreen';
import { LandingPage } from './components/LandingPage';
import { GeneratedName, PetInfo, Tab, View, PetPersonalityResult } from './types';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { CustomCursor } from './components/ui/CustomCursor';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const CURRENT_VERSION = '2.4.0';

const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('app');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isChillMode, setIsChillMode] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  useEffect(() => {
    const savedVersion = localStorage.getItem('petapp_version');
    if (savedVersion !== CURRENT_VERSION) {
        localStorage.setItem('petapp_version', CURRENT_VERSION);
    }
  }, []);

  useEffect(() => {
    if (isChillMode) document.body.classList.add('chill-mode');
    else document.body.classList.remove('chill-mode');
  }, [isChillMode]);

  useEffect(() => { document.title = t.common.app_title; }, [t.common.app_title, language]);

  const [savedNames, setSavedNames] = useState<GeneratedName[]>(() => {
    try {
        const saved = localStorage.getItem('petapp_saved_names');
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  });

  const [petInfo, setPetInfo] = useState<PetInfo>(() => {
    const defaultInfo: PetInfo = { type: 'Dog', gender: 'Any', personality: 'Playful', style: 'Trending', name: '' };
    try {
        const saved = localStorage.getItem('petapp_pet_info');
        if (!saved) return defaultInfo;
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.type) {
            return { ...defaultInfo, ...parsed };
        }
        return defaultInfo;
    } catch (e) { return defaultInfo; }
  });

  const [imageForBio, setImageForBio] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('petapp_saved_names', JSON.stringify(savedNames)); }, [savedNames]);
  useEffect(() => { localStorage.setItem('petapp_pet_info', JSON.stringify(petInfo)); }, [petInfo]);

  const handleSetTab = (tab: Tab) => { 
    setView('app'); 
    setActiveTab(tab); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const goHome = () => { handleSetTab('home'); };

  const handleResetApp = () => {
      if (window.confirm(t.common.reset_confirm || "Reset all data and start fresh?")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const addSavedName = (name: GeneratedName) => {
    setSavedNames((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      if (!current.find(n => n.id === name.id)) return [...current, name];
      return current;
    });
  };

  const removeSavedName = (nameId: string) => { 
    setSavedNames((prev) => Array.isArray(prev) ? prev.filter(n => n.id !== nameId) : []); 
  };

  const handleQuizComplete = (result: PetPersonalityResult) => {
    setPetInfo(prev => ({ 
        ...prev, 
        personality: result.keywords.personality, 
        style: result.keywords.style 
    }));
  };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'home': return <LandingPage setTab={handleSetTab} />;
      case 'generate': return <MainView savedNames={savedNames} addSavedName={addSavedName} removeSavedName={removeSavedName} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
      case 'bio': return <BioScreen petInfo={petInfo} imageForBio={imageForBio} setImageForBio={setImageForBio} goHome={goHome} />;
      case 'play': return <PlayScreen onQuizComplete={handleQuizComplete} savedNames={savedNames} addSavedName={addSavedName} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
      case 'photo': return <PhotoScreen setActiveTab={handleSetTab} setImageForBio={setImageForBio} goHome={goHome} />;
      case 'adopt': return <AdoptScreen goHome={goHome} />;
      case 'hotel': return <HotelScreen goHome={goHome} />;
      default: return <LandingPage setTab={handleSetTab} />;
    }
  };

  if (view === 'privacy') return <PrivacyPolicy onBack={() => setView('app')} />;
  if (view === 'terms') return <TermsAndConditions onBack={() => setView('app')} />;

  return (
    <>
      <CustomCursor />
      <BackgroundPattern />
      <div className="relative min-h-[100dvh] pb-24 transition-colors duration-500">
          {renderActiveTab()}
          
          <footer className="relative z-10 text-center my-8 space-y-6 w-full max-w-7xl mx-auto px-4 pb-12">
            <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-4">
                    <button 
                        onClick={() => setIsChillMode(!isChillMode)} 
                        className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transform active:scale-95 transition-all hover:bg-white/60"
                        title={isChillMode ? t.common.chill_mode_off : t.common.chill_mode_on}
                    >
                        <span className="text-xl">{isChillMode ? '☀️' : '🌙'}</span>
                    </button>
                    
                    <div className="bg-white/40 backdrop-blur-md border border-white/50 px-6 py-2 rounded-full shadow-lg flex items-center gap-4 text-sm font-bold">
                        <button onClick={() => setLanguage('en')} className={`transition-all ${language === 'en' ? 'text-[#AA336A] scale-110' : 'text-[#666666] opacity-60 hover:opacity-100'}`}>ENGLISH</button>
                        <span className="text-black/10">|</span>
                        <button onClick={() => setLanguage('es')} className={`transition-all ${language === 'es' ? 'text-[#AA336A] scale-110' : 'text-[#666666] opacity-60 hover:opacity-100'}`}>ESPAÑOL</button>
                        <span className="text-black/10">|</span>
                        <button onClick={() => setLanguage('fr')} className={`transition-all ${language === 'fr' ? 'text-[#AA336A] scale-110' : 'text-[#666666] opacity-60 hover:opacity-100'}`}>FRANÇAIS</button>
                    </div>
                </div>

                <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm opacity-80 items-center font-bold">
                    <a href="https://namemypet.org" target="_blank" rel="noopener noreferrer" className="hover:underline">namemypet.org</a>
                    <span className="hidden sm:inline">|</span>
                    <button onClick={() => setView('privacy')} className="hover:underline">{t.common.privacy}</button>
                    <span className="hidden sm:inline">|</span>
                    <button onClick={() => setView('terms')} className="hover:underline">{t.common.terms}</button>
                    <span className="hidden sm:inline">|</span>
                    <button onClick={handleResetApp} className="text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-widest text-[10px]">{t.common.reset_btn}</button>
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