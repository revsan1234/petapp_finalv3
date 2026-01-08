import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Modal } from './ui/Modal';
import { editPetImage, fileToBase64 } from '../services/geminiService';
import { QuotaError } from '../types';
import type { ImageStyle } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PetCharacter } from './assets/pets/PetCharacter';

// Handle global window object for Turnstile
declare global {
  interface Window {
    turnstile: any;
  }
}

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
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ setImageForBio, sharedImage }) => {
    const { t } = useLanguage();
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [imageStyle, setImageStyle] = useState<ImageStyle>('Photorealistic');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    
    const [quotaModal, setQuotaModal] = useState<{ isOpen: boolean; title: string; desc: string }>({
        isOpen: false,
        title: '',
        desc: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const turnstileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sharedImage && !originalImagePreview && !generatedImage) {
            setOriginalImagePreview(sharedImage);
        }
    }, [sharedImage]);

    // Bot Protection initialization (interactive mode)
    useEffect(() => {
        if (turnstileRef.current && !turnstileToken) {
            window.turnstile.render(turnstileRef.current, {
                sitekey: '0x4AAAAAAA4I6eA-u6Y-vS9k', // Developer: Insert your real key here
                callback: (token: string) => {
                    setTurnstileToken(token);
                    setError(null);
                },
                'error-callback': () => setError("Verification failed. Please refresh the page."),
            });
        }
    }, [turnstileRef, turnstileToken]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalImage(file);
            setGeneratedImage(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImagePreview(reader.result as string);
                setImageForBio(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (isLoading) return;
        if (!turnstileToken) {
            setError(t.quota.bot_fail_desc);
            return;
        }
        if (!originalImage && !originalImagePreview) {
            setError('Please upload an image first.');
            return;
        }
        if (!prompt) {
            setError('Please provide a prompt.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let base64Image = '';
            let mimeType = 'image/jpeg';

            if (originalImage) {
                base64Image = await fileToBase64(originalImage);
                mimeType = originalImage.type;
            } else if (originalImagePreview) {
                base64Image = originalImagePreview.split(',')[1];
                const match = originalImagePreview.match(/:(.*?);/);
                if (match) mimeType = match[1];
            }

            const newImage = await editPetImage(base64Image, mimeType, prompt, imageStyle, turnstileToken);
            setGeneratedImage(newImage);
            setImageForBio(newImage);
            
            // Success: clear token for next session
            setTurnstileToken(null);
            if (window.turnstile) window.turnstile.reset();

        } catch (err: any) {
            if (err instanceof QuotaError) {
                const mapping = {
                    'LIMIT_REACHED': { title: t.quota.limit_reached_title, desc: t.quota.limit_reached_desc },
                    'RATE_LIMITED': { title: t.quota.bot_fail_title, desc: t.quota.bot_fail_desc },
                    'GLOBAL_CAP_REACHED': { title: t.quota.global_cap_title, desc: t.quota.global_cap_desc },
                    'BUSY': { title: t.quota.busy_title, desc: t.quota.busy_desc }
                };
                const config = mapping[err.code] || { title: t.quota.error_title, desc: t.quota.error_desc };
                setQuotaModal({ isOpen: true, ...config });
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'pet-art.png';
        link.click();
    };

    return (
        <Card>
            <div className="flex flex-col gap-2 mb-6 text-center">
                <h2 className="text-3xl font-bold">{t.image_editor.title}</h2>
                <p className="opacity-80 text-xl">{t.image_editor.subtitle}</p>
            </div>

            <div className="max-w-5xl mx-auto flex justify-center">
                <div className="w-full max-w-[450px] h-[450px] sm:h-[600px] bg-black/10 rounded-2xl flex items-center justify-center p-4 mb-6 relative border-2 border-dashed border-white/20">
                    {isLoading ? (
                        <div className="text-center">
                             <div className="relative mb-4">
                                <PetCharacter pet="dog" className="w-24 h-24 mx-auto animate-bounce-wiggle" />
                                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                             </div>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto"></div>
                            <p className="mt-4 opacity-80 text-xl font-bold animate-pulse">{t.image_editor.creating_magic}</p>
                        </div>
                    ) : generatedImage ? (
                        <img src={generatedImage} alt="Generated" className="w-full h-full object-contain rounded-xl shadow-2xl animate-fade-in"/>
                    ) : originalImagePreview ? (
                        <img src={originalImagePreview} alt="Original" className="w-full h-full object-contain rounded-xl shadow-lg"/>
                    ) : (
                         <div 
                            className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors group"
                            onClick={() => fileInputRef.current?.click()}
                         >
                            <UploadIcon className="w-20 h-20 mb-4 opacity-30 group-hover:scale-110 transition-transform" />
                            <p className="text-xl font-black opacity-40 uppercase tracking-tighter">{t.image_editor.upload_placeholder}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                {(originalImagePreview || generatedImage) && !isLoading && (
                     <div className="flex justify-center">
                        <button onClick={() => fileInputRef.current?.click()} className="text-xs font-black uppercase tracking-widest text-[#AA336A] hover:underline bg-white/40 px-4 py-2 rounded-full shadow-sm">
                            {t.image_editor.btn_change}
                        </button>
                     </div>
                )}

                <Input 
                    id="prompt-editor" 
                    label={t.image_editor.prompt_label} 
                    value={prompt} 
                    onChange={e => setPrompt(e.target.value)} 
                    placeholder={t.image_editor.prompt_placeholder} 
                />
                
                <Select 
                    id="editor-style" 
                    label={t.image_editor.style_label} 
                    value={imageStyle} 
                    onChange={e => setImageStyle(e.target.value as ImageStyle)}
                >
                    <option value="Photorealistic">{t.options.image_styles.Photorealistic}</option>
                    <option value="Anime">{t.options.image_styles.Anime}</option>
                    <option value="Cartoon">{t.options.image_styles.Cartoon}</option>
                </Select>

                {/* Turnstile Interaction (Mandatory for Generate) */}
                <div className="flex justify-center my-4">
                    <div ref={turnstileRef}></div>
                </div>

                {error && <p className="text-red-500 text-center font-bold bg-red-100/80 p-3 rounded-xl animate-fade-in">{error}</p>}
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {!generatedImage ? (
                        <Button 
                            onClick={handleGenerate} 
                            disabled={isLoading || !prompt || !turnstileToken} 
                            variant="primary" 
                            className="shadow-xl"
                        >
                            {isLoading ? t.generator.btn_generating : t.image_editor.btn_generate}
                            <MagicWandIcon className="w-6 h-6"/>
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleDownload} variant="secondary" className="shadow-md">
                                {t.image_editor.download}
                                <DownloadIcon className="w-6 h-6"/>
                            </Button>
                            <Button 
                                onClick={() => { 
                                    setGeneratedImage(null); 
                                    setTurnstileToken(null); 
                                    if(window.turnstile) window.turnstile.reset(); 
                                }} 
                                variant="primary" 
                                className="btn-surprise"
                            >
                                {t.image_editor.create_another}
                                <MagicWandIcon className="w-6 h-6"/>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            <Modal
                isOpen={quotaModal.isOpen}
                onClose={() => setQuotaModal({ ...quotaModal, isOpen: false })}
                title={quotaModal.title}
                confirmText={t.quota.btn_dismiss}
                onConfirm={() => setQuotaModal({ ...quotaModal, isOpen: false })}
            >
                <div className="flex flex-col items-center text-center py-4">
                    <PetCharacter pet="cat" className="w-32 h-32 mb-6" />
                    <p className="text-lg leading-relaxed font-medium">
                        {quotaModal.desc}
                    </p>
                </div>
            </Modal>
        </Card>
    );
};