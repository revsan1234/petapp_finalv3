import React, { useState, useEffect, useRef, forwardRef, MouseEvent } from 'react';
import { toPng } from 'html-to-image';
import { Partnerships } from './components/Partnerships';
import { MainView } from './components/MainView';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { TabNavigator } from './components/layout/TabNavigator';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { LandingPage } from './components/LandingPage';
import { GeneratedName, PetInfo, Tab, Language, PetPersonality, PetKind, PetGender, PetType } from './types';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { CustomCursor } from './components/ui/CustomCursor';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';
import { PetCharacter } from './components/assets/pets/PetCharacter';
import { generatePetBio } from './services/geminiService';
import { PET_PERSONALITIES, PET_GENDERS, PET_TYPES } from './constants';
// Added missing Header import to fix error on line 180
import { Header } from './components/Header';

// --- SHARED UI COMPONENTS ---

export const BackToHomeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const { t } = useLanguage();
    return (
        <button 
            onClick={onClick} 
            className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30 active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            {t.common.back_home}
        </button>
    );
};

// --- BIO CARD PREVIEW COMPONENT ---

interface BioCardProps {
  imagePreview: string | null;
  petName: string;
  bio: string | null;
  imageZoom: number;
  imagePosition: { x: number; y: number };
  onImageMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  gender?: PetGender;
}

const BioCard = forwardRef<HTMLDivElement, BioCardProps>(({ 
    imagePreview, 
    petName, 
    bio, 
    imageZoom,
    imagePosition,
    onImageMouseDown,
    isDragging,
    gender = 'Any',
}, ref) => {
  const { t } = useLanguage();
  
  const imageStyle: React.CSSProperties = {
    transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
    transition: isDragging ? 'none' : 'transform 0.1s linear',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  let bgClass = "bg-gradient-to-b from-[#e889b5] to-[#ffc4d6]"; 
  if (gender === 'Male') bgClass = "bg-gradient-to-b from-[#aab2a1] to-[#8da38d]";
  else if (gender === 'Any') bgClass = "bg-gradient-to-b from-[#d4c4e0] to-[#bca6c9]";

  return (
    <div 
        ref={ref} 
        className={`${bgClass} p-6 text-[#666666] flex flex-col items-center justify-between w-full max-w-[480px] min-h-[600px] shadow-2xl rounded-3xl overflow-hidden relative`}
        style={{ fontFamily: "'Fredoka', sans-serif" }} 
    >
        <h2 className="text-6xl font-bold text-center text-white drop-shadow-md z-10 mt-4 tracking-wide leading-tight">{petName || t.bio.card_pet_name_placeholder}</h2>
        <div className="flex flex-col items-center gap-4 w-full z-10 flex-grow justify-center">
             <div className="relative w-72 h-72">
                 <div className="w-full h-full overflow-hidden flex items-center justify-center relative rounded-2xl bg-black/5" onMouseDown={onImageMouseDown}>
                     {imagePreview ? (
                        <img src={imagePreview} alt={petName || 'Your pet'} className="pointer-events-none select-none" style={imageStyle} draggable="false" />
                     ) : (
                        <PetCharacter pet="cat" className="w-full h-full opacity-80 p-4" />
                     )}
                </div>
            </div>
            <p className="text-2xl font-medium text-center leading-snug px-6 text-white drop-shadow-md flex items-center justify-center mt-4">
                {bio || t.bio.fallback_bio}
            </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-white/60 tracking-wider text-center z-10 mb-4">
            <span>{t.bio.generated_by}</span>
        </div>
    </div>
  );
});

// --- BIO SCREEN EDITOR COMPONENT ---

const BioScreen: React.FC<{ petInfo: PetInfo; imageForBio: string | null; setImageForBio: (img: string | null) => void; goHome: () => void; }> = ({ petInfo, imageForBio, setImageForBio, goHome }) => {
    const { t, language } = useLanguage();
    const [petName, setPetName] = useState('');
    const [personality, setPersonality] = useState<PetPersonality>(petInfo.personality);
    const [gender, setGender] = useState<PetGender>(petInfo.gender);
    const [petType, setPetType] = useState<PetType>(petInfo.type);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedBio, setSelectedBio] = useState<string>('');
    const [generatedBios, setGeneratedBios] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [imageZoom, setImageZoom] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bioCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => { 
        setPersonality(petInfo.personality); setGender(petInfo.gender); setPetType(petInfo.type);
    }, [petInfo]);

    useEffect(() => {
        if (imageForBio) { setImagePreview(imageForBio); setImageZoom(1); setImagePosition({ x: 0, y: 0 }); setImageForBio(null); }
    }, [imageForBio, setImageForBio]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setImagePreview(reader.result as string); setGeneratedBios([]); setSelectedBio(''); };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerateBio = async () => {
        if (!petName) return;
        setIsLoading(true);
        try {
            const bios = await generatePetBio(petName, petType, personality, language);
            setGeneratedBios(bios); if (bios.length > 0) setSelectedBio(bios[0]);
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const handleDownload = async () => {
        if (!bioCardRef.current || isDownloading) return;
        setIsDownloading(true);
        try {
            const filter = (node: any) => {
                if (node.tagName === 'LINK' && node.rel === 'stylesheet' && !node.href.startsWith(window.location.origin)) return false;
                return true;
            };
            const dataUrl = await toPng(bioCardRef.current, { 
                pixelRatio: 3, cacheBust: true, filter: filter
            });
            const link = document.createElement('a'); 
            link.href = dataUrl; link.download = `${petName || 'MyPet'}_Bio.png`;
            link.click();
        } catch (error: any) { 
            console.error(error);
        } finally { setIsDownloading(false); }
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsDragging(true); setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    };
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => { if (isDragging) setImagePosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
    const handleMouseUpOrLeave = () => setIsDragging(false);
    
    return (
        <div className="relative min-h-screen">
            {/* Header used here - fixed error on line 180 by adding missing import above */}
            <Header leftPet="bird" rightPet="cat" onLogoClick={goHome} />
            <main className="py-4 px-4 max-w-7xl mx-auto">
                <div className="-mt-4 mb-8"><BackToHomeButton onClick={goHome} /></div>
                <div className="flex flex-col gap-10 items-center max-w-2xl mx-auto w-full pb-20">
                    <div className="space-y-6 w-full">
                        <Card>
                            <div className="space-y-4">
                                <Input id="name" label={t.bio.label_name} value={petName} onChange={e => setPetName(e.target.value)} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Select id="type" label={t.generator.label_type} value={petType} onChange={e => setPetType(e.target.value as PetType)}>
                                        {PET_TYPES.map(type => <option key={type} value={type}>{t.options.types[type] || type}</option>)}
                                    </Select>
                                    <Select id="gender" label={t.bio.label_gender} value={gender} onChange={e => setGender(e.target.value as PetGender)}>
                                        {PET_GENDERS.map(g => <option key={g} value={g}>{t.options.genders[g] || g}</option>)}
                                    </Select>
                                </div>
                                <Select id="personality" label={t.generator.label_personality} value={personality} onChange={e => setPersonality(e.target.value as PetPersonality)}>
                                    {PET_PERSONALITIES.map(p => <option key={p} value={p}>{t.options.personalities[p] || p}</option>)}
                                </Select>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col gap-4">
                                <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full">Upload Photo</Button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                <Button onClick={handleGenerateBio} disabled={isLoading || !petName} className="w-full">{isLoading ? 'Generating...' : t.bio.btn_generate}</Button>
                            </div>
                        </Card>
                        {generatedBios.length > 0 && (
                            <div className="space-y-2">
                                {generatedBios.map((bio, i) => (
                                    <button key={i} onClick={() => setSelectedBio(bio)} className={`w-full p-4 text-left rounded-[1.5rem] transition-all bg-white/20 border-2 ${selectedBio === bio ? 'border-[#AA336A] bg-white/40' : 'border-transparent'}`}> {bio} </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-6 flex flex-col items-center w-full">
                        <div className="w-full border-t border-white/20 pt-8 flex justify-center">
                            <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}>
                                <BioCard ref={bioCardRef} imagePreview={imagePreview} petName={petName} bio={selectedBio} imageZoom={imageZoom} imagePosition={imagePosition} onImageMouseDown={handleMouseDown} isDragging={isDragging} gender={gender} />
                            </div>
                        </div>
                        <div className="w-full max-w-sm space-y-4">
                            <input type="range" min="0.5" max="8" step="0.1" value={imageZoom} onChange={(e) => setImageZoom(Number(e.target.value))} className="w-full accent-[#AA336A]" />
                            <Button onClick={handleDownload} disabled={isDownloading || !imagePreview} variant="primary" className="w-full btn-surprise !py-5 text-xl">
                                {isDownloading ? '...' : t.bio.btn_download}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- CONTACT US COMPONENT ---

const ContactUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen p-4 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-full max-w-lg">
                <div className="mb-8">
                    <BackToHomeButton onClick={onBack} />
                </div>
                <Card className="text-center py-20 px-8 w-full border-4 border-[#AA336A]/20 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#AA336A]/10 p-6 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#AA336A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black mb-6 text-[#AA336A] uppercase tracking-tight font-heading">
                        {t.contact_us.title}
                    </h1>
                    <p className="text-xl mb-10 opacity-80 font-medium">
                        {t.contact_us.p1}
                    </p>
                    <a href={`mailto:${t.contact_us.email}`} className="text-2xl font-black text-[#AA336A] hover:underline break-all block py-4 bg-white/40 rounded-2xl border border-white/40 shadow-sm">
                        {t.contact_us.email}
                    </a>
                </Card>
            </div>
        </div>
    );
};

// --- BLOG COMPONENT ---

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    pet: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster';
    date: string;
}

const BlogScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language, t } = useLanguage();
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const posts: BlogPost[] = [
        {
            id: '1',
            title: language === 'fr' 
                ? 'Plus de 150 Noms de Chiens Uniques pour 2025' 
                : language === 'es' ? '150+ Nombres Únicos para Perros en 2025' : '150+ Unique Dog Names for 2025',
            excerpt: language === 'fr'
                ? 'Trouver le nom parfait pour votre nouveau toutou est une aventure !'
                : language === 'es' ? '¡Felicidades por tu nuevo amigo peludo! Encuentra el nombre ideal.' : 'Finding the perfect name for your companion...',
            content: language === 'fr'
                ? "Vous venez d'accueillir un nouveau toutou ? Félicitations ! Votre compagnon est unique.\n\n**Noms Originaux**\n• Trèfle\n• Orion\n• Stellan\n\nL'appli Name My Pet analyse le caractère de votre animal."
                : language === 'es' 
                    ? "¡Felicidades por tu nuevo amigo peludo! Elegir un nombre unique para tu perro es una excelente manera de celebrar su individualidad.\n\n**Nombres Recomendados**\n• Trébol\n• Orión\n• Caspio" 
                    : "Choosing a unique name for your dog is a great way to celebrate their individuality. Use our AI tools to match their vibe.",
            pet: 'dog',
            date: language === 'fr' ? '1er Jan 2026' : 'Jan 1, 2026'
        },
        {
            id: '2',
            title: language === 'fr' 
                ? 'La Magie des Noms de Chats : Tendances 2025' 
                : language === 'es' ? 'Magia para Nombres de Gatos: Tendencias 2025' : 'Cat Naming Magic: 2025 Trends',
            excerpt: language === 'fr'
                ? 'Découvrez les dernières tendances pour chats.'
                : language === 'es' ? 'Los michis merecen nombres misteriosos.' : 'Discover the most mysterious and fun names for your feline friends.',
            content: language === 'fr'
                ? "Le chat est un animal mystérieux. En 2025, on adore appeler nos chats comme nos grands-parents : Albert, Ginette, ou Marcel."
                : language === 'es'
                    ? "En 2025, los nombres de 'michis' están evolucionando. Los nombres de comida como 'Mochi' o 'Taco' son tendencia absoluta."
                    : "Cats respond best to shorter names with high-pitched endings. Try our AI tool to match a name to your cat's specific attitude!",
            pet: 'cat',
            date: language === 'fr' ? '15 Fév 2026' : 'Feb 15, 2026'
        }
    ];

    if (selectedPost) {
        return (
            <div className="min-h-screen p-4 flex flex-col items-center animate-fade-in">
                <div className="w-full max-w-2xl mb-8 flex justify-start">
                     <button 
                        onClick={() => setSelectedPost(null)} 
                        className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        {t.blog.back_to_blog}
                    </button>
                </div>
                <Card className="p-8 max-w-2xl w-full border-4 border-white/20">
                    <div className="flex justify-center mb-6">
                        <PetCharacter pet={selectedPost.pet} className="w-24 h-24 drop-shadow-lg" />
                    </div>
                    <h1 className="text-3xl font-black mb-4 text-center text-[#5D4037]">{selectedPost.title}</h1>
                    <p className="whitespace-pre-wrap text-xl leading-relaxed text-[#333333] font-medium">{selectedPost.content}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 flex flex-col items-center animate-fade-in">
            <div className="w-full max-w-5xl mb-8 flex justify-start">
                <BackToHomeButton onClick={onBack} />
            </div>
            
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-md font-heading uppercase tracking-tight">
                    {t.blog.title}
                </h1>
                <p className="text-white text-xl md:text-2xl font-bold opacity-90 drop-shadow-sm">
                    {t.blog.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full pb-20">
                {posts.map(post => (
                    <Card key={post.id} className="p-8 cursor-pointer transform hover:scale-[1.03] transition-all hover:shadow-2xl border-2 border-white/10 group" onClick={() => setSelectedPost(post)}>
                        <div className="flex items-center gap-4 mb-6">
                            <PetCharacter pet={post.pet} className="w-20 h-20 group-hover:rotate-6 transition-transform" />
                            <div className="text-left">
                                <span className="text-xs font-black opacity-40 uppercase tracking-widest block mb-1">{post.date}</span>
                                <h2 className="text-2xl font-black leading-tight text-[#5D4037] group-hover:text-[#AA336A] transition-colors">{post.title}</h2>
                            </div>
                        </div>
                        <p className="opacity-80 text-left text-lg font-bold line-clamp-3 leading-relaxed">{post.excerpt}</p>
                        <div className="mt-6 pt-6 border-t border-black/5 flex items-center gap-2 text-[#AA336A] font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                            {t.blog.read_more}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- MAIN APP CONTENT ---

type View = 'app' | 'privacy' | 'terms' | 'contact' | 'blog';

const AppContent: React.FC = () => {
    const [view, setView] = useState<View>('app');
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isChillMode, setIsChillMode] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    
    const [footerTooltip, setFooterTooltip] = useState<string | null>(null);
    const tooltipTimer = useRef<any>(null);

    useEffect(() => {
        if (isChillMode) document.body.classList.add('chill-mode');
        else document.body.classList.remove('chill-mode');
    }, [isChillMode]);

    const [savedNames, setSavedNames] = useState<GeneratedName[]>(() => {
        try {
            const saved = localStorage.getItem('mySavedNames');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    const [petInfo, setPetInfo] = useState<PetInfo>({
        type: 'Dog', gender: 'Any', personality: 'Playful', style: 'Trending',
    });
    const [imageForBio, setImageForBio] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('mySavedNames', JSON.stringify(savedNames));
    }, [savedNames]);

    const handleSetTab = (tab: Tab) => { setView('app'); setActiveTab(tab); window.scrollTo(0, 0); };
    const goHome = () => { handleSetTab('home'); };

    const addSavedName = (name: GeneratedName) => {
        setSavedNames((prev) => prev.find(n => n.id === name.id) ? prev : [...prev, name]);
    };
    const removeSavedName = (nameId: string) => { setSavedNames((prev) => prev.filter(n => n.id !== nameId)); };

    const startTooltip = (desc: string) => {
        tooltipTimer.current = setTimeout(() => {
            setFooterTooltip(desc);
        }, 400);
    };

    const clearTooltip = () => {
        if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
        setFooterTooltip(null);
    };

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'home': return <LandingPage setTab={handleSetTab} />;
            case 'generate': return <MainView savedNames={savedNames} addSavedName={addSavedName} removeSavedName={removeSavedName} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
            case 'bio': return <BioScreen petInfo={petInfo} imageForBio={imageForBio} setImageForBio={setImageForBio} goHome={goHome} />;
            case 'play': return <PlayScreen onQuizComplete={(res) => setPetInfo(p => ({...p, ...res.keywords}))} savedNames={savedNames} addSavedName={addSavedName} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
            case 'photo': return <PhotoScreen setActiveTab={handleSetTab} setImageForBio={setImageForBio} goHome={goHome} />;
            case 'adopt': return <AdoptScreen goHome={goHome} />;
            case 'partnerships': return <Partnerships goHome={goHome} />;
            default: return <LandingPage setTab={handleSetTab} />;
        }
    };

    if (view === 'privacy') return <PrivacyPolicy onBack={() => setView('app')} />;
    if (view === 'terms') return <TermsAndConditions onBack={() => setView('app')} />;
    if (view === 'contact') return <ContactUs onBack={() => setView('app')} />;
    if (view === 'blog') return <BlogScreen onBack={() => setView('app')} />;

    return (
        <div className="relative min-h-[100dvh]">
            <CustomCursor />
            <BackgroundPattern />
            
            {footerTooltip && (
                <div className="fixed bottom-32 left-0 right-0 px-4 z-[100] pointer-events-none flex justify-center">
                    <div className="bg-black/90 text-white p-4 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl max-w-sm text-center animate-fade-in">
                        <p className="text-sm font-medium leading-relaxed opacity-90">{footerTooltip}</p>
                    </div>
                </div>
            )}

            <div className="relative min-h-[100dvh] overflow-x-hidden">
                <div className="pb-24">
                    {renderActiveTab()}
                </div>
                
                <footer className="relative z-10 text-center my-8 space-y-8 w-full max-w-7xl mx-auto px-4 pb-12">
                    <div className="flex flex-col items-center gap-8">
                        <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
                            <button 
                                onClick={() => setIsChillMode(!isChillMode)} 
                                onMouseEnter={() => startTooltip(isChillMode ? t.common.chill_mode_off : t.common.chill_mode_on)}
                                onMouseLeave={clearTooltip}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-active:scale-95 group-hover:bg-white/50">
                                    <span className="text-2xl">{isChillMode ? '☀️' : '🌙'}</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md opacity-80 group-hover:opacity-100">
                                    {isChillMode ? t.common.mode_light : t.common.mode_dark}
                                </span>
                            </button>

                            <div className="flex gap-6 items-center bg-white/10 p-4 rounded-[2rem] backdrop-blur-sm border border-white/20 shadow-inner">
                                <button 
                                    onClick={() => setLanguage('en')} 
                                    onMouseEnter={() => startTooltip(t.common.switch_language_en)}
                                    onMouseLeave={clearTooltip}
                                    className={`flex flex-col items-center gap-2 group transition-all ${language === 'en' ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${language === 'en' ? 'bg-[#AA336A] text-white' : 'bg-white/30'}`}>
                                        <span className="text-xl">🌐</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white drop-shadow-md">EN</span>
                                </button>

                                <button 
                                    onClick={() => setLanguage('es')} 
                                    onMouseEnter={() => startTooltip(t.common.switch_language_es)}
                                    onMouseLeave={clearTooltip}
                                    className={`flex flex-col items-center gap-2 group transition-all ${language === 'es' ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${language === 'es' ? 'bg-[#AA336A] text-white' : 'bg-white/30'}`}>
                                        <span className="text-xl">🌐</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white drop-shadow-md">ES</span>
                                </button>

                                <button 
                                    onClick={() => setLanguage('fr')} 
                                    onMouseEnter={() => startTooltip(t.common.switch_language_fr)}
                                    onMouseLeave={clearTooltip}
                                    className={`flex flex-col items-center gap-2 group transition-all ${language === 'fr' ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${language === 'fr' ? 'bg-[#AA336A] text-white' : 'bg-white/30'}`}>
                                        <span className="text-xl">🌐</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white drop-shadow-md">FR</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 text-base items-center text-white font-bold tracking-tight drop-shadow-md">
                            <a href="https://namemypet.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity underline underline-offset-8 decoration-2">namemypet.org</a>
                            <button onClick={() => setView('blog')} className="underline underline-offset-8 decoration-2 hover:text-pink-200 transition-colors">{t.common.blog || 'Blog'}</button>
                            <button onClick={() => setView('privacy')} className="underline underline-offset-8 decoration-2 hover:text-pink-200 transition-colors">{t.common.privacy}</button>
                            <button onClick={() => setView('terms')} className="underline underline-offset-8 decoration-2 hover:text-pink-200 transition-colors">{t.common.terms}</button>
                            <button onClick={() => setView('contact')} className="underline underline-offset-8 decoration-2 hover:text-pink-200 transition-colors">{t.common.contact}</button>
                        </div>
                    </div>
                </footer>
            </div>
            <TabNavigator activeTab={activeTab} setActiveTab={handleSetTab} />
        </div>
    );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);

export default App;