import React from 'react';
import { Card } from './ui/Card';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactUsProps {
    onBack: () => void;
}

export const ContactUs: React.FC<ContactUsProps> = ({ onBack }) => {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "Contact Us",
            subtitle: "We'd love to hear from you!",
            p1: "Have a question, feedback, or just want to share your new pet's name? We're here for it!",
            emailLabel: "Email Us Directly:",
            email: "revsan12902@gmail.com"
        },
        es: {
            title: "Contáctenos",
            subtitle: "¡Nos encantaría saber de usted!",
            p1: "¿Tiene alguna pregunta, comentario o simplemente quiere compartir el nombre de su nueva mascota? ¡Estamos aquí para ayudar!",
            emailLabel: "Escríbanos directamente:",
            email: "revsan12902@gmail.com"
        }
    };

    const t = content[language === 'fr' ? 'en' : language];

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            <div className="container mx-auto max-w-4xl">
                <header className="flex items-center justify-start mb-8">
                    <button onClick={onBack} className="p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors backdrop-blur-sm text-[#666666]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                </header>
                <main className="pb-40">
                    <Card className="text-center py-12">
                        <h1 className="text-4xl font-black mb-2">{t.title}</h1>
                        <p className="text-xl opacity-80 mb-12">{t.subtitle}</p>
                        
                        <div className="space-y-12 text-lg">
                            <p className="max-w-md mx-auto leading-relaxed opacity-80">{t.p1}</p>
                            
                            <div className="bg-white/10 p-10 rounded-[2.5rem] border border-white/20 shadow-xl inline-block group hover:bg-white/20 transition-all duration-500">
                                <p className="font-bold text-[#AA336A] mb-2 uppercase tracking-widest text-xs">{t.emailLabel}</p>
                                <a href={`mailto:${t.email}`} className="text-2xl sm:text-3xl font-black hover:scale-105 transition-transform block text-[var(--text-main)]">{t.email}</a>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};