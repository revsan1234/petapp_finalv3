
import React, { useState, useCallback } from 'react';
import type { PetInfo, GeneratedName } from '../types';
import { PET_TYPES, PET_GENDERS, PET_PERSONALITIES, NAME_STYLES } from '../constants';
import { generatePetNames } from '../services/geminiService';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Modal } from './ui/Modal';
import { CelebrationEffect } from './ui/CelebrationEffect';
import { useLanguage } from '../contexts/LanguageContext';
import { QuotaError } from '../types';
// Fix: Added missing PetCharacter import
import { PetCharacter } from './assets/pets/PetCharacter';

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

const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 a2.25 2.25 0 0 0-3.933 2.186Z" />
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
    const [isButtonAnimating, setIsButtonAnimating] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [quotaModal, setQuotaModal] = useState<{ isOpen: boolean; title: string; desc: string }>({
        isOpen: false,
        title: '',
        desc: ''
    });

    const generateNames = useCallback(async (info: PetInfo) => {
        setIsLoading(true);
        setError(null);
        setGeneratedNames([]);
        try {
            const names = await generatePetNames(info, language);
            setGeneratedNames(names);
            setShowCelebration(true);
        } catch (err: any) { 
            // Fix: Comparison with 'BUSY' is now valid as types.ts was updated to include it in QuotaError code union
            if (err instanceof QuotaError) {
                setQuotaModal({
                    isOpen: true,
                    title: err.code === 'BUSY' ? t.quota.busy_title : t.quota.rate_limit_title,
                    desc: err.code === 'BUSY' ? t.quota.busy_desc : t.quota.rate_limit_desc
                });
            } else {
                setError(t.generator.error); 
            }
        } finally { 
            setIsLoading(false); 
        }
    }, [language, t]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPetInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsButtonAnimating(true);
        generateNames(petInfo);
        setTimeout(() => setIsButtonAnimating(false), 500); 
    };
    
    const handleSaveName = (name: GeneratedName) => {
        if (isSaved(name.id)) return;
        addSavedName(name);
        setAnimatingHeartId(name.id);
        setTimeout(() => { setAnimatingHeartId(null); }, 500);
    };
    
    const isSaved = useCallback((nameId: string) => { return savedNames.some(saved => saved.id === nameId); }, [savedNames]);

    const handleShareList = async () => {
        if (generatedNames.length === 0) return;
        const listText = generatedNames.map(n => `• ${n.name}: ${n.meaning}`).join('\n');
        const shareData = {
            title: `Pet Name Ideas for my ${petInfo.type}!`,
            text: `Check out these names I found on NameMyPet.org:\n\n${listText}\n\nWhich one is your favorite?`,
            url: 'https://namemypet.org'
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                alert("List copied to clipboard!");
            }
        } catch (err) {
            console.error("Share failed", err);
        }
    };

    const renderNameList = (list: GeneratedName[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((name, index) => (
                <div key={name.id} className="bg-[#666666]/10 p-4 rounded-lg flex justify-between items-center transition-transform hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 50}ms`}}>
                    <div><p className="font-bold text-lg">{name.name}</p><p className="text-sm opacity-70">{name.meaning}</p></div>
                    <button onClick={() => handleSaveName(name)} disabled={isSaved(name.id)} className="p-2 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                         {isSaved(name.id) ? <HeartIconFilled className={`w-7 h-7 text-[#AA336A] ${animatingHeartId === name.id ? 'animate-heart-beat' : ''}`} /> : <HeartIconOutline className={`w-7 h-7 text-[#AA336A] ${animatingHeartId === name.id ? 'animate-heart-beat' : ''}`} />}
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <Card>
            <CelebrationEffect trigger={showCelebration} onComplete={() => setShowCelebration(false)} />
            <div className="flex justify-center items-center gap-4 mb-6 text-center">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold">{t.generator.title}</h2>
                    <p className="opacity-80 text-xl">{t.generator.subtitle}</p>
                </div>
            </div>
            <div className="flex justify-center">
                 <form onSubmit={handleSubmitForm} className="space-y-6 w-full max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select id="type" name="type" label={t.generator.label_type} value={petInfo.type} onChange={handleChange}>
                            {PET_TYPES.map(type => (
                                <option key={type} value={type}>
                                    {t.options.types[type] || type}
                                </option>
                            ))}
                        </Select>
                        <Select id="gender" name="gender" label={t.generator.label_gender} value={petInfo.gender} onChange={handleChange}>
                            {PET_GENDERS.map(gender => (
                                <option key={gender} value={gender}>
                                    {t.options.genders[gender] || gender}
                                </option>
                            ))}
                        </Select>
                        <Select id="personality" name="personality" label={t.generator.label_personality} value={petInfo.personality} onChange={handleChange}>
                            {PET_PERSONALITIES.map(p => (
                                <option key={p} value={p}>
                                    {t.options.personalities[p] || p}
                                </option>
                            ))}
                        </Select>
                        <Select id="style" name="style" label={t.generator.label_style} value={petInfo.style} onChange={handleChange}>
                            {NAME_STYLES.map(s => (
                                <option key={s} value={s}>
                                    {t.options.styles[s] || s}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex justify-center pt-2">
                        <Button type="submit" disabled={isLoading} className={isButtonAnimating ? 'animate-bounce-wiggle' : ''}>
                            {isLoading ? t.generator.btn_generating : t.generator.btn_generate}
                            <SparkleIcon className="w-5 h-5"/>
                        </Button>
                    </div>
                </form>
            </div>
            {error && <p className="mt-4 text-center text-red-500 bg-red-200/50 p-3 rounded-lg">{error}</p>}
            {isLoading && (<div className="mt-6 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto"></div><p className="mt-4 opacity-80 text-lg">{t.generator.loading_text}</p></div>)}
            {generatedNames.length > 0 && !isLoading && (
                <div className="mt-8 animate-fade-in">
                    <h3 className="text-2xl font-bold text-center mb-4">{t.generator.results_title}</h3>
                    {renderNameList(generatedNames)}
                    <div className="mt-8 flex justify-center">
                        <Button onClick={handleShareList} variant="secondary" className="!w-auto !px-8 shadow-md">
                            <ShareIcon className="w-5 h-5 mr-2" />
                            {t.saved_names.btn_share_text}
                        </Button>
                    </div>
                </div>
            )}

            <Modal
                isOpen={quotaModal.isOpen}
                onClose={() => setQuotaModal({ ...quotaModal, isOpen: false })}
                title={quotaModal.title}
                confirmText={t.quota.btn_dismiss}
                onConfirm={() => setQuotaModal({ ...quotaModal, isOpen: false })}
            >
                <div className="flex flex-col items-center text-center py-4">
                    {/* Fix: PetCharacter is now correctly available */}
                    <PetCharacter pet="dog" className="w-32 h-32 mb-6" />
                    <p className="text-lg leading-relaxed font-medium">
                        {quotaModal.desc}
                    </p>
                </div>
            </Modal>
        </Card>
    );
};
