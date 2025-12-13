
import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { toBlob, toJpeg } from 'html-to-image';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { BioCard } from './ui/BioCard';
import { generatePetBio } from '../services/geminiService';
import { PET_PERSONALITIES, PET_GENDERS, PET_TYPES } from '../constants';
import type { PetPersonality, PetKind, PetInfo, PetGender, PetType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// This string contains the CSS necessary to embed the Fredoka font.
const fontEmbedCss = `
@font-face {
  font-family: 'Fredoka';
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/fredoka/v9/X7nP4b87HvSqjb_WIi2yDCRwoQ_k7367_0-e1Q.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`;

// Icons
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 2.25 2.25 0 0 0-3.933 2.186Z" />
    </svg>
);

interface BioGeneratorProps {
    petInfo: PetInfo;
    imageForBio: string | null;
    setImageForBio: (image: string | null) => void;
}

export const BioGenerator: React.FC<BioGeneratorProps> = ({ petInfo, imageForBio, setImageForBio }) => {
    const { t, language } = useLanguage();
    const [petName, setPetName] = useState('');
    const [personality, setPersonality] = useState<PetPersonality>(petInfo.personality);
    const [gender, setGender] = useState<PetGender>(petInfo.gender);
    const [petType, setPetType] = useState<PetType>(petInfo.type);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedBio, setSelectedBio] = useState<string>('');
    const [customBio, setCustomBio] = useState('');
    const [bioMode, setBioMode] = useState<'ai' | 'custom'>('ai');
    const [generatedBios, setGeneratedBios] = useState<string[]>([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null); // Specific error for download/share
    
    // Image manipulation state
    const [imageZoom, setImageZoom] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bioCardRef = useRef<HTMLDivElement>(null);

    // Style object for inputs to use Fredoka font
    const inputStyle = { fontFamily: "'Fredoka', sans-serif", fontSize: "1.2rem" };

    useEffect(() => { 
        setPersonality(petInfo.personality);
        setGender(petInfo.gender);
        setPetType(petInfo.type);
    }, [petInfo]);

    useEffect(() => {
        if (imageForBio) {
            setImagePreview(imageForBio);
            // Reset image settings when a new image is passed from the photo tab
            setImageZoom(1);
            setImagePosition({ x: 0, y: 0 });
            // Clear the image from App state so it doesn't get set again on re-render
            setImageForBio(null); 
        }
    }, [imageForBio, setImageForBio]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                // Reset everything when a new photo is uploaded
                setGeneratedBios([]);
                setSelectedBio('');
                setCustomBio('');
                setBioMode('ai');
                setImageZoom(1);
                setImagePosition({ x: 0, y: 0 });
                setActionError(null);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerateBio = async () => {
        if (!petName) {
            setError('Please provide a name first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setBioMode('ai');
        try {
            const bios = await generatePetBio(petName, petType, personality, language);
            setGeneratedBios(bios);
            if (bios.length > 0) {
                setSelectedBio(bios[0]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getSnapshotOptions = () => {
        let bgColor = '#e889b5';
        if (gender === 'Male') bgColor = '#aab2a1';
        else if (gender === 'Any') bgColor = '#d4c4e0';

        return {
            quality: 0.95, 
            width: 480,
            height: 600,
            pixelRatio: 2,
            fontEmbedCSS: fontEmbedCss,
            backgroundColor: bgColor,
        };
    };

    const handleDownload = async () => {
        const elementToCapture = bioCardRef.current;
        if (!elementToCapture) {
            setActionError('Could not find the bio card element to download.');
            return;
        }
    
        setIsDownloading(true);
        setActionError(null);
    
        try {
            // Small delay to ensure any UI updates settle
            await new Promise(resolve => setTimeout(resolve, 100));
            const options = getSnapshotOptions();

            // Workaround for Safari/iOS: warm up the generator
            try { await toJpeg(elementToCapture, { ...options, quality: 0.01 }); } catch(e) {}
            await new Promise(resolve => setTimeout(resolve, 50));

            // Use toBlob instead of toJpeg for better large image handling
            const blob = await toBlob(elementToCapture, options);
            if (!blob) throw new Error("Failed to create image blob");

            const dataUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = dataUrl;
            const downloadName = petName.trim().replace(/\s+/g, '-').toLowerCase() || 'pet';
            link.download = `${downloadName}-bio-card.jpg`;
            
            // Critical fix: Append to body before clicking for broad browser support
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(dataUrl);
    
        } catch (error) {
            console.error('Download error:', error);
            setActionError('Failed to generate image. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        const elementToCapture = bioCardRef.current;
        if (!elementToCapture) {
             setActionError('Could not find the card to share.');
             return;
        }

        setIsSharing(true);
        setActionError(null);

        if (!navigator.share) {
             setActionError("Sharing is not supported on this browser. Please use 'Download Card' instead.");
             setIsSharing(false);
             return;
        }

        try {
            // Using toBlob directly avoids base64 intermediate string issues with large images
            await new Promise(resolve => setTimeout(resolve, 50));
            const options = getSnapshotOptions();

            // Warm up cache
            try { await toJpeg(elementToCapture, { ...options, quality: 0.01 }); } catch(e) {}
            
            const blob = await toBlob(elementToCapture, { ...options, type: 'image/jpeg' });

            if (blob) {
                const fileName = `${petName.trim().replace(/\s+/g, '-') || 'pet'}-bio.jpg`;
                const file = new File([blob], fileName, { type: 'image/jpeg' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `${petName}'s Bio Card`,
                        text: `Check out ${petName}'s new bio! Created with Name My Pet.`,
                    });
                } else {
                    setActionError("This browser doesn't support sharing images. Try 'Download Card'!");
                }
            } else {
                throw new Error("Could not create image file.");
            }
        } catch (err: any) {
             console.error('Share error:', err);
             if (err.name !== 'AbortError') {
                 if (err.message && err.message.includes("not supported")) {
                    setActionError("Sharing not supported here. Try 'Download Card'.");
                 } else {
                    setActionError('Could not share directly. Try downloading instead!');
                 }
             }
        } finally {
            setIsSharing(false);
        }
    };
    
    const handleCustomBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomBio(e.target.value);
        setSelectedBio(e.target.value);
    };

    // Image manipulation handlers
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
    const handleMouseUpOrLeave = () => { setIsDragging(false); };
    
    const isActionDisabled = isLoading || isDownloading || isSharing || !imagePreview || !petName || !selectedBio;

    // Helper for dynamic text classes
    const labelClass = "block text-center text-lg font-medium mb-1 font-['Fredoka'] opacity-90";

    return (
        <Card>
            <div className="flex flex-col gap-2 mb-6 text-center">
                <h2 className="text-3xl font-bold">{t.bio.title}</h2>
                <p className="opacity-80 text-xl">{t.bio.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    {/* Step 1 */}
                    <fieldset>
                        <legend className="font-bold text-xl mb-2 font-['Fredoka']">{t.bio.step1}</legend>
                        <div className="space-y-4">
                            <Input 
                                id="pet-name" 
                                label={t.bio.label_name} 
                                value={petName} 
                                onChange={e => setPetName(e.target.value)} 
                                placeholder={t.placeholders.pet_name}
                                style={inputStyle}
                            />
                            
                            <Select 
                                id="bio-type" 
                                label={t.generator.label_type} 
                                value={petType} 
                                onChange={e => setPetType(e.target.value as PetType)}
                                style={inputStyle}
                            >
                                {PET_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {t.options.types[type] || type}
                                    </option>
                                ))}
                            </Select>

                            <Select 
                                id="bio-gender" 
                                label={t.bio.label_gender} 
                                value={gender} 
                                onChange={e => setGender(e.target.value as PetGender)}
                                style={inputStyle}
                            >
                                {PET_GENDERS.map(g => (
                                    <option key={g} value={g}>
                                        {t.options.genders[g] || g}
                                    </option>
                                ))}
                            </Select>

                            <Select 
                                id="bio-personality" 
                                label={t.bio.label_vibe} 
                                value={personality} 
                                onChange={e => setPersonality(e.target.value as PetPersonality)}
                                style={inputStyle}
                            >
                                {PET_PERSONALITIES.map(p => (
                                    <option key={p} value={p}>
                                        {t.options.personalities[p] || p}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </fieldset>
                    
                    {/* Step 2 */}
                    <fieldset>
                        <legend className="font-bold text-xl mb-2 font-['Fredoka']">{t.bio.step2}</legend>
                        <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full">
                            <UploadIcon className="w-5 h-5"/>
                            {imagePreview ? t.bio.btn_change : t.bio.btn_upload}
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </fieldset>

                    {/* Step 3 */}
                    <fieldset>
                         <legend className="font-bold text-xl mb-2 font-['Fredoka']">{t.bio.step3}</legend>
                        <Button onClick={handleGenerateBio} disabled={isLoading || !petName}>
                            {isLoading ? t.generator.btn_generating : t.bio.btn_generate}
                        </Button>
                    </fieldset>

                    {/* Generator Error */}
                    {error && <p role="alert" className="text-center text-red-500 bg-red-200/50 p-3 rounded-lg">{error}</p>}
                    
                    {generatedBios.length > 0 && (
                        <div className="space-y-2 animate-fade-in">
                            <h4 className="font-bold text-center text-xl font-['Fredoka'] mb-3">{t.bio.pick_bio}</h4>
                            {generatedBios.map((bio, index) => (
                                <button
                                    key={index}
                                    onClick={() => { setSelectedBio(bio); setBioMode('ai'); }}
                                    className={`w-full p-4 text-left rounded-lg transition-colors text-xl font-['Fredoka'] leading-relaxed ${selectedBio === bio && bioMode === 'ai' ? 'bg-black/10 shadow-inner border border-black/5' : 'bg-black/5 hover:bg-black/10'} dark:bg-white/10 dark:hover:bg-white/20`}
                                >{bio}</button>
                            ))}
                             <button
                                onClick={() => { setBioMode('custom'); setSelectedBio(customBio); }}
                                className={`w-full p-4 text-left rounded-lg transition-colors text-xl font-semibold font-['Fredoka'] ${bioMode === 'custom' ? 'bg-black/10 dark:bg-white/20' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'}`}
                            >
                                {t.bio.write_own}
                            </button>
                            {bioMode === 'custom' && (
                                <textarea 
                                    value={customBio}
                                    onChange={handleCustomBioChange}
                                    placeholder={t.bio.placeholder_own}
                                    className="w-full mt-2 p-3 rounded-lg bg-white/10 border border-white/30 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] font-['Fredoka'] text-xl leading-relaxed text-[var(--text-main)]"
                                    rows={3}
                                />
                            )}
                        </div>
                    )}
                </div>
                
                <div className="space-y-4 flex flex-col items-center">
                    <h3 className="font-bold text-xl text-center font-['Fredoka']">{t.bio.preview_title}</h3>
                    <div
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUpOrLeave}
                        onMouseLeave={handleMouseUpOrLeave}
                        className="cursor-grab active:cursor-grabbing select-none w-full flex justify-center"
                    >
                        <BioCard
                            ref={bioCardRef}
                            imagePreview={imagePreview}
                            petName={petName}
                            bio={selectedBio}
                            defaultPetKind={petType.toLowerCase() as PetKind}
                            imageZoom={imageZoom}
                            imagePosition={imagePosition}
                            onImageMouseDown={handleMouseDown}
                            isDragging={isDragging}
                            gender={gender}
                        />
                    </div>
                    <div className="w-full max-w-[480px] px-4">
                        <label htmlFor="zoom-slider" className={labelClass}>{t.bio.zoom}</label>
                         <input
                            id="zoom-slider"
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={imageZoom}
                            onChange={(e) => setImageZoom(Number(e.target.value))}
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]"
                        />
                    </div>
                    
                    {/* Action Error Display */}
                    {actionError && (
                        <div role="alert" className="w-full max-w-[480px] text-center bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm animate-fade-in">
                            {actionError}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 w-full max-w-[480px]">
                        <Button onClick={handleDownload} disabled={isActionDisabled} variant="secondary">
                            <DownloadIcon className="w-5 h-5"/>
                            {isDownloading ? 'Downloading...' : t.bio.btn_download}
                        </Button>
                        <Button onClick={handleShare} disabled={isActionDisabled} variant="primary" className="btn-surprise">
                            <ShareIcon className="w-5 h-5"/>
                            {isSharing ? 'Sharing...' : t.bio.btn_share}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
