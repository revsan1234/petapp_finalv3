import React, { useState, useRef, MouseEvent } from 'react';
import { Header } from './Header';
import { NameGenerator } from './NameGenerator';
import type { GeneratedName, PetInfo, PetGender } from '../types';
import { NameOfTheDay } from './NameOfTheDay';
import { NameMeaningFinder } from './NameMeaningFinder';
import { TrendingTicker } from './TrendingTicker';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ShareableListCard } from './ui/ShareableListCard';
import { toPng } from 'html-to-image';

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

const SavedNamesInternal: React.FC<{ 
    savedNames: GeneratedName[]; 
    removeSavedName: (id: string) => void; 
    petGender: PetGender;
}> = ({ savedNames, removeSavedName, petGender }) => {
    const { t } = useLanguage();
    const [showImageCreator, setShowImageCreator] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [imageZoom, setImageZoom] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
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
             // FIXED: Filter out problematic CSS tags that cause security blockages
             const filter = (node: any) => {
                 if (node.tagName === 'LINK' || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return false;
                 return true;
             };

             const dataUrl = await toPng(cardRef.current, { 
                pixelRatio: 3, 
                cacheBust: true,
                fontEmbedCSS: FONT_EMBED_CSS,
                filter: filter
             });
             const link = document.createElement('a');
             link.href = dataUrl;
             link.download = 'MyPetPicks.png';
             link.click();
        } catch (error: any) { 
            console.error(error); 
        } finally { setIsDownloading(false); }
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
                <h3 className="text-3xl font-bold">{t.saved_names.title}</h3>
                <span className="bg-[#AA336A] text-white text-sm font-bold px-3 py-1 rounded-full">{savedNames.length}</span>
            </div>

            {savedNames.length === 0 ? (
                <div className="text-center py-8 opacity-60">
                    <p className="text-xl font-medium">{t.saved_names.empty_title}</p>
                </div>
            ) : (
                <div className="space-y-3 mb-6">
                    {savedNames.map(name => (
                        <div key={name.id} className="bg-white/10 p-4 rounded-xl flex justify-between items-center border border-white/50">
                            <div><p className="font-bold text-xl">{name.name}</p><p className="text-sm opacity-80">{name.meaning}</p></div>
                            <button onClick={() => removeSavedName(name.id)} className="p-3 text-red-400 hover:text-red-600"><TrashIcon className="w-6 h-6" /></button>
                        </div>
                    ))}
                    <div className="flex justify-center pt-4">
                        <Button onClick={() => setShowImageCreator(true)} variant="primary" className="btn-surprise">{t.saved_names.btn_create_card}</Button>
                    </div>
                </div>
            )}

            {showImageCreator && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[var(--card-bg)] rounded-2xl max-w-4xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setShowImageCreator(false)} className="absolute top-4 right-4 text-2xl bg-white/20 p-2 rounded-full hover:bg-white/40">✕</button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold">{t.saved_names.card_step1}</h3>
                                <Button onClick={() => fileInputRef.current?.click()} variant="secondary">{imagePreview ? t.saved_names.btn_change_photo : t.saved_names.btn_upload_photo}</Button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                {imagePreview && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="font-bold">{t.saved_names.zoom_label}</label>
                                            <span className="opacity-50 text-xs font-mono">{imageZoom.toFixed(1)}x</span>
                                        </div>
                                        <input type="range" min="0.5" max="5" step="0.1" value={imageZoom} onChange={(e) => setImageZoom(parseFloat(e.target.value))} className="w-full accent-[#AA336A]" />
                                        <p className="text-xs opacity-60">{t.saved_names.zoom_hint_drag}</p>
                                    </div>
                                )}
                                <Button onClick={handleDownloadImage} disabled={isDownloading || !imagePreview}>{isDownloading ? t.saved_names.btn_saving : t.saved_names.btn_download}</Button>
                            </div>
                            <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} className="flex justify-center">
                                <div className="transform scale-[0.7] origin-top">
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
                    className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm w-fit shadow-sm hover:bg-white/30 active:scale-95"
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