
import React from 'react';
import { Button } from './ui/Button';
import { PetCharacter } from './assets/pets/PetCharacter';
import { Header } from './Header';
import { useLanguage } from '../contexts/LanguageContext';

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const DogMascot = () => <PetCharacter pet="dog" className="w-32 h-32 drop-shadow-md" />;
const CatMascot = () => <PetCharacter pet="cat" className="w-32 h-32 drop-shadow-md" />;
const RabbitMascot = () => <PetCharacter pet="rabbit" className="w-32 h-32 drop-shadow-md" />;
const HamsterMascot = () => <PetCharacter pet="hamster" className="w-32 h-32 drop-shadow-md" />;
const BirdMascot = () => <PetCharacter pet="bird" className="w-32 h-32 drop-shadow-md" />;

interface PartnershipsProps {
    goHome: () => void;
}

const AmazonProductCard: React.FC<{ title: string, link: string, description: string, Illustration: React.FC, buttonText: string }> = ({ title, link, description, Illustration, buttonText }) => (
    <div className="bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-md rounded-2xl p-6 text-center flex flex-col h-full text-[#666666] border border-white/50 transition-all hover:scale-105 hover:shadow-xl shadow-md relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#AA336A]/30"></div>
        
        <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
            <Illustration />
        </div>

        <h3 className="text-3xl font-black mb-3 flex-grow text-[#5F6F5F]" style={{ lineHeight: '1.2' }}>
            {title}
        </h3>
        <div className="my-2 text-lg leading-relaxed opacity-100 text-left flex-grow font-bold text-[#AA336A]">
            <p>{description}</p>
        </div>
        <div className="mt-auto pt-4">
            <Button
                href={link}
                target="_blank"
                rel="nofollow sponsored noopener"
                variant="primary"
                className="!py-2 !px-6 !text-sm w-full shadow-lg"
            >
                {buttonText}
            </Button>
        </div>
    </div>
);

export const Partnerships: React.FC<PartnershipsProps> = ({ goHome }) => {
    const { t } = useLanguage();

    const productSections = [
        {
            title: t.shop.puppy_kit,
            products: [
                {
                    title: t.shop.product_titles.id_tags,
                    link: "https://www.amazon.com/Providence-Engraving-Shapes-Colors-Sizes/dp/B084HMMQ8M?tag=namemypet-20",
                    description: t.shop.product_desc.tags,
                    Illustration: DogMascot
                },
                {
                    title: t.shop.product_titles.dog_collar,
                    link: "https://www.amazon.com/dp/B0814Q7R9X?tag=namemypet-20",
                    description: t.shop.product_desc.collar,
                    Illustration: DogMascot
                },
                {
                    title: t.shop.product_titles.glitter_tags,
                    link: "https://amzn.to/48SAS6X",
                    description: t.shop.product_desc.tags, 
                    Illustration: DogMascot
                }
            ]
        },
        {
            title: t.shop.kitten_pack,
            products: [
                {
                    title: t.shop.product_titles.pet_bowls,
                    link: "https://www.amazon.com/Personalized-Stainless-Non-Slip-Rubber-Custom/dp/B09GKYMXRB?tag=namemypet-20",
                    description: t.shop.product_desc.bowls,
                    Illustration: CatMascot
                },
                {
                    title: t.shop.product_titles.pet_blanket,
                    link: "https://www.amazon.com/Personalized-Blanket-Custom-Lovers-Flannel/dp/B0DVH79KCR?tag=namemypet-20",
                    description: t.shop.product_desc.blanket,
                    Illustration: CatMascot
                },
                {
                    title: t.shop.product_titles.cat_collars,
                    link: "https://amzn.to/4aJ8iY4",
                    description: t.shop.product_desc.collar,
                    Illustration: CatMascot
                }
            ]
        },
        {
            title: t.shop.more_goodies,
            products: [
                {
                    title: t.shop.product_titles.airtag_holder,
                    link: "https://www.amazon.com/dp/B0B6DFYTW2/?tag=namemypet-20",
                    description: t.shop.product_desc.airtag,
                    Illustration: RabbitMascot
                },
                {
                    title: t.shop.product_titles.bone_tags,
                    link: "https://amzn.to/3YrsrdM",
                    description: t.shop.product_desc.tags,
                    Illustration: BirdMascot
                },
                {
                    title: t.shop.product_titles.pet_leash,
                    link: "https://amzn.to/3MEmmbh",
                    description: t.shop.product_desc.leash,
                    Illustration: HamsterMascot
                }
            ]
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="relative z-10">
                <Header leftPet="bird" rightPet="hamster" onLogoClick={goHome} />
                <main className="py-4 md:py-8 px-4 sm:px-6 md:px-8 pb-24">
                    {/* Back Button */}
                    <div className="container mx-auto max-w-6xl mb-4 -mt-2">
                        <button 
                            onClick={goHome} 
                            className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30"
                        >
                            <BackIcon className="w-4 h-4" />
                            {t.shop.back}
                        </button>
                    </div>

                    <div className="container mx-auto flex flex-col items-center justify-center mb-12">
                        <p className="text-white/90 text-2xl mt-2 font-medium drop-shadow-sm">{t.shop.subtitle}</p>
                    </div>

                    <div className="container mx-auto space-y-16 max-w-6xl">
                        {productSections.map(section => (
                            <section key={section.title}>
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-[#AA336A] bg-white/80 px-8 py-3 rounded-full backdrop-blur-md shadow-lg border border-white/50">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                   {section.products.map((product, index) => (
                                       <div key={index} className="flex flex-col h-full">
                                           <AmazonProductCard 
                                             title={product.title}
                                             link={product.link}
                                             description={product.description}
                                             Illustration={product.Illustration}
                                             buttonText={t.shop.shop_amazon}
                                           />
                                       </div>
                                   ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};
