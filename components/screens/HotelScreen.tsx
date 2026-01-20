import React, { useState } from 'react';
import { Header } from '../Header';
import { Card } from '../ui/Card';
import { Button, BackToHomeButton } from '../ui/Button';
import { Input } from '../ui/Input';
import { findPetHotels } from '../../services/geminiService';
import type { AdoptionCenter } from '../../types';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { useLanguage } from '../../contexts/LanguageContext';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
    </svg>
);

export const HotelScreen: React.FC<{ goHome: () => void }> = ({ goHome }) => {
    const { t, language } = useLanguage();
    const [location, setLocation] = useState('');
    const [centers, setCenters] = useState<AdoptionCenter[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) return;
        setIsLoading(true); setError(null); setCenters([]);
        try {
            const results = await findPetHotels(location, language);
            setCenters(results);
        } catch (err: any) { setError(t.hotels.no_results); } finally { setIsLoading(false); }
    };

    return (
        <div className="relative min-h-screen">
            <Header leftPet="bird" rightPet="hamster" onLogoClick={goHome} />
            <main className="py-8 px-6 max-w-5xl mx-auto w-full flex flex-col gap-12 pb-48">
                <div className="-mt-12">
                    <BackToHomeButton onClick={goHome} />
                </div>
                
                <Card className="!bg-[#fffdf2] !p-12 sm:!p-20 border-none relative overflow-visible shadow-premium mt-32 text-center">
                    <div className="absolute -top-48 left-0 right-0 flex justify-center items-end -space-x-12 sm:-space-x-20 pointer-events-none overflow-visible">
                        <PetCharacter pet="bird" className="w-40 h-40 sm:w-64 sm:h-64 animate-bounce-entry" style={{ animationDelay: '0s' }} />
                        <PetCharacter pet="hamster" className="w-40 h-40 sm:w-64 sm:h-64 animate-bounce-entry -mb-6" style={{ animationDelay: '0.1s' }} />
                        <PetCharacter pet="rabbit" className="w-40 h-40 sm:w-64 sm:h-64 animate-bounce-entry" style={{ animationDelay: '0.2s' }} />
                        <PetCharacter pet="dog" className="w-40 h-40 sm:w-64 sm:h-64 animate-bounce-entry -mb-4" style={{ animationDelay: '0.3s' }} />
                        <PetCharacter pet="cat" className="w-40 h-40 sm:w-64 sm:h-64 animate-bounce-entry" style={{ animationDelay: '0.4s' }} />
                    </div>

                    <div className="flex flex-col items-center gap-8 mb-16 pt-16">
                        <h2 className="text-6xl sm:text-7xl font-bold text-[#333] uppercase tracking-tight font-heading leading-none">{t.hotels.title}</h2>
                        <p className="text-[#333] font-bold text-2xl sm:text-3xl opacity-70 max-w-2xl mx-auto leading-tight">
                            {t.hotels.subtitle}
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col items-center gap-12 max-w-2xl mx-auto w-full">
                        <div className="w-full">
                            <Input
                                label={t.hotels.label_location}
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder={t.hotels.placeholder}
                                className="!bg-zinc-200 !border-none !text-4xl !p-10 text-center !rounded-[2.5rem] shadow-inner font-bold placeholder:opacity-40 !text-[#333]"
                            />
                            <style>{`
                                label[for="Location"] { color: #333 !important; opacity: 0.6; font-size: 1.2rem; margin-bottom: 1rem; }
                            `}</style>
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isLoading || !location.trim()}
                            variant="primary"
                            className="!bg-[#AA336A] !text-white !py-8 !px-16 !text-3xl font-bold shadow-2xl uppercase rounded-full flex items-center gap-6 transition-transform hover:scale-105 active:scale-95 disabled:!bg-gray-300 disabled:!text-gray-500"
                        >
                            {isLoading ? t.hotels.btn_searching : t.hotels.btn_search}
                            {!isLoading && <SearchIcon className="w-10 h-10" />}
                        </Button>
                    </form>
                </Card>

                {centers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mt-16 animate-fade-in">
                        {centers.map((center, index) => (
                            <div key={index} className="bg-white/95 rounded-[4rem] p-12 shadow-premium border-none flex flex-col h-full group">
                                <h3 className="text-4xl font-bold text-[#AA336A] mb-8 uppercase leading-tight font-heading">{center.name}</h3>
                                <p className="text-2xl sm:text-3xl mb-12 flex-grow italic font-bold text-[#666] leading-relaxed opacity-90">"{center.mission}"</p>
                                <Button href={center.website} target="_blank" variant="secondary" className="w-full !bg-[#8da38d] !text-white !py-6 !text-3xl font-bold rounded-[2rem] shadow-xl hover:!bg-[#7a8e7a] transition-colors">
                                    {t.hotels.visit_website}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};