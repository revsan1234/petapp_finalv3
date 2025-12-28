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
            const responseText = await getPetConsultantResponse(
                messages,
                inputValue,
                language,
                t.expert.system_instruction
            );

            const modelMsg: ChatMessage = {
                role: 'model',
                text: responseText,
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
                                <PetCharacter pet="other" className="w-10 h-10" />
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
                                <PetCharacter pet="other" className="w-24 h-24 mb-2 animate-bounce-wiggle" />
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
                                    {msg.text}
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