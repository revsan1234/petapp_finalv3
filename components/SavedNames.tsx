
import React, { useState, useRef, MouseEvent } from 'react';
import type { GeneratedName, PetGender } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ShareableListCard } from './ui/ShareableListCard';
import { toBlob } from 'html-to-image';
import { useLanguage } from '../contexts/LanguageContext';

const poppinsFontEmbedCss = `
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
}
`;

interface SavedNamesProps {
    savedNames: GeneratedName[];
    removeSavedName: (nameId: string) => void;
    petGender: PetGender;
}

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
);
const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 2.25 2.25 0 0 0-3.933 2.186Z" /></svg>
);
const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
);
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
);
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
);

export const SavedNames: React.FC<SavedNamesProps> = ({ savedNames, removeSavedName, petGender }) => {
    const { t } = useLanguage();
    const [isCopied, setIsCopied] = useState(false);
    const [showImageCreator, setShowImageCreator] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // Zoom and position state for the image creator
    const [imageZoom, setImageZoom] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const cardRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCopyList = () => {
        const text = savedNames.map(n => `${n.name} - ${n.meaning}`).join('\n');
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                // Reset zoom/pan
                setImageZoom(1);
                setImagePosition({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    };

    const getSnapshotOptions = () => {
        let bgColor = '#e889b5';
        if (petGender === 'Male') bgColor = '#aab2a1';
        else if (petGender === 'Any') bgColor = '#d4c4e0';

        return {
            quality: 0.95,
            width: 400,
            height: 650, 
            pixelRatio: 2,
            fontEmbedCSS: poppinsFontEmbedCss,
            backgroundColor: bgColor,
        };
    };

    const handleDownloadImage = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        setActionError(null);
        try {
             // Delay slightly to let UI settle
             await new Promise(resolve => setTimeout(resolve, 50));
             const options = getSnapshotOptions();

             const blob = await toBlob(cardRef.current, options);
             if (!blob) throw new Error("Failed to generate image blob");

             const url = URL.createObjectURL(blob);
             const link = document.createElement('a');
             link.href = url;
             link.download = 'my-pet-names.jpg';
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
             URL.revokeObjectURL(url);
             
        } catch (error) {
            console.error(error);
            setActionError("Failed to download image.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        if (!cardRef.current) return;
        setIsSharing(true);
        setActionError(null);

        if (!navigator.share) {
             setActionError(t.errors.no_share);
             setIsSharing(false);
             return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 50));
            const options = getSnapshotOptions();
            const blob = await toBlob(cardRef.current, { ...options, type: 'image/jpeg' });
            
            if (blob) {
                const file = new File([blob], 'my-pet-names.jpg', { type: 'image/jpeg' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: t.share_texts.card_title,
                        text: t.share_texts.card_body,
                    });
                } else {
                    setActionError(t.errors.no_share);
                }
            }
        } catch (error) {
            console.error(error);
            setActionError("Sharing failed. Try downloading.");
        } finally {
            setIsSharing(false);
        }
    };

    // Image Manipulation Handlers
    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            e.preventDefault();
            setImagePosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };


    return (
        <Card>
            <div className="flex justify-center items-center gap-4 mb-6 relative">
                <h3 className="text-3xl md:text-4xl font-bold text-center">{t.saved_names.title}</h3>
                <span className="bg-[#AA336A] text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                    {savedNames.length}
                </span>
            </div>

            {savedNames.length === 0 ? (
                <div className="text-center py-8 opacity-60">
                    <p className="text-xl font-medium">{t.saved_names.empty_title}</p>
                    <p>{t.saved_names.empty_desc}</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {savedNames.map(name => (
                            <div key={name.id} className="bg-white/10 p-3 rounded-lg flex justify-between items-center group hover:bg-white/20 transition-colors">
                                <div>
                                    <p className="font-bold text-lg">{name.name}</p>
                                    <p className="text-xs opacity-70">{name.meaning}</p>
                                </div>
                                <button 
                                    onClick={() => removeSavedName(name.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100/50 rounded-full transition-all opacity-70 group-hover:opacity-100"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-white/10">
                         <Button onClick={handleCopyList} variant="secondary">
                            {isCopied ? t.saved_names.btn_copied : t.saved_names.btn_copy}
                        </Button>
                        <Button onClick={() => setShowImageCreator(true)} variant="primary" className="btn-surprise">
                             <ImageIcon className="w-5 h-5 mr-1" />
                             {t.saved_names.btn_create_card}
                        </Button>
                    </div>
                </>
            )}

            {showImageCreator && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-[#f0f0f0] rounded-2xl max-w-4xl w-full p-4 md:p-6 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-[#666666]">{t.saved_names.shareable_title}</h3>
                            <button onClick={() => setShowImageCreator(false)} className="text-[#666666] hover:text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             {/* Controls */}
                             <div className="space-y-6 order-2 lg:order-1">
                                <div>
                                    <h4 className="font-bold text-[#666666] mb-2">{t.saved_names.card_step1}</h4>
                                    <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full">
                                        <UploadIcon className="w-5 h-5 mr-2" />
                                        {imagePreview ? t.saved_names.btn_change_photo : t.saved_names.btn_upload_photo}
                                    </Button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                </div>

                                {imagePreview && (
                                    <div className="bg-white/50 p-4 rounded-xl">
                                        <label className="block text-sm font-bold text-[#666666] mb-2">{t.saved_names.zoom_label}</label>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="3"
                                            step="0.1"
                                            value={imageZoom}
                                            onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                                            className="w-full accent-[#AA336A]"
                                        />
                                        <p className="text-xs text-[#666666] mt-1">{t.saved_names.zoom_hint_drag}</p>
                                    </div>
                                )}
                                
                                <div className="pt-4 border-t border-[#666666]/10">
                                    <h4 className="font-bold text-[#666666] mb-2">{t.saved_names.card_step2}</h4>
                                    <div className="flex flex-col gap-3">
                                        <Button onClick={handleDownloadImage} disabled={isDownloading} variant="secondary">
                                            <DownloadIcon className="w-5 h-5 mr-2" />
                                            {isDownloading ? t.saved_names.btn_saving : t.saved_names.btn_download}
                                        </Button>
                                        <Button onClick={handleShare} disabled={isSharing} variant="primary">
                                            <ShareIcon className="w-5 h-5 mr-2" />
                                            {isSharing ? t.saved_names.btn_preparing : t.saved_names.btn_share_card}
                                        </Button>
                                    </div>
                                    {actionError && <p className="text-red-500 text-sm mt-2 text-center">{actionError}</p>}
                                </div>
                             </div>

                             {/* Preview */}
                             <div className="flex flex-col items-center justify-center bg-[#e0e0e0] rounded-xl p-4 order-1 lg:order-2 overflow-hidden">
                                <div 
                                    className="cursor-grab active:cursor-grabbing transform scale-75 sm:scale-90 md:scale-100 origin-top"
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUpOrLeave}
                                    onMouseLeave={handleMouseUpOrLeave}
                                >
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
