import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useLanguage } from "../contexts/LanguageContext";

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

export const VideoGenerator: React.FC<{ sharedImage: string | null }> = ({
  sharedImage,
}) => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState(t.video_studio.prompt_placeholder);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sharedImage) setImagePreview(sharedImage);
  }, [sharedImage]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full max-w-[500px] mx-auto aspect-[3/4] bg-[#d3d3cc] rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer border-4 border-white/20 shadow-inner relative overflow-hidden"
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-10">
            <UploadIcon className="w-24 h-24 mx-auto mb-6 opacity-40 text-[#666]" />
            <p className="text-3xl font-black opacity-40 text-[#333] uppercase font-heading">
              {t.video_studio.upload_placeholder}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-10 max-w-2xl mx-auto">
        <div className="space-y-4">
          <label className="text-2xl font-black text-[#333] font-heading">
            {t.video_studio.prompt_label}
          </label>
          <Input
            id="v-prompt"
            label=""
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="!bg-[#f7f5ea] !border-none !text-2xl !p-6"
          />
        </div>

        <div className="!bg-[#f7f5ea] p-10 rounded-[2.5rem] text-left border-none shadow-sm">
          <p className="text-3xl font-black mb-6 font-heading">
            {t.video_studio.how_to_title}
          </p>
          <ol className="space-y-4 text-2xl font-bold text-[#333]/80 leading-relaxed">
            <li>1. {t.video_studio.step1}</li>
            <li>2. {t.video_studio.step2}</li>
            <li>3. {t.video_studio.step3}</li>
            <li>4. {t.video_studio.step4}</li>
            <li>5. {t.video_studio.step5}</li>
          </ol>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            onClick={() => alert("Video Studio Opening!")}
            variant="primary"
            className="!bg-[#AA336A] !py-6 !px-12 !text-2xl font-black shadow-2xl uppercase tracking-tighter"
          >
            {t.video_studio.btn_open} <span className="ml-2">📽️</span>
          </Button>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const r = new FileReader();
            r.onload = () => setImagePreview(r.result as string);
            r.readAsDataURL(file);
          }
        }}
      />
    </div>
  );
};
