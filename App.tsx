import React, { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { MainView } from "./components/ui/MainView";
import { BioScreen } from "./components/screens/BioScreen";
import { PhotoScreen } from "./components/screens/PhotoScreen";
import { PlayScreen } from "./components/screens/PlayScreen";
import { AdoptScreen } from "./components/screens/AdoptScreen";
import { HotelScreen } from "./components/screens/HotelScreen";
import { TabNavigator, Tab } from "./components/layout/TabNavigator";
import { CustomCursor } from "./components/ui/CustomCursor";
import { BackgroundPattern } from "./components/ui/BackgroundPattern";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { ContactUs } from "./components/screens/ContactUs";
import type {
  GeneratedName,
  PetInfo,
  PetPersonalityResult,
  Language,
} from "./types";

const AppContent: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [savedNames, setSavedNames] = useState<GeneratedName[]>(() => {
    const saved = localStorage.getItem("pet_saved_names");
    return saved ? JSON.parse(saved) : [];
  });

  const [petInfo, setPetInfo] = useState<PetInfo>({
    type: "Dog",
    gender: "Any",
    personality: "Playful",
    style: "Trending",
  });

  const [imageForBio, setImageForBio] = useState<string | null>(null);
  const [isChillMode, setIsChillMode] = useState(false);
  const [footerView, setFooterView] = useState<
    "none" | "contact" | "privacy" | "terms"
  >("none");

  useEffect(() => {
    localStorage.setItem("pet_saved_names", JSON.stringify(savedNames));
  }, [savedNames]);

  useEffect(() => {
    if (isChillMode) {
      document.body.classList.add("chill-mode");
    } else {
      document.body.classList.remove("chill-mode");
    }
  }, [isChillMode]);

  const addSavedName = (name: GeneratedName) => {
    if (!savedNames.find((n) => n.id === name.id)) {
      setSavedNames((prev) => [name, ...prev]);
    }
  };

  const removeSavedName = (id: string) => {
    setSavedNames((prev) => prev.filter((n) => n.id !== id));
  };

  const handleQuizComplete = (result: PetPersonalityResult) => {
    setPetInfo((prev) => ({
      ...prev,
      personality: result.keywords.personality,
      style: result.keywords.style,
    }));
  };

  const goHome = () => {
    setActiveTab("home");
    setFooterView("none");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <LandingPage setTab={setActiveTab} />;
      case "generate":
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
      case "bio":
        return (
          <BioScreen
            petInfo={petInfo}
            imageForBio={imageForBio}
            setImageForBio={setImageForBio}
            goHome={goHome}
          />
        );
      case "play":
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
      case "photo":
        return (
          <PhotoScreen
            setActiveTab={setActiveTab}
            setImageForBio={setImageForBio}
            goHome={goHome}
          />
        );
      case "adopt":
        return <AdoptScreen goHome={goHome} />;
      case "hotels":
        return <HotelScreen goHome={goHome} />;
      default:
        return <LandingPage setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <CustomCursor />
      <BackgroundPattern />

      <div className="flex-grow">
        {footerView === "contact" ? (
          <ContactUs onBack={() => setFooterView("none")} />
        ) : (
          renderTabContent()
        )}
      </div>

      <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />

      <footer className="py-12 px-6 bg-black/10 backdrop-blur-md border-t border-white/10 mt-auto pb-48 sm:pb-64">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => setIsChillMode(!isChillMode)}
              className="text-white font-bold hover:scale-105 transition-all bg-white/20 px-6 py-2 rounded-full shadow-md active:scale-95"
            >
              {isChillMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <div className="flex flex-wrap justify-center gap-3">
              {(["en", "es", "fr"] as Language[]).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => setLanguage(langCode)}
                  className={`text-white font-bold px-5 py-2 rounded-full shadow-sm active:scale-95 transition-all ${
                    language === langCode
                      ? "bg-[#AA336A] ring-2 ring-white/50 scale-110 z-10"
                      : "bg-white/10 opacity-70"
                  }`}
                >
                  {langCode === "en"
                    ? "English"
                    : langCode === "es"
                      ? "Español"
                      : "Français"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
            <button
              onClick={() => setFooterView("contact")}
              className="hover:text-white transition-colors"
            >
              Contact Us
            </button>
          </div>

          <p className="text-white/40 text-xs font-medium">
            © 2026 NAMEMYPET.ORG • ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
