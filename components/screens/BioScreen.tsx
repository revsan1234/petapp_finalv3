
import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Header } from '../Header';
import type { PetPersonality, PetInfo, PetGender, PetType, PetKind } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { toPng } from 'html-to-image';
import { Card } from '../ui/Card';
import { Button, BackToHomeButton } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { BioCard } from '../ui/BioCard';
import { generatePetBio } from '../../services/geminiService';
import { PET_PERSONALITIES, PET_GENDERS, PET_TYPES } from '../../constants';

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

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 a2.25 2.25 0 0 0-3.933 2.186Z" />
    </svg>
);

const BioGeneratorInternal: React.FC<{ 
    petInfo: PetInfo; 
    imageForBio: string | null; 
    setImageForBio: (img: string | null) => void;
}> = ({ petInfo, imageForBio, setImageForBio }) => {
    const { t, language } = useLanguage();
    const [petName, setPetName] = useState('');
    const [personality, setPersonality] = useState<PetPersonality>(petInfo.personality);
    const [gender, setGender] = useState<PetGender>(petInfo.gender);
    const [petType, setPetType] = useState<PetType>(petInfo.type);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedBio, setSelectedBio] = useState<string>('');
    const [customBio, setCustomBio] = useState('');
    const [generatedBios, setGeneratedBios] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [genError, setGenError] = useState<string | null>(null);
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
        if (!petName.trim()) {
            setGenError("Please enter a name first!");
            return;
        }
        setGenError(null);
        setIsLoading(true);
        try {
            const bios = await generatePetBio(petName, petType, personality, language);
            setGeneratedBios(bios); 
            if (bios.length > 0) setSelectedBio(bios[0]);
        } catch (err: any) { 
            console.error(err); 
            setGenError(err.message || "Failed to generate bio. Please try again.");
        } finally { setIsLoading(false); }
    };

    const handleDownload = async () => {
        if (!bioCardRef.current || isDownloading) return;
        setIsDownloading(true);
        try {
            const node = bioCardRef.current;
            const dataUrl = await toPng(node, { 
                pixelRatio: 2, 
                cacheBust: true,
                fontEmbedCSS: FONT_EMBED_CSS,
                backgroundColor: gender === 'Male' ? '#aab2a1' : gender === 'Any' ? '#d4c4e0' : '#e889b5',
                filter: (el: any) => !['LINK', 'SCRIPT', 'STYLE'].includes(el.tagName?.toUpperCase() || '')
            });
            const link = document.createElement('a'); 
            link.href = dataUrl; 
            link.download = `${petName || 'MyPet'}_Bio.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error: any) { 
            console.error("Export Error:", error);
            alert("Download failed. Try a different browser.");
        } finally { setIsDownloading(false); }
    };

    const handleShare = async () => {
        if (!bioCardRef.current || isSharing) return;
        setIsSharing(true);
        try {
            const node = bioCardRef.current;
            const dataUrl = await toPng(node, { 
                pixelRatio: 2, 
                cacheBust: true,
                fontEmbedCSS: FONT_EMBED_CSS,
                backgroundColor: gender === 'Male' ? '#aab2a1' : gender === 'Any' ? '#d4c4e0' : '#e889b5',
            });
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], `${petName || 'MyPet'}_Bio.png`, { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: t.share_texts.bio_title,
                    text: t.share_texts.bio_body
                });
            } else {
                alert("Sharing images is not supported on this browser. Try 'Download' instead.");
            }
        } catch (error) {
            console.error("Share failed", error);
        } finally {
            setIsSharing(false);
        }
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsDragging(true); setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    };
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => { if (isDragging) setImagePosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
    const handleMouseUpOrLeave = () => setIsDragging(false);
    
    return (
        <div className="flex flex-col gap-10 items-center max-w-2xl mx-auto w-full pb-20">
            <div className="space-y-6 w-full">
                <Card>
                    <div className="space-y-4">
                        <Input id="name" label={t.bio.label_name} value={petName} onChange={e => setPetName(e.target.value)} placeholder={t.placeholders.pet_name} />
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
                        <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full">
                            <UploadIcon className="w-5 h-5 mr-2"/> {imagePreview ? t.bio.btn_change : t.bio.btn_upload}
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        <Button onClick={handleGenerateBio} disabled={isLoading || !petName.trim()} className="w-full"> 
                            {isLoading ? t.generator.btn_generating : t.bio.btn_generate} 
                        </Button>
                    </div>
                    {genError && <p className="mt-4 text-center text-red-500 font-bold bg-red-100 p-2 rounded-xl">{genError}</p>}
                </Card>

                {(generatedBios.length > 0 || customBio || selectedBio) && (
                    <div className="space-y-4 animate-fade-in">
                        <h4 className="font-bold text-center text-white uppercase tracking-widest text-sm opacity-60">{t.bio.pick_bio}</h4>
                        <div className="space-y-2">
                            {generatedBios.map((bio, i) => (
                                <button key={i} onClick={() => setSelectedBio(bio)} className={`w-full p-4 text-left rounded-[1.5rem] transition-all bg-white/20 border-2 ${selectedBio === bio ? 'border-[#AA336A] bg-white/40' : 'border-transparent'}`}> {bio} </button>
                            ))}
                            <button onClick={() => { setSelectedBio(customBio); }} className={`w-full p-4 text-left rounded-[1.5rem] transition-all bg-white/20 border-2 ${selectedBio === customBio && customBio !== '' ? 'border-[#AA336A] bg-white/40' : 'border-transparent'} font-bold`}> 
                                {t.bio.write_own} 
                            </button>
                            <textarea 
                                value={customBio} 
                                onChange={(e) => { setCustomBio(e.target.value); setSelectedBio(e.target.value); }} 
                                placeholder={t.bio.placeholder_own} 
                                className="w-full p-4 rounded-[1.5rem] bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#AA336A]"
                                rows={3}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6 flex flex-col items-center w-full">
                <div className="w-full border-t border-white/20 pt-8 flex justify-center">
                    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} className="origin-top transition-transform duration-300">
                        <BioCard ref={bioCardRef} imagePreview={imagePreview} petName={petName} bio={selectedBio} imageZoom={imageZoom} imagePosition={imagePosition} onImageMouseDown={handleMouseDown} isDragging={isDragging} gender={gender} defaultPetKind={petType.toLowerCase() as PetKind} />
                    </div>
                </div>
                <div className="w-full max-w-sm space-y-4">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-bold text-white">Photo Zoom</label>
                            <span className="text-white/60 font-mono text-xs">{imageZoom.toFixed(1)}x</span>
                        </div>
                        <input type="range" min="0.5" max="8" step="0.1" value={imageZoom} onChange={(e) => setImageZoom(Number(e.target.value))} className="w-full accent-[#AA336A]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handleDownload} disabled={isDownloading || !imagePreview} variant="secondary" className="w-full">
                            {isDownloading ? '...' : t.bio.btn_download}
                        </Button>
                        <Button onClick={handleShare} disabled={isSharing || !imagePreview} variant="primary" className="w-full btn-surprise">
                            <ShareIcon className="w-5 h-5 mr-2" />
                            {isSharing ? '...' : t.bio.btn_share}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BioScreen: React.FC<{ 
    petInfo: PetInfo; 
    imageForBio: string | null; 
    setImageForBio: (img: string | null) => void; 
    goHome: () => void; 
}> = ({ petInfo, imageForBio, setImageForBio, goHome }) => (
    <div className="relative min-h-screen">
        <Header leftPet="bird" rightPet="cat" onLogoClick={goHome} />
        <main className="py-4 px-4 max-w-7xl mx-auto">
            <div className="-mt-4 mb-8"><BackToHomeButton onClick={goHome} /></div>
            <BioGeneratorInternal petInfo={petInfo} imageForBio={imageForBio} setImageForBio={setImageForBio} />
        </main>
    </div>
);

