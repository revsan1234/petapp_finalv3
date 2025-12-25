import React, { useState, useEffect } from 'react';
import { Partnerships } from './components/Partnerships';
import { MainView } from './components/MainView';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { TabNavigator, Tab } from './components/layout/TabNavigator';
import { PhotoScreen } from './components/screens/PhotoScreen';
import { PlayScreen } from './components/screens/PlayScreen';
import { BioScreen } from './components/screens/BioScreen';
import { AdoptScreen } from './components/screens/AdoptScreen';
import { LandingPage } from './components/LandingPage';
import { GeneratedName, PetInfo } from './types';
import { BackgroundPattern } from './components/ui/BackgroundPattern';
import { TabMascots } from './components/ui/TabMascots';
import { CustomCursor } from './components/ui/CustomCursor';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { hasValidApiKey } from './services/geminiService';
import { Card } from './components/ui/Card';
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

const ContactUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in flex flex-col items-center pt-[max(0.5rem,env(safe-area-inset-top))]">
            <div className="w-full max-w-4xl">
                <header className="flex items-center justify-start mb-8">
                    <BackToHomeButton onClick={onBack} />
                </header>
                <main>
                    <Card className="text-center py-20 border-4 border-[#AA336A]/10 shadow-2xl rounded-[3rem]">
                        <div className="flex justify-center mb-6">
                             <div className="transform hover:scale-110 transition-transform duration-300">
                                <PetCharacter pet="cat" className="w-32 h-32 drop-shadow-xl" />
                             </div>
                        </div>
                        <h1 className="text-5xl font-black mb-6 text-[#5D4037] uppercase tracking-tight font-heading">
                            {t.contact_us.title}
                        </h1>
                        <div className="space-y-10">
                            <p className="text-2xl font-medium max-w-md mx-auto leading-relaxed text-[#333333] opacity-90 font-['Poppins']">
                                {t.contact_us.p1}
                            </p>
                            <div className="inline-block transition-all duration-300">
                                <a 
                                    href={`mailto:${t.contact_us.email}`} 
                                    className="text-2xl sm:text-4xl font-black text-[#5D4037] hover:text-[#AA336A] transition-all break-all font-heading"
                                >
                                    {t.contact_us.email}
                                </a>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

/**
 * THE BLOG SECTION
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
            title: language === 'es' ? '150+ Nombres Únicos para Perros en 2026' : '150+ Unique Dog Names for 2026 (and How to Choose the Perfect One)',
            excerpt: language === 'es' ? '¡Felicidades por tu nuevo amigo! Ahora viene la parte más emocionante: elegir el nombre perfecto.' : 'Congratulations on your new furry friend! Now comes the most exciting part: choosing the perfect name.',
            content: "So, you’ve brought home a new furry friend! Congratulations! Now comes one of the most exciting parts of being a new pet parent: choosing the perfect name. But you’re not looking for just any name. You’re tired of hearing \"Max,\" \"Bella,\" and \"Charlie\" at the dog park. Your new companion is a one-of-a-kind, and they deserve a name that’s just as special.\n\nThat's why we've curated a list of over 150 unique dog names to get you started. And if you need even more inspiration, the Name My Pet app has a library of over 10,000 names waiting for you!\n\n**Unique Female Dog Names**\n\nNature-Inspired:\n• Clover\n• Juniper\n• Meadow\n• Poppy\n• Willow\n\nMythological & Celestial:\n• Andromeda\n• Athena\n• Juno\n• Ophelia\n• Persephone\n\nLiterary & Vintage:\n• Beatrice\n• Dorothea\n• Eloise\n• Matilda\n• Winnifred\n\n**Unique Male Dog Names**\n\nStrong & Historical:\n• Atticus\n• Caspian\n• Orion\n• Phineas\n• Stellan\n\nNerdy & Adventurous:\n• Albus\n• Bastian\n• Finnian\n• Gideon\n• Pippin\n\n**How to Choose a Unique Name**\n\nChoosing a name is a big decision, but it doesn’t have to be overwhelming. Consider Personality: Is your pup playful and goofy, or calm and cuddly? A name like \"Pippin\" might suit a playful pup, while \"Stellan\" could be a great fit for a more serene dog. Think About Appearance: Does your dog have a unique coat color or marking? A name like \"Clover\" could be perfect for a lucky pup with a special spot. The Two-Syllable Rule: Names with two syllables are often easier for dogs to recognize and respond to.",
            pet: 'dog',
            date: 'January 1, 2026'
        },
        {
            id: '2',
            title: language === 'es' ? 'Los 100 Nombres de Gato más Lindos para 2026' : 'The Top 100 Cutest Cat Names for Your Adorable Feline (2026 Edition)',
            excerpt: language === 'es' ? 'Un gatito tan lindo merece un nombre a la altura. Descubre nuestra lista de 100 nombres.' : 'There’s nothing quite like the feeling of bringing home a new kitten. They’re fluffy, playful, and impossibly cute. And a kitten that cute deserves a name to match!',
            content: "There’s nothing quite like the feeling of bringing home a new kitten. They’re fluffy, playful, and impossibly cute. And a kitten that cute deserves a name to match! If you’re searching for the perfect name for your new furry family member, you’ve come to the right place. We’ve compiled a list of the 100 cutest cat names to help you find the purr-fect fit.\n\nAnd if you need even more ideas, the Name My Pet app has a library of over 10,000 names, so you’re sure to find one you love!\n\n**Top 50 Cute Female Cat Names**\n\nSweet & Classic:\n• Bella\n• Daisy\n• Lily\n• Lucy\n• Molly\n\nFloral & Nature-Inspired:\n• Clover\n• Hazel\n• Poppy\n• Willow\n• Zinnia\n\nFood-Inspired:\n• Cookie\n• Honey\n• Mochi\n• Olive\n• Pumpkin\n\n**Top 50 Cute Male Cat Names**\n\nPlayful & Cuddly:\n• Buddy\n• Leo\n• Milo\n• Oliver\n• Teddy\n\nFunny & Quirky:\n• Gizmo\n• Nugget\n• Pippin\n• Sprout\n• Waffles\n\n**Create a Cute Bio Card for Your Cat**\n\nOnce you’ve chosen the perfect name, it’s time to make it official with a custom Bio Card from the Name My Pet app! Our Bio Card Creator lets you create a beautiful, shareable profile for your cat with their photo, name, and fun facts. It’s the perfect way to introduce your new kitten to the world!\n\nReady to create a free bio card for your cat? Download the Name My Pet app today!\n\nWe hope this list has helped you find the perfect cute name for your new kitten. With so many adorable options, you’re sure to find one that’s just right. And for even more inspiration, don’t forget to check out the Name My Pet app. Happy naming!",
            pet: 'cat',
            date: 'January 1, 2026'
        },
        {
            id: '3',
            title: language === 'es' ? 'Cómo nombrar a tu nuevo cachorro: Guía paso a paso' : 'How to Name Your New Puppy: A Step-by-Step Guide for New Pet Parents',
            excerpt: language === 'es' ? '¡Felicidades por tu nuevo cachorro! Una guía paso a paso para encontrar el nombre perfecto.' : 'Congratulations on your new puppy! You’ve got the food, the toys, and the comfy bed. Now for the most exciting part: choosing the perfect name.',
            content: "Congratulations on your new puppy! You’ve got the food, the toys, and the comfy bed. Now for the most exciting (and sometimes challenging) part: choosing the perfect name. It’s a big decision, but it doesn’t have to be stressful. This step-by-step guide will walk you through the process of finding a name that you and your new best friend will love for years to come.\n\n**Step 1: The First 48 Hours - Observation is Key**\nIt’s tempting to pick a name before you even bring your puppy home, but it’s often best to wait a day or two. Use this time to observe your puppy’s unique personality. Are they a bundle of energy, always ready to play? Or are they a sweet, cuddly lap dog? These observations can be a great source of inspiration for a name that truly fits.\n\n**Step 2: Brainstorming Your Name List**\nOnce you have a sense of your puppy’s personality, it’s time to start brainstorming. Look at Your Hobbies and Interests: Are you a movie buff, a bookworm, or a nature lover? Think about Appearance: Does your puppy have a unique coat color or marking? Use the Name My Pet App: If you’re feeling stuck, the Name My Pet app is a fantastic brainstorming tool with over 10,000 names.\n\n**Step 3: The “Family Test”**\nOnce you have a shortlist of names, it’s time for the “family test.” Say each name out loud. Is it easy to call out at the dog park? Does it sound good with your last name? Make sure everyone in the family likes the name and is happy to use it.\n\n**Step 4: The Name My Pet App Solution**\nStill undecided? The Name My Pet app can help you visualize your puppy’s new name with our Bio Card Creator. Create a custom bio card with your puppy’s photo, name, and fun facts. It’s a great way to see the name in action and share it with friends and family!\n\nChoosing a name for your new puppy is a special part of your journey together. Happy naming!",
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
                            {t.blog.back_to_blog}
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
                                        {t.blog.footer_note}
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
                            {t.blog.title}
                        </h1>
                        <p className="text-2xl font-bold text-white/90 drop-shadow-md max-w-2xl mx-auto">
                            {t.blog.subtitle}
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
                                        {t.blog.read_more}
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
         <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 z-[100] text-center font-bold shadow-lg flex flex-col items-center justify-center gap-1 pointer-events-auto">
            <span className="text-lg">⚠️ Configuration Error</span>
            <span className="font-normal opacity-90 text-sm">API Key not found. Please refresh or check environment.</span>
         </div>
      )}
      <div className="relative min-h-[100dvh] overflow-x-hidden pb-24 transition-colors duration-500 pt-[max(0rem,env(safe-area-inset-top))]">
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