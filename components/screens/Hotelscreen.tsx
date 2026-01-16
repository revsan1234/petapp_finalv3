import React, { useState } from 'react';
import { Header } from '../Header';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { findPetHotels } from '../../services/geminiService';
import type { PetHotel } from '../../types';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { useLanguage } from '../../contexts/LanguageContext';

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const HotelIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
);

interface HotelScreenProps {
    goHome: () => void;
}

export const HotelScreen: React.FC<HotelScreenProps> = ({ goHome }) => {
    const { t, language } = useLanguage();
    const [location, setLocation] = useState('');
    const [hotels, setHotels] = useState<PetHotel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) return;
        setIsLoading(true);
        setError(null);
        setHotels([]);
        try {
            const results = await findPetHotels(location, language);
            setHotels(results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            <div className="relative z-10">
                <Header leftPet="bird" rightPet="rabbit" onLogoClick={goHome} />
                <main className="py-4 md:py-8 px-4 pb-48 sm:pb-56">
                    <div className="flex flex-col gap-10 w-full mx-auto max-w-5xl">
                        <div className="-mt-4">
                             <button 
                                onClick={goHome} 
                                className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md font-black text-[10px] uppercase tracking-widest w-fit shadow-lg border border-white/10"
                            >
                                <BackIcon className="w-3 h-3" />
                                {t.common.back_home}
                            </button>
                        </div>

                        <Card>
                            <div className="flex justify-center items-end -space-x-8 sm:-space-x-16 mb-8 h-40 pt-4">
                                <PetCharacter pet="dog" className="w-16 h-16 sm:w-28 sm:h-28 z-10 animate-bounce-wiggle filter drop-shadow-2xl" style={{ animationDelay: '0ms' }} />
                                <PetCharacter pet="cat" className="w-16 h-16 sm:w-28 sm:h-28 z-20 -mb-2 animate-bounce-wiggle filter drop-shadow-2xl" style={{ animationDelay: '100ms' }} />
                                <PetCharacter pet="rabbit" className="w-16 h-16 sm:w-28 sm:h-28 z-30 -mb-1 animate-bounce-wiggle filter drop-shadow-2xl" style={{ animationDelay: '200ms' }} />
                                <PetCharacter pet="bird" className="w-16 h-16 sm:w-28 sm:h-28 z-20 -mb-2 animate-bounce-wiggle filter drop-shadow-2xl" style={{ animationDelay: '300ms' }} />
                                <PetCharacter pet="hamster" className="w-16 h-16 sm:w-28 sm:h-28 z-10 animate-bounce-wiggle filter drop-shadow-2xl" style={{ animationDelay: '400ms' }} />
                            </div>

                            <div className="flex flex-col items-center gap-2 mb-8 text-center">
                                <div className="bg-[#AA336A]/10 p-4 rounded-full mb-2">
                                    <HotelIcon className="w-10 h-10 text-[#AA336A]" />
                                </div>
                                <h2 className="text-3xl font-black">{t.hotel.title}</h2>
                                <p className="opacity-60 text-xl font-medium max-w-lg">{t.hotel.subtitle}</p>
                            </div>

                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end max-w-md mx-auto">
                                <Input
                                    id="hotel-location"
                                    label={t.hotel.label_location}
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder={t.placeholders.location}
                                />
                                <Button type="submit" disabled={isLoading || !location.trim()} variant="primary" className="shadow-xl">
                                    {isLoading ? t.hotel.searching : t.hotel.btn_search}
                                </Button>
                            </form>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {hotels.map((hotel, index) => (
                                <div 
                                    key={index} 
                                    className="bg-[var(--card-bg)] backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-white/20 flex flex-col h-full transform hover:-translate-y-2 transition-all duration-500"
                                >
                                    <h3 className="text-2xl font-black text-[#AA336A] mb-3">{hotel.name}</h3>
                                    <p className="text-lg mb-6 flex-grow italic font-medium opacity-60">"{hotel.summary}"</p>
                                    <div className="space-y-4 text-sm font-bold opacity-50">
                                        <div className="flex items-start gap-3">
                                            <span>📍</span>
                                            <span>{hotel.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span>📞</span>
                                            <span>{hotel.phone}</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-black/5">
                                        <Button 
                                            href={hotel.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            variant="secondary"
                                            className="w-full !py-4"
                                        >
                                            {t.adopt.visit_website}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};