
import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../Header';
import { Card } from '../ui/Card';
import { Button, BackToHomeButton } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { 
    generatePetNames, 
    generatePetPersonality, 
    generateQuickFireList, 
    translatePetName, 
    generatePetHoroscope, 
    getPetConsultantResponse
} from '../../services/geminiService';
import { PET_TYPES, PET_GENDERS, NAME_STYLES } from '../../constants';
import { GeneratedName, PetInfo, PetPersonalityResult, PetKind, ChatMessage, PetGender, PetType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PetCharacter } from '../assets/pets/PetCharacter';

const HEART_PATH = "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z";
const HeartIconFilled = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d={HEART_PATH} /></svg>
);
const HeartIconOutline = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d={HEART_PATH} /></svg>
);

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const NameTranslator: React.FC = () => {
    const { t } = useLanguage();
    const [petName, setPetName] = useState('');
    const [targetLang, setTargetLang] = useState("Japanese");
    const [result, setResult] = useState<{ translation: string; pronunciation: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const languages = ["Japanese", "Chinese", "Russian", "Arabic", "French", "German", "Italian", "Korean", "Greek", "Hindi"];
    const handleTranslate = async (e: React.FormEvent) => { e.preventDefault(); if (!petName.trim()) return; setIsLoading(true); try { const data = await translatePetName(petName, targetLang); setResult(data); } catch (err) { console.error(err); } finally { setIsLoading(false); } };
    return (
        <Card className="animate-fade-in">
            <div className="flex flex-col items-center text-center mb-6"><PetCharacter pet="bird" className="w-32 h-32 mb-4 drop-shadow-md" /><h2 className="text-3xl font-black text-[#5D4037]">{t.translator.title}</h2><p className="opacity-80 text-lg font-bold">{t.translator.subtitle}</p></div>
            <form onSubmit={handleTranslate} className="max-w-md mx-auto space-y-4"><Input id="trans-name" label={t.translator.label_name} value={petName} onChange={e => setPetName(e.target.value)} placeholder="e.g. Luna" /><Select id="trans-lang" label={t.translator.label_lang} value={targetLang} onChange={e => setTargetLang(e.target.value)}>{languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}</Select><div className="flex justify-center pt-2"><Button type="submit" disabled={isLoading || !petName.trim()}>{isLoading ? t.translator.btn_translating : t.translator.btn_translate}</Button></div></form>
            {result && !isLoading && <div className="mt-8 p-6 bg-white/40 rounded-2xl text-center animate-fade-in border border-white/40 shadow-inner"><p className="text-5xl font-black text-[#5D4037] mb-2">{result.translation}</p><p className="text-lg font-bold text-[#AA336A] italic">{t.translator.pronunciation}: {result.pronunciation}</p></div>}
        </Card>
    );
};

const PetHoroscope: React.FC = () => {
    const { t, language } = useLanguage();
    const [petName, setPetName] = useState('');
    const [petType, setPetType] = useState<PetType>('Dog');
    const [petGender, setPetGender] = useState<PetGender>('Any');
    const [sign, setSign] = useState("Aries (Mar 21 - Apr 19)");
    const [reading, setReading] = useState<{ prediction: string; luckyItem: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const signs = ["Aries (Mar 21 - Apr 19)", "Taurus (Apr 20 - May 20)", "Gemini (May 21 - Jun 20)", "Cancer (Jun 21 - Jul 22)", "Leo (Jul 23 - Aug 22)", "Virgo (Aug 23 - Sep 22)", "Libra (Sep 23 - Oct 22)", "Scorpio (Oct 23 - Nov 21)", "Sagittarius (Nov 22 - Dec 21)", "Capricorn (Dec 22 - Jan 19)", "Aquarius (Jan 20 - Feb 18)", "Pisces (Feb 19 - Mar 20)"];
    const handleGetReading = async () => { if (!petName.trim()) return; setIsLoading(true); try { const res = await generatePetHoroscope(sign, `${petGender} ${petType}`, petName, language); setReading(res); } catch (err) { console.error(err); } finally { setIsLoading(false); } };
    return (
        <Card><div className="text-center mb-6 flex flex-col items-center"><PetCharacter pet="lizard" className="w-32 h-32 mb-4 drop-shadow-md" /><h2 className="text-3xl font-black text-[#5D4037]">{t.horoscope.title}</h2><p className="opacity-80 text-lg font-bold">{t.horoscope.subtitle}</p></div><div className="max-w-md mx-auto space-y-4"><Input id="horo-name" label={t.horoscope.label_name} value={petName} onChange={e => setPetName(e.target.value)} placeholder="e.g. Luna" /><div className="grid grid-cols-2 gap-4"><Select id="horo-type" label={t.generator.label_type} value={petType} onChange={e => setPetType(e.target.value as PetType)}>{PET_TYPES.map(type => <option key={type} value={type}>{t.options.types[type] || type}</option>)}</Select><Select id="horo-gender" label={t.generator.label_gender} value={petGender} onChange={e => setPetGender(e.target.value as PetGender)}>{PET_GENDERS.map(g => <option key={g} value={g}>{t.options.genders[g] || g}</option>)}</Select></div><Select id="horo-sign" label={t.horoscope.label_zodiac} value={sign} onChange={e => setSign(e.target.value)}>{signs.map(s => <option key={s} value={s}>{s}</option>)}</Select><div className="flex justify-center pt-2"><Button onClick={handleGetReading} disabled={isLoading || !petName.trim()}>{isLoading ? t.horoscope.btn_reading : t.horoscope.btn_read}</Button></div></div>{reading && <div className="mt-8 p-6 bg-purple-500/10 rounded-2xl animate-fade-in border border-white/20"><h3 className="text-xl font-bold text-[#AA336A] mb-2">{petName}: {t.horoscope.result_title}</h3><p className="text-lg font-medium italic mb-4">"{reading.prediction}"</p><div className="bg-white/30 rounded-lg p-3 inline-block"><span className="text-xs uppercase tracking-widest opacity-70 font-bold block">{t.horoscope.lucky_item}</span><span className="font-bold text-[#5D4037]">{reading.luckyItem}</span></div></div>}</Card>
    );
};

const PetAgeCalculator: React.FC = () => {
    const { t } = useLanguage();
    const [age, setAge] = useState('');
    const [humanAge, setHumanAge] = useState<number | null>(null);
    const calculate = () => { const years = parseFloat(age); if (!isNaN(years)) setHumanAge(Math.floor(years * 7)); };
    return (
        <Card><div className="text-center mb-6 flex flex-col items-center"><PetCharacter pet="rabbit" className="w-32 h-32 mb-4 drop-shadow-md" /><h2 className="text-3xl font-black text-[#5D4037]">{t.age_calc.title}</h2><p className="opacity-80 text-lg font-bold">{t.age_calc.subtitle}</p></div><div className="max-w-md mx-auto space-y-4"><Input id="age-input" label={t.age_calc.label_age} type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 2" /><div className="flex justify-center pt-2"><Button onClick={calculate}>{t.age_calc.btn_calculate}</Button></div></div>{humanAge !== null && <div className="mt-8 text-center animate-fade-in bg-white/30 p-6 rounded-2xl border border-white/40"><p className="text-lg font-bold opacity-80 mb-1">{t.age_calc.result_prefix}</p><p className="text-6xl font-black text-[#AA336A]">{humanAge}</p><p className="text-sm font-bold uppercase tracking-wider mt-2 opacity-60">{t.age_calc.result_suffix}</p></div>}</Card>
    );
};

const PersonalityQuiz: React.FC<{ onQuizComplete: (res: PetPersonalityResult) => void, petInfo: PetInfo, setPetInfo: (info: any) => void, addSavedName: (n: GeneratedName) => void, savedNames: GeneratedName[] }> = ({ onQuizComplete, petInfo, setPetInfo, addSavedName, savedNames }) => {
    const { t, language } = useLanguage();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PetPersonalityResult | null>(null);
    const [names, setNames] = useState<GeneratedName[]>([]);
    const questions = [{ q: t.quiz.q1, a: [{t: t.quiz.a1_1, v: "Playful"}, {t: t.quiz.a1_2, v: "Calm"}, {t: t.quiz.a1_3, v: "Mischievous"}] }, { q: t.quiz.q2, a: [{t: t.quiz.a2_1, v: "Shy"}, {t: t.quiz.a2_2, v: "Outgoing"}, {t: t.quiz.a2_3, v: "Elegant"}] }, { q: t.quiz.q3, a: [{t: t.quiz.a3_1, v: "Chaotic"}, {t: t.quiz.a3_2, v: "Goofy"}, {t: t.quiz.a3_3, v: "Brave"}] }];
    const handleAnswer = async (val: string) => { const newAns = [...answers, val]; setAnswers(newAns); if (step < questions.length - 1) setStep(step + 1); else { setIsLoading(true); try { const res = await generatePetPersonality(newAns, language); setResult(res); onQuizComplete(res); const suggested = await generatePetNames({...petInfo, personality: res.keywords.personality, style: res.keywords.style}, language); setNames(suggested.slice(0, 6)); } catch (err) { console.error(err); } finally { setIsLoading(false); } } };
    if (isLoading) return <Card className="flex flex-col items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AA336A] mb-4"></div><p className="text-xl font-bold">{t.quiz.loading}</p></Card>;
    if (result) return (<Card className="text-center"><h3 className="text-xl font-bold mb-2">{t.quiz.result_title}</h3><p className="text-4xl font-black text-[#AA336A] mb-2">{result.title}</p><p className="italic mb-8 opacity-80 text-xl">"{result.description}"</p><div className="grid grid-cols-2 gap-3 mb-8">{names.map(n => <div key={n.id} className="bg-white/20 p-3 rounded-xl flex justify-between items-center"><span className="font-bold">{n.name}</span><button onClick={() => addSavedName(n)} className="text-[#AA336A] p-1">{savedNames.some(s => s.id === n.id) ? <HeartIconFilled className="w-6 h-6" /> : <HeartIconOutline className="w-6 h-6" />}</button></div>)}</div><Button onClick={() => { setStep(0); setAnswers([]); setResult(null); }} variant="secondary">{t.quiz.play_again}</Button></Card>);
    const current = questions[step];
    return (<Card><div className="text-center mb-8"><PetCharacter pet="hamster" className="w-32 h-32 mx-auto mb-4" /><h2 className="text-3xl font-black">{t.quiz.title}</h2><div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden shadow-inner"><div className="bg-[#AA336A] h-full transition-all duration-300" style={{ width: `${(step/questions.length)*100}%` }}></div></div></div><p className="text-xl font-bold text-center mb-6">{current.q}</p><div className="space-y-3 max-w-md mx-auto">{current.a.map((a, i) => <Button key={i} onClick={() => handleAnswer(a.v)} variant="secondary" className="!w-full !justify-start !text-left">{a.t}</Button>)}</div></Card>);
};

const QuickFireDiscovery: React.FC<{ addSavedName: (n: GeneratedName) => void, savedNames: GeneratedName[], petInfo: PetInfo, setPetInfo: (info: any) => void }> = ({ addSavedName, savedNames, petInfo, setPetInfo }) => {
    const { t, language } = useLanguage();
    const [state, setState] = useState<'idle'|'playing'|'results'>('idle');
    const [pool, setPool] = useState<string[]>([]);
    const [round, setRound] = useState(0);
    const [winners, setWinners] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const start = async () => { setIsLoading(true); try { const list = await generateQuickFireList(petInfo.style, petInfo.type, petInfo.gender, language); setPool(list); setWinners([]); setRound(1); setState('playing'); } catch (err) { console.error(err); } finally { setIsLoading(false); } };
    const vote = (name: string) => { const nextWinners = [...winners, name]; setWinners(nextWinners); if (round < 10) setRound(round + 1); else setState('results'); };
    const handleSaveSingleName = (name: string) => { const isAlreadySaved = savedNames.some(s => s.name === name); if (isAlreadySaved) return; const generatedName: GeneratedName = { id: `${Date.now()}-${name}-${Math.random()}`, name: name, meaning: `${t.quick_fire.generated_meaning_prefix} ${t.options.styles[petInfo.style] || petInfo.style} ${t.quick_fire.generated_meaning_suffix}`, style: petInfo.style }; addSavedName(generatedName); };
    if (state === 'idle') return (<Card className="text-center"><PetCharacter pet="cat" className="w-32 h-32 mx-auto mb-4" /><h2 className="text-3xl font-black mb-2">{t.quick_fire.title}</h2><p className="mb-8 opacity-80 text-lg font-bold">{t.quick_fire.subtitle}</p><div className="max-w-xs mx-auto space-y-4 mb-6"><Select id="qf-style" label={t.generator.label_style} value={petInfo.style} onChange={e => setPetInfo({...petInfo, style: e.target.value})}>{NAME_STYLES.map(s => <option key={s} value={s}>{s}</option>)}</Select></div><Button onClick={start} disabled={isLoading}>{isLoading ? t.quick_fire.btn_preparing : t.quick_fire.btn_start}</Button></Card>);
    if (state === 'playing') { const p1 = pool[(round - 1) * 2]; const p2 = pool[(round - 1) * 2 + 1]; return (<Card className="text-center"><div className="flex justify-between items-center mb-8 px-4"><span className="font-bold text-[#666666] opacity-60 uppercase tracking-widest text-sm">{t.quick_fire.mode}</span><span className="bg-[#AA336A] text-white px-3 py-1 rounded-full text-sm font-bold">{round}/10</span></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><button onClick={() => vote(p1)} className="h-32 bg-gradient-to-br from-[#aab2a1] to-[#8da38d] rounded-2xl text-2xl font-black text-white shadow-lg hover:scale-105 transition-transform">{p1}</button><button onClick={() => vote(p2)} className="h-32 bg-gradient-to-bl from-[#e889b5] to-[#ffc4d6] rounded-2xl text-2xl font-black text-white shadow-lg hover:scale-105 transition-transform">{p2}</button></div></Card>); }
    return (<Card className="text-center"><h3 className="text-3xl font-black text-[#AA336A] mb-4">{t.quick_fire.winner_title}</h3><div className="grid grid-cols-2 gap-2 mb-8 max-w-md mx-auto">{winners.map((w, i) => <div key={i} className="bg-white/20 p-2 rounded-lg font-bold flex justify-between items-center"><span>{w}</span><button onClick={() => handleSaveSingleName(w)} className="text-[#AA336A]">{savedNames.some(s => s.name === w) ? <HeartIconFilled className="w-5 h-5" /> : <HeartIconOutline className="w-5 h-5" />}</button></div>)}</div><Button onClick={() => setState('idle')} variant="secondary">{t.quick_fire.btn_play_again}</Button></Card>);
};

interface ExtendedChatMessage extends ChatMessage {
    sources?: { uri: string; title: string }[];
}

const Consultant: React.FC = () => {
    const { t, language } = useLanguage();
    
    // Persistent Initializer: ensures we always sync from storage on load
    const [messages, setMessages] = useState<ExtendedChatMessage[]>(() => {
        try {
            const saved = localStorage.getItem('pet_chat_history');
            if (saved) {
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (e) { console.error("Consultant load error", e); }
        return [];
    });

    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Reactive sync effect: updates storage whenever messages state changes (including empty array)
    useEffect(() => { 
        localStorage.setItem('pet_chat_history', JSON.stringify(messages));
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
        }
    }, [messages]);
    
    const cleanMessageText = (text: string) => {
        let clean = text;
        clean = clean.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
        clean = clean.replace(/\[([^\]]+)\]/g, '$1');
        clean = clean.replace(/(https?:\/\/[^\s]+)/g, '');
        clean = clean.replace(/[*()\s]+$/, '');
        return clean.trim() || text;
    };

    const handleSendMessage = async (e?: React.FormEvent) => { 
        if (e) e.preventDefault(); 
        if (!inputValue.trim() || isTyping) return; 
        const userMsg: ExtendedChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() }; 
        setMessages(prev => [...prev, userMsg]); 
        setInputValue(''); 
        setIsTyping(true); 
        try { 
            const resp = await getPetConsultantResponse([...messages, userMsg], inputValue, language, t.expert.system_instruction); 
            setMessages(prev => [...prev, { role: 'model', text: resp.text, sources: resp.sources, timestamp: Date.now() }]); 
        } catch (error) { console.error(error); } finally { setIsTyping(false); } 
    };

    const handleClearChat = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(t.expert.clear_confirm || "Clear chat history?")) {
            setMessages([]); // This triggers the persistence effect and wipes storage
        }
    };

    return (
        <Card className="flex flex-col h-[650px] max-w-full overflow-hidden shadow-2xl border-2 border-white/50">
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <PetCharacter pet="dog" className="w-12 h-12" />
                    <h2 className="text-xl font-bold">{t.expert.title}</h2>
                </div>
                <button 
                    type="button"
                    onClick={handleClearChat} 
                    className="bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 transition-all active:scale-95 border border-red-500/20"
                >
                    {t.expert.btn_clear}
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6">
                {messages.length === 0 && <p className="text-center opacity-60 p-8 font-medium italic">{t.expert.welcome}</p>}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] p-5 rounded-2xl text-xl leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#AA336A] text-white rounded-tr-none' : 'bg-white/80 border border-white/40 rounded-tl-none text-[#333333]'}`}>
                            <div className="whitespace-pre-wrap">
                                {m.role === 'user' ? m.text : cleanMessageText(m.text)}
                            </div>
                            
                            {m.sources && m.sources.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-black/5 flex flex-col gap-3">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30">References:</span>
                                    <div className="grid grid-cols-1 gap-2">
                                        {m.sources.map((s, si) => (
                                            <a 
                                                key={si} 
                                                href={s.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-lg bg-white hover:bg-[#f9f9f9] text-[#AA336A] font-black px-4 py-3 rounded-xl transition-all shadow-sm border border-black/5 flex items-center justify-between active:scale-[0.98] group no-underline"
                                            >
                                                <span className="truncate pr-4">{s.title}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/40 px-4 py-2 rounded-2xl text-sm italic opacity-50 animate-pulse">
                            {t.expert.typing}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-black/10 flex items-center gap-2 shrink-0">
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    placeholder={t.expert.placeholder} 
                    className="flex-grow min-w-0 bg-white/50 border border-white/60 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#AA336A] text-lg font-medium shadow-inner" 
                />
                <Button type="submit" disabled={!inputValue.trim() || isTyping} className="!w-auto !py-4 !px-8 shadow-lg uppercase tracking-wider">{t.expert.btn_send}</Button>
            </form>
        </Card>
    );
};

interface PlayScreenProps {
  onQuizComplete: (result: PetPersonalityResult) => void;
  savedNames: GeneratedName[];
  addSavedName: (name: GeneratedName) => void;
  petInfo: PetInfo;
  setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
  goHome: () => void;
}

type PlayMode = 'menu' | 'quiz' | 'battle' | 'translator' | 'horoscope' | 'calculator' | 'expert';

export const PlayScreen: React.FC<PlayScreenProps> = ({ onQuizComplete, savedNames, addSavedName, petInfo, setPetInfo, goHome }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<PlayMode>('menu');
  if (mode === 'menu') {
    const menuItems: { id: PlayMode, title: string, desc: string, pet: PetKind }[] = [ { id: 'quiz', title: t.quiz.title, desc: t.quiz.subtitle, pet: 'hamster' }, { id: 'battle', title: t.quick_fire.title, desc: t.quick_fire.subtitle, pet: 'cat' }, { id: 'expert', title: t.expert.title, desc: t.expert.subtitle, pet: 'dog' }, { id: 'translator', title: t.translator.title, desc: t.translator.subtitle, pet: 'bird' }, { id: 'horoscope', title: t.horoscope.title, desc: t.horoscope.subtitle, pet: 'lizard' }, { id: 'calculator', title: t.age_calc.title, desc: t.age_calc.subtitle, pet: 'rabbit' }, ];
    return (
      <div className="relative min-h-screen"><Header leftPet="hamster" rightPet="bird" onLogoClick={goHome} /><main className="px-4 pb-32 max-w-4xl mx-auto w-full flex flex-col gap-6 animate-fade-in mt-2"><div className="-mt-4"><BackToHomeButton onClick={goHome} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{menuItems.map(item => <button key={item.id} onClick={() => setMode(item.id)} className="bg-[var(--card-bg)] backdrop-blur-md rounded-[2rem] p-6 shadow-md border-2 border-white/40 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 group"><PetCharacter pet={item.pet} className="w-24 h-24 mb-2 transform group-hover:-translate-y-1 transition-transform" /><h3 className="text-2xl font-black text-[var(--text-main)] group-hover:text-[#AA336A]">{item.title}</h3><p className="text-sm font-bold opacity-80 line-clamp-2">{item.desc}</p></button>)}</div></main></div>
    );
  }
  return (
    <div className="relative min-h-screen"><Header leftPet="hamster" rightPet="bird" onLogoClick={() => setMode('menu')} /><main className="px-4 pb-32 max-w-xl mx-auto w-full animate-fade-in mt-4"><div className="-mt-4 flex gap-3 mb-6"><button onClick={() => setMode('menu')} className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30 active:scale-95"><BackIcon className="w-4 h-4" />{t.common.menu_label}</button><BackToHomeButton onClick={goHome} /></div>{mode === 'quiz' && <PersonalityQuiz onQuizComplete={onQuizComplete} petInfo={petInfo} setPetInfo={setPetInfo} addSavedName={addSavedName} savedNames={savedNames} />}{mode === 'battle' && <QuickFireDiscovery addSavedName={addSavedName} savedNames={savedNames} petInfo={petInfo} setPetInfo={setPetInfo} />}{mode === 'translator' && <NameTranslator />}{mode === 'horoscope' && <PetHoroscope />}{mode === 'calculator' && <PetAgeCalculator />}{mode === 'expert' && <Consultant />}</main></div>
  );
};