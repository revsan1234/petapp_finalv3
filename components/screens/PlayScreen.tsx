import React, { useState } from 'react';
import { PersonalityQuiz } from '../PersonalityQuiz';
import { QuickFireDiscovery } from '../QuickFireDiscovery';
import type { PetPersonalityResult, GeneratedName, PetInfo } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { Header } from '../Header';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { translatePetName } from '../../services/geminiService';
import { BackToHomeButton } from '../../App';

// --- Internal Component: Name Translator ---
const NameTranslator: React.FC = () => {
    const { t } = useLanguage();
    const [petName, setPetName] = useState('');
    const [targetLang, setTargetLang] = useState("Japanese");
    const [result, setResult] = useState<{ translation: string; pronunciation: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const LANGUAGES = ["Japanese", "Chinese", "Russian", "Arabic", "French", "German", "Italian", "Korean", "Greek", "Hindi"];

    const handleTranslate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!petName.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await translatePetName(petName, targetLang);
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="animate-fade-in">
            <div className="flex flex-col items-center gap-2 mb-6 text-center">
                 <div className="transform hover:scale-110 transition-transform duration-300 mb-2">
                    <PetCharacter pet="bird" className="w-32 h-32 drop-shadow-md" />
                 </div>
                <h2 className="text-3xl font-black text-[#5D4037]">{t.translator.title}</h2>
                <p className="opacity-100 text-xl font-bold text-[#333333] max-w-md">{t.translator.subtitle}</p>
            </div>

            <form onSubmit={handleTranslate} className="max-w-md mx-auto space-y-6">
                <Input
                    id="pet-name-translate"
                    label={t.translator.label_name}
                    value={petName}
                    onChange={e => setPetName(e.target.value)}
                    placeholder="e.g. Luna"
                />
                
                <Select
                    id="target-lang"
                    label={t.translator.label_lang}
                    value={targetLang}
                    onChange={e => setTargetLang(e.target.value)}
                >
                    {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </Select>

                <div className="flex justify-center pt-2">
                    <Button 
                        type="submit" 
                        disabled={isLoading || !petName.trim()}
                        className="w-full sm:w-auto shadow-lg"
                    >
                        {isLoading ? t.translator.btn_translating : t.translator.btn_translate}
                        {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2" />}
                    </Button>
                </div>
            </form>

            {isLoading && !result && (
                <div className="mt-10 p-8 flex flex-col items-center justify-center animate-fade-in">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#AA336A] mb-4"></div>
                    <p className="text-lg font-bold text-[#333333] animate-pulse">{t.translator.btn_translating}</p>
                </div>
            )}

            {error && <p className="mt-4 text-center text-red-500 bg-red-100 p-2 rounded">{error}</p>}

            {result && !isLoading && (
                <div className="mt-10 p-8 bg-white/40 rounded-[2rem] border-2 border-[#aab2a1]/30 animate-fade-in relative overflow-hidden shadow-inner">
                    <div className="absolute -right-6 -bottom-6 pointer-events-none opacity-40 transform rotate-12">
                        <PetCharacter pet="bird" className="w-32 h-32" />
                    </div>

                    <div className="text-center relative z-10">
                        <span className="text-xs uppercase tracking-[0.3em] font-black opacity-40 mb-2 block">{targetLang}</span>
                        <p className="text-6xl font-black text-[#5D4037] mb-4 tracking-tight drop-shadow-sm">{result.translation}</p>
                        <div className="bg-white/50 px-4 py-2 rounded-full inline-flex items-center gap-2 border border-white/40">
                             <span className="text-sm font-bold opacity-60 uppercase tracking-widest">{t.translator.pronunciation}:</span>
                             <span className="text-lg font-bold text-[#AA336A] italic">{result.pronunciation}</span>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

interface PlayScreenProps {
    onQuizComplete: (result: PetPersonalityResult) => void;
    addSavedName: (name: GeneratedName) => void;
    savedNames: GeneratedName[];
    petInfo: PetInfo;
    setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
    goHome: () => void;
}

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

type PlayMode = 'menu' | 'quiz' | 'battle' | 'translator';

export const PlayScreen: React.FC<PlayScreenProps> = ({ onQuizComplete, addSavedName, savedNames, petInfo, setPetInfo, goHome }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<PlayMode>('menu');

  if (mode === 'menu') {
      return (
        <div className="relative min-h-screen">
            <Header leftPet="dog" rightPet="cat" onLogoClick={goHome} />
            
            <main className="px-4 pb-24 max-w-lg mx-auto w-full flex flex-col gap-6 animate-fade-in mt-2">
                 <div className="-mt-4">
                    <BackToHomeButton onClick={goHome} />
                </div>

                <div className="flex flex-col gap-6">
                    <button 
                        onClick={() => setMode('quiz')}
                        className="bg-[var(--card-bg)] backdrop-blur-md rounded-[2rem] p-8 shadow-md border-2 border-white/40 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#AA336A]/20"
                    >
                        <div className="mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                            <PetCharacter pet="cat" className="w-28 h-28 drop-shadow-md" />
                        </div>
                        <h3 className="text-3xl font-black text-[#5D4037]">{t.quiz.title}</h3>
                        <p className="text-[#333333] font-bold leading-relaxed text-lg px-4 opacity-100">
                            {t.landing.feature3_desc}
                        </p>
                    </button>

                    <button 
                        onClick={() => setMode('battle')}
                        className="bg-[var(--card-bg)] backdrop-blur-md rounded-[2rem] p-8 shadow-md border-2 border-white/40 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#AA336A]/20"
                    >
                        <div className="mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                             <PetCharacter pet="dog" className="w-28 h-28 drop-shadow-md" />
                        </div>
                        <h3 className="text-3xl font-black text-[#5D4037]">{t.quick_fire.title}</h3>
                        <p className="text-[#333333] font-bold leading-relaxed text-lg px-4 opacity-100">
                             {t.landing.feature1_desc}
                        </p>
                    </button>

                    <button 
                        onClick={() => setMode('translator')}
                        className="bg-[var(--card-bg)] backdrop-blur-md rounded-[2rem] p-8 shadow-md border-2 border-white/40 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#AA336A]/20"
                    >
                        <div className="mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                             <PetCharacter pet="bird" className="w-28 h-28 drop-shadow-md" />
                        </div>
                        <h3 className="text-3xl font-black text-[#5D4037]">{t.translator.title}</h3>
                        <p className="text-[#333333] font-bold leading-relaxed text-lg px-4 opacity-100">
                             {t.translator.subtitle}
                        </p>
                    </button>
                </div>
            </main>
        </div>
      );
  }

  return (
    <div className="relative min-h-screen">
        <Header leftPet="dog" rightPet="cat" onLogoClick={() => setMode('menu')} />
        
        <main className="px-4 pb-24 max-w-xl mx-auto w-full animate-fade-in mt-4">
             <div className="-mt-4 flex gap-3 mb-6">
                <button 
                    onClick={() => setMode('menu')} 
                    className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30 active:scale-95"
                >
                    <BackIcon className="w-4 h-4" />
                    Play Menu
                </button>
                <BackToHomeButton onClick={goHome} />
            </div>

             {mode === 'quiz' && (
                <PersonalityQuiz 
                    onQuizComplete={onQuizComplete}
                    petInfo={petInfo}
                    setPetInfo={setPetInfo}
                    addSavedName={addSavedName}
                    savedNames={savedNames}
                />
             )}
             {mode === 'battle' && (
                <QuickFireDiscovery 
                    addSavedName={addSavedName} 
                    savedNames={savedNames}
                    petInfo={petInfo}
                    setPetInfo={setPetInfo}
                />
             )}
             {mode === 'translator' && (
                <NameTranslator />
             )}
        </main>
    </div>
  );
};