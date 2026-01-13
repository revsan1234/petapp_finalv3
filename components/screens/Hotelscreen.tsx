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

const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
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
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) return;

        setIsLoading(true);
        setError(null);
        setHotels([]);
        setHasSearched(true);

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
        <div className="relative min-h-screen overflow-hidden">
            <div className="relative z-10">
                <Header leftPet="bird" rightPet="rabbit" onLogoClick={goHome} />
                <main className="py-4 md:py-8 px-4">
                    <div className="flex flex-col gap-8 w-full mx-auto max-w-4xl">
                        <div className="-mt-4">
                             <button 
                                onClick={goHome} 
                                className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30"
                            >
                                <BackIcon className="w-4 h-4" />
                                {t.common.back_home}
                            </button>
                        </div>

                        <Card>
                            <div className="flex justify-center items-end -space-x-16 sm:-space-x-20 md:-space-x-28 mb-6 h-56 sm:h-72 md:h-[340px]">
                                <PetCharacter pet="dog" className="w-48 h-48 sm:w-80 sm:h-80 z-10 animate-bounce-wiggle filter drop-shadow-lg" style={{ animationDelay: '0ms' }} />
                                <PetCharacter pet="cat" className="w-48 h-48 sm:w-80 sm:h-80 z-20 -mb-4 animate-bounce-wiggle filter drop-shadow-lg" style={{ animationDelay: '100ms' }} />
                                <PetCharacter pet="rabbit" className="w-48 h-48 sm:w-80 sm:h-80 z-30 -mb-2 animate-bounce-wiggle filter drop-shadow-lg" style={{ animationDelay: '200ms' }} />
                                <PetCharacter pet="bird" className="w-48 h-48 sm:w-80 sm:h-80 z-20 -mb-4 animate-bounce-wiggle filter drop-shadow-lg" style={{ animationDelay: '300ms' }} />
                                <PetCharacter pet="hamster" className="w-48 h-48 sm:w-80 sm:h-80 z-10 animate-bounce-wiggle filter drop-shadow-lg" style={{ animationDelay: '400ms' }} />
                            </div>

                            <div className="flex flex-col items-center gap-2 mb-6 text-center">
                                <div className="bg-[#AA336A]/10 p-4 rounded-full mb-2">
                                    <HotelIcon className="w-10 h-10 text-[#AA336A]" />
                                </div>
                                <h2 className="text-3xl font-bold">{t.hotel.title}</h2>
                                <p className="opacity-80 text-xl max-w-lg">{t.hotel.subtitle}</p>
                            </div>

                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end max-w-md mx-auto">
                                <Input
                                    id="hotel-location"
                                    label={t.hotel.label_location}
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder={t.placeholders.location}
                                />
                                <Button type="submit" disabled={isLoading || !location.trim()} variant="primary">
                                    {isLoading ? t.hotel.searching : t.hotel.btn_search}
                                    <SearchIcon className="w-5 h-5" />
                                </Button>
                            </form>
                        </Card>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                                {error}
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex flex-col items-center py-12 gap-4">
                                 <PetCharacter pet="bird" className="w-24 h-24 animate-bounce" />
                                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#AA336A]"></div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hotels.map((hotel, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300"
                                >
                                    <h3 className="text-xl font-bold text-[#AA336A] mb-2">{hotel.name}</h3>
                                    <p className="text-sm mb-4 flex-grow italic font-medium opacity-80">"{hotel.summary}"</p>
                                    <div className="space-y-3 text-sm font-semibold opacity-70">
                                        <div className="flex items-start gap-2">
                                            <LocationIcon className="w-5 h-5 shrink-0" />
                                            <span>{hotel.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon className="w-5 h-5 shrink-0" />
                                            <span>{hotel.phone}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-black/10">
                                        <Button 
                                            href={hotel.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            variant="secondary"
                                            className="w-full !py-2 !text-sm"
                                        >
                                            {t.adopt.visit_website}
                                            <GlobeIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {hasSearched && !isLoading && hotels.length === 0 && !error && (
                            <div className="text-center opacity-60 mt-8">
                                <p className="text-xl">{t.hotel.no_results}</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};