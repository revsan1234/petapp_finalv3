
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Header } from '../Header';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { useLanguage } from '../../contexts/LanguageContext';
import { getPetConsultantResponse } from '../../services/geminiService';
import type { ChatMessage } from '../../types';

const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

interface ConsultantScreenProps {
    goHome: () => void;
}

export const ConsultantScreen: React.FC<ConsultantScreenProps> = ({ goHome }) => {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem('pet_chat_history');
        return saved ? JSON.parse(saved) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem('pet_chat_history', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMsg: ChatMessage = {
            role: 'user',
            text: inputValue,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const data = await getPetConsultantResponse(messages, inputValue, language);
            
            const modelMsg: ChatMessage = {
                role: 'model',
                text: JSON.stringify(data),
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        if (window.confirm(t.expert.btn_clear + "?")) {
            setMessages([]);
            localStorage.removeItem('pet_chat_history');
        }
    };

    const renderMessageContent = (msg: ChatMessage) => {
        if (msg.role === 'user') return msg.text;

        try {
            const data = JSON.parse(msg.text);
            return (
                <div className="flex flex-col gap-3">
                    <p>{data.text}</p>
                    {data.url && (
                        <div className="mt-1">
                            <Button 
                                href={data.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                variant="secondary"
                                className="!py-2 !px-4 !text-xs !w-fit bg-white/20 border-black/10 text-[#2d4a2d]"
                            >
                                Learn More
                                <GlobeIcon className="w-3 h-3" />
                            </Button>
                        </div>
                    )}
                </div>
            );
        } catch (e) {
            return msg.text;
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            <Header leftPet="dog" rightPet="cat" onLogoClick={goHome} />
            
            <main className="flex-grow py-4 px-4 pb-32 flex flex-col max-w-4xl mx-auto w-full">
                <Card className="flex-grow flex flex-col overflow-hidden max-h-[70vh]">
                    <div className="flex items-center justify-between mb-4 border-b border-black/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#AA336A]/20 p-2 rounded-full">
                                <PetCharacter pet="cat" className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-main)]">{t.expert.title}</h2>
                                <p className="text-sm opacity-60 font-medium">{t.expert.subtitle}</p>
                            </div>
                        </div>
                        <button 
                            onClick={clearChat}
                            className="text-xs uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity"
                        >
                            {t.expert.btn_clear}
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60 space-y-4">
                                <PetCharacter pet="cat" className="w-24 h-24 mb-2 animate-bounce-wiggle" />
                                <p className="text-xl font-medium max-w-xs">
                                    {t.expert.welcome}
                                </p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div 
                                    className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-lg leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-[#AA336A] text-white rounded-tr-none' 
                                            : 'bg-white/50 text-[var(--text-main)] rounded-tl-none border border-white/20'
                                    }`}
                                >
                                    {renderMessageContent(msg)}
                                    <div className={`text-[10px] mt-2 opacity-50 text-right`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-white/30 text-[var(--text-main)] p-3 rounded-2xl rounded-tl-none text-sm italic">
                                    {t.expert.typing}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-black/10 flex gap-2">
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={t.expert.placeholder}
                            className="flex-grow bg-white/40 border border-white/30 text-[var(--text-main)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#AA336A] outline-none transition-all placeholder:text-[var(--text-main)]/40"
                        />
                        <Button 
                            type="submit" 
                            disabled={!inputValue.trim() || isTyping}
                            className="!w-auto !py-3 !px-6"
                        >
                            {t.expert.btn_send}
                        </Button>
                    </form>
                </Card>
            </main>
        </div>
    );
};
