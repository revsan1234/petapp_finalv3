import React, { useState } from 'react';
import type { PetInfo, GeneratedName } from '../types';
import { PET_TYPES, PET_GENDERS, PET_PERSONALITIES, NAME_STYLES } from '../constants';
import { generatePetNames } from '../services/geminiService';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { CelebrationEffect } from './ui/CelebrationEffect';
import { useLanguage } from '../contexts/LanguageContext';

interface NameGeneratorProps {
    addSavedName: (name: GeneratedName) => void;
    savedNames: GeneratedName[];
    petInfo: PetInfo;
    setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
}

const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const HEART_PATH = "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z";
const HeartIconFilled = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d={HEART_PATH} /></svg>
);
const HeartIconOutline = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d={HEART_PATH} /></svg>
);

export const NameGenerator: React.FC<NameGeneratorProps> = ({ addSavedName, savedNames, petInfo, setPetInfo }) => {
    const { t, language } = useLanguage();
    const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [animatingHeartId, setAnimatingHeartId] = useState<string | null>(null);
    const [showCelebration, setShowCelebration] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setGeneratedNames([]);
        try {
            const names = await generatePetNames(petInfo, language);
            setGeneratedNames(names);
            setShowCelebration(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPetInfo(prev => ({ ...prev, [name]: value }));
    };

    const isSaved = (nameId: string) => savedNames.some(saved => saved.id === nameId);

    const handleSaveName = (name: GeneratedName) => {
        if (isSaved(name.id)) return;
        addSavedName(name);
        setAnimatingHeartId(name.id);
        setTimeout(() => setAnimatingHeartId(null), 500);
    };

    return (
        <Card>
            <CelebrationEffect trigger={showCelebration} onComplete={() => setShowCelebration(false)} />
            <div className="flex flex-col gap-2 mb-6 text-center">
                <h2 className="text-3xl font-bold">{t.generator.title}</h2>
                <p className="opacity-80 text-xl">{t.generator.subtitle}</p>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-6 w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select id="type" name="type" label={t.generator.label_type} value={petInfo.type} onChange={handleChange}>
                        {PET_TYPES.map(type => (
                            <option key={type} value={type}>{t.options.types[type] || type}</option>
                        ))}
                    </Select>
                    <Select id="gender" name="gender" label={t.generator.label_gender} value={petInfo.gender} onChange={handleChange}>
                        {PET_GENDERS.map(gender => (
                            <option key={gender} value={gender}>{t.options.genders[gender] || gender}</option>
                        ))}
                    </Select>
                    <Select id="personality" name="personality" label={t.generator.label_personality} value={petInfo.personality} onChange={handleChange}>
                        {PET_PERSONALITIES.map(p => (
                            <option key={p} value={p}>{t.options.personalities[p] || p}</option>
                        ))}
                    </Select>
                    <Select id="style" name="style" label={t.generator.label_style} value={petInfo.style} onChange={handleChange}>
                        {NAME_STYLES.map(s => (
                            <option key={s} value={s}>{t.options.styles[s] || s}</option>
                        ))}
                    </Select>
                </div>
                <div className="flex justify-center pt-2">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? t.generator.btn_generating : t.generator.btn_generate}
                        <SparkleIcon className="w-5 h-5"/>
                    </Button>
                </div>
            </form>

            {error && <p className="mt-4 text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

            {isLoading && (
                <div className="mt-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AA336A] mx-auto"></div>
                    <p className="mt-4 opacity-80 text-xl font-medium">{t.generator.loading_text}</p>
                </div>
            )}

            {generatedNames.length > 0 && !isLoading && (
                <div className="mt-12 animate-fade-in">
                    <h3 className="text-2xl font-bold text-center mb-2">{t.generator.results_title}</h3>
                    <p className="text-center opacity-70 mb-6 font-medium italic">{t.generator.tap_to_save}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedNames.map((name, index) => (
                            <div key={name.id} className="bg-white/40 backdrop-blur-sm p-5 rounded-2xl flex flex-col transition-all hover:scale-[1.02] border border-white/50 shadow-sm animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="pr-4">
                                        <p className="font-black text-3xl text-[#5D4037]">{name.name}</p>
                                        <p className="text-sm opacity-90 font-bold text-[#AA336A] mt-0.5">{name.meaning}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleSaveName(name)} 
                                        className="p-3 hover:bg-white/50 rounded-full transition-all active:scale-125 shrink-0"
                                    >
                                        {isSaved(name.id) ? (
                                            <HeartIconFilled className={`w-8 h-8 text-[#AA336A] ${animatingHeartId === name.id ? 'animate-heart-beat' : ''}`} />
                                        ) : (
                                            <HeartIconOutline className="w-8 h-8 text-[#AA336A]" />
                                        )}
                                    </button>
                                </div>
                                {(name as any).comment && (
                                    <div className="mt-3 p-3 bg-white/30 rounded-xl border-l-4 border-[#AA336A]">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#AA336A] opacity-70">AI Reference Note</span>
                                        </div>
                                        <p className="text-sm italic opacity-90 font-medium leading-relaxed text-[#5D4037]">
                                            "{ (name as any).comment }"
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};