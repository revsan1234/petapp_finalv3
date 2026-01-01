
import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainView } from './components/MainView';
import { BioScreen } from './components/screens/BioScreen';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { Partnerships } from './components/Partnerships';
import { TabNavigator, Tab } from './components/layout/TabNavigator';
import { CustomCursor } from './components/ui/CustomCursor';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Card } from './components/ui/Card';
import type { GeneratedName, PetInfo, PetPersonalityResult } from './types';

// --- Sub-components moved into App.tsx to avoid file resolution issues ---

const ContactUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-start mb-8">
          <button onClick={onBack} className="p-3 rounded-full bg-white/30 hover:bg-white/50 transition-all backdrop-blur-md text-[#666666] shadow-sm active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </header>
        <main>
          <Card className="text-center py-20 border-4 border-[#AA336A]/20 shadow-2xl rounded-[3rem]">
            <div className="flex justify-center mb-6">
              <div className="bg-[#AA336A]/10 p-6 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#AA336A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-black mb-6 text-[#AA336A] uppercase tracking-tight">{t.contact_us.title}</h1>
            <div className="space-y-10">
              <p className="text-2xl font-medium opacity-80 max-w-md mx-auto leading-relaxed text-[#666666]">{t.contact_us.p1}</p>
              <div className="inline-block p-1.5 rounded-[2rem] bg-gradient-to-r from-[#FF6B6B] to-[#AA336A] shadow-2xl transform hover:scale-105 transition-all duration-300">
                <a href={`mailto:${t.contact_us.email}`} className="block bg-white px-10 py-8 rounded-[calc(2rem-6px)] text-2xl sm:text-3xl font-black text-[#AA336A] hover:bg-transparent hover:text-white transition-all break-all">
                  {t.contact_us.email}
                </a>
              </div>
              <div className="pt-12">
                <p className="text-sm font-bold opacity-30 tracking-[0.3em] uppercase text-[#666666]">namemypet.org</p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useLanguage();
  const content = {
    en: {
      title: "Privacy Policy",
      p: ["Your privacy is important to us. It is the policy of Name My Pet to respect your privacy regarding any information we may collect from you across our app and other sites we own and operate.", "We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.", "We don’t share any personally identifying information publicly or with third-parties, except when required by to law."]
    },
    es: {
      title: "Política de Privacidad",
      p: ["Su privacidad es importante para nosotros. Es política de Name My Pet respetar su privacidad con respecto a cualquier información que podamos recopilar de usted.", "Solo solicitamos información personal cuando realmente la necesitamos para brindarle un servicio.", "No compartimos ninguna información de identificación personal públicamente."]
    },
    fr: {
      title: "Politique de Confidentialité",
      p: ["Votre vie privée est importante pour nous. La politique de Name My Pet est de respecter votre vie privée.", "Nous ne demandons des informations personnelles que lorsque nous en avons réellement besoin.", "Nous ne partageons aucune information d'identification personnelle publiquement."]
    }
  };
  const t_local = content[language] || content.en;
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <header className="flex items-center justify-start mb-8">
          <button onClick={onBack} className="p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors backdrop-blur-sm text-[#666666]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </header>
        <Card className="text-left">
          <h1 className="text-3xl font-bold mb-6 text-center">{t_local.title}</h1>
          <div className="space-y-4 text-lg opacity-90">
            {t_local.p.map((txt, i) => <p key={i}>{txt}</p>)}
          </div>
        </Card>
      </div>
    </div>
  );
};

const TermsAndConditions: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useLanguage();
  const content = {
    en: { title: "Terms & Conditions", text: "By accessing Name My Pet, you agree to be bound by these terms of service and all applicable laws." },
    es: { title: "Términos y Condiciones", text: "Al acceder a Name My Pet, usted acepta estar sujeto a estos términos de servicio." },
    fr: { title: "Conditions Générales", text: "En accédant à Name My Pet, vous acceptez d'être lié par ces conditions de service." }
  };
  const t_local = content[language] || content.en;
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <header className="flex items-center justify-start mb-8">
          <button onClick={onBack} className="p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors backdrop-blur-sm text-[#666666]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </header>
        <Card className="text-left">
          <h1 className="text-3xl font-bold mb-6 text-center">{t_local.title}</h1>
          <p className="text-lg opacity-90">{t_local.text}</p>
        </Card>
      </div>
    </div>
  );
};

// --- Main App Logic ---

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