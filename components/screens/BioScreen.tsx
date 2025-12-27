import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Header } from '../Header';
import type { PetPersonality, PetKind, PetInfo, PetGender, PetType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { BackToHomeButton } from '../../App';
import { toPng } from 'html-to-image';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { BioCard } from '../ui/BioCard';
import { generatePetBio } from '../../services/geminiService';
import { PET_PERSONALITIES, PET_GENDERS, PET_TYPES } from '../../constants';

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const BioGeneratorInternal: React.FC<{ petInfo: PetInfo; imageForBio: string | null; setImageForBio: (img: string | null) => void; }> = ({ petInfo, imageForBio, setImageForBio }) => {
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
        if (!bioCardRef.current) return;
        setIsDownloading(true);
        try {
            const dataUrl = await toPng(bioCardRef.current, { pixelRatio: 3, cacheBust: true });
            const link = document.createElement('a'); 
            link.href = dataUrl; link.download = `${petName || 'MyPet'}_Bio.png`;
            link.click();
        } catch (error) { console.error(error); } finally { setIsDownloading(false); }
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsDragging(true); setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    };
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => { if (isDragging) setImagePosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
    const handleMouseUpOrLeave = () => setIsDragging(false);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <Card>
                    <div className="space-y-4">
                        <Input id="name" label={t.bio.label_name} value={petName} onChange={e => setPetName(e.target.value)} />
                        <Select id="type" label={t.generator.label_type} value={petType} onChange={e => setPetType(e.target.value as PetType)}>
                            {PET_TYPES.map(type => <option key={type} value={type}>{t.options.types[type] || type}</option>)}
                        </Select>
                        <Select id="gender" label={t.bio.label_gender} value={gender} onChange={e => setGender(e.target.value as PetGender)}>
                            {PET_GENDERS.map(g => <option key={g} value={g}>{t.options.genders[g] || g}</option>)}
                        </Select>
                    </div>
                </Card>
                <Card>
                    <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full">
                        <UploadIcon className="w-5 h-5 mr-2"/> {imagePreview ? t.bio.btn_change : t.bio.btn_upload}
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Button onClick={handleGenerateBio} disabled={isLoading || !petName} className="mt-4 w-full"> 
                        {isLoading ? t.generator.btn_generating : t.bio.btn_generate} 
                    </Button>
                </Card>
                {generatedBios.length > 0 && (
                    <div className="space-y-2">
                        {generatedBios.map((bio, i) => (
                            <button key={i} onClick={() => setSelectedBio(bio)} className={`w-full p-4 text-left rounded-[1.5rem] transition-all bg-white/20 border-2 ${selectedBio === bio ? 'border-[#AA336A] bg-white/40' : 'border-transparent'}`}> {bio} </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="space-y-4 flex flex-col items-center">
                <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} className="transform scale-[0.8] origin-top">
                    <BioCard ref={bioCardRef} imagePreview={imagePreview} petName={petName} bio={selectedBio} imageZoom={imageZoom} imagePosition={imagePosition} onImageMouseDown={handleMouseDown} isDragging={isDragging} gender={gender} />
                </div>
                <div className="w-full max-w-sm space-y-4">
                    <input type="range" min="1" max="3" step="0.1" value={imageZoom} onChange={(e) => setImageZoom(Number(e.target.value))} className="w-full" />
                    <Button onClick={handleDownload} disabled={isDownloading || !imagePreview} className="w-full">{isDownloading ? '...' : t.bio.btn_download}</Button>
                </div>
            </div>
        </div>
    );
};

export const BioScreen: React.FC<{ petInfo: PetInfo; imageForBio: string | null; setImageForBio: (img: string | null) => void; goHome: () => void; }> = ({ petInfo, imageForBio, setImageForBio, goHome }) => (
    <div className="relative min-h-screen">
        <Header leftPet="bird" rightPet="fish" onLogoClick={goHome} />
        <main className="py-4 px-4 max-w-7xl mx-auto">
            <div className="-mt-4 mb-8"><BackToHomeButton onClick={goHome} /></div>
            <BioGeneratorInternal petInfo={petInfo} imageForBio={imageForBio} setImageForBio={setImageForBio} />
        </main>
    </div>
);