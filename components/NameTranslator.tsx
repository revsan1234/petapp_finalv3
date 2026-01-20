import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { translatePetName } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { PetCharacter } from './assets/pets/PetCharacter';

const LANGUAGES = [
    "Japanese", "Chinese", "Russian", "Arabic", "French", "German", "Italian", "Korean", "Greek", "Hindi"
];

const LanguageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896 3.064 2.187 5.846 3.516 8.244m-4.516-8.244L3 5.621m3.24 12.13c4.08-1.368 7.423-4.674 9.12-8.382" />
    </svg>
);

export const NameTranslator: React.FC = () => {
    const { t } = useLanguage();
    const [petName, setPetName] = useState('');
    const [targetLang, setTargetLang] = useState(LANGUAGES[0]);
    const [result, setResult] = useState<{ translation: string; pronunciation: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2" />
                        ) : (
                            <LanguageIcon className="w-5 h-5 ml-1" />
                        )}
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