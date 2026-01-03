
import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainView } from './components/MainView';
import { BioScreen } from './components/screens/BioScreen';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { TabNavigator, Tab } from './components/layout/TabNavigator';
import { CustomCursor } from './components/ui/CustomCursor';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Card } from './components/ui/Card';
import { Header } from './components/Header';
import { Button, BackToHomeButton } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { PetCharacter } from './components/assets/pets/PetCharacter';
import { findPetHotels } from './services/geminiService';
import type { GeneratedName, PetInfo, PetPersonalityResult, Language, AdoptionCenter } from './types';

// --- Local Components for Easy Integration ---

const BedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v14.25A2.25 2.25 0 0 0 5.25 19.5h13.5a2.25 2.25 0 0 0 2.25-2.25V6.75m-19.5 0A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25m-19.5 0v14.25" />
    </svg>
);

const LocationIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const HotelScreen: React.FC<{ goHome: () => void }> = ({ goHome }) => {
    const { t, language } = useLanguage();
    const [location, setLocation] = useState('');
    const [centers, setCenters] = useState<AdoptionCenter[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) return;
        setIsLoading(true);
        setError(null);
        setCenters([]);
        setHasSearched(true);
        try {
            const results = await findPetHotels(location, language);
            setCenters(results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="relative z-10">
                <Header leftPet="bird" rightPet="hamster" onLogoClick={goHome} />
                <main className="py-4 md:py-8 px-4 pb-32 max-w-4xl mx-auto w-full">
                    <div className="-mt-4 mb-8">
                        <BackToHomeButton onClick={goHome} />
                    </div>
                    <Card>
                        <div className="flex justify-center items-end -space-x-12 sm:-space-x-24 md:-space-x-32 mb-8 h-40 sm:h-64 md:h-[350px] overflow-visible">
                            <PetCharacter pet="bird" className="w-32 h-32 sm:w-80 sm:h-80 z-10 animate-bounce-entry filter drop-shadow-lg opacity-0" style={{ animationDelay: '0ms' }} />
                            <PetCharacter pet="hamster" className="w-32 h-32 sm:w-80 sm:h-80 z-20 -mb-4 animate-bounce-entry filter drop-shadow-lg opacity-0" style={{ animationDelay: '100ms' }} />
                            <PetCharacter pet="rabbit" className="w-32 h-32 sm:w-80 sm:h-80 z-30 -mb-2 animate-bounce-entry filter drop-shadow-lg opacity-0" style={{ animationDelay: '200ms' }} />
                            <PetCharacter pet="dog" className="w-32 h-32 sm:w-80 sm:h-80 z-20 -mb-4 animate-bounce-entry filter drop-shadow-lg opacity-0" style={{ animationDelay: '300ms' }} />
                            <PetCharacter pet="cat" className="w-32 h-32 sm:w-80 sm:h-80 z-10 animate-bounce-entry filter drop-shadow-lg opacity-0" style={{ animationDelay: '400ms' }} />
                        </div>
                        <div className="flex flex-col items-center gap-2 mb-6 text-center">
                            <div className="bg-[#AA336A]/10 p-4 rounded-full mb-2">
                                <BedIcon className="w-12 h-12 text-[#AA336A]" />
                            </div>
                            <h2 className="text-4xl font-black text-[var(--text-main)]">{t.hotels.title}</h2>
                            <p className="opacity-95 max-w-lg text-2xl font-bold text-[var(--text-main)]">{t.hotels.subtitle}</p>
                        </div>
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end max-w-md mx-auto">
                            <Input
                                id="hotel-location"
                                label={t.hotels.label_location}
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder={t.placeholders.location}
                            />
                            <Button type="submit" disabled={isLoading || !location.trim()} className="!py-4">
                                {isLoading ? t.generator.btn_generating : t.hotels.btn_search}
                                {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2" /> : <SearchIcon className="w-5 h-5 ml-1" />}
                            </Button>
                        </form>
                    </Card>
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-6 text-center font-bold">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                        {centers.map((center, index) => (
                            <div key={index} className="bg-[var(--card-bg)] backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 flex flex-col h-full transform hover:-translate-y-2 transition-all duration-300">
                                <h3 className="text-xl font-bold text-[#AA336A] mb-2">{center.name}</h3>
                                <p className="text-sm mb-4 flex-grow italic font-bold text-[var(--text-main)] opacity-90 leading-snug">"{center.mission}"</p>
                                <div className="space-y-3 text-sm text-[var(--text-main)] font-semibold opacity-90">
                                    <div className="flex items-start gap-2"><LocationIcon className="w-5 h-5 shrink-0 opacity-70" /><span>{center.address}</span></div>
                                    <div className="flex items-center gap-2"><PhoneIcon className="w-5 h-5 shrink-0 opacity-70" /><span>{center.phone}</span></div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-black/10">
                                    <Button href={center.website} target="_blank" variant="secondary" className="w-full !py-2 !text-sm">{t.hotels.visit_website}</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {hasSearched && !isLoading && centers.length === 0 && !error && <div className="text-center opacity-60 mt-12 font-black text-2xl">{t.hotels.no_results}</div>}
                </main>
            </div>
        </div>
    );
};

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
      case 'hotels':
        return <HotelScreen goHome={goHome} />;
      default:
        return <LandingPage setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <CustomCursor />
      <BackgroundPattern />
      
      <div className="flex-grow pb-32">
        {footerView === 'contact' ? <ContactUs onBack={() => setFooterView('none')} /> :
         footerView === 'privacy' ? <PrivacyPolicy onBack={() => setFooterView('none')} /> :
         footerView === 'terms' ? <TermsAndConditions onBack={() => setFooterView('none')} /> :
         renderTabContent()}
      </div>

      <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />

      <footer className="py-12 px-6 bg-black/10 backdrop-blur-md border-t border-white/10 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-6">
            {/* Chill Mode Switcher */}
            <button 
              onClick={() => setIsChillMode(!isChillMode)} 
              className="text-white font-bold hover:scale-105 transition-all bg-white/20 px-6 py-2 rounded-full shadow-md active:scale-95"
            >
              {isChillMode ? t.common.chill_mode_off : t.common.chill_mode_on}
            </button>
            
            {/* Multi-Language Switcher Group */}
            <div className="flex flex-wrap justify-center gap-3">
              {(['en', 'es', 'fr'] as Language[]).map((langCode) => {
                const label = t.common[`switch_language_${langCode}`];
                const isActive = language === langCode;
                return (
                  <button
                    key={langCode}
                    onClick={() => setLanguage(langCode)}
                    className={`text-white font-bold hover:scale-105 transition-all px-5 py-2 rounded-full shadow-sm active:scale-95 ${
                      isActive 
                        ? 'bg-[#AA336A] ring-2 ring-white/50 scale-110 z-10' 
                        : 'bg-white/10 hover:bg-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
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

