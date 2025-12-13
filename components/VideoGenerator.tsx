
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { useLanguage } from '../contexts/LanguageContext';

const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" />
    </svg>
);

const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
);

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

interface VideoTool {
    name: string;
    description: string;
    url: string;
    freeTier: string;
}

const VIDEO_TOOLS: VideoTool[] = [
    {
        name: "Luma Dream Machine",
        description: "Super easy, high quality, and very popular. Great for realistic motion.",
        url: "https://lumalabs.ai/dream-machine",
        freeTier: "5 free generations/day"
    },
    {
        name: "Kling AI",
        description: "Incredible cinematic quality and realism. Currently very popular.",
        url: "https://klingai.com/",
        freeTier: "Daily free credits"
    },
    {
        name: "Runway Gen-2",
        description: "Professional grade with lots of controls. Good for specific styles.",
        url: "https://runwayml.com/",
        freeTier: "Limited free credits (one-time)"
    }
];

interface VideoGeneratorProps {
    sharedImage: string | null;
    setImage?: (image: string | null) => void;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ sharedImage, setImage }) => {
    const { t } = useLanguage();
    const [prompt, setPrompt] = useState('My dog wearing sunglasses and driving a tiny car');
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync with shared image from parent (ImageEditor)
    useEffect(() => {
        if (sharedImage) {
            setImagePreview(sharedImage);
        }
    }, [sharedImage]);

    const handleOpenStudio = () => {
        setShowModal(true);
    };

    const handleCopyPrompt = () => {
        // Copy prompt to clipboard for convenience
        navigator.clipboard.writeText(prompt).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                if (setImage) setImage(result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Card>
                <div className="flex flex-col gap-2 mb-6 text-center">
                    <h2 className="text-3xl font-bold">{t.video_studio.title}</h2>
                    <p className="opacity-80 text-xl">{t.video_studio.subtitle}</p>
                </div>

                <div className="space-y-6">
                    {/* Only show upload box if no image is present, or just show preview */}
                    <div 
                        className="w-full max-w-[450px] mx-auto h-[450px] sm:h-[600px] bg-black/20 border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/30 transition-colors relative overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center p-4 text-[#666666]/70">
                                <UploadIcon className="w-16 h-16 mx-auto mb-4 opacity-60" />
                                <p className="font-semibold text-xl">{t.video_studio.upload_placeholder}</p>
                            </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                            {t.video_studio.click_change}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>

                    <div className="max-w-2xl mx-auto w-full">
                        <Input 
                            id="video-prompt" 
                            label={t.video_studio.prompt_label}
                            value={prompt} 
                            onChange={e => setPrompt(e.target.value)} 
                            placeholder={t.video_studio.prompt_placeholder} 
                        />
                        
                        <div className="bg-white/10 p-4 rounded-lg border border-white/20 text-lg mt-6">
                            <p className="font-bold mb-1">{t.video_studio.how_to_title}</p>
                            <ol className="list-decimal list-inside space-y-2 opacity-90">
                                <li>{t.video_studio.step1}</li>
                                <li>{t.video_studio.step2}</li>
                                <li>{t.video_studio.step3}</li>
                                <li>{t.video_studio.step4}</li>
                                <li>{t.video_studio.step5}</li>
                            </ol>
                        </div>

                        <div className="flex justify-center pt-2 mt-6">
                            <Button 
                                onClick={handleOpenStudio} 
                                variant="primary"
                                className="w-full sm:w-auto"
                            >
                                {t.video_studio.btn_open}
                                <VideoIcon className="w-5 h-5"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Modal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                title={t.video_studio.modal_title}
                confirmText="Close"
                onConfirm={() => setShowModal(false)}
            >
                <div className="space-y-4">
                    <p className="text-lg opacity-80 mb-4">
                        {t.video_studio.modal_desc} 
                        <br/>
                        <span className="font-bold text-[#AA336A]">{t.video_studio.modal_note}</span>
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                        {VIDEO_TOOLS.map((tool) => (
                            <a
                                key={tool.name}
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleCopyPrompt}
                                className="flex flex-col text-left bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl p-4 transition-all hover:scale-[1.02] shadow-sm group decoration-0 cursor-pointer"
                            >
                                <div className="flex justify-between items-center w-full mb-1">
                                    <span className="font-bold text-lg text-[#666666] group-hover:text-[#AA336A] transition-colors">
                                        {tool.name}
                                    </span>
                                    <ExternalLinkIcon className="w-4 h-4 opacity-50" />
                                </div>
                                <p className="text-base text-[#666666]/80 mb-2">{tool.description}</p>
                                <div className="flex items-center gap-2 mt-auto">
                                    <span className="bg-[#AA336A]/10 text-[#AA336A] text-xs font-bold px-2 py-1 rounded-md">
                                        {tool.freeTier}
                                    </span>
                                    {copied && <span className="text-xs text-green-600 font-bold animate-fade-in ml-auto">{t.video_studio.prompt_copied}</span>}
                                </div>
                            </a>
                        ))}
                    </div>
                    
                    <div className="text-center mt-4">
                         <p className="text-sm opacity-60">
                            {t.video_studio.auto_copy}
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    );
};
