
import React, { useState, useEffect, useRef, forwardRef, MouseEvent, useMemo } from 'react';
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
import { GeneratedName, PetInfo, Tab, PetPersonality, PetKind, PetGender, PetType } from './types';
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
import { Header } from './components/Header';

// --- SHARED UI COMPONENTS ---

export const BackToHomeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const { t } = useLanguage();
    return (
        <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }} 
            className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30 active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            {t.common.back_home}
        </button>
    );
};

// --- CONTACT US SCREEN ---

const ContactUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <header className="flex items-center justify-start mb-8">
                    <button 
                        onClick={onBack} 
                        className="p-3 rounded-full bg-white/30 hover:bg-white/50 transition-all backdrop-blur-md text-[#666666] shadow-sm active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                </header>
                <main>
                    <Card className="text-center py-12 sm:py-20 border-4 border-[#AA336A]/20 shadow-2xl rounded-[3rem] bg-white/95">
                        <div className="flex justify-center mb-6">
                             <div className="bg-[#AA336A]/10 p-6 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#AA336A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                             </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black mb-6 text-[#AA336A] uppercase tracking-tight">{t.contact_us.title}</h1>
                        <div className="space-y-10">
                            <p className="text-xl sm:text-2xl font-medium opacity-80 max-w-md mx-auto leading-relaxed text-[#666666]">{t.contact_us.p1}</p>
                            <div className="inline-block p-1 rounded-[2.5rem] bg-gradient-to-r from-[#FF6B6B] to-[#AA336A] shadow-2xl transform hover:scale-105 transition-all duration-300 w-full max-w-md mx-auto overflow-hidden">
                                <a href={`mailto:${t.contact_us.email}`} className="block bg-white px-4 py-8 rounded-[calc(2.5rem-3px)] text-lg sm:text-xl md:text-2xl font-black text-[#AA336A] hover:bg-transparent hover:text-white transition-all break-all leading-tight">
                                    {t.contact_us.email}
                                </a>
                            </div>
                            <div className="pt-12">
                                <p className="text-sm font-bold opacity-30 tracking-[0.3em] uppercase text-[#666666]">namemypet.org</p>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

// --- BLOG SCREEN COMPONENT (MULTILINGUAL & RELIABLE) ---

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
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const posts = useMemo<BlogPost[]>(() => {
        if (language === 'fr') {
            return [
                {
                    id: '1',
                    title: 'Plus de 150 Noms de Chiens Uniques pour 2025',
                    excerpt: 'Trouver le nom parfait pour votre nouveau toutou est une aventure ! Voici nos conseils d\'experts.',
                    content: "Accueillir un chien est un moment magique ! En 2025, la tendance est aux noms courts et originaux.\n\n**Tendances de l'année :**\n• Noms Rétro (Albert, Ginette, Marcel)\n• Noms de la Nature (Forêt, Willow, Sauge)\n• Noms Célestes (Orion, Nova, Zenith)\n\nUtilisez notre générateur IA pour trouver le nom qui correspond à la personnalité de votre compagnon.",
                    pet: 'dog',
                    date: '10 Janvier 2025'
                },
                {
                    id: '2',
                    title: 'La Magie des Noms de Chats : Styles Félins 2025',
                    excerpt: 'Les chats méritent des noms aussi mystérieux qu\'eux. Découvrez les choix favoris de cette année.',
                    content: "Votre chat est-il un souverain de salon ? En 2025, nous voyons beaucoup de noms de 'nourriture' comme Mochi ou Taco, mais aussi des noms inspirés de la haute couture.\n\nN'oubliez pas que les chats réagissent mieux aux noms finissant par un son aigu (comme un son en 'i').",
                    pet: 'cat',
                    date: '15 Février 2025'
                }
            ];
        } else if (language === 'es') {
            return [
                {
                    id: '1',
                    title: 'Más de 150 Nombres para Perros en 2025',
                    excerpt: '¡Encontrar el nombre perfecto para tu perro es una aventura! Descubre las tendencias.',
                    content: "¡Felicidades por tu nuevo amigo! En 2025, los nombres con personalidad son los favoritos.\n\n**Categorías populares:**\n• Nombres Clásicos (Lola, Bruno, Toby)\n• Inspiración Galáctica (Marte, Nova, Orión)\n• Nombres Cortos (Max, Sol, Pipo)\n\nNuestra IA te ayudará a encontrar el match perfecto.",
                    pet: 'dog',
                    date: '10 de Enero 2025'
                },
                {
                    id: '2',
                    title: 'Magia para Nombres de Gatos: Tendencias 2025',
                    excerpt: 'Los michis merecen nombres tan únicos como sus personalidades. Mira lo nuevo.',
                    content: "Un gato es el rey de la casa. En 2025, los nombres divertidos están de moda.\n\n**Los más buscados:**\n• Nombres de Comida (Sushi, Taco, Mochi)\n• Estilo Elegante (Gucci, Bentley, Chanel)\n\nRecuerda que los gatos responden mejor a nombres con sonidos agudos.",
                    pet: 'cat',
                    date: '15 de Febrero 2025'
                }
            ];
        } else {
            return [
                {
                    id: '1',
                    title: '150+ Unique Dog Names for 2025',
                    excerpt: 'Finding the perfect name for your companion is a journey. Explore the top picks for 2025.',
                    content: "Welcoming a dog into your life is a transformative moment. In 2025, standard names are taking a backseat to personality-driven choices.\n\n**Top Categories:**\n• Retro-Classic (Archie, Mabel, Otis)\n• Nature-Inspired (River, Sage, Willow)\n• Cosmic (Orion, Nova, Zenith)\n\nUse our AI-powered tool to find that special name that resonates with your pup's soul.",
                    pet: 'dog',
                    date: 'Jan 10, 2025'
                },
                {
                    id: '2',
                    title: 'Cat Naming Magic: Aesthetic Trends 2025',
                    excerpt: 'Cats often choose their own names through their quirky actions. Discover what is hot this year.',
                    content: "A cat is more than a pet—it's a tiny, furry overlord. Their name should be just as regal, quirky, or mysterious as they are.\n\n**Current Favorites:**\n• Foodie Names (Noodle, Mochi, Taco)\n• High-Fashion (Chanel, Dior, Bentley)\n• Spooky/Mystic (Salem, Raven, Onyx)\n\nResearch shows cats respond better to names ending in an 'ee' sound. Find the winner using our AI generator!",
                    pet: 'cat',
                    date: 'Feb 15, 2025'
                }
            ];
        }
    }, [language]);

    const selectedPost = useMemo(() => posts.find(p => p.id === selectedPostId), [posts, selectedPostId]);

    if (selectedPost) {
        return (
            <div className="min-h-screen p-4 flex flex-col items-center animate-fade-in relative z-10">
                <div className="w-full max-w-3xl mb-8 flex justify-start">
                     <button 
                        onClick={() => setSelectedPostId(null)} 
                        className="flex items-center gap-2 text-white bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm hover:bg-white/30 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                        {t.blog.back_to_blog}
                    </button>
                </div>
                <Card className="p-8 md:p-12 max-w-4xl w-full border-4 border-white/20 shadow-2xl mb-24 rounded-[3rem] bg-white/95">
                    <div className="flex justify-center mb-8">
                        <PetCharacter pet={selectedPost.pet} className="w-24 h-24 drop-shadow-lg" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-center text-[#5D4037] leading-tight drop-shadow-sm">{selectedPost.title}</h1>
                    <div className="text-sm font-black opacity-30 text-center uppercase tracking-widest mb-10 border-b border-black/5 pb-6">
                        {selectedPost.date}
                    </div>
                    <div className="whitespace-pre-wrap text-xl leading-relaxed text-[#333333] font-medium font-['Poppins']">
                        {selectedPost.content}
                    </div>
                    <div className="mt-16 pt-8 border-t border-black/5 text-center">
                        <p className="text-sm font-bold text-[#AA336A] uppercase tracking-widest">{t.blog.footer_note}</p>
                        <p className="mt-2 text-gray-400 text-xs">© 2025 Name My Pet. All Rights Reserved.</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 flex flex-col items-center animate-fade-in relative z-10">
            <div className="w-full max-w-5xl mb-8 flex justify-start"><BackToHomeButton onClick={onBack} /></div>
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase drop-shadow-md tracking-tight">{t.blog.title}</h1>
                <p className="text-white text-xl md:text-2xl font-bold opacity-90 drop-shadow-sm">{t.blog.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full pb-24">
                {posts.map(post => (
                    <Card 
                        key={post.id} 
                        onClick={() => setSelectedPostId(post.id)} 
                        className="p-8 cursor-pointer transform hover:scale-[1.03] transition-all hover:shadow-2xl border-2 border-white/10 group shadow-md hover:shadow-xl flex flex-col h-full rounded-[2.5rem] bg-white/90"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <PetCharacter pet={post.pet} className="w-16 h-16 group-hover:rotate-6 transition-transform" />
                            <div className="text-left">
                                <span className="text-xs font-black opacity-40 uppercase tracking-widest">{post.date}</span>
                                <h2 className="text-2xl font-black group-hover:text-[#AA336A] transition-colors leading-tight text-[#5D4037]">{post.title}</h2>
                            </div>
                        </div>
                        <p className="opacity-80 text-left text-lg font-bold line-clamp-3 leading-relaxed mb-6 flex-grow text-[#666666]">{post.excerpt}</p>
                        <div className="mt-auto pt-4 border-t border-black/5 text-[#AA336A] font-black text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
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

const BioCardLocal = forwardRef<HTMLDivElement, BioCardProps>(({ 
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

const BioScreenLocal: React.FC<{ petInfo: PetInfo; imageForBio: string | null; setImageForBio: (img: string | null) => void; goHome: () => void; }> = ({ petInfo, imageForBio, setImageForBio, goHome }) => {
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
    const [isSharing, setIsSharing] = useState(false);
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
            const dataUrl = await toPng(bioCardRef.current, { pixelRatio: 3, cacheBust: true });
            const link = document.createElement('a'); 
            link.href = dataUrl; link.download = `${petName || 'MyPet'}_Bio.png`;
            link.click();
        } catch (error: any) { 
            console.error("Download failed", error);
        } finally { setIsDownloading(false); }
    };

    const handleShare = async () => {
        if (!bioCardRef.current || isSharing) return;
        setIsSharing(true);
        try {
            const dataUrl = await toPng(bioCardRef.current, { pixelRatio: 3, cacheBust: true });
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], `${petName || 'MyPet'}_Bio.png`, { type: 'image/png' });
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `${petName}'s Bio Card`,
                    text: `Check out my new pet's bio card created on Name My Pet!`
                });
            } else {
                alert("Sharing is not supported on this browser. Please use download.");
            }
        } catch (error) {
            console.error("Share failed", error);
        } finally { setIsSharing(false); }
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsDragging(true); setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    };
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => { if (isDragging) setImagePosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
    const handleMouseUpOrLeave = () => setIsDragging(false);
    
    return (
        <div className="relative min-h-screen">
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
                                <BioCardLocal ref={bioCardRef} imagePreview={imagePreview} petName={petName} bio={selectedBio} imageZoom={imageZoom} imagePosition={imagePosition} onImageMouseDown={handleMouseDown} isDragging={isDragging} gender={gender} />
                            </div>
                        </div>
                        <div className="w-full max-w-sm space-y-4">
                            <input type="range" min="0.5" max="8" step="0.1" value={imageZoom} onChange={(e) => setImageZoom(Number(e.target.value))} className="w-full accent-[#AA336A]" />
                            <div className="grid grid-cols-1 gap-4">
                                <Button onClick={handleDownload} disabled={isDownloading || !imagePreview} variant="primary" className="w-full btn-surprise !py-5 text-xl">
                                    {isDownloading ? '...' : t.bio.btn_download}
                                </Button>
                                <Button onClick={handleShare} disabled={isSharing || !imagePreview} variant="primary" className="w-full btn-surprise !py-5 text-xl font-bold">
                                    {isSharing ? '...' : "Share Now"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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
    const [savedNames, setSavedNames] = useState<GeneratedName[]>(() => {
        try {
            const saved = localStorage.getItem('mySavedNames');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });
    const [petInfo, setPetInfo] = useState<PetInfo>({ type: 'Dog', gender: 'Any', personality: 'Playful', style: 'Trending' });
    const [imageForBio, setImageForBio] = useState<string | null>(null);

    useEffect(() => {
        if (isChillMode) document.body.classList.add('chill-mode');
        else document.body.classList.remove('chill-mode');
    }, [isChillMode]);

    useEffect(() => { localStorage.setItem('mySavedNames', JSON.stringify(savedNames)); }, [savedNames]);

    const handleSetTab = (tab: Tab) => { setView('app'); setActiveTab(tab); window.scrollTo(0, 0); };
    const goHome = () => { handleSetTab('home'); };

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'home': return <LandingPage setTab={handleSetTab} />;
            case 'generate': return <MainView savedNames={savedNames} addSavedName={(n) => setSavedNames(prev => prev.find(x => x.id === n.id) ? prev : [...prev, n])} removeSavedName={(id) => setSavedNames(prev => prev.filter(n => n.id !== id))} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
            case 'bio': return <BioScreenLocal petInfo={petInfo} imageForBio={imageForBio} setImageForBio={setImageForBio} goHome={goHome} />;
            case 'play': return <PlayScreen onQuizComplete={(res) => setPetInfo(p => ({...p, ...res.keywords}))} savedNames={savedNames} addSavedName={(n) => setSavedNames(prev => prev.find(x => x.id === n.id) ? prev : [...prev, n])} petInfo={petInfo} setPetInfo={setPetInfo} goHome={goHome} />;
            case 'photo': return <PhotoScreen setActiveTab={handleSetTab} setImageForBio={setImageForBio} goHome={goHome} />;
            case 'adopt': return <AdoptScreen goHome={goHome} />;
            case 'partnerships': return <Partnerships goHome={goHome} />;
            default: return <LandingPage setTab={handleSetTab} />;
        }
    };

    const renderFullView = () => {
        if (view === 'privacy') return <PrivacyPolicy onBack={() => setView('app')} />;
        if (view === 'terms') return <TermsAndConditions onBack={() => setView('app')} />;
        if (view === 'contact') return <ContactUs onBack={() => setView('app')} />;
        if (view === 'blog') return <BlogScreen onBack={() => setView('app')} />;
        return renderActiveTab();
    };

    return (
        <div className="relative min-h-[100dvh] flex flex-col overflow-x-hidden">
            <CustomCursor />
            <BackgroundPattern />
            
            {/* Scrollable content area */}
            <div className="flex-grow pb-24">
                {renderFullView()}
            </div>

            {/* Global Footer (Visible on all screens) */}
            <footer className="shrink-0 relative z-10 text-center py-8 space-y-8 w-full max-w-7xl mx-auto px-4 pb-12 mt-auto">
                <div className="flex flex-col items-center gap-8">
                    <div className="flex justify-center items-center gap-8 flex-wrap">
                        <button onClick={() => setIsChillMode(!isChillMode)} className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg group-hover:scale-110">
                                <span className="text-2xl">{isChillMode ? '☀️' : '🌙'}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">
                                {isChillMode ? t.common.mode_light : t.common.mode_dark}
                            </span>
                        </button>
                        <div className="flex gap-4 items-center bg-white/10 p-3 rounded-[2rem] backdrop-blur-sm border border-white/20">
                            {(['en', 'es', 'fr'] as const).map(lang => (
                                <button key={lang} onClick={() => setLanguage(lang)} className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all ${language === lang ? 'bg-[#AA336A] text-white scale-110' : 'bg-white/30 text-white opacity-50'}`}>
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 text-base items-center text-white font-bold tracking-tight">
                        <a href="https://namemypet.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-8 decoration-2">namemypet.org</a>
                        <button onClick={() => { setView('blog'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="underline underline-offset-8 decoration-2 hover:text-pink-200">Blog</button>
                        <button onClick={() => { setView('privacy'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="underline underline-offset-8 decoration-2 hover:text-pink-200">{t.common.privacy}</button>
                        <button onClick={() => { setView('terms'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="underline underline-offset-8 decoration-2 hover:text-pink-200">{t.common.terms}</button>
                        <button onClick={() => { setView('contact'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="underline underline-offset-8 decoration-2 hover:text-pink-200">{t.common.contact}</button>
                    </div>
                </div>
            </footer>

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
