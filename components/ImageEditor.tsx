import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { editPetImage } from "../services/geminiService";
import type { ImageStyle } from "../types";
import { useLanguage } from "../contexts/LanguageContext";
import { PetCharacter } from "./assets/pets/PetCharacter";

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
    />
  </svg>
);

const ArrowCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
      clipRule="evenodd"
    />
  </svg>
);

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 1.5h13.5c.621 0 1.125.504 1.125 1.125v7.426c0 .621-.504 1.125-1.125 1.125H6.75a1.125 1.125 0 0 1-1.125-1.125V13.125c0-.621.504-1.125 1.125-1.125Z"
    />
  </svg>
);

interface ImageEditorProps {
  setImageForBio: (image: string | null) => void;
  sharedImage: string | null;
}

const STORAGE_KEY = "nmp_last_portrait_time";

export const ImageEditor: React.FC<ImageEditorProps> = ({
  setImageForBio,
  sharedImage,
}) => {
  const { t } = useLanguage();
  const [originalImagePreview, setOriginalImagePreview] = useState<
    string | null
  >(sharedImage);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("Photorealistic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDailyLimited, setIsDailyLimited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lastGenTime = localStorage.getItem(STORAGE_KEY);
    if (lastGenTime) {
      const timePassed = Date.now() - parseInt(lastGenTime, 10);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (timePassed < twentyFourHours) {
        setIsDailyLimited(true);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImagePreview(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePortrait = async () => {
    if (!originalImagePreview || !prompt.trim()) return;

    // Final sanity check for limit
    const lastGenTime = localStorage.getItem(STORAGE_KEY);
    if (lastGenTime) {
      const timePassed = Date.now() - parseInt(lastGenTime, 10);
      if (timePassed < 24 * 60 * 60 * 1000) {
        setIsDailyLimited(true);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      const [header, data] = originalImagePreview.split(",");
      const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";

      const result = await editPetImage(data, mimeType, prompt, imageStyle);
      if (result) {
        setGeneratedImage(result);
        setImageForBio(result);
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } else {
        throw new Error("Failed to generate image.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Daily limit reached") || err.status === 429) {
        setIsDailyLimited(true);
      }
      setError(t.quota.error_desc || "Magic glitch! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-4">
        <div
          onClick={() =>
            !isLoading && !isDailyLimited && fileInputRef.current?.click()
          }
          className={`w-full max-w-[500px] mx-auto aspect-[3/4] bg-[#d3d3cc] rounded-[2.5rem] flex flex-col items-center justify-center transition-all border-4 border-white/20 shadow-inner relative overflow-hidden ${isLoading || isDailyLimited ? "cursor-default" : "cursor-pointer hover:opacity-90"}`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#AA336A] border-t-transparent"></div>
              <p className="text-2xl font-black text-[#AA336A] uppercase animate-pulse">
                {t.image_editor.creating_magic}
              </p>
            </div>
          ) : generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          ) : originalImagePreview ? (
            <img
              src={originalImagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : isDailyLimited ? (
            <div className="text-center p-10 flex flex-col items-center">
              <LockIcon className="w-20 h-20 mb-6 text-[#AA336A] opacity-50" />
              <p className="text-2xl font-black text-[#AA336A] uppercase font-heading">
                {t.quota.limit_reached_title}
              </p>
            </div>
          ) : (
            <div className="text-center p-10">
              <UploadIcon className="w-24 h-24 mx-auto mb-6 opacity-40 text-[#666]" />
              <p className="text-3xl font-black opacity-40 text-[#333] uppercase font-heading">
                {t.image_editor.upload_placeholder}
              </p>
            </div>
          )}
        </div>

        {!isLoading && !generatedImage && !isDailyLimited && (
          <div className="max-w-[500px] mx-auto flex items-start gap-3 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
            <CameraIcon className="w-5 h-5 text-[#AA336A] shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-[#333]/70 italic leading-snug">
              {t.common.camera_permission_notice}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-10 max-w-2xl mx-auto">
        {isDailyLimited ? (
          <div className="bg-[#fffdf2] p-8 rounded-[2rem] shadow-premium border-none text-center animate-fade-in">
            <PetCharacter pet="dog" className="w-32 h-32 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-[#333] uppercase mb-4 font-heading">
              {t.quota.limit_reached_title}
            </h3>
            <p className="text-xl font-bold text-[#666] leading-relaxed">
              {t.quota.limit_reached_desc}
            </p>
            <div className="mt-8 pt-6 border-t border-black/5">
              <p className="text-xs font-black uppercase tracking-widest opacity-30">
                Tip: Check back in 24 hours!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <label className="text-2xl font-black text-[#333] font-heading block">
                {t.image_editor.prompt_label}
              </label>
              <Input
                id="prompt"
                label=""
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.image_editor.prompt_placeholder}
                className="!bg-[#f7f5ea] !border-none !text-2xl !p-6 !rounded-2xl shadow-inner placeholder:text-[#333]/30 font-bold !text-[#333]"
              />
            </div>

            <div className="space-y-4">
              <label className="text-2xl font-black text-[#333] font-heading block">
                {t.image_editor.style_label}
              </label>
              <Select
                id="style"
                label=""
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value as any)}
                className="!bg-[#f7f5ea] !border-none !text-2xl !p-6 !rounded-2xl shadow-inner font-bold !text-[#333]"
              >
                <option value="Photorealistic">
                  {t.options.image_styles.Photorealistic}
                </option>
                <option value="Anime">{t.options.image_styles.Anime}</option>
                <option value="Cartoon">
                  {t.options.image_styles.Cartoon}
                </option>
              </Select>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold border border-red-100 animate-fade-in">
                {error}
              </div>
            )}

            <div className="flex justify-center pt-6 relative">
              <Button
                onClick={handleGeneratePortrait}
                disabled={isLoading || !originalImagePreview || !prompt.trim()}
                variant="primary"
                className="!bg-[#AA336A] !py-6 sm:!py-7 !px-10 sm:!px-14 !text-2xl sm:!text-3xl font-black shadow-[0_15px_30px_rgba(170,51,106,0.35)] uppercase tracking-tight rounded-full flex items-center gap-4 transition-transform hover:scale-105 active:scale-95"
              >
                {isLoading
                  ? t.generator.btn_generating
                  : t.image_editor.btn_generate}
                <ArrowCircleIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </Button>
            </div>
          </>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};
