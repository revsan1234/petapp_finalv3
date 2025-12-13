
import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { generateNameOfTheDay } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z" clipRule="evenodd" />
    </svg>
);

interface DailyName {
    name: string;
    meaning: string;
    timestamp: number;
}

export const NameOfTheDay: React.FC = () => {
    const { t, language } = useLanguage();
    const [dailyName, setDailyName] = useState<{ name: string, meaning: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchName = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Use language-specific key to ensure we don't show English cached content in Spanish or vice versa
                const storageKey = `nameOfTheDay_${language}`;
                const cachedData = localStorage.getItem(storageKey);
                const twentyFourHours = 24 * 60 * 60 * 1000;
                
                if (cachedData) {
                    const parsedData: DailyName = JSON.parse(cachedData);
                    if (Date.now() - parsedData.timestamp < twentyFourHours) {
                        setDailyName(parsedData);
                        setIsLoading(false);
                        return;
                    }
                }
                
                const newName = await generateNameOfTheDay(language);
                const newDailyName: DailyName = { ...newName, timestamp: Date.now() };
                localStorage.setItem(storageKey, JSON.stringify(newDailyName));
                setDailyName(newDailyName);

            } catch (err) {
                setError(t.name_day.error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchName();
    }, [language, t.name_day.error]);

    const renderContent = () => {
        if (isLoading) {
            return <p className="opacity-80">{t.name_day.fetching}</p>;
        }
        if (error) {
            return <p className="text-red-500">{error}</p>;
        }
        if (dailyName) {
            return (
                <>
                    <p className="text-4xl font-bold text-[#AA336A] tracking-wider">{dailyName.name}</p>
                    <p className="opacity-80 italic">{dailyName.meaning}</p>
                </>
            );
        }
        return null;
    };

    return (
        <Card className="border-2 border-[#AA336A]/80">
            <div className="flex flex-col items-center text-center gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <StarIcon className="w-6 h-6 text-[#AA336A]" />
                            <h3 className="text-2xl font-bold">{t.name_day.title}</h3>
                            <StarIcon className="w-6 h-6 text-[#AA336A]" />
                        </div>
                    </div>
                </div>
                {renderContent()}
            </div>
        </Card>
    );
};
