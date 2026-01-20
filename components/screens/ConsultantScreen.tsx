
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Header } from '../Header';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { useLanguage } from '../../contexts/LanguageContext';
import { getPetConsultantResponse } from '../../services/geminiService';
import type { ChatMessage } from '../../types';

interface ConsultantScreenProps {
    goHome: () => void;
}

interface ExtendedChatMessage extends ChatMessage {
    sources?: { uri: string; title: string }[];
}

export const ConsultantScreen: React.FC<ConsultantScreenProps> = ({ goHome }) => {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<ExtendedChatMessage[]>(() => {
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

    // Clean text by removing Markdown link syntax [text](url)
    const cleanMessageText = (text: string) => {
        return text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').trim();
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMsg: ExtendedChatMessage = {
            role: 'user',
            text: inputValue,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const result = await getPetConsultantResponse(
                messages,
                inputValue,
                language,
                t.expert.system_instruction
            );

            const modelMsg: ExtendedChatMessage = {
                role: 'model',
                text: result.text,
                timestamp: Date.now(),
                sources: result.sources
            };

            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        if (window.confirm(t.expert.clear_confirm || "Clear chat?")) {
            setMessages([]);
            localStorage.removeItem('pet_chat_history');
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
                                <PetCharacter pet="dog" className="w-10 h-10" />
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
                                <PetCharacter pet="dog" className="w-24 h-24 mb-2 animate-bounce-wiggle" />
                                <p className="text-xl font-medium max-w-xs">
                                    {t.expert.welcome}
                                </p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
                            >
                                <div 
                                    className={`max-w-[90%] p-4 rounded-2xl shadow-sm text-lg leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-[#AA336A] text-white rounded-tr-none' 
                                            : 'bg-white/50 text-[var(--text-main)] rounded-tl-none border border-white/20'
                                    }`}
                                >
                                    {cleanMessageText(msg.text)}
                                    
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-black/5 flex flex-col gap-2">
                                            <p className="text-[11px] uppercase font-bold opacity-40 tracking-widest">Learn More:</p>
                                            <div className="flex flex-col gap-2">
                                                {msg.sources.map((source, idx) => (
                                                    <a 
                                                        key={idx} 
                                                        href={source.uri} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={`text-base sm:text-lg font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-between active:scale-[0.98] ${
                                                            msg.role === 'user' 
                                                                ? 'bg-white/20 text-white hover:bg-white/30' 
                                                                : 'bg-[#AA336A]/10 text-[#AA336A] hover:bg-[#AA336A]/20 border border-[#AA336A]/20'
                                                        }`}
                                                    >
                                                        <span className="truncate pr-2">{source.title}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className={`text-[10px] mt-1 opacity-50 text-right`}>
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
                            className="flex-grow bg-white/40 border border-white/30 text-[var(--text-main)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#AA336A] outline-none transition-all placeholder:text-[var(--text-main)]/40 text-lg"
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
