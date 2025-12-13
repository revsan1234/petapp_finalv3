import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { generatePetHoroscope } from '../services/geminiService';
import { PetCharacter } from './assets/pets/PetCharacter';
import { PET_TYPES } from '../constants';
import type { PetKind } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const ZODIAC_SIGNS = [
    "Aries (Mar 21 - Apr 19)", "Taurus (Apr 20 - May 20)", "Gemini (May 21 - Jun 20)", 
    "Cancer (Jun 21 - Jul 22)", "Leo (Jul 23 - Aug 22)", "Virgo (Aug 23 - Sep 22)", 
    "Libra (Sep 23 - Oct 22)", "Scorpio (Oct 23 - Nov 21)", "Sagittarius (Nov 22 - Dec 21)", 
    "Capricorn (Dec 22 - Jan 19)", "Aquarius (Jan 20 - Feb 18)", "Pisces (Feb 19 - Mar 20)"
];

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

export const PetHoroscope: React.FC = () => {
    const { t, language } = useLanguage();
    const [sign, setSign] = useState(ZODIAC_SIGNS[0]);
    const [petName, setPetName] = useState('');
    const [petType, setPetType] = useState('Dog');
    const [reading, setReading] = useState<{ prediction: string; luckyItem: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetReading = async () => {
        if (!petName.trim()) return;
        setIsLoading(true);
        setReading(null);
        
        const result = await generatePetHoroscope(sign, petType, petName, language);
        setReading(result);
        setIsLoading(false);
    };

    return (
        <Card>
            <div className="flex flex-col items-center gap-2 mb-4 text-center">
                 <div className="bg-[#666666]/10 p-3 rounded-full mb-2">
                    <MoonIcon className="w-8 h-8 text-[#AA336A]" />
                 </div>
                <h2 className="text-3xl font-bold">{t.horoscope.title}</h2>
                <p className="opacity-80 text-xl">{t.horoscope.subtitle}</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                        id="pet-name-horoscope" 
                        label={t.horoscope.label_name}
                        value={petName} 
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="e.g. Luna"
                    />
                    <Select 
                        id="pet-type-horoscope" 
                        label={t.horoscope.label_type}
                        value={petType} 
                        onChange={(e) => setPetType(e.target.value)}
                    >
                        {PET_TYPES.map(type => <option key={type} value={type}>{t.options.types[type] || type}</option>)}
                    </Select>
                </div>

                <Select 
                    id="zodiac-sign" 
                    label={t.horoscope.label_zodiac}
                    value={sign} 
                    onChange={(e) => setSign(e.target.value)}
                >
                    {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>

                <div className="flex justify-center pt-2">
                    <Button 
                        onClick={handleGetReading} 
                        disabled={isLoading || !petName.trim()} 
                        variant="primary" 
                        className="w-full sm:w-auto"
                    >
                        {isLoading ? t.horoscope.btn_reading : t.horoscope.btn_read}
                        <MoonIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {reading && (
                <div className="mt-8 animate-fade-in bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-white/20 relative overflow-hidden">
                     {/* Decorative Character - Shows the selected pet type */}
                    <div className="absolute -right-4 -bottom-4 pointer-events-none">
                        <PetCharacter pet={petType.toLowerCase() as PetKind} className="w-32 h-32" />
                    </div>

                    <h3 className="text-xl font-bold text-[#AA336A] mb-2">✨ {petName}: {t.horoscope.result_title}</h3>
                    <p className="text-lg font-medium italic mb-4 relative z-10">"{reading.prediction}"</p>
                    
                    <div className="bg-white/30 rounded-lg p-3 inline-block relative z-10">
                        <span className="text-xs uppercase tracking-widest opacity-70 font-bold block">{t.horoscope.lucky_item}</span>
                        <span className="font-bold text-[#666666]">{reading.luckyItem}</span>
                    </div>
                </div>
            )}
        </Card>
    );
};