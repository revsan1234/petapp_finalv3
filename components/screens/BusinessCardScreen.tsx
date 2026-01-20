
import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Button, BackToHomeButton } from '../ui/Button';
import { PetCharacter } from '../assets/pets/PetCharacter';
import { useLanguage } from '../../contexts/LanguageContext';
import type { PetKind } from '../../types';

const fontEmbedCss = `
@font-face {
  font-family: 'Fredoka';
  font-style: normal;
  font-weight: 300 700;
  src: url(https://fonts.gstatic.com/s/fredoka/v12/6N097E9Ax05WnLtmWTMAdU6p.woff2) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJbecmNE.woff2) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
}
`;

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const AppStoreBadge = ({ light = false }) => (
    <div className={`${light ? 'bg-white text-black border-black/10' : 'bg-black text-white border-white/20'} px-2 py-1 rounded-md flex items-center gap-1 border`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M18.71,19.5c-0.83,1.24-1.71,2.45-3.1,2.48c-1.37,0.03-1.81-0.79-3.38-0.79c-1.58,0-2.06,0.77-3.38,0.81 c-1.35,0.05-2.35-1.31-3.19-2.52C3.96,16.99,2.67,12,4.41,9c0.86-1.5,2.43-2.45,4.14-2.48c1.3-0.03,2.53,0.88,3.33,0.88 c0.8,0,2.27-1.1,3.82-0.94c0.65,0.03,2.47,0.26,3.64,1.98c-0.09,0.06-2.17,1.26-2.15,3.81c0.03,3.1,2.64,4.2,2.67,4.21 C19.86,16.46,19.54,18.25,18.71,19.5z M13,3.5c0.73-0.88,1.22-2.1,1.08-3.31c-1.04,0.04-2.3,0.69-3.05,1.57 c-0.67,0.79-1.25,2.02-1.11,3.21C11,5,12.25,4.38,13,3.5z" />
        </svg>
        <div className="flex flex-col">
            <span className="text-[4px] uppercase leading-none opacity-80">Download on the</span>
            <span className="text-[7px] font-bold leading-none">App Store</span>
        </div>
    </div>
);

const PlayStoreBadge = ({ light = false }) => (
    <div className={`${light ? 'bg-white text-black border-black/10' : 'bg-black text-white border-white/20'} px-2 py-1 rounded-md flex items-center gap-1 border`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M3.609 1.814L13.792 12l-10.183 10.186c-.161.161-.433.226-.645.107l-.022-.012c-.22-.123-.351-.35-.351-.595V2.32c0-.244.13-.472.351-.595l.022-.012c.212-.119.484-.054.645.107L3.609 1.814zM14.5 12.708l3.166 3.167L4.73 22.311c-.347.195-.783.195-1.13 0l10.9-9.603zM14.5 11.292l3.166-3.167L4.73 1.689c-.347-.195-.783-.195-1.13 0l10.9 9.603zM18.374 15.166l3.522-1.981c.36-.202.585-.575.585-.985s-.225-.783-.585-.985l-3.522-1.981L15.208 12l3.166 3.166z" />
        </svg>
        <div className="flex flex-col">
            <span className="text-[4px] uppercase leading-none opacity-80">Get it on</span>
            <span className="text-[7px] font-bold leading-none">Google Play</span>
        </div>
    </div>
);

export const BusinessCardScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const downloadCard = async (ref: React.RefObject<HTMLDivElement>, side: string) => {
        if (!ref.current) return;
        setIsLoading(true);
        try {
            const filter = (node: HTMLElement) => {
                const exclusionList = ['LINK', 'STYLE', 'SCRIPT'];
                if (exclusionList.includes(node.tagName)) return false;
                return true;
            };

            const dataUrl = await toPng(ref.current, {
                pixelRatio: 4, 
                quality: 1.0,
                cacheBust: true,
                fontEmbedCSS: fontEmbedCss,
                filter: filter,
                style: {
                    transform: 'none',
                    margin: '0',
                    left: '0',
                    top: '0'
                }
            });
            const link = document.createElement('a');
            link.download = `NameMyPet_BusinessCard_${side}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Download failed', err);
        } finally {
            setIsLoading(false);
        }
    };

    const cardFeatures: { desc: string; pet: PetKind }[] = [
        { desc: t.landing.feature1_desc, pet: 'dog' },
        { desc: t.landing.feature2_desc, pet: 'cat' },
        { desc: t.landing.feature3_desc, pet: 'hamster' },
        { desc: t.landing.feature4_desc, pet: 'bird' },
    ];

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <header className="flex items-center justify-start mb-8">
                    <BackToHomeButton onClick={onBack} />
                </header>

                <main className="text-center">
                    <div className="mb-12">
                        <h1 className="text-5xl font-black text-white drop-shadow-lg uppercase tracking-tight mb-4 font-heading">
                            {t.business_card.title}
                        </h1>
                        <p className="text-xl font-bold text-white/90 drop-shadow-md max-w-2xl mx-auto">
                            {t.business_card.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-32 items-start justify-items-center">
                        {/* FRONT PREVIEW */}
                        <div className="flex flex-col items-center gap-8">
                            <span className="text-white/70 font-bold uppercase tracking-widest text-sm">{t.business_card.front_label}</span>
                            <div className="transform scale-[1.1] sm:scale-[1.3] origin-top">
                                <div 
                                    ref={frontRef}
                                    className="w-[350px] h-[200px] bg-gradient-to-br from-[#aab2a1] to-[#e889b5] rounded-xl relative overflow-hidden shadow-2xl flex flex-col items-center p-4 border border-white/20"
                                >
                                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                                         style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }} 
                                    />
                                    
                                    {/* Raised character block */}
                                    <div className="mt-2 mb-auto flex items-center justify-center">
                                        <PetCharacter pet="cat" className="w-28 h-28 drop-shadow-2xl" />
                                    </div>

                                    {/* Raised text block with website at bottom */}
                                    <div className="flex flex-col items-center z-10 gap-1 mb-4">
                                        <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md font-heading leading-none">
                                            Name My Pet
                                        </h2>
                                        <div className="flex gap-2 scale-75 origin-center">
                                            <AppStoreBadge />
                                            <PlayStoreBadge />
                                        </div>
                                        <p className="text-[7px] font-black text-white uppercase tracking-[0.4em] opacity-80 mt-0.5">namemypet.org</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-20">
                                <Button 
                                    onClick={() => downloadCard(frontRef, 'Front')} 
                                    variant="secondary"
                                    disabled={isLoading}
                                    className="!py-3 !px-6"
                                >
                                    <DownloadIcon className="w-5 h-5 mr-2" />
                                    {t.business_card.download_front}
                                </Button>
                            </div>
                        </div>

                        {/* BACK PREVIEW */}
                        <div className="flex flex-col items-center gap-8">
                            <span className="text-white/70 font-bold uppercase tracking-widest text-sm">{t.business_card.back_label}</span>
                            <div className="transform scale-[1.1] sm:scale-[1.3] origin-top">
                                <div 
                                    ref={backRef}
                                    className="w-[350px] h-[200px] bg-[#fffdf2] rounded-xl relative overflow-hidden shadow-2xl flex flex-col items-center p-4 border border-black/5"
                                >
                                    {/* Clean beige back side as requested */}
                                    <div className="flex flex-col justify-center gap-3 w-full h-full relative z-10 px-3">
                                        {cardFeatures.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="bg-[#AA336A]/5 rounded-lg p-1 shrink-0 shadow-sm border border-[#AA336A]/10">
                                                    <PetCharacter pet={f.pet} className="w-7 h-7 drop-shadow-sm" />
                                                </div>
                                                <span className="text-[#AA336A] font-black text-[14px]">•</span>
                                                <p className="text-[10px] font-bold text-gray-700 leading-tight text-left pr-4 flex-grow">
                                                    {f.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-20">
                                <Button 
                                    onClick={() => downloadCard(backRef, 'Back')} 
                                    variant="secondary"
                                    disabled={isLoading}
                                    className="!py-3 !px-6"
                                >
                                    <DownloadIcon className="w-5 h-5 mr-2" />
                                    {t.business_card.download_back}
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
