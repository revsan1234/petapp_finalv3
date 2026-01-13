import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { editPetImage, fileToBase64 } from '../services/geminiService';
import type { ImageStyle, Tab } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const MagicWandIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

interface ImageEditorProps {
    setImageForBio: (image: string | null) => void;
    sharedImage: string | null;
    setActiveTab?: (tab: Tab) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ setImageForBio, sharedImage, setActiveTab }) => {
    const { t } = useLanguage();
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [imageStyle, setImageStyle] = useState<ImageStyle>('Photorealistic');
    const [isLoading, setIsLoading] = useState(false);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // DAILY LIMIT CHECK
    useEffect(() => {
        const lastGen = localStorage.getItem('petapp_last_image_gen');
        const today = new Date().toDateString();
        if (lastGen === today) setIsLimitReached(true);
    }, []);

    useEffect(() => {
        if (sharedImage && !originalImagePreview && !generatedImage) setOriginalImagePreview(sharedImage);
    }, [sharedImage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalImage(file);
            setGeneratedImage(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setOriginalImagePreview(result);
                setImageForBio(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (isLimitReached) return;
        if (!originalImage && !originalImagePreview) { setError('Upload photo first.'); return; }
        if (!prompt) { setError('Provide a prompt.'); return; }

        setIsLoading(true); setError(null); setGeneratedImage(null);
        try {
            let base64Image = ''; let mimeType = 'image/jpeg';
            if (originalImage) { base64Image = await fileToBase64(originalImage); mimeType = originalImage.type; }
            else if (originalImagePreview) { base64Image = originalImagePreview.split(',')[1]; }

            const newImage = await editPetImage(base64Image, mimeType, prompt, imageStyle);
            setGeneratedImage(newImage);
            setImageForBio(newImage);
            
            // SAVE LIMIT: Mark today's generation as used
            const today = new Date().toDateString();
            localStorage.setItem('petapp_last_image_gen', today);
            setIsLimitReached(true);
        } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a'); 
        link.href = generatedImage; 
        link.download = 'my-pet-scene.png'; 
        link.click();
    };

    return (
        <Card>
            <div className="flex flex-col gap-2 mb-6 text-center">
                <h2 className="text-3xl font-bold">{t.image_editor.title}</h2>
                <p className="opacity-80 text-xl">{t.image_editor.subtitle}</p>
            </div>

            <div className="max-w-5xl mx-auto flex justify-center">
                <div className="w-full max-w-[450px] h-[450px] bg-black/10 rounded-lg flex items-center justify-center p-4 mb-6 relative border border-white/20 overflow-hidden">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto"></div>
                            <p className="mt-4 opacity-80 text-xl">{t.image_editor.creating_magic}</p>
                        </div>
                    ) : generatedImage ? (
                        <img src={generatedImage} alt="Generated" className="w-full h-full object-contain rounded-md shadow-lg"/>
                    ) : originalImagePreview ? (
                        <img src={originalImagePreview} alt="Original" className="w-full h-full object-contain rounded-md shadow-lg"/>
                    ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <UploadIcon className="w-16 h-16 mb-4 opacity-40" />
                            <p className="text-xl font-medium opacity-60">{t.image_editor.upload_placeholder}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                <Input id="prompt" label={t.image_editor.prompt_label} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t.image_editor.prompt_placeholder} />
                <Select id="image-style" label={t.image_editor.style_label} value={imageStyle} onChange={e => setImageStyle(e.target.value as ImageStyle)}>
                    <option value="Photorealistic">{t.options.image_styles.Photorealistic}</option>
                    <option value="Anime">{t.options.image_styles.Anime}</option>
                    <option value="Cartoon">{t.options.image_styles.Cartoon}</option>
                </Select>

                {isLimitReached && !generatedImage && (
                    <div className="text-center animate-fade-in bg-[#FFF8E7] p-8 rounded-[2rem] border-2 border-[#AA336A]/20 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#AA336A]/40 to-transparent"></div>
                        <p className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-500">✨</p>
                        <h4 className="text-[#AA336A] font-black text-xl uppercase tracking-wider mb-2">{t.image_editor.limit_title}</h4>
                        <p className="text-[#5D4037] font-medium leading-relaxed text-lg italic">
                            {t.image_editor.limit_reached}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-3 pt-4">
                    {!generatedImage ? (
                        <Button 
                            onClick={handleGenerate} 
                            disabled={isLoading || isLimitReached || (!originalImage && !originalImagePreview) || !prompt} 
                            variant="primary" 
                            className="shadow-lg !py-5"
                        >
                            {isLoading ? t.image_editor.creating_magic : t.image_editor.btn_generate}
                            <MagicWandIcon className="w-5 h-5"/>
                        </Button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button onClick={handleDownload} variant="secondary" className="flex-1"> {t.image_editor.download} <DownloadIcon className="w-5 h-5"/> </Button>
                        </div>
                    )}
                </div>
                {error && <p className="text-red-500 text-center mt-2 font-bold">{error}</p>}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </Card>
    );
};