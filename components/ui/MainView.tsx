import React, { useState, useRef, MouseEvent } from 'react';
import { Header } from '../Header';
import { NameGenerator } from '../NameGenerator';
import type { GeneratedName, PetInfo, PetGender } from '../../types';
import { NameOfTheDay } from '../NameOfTheDay';
import { NameMeaningFinder } from '../NameMeaningFinder';
import { TrendingTicker } from '../TrendingTicker';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from './Card';
import { Button } from './Button';
import { ShareableListCard } from './ShareableListCard';
import { toPng } from 'html-to-image';
import { PetCharacter } from '../assets/pets/PetCharacter';

const FONT_EMBED_CSS = `
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

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
);

const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186a2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 a2.25 2.25 0 0 0-3.933 2.186Z" /></svg>
);

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
);

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);

const SavedNamesInternal: React.FC<{ 
    savedNames: GeneratedName[]; 
    removeSavedName: (id: string) => void; 
    petGender: PetGender;
}> = ({ savedNames, removeSavedName, petGender }) => {
    const { t } = useLanguage();
    const [showImageCreator, setShowImageCreator] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [imageZoom, setImageZoom] = useState(1);
    const [imagePosition, setImagePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const cardRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setImagePreview(reader.result as string); setImageZoom(1); setImagePosition({ x: 0, y: 0 }); };
            reader.readAsDataURL(file);
        }
    };

    const handleDownloadImage = async () => {
        if (!cardRef.current || isDownloading) return;
        setIsDownloading(true);
        try {
             await new Promise(r => setTimeout(r, 100));
             const dataUrl = await toPng(cardRef.current, { 
                pixelRatio: 2, 
                cacheBust: true,
                fontEmbedCSS: FONT_EMBED_CSS
             });
             const link = document.createElement('a');
             link.href = dataUrl;
             link.download = 'MyPetPicks.png';
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
        } catch (error: any) { 
            console.error(error); 
            alert("Sorry, capture failed. Please try again or take a screenshot.");
        } finally { setIsDownloading(false); }
    };

    const handleShare = async () => {
        if (!cardRef.current || isSharing) return;
        setIsSharing(true);
        try {
            const dataUrl = await toPng(cardRef.current, { 
                pixelRatio: 2, 
                cacheBust: true, 
                fontEmbedCSS: FONT_EMBED_CSS 
            });
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], 'HelpMePick.png', { type: 'image/png' });
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: t.share_texts.card_title,
                    text: t.share_texts.card_body
                });
            } else {
                alert("Sharing is not supported on this browser.");
            }
        } catch (error) {
            console.error("Share failed", error);
        } finally {
            setIsSharing(false);
        }
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsDragging(true);
        setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    };
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (isDragging) setImagePosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };
    const handleMouseUpOrLeave = () => setIsDragging(false);

    return (
        <Card>
            <div className="flex justify-center items-center gap-4 mb-6">
                <h3 className="text-3xl font-bold uppercase tracking-tight text-[var(--text-main)]">{t.saved_names.title}</h3>
                <span className="bg-[#AA336A] text-white text-lg font-bold px-4 py-1 rounded-full shadow-md">{savedNames.length}</span>
            </div>

            {savedNames.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                    <PetCharacter pet="dog" className="w-24 h-24 mx-auto mb-4 opacity-20" />
                    <p className="text-xl font-bold uppercase tracking-widest">{t.saved_names.empty_title}</p>
                    <p className="text-sm font-semibold mt-2">{t.saved_names.empty_desc}</p>
                </div>
            ) : (
                <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {savedNames.map(name => (
                            <div key={name.id} className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl flex justify-between items-center border border-white/80 shadow-sm group hover:scale-[1.02] transition-all">
                                <div>
                                    <p className="font-bold text-xl text-[#333]">{name.name}</p>
                                    <p className="text-[10px] font-bold text-[#333]/60 uppercase tracking-widest">{name.meaning}</p>
                                </div>
                                <button onClick={() => removeSavedName(name.id)} className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors">
                                    <TrashIcon className="w-6 h-6" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center pt-6">
                        <Button 
                            onClick={() => setShowImageCreator(true)} 
                            variant="primary" 
                            className="btn-surprise !py-5 !px-10 !text-xl shadow-2xl font-bold uppercase tracking-wider"
                        >
                            {t.saved_names.btn_create_card}
                        </Button>
                    </div>
                </div>
            )}

            {showImageCreator && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 animate-fade-in">
                    <div className="bg-[var(--card-bg)] rounded-[3rem] max-w-5xl w-full p-8 sm:p-12 relative overflow-y-auto max-h-[95vh] shadow-2xl border-4 border-white/20">
                        <button onClick={() => setShowImageCreator(false)} className="absolute top-6 right-6 text-2xl bg-white/40 p-4 rounded-full hover:bg-white/60 hover:rotate-90 transition-all active:scale-90 z-[110] shadow-lg">✕</button>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-3xl font-bold uppercase tracking-tight text-[#AA336A] mb-2">{t.saved_names.card_step1}</h3>
                                    <p className="text-lg font-semibold opacity-60">Upload a photo to create your shareable voting card.</p>
                                </div>

                                <div className="space-y-4">
                                    <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full !py-6 !text-xl shadow-xl bg-white/60 hover:bg-white/80 border-2 border-white/40">
                                        <UploadIcon className="w-6 h-6 mr-2 inline" />
                                        {imagePreview ? t.saved_names.btn_change_photo : t.saved_names.btn_upload_photo}
                                    </Button>
                                    <div className="flex items-start gap-3 bg-black/5 p-4 rounded-[1.5rem] border border-black/5">
                                        <CameraIcon className="w-5 h-5 text-black/40 shrink-0 mt-0.5" />
                                        <p className="text-xs font-bold text-black/40 italic leading-snug uppercase tracking-wider">
                                            {t.common.camera_permission_notice}
                                        </p>
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                
                                {imagePreview && (
                                    <div className="p-6 bg-white/20 rounded-[2rem] border-2 border-white/30 shadow-inner space-y-4">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="font-bold uppercase tracking-widest text-xs opacity-60">{t.saved_names.zoom_label}</label>
                                            <span className="text-xs font-mono font-bold bg-[#AA336A]/10 text-[#AA336A] px-2 py-1 rounded-full">{imageZoom.toFixed(1)}x</span>
                                        </div>
                                        <input type="range" min="0.5" max="5" step="0.1" value={imageZoom} onChange={(e) => setImageZoom(parseFloat(e.target.value))} className="w-full h-3 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#AA336A]" />
                                        <p className="text-xs font-bold opacity-40 text-center uppercase tracking-widest">{t.saved_names.zoom_hint_drag}</p>
                                    </div>
                                )}
                                
                                <div className="space-y-4 pt-8 border-t border-black/5">
                                     <h3 className="text-xl font-bold uppercase tracking-widest text-[#AA336A]/60 text-center mb-6">Step 2: Export & Share</h3>
                                     <div className="flex flex-col gap-4">
                                        <Button 
                                            onClick={handleDownloadImage} 
                                            disabled={isDownloading || !imagePreview} 
                                            variant="secondary" 
                                            className="w-full !py-6 !text-xl shadow-lg font-bold uppercase tracking-widest bg-[#aab2a1] hover:bg-[#8da38d]"
                                        >
                                            <DownloadIcon className="w-7 h-7 mr-3 inline" />
                                            {isDownloading ? t.saved_names.btn_saving : t.saved_names.btn_download}
                                        </Button>
                                        <Button 
                                            onClick={handleShare} 
                                            disabled={isSharing || !imagePreview} 
                                            variant="primary" 
                                            className="w-full !py-6 !text-xl shadow-2xl font-bold uppercase tracking-widest btn-surprise"
                                        >
                                            <ShareIcon className="w-7 h-7 mr-3 inline" />
                                            {isSharing ? t.saved_names.btn_preparing : t.saved_names.btn_share_card}
                                        </Button>
                                     </div>
                                </div>
                            </div>

                            <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} className="flex flex-col items-center gap-4">
                                <span className="text-xs font-bold opacity-30 uppercase tracking-[0.3em]">Design Preview</span>
                                <div className="transform scale-[0.8] sm:scale-100 origin-top shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:rotate-1">
                                    <ShareableListCard
                                        ref={cardRef}
                                        names={savedNames.map(n => n.name).slice(0, 10)}
                                        imagePreview={imagePreview}
                                        gender={petGender}
                                        imageZoom={imageZoom}
                                        imagePosition={imagePosition}
                                        onImageMouseDown={handleMouseDown}
                                        isDragging={isDragging}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

interface MainViewProps {
    savedNames: GeneratedName[];
    addSavedName: (name: GeneratedName) => void;
    removeSavedName: (nameId: string) => void;
    petInfo: PetInfo;
    setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
    goHome?: () => void; 
}

export const MainView: React.FC<MainViewProps> = ({ savedNames, addSavedName, removeSavedName, petInfo, setPetInfo, goHome }) => {
  const { t } = useLanguage();

  return (
    <>
      <Header leftPet="dog" rightPet="cat" onLogoClick={goHome} />
      <main className="py-4 md:py-8 px-4">
        <div className="flex flex-col gap-8 w-full mx-auto max-w-7xl">
          {goHome && (
            <div className="-mt-4">
                <button 
                    onClick={goHome} 
                    className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-6 py-3 rounded-full backdrop-blur-md font-bold uppercase tracking-widest text-sm w-fit shadow-lg hover:bg-white/30 active:scale-95 border border-white/20"
                >
                    <BackIcon className="w-4 h-4" />
                    {t.common.back_home}
                </button>
            </div>
          )}

          <NameGenerator 
            addSavedName={addSavedName} 
            savedNames={savedNames} 
            petInfo={petInfo}
            setPetInfo={setPetInfo}
          />
          <SavedNamesInternal 
            savedNames={savedNames} 
            removeSavedName={removeSavedName} 
            petGender={petInfo.gender}
          />
          <TrendingTicker />
          <NameOfTheDay />
          <NameMeaningFinder />
        </div>
      </main>
    </>
  );
};
