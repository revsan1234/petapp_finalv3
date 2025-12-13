import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { getPetNameMeaning } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

export const NameMeaningFinder: React.FC = () => {
    const { t, language } = useLanguage();
    const [nameQuery, setNameQuery] = useState('');
    const [result, setResult] = useState<{ name: string; meaning: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const meaning = await getPetNameMeaning(nameQuery, language);
            setResult({ name: nameQuery, meaning });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <div className="flex flex-col gap-2 mb-6 text-center">
                <h2 className="text-3xl font-bold">{t.meaning_finder.title}</h2>
                <p className="opacity-80 text-xl">{t.meaning_finder.subtitle}</p>
            </div>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
                <Input
                    id="name-search"
                    label={t.meaning_finder.label}
                    value={nameQuery}
                    onChange={e => setNameQuery(e.target.value)}
                    placeholder={t.meaning_finder.placeholder}
                />
                <Button 
                    type="submit" 
                    disabled={isLoading || !nameQuery.trim()}
                    variant="primary"
                >
                    {isLoading ? t.meaning_finder.btn_searching : t.meaning_finder.btn_search}
                    <SearchIcon className="w-5 h-5" />
                </Button>
            </form>

            {isLoading && (
                <div className="mt-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto"></div>
                    <p className="mt-3 opacity-80 text-xl">{t.meaning_finder.loading}</p>
                </div>
            )}

            {error && <p className="mt-4 text-center text-red-500 bg-red-200/50 p-3 rounded-lg">{error}</p>}

            {result && !isLoading && (
                <div className="mt-6 p-4 bg-[#666666]/10 rounded-lg animate-fade-in">
                    <p className="text-2xl font-bold text-[#666666]">{result.name}</p>
                    <p className="mt-2 opacity-90 italic text-lg">{result.meaning}</p>
                </div>
            )}
        </Card>
    );
};