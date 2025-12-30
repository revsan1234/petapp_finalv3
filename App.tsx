
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

// --- BLOG SCREEN COMPONENT (100% TRANSLATED LONG-FORM) ---

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
                ? '150+ Noms de Chiens Uniques pour 2025 : Le Guide Complet IA' 
                : language === 'es' ? '150+ Nombres de Perros Únicos para 2025: Guía Completa de IA' : '150+ Unique Dog Names for 2025: The Ultimate AI Naming Guide',
            excerpt: language === 'fr' 
                ? 'Trouver le nom parfait pour votre nouveau toutou est une aventure ! Découvrez comment l\'IA et les tendances actuelles transforment le choix des prénoms.' 
                : language === 'es' ? '¡Elegir el nombre perfecto es una aventura! Descubre cómo la IA y las tendencias están cambiando la forma de nombrar a tu perro.' : 'Finding the perfect name for your companion is a journey. From nature-inspired picks to retro classics, explore how AI is helping owners find the "one" in 2025.',
            pet: 'dog',
            date: language === 'fr' ? '15 Janvier 2025' : language === 'es' ? '15 de Enero 2025' : 'Jan 15, 2025',
            content: (
                <div className="text-left text-gray-800 space-y-8">
                    {/* ENGLISH VERSION */}
                    {language === 'en' && (
                        <>
                            <p className="text-xl leading-relaxed font-medium">
                                Welcoming a dog into your life is a transformative moment. It's the beginning of a lifelong bond, and choosing a name is the first official act of pet parenting. In 2025, we're seeing a massive shift in how owners approach this task. Standard names like 'Buddy' or 'Max' are taking a backseat to meaningful, personality-driven choices that tell a story.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">The Science of Sound in Dog Naming</h2>
                            <p className="text-lg leading-relaxed">
                                Did you know that dogs respond better to specific frequencies? Veterinary behaviorists suggest names with two syllables and a strong ending vowel (like an 'ee' or 'ah' sound). Names like Lucky, Luna, or Cookie are much easier for a dog to distinguish from background noise than flat, single-syllable names. AI naming tools like Name My Pet analyze these phonetic patterns to ensure your choice is both stylish and functional for training.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">Top Dog Naming Trends for 2025</h2>
                            <ul className="list-disc pl-8 space-y-4 text-lg">
                                <li><strong>Cosmic & Celestial:</strong> With a renewed global interest in space, names like Zenith, Nova, Orion, and Galileo are skyrocketing. They evoke wonder and greatness.</li>
                                <li><strong>Retro-Classic Human Revival:</strong> The 'Grandpa/Grandma' trend is stronger than ever. Think Archie, Mabel, Otis, and Pearl. They offer dignity and a touch of whimsy.</li>
                                <li><strong>Earthy & Organic:</strong> Reflecting our focus on sustainability, names like River, Sage, Aspen, and Willow remain top choices for active, adventure-loving pups.</li>
                            </ul>
                            <div className="bg-[#AA336A]/10 p-8 rounded-3xl border border-[#AA336A]/20">
                                <p className="font-bold text-[#AA336A] mb-4 text-xl">Expert Naming Tip:</p>
                                <p className="italic text-gray-700 text-lg leading-relaxed">
                                    Perform the 'shout test.' If you feel awkward yelling the name across a crowded public park, it might not be the right fit. The name should be easy to project and carry a positive tone. Use our AI Generator to find punchy options your dog will recognize instantly!
                                </p>
                            </div>
                            <h2 className="text-3xl font-black text-[#AA336A]">The Impact of Social Media Branding</h2>
                            <p className="text-lg leading-relaxed">
                                In the age of Instagram and TikTok, your dog's name is part of their personal 'brand'. Unique names like 'Sashimi' or 'Galaxy' spark curiosity and higher engagement online. However, beyond social platforms, a well-chosen name strengthens the psychological bond between owner and pet. It's the word they will hear most often in their lifetime, so ensure it's charged with love and meaning.
                            </p>
                        </>
                    )}

                    {/* FRENCH VERSION */}
                    {language === 'fr' && (
                        <>
                            <p className="text-xl leading-relaxed font-medium">
                                Accueillir un chien dans sa vie est un acte d'amour profond. C'est le début d'une amitié indéfectible, et le choix de son nom est le tout premier acte de complicité. En 2025, nous observons un changement radical dans la manière dont les propriétaires nomment leurs compagnons. Fini les classiques 'Médor' ou 'Rex' ; aujourd'hui, le nom d'un chien est une extension de sa personnalité, de son énergie et même du style de vie de ses maîtres.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">La Science du Rappel Canine</h2>
                            <p className="text-lg leading-relaxed">
                                Saviez-vous que les chiens entendent mieux certaines fréquences ? Les experts recommandent des noms de deux syllabes se terminant par un son en 'i' ou 'a'. Des prénoms comme Luna ou Cookie sont captés instantanément par l'ouïe canine, facilitant grandement l'éducation. L'intelligence artificielle de Name My Pet analyse ces motifs sonores pour garantir que le nom choisi est non seulement joli, mais aussi efficace pour le rappel.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">Grandes Tendances 2025 en France</h2>
                            <ul className="list-disc pl-8 space-y-4 text-lg">
                                <li><strong>Cosmique et Céleste :</strong> Orion, Nova, Zénith et Galilée sont en plein essor. Ils évoquent la grandeur et le mystère de l'univers.</li>
                                <li><strong>Le Retour du Rétro :</strong> Les noms de 'grands-parents' sont ultra-branchés : Albert, Gaston, Henriette et Marguerite apportent charme et noblesse.</li>
                                <li><strong>Inspiration Nature :</strong> Forêt, Sauge, Aspen et Willow sont les favoris des maîtres qui aiment les randonnées et l'aventure en plein air.</li>
                            </ul>
                            <div className="bg-[#AA336A]/10 p-8 rounded-3xl border border-[#AA336A]/20">
                                <p className="font-bold text-[#AA336A] mb-4 text-xl">Conseil d'Expert :</p>
                                <p className="italic text-gray-700 text-lg leading-relaxed">
                                    Faites le 'test du cri'. Si vous vous sentez gêné de crier le nom de votre chien dans un parc bondé, ce n'est probablement pas le bon. Le nom doit être facile à prononcer et avoir une consonance positive. Utilisez notre générateur pour tester des options percutantes !
                                </p>
                            </div>
                            <h2 className="text-3xl font-black text-[#AA336A]">L'Influence des Réseaux Sociaux</h2>
                            <p className="text-lg leading-relaxed">
                                À l'ère d'Instagram et TikTok, le nom de votre chien fait partie de sa 'marque'. Un nom original comme 'Sashimi' ou 'Galaxie' génère plus d'intérêt. Mais au-delà des réseaux sociaux, un nom bien choisi renforce le lien psychologique. C'est le mot qu'il entendra le plus souvent, alors assurez-vous qu'il soit chargé de tendresse.
                            </p>
                        </>
                    )}

                    {/* SPANISH VERSION */}
                    {language === 'es' && (
                        <>
                            <p className="text-xl leading-relaxed font-medium">
                                Dar la bienvenida a un perro es un acto de amor profundo. Es el comienzo de un vínculo de por vida, y elegir su nombre es el primer paso oficial de tu camino juntos. En 2025, estamos viendo un cambio masivo en cómo los dueños eligen los nombres. Los nombres estándar como 'Firulais' están dando paso a opciones más profundas y basadas en la personalidad que realmente cuentan una historia única.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">La Ciencia del Sonido en el Nombre</h2>
                            <p className="text-lg leading-relaxed">
                                ¿Sabías que los perros responden mejor a ciertas frecuencias? Los expertos en comportamiento sugieren nombres de dos sílabas que terminen en una vocal fuerte (como sonido 'i' o 'a'). Nombres como Lucky, Luna o Mochi son mucho más fáciles de distinguir para un perro entre el ruido ambiental. Nuestra IA analiza estos patrones fonéticos para asegurar que tu elección sea perfecta para el entrenamiento.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">Tendencias de Nombres para 2025</h2>
                            <ul className="list-disc pl-8 space-y-4 text-lg">
                                <li><strong>Cósmico y Celestial:</strong> Nombres como Zenit, Nova, Orión y Galileo son tendencia absoluta. Evocan asombro y grandeza.</li>
                                <li><strong>Renacimiento Retro-Clásico:</strong> Los nombres de 'abuelos' están más fuertes que nunca: Arturo, Lola, Ramón y Perla aportan dignidad y simpatía.</li>
                                <li><strong>Inspiración Terrenal:</strong> Reflejando un enfoque en la naturaleza, nombres como Río, Salvia, Aspen y Sauce son las opciones favoritas para perros activos.</li>
                            </ul>
                            <div className="bg-[#AA336A]/10 p-8 rounded-3xl border border-[#AA336A]/20">
                                <p className="font-bold text-[#AA336A] mb-4 text-xl">Consejo de Experto:</p>
                                <p className="italic text-gray-700 text-lg leading-relaxed">
                                    Haz la 'prueba del grito'. Si te da vergüenza gritar el nombre en un parque público lleno de gente, probablemente no sea el indicado. El nombre debe ser fácil de proyectar y tener un tono positivo. ¡Usa nuestra IA para encontrar nombres con fuerza!
                                </p>
                            </div>
                            <h2 className="text-3xl font-black text-[#AA336A]">El Impacto de la Marca Personal</h2>
                            <p className="text-lg leading-relaxed">
                                En la era de Instagram y TikTok, el nombre de tu 'lomito' es parte de su marca. Nombres originales como 'Sashimi' o 'Galaxia' generan curiosidad y compromiso online. Pero más allá de las redes, un nombre bien elegido fortalece el vínculo psicológico entre dueño y mascota. Es la palabra que más escuchará en su vida, asegúrate de que esté llena de amor.
                            </p>
                        </>
                    )}
                </div>
            )
        },
        {
            id: '2',
            title: language === 'fr' 
                ? 'La Magie des Noms de Chats : Styles et Tendances Félines pour 2025' 
                : language === 'es' ? 'Magia para Nombres de Gatos: Tendencias y Psicología 2025' : 'Cat Naming Magic: Finding the Perfect Feline Vibe in 2025',
            excerpt: language === 'fr' 
                ? 'Les chats sont mystérieux et élégants. Découvrez pourquoi leur nom doit être aussi unique que leur aura.' 
                : language === 'es' ? 'Los gatos son misteriosos y elegantes. Descubre por qué su nombre debe ser tan único como su aura mística.' : 'A cat is more than a pet—it is a tiny, furry overlord. Discover the science of feline naming and the hottest aesthetic trends this year.',
            pet: 'cat',
            date: language === 'fr' ? '20 Février 2025' : language === 'es' ? '20 de Febrero 2025' : 'Feb 20, 2025',
            content: (
                <div className="text-left text-gray-800 space-y-8">
                    {/* ENGLISH VERSION */}
                    {language === 'en' && (
                        <>
                            <p className="text-xl leading-relaxed font-medium">
                                A cat is more than just a pet; they are the only animals capable of transforming a simple living room into a royal palace with their mere presence. Their name should be just as regal, quirky, or mysterious as they are. In 2025, cat owners are leaning into 'Vibe-Naming'—selecting a name that perfectly matches the individual energy of their feline.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">Feline Phonetics: What They Hear</h2>
                            <p className="text-lg leading-relaxed">
                                Unlike dogs, who often look for directional commands, cats are highly sensitive to high-pitched frequencies. Feline behavior research suggests they are much more likely to respond to names that end in a high frequency, like 'Ziggy', 'Mochi', or 'Kitty'. Choosing a name with a rising intonation isn't just cute—it's scientifically proven to improve recall and recognition in cats.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">Cat Aesthetics for 2025</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Cottagecore Cats</h3>
                                    <p className="text-base opacity-90">Names like Fern, Bramble, Clover, and Willow are trending for indoor-only loungers who enjoy a sunny windowsill and a cozy, organic aesthetic.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Gourmet Labels</h3>
                                    <p className="text-base opacity-90">Universally cute! Noodle, Bean, Sprout, Taco, and Mochi continue to dominate pet social media profiles for their playful charm.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Mystical & Goth</h3>
                                    <p className="text-base opacity-90">For sleek black, grey, or white cats: Salem, Raven, Onyx, and Nebula offer a touch of the supernatural and a sophisticated edge.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">High-Fashion</h3>
                                    <p className="text-base opacity-90">For the 'Elegant' personality type: Gucci, Chanel, Bentley, and Dior fit their high-maintenance, regal, and sophisticated vibe.</p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-[#AA336A]">Why Use an AI Generator?</h2>
                            <p className="text-lg leading-relaxed">
                                Generic lists don't account for the unique spirit of your pet. Using Name My Pet allows you to filter by specific behaviors—ensuring the name matches the actual life your cat leads. Whether they are a 'Mischievous' night-hunter or a 'Calm' sun-bather, our AI finds the match that defines a lifetime of companionship.
                            </p>
                        </>
                    )}

                    {/* FRENCH VERSION */}
                    {language === 'fr' && (
                        <>
                            <p className="text-xl leading-relaxed font-medium">
                                Un chat est bien plus qu'un simple animal de compagnie ; c'est le seul être capable de transformer un salon en palais par sa seule présence. Leur nom doit refléter cette élégance innée ou leur malice légendaire. En 2025, la tendance mondiale est au 'Vibe-Naming' : choisir un nom qui correspond précisément à l'aura énergétique de votre félin.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">Phonétique Féline : Ce qu'ils entendent</h2>
                            <p className="text-lg leading-relaxed">
                                Contrairement aux chiens, les chats sont extrêmement sensibles aux hautes fréquences. Les recherches suggèrent qu'ils sont beaucoup plus susceptibles de répondre à des noms se terminant par un son aigu (comme 'i' ou 'y'). Choisir un nom comme 'Ziggy' ou 'Mochi' n'est pas seulement mignon, c'est scientifiquement prouvé pour améliorer la reconnaissance chez le chat.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">Esthétiques Félines 2025</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Le Style 'Cottagecore'</h3>
                                    <p className="text-base opacity-90">Fougère, Trèfle, Willow et Automne sont parfaits pour les chats d'intérieur qui aiment se prélasser sur un rebord de fenêtre ensoleillé.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Noms Gourmands</h3>
                                    <p className="text-base opacity-90">Universellement adorables ! Noodle, Sushi, Olive et Taco continuent de dominer les profils Instagram pour leur charme ludique.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Mystique et Gothique</h3>
                                    <p className="text-base opacity-90">Pour les chats noirs ou gris : Salem, Raven, Onyx et Nebula apportent une touche surnaturelle et sophistiquée.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Haute Couture</h3>
                                    <p className="text-base opacity-90">Pour les personnalités 'Élégantes' : Gucci, Chanel, Bentley et Dior correspondent à leur port de tête royal et sophistiqué.</p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-[#AA336A]">Pourquoi utiliser l'IA ?</h2>
                            <p className="text-lg leading-relaxed">
                                Les listes génériques ne tiennent pas compte de l'esprit unique de votre animal. En utilisant Name My Pet, vous filtrez par comportement réel : votre chat est-il un sauteur intrépide ou un dormeur calme ? L'IA trouve le nom qui définit une vie entière de complicité.
                            </p>
                        </>
                    )}

                    {/* SPANISH VERSION */}
                    {language === 'es' && (
                        <>
                            <p className="text-xl leading-relaxed font-medium">
                                Un gato es más que una simple mascota; son los únicos animales capaces de transformar una sala de estar en un palacio real con su mera presencia. Su nombre debe ser tan regio, peculiar o misterioso como ellos. En 2025, los dueños se inclinan por el 'Vibe-Naming': seleccionar un nombre que coincida perfectamente con la energía individual de su 'michi'.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">Fonética Felina: Lo que escuchan</h2>
                            <p className="text-lg leading-relaxed">
                                A diferencia de los perros, los gatos son muy sensibles a las frecuencias altas. La investigación sugiere que es más probable que respondan a nombres que terminen en una frecuencia alta, como 'Ziggy', 'Mochi' o 'Michi'. Elegir un nombre con entonación ascendente no solo es lindo, está científicamente probado que mejora el reconocimiento en los gatos.
                            </p>
                            <h2 className="text-3xl font-black text-[#AA336A]">Estéticas para Gatos 2025</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Estilo 'Cottagecore'</h3>
                                    <p className="text-base opacity-90">Nombres como Helecho, Trébol y Sauce son tendencia para gatos de interior que disfrutan de una ventana soleada y una estética acogedora.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Nombres de Comida</h3>
                                    <p className="text-base opacity-90">¡Universalmente adorables! Noodle, Taco y Mochi siguen dominando los perfiles de redes sociales por su encanto juguetón.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Místico y Gótico</h3>
                                    <p className="text-base opacity-90">Para gatos negros o grises: Salem, Raven, Ónix y Nebula ofrecen un toque sobrenatural y un aire sofisticado.</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-[#AA336A] text-xl mb-2">Alta Costura</h3>
                                    <p className="text-base opacity-90">Para los gatos 'Elegantes': Gucci, Chanel, Bentley y Dior encajan con su porte regio y personalidad sofisticada.</p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-[#AA336A]">¿Por qué usar un generador de IA?</h2>
                            <p className="text-lg leading-relaxed">
                                Las listas genéricas no consideran el espíritu único de tu mascota. Name My Pet te permite filtrar por comportamientos específicos, asegurando que el nombre coincida con la vida real de tu gato. Nuestra IA encuentra el match que define una vida de compañerismo.
                            </p>
                        </>
                    )}
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
                <Card className="p-8 md:p-12 max-w-4xl w-full border-4 border-white/20 shadow-2xl mb-24 rounded-[3rem] bg-white/95 backdrop-blur-sm overflow-hidden">
                    <div className="flex justify-center mb-10">
                        <PetCharacter pet={selectedPost.pet} className="w-32 h-32 drop-shadow-xl animate-bounce-wiggle" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 text-center text-[#5D4037] leading-tight drop-shadow-sm tracking-tight">{selectedPost.title}</h1>
                    <div className="text-sm font-black opacity-30 text-center uppercase tracking-[0.3em] mb-12 border-b border-black/5 pb-8">
                        {language === 'fr' ? 'Publié le ' : language === 'es' ? 'Publicado el ' : 'Published on '} {selectedPost.date}
                    </div>
                    <div className="pb-10">
                        {selectedPost.content}
                    </div>
                    <div className="mt-10 pt-10 border-t border-black/5 text-center">
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
