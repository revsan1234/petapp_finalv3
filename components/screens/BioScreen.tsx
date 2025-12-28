import React, { useState } from 'react';
import { Card } from './ui/Card';
import { PetCharacter } from './assets/pets/PetCharacter';
import { useLanguage } from '../contexts/LanguageContext';
import { BackToHomeButton } from '../App';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    pet: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster';
    date: string;
}

export const BlogScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language, t } = useLanguage();
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const posts: BlogPost[] = [
        {
            id: '1',
            title: language === 'fr' 
                ? 'Plus de 150 Noms de Chiens Uniques pour 2025' 
                : language === 'es' ? '150+ Nombres Únicos para Perros en 2025' : '150+ Unique Dog Names for 2025',
            excerpt: language === 'fr'
                ? 'Trouver le nom parfait pour votre nouveau toutou est une aventure ! Voici nos conseils.'
                : language === 'es' ? '¡Felicidades por tu nuevo amigo peludo! Ahora viene la parte más emocionante.' : 'Finding the perfect name for your companion...',
            content: language === 'fr'
                ? "Vous venez d'accueillir un nouveau toutou ? Félicitations ! Maintenant vient l'une des étapes les plus chouettes : lui trouver un petit nom.\n\n**Noms Originaux**\n• Trèfle (Clover)\n• Genièvre (Juniper)\n• Orion\n• Stellan\n\nL'appli Name My Pet est là pour vous aider avec son IA qui analyse le caractère de votre animal pour vous proposer LA perle rare."
                : language === 'es' 
                    ? "¡Felicidades por tu nuevo amigo peludo! Elegir un nombre único para tu perro es una excelente manera de celebrar su individualidad.\n\n**Nombres Recomendados**\n• Trébol (Clover)\n• Caspio\n• Orión\n\nUsa nuestra IA para encontrar el nombre que mejor se adapte a su personalidad." 
                    : "Choosing a unique name for your dog is a great way to celebrate their individuality. Use our AI tools to match their vibe.",
            pet: 'dog',
            date: language === 'fr' ? '1er Jan 2026' : language === 'es' ? '1 Ene 2026' : 'Jan 1, 2026'
        },
        {
            id: '2',
            title: language === 'fr' 
                ? 'La Magie des Noms de Chats : Tendances 2025' 
                : language === 'es' ? 'Magia para Nombres de Gatos: Tendencias 2025' : 'Cat Naming Magic: 2025 Trends',
            excerpt: language === 'fr'
                ? 'Les minous méritent des noms mystérieux. Découvrez les dernières tendances pour chats.'
                : language === 'es' ? 'Los michis merecen nombres misteriosos. Descubre lo que es tendencia.' : 'Discover the most mysterious and fun names for your feline friends.',
            content: language === 'fr'
                ? "Le chat est un animal élégant et parfois... complètement loufoque ! En 2025, on adore appeler nos chats comme nos grands-parents : Albert, Ginette, ou Marcel.\n\nUtilisez l'IA de Name My Pet pour tester des idées basées sur sa personnalité (Joueur, Calme, ou Espiègle) !"
                : language === 'es'
                    ? "En 2025, los nombres de 'michis' están evolucionando. Los nombres de comida como 'Mochi' o 'Taco' son tendencia absoluta.\n\nRecuerda que un gato suele responder mejor a nombres cortos. Usa nuestro generador para encontrar el match perfecto."
                    : "Cats respond best to shorter names with high-pitched endings. Try our AI tool to match a name to your cat's specific attitude!",
            pet: 'cat',
            date: language === 'fr' ? '15 Fév 2026' : language === 'es' ? '15 Feb 2026' : 'Feb 15, 2026'
        }
    ];

    if (selectedPost) {
        return (
            <div className="min-h-screen p-4 flex flex-col items-center">
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
        <div className="min-h-screen p-4 flex flex-col items-center">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
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