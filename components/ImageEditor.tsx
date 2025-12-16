
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { editPetImage, fileToBase64 } from '../services/geminiService';
import type { ImageStyle } from '../types';
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

const RevertIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
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
    const [isSharing, setIsSharing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync state with parent if sharedImage provided
    useEffect(() => {
        if (sharedImage && sharedImage !== generatedImage && sharedImage !== originalImagePreview) {
             if (!originalImagePreview && !generatedImage) {
                 setOriginalImagePreview(sharedImage);
             }
        }
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
                setImageForBio(result); // Update parent
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!originalImage && !originalImagePreview) {
             // If we have a preview but no file (e.g. shared from elsewhere), we need a file or blob
             if (sharedImage) {
                 // Logic to use sharedImage directly
             } else {
                setError('Please upload an image and provide a prompt.');
                return;
             }
        }
        if (!prompt) {
            setError('Please provide a prompt.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            let base64Image = '';
            let mimeType = 'image/jpeg';

            if (originalImage) {
                base64Image = await fileToBase64(originalImage);
                mimeType = originalImage.type;
            } else if (originalImagePreview) {
                // Assuming it's a data URL
                base64Image = originalImagePreview.split(',')[1];
                const mimeMatch = originalImagePreview.match(/:(.*?);/);
                if (mimeMatch) mimeType = mimeMatch[1];
            }

            const newImage = await editPetImage(base64Image, mimeType, prompt, imageStyle);
            setGeneratedImage(newImage);
            setImageForBio(newImage); // Update parent with generated image
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;

        try {
            // Check if it's a data URL (it should be)
            if (generatedImage.startsWith('data:')) {
                // Convert Data URL to Blob for reliable download
                const byteString = atob(generatedImage.split(',')[1]);
                const mimeString = generatedImage.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = 'my-pet-scene.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                 // Fallback if not a data URL (unlikely given service logic)
                const link = document.createElement('a');
                link.href = generatedImage;
                link.download = 'my-pet-scene.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (e) {
            console.error("Download failed:", e);
            setActionError("Failed to download image. Please try again.");
        }
    };

    const handleShare = async () => {
        if (!generatedImage) return;
        setIsSharing(true);
        setActionError(null);

        if (!navigator.share) {
             setActionError("Sharing is not supported on this browser. Please use 'Download'.");
             setIsSharing(false);
             return;
        }

        try {
            const response = await fetch(generatedImage);
            const blob = await response.blob();
            const file = new File([blob], 'my-pet-scene.png', { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: t.share_texts.scene_title,
                    text: t.share_texts.scene_body,
                });
            } else {
                setActionError("This browser doesn't support sharing images.");
            }
        } catch (err) {
            console.error(err);
            setActionError("Could not share. Please try downloading.");
        } finally {
            setIsSharing(false);
        }
    };

    const handleRevert = () => {
        setGeneratedImage(null);
        setImageForBio(originalImagePreview);
    };
    
    return (
        <Card>
            <div className="flex flex-col gap-2 mb-6 text-center">
                <h2 className="text-3xl font-bold">{t.image_editor.title}</h2>
                <p className="opacity-80 text-xl">{t.image_editor.subtitle}</p>
            </div>

            <div className="max-w-5xl mx-auto flex justify-center">
                <div className="w-full max-w-[450px] h-[450px] sm:h-[600px] bg-black/10 rounded-lg flex items-center justify-center p-4 mb-6 relative border border-white/20">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto"></div>
                            <p className="mt-4 opacity-80 text-xl">{t.image_editor.creating_magic}</p>
                        </div>
                    ) : generatedImage ? (
                        <img src={generatedImage} alt="Generated pet" className="w-full h-full object-contain rounded-md shadow-lg"/>
                    ) : originalImagePreview ? (
                        <img src={originalImagePreview} alt="Original pet" className="w-full h-full object-contain rounded-md shadow-lg"/>
                    ) : (
                         <div 
                            className="w-full h-full flex flex-col items-center justify-center text-center text-[#494d43] cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                         >
                            <UploadIcon className="w-16 h-16 mb-4 opacity-40" />
                            <p className="text-xl font-medium opacity-60">{t.image_editor.upload_placeholder}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                 {(originalImagePreview || generatedImage) && !generatedImage && (
                     <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="mb-4">
                        <UploadIcon className="w-5 h-5"/> {t.image_editor.btn_change}
                     </Button>
                 )}

                <Input 
                    id="prompt" 
                    label={t.image_editor.prompt_label} 
                    value={prompt} 
                    onChange={e => setPrompt(e.target.value)} 
                    placeholder={t.image_editor.prompt_placeholder} 
                />
                
                <Select 
                    id="image-style" 
                    label={t.image_editor.style_label} 
                    value={imageStyle} 
                    onChange={e => setImageStyle(e.target.value as ImageStyle)}
                >
                    <option value="Photorealistic">{t.options.image_styles.Photorealistic}</option>
                    <option value="Anime">{t.options.image_styles.Anime}</option>
                    <option value="Cartoon">{t.options.image_styles.Cartoon}</option>
                </Select>

                {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded">{error}</p>}
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {!generatedImage ? (
                        <Button onClick={handleGenerate} disabled={isLoading || (!originalImage && !originalImagePreview) || !prompt} variant="primary">
                            {isLoading ? t.image_editor.creating_magic : t.image_editor.btn_generate}
                            <MagicWandIcon className="w-5 h-5"/>
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleDownload} variant="secondary">
                                {t.image_editor.download}
                                <DownloadIcon className="w-5 h-5"/>
                            </Button>
                            <Button onClick={handleShare} disabled={isSharing} variant="primary" className="btn-surprise">
                                {isSharing ? t.image_editor.sharing : t.image_editor.share}
                                <ShareIcon className="w-5 h-5"/>
                            </Button>
                        </>
                    )}
                </div>
                 {generatedImage && (
                    <div className="flex justify-center mt-4">
                        <button onClick={handleRevert} className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100">
                             <RevertIcon className="w-4 h-4"/> {t.image_editor.create_another}
                        </button>
                    </div>
                )}
                {actionError && <p className="text-red-500 text-center mt-2 text-sm">{actionError}</p>}
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
            />
        </Card>
    );
};
