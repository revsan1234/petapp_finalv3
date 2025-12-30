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
                    <Card className="text-center py-20 border-4 border-[#AA336A]/20 shadow-2xl rounded-[3rem]">
                        <div className="flex justify-center mb-6">
                             <div className="bg-[#AA336A]/10 p-6 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#AA336A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                             </div>
                        </div>
                        <h1 className="text-5xl font-black mb-6 text-[#AA336A] uppercase tracking-tight">{t.contact_us.title}</h1>
                        <div className="space-y-10">
                            <p className="text-2xl font-medium opacity-80 max-w-md mx-auto leading-relaxed text-[#666666]">{t.contact_us.p1}</p>
                            <div className="inline-block p-1.5 rounded-[2rem] bg-gradient-to-r from-[#FF6B6B] to-[#AA336A] shadow-2xl transform hover:scale-105 transition-all duration-300">
                                <a href={`mailto:${t.contact_us.email}`} className="block bg-white px-10 py-8 rounded-[calc(2rem-6px)] text-2xl sm:text-3xl font-black text-[#AA336A] hover:bg-transparent hover:text-white transition-all break-all">
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

// --- BLOG SCREEN COMPONENT (MASSIVE MULTILINGUAL LONG-FORM CONTENT) ---

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: React.ReactNode;
    pet: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster';
    date: string;
}

const BlogScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language, t } = useLanguage();
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const posts = useMemo<BlogPost[]>(() => [
        {
            id: '1',
            title: language === 'fr' 
                ? '150+ Noms de Chiens Uniques pour 2025 : Le Guide Ultime de l\'IA' 
                : language === 'es' 
                    ? '150+ Nombres de Perros Únicos para 2025: Guía Completa de IA' 
                    : '150+ Unique Dog Names for 2025: The Ultimate AI Naming Guide',
            excerpt: language === 'fr' 
                ? 'Trouver le nom parfait est une aventure ! Découvrez comment l\'IA et les tendances 2025 transforment le choix des prénoms canins.' 
                : language === 'es'
                    ? '¡Elegir el nombre perfecto es una aventura! Descubre cómo la IA y las tendencias de 2025 están cambiando todo.'
                    : 'Finding the perfect name is a journey. Explore how AI and 2025 trends are revolutionizing dog naming for modern pet parents.',
            pet: 'dog',
            date: language === 'fr' ? '12 Janvier 2025' : language === 'es' ? '12 de Enero, 2025' : 'Jan 12, 2025',
            content: (
                <div className="space-y-8 text-left text-[#333333] leading-relaxed">
                    <p className="text-xl">
                        {language === 'fr' 
                            ? "Accueillir un nouveau chien dans sa famille est l'une des expériences les plus gratifiantes au monde. Cependant, avant les premières promenades et les séances de câlins, il y a une décision cruciale : le nom. En 2025, nous voyons un abandon massif des noms génériques au profit d'identités qui racontent une véritable histoire. Selon nos données, les recherches pour des 'noms de chiens rares' ont bondi de 65 % cette année."
                            : language === 'es'
                                ? "Recibir a un nuevo perro en la familia es una de las experiencias más gratificantes del mundo. Sin embargo, antes de los paseos y los mimos, hay una decisión crucial: el nombre. En 2025, estamos viendo un alejamiento masivo de los nombres genéricos en favor de identidades que cuentan una historia real. Según nuestros datos, las búsquedas de 'nombres para perros raros' han aumentado un 65% este año."
                                : "Welcoming a new dog into your family is one of life's most rewarding experiences. But before the first walks and cuddle sessions, there is a crucial decision: the name. In 2025, we are seeing a massive shift away from generic names in favor of identities that tell a true story. According to our data, searches for 'rare dog names' have surged by 65% this year."}
                    </p>
                    
                    <h2 className="text-3xl font-black text-[#AA336A] pt-4">
                        {language === 'fr' ? "Le Pouvoir de l'IA dans la Recherche du Nom" : language === 'es' ? "El Poder de la IA al Elegir un Nombre" : "The Power of AI in the Naming Search"}
                    </h2>
                    <p className="text-lg">
                        {language === 'fr'
                            ? "L'intelligence artificielle n'est plus seulement pour la technologie ; elle s'invite dans nos foyers pour nous aider à nommer nos compagnons à quatre pattes. Le générateur de Name My Pet utilise des algorithmes avancés pour analyser la race, la personnalité (Espiègle, Calme, Courageux) et même votre style esthétique personnel. Cela permet d'éviter les redondances et de s'assurer que votre chien ne portera pas le même nom que tous les autres chiens du quartier."
                            : language === 'es'
                                ? "La inteligencia artificial ya no es solo para la tecnología; está entrando en nuestros hogares para ayudarnos a nombrar a nuestros compañeros. El generador de Name My Pet utiliza algoritmos avanzados para analizar la raza, la personalidad (Travieso, Tranquilo, Valiente) e incluso tu estilo estético personal. Esto evita redundancias y asegura que tu perro no tenga el mismo nombre que todos los demás en el parque."
                                : "Artificial intelligence isn't just for tech anymore; it's entering our homes to help us name our companions. The Name My Pet generator uses advanced algorithms to analyze breed, personality (Mischievous, Calm, Brave), and even your personal aesthetic style. This avoids redundancy and ensures your dog won't have the same name as every other dog at the park."}
                    </p>

                    <h2 className="text-3xl font-black text-[#AA336A] pt-4">
                        {language === 'fr' ? "Tendances Canines 2025" : language === 'es' ? "Tendencias Caninas 2025" : "2025 Dog Naming Trends"}
                    </h2>
                    <ul className="list-disc pl-6 space-y-4 text-lg">
                        <li><strong>{language === 'fr' ? "Noms Célestes" : language === 'es' ? "Nombres Celestiales" : "Celestial Names"}:</strong> {language === 'fr' ? "Orion, Nova, et Lyra dominent les classements pour leur côté majestueux." : language === 'es' ? "Orión, Nova y Lyra dominan las listas por su toque majestuoso." : "Orion, Nova, and Lyra are dominating the charts for their majestic and timeless feel."}</li>
                        <li><strong>{language === 'fr' ? "Le Grand Retour du Rétro" : language === 'es' ? "El Gran Regreso de lo Retro" : "The Great Retro Revival"}:</strong> {language === 'fr' ? "Albert, Henriette, et Gaston apportent une touche de noblesse vintage." : language === 'es' ? "Arturo, Lola y Ramón aportan un toque de nobleza vintage." : "Names like Archie, Mabel, and Otis offer a sense of vintage charm and dignity."}</li>
                        <li><strong>{language === 'fr' ? "Inspiration Culinaire" : language === 'es' ? "Inspiración Culinaria" : "Culinary Inspiration"}:</strong> {language === 'fr' ? "Mochi, Sashimi et Olive sont parfaits pour les gourmands." : language === 'es' ? "Mochi, Sushi y Oliva son ideales para los más comilones." : "Mochi, Sashimi, and Olive are perfect for those with a food-loving spirit."}</li>
                    </ul>

                    <h2 className="text-3xl font-black text-[#AA336A] pt-4">
                        {language === 'fr' ? "La Science du Son : Pourquoi 'Luna' Marche" : language === 'es' ? "La Ciencia del Sonido: Por Qué 'Luna' Funciona" : "The Science of Sound: Why 'Luna' Works"}
                    </h2>
                    <p className="text-lg">
                        {language === 'fr'
                            ? "Les vétérinaires et comportementalistes s'accordent sur un point : les chiens répondent mieux aux sons courts et percutants. Les noms de deux syllabes se terminant par une voyelle forte (comme 'i' ou 'a') sont les plus faciles à distinguer pour l'oreille canine. C'est pourquoi des prénoms comme Luna, Lucky ou Cookie restent des classiques indémodables. Évitez les noms qui riment avec des ordres négatifs pour ne pas créer de confusion lors de l'éducation."
                            : language === 'es'
                                ? "Los veterinarios y expertos en comportamiento coinciden: los perros responden mejor a sonidos cortos y contundentes. Los nombres de dos sílabas que terminan en una vocal fuerte (como 'i' o 'a') son los más fáciles de distinguir para el oído canino. Es por eso que nombres como Luna, Lucky o Cookie siguen siendo clásicos. Evita nombres que rimen con comandos negativos para no crear confusión durante el entrenamiento."
                                : "Veterinarians and behaviorists agree: dogs respond best to short, punchy sounds. Two-syllable names ending in a strong vowel (like 'ee' or 'ah') are the easiest for the canine ear to distinguish. This is why names like Luna, Lucky, or Cookie remain timeless classics. Avoid names that rhyme with negative commands to prevent confusion during training sessions."}
                    </p>

                    <div className="bg-[#AA336A]/5 p-8 rounded-[2rem] border-2 border-[#AA336A]/10 mt-8 shadow-inner">
                        <p className="font-bold text-[#AA336A] mb-4 text-2xl">{language === 'fr' ? "Conseil d'Expert :" : language === 'es' ? "Consejo de Experto :" : "Expert Tip:"}</p>
                        <p className="italic text-gray-700 text-lg">
                            {language === 'fr' 
                                ? "Faites le 'test du cri'. Sortez dans votre jardin et criez le nom. Si vous vous sentez ridicule ou si le son ne porte pas, ce n'est peut-être pas le bon. Le nom doit être facile à projeter et avoir une consonance positive. Utilisez notre IA pour explorer des variantes avant de vous décider !" 
                                : language === 'es'
                                    ? "¡Haz la prueba del grito! Sal al jardín y grita el nombre. Si te sientes ridículo o el sonido no viaja bien, quizás no sea el indicado. El nombre debe ser fácil de proyectar y sonar positivo. ¡Usa nuestra IA para explorar variantes antes de decidir!"
                                    : "Always perform the 'shout test.' Go outside and shout the name. If you feel embarrassed or if the sound doesn't carry well, it might not be the right fit. The name should be easy to project and carry a positive tone. Use our AI to explore variations before making your final pick!"}
                        </p>
                    </div>

                    <p className="text-xl font-bold text-center pt-8 opacity-60">
                        {language === 'fr' ? "Découvrez le nom idéal dès aujourd'hui sur Name My Pet." : language === 'es' ? "Encuentra el nombre ideal hoy mismo en Name My Pet." : "Discover the ideal name today on Name My Pet."}
                    </p>
                </div>
            )
        },
        {
            id: '2',
            title: language === 'fr' 
                ? 'La Magie des Noms de Chats : Psychologie et Styles pour 2025' 
                : language === 'es'
                    ? 'Magia para Nombres de Gatos: Psicología y Estilos 2025'
                    : 'Cat Naming Magic: Psychology, Aesthetics & 2025 Trends',
            excerpt: language === 'fr' 
                ? 'Les chats ne sont pas de simples animaux, ce sont des souverains ! Découvrez comment leur trouver un nom digne de leur rang.' 
                : language === 'es'
                    ? 'Los gatos no son solo mascotas, ¡son soberanos! Descubre cómo encontrarles un nombre digno de su realeza.'
                    : 'Cats are not just pets; they are furry sovereigns! Discover how to choose a name that matches their regal or quirky nature.',
            pet: 'cat',
            date: language === 'fr' ? '20 Février 2025' : language === 'es' ? '20 de Febrero, 2025' : 'Feb 20, 2025',
            content: (
                <div className="space-y-8 text-left text-[#333333] leading-relaxed">
                    <p className="text-xl">
                        {language === 'fr'
                            ? "Un chat est le seul animal capable de transformer un simple appartement en un palais royal. Leur nom doit refléter cette aura de mystère, d'élégance ou parfois de pure folie. En 2025, nous assistons à l'émergence du 'Vibe-Naming', où le nom est choisi pour s'harmoniser avec l'énergie visuelle et comportementale du félin."
                            : language === 'es'
                                ? "Un gato es el único animal capaz de transformar un simple apartamento en un palacio real. Su nombre debe reflejar ese aura de misterio, elegancia o, a veces, pura locura. En 2025, asistimos al surgimiento del 'Vibe-Naming', donde el nombre se elige para armonizar con la energía visual del felino."
                                : "A cat is the only animal capable of transforming a simple apartment into a royal palace. Their name must reflect this aura of mystery, elegance, or sometimes pure chaos. In 2025, we are witnessing the rise of 'Vibe-Naming', where a name is selected to harmonize with the feline's visual and behavioral energy."}
                    </p>

                    <h2 className="text-3xl font-black text-[#AA336A] pt-4">
                        {language === 'fr' ? "Phonétique Féline : Ce qu'ils entendent" : language === 'es' ? "Fonética Felina: Lo que ellos escuchan" : "Feline Phonetics: What They Hear"}
                    </h2>
                    <p className="text-lg">
                        {language === 'fr'
                            ? "Contrairement aux chiens, les chats sont plus sensibles aux fréquences aiguës. Les études montrent qu'ils réagissent plus promptement à un nom se terminant par un son en 'i' ou 'y' (comme Ziggy ou Mimi). Ces fréquences imitent les appels de détresse des chatons ou les bruits de proies, ce qui capte instantanément leur attention. Cependant, ne vous y trompez pas : votre chat vous entend probablement toujours, il choisit simplement de vous ignorer !"
                            : language === 'es'
                                ? "A diferencia de los perros, los gatos son más sensibles a las frecuencias agudas. Los estudios muestran que reaccionan más rápido a un nombre que termina en sonido 'i' o 'y' (como Ziggy o Mimi). Estas frecuencias imitan los llamados de los gatitos, captando su atención al instante. Sin embargo, no te engañes: ¡tu gato probablemente te escucha siempre, solo elige ignorarte!"
                                : "Unlike dogs, cats are more sensitive to high-pitched frequencies. Studies show they react more promptly to names ending in an 'ee' or 'y' sound (like Ziggy or Mimi). These frequencies mimic kitten calls, grabbing their attention instantly. However, don't be fooled: your cat likely always hears you; they just choose to ignore you!"}
                    </p>

                    <h2 className="text-3xl font-black text-[#AA336A] pt-4">
                        {language === 'fr' ? "Les Styles en Vogue en 2025" : language === 'es' ? "Estilos en boga para 2025" : "Leading Aesthetics for 2025"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white/40 rounded-2xl border border-white/20 shadow-sm">
                            <h3 className="font-bold text-[#AA336A] text-xl mb-2">{language === 'fr' ? "Style Cottagecore" : language === 'es' ? "Estilo Rural" : "Cottagecore Vibes"}</h3>
                            <p className="text-sm opacity-90">{language === 'fr' ? "Des noms doux comme Fougère, Basilic, et Automne pour les chats qui aiment se prélasser au soleil." : language === 'es' ? "Nombres dulces como Helecho, Albahaca y Otoño para gatos que aman tomar el sol." : "Soft names like Fern, Basil, and Autumn for cats who love lounging in sunbeams and domestic bliss."}</p>
                        </div>
                        <div className="p-6 bg-white/40 rounded-2xl border border-white/20 shadow-sm">
                            <h3 className="font-bold text-[#AA336A] text-xl mb-2">{language === 'fr' ? "Noms Gourmands" : language === 'es' ? "Nombres Gourmet" : "Gourmet Labels"}</h3>
                            <p className="text-sm opacity-90">{language === 'fr' ? "Noodle, Taco, et Mochi sont les favoris des réseaux sociaux." : language === 'es' ? "Noodle, Taco y Mochi son los favoritos de las redes sociales." : "Noodle, Taco, and Mochi remain social media favorites for their universal cuteness."}</p>
                        </div>
                        <div className="p-6 bg-white/40 rounded-2xl border border-white/20 shadow-sm">
                            <h3 className="font-bold text-[#AA336A] text-xl mb-2">{language === 'fr' ? "Gothique & Mystique" : language === 'es' ? "Gótico y Místico" : "Gothic & Mystical"}</h3>
                            <p className="text-sm opacity-90">{language === 'fr' ? "Salem, Onyx et Raven pour les chats noirs ou gris au regard perçant." : language === 'es' ? "Salem, Onyx y Raven para gatos negros o grises de mirada penetrante." : "Salem, Onyx, and Raven for sleek black or grey cats with a piercing and magical gaze."}</p>
                        </div>
                        <div className="p-6 bg-white/40 rounded-2xl border border-white/20 shadow-sm">
                            <h3 className="font-bold text-[#AA336A] text-xl mb-2">{language === 'fr' ? "Luxe & Mode" : language === 'es' ? "Lujo y Moda" : "High-Fashion"}</h3>
                            <p className="text-sm opacity-90">{language === 'fr' ? "Chanel, Gucci et Bentley pour les félins à la personnalité 'Élégante'." : language === 'es' ? "Chanel, Gucci y Bentley para felinos con mucha clase." : "Chanel, Gucci, and Bentley for felines with an 'Elegant' and high-maintenance personality."}</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-[#AA336A] pt-4">
                        {language === 'fr' ? "L'IA au Service du Vibe-Naming" : language === 'es' ? "La IA al servicio del Vibe-Naming" : "AI-Powered Vibe-Naming"}
                    </h2>
                    <p className="text-lg">
                        {language === 'fr'
                            ? "Grâce à Name My Pet, vous ne choisissez pas juste un mot dans un dictionnaire. Notre IA analyse la personnalité complexe de votre chat (Est-il un chasseur de minuit ou un dormeur professionnel ?) pour vous proposer des noms qui collent à sa réalité. Un chat nommé 'Chaos' n'aura pas la même vie qu'un chat nommé 'Nuage' !"
                            : language === 'es'
                                ? "Con Name My Pet, no solo eliges una palabra de un diccionario. Nuestra IA analiza la personalidad compleja de tu gato (¿Es un cazador nocturno o un dormilón profesional?) para sugerir nombres que encajen. ¡Un gato llamado 'Caos' no tendrá la misma vida que uno llamado 'Nube'!"
                                : "With Name My Pet, you aren't just picking a word from a dictionary. Our AI analyzes your cat's complex personality (Are they a midnight hunter or a professional napper?) to suggest names that fit their reality. A cat named 'Chaos' will have a very different life than one named 'Nimbus'!"}
                    </p>

                    <p className="text-xl font-bold text-[#AA336A] text-center pt-8 underline decoration-2 underline-offset-8">
                        {language === 'fr'
                            ? "Prêt à nommer votre nouveau souverain ? Utilisez notre générateur dès maintenant !"
                            : language === 'es'
                                ? "¿Listo para nombrar a tu nuevo soberano? ¡Usa nuestro generador ahora!"
                                : "Ready to name your new sovereign? Use our AI generator right now!"}
                    </p>
                </div>
            )
        }
    ], [language]);

    const handleOpenPost = (post: BlogPost) => {
        setSelectedPost(post);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (selectedPost) {
        return (
            <div className="min-h-screen p-4 flex flex-col items-center animate-fade-in relative z-10">
                <div className="w-full max-w-3xl mb-8 flex justify-start">
                     <button 
                        onClick={() => setSelectedPost(null)} 
                        className="flex items-center gap-2 text-white bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm hover:bg-white/30 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                        {t.blog.back_to_blog}
                    </button>
                </div>
                <Card className="p-8 md:p-12 max-w-4xl w-full border-4 border-white/20 shadow-2xl mb-24 rounded-[3rem] bg-white/95 backdrop-blur-sm">
                    <div className="flex justify-center mb-8">
                        <PetCharacter pet={selectedPost.pet} className="w-32 h-32 drop-shadow-xl" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 text-center text-[#5D4037] leading-tight drop-shadow-sm tracking-tight">{selectedPost.title}</h1>
                    <div className="text-sm font-black opacity-30 text-center uppercase tracking-[0.3em] mb-10 border-b border-black/5 pb-6">
                        {language === 'fr' ? 'Publié le ' : language === 'es' ? 'Publicado el ' : 'Published on '} {selectedPost.date}
                    </div>
                    <div className="prose prose-pink max-w-none">
                        {selectedPost.content}
                    </div>
                    <div className="mt-20 pt-10 border-t border-black/5 text-center">
                        <p className="text-sm font-bold text-[#AA336A] uppercase tracking-widest">{t.blog.footer_note}</p>
                        <p className="mt-3 text-gray-400 text-xs tracking-widest">© 2025 NAME MY PET. ALL RIGHTS RESERVED.</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 flex flex-col items-center animate-fade-in relative z-10">
            <div className="w-full max-w-5xl mb-8 flex justify-start"><BackToHomeButton onClick={onBack} /></div>
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-8xl font-black text-white mb-4 uppercase drop-shadow-md tracking-tighter">
                    {t.blog.title}
                </h1>
                <p className="text-white text-xl md:text-3xl font-bold opacity-90 drop-shadow-sm max-w-2xl mx-auto leading-tight">
                    {t.blog.subtitle}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full pb-24">
                {posts.map(post => (
                    <Card 
                        key={post.id} 
                        onClick={() => handleOpenPost(post)} 
                        className="p-10 cursor-pointer transform hover:scale-[1.03] transition-all hover:shadow-2xl border-2 border-white/10 group shadow-md hover:shadow-xl flex flex-col h-full rounded-[3rem] bg-white/90 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <PetCharacter pet={post.pet} className="w-20 h-20 group-hover:rotate-12 transition-transform duration-500" />
                            <div className="text-left">
                                <span className="text-xs font-black opacity-40 uppercase tracking-widest block mb-1">{post.date}</span>
                                <h2 className="text-2xl font-black group-hover:text-[#AA336A] transition-colors leading-tight text-[#5D4037]">{post.title}</h2>
                            </div>
                        </div>
                        <p className="opacity-80 text-left text-xl font-bold line-clamp-4 leading-relaxed mb-8 flex-grow text-[#666666]">{post.excerpt}</p>
                        <div className="mt-auto pt-6 border-t border-black/5 text-[#AA336A] font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
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
                if (node.tagName === 'LINK' || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return false;
                return true;
            };
            const dataUrl = await toPng(bioCardRef.current, { 
                pixelRatio: 3, 
                cacheBust: true, 
                filter: filter
            });
            const link = document.createElement('a'); 
            link.href = dataUrl; link.download = `${petName || 'MyPet'}_Bio.png`;
            link.click();
        } catch (error: any) { 
            console.error("Download failed", error);
        } finally { setIsDownloading(false); }
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

    if (view === 'privacy') return <PrivacyPolicy onBack={() => setView('app')} />;
    if (view === 'terms') return <TermsAndConditions onBack={() => setView('app')} />;
    if (view === 'contact') return <ContactUs onBack={() => setView('app')} />;
    if (view === 'blog') return <BlogScreen onBack={() => setView('app')} />;

    return (
        <div className="relative min-h-[100dvh]">
            <CustomCursor />
            <BackgroundPattern />
            <div className="relative min-h-[100dvh] overflow-x-hidden">
                <div className="pb-24">{renderActiveTab()}</div>
                <footer className="relative z-10 text-center my-8 space-y-8 w-full max-w-7xl mx-auto px-4 pb-12">
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