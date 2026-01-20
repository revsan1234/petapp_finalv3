
import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { useLanguage } from '../../contexts/LanguageContext';
// Fix: BackToHomeButton is exported from Button.tsx
import { BackToHomeButton } from '../ui/Button';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: React.ReactNode;
    pet: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster';
    date: string;
}

export const BlogScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language, t } = useLanguage();
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const posts = useMemo<BlogPost[]>(() => {
        if (language === 'fr') {
            return [
                {
                    id: 'guide-2025-complet',
                    title: 'L\'Art de Nommer son Animal en 2025 : Guide Complet entre Tradition et IA',
                    excerpt: 'Découvrez comment l\'intelligence artificielle et les nouvelles tendances transforment le choix des noms pour nos fidèles compagnons.',
                    pet: 'dog',
                    date: '10 Janvier 2025',
                    content: (
                        <div className="space-y-6 text-left text-[#333333] text-lg leading-relaxed font-medium">
                            <p>Accueillir un animal dans sa vie est un acte d'amour profond, et le choix de son nom est la première pierre de cet édifice relationnel. En 2025, nous observons une véritable mutation : nous ne cherchons plus simplement un "joli nom", mais una identité qui résonne avec la personnalité unique de l'animal et l'histoire de sa famille.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">L'Intelligence Artificielle : Votre Nouvel Allié</h2>
                            <p>Grâce aux avancées de modèles comme Gemini dans l'application "Name My Pet", le processus de sélection est devenu une expérience interactive. L'IA ne se contente plus de cracher des listes ; elle analyse des traits comportementaux (est-il joueur, calme, ou un peu espiègle ?) pour suggérer des noms qui ont du sens. Fini les recherches fastidieuses dans des dictionnaires poussiéreux !</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">Les Tendances qui Dominent l'Année</h2>
                            <ul className="list-disc pl-5 space-y-4">
                                <li><strong>Le Renouveau Vintage :</strong> On assiste au retour en force des prénoms "de grands-parents". Les Marcel, Ginette, Albert ou Marguerite envahissent les parcs canins. Ces noms apportent une touche de noblesse et de tendresse immédiate.</li>
                                <li><strong>L'Inspiration Céleste et Cosmique :</strong> Orion, Nova, Zénith ou Galaxie sont ultra-populaires pour les animaux à la robe sombre ou aux yeux vifs. C'est un clin d'œil à l'infini et au caractère mystérieux de nos compagnons.</li>
                                <li><strong>La Gastronomie Créative :</strong> Mochi, Taco, Sushi et Olive restent indétrônables. Ils sont courts, faciles à prononcer et terriblement mignons.</li>
                            </ul>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">Nos Conseils d'Experts</h2>
                            <p>Pour qu'un nom soit efficace, il doit respecter quelques règles simples :</p>
                            <ol className="list-decimal pl-5 space-y-3">
                                <li><strong>La règle des deux syllabes :</strong> Un nom court est plus facilement reconnaissable par l'animal au milieu du bruit.</li>
                                <li><strong>Évitez les noms de commande :</strong> Si votre chien s'appelle "Sit", il risque de confondre son nom avec l'ordre de s'asseoir.</li>
                                <li><strong>Faites le "Test du Jardin" :</strong> Sortez et criez le nom à voix haute. Si vous vous sentez à l'aise, c'est le bon !</li>
                            </ol>
                            
                            <p>Choisir le nom de son animal est un voyage. Prenez votre temps, utilisez nos outils IA pour explorer des horizons inconnus, et attendez l'étincelle dans les yeux de votre compagnon quand vous prononcerez enfin le nom parfait.</p>
                        </div>
                    )
                },
                {
                    id: 'psychologie-chat-2025',
                    title: 'Psychologie Félines et Noms : Pourquoi le Son Importe Autant ?',
                    excerpt: 'Saviez-vous que les chats ne perçoivent pas les noms de la même façon que les chiens ? Apprenez à capter leur attention.',
                    pet: 'cat',
                    date: '15 Février 2025',
                    content: (
                        <div className="space-y-6 text-left text-[#333333] text-lg leading-relaxed font-medium">
                            <p>Un chat ne se contente pas d'habiter chez vous ; il règne sur son territoire. Son nom doit donc refléter cette élégance innée ou sa malice légendaire. Mais au-delà de l'esthétique, il y a una science derrière le nom du chat.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">La Science des Hautes Fréquences</h2>
                            <p>Les études comportementales montrent que les chats sont particulièrement sensibles aux sons aigus. Un nom qui se termine par une voyelle à haute fréquence (comme le son "i" dans Mochi ou Ziggy) a beaucoup plus de chances d'attirer leur attention instantanément. Les sons sourds ou les consonnes dures sont souvent perçus comme des bruits de fond.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">Le Style "Vibe-Naming"</h2>
                            <p>Nous voyons deux clans s'affronter cette année :</p>
                            <ul className="list-disc pl-5 space-y-4">
                                <li><strong>Le Clan Cottagecore :</strong> Des noms qui évoquent la nature et la simplicité, comme Fougère, Willow, Basilic ou Camomille. Parfait pour les chats qui aiment dormir des heures au soleil.</li>
                                <li><strong>Le Clan High-Fashion :</strong> Pour les félins majestueux, on opte pour des noms de prestige comme Dior, Chanel, Bentley ou Prada.</li>
                            </ul>
                            
                            <p>N'oubliez pas que votre chat choisira souvent son propre nom par ses actions loufoques. Un chat qui teste systématiquement la gravité mérite un nom à la hauteur de son audace. Utilisez notre générateur pour tester des combinaisons basées sur son comportement unique !</p>
                            <p className="font-bold text-[#AA336A] italic">Votre chat est unique, son nom doit l'être aussi.</p>
                        </div>
                    )
                }
            ];
        } else if (language === 'es') {
            return [
                {
                    id: 'guia-nombres-perros-2025',
                    title: 'Más de 150 Nombres para Perros en 2025: Del "Michi" al "Lomito"',
                    excerpt: '¡Encontrar el nombre perfecto para tu perro es una aventura! Descubre las tendencias que están marcando el año en España y Latinoamérica.',
                    pet: 'dog',
                    date: '10 de Enero 2025',
                    content: (
                        <div className="space-y-6 text-left text-[#333333] text-lg leading-relaxed font-medium">
                            <p>Dar la bienvenida a un perro es un momento transformador. Es el comienzo de un vínculo de por vida, y elegir su nombre es el primer acto oficial de tu nueva vida juntos. En 2025, vemos un cambio masivo hacia nombres con mucha personalidad y un toque de humor.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">El Poder de la Inteligencia Artificial</h2>
                            <p>Con herramientas como Name My Pet, ya no tienes que desplazarte por listas alfabéticas aburridas. La IA sugiere nombres que realmente encajan con el "vibe" de tu perro, analizando si es un "Lomito" juguetón, valiente o un poco "grinch". Esta tecnología nos permite salir de los clásicos "Firulais" y "Toby" para entrar en una era de creatividad pura.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">Tendencias Hispanas para 2025</h2>
                            <ul className="list-disc pl-5 space-y-4">
                                <li><strong>Clásicos Modernos :</strong> Nombres como Lola, Bruno, Toby y Kira siguen fuertes pero con un toque renovado. Muchos dueños están optando por diminutivos cariñosos como "Lolita" o "Brunito" desde el primer día.</li>
                                <li><strong>Inspiración Galáctica :</strong> Marte, Nova, Orión y Caspio son ideales para perros que parecen de otro mundo o tienen ojos muy brillantes.</li>
                                <li><strong>Nombres Cortos y Directos :</strong> Max, Sol, Pipo y Miel son tendencia por su facilidad de aprendizaje para el animal.</li>
                            </ul>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">Consejos de Oro para Dueños</h2>
                            <p>Recuerda la regla de oro: el nombre debe ser fácil de gritar en el parque. Si te da vergüenza decir el nombre en voz alta delante de desconocidos, quizás no sea el indicado. Además, los perros responden mejor a nombres de dos sílabas porque tienen un ritmo claro que ellos pueden distinguir fácilmente de otros sonidos ambientales.</p>
                            
                            <p>Tómate unos días para conocer a tu nuevo mejor amigo antes de decidir. A veces, su comportamiento te dará la respuesta más clara de lo que esperabas. ¡Usa nuestro generador hoy mismo y encuentra esa conexión especial!</p>
                        </div>
                    )
                },
                {
                    id: 'magia-michis-2025',
                    title: 'Magia para Nombres de Gatos: Tendencias Aesthetic y Psicología',
                    excerpt: 'Los michis merecen nombres tan únicos como sus personalidades. Mira lo que es tendencia absoluta este año para tu pequeño soberano.',
                    pet: 'cat',
                    date: '15 de Febrero 2025',
                    content: (
                        <div className="space-y-6 text-left text-[#333333] text-lg leading-relaxed font-medium">
                            <p>Un gato no es solo una mascota; es el pequeño soberano de tu hogar. Su nombre debe reflejar esa elegancia o su locura característica. En 2025, los nombres de comida y la mitología están dominando las redes sociales, creando un estilo "Aesthetic" único para cada felino.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">Lo que los Michis Prefieren</h2>
                            <p>Estudios sugeren que los gatos responden mejor a las frecuencias altas. Los nombres que terminan en sonido "i" (como Mochi, Michi, Sushi) captan su atención mucho más rápido que los sonidos graves. No es casualidad que muchos de los nombres virales tengan esta terminación.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">Estilos en Auge</h2>
                            <ul className="list-disc pl-5 space-y-4">
                                <li><strong>Nombres de Diseñador :</strong> Gucci, Chanel, Dior o Bentley para esos gatos que caminan con porte real por el salón.</li>
                                <li><strong>Seres Mitológicos :</strong> Zeus, Hera, Loki o Freya para esos gatos traviesos que creen ser dioses y exigen sacrificios en forma de latitas.</li>
                                <li><strong>Naturaleza Mística :</strong> Luna, Selva, Río o Ámbar.</li>
                            </ul>
                            
                            <p>Deja que tu gato te inspire. Observa sus manías : ¿es un cazador de sombras o un amante de las siestas eternas? Nuestra IA te permite filtrar por estos rasgos para dar con el nombre perfecto que celebre su energía específica. ¡Encuentra el nombre de tu michi rey en Name My Pet!</p>
                        </div>
                    )
                }
            ];
        } else {
            return [
                {
                    id: 'ultimate-guide-2025',
                    title: '150+ Unique Dog Names for 2025: The Ultimate AI-Powered Guide',
                    excerpt: 'Finding the perfect name for your companion is a journey. Explore the top picks for the year and learn how AI is changing the naming game.',
                    pet: 'dog',
                    date: 'Jan 10, 2025',
                    content: (
                        <div className="space-y-6 text-left text-[#333333] text-lg leading-relaxed font-medium">
                            <p>Welcoming a dog into your life is a transformative moment. It's the beginning of a lifelong bond, and choosing a name is the first official act of pet parenting. In 2025, we're seeing a massive shift in how owners approach this task, moving away from generic labels toward high-concept naming that tells a story.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">The Power of AI in Pet Naming</h2>
                            <p>With tools like the Name My Pet AI generator, you no longer have to scroll through endless alphabetical lists. AI technology analyzes data points like breed traits, personality quirks, and current cultural trends to suggest names that actually "stick". Whether you have a high-energy Border Collie or a laid-back Bulldog, the AI finds linguistic matches that sound right for that specific energy.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">2025 Trend Spotting</h2>
                            <ul className="list-disc pl-5 space-y-4">
                                <li><strong>Retro-Classic Revival :</strong> Names like Archie, Mabel, Otis, and Hazel are skyrocketing as owners look for timeless charm and a sense of history. These names provide an immediate personality profile that feels both dignified and approachable.</li>
                                <li><strong>Nature-Inspired Vibes :</strong> River, Sage, Willow, and Jasper reflect a growing desire for grounding, earthy connections. These names often suit pets with a calm, stoic demeanor.</li>
                                <li><strong>The Cosmic Frontier :</strong> Orion, Nova, Zenith, and Lyra are perfect for adventurous spirits and dogs that seem to belong to the stars.</li>
                            </ul>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">Expert Tips for Success</h2>
                            <p>Expert tip: Perform the "shout test." Stand in your backyard and yell the potential name. If it feels natural, clear, and doesn't embarrass you, it's a winner. Also, avoid names that sound like common commands (e.g., "Kit" sounds too much like "Sit").</p>
                            <p>Remember, a name is more than a tag on a collar—it's the sound of love. Take your time, enjoy the process, and let our tools help you discover the one name that truly fits.</p>
                        </div>
                    )
                },
                {
                    id: 'cat-psychology-2025',
                    title: 'Cat Naming Magic: Aesthetic Trends and Feline Psychology 2025',
                    excerpt: 'Cats often choose their own names through their quirky actions. Discover what is hot this year and why the sound of the name matters.',
                    pet: 'cat',
                    date: 'Feb 15, 2025',
                    content: (
                        <div className="space-y-6 text-left text-[#333333] text-lg leading-relaxed font-medium">
                            <p>A cat is more than a pet—it's a tiny, furry overlord. Their name should be just as regal, quirky, or mysterious as they are. In 2025, we focus on "Vibe-Naming" over traditional generic picks, ensuring your cat's name is as "aesthetic" as your Instagram feed.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">What Cats Actually Hear</h2>
                            <p>Research suggests that cats respond most consistently to names ending in high-pitched "ee" sounds. Names like Ziggy, Mochi, or Bunny are likely to grab their attention faster than names with flat vowel endings. The sharp frequency of these sounds cuts through domestic noise and signals a direct interaction to the feline brain.</p>
                            
                            <h2 className="text-2xl font-black text-[#AA336A]">Top Aesthetic Styles</h2>
                            <ul className="list-disc pl-5 space-y-4">
                                <li><strong>The Foodie Trend :</strong> Noodle, Sushi, Taco, and Olive are top-tier choices for cute cats. It adds a layer of approachability and playfulness to their personality.</li>
                                <li><strong>Gothic-Mystic :</strong> Rising for black and grey cats, with names like Salem, Raven, and Onyx leading the pack. It leans into the ancient, mysterious roots of feline history.</li>
                                <li><strong>The Artist Palette :</strong> Indigo, Saffron, Marble, and Slate.</li>
                            </ul>
                            
                            <p>Let your cat's attitude lead the way. Is your cat a brave explorer or a shy shadow? Use our personality quiz to narrow down names that celebrate their specific energy. Your pet's name is the sound of affection—make sure it rolls off the tongue and feels right in your heart.</p>
                        </div>
                    )
                }
            ];
        }
    }, [language, t.blog.back_to_blog, t.blog.footer_note, t.blog.read_more]);

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
                    {selectedPost.content}
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
            <div className="w-full max-w-5xl mb-8 flex justify-start">
                <BackToHomeButton onClick={onBack} />
            </div>
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
