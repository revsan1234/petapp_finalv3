import React, { useState, useRef, MouseEvent } from "react";
import type { GeneratedName, PetGender } from "../types";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { ShareableListCard } from "./ui/ShareableListCard";
import { toPng } from "html-to-image";
import { useLanguage } from "../contexts/LanguageContext";

const fontEmbedCss = `
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

interface SavedNamesProps {
  savedNames: GeneratedName[];
  removeSavedName: (nameId: string) => void;
  petGender: PetGender;
}

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);
const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186a2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 a2.25 2.25 0 0 0-3.933 2.186Z"
    />
  </svg>
);
const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    />
  </svg>
);
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const SavedNames: React.FC<SavedNamesProps> = ({
  savedNames,
  removeSavedName,
  petGender,
}) => {
  const { t } = useLanguage();
  const [showImageCreator, setShowImageCreator] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageZoom(1);
        setImagePosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        fontEmbedCSS: fontEmbedCss,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "MyPetCard.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;
    setIsSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        fontEmbedCSS: fontEmbedCss,
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "HelpMePick.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t.share_texts.card_title,
          text: t.share_texts.card_body,
        });
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch (error) {
      console.error("Share failed", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  return (
    <Card>
      <div className="flex justify-center items-center gap-4 mb-6 relative">
        <h3 className="text-3xl font-bold text-center">
          {t.saved_names.title}
        </h3>
        <span className="bg-[#AA336A] text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
          {savedNames.length}
        </span>
      </div>

      {savedNames.length === 0 ? (
        <div className="text-center py-8 opacity-60">
          <p className="text-xl font-medium">{t.saved_names.empty_title}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {savedNames.map((name) => (
              <div
                key={name.id}
                className="bg-white/10 p-4 rounded-xl flex justify-between items-center group hover:bg-white/20 transition-all border border-white/50 shadow-sm"
              >
                <div>
                  <p className="font-bold text-xl">{name.name}</p>
                  <p className="text-sm opacity-80">{name.meaning}</p>
                </div>
                <button
                  onClick={() => removeSavedName(name.id)}
                  className="p-3 text-red-400 hover:text-red-600 transition-all"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-2">
            <Button
              onClick={() => setShowImageCreator(true)}
              variant="primary"
              className="btn-surprise w-full sm:w-auto"
            >
              <ImageIcon className="w-6 h-6 mr-2" />
              {t.saved_names.btn_create_card}
            </Button>
          </div>
        </>
      )}

      {showImageCreator && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-md">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full max-w-4xl transform bg-[var(--card-bg)] backdrop-blur-xl text-left shadow-2xl transition-all rounded-2xl flex flex-col overflow-hidden border border-white/20">
              <div className="shrink-0 flex justify-between items-center px-8 py-6 bg-white/20 backdrop-blur-md border-b border-white/20">
                <h3 className="text-2xl font-bold">
                  {t.saved_names.shareable_title}
                </h3>
                <button
                  onClick={() => setShowImageCreator(false)}
                  className="text-gray-500 hover:text-black p-2 bg-white/20 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="font-bold text-lg">
                      {t.saved_names.card_step1}
                    </h4>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="secondary"
                      className="w-full !py-6 shadow-md"
                    >
                      <UploadIcon className="w-6 h-6 mr-2" />
                      {imagePreview
                        ? t.saved_names.btn_change_photo
                        : t.saved_names.btn_upload_photo}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />

                    {imagePreview && (
                      <div className="space-y-2 bg-white/10 p-4 rounded-xl">
                        <label className="block text-sm font-bold opacity-80">
                          {t.saved_names.zoom_label}
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={imageZoom}
                          onChange={(e) =>
                            setImageZoom(parseFloat(e.target.value))
                          }
                          className="w-full accent-[#AA336A]"
                        />
                        <p className="text-xs opacity-60 text-center">
                          {t.saved_names.zoom_hint_drag}
                        </p>
                      </div>
                    )}

                    <div className="pt-6 border-t border-black/5 space-y-4">
                      <h4 className="font-bold text-lg">
                        {t.saved_names.card_step2}
                      </h4>
                      <Button
                        onClick={handleDownloadImage}
                        disabled={isDownloading || !imagePreview}
                        variant="secondary"
                        className="w-full"
                      >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        {isDownloading
                          ? t.saved_names.btn_saving
                          : t.saved_names.btn_download}
                      </Button>
                      <Button
                        onClick={handleShare}
                        disabled={isSharing || !imagePreview}
                        variant="primary"
                        className="w-full btn-surprise"
                      >
                        <ShareIcon className="w-6 h-6 mr-2" />
                        {isSharing
                          ? t.saved_names.btn_preparing
                          : t.saved_names.btn_share_card}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className="cursor-grab active:cursor-grabbing transform origin-top scale-[0.6] sm:scale-[0.8] md:scale-90"
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUpOrLeave}
                      onMouseLeave={handleMouseUpOrLeave}
                    >
                      <ShareableListCard
                        ref={cardRef}
                        names={savedNames.map((n) => n.name).slice(0, 10)}
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
          </div>
        </div>
      )}
    </Card>
  );
};

export default SavedNames;
