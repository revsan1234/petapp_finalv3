import React, { useState, useEffect } from 'react';
import { Partnerships } from './components/Partnerships';
import { MainView } from './components/MainView';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { TabNavigator } from './components/layout/TabNavigator';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { BioScreen } from './components/screens/BioScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { LandingPage } from './components/LandingPage';
import { GeneratedName, PetInfo, Tab } from './types';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { TabMascots } from './components/ui/TabMascots';
import { CustomCursor } from './components/ui/CustomCursor';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { hasValidApiKey } from './services/geminiService';
import { Card } from './components/ui/Card';
import { Header } from './components/Header';
import { PetCharacter } from './components/assets/pets/PetCharacter';

/**
 * REUSABLE COMPONENTS
 */

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

/**
 * BLOG SCREEN COMPONENT (Defined here to avoid path issues)
 */
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
            title: language === 'es' ? '150+ Nombres Únicos para Perros en 2025' : '150+ Unique Dog Names for 2025 (and How to Choose the Perfect One)',
            excerpt: language === 'es' 
                ? '¡Felicidades por tu nuevo amigo peludo! Ahora viene la parte más emocionante: elegir un nombre que sea tan especial como ellos.' 
                : 'So, you’ve brought home a new furry friend! Congratulations! Now comes one of the most exciting parts of being a new pet parent: choosing the perfect name.',
            content: language === 'es' 
                ? "¡Así que has traído a casa a un nuevo amigo peludo! ¡Felicidades! Ahora viene una de las partes más emocionantes de ser un nuevo padre de mascota: elegir el nombre perfecto. Pero no estás buscando cualquier nombre. Estás cansado de escuchar \"Max\", \"Bella\" y \"Charlie\" en el parque para perros. Tu nuevo compañero es único y merece un nombre que sea igual de especial.\n\nPor eso hemos seleccionado una lista de más de 150 nombres únicos para perros para que puedas empezar. Y si necesitas aún más inspiración, ¡la aplicación Name My Pet tiene una biblioteca de más de 10,000 nombres esperándote!\n\n**Nombres Únicos para Perras**\n\nInspirados en la Naturaleza:\n• Trébol (Clover)\n• Enebro (Juniper)\n• Pradera (Meadow)\n• Amapola (Poppy)\n• Sauce (Willow)\n\nMitológicos y Celestiales:\n• Andrómeda\n• Atenea\n• Juno\n• Ofelia\n• Perséfone\n\nLiterarios y Vintage:\n• Beatriz\n• Dorotea\n• Eloísa\n• Matilde\n• Winnifred\n\n**Nombres Únicos para Perros**\n\nFuertes e Históricos:\n• Atticus\n• Caspio\n• Orión\n• Phineas\n• Stellan\n\nAventureros y Divertidos:\n• Albus\n• Bastian\n• Finnian\n• Gedeón\n• Pippin\n\n**Cómo elegir un nombre único**\n\nElegir un nombre es una gran decisión, pero no tiene por qué ser abrumadora. Aquí tienes algunos consejos para ayudarte a encontrar el ajuste perfecto:\n\n• Considera la personalidad: ¿Tu cachorro es juguetón y gracioso, o tranquilo y cariñoso? Un nombre como \"Pippin\" podría irle bien a un cachorro juguetón, mientras que \"Stellan\" podría ser ideal para un perro más sereno.\n\n• Piensa en la apariencia: ¿Tu perro tiene un color de pelaje o una marca única? Un nombre como \"Manchitas\" o \"Luna\" podría ser perfecto dependiendo de su look.\n\n• La regla de las dos sílabas: Los nombres con dos sílabas suelen ser más fáciles de reconocer y responder para los perros.\n\n**La ventaja de la aplicación Name My Pet**\n\n¿Sigues buscando ese nombre perfecto? ¡La aplicación Name My Pet está aquí para ayudarte! Nuestro generador de nombres con IA puede ayudarte a encontrar el nombre perfecto en minutos. Puedes filtrar por género, estilo e incluso personalidad para encontrar un nombre que sea tan único como tu nuevo mejor amigo.\n\n¿Listo para encontrar el nombre perfecto? ¡Descarga la aplicación Name My Pet gratis y comienza hoy mismo!\n\nElegir un nombre único para tu perro es una excelente manera de celebrar su individualidad. Esperamos que esta lista te haya inspirado. Para obtener aún más opciones, no olvides consultar la aplicación Name My Pet. ¡Feliz elección!"
                : "So, you’ve brought home a new furry friend! Congratulations! Now comes one of the most exciting parts of being a new pet parent: choosing the perfect name. But you’re not looking for just any name. You’re tired of hearing \"Max,\" \"Bella,\" and \"Charlie\" at the dog park. Your new companion is a one-of-a-kind, and they deserve a name that’s just as special.\n\nThat's why we've curated a list of over 150 unique dog names to get you started. And if you need even more inspiration, the Name My Pet app has a library of over 10,000 names waiting for you!\n\n**Unique Female Dog Names**\n\nNature-Inspired:\n• Clover\n• Juniper\n• Meadow\n• Poppy\n• Willow\n\nMythological & Celestial:\n• Andromeda\n• Athena\n• Juno\n• Ophelia\n• Persephone\n\nLiterary & Vintage:\n• Beatrice\n• Dorothea\n• Eloise\n• Matilda\n• Winnifred\n\n**Unique Male Dog Names**\n\nStrong & Historical:\n• Atticus\n• Caspian\n• Orion\n• Phineas\n• Stellan\n\nNerdy & Adventurous:\n• Albus\n• Bastian\n• Finnian\n• Gideon\n• Pippin\n\n**How to Choose a Unique Name**\n\nChoosing a name is a big decision, but it doesn’t have to be overwhelming. Here are a few tips to help you find the perfect fit:\n\n• Consider Personality: Is your pup playful and goofy, or calm and cuddly? A name like \"Pippin\" might suit a playful pup, while \"Stellan\" could be a great fit for a more serene dog.\n\n• Think About Appearance: Does your dog have a unique coat color or marking? A name like \"Clover\" could be perfect for a lucky pup with a special spot.\n\n• The Two-Syllable Rule: Names with two syllables are often easier for dogs to recognize and respond to.\n\n**The Name My Pet App Advantage**\n\nStill searching for that perfect name? The Name My Pet app is here to help! Our AI-powered Name Generator can help you find the perfect name in minutes. You can filter by gender, style, and even personality to find a name that’s as unique as your new best friend.\n\nReady to find the perfect name? Download the Name My Pet app for free and get started today!\n\nChoosing a unique name for your dog is a great way to celebrate their individuality. We hope this list has inspired you. For even more options, don’t forget to check out the Name My Pet app. Happy naming!",
            pet: 'dog',
            date: 'January 1, 2026'
        }
    ];

    if (selectedPost) {
        return (
            <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in flex flex-col items-center">
                <div className="w-full max-w-3xl">
                    <header className="mb-8">
                        <button 
                            onClick={() => setSelectedPost(null)}
                            className="flex items-center gap-2 text-white bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm shadow-sm hover:bg-white/30 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            {language === 'es' ? 'Volver al Blog' : 'Back to Blog'}
                        </button>
                    </header>
                    <article>
                        <Card className="p-8 md:p-12 shadow-2xl border-4 border-white/20">
                            <div className="flex justify-center mb-8">
                                <PetCharacter pet={selectedPost.pet} className="w-32 h-32 drop-shadow-2xl transform hover:scale-110 transition-transform duration-500" />
                            </div>
                            <header className="text-center mb-8">
                                <span className="text-xs font-black opacity-40 uppercase tracking-[0.3em] block mb-3">{selectedPost.date}</span>
                                <h1 className="text-4xl md:text-5xl font-black text-[#5D4037] leading-tight mb-4 font-heading">{selectedPost.title}</h1>
                            </header>
                            <div className="text-[#333333] font-medium leading-relaxed space-y-6 text-xl font-['Poppins'] whitespace-pre-wrap">
                                <p className="font-bold border-l-4 border-[#AA336A] pl-4 italic opacity-80">{selectedPost.excerpt}</p>
                                <p>{selectedPost.content}</p>
                                <div className="pt-8 border-t border-black/5">
                                    <p className="text-base opacity-60">
                                        {language === 'es' 
                                            ? "Encontrar el nombre correcto es solo el comienzo. Nuestro generador de IA utiliza información de la personalidad para encontrar nombres que realmente se ajusten a la vibra de tu mascota. ¡Pruébalo en nuestra pantalla de inicio!"
                                            : "Finding the right name is just the beginning. Our AI generator uses personality insights to find names that actually fit your pet's vibe. Try it out on our home screen!"}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </article>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <header className="flex items-center justify-start mb-12">
                    <BackToHomeButton onClick={onBack} />
                </header>
                <main>
                    <div className="text-center mb-16">
                        <h1 className="text-6xl md:text-7xl font-black text-white drop-shadow-lg uppercase tracking-tighter mb-4 font-heading">
                            {language === 'es' ? 'El Blog de Mascotas' : 'The Pet Blog'}
                        </h1>
                        <p className="text-2xl font-bold text-white/90 drop-shadow-md max-w-2xl mx-auto">
                            {language === 'es' ? 'Consejos expertos, tendencias y guías para tu nuevo familiar.' : 'Expert naming tips, lifestyle trends, and guides for your newest family member.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <button 
                                key={post.id}
                                onClick={() => {
                                    setSelectedPost(post);
                                    window.scrollTo(0,0);
                                }}
                                className="text-left group focus:outline-none"
                            >
                                <Card className="h-full flex flex-col p-8 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl border-2 border-white/10 group-focus:ring-4 group-focus:ring-[#AA336A]/20">
                                    <div className="flex justify-center mb-6">
                                        <PetCharacter pet={post.pet} className="w-24 h-24 transform group-hover:rotate-6 transition-transform duration-300 drop-shadow-md" />
                                    </div>
                                    <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-2 block">{post.date}</span>
                                    <h2 className="text-2xl font-black text-[#5D4037] mb-3 leading-tight group-hover:text-[#AA336A] transition-colors font-heading">
                                        {post.title}
                                    </h2>
                                    <p className="text-[#333333] font-bold opacity-70 line-clamp-3 text-lg leading-relaxed flex-grow">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-8 pt-6 border-t border-black/5 flex items-center gap-2 text-[#AA336A] font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                                        {language === 'es' ? 'Leer historia completa' : 'Read full story'}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </div>
                                </Card>
                            </button>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

/**
 * CONTACT US COMPONENT (Defined here to avoid path issues)
 */
const ContactUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <header className="flex items-center justify-start mb-8">
                    <button 
                        onClick={onBack} 
                        className="p-3 rounded-full bg-white/30 hover:bg-white/50 transition-all backdrop-blur-md text-[#666666] shadow-sm active:scale-95"
                        aria-label="Go Back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                </header>
                <main>
                    <Card className="text-center py-20 border-4 border-[#AA336A]/20 shadow-2xl rounded-[3rem]">
                        <div className="flex justify-center mb-6">
                             <div className="bg-[#AA336A]/10 p-6 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#AA336A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                             </div>
                        </div>
                        <h1 className="text-5xl font-black mb-6 text-[#AA336A] uppercase tracking-tight font-heading">
                            {t.contact_us.title}
                        </h1>
                        <div className="space-y-10">
                            <p className="text-2xl font-medium opacity-80 max-w-md mx-auto leading-relaxed text-[#666666]">
                                {t.contact_us.p1}
                            </p>
                            <div className="inline-block p-1.5 rounded-[2rem] bg-gradient-to-r from-[#FF6B6B] to-[#AA336A] shadow-2xl transform hover:scale-105 transition-all duration-300">
                                <a href={`mailto:${t.contact_us.email}`} className="block bg-white px-10 py-8 rounded-[calc(2rem-6px)] text-2xl sm:text-3xl font-black text-[#AA336A] hover:bg-transparent hover:text-white transition-all break-all font-heading">
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

/**
 * MAIN APP COMPONENT
 */
type View = 'app' | 'privacy' | 'terms' | 'contact' | 'blog';

const AppContent: React.FC = () => {
    const [view, setView] = useState<View>('app');
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isChillMode, setIsChillMode] = useState(false);
    const { language, setLanguage, t } = useLanguage();

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
        <>
            <CustomCursor />
            <BackgroundPattern />
            <TabMascots activeTab={activeTab} />
            {!hasValidApiKey() && (
                 <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 z-[100] text-center font-bold shadow-lg">
                    ⚠️ Configuration Error: API Key not found.
                 </div>
            )}
            <div className="relative min-h-[100dvh] overflow-x-hidden pb-24 transition-colors duration-500">
                {renderActiveTab()}
                <footer className="relative z-10 text-center my-8 space-y-6 w-full max-w-7xl mx-auto px-4 pb-12">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex justify-center gap-6">
                            <button onClick={() => setIsChillMode(!isChillMode)} className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
                                <span className="text-xl">{isChillMode ? '☀️' : '🌙'}</span>
                            </button>
                            <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
                                <span className="text-xl">🌐</span>
                            </button>
                        </div>
                        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm opacity-100 items-center text-white font-bold tracking-tight drop-shadow-md">
                            <a href="https://namemypet.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity underline underline-offset-4">namemypet.org</a>
                            <button onClick={() => setView('blog')} className="underline underline-offset-4">{t.common.blog || 'Blog'}</button>
                            <button onClick={() => setView('privacy')} className="underline underline-offset-4">{t.common.privacy}</button>
                            <button onClick={() => setView('terms')} className="underline underline-offset-4">{t.common.terms}</button>
                            <button onClick={() => setView('contact')} className="underline underline-offset-4">{t.common.contact}</button>
                        </div>
                    </div>
                </footer>
            </div>
            <TabNavigator activeTab={activeTab} setActiveTab={handleSetTab} />
        </>
    );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);

export default App;