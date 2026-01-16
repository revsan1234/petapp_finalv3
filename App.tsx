import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainView } from './components/layout/mainview';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { BioScreen } from './components/screens/BioScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { HotelScreen } from './components/screens/HotelScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { TabNavigator } from './components/TabNavigator';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { CustomCursor } from './components/ui/CustomCursor';
import { LanguageProvider } from './contexts/LanguageContext';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { ContactUs } from './components/ContactUs';
import type { Tab, PetInfo, GeneratedName, PetPersonalityResult, View } from './types';

const INITIAL_PET_INFO: PetInfo = {
  type: 'Dog',
  gender: 'Any',
  personality: 'Playful',
  style: 'Trending'
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentView, setCurrentView] = useState<View>('app');
  const [isChillMode, setIsChillMode] = useState(() => {
    return localStorage.getItem('petapp_chill_mode') === 'true';
  });
  const [petInfo, setPetInfo] = useState<PetInfo>(INITIAL_PET_INFO);
  const [savedNames, setSavedNames] = useState<GeneratedName[]>(() => {
    const saved = localStorage.getItem('petapp_saved_names');
    return saved ? JSON.parse(saved) : [];
  });
  const [imageForBio, setImageForBio] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('petapp_saved_names', JSON.stringify(savedNames));
  }, [savedNames]);

  useEffect(() => {
    localStorage.setItem('petapp_chill_mode', String(isChillMode));
    if (isChillMode) {
      document.body.classList.add('chill-mode');
    } else {
      document.body.classList.remove('chill-mode');
    }
  }, [isChillMode]);

  const addSavedName = (name: GeneratedName) => {
    if (!savedNames.find(n => n.id === name.id)) {
      setSavedNames(prev => [...prev, name]);
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

  if (currentView === 'privacy') {
    return (
      <div className="min-h-screen relative">
        <CustomCursor />
        <BackgroundPattern />
        <PrivacyPolicy onBack={() => setCurrentView('app')} />
      </div>
    );
  }

  if (currentView === 'terms') {
    return (
      <div className="min-h-screen relative">
        <CustomCursor />
        <BackgroundPattern />
        <TermsAndConditions onBack={() => setCurrentView('app')} />
      </div>
    );
  }

  if (currentView === 'contact') {
    return (
      <div className="min-h-screen relative">
        <CustomCursor />
        <BackgroundPattern />
        <ContactUs onBack={() => setCurrentView('app')} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <LandingPage 
            setTab={setActiveTab} 
            setView={setCurrentView} 
            isChillMode={isChillMode} 
            setIsChillMode={setIsChillMode} 
          />
        );
      case 'generate':
        return (
          <MainView 
            savedNames={savedNames}
            addSavedName={addSavedName}
            removeSavedName={removeSavedName}
            petInfo={petInfo}
            setPetInfo={setPetInfo}
            goHome={() => setActiveTab('home')}
          />
        );
      case 'photo':
        return (
          <PhotoScreen 
            setActiveTab={setActiveTab} 
            setImageForBio={setImageForBio}
            goHome={() => setActiveTab('home')}
          />
        );
      case 'bio':
        return (
          <BioScreen 
            petInfo={petInfo}
            imageForBio={imageForBio}
            setImageForBio={setImageForBio}
            goHome={() => setActiveTab('home')}
          />
        );
      case 'adopt':
        return <AdoptScreen goHome={() => setActiveTab('home')} />;
      case 'hotel':
        return <HotelScreen goHome={() => setActiveTab('home')} />;
      case 'play':
        return (
          <PlayScreen 
            onQuizComplete={handleQuizComplete}
            addSavedName={addSavedName}
            savedNames={savedNames}
            petInfo={petInfo}
            setPetInfo={setPetInfo}
            goHome={() => setActiveTab('home')}
          />
        );
      default:
        return <LandingPage setTab={setActiveTab} setView={setCurrentView} isChillMode={isChillMode} setIsChillMode={setIsChillMode} />;
    }
  };

  return (
    <div className="min-h-screen relative transition-colors duration-700">
      <CustomCursor />
      <BackgroundPattern />
      {renderContent()}
      {activeTab !== 'home' && (
        <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}