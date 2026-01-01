
import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainView } from './components/MainView';
import { BioScreen } from './components/screens/BioScreen';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { Partnerships } from './components/Partnerships';
import { ContactUs } from './components/ContactUs';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { TabNavigator, Tab } from './components/layout/TabNavigator';
import { CustomCursor } from './components/ui/CustomCursor';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import type { GeneratedName, PetInfo, PetPersonalityResult } from './types';

const AppContent: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [savedNames, setSavedNames] = useState<GeneratedName[]>(() => {
    const saved = localStorage.getItem('pet_saved_names');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [petInfo, setPetInfo] = useState<PetInfo>({
    type: 'Dog',
    gender: 'Any',
    personality: 'Playful',
    style: 'Trending'
  });

  const [imageForBio, setImageForBio] = useState<string | null>(null);
  const [isChillMode, setIsChillMode] = useState(false);
  const [footerView, setFooterView] = useState<'none' | 'contact' | 'privacy' | 'terms'>('none');

  useEffect(() => {
    localStorage.setItem('pet_saved_names', JSON.stringify(savedNames));
  }, [savedNames]);

  useEffect(() => {
    if (isChillMode) {
      document.body.classList.add('chill-mode');
    } else {
      document.body.classList.remove('chill-mode');
    }
  }, [isChillMode]);

  const addSavedName = (name: GeneratedName) => {
    if (!savedNames.find(n => n.id === name.id)) {
      setSavedNames(prev => [name, ...prev]);
    }
  };

  const removeSavedName = (id: string) => {
    setSavedNames(prev => prev.filter(n => n.id !== id));
  };

  const handleQuizComplete = (result: PetPersonalityResult) => {
    setPetInfo(prev => ({
      ...prev,
      personality: result.keywords.personality,
      style: result.keywords.style
    }));
  };

  const goHome = () => {
    setActiveTab('home');
    setFooterView('none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (footerView === 'contact') return <ContactUs onBack={() => setFooterView('none')} />;
  if (footerView === 'privacy') return <PrivacyPolicy onBack={() => setFooterView('none')} />;
  if (footerView === 'terms') return <TermsAndConditions onBack={() => setFooterView('none')} />;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage setTab={setActiveTab} />;
      case 'generate':
        return (
          <MainView 
            savedNames={savedNames} 
            addSavedName={addSavedName} 
            removeSavedName={removeSavedName} 
            petInfo={petInfo}
            setPetInfo={setPetInfo}
            goHome={goHome}
          />
        );
      case 'bio':
        return (
          <BioScreen 
            petInfo={petInfo} 
            imageForBio={imageForBio} 
            setImageForBio={setImageForBio}
            goHome={goHome}
          />
        );
      case 'play':
        return (
          <PlayScreen 
            onQuizComplete={handleQuizComplete} 
            savedNames={savedNames}
            addSavedName={addSavedName}
            petInfo={petInfo}
            setPetInfo={setPetInfo}
            goHome={goHome}
          />
        );
      case 'photo':
        return (
          <PhotoScreen 
            setActiveTab={setActiveTab} 
            setImageForBio={setImageForBio}
            goHome={goHome}
          />
        );
      case 'adopt':
        return <AdoptScreen goHome={goHome} />;
      case 'partnerships':
        return <Partnerships goHome={goHome} />;
      default:
        return <LandingPage setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <CustomCursor />
      <BackgroundPattern />
      
      <div className="flex-grow pb-32">
        {renderTabContent()}
      </div>

      <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />

      <footer className="py-12 px-6 bg-black/10 backdrop-blur-md border-t border-white/10 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <button onClick={() => setIsChillMode(!isChillMode)} className="text-white font-bold hover:scale-105 transition-transform bg-white/20 px-4 py-2 rounded-full">
              {isChillMode ? t.common.chill_mode_off : t.common.chill_mode_on}
            </button>
            <button onClick={() => setLanguage(language === 'en' ? 'es' : language === 'es' ? 'fr' : 'en')} className="text-white font-bold hover:scale-105 transition-transform bg-white/20 px-4 py-2 rounded-full">
              {language === 'en' ? t.common.switch_language_es : language === 'es' ? t.common.switch_language_fr : t.common.switch_language_en}
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
            <button onClick={() => setFooterView('privacy')} className="hover:text-white transition-colors">{t.common.privacy}</button>
            <button onClick={() => setFooterView('terms')} className="hover:text-white transition-colors">{t.common.terms}</button>
            <button onClick={() => setFooterView('contact')} className="hover:text-white transition-colors">{t.common.contact}</button>
          </div>

          <p className="text-white/40 text-xs font-medium">
            © 2025 NAMEMYPET.ORG • ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
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
