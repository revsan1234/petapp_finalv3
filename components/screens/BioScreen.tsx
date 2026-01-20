import React, { useState, useRef, MouseEvent, useEffect } from "react";
import { Header } from "../Header";
import type {
  PetPersonality,
  PetInfo,
  PetGender,
  PetType,
  PetKind,
} from "../../types";
import { useLanguage } from "../../contexts/LanguageContext";
import { toPng } from "html-to-image";
import { Card } from "../ui/Card";
import { Button, BackToHomeButton } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { BioCard } from "../ui/BioCard";
import { generatePetBio } from "../../services/geminiService";
import { PET_PERSONALITIES, PET_GENDERS, PET_TYPES } from "../../constants";

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
`;

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

const BioGeneratorInternal: React.FC<{
  petInfo: PetInfo;
  imageForBio: string | null;
  setImageForBio: (img: string | null) => void;
}> = ({ petInfo, imageForBio, setImageForBio }) => {
  const { t, language } = useLanguage();
  const [petName, setPetName] = useState("");
  const [personality, setPersonality] = useState<PetPersonality>(
    petInfo.personality,
  );
  const [gender, setGender] = useState<PetGender>(petInfo.gender);
  const [petType, setPetType] = useState<PetType>(petInfo.type);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedBio, setSelectedBio] = useState<string>("");
  const [customBio, setCustomBio] = useState("");
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
    setPersonality(petInfo.personality);
    setGender(petInfo.gender);
    setPetType(petInfo.type);
  }, [petInfo]);

  useEffect(() => {
    if (imageForBio) {
      setImagePreview(imageForBio);
      setImageZoom(1);
      setImagePosition({ x: 0, y: 0 });
      setImageForBio(null);
    }
  }, [imageForBio, setImageForBio]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setGeneratedBios([]);
        setSelectedBio("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBio = async () => {
    if (!petName.trim()) return;
    setIsLoading(true);
    try {
      const bios = await generatePetBio(
        petName,
        petType,
        personality,
        language,
      );
      setGeneratedBios(bios);
      if (bios.length > 0) setSelectedBio(bios[0]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!bioCardRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(bioCardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        fontEmbedCSS: FONT_EMBED_CSS,
        backgroundColor:
          gender === "Male"
            ? "#aab2a1"
            : gender === "Any"
              ? "#d4c4e0"
              : "#e889b5",
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${petName || "MyPet"}_Bio.png`;
      link.click();
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsDownloading(false);
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
    if (isDragging)
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
  };
  const handleMouseUpOrLeave = () => setIsDragging(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pb-32">
      <div className="space-y-8">
        <Card>
          <h3 className="text-2xl font-bold mb-6 font-heading uppercase text-white/80">
            Pet's Details
          </h3>
          <div className="space-y-6">
            <Input
              label="Pet's Name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g., Luna, Milo, Bear"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Pet Type"
                value={petType}
                onChange={(e) => setPetType(e.target.value as PetType)}
              >
                {PET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t.options.types[type] || type}
                  </option>
                ))}
              </Select>
              <Select
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as PetGender)}
              >
                {PET_GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {t.options.genders[g] || g}
                  </option>
                ))}
              </Select>
            </div>
            <Select
              label="Personality Vibe"
              value={personality}
              onChange={(e) => setPersonality(e.target.value as PetPersonality)}
            >
              {PET_PERSONALITIES.map((p) => (
                <option key={p} value={p}>
                  {t.options.personalities[p] || p}
                </option>
              ))}
            </Select>
          </div>
        </Card>

        <Card>
          <h3 className="text-2xl font-bold mb-4 font-heading uppercase text-white/80">
            Upload Photo
          </h3>
          <div className="space-y-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              className="w-full"
            >
              <UploadIcon className="w-6 h-6" />
              {imagePreview ? "CHANGE PHOTO" : "UPLOAD PHOTO"}
            </Button>
            <div className="flex items-start gap-3 bg-black/10 p-4 rounded-xl border border-white/5">
              <CameraIcon className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-white/60 italic leading-snug">
                {t.common.camera_permission_notice}
              </p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </Card>

        <Card>
          <h3 className="text-2xl font-bold mb-6 font-heading uppercase text-white/80">
            Get a Bio
          </h3>
          <Button
            onClick={handleGenerateBio}
            disabled={isLoading || !petName.trim()}
            variant="surprise"
            className="w-full"
          >
            {isLoading ? "GENERATING..." : "GENERATE IDEAS WITH AI"}
          </Button>
        </Card>

        {generatedBios.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-center opacity-60">
              Pick a bio:
            </h4>
            <div className="space-y-3">
              {generatedBios.map((bio, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedBio(bio);
                    setCustomBio("");
                  }}
                  className={`w-full p-6 text-left rounded-2xl transition-all font-medium text-lg border-2 ${selectedBio === bio ? "bg-white/30 border-white/50" : "bg-white/5 border-white/10 hover:bg-white/15"}`}
                >
                  {bio}
                </button>
              ))}
              <textarea
                value={customBio}
                onChange={(e) => {
                  setCustomBio(e.target.value);
                  setSelectedBio(e.target.value);
                }}
                placeholder="Type your own bio here..."
                className="w-full p-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center lg:sticky lg:top-10">
        <div
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="origin-top transform scale-[0.85] sm:scale-100 shadow-2xl rounded-[3rem] overflow-hidden"
        >
          <BioCard
            ref={bioCardRef}
            imagePreview={imagePreview}
            petName={petName}
            bio={selectedBio}
            imageZoom={imageZoom}
            imagePosition={imagePosition}
            onImageMouseDown={handleMouseDown}
            isDragging={isDragging}
            gender={gender}
            defaultPetKind={petType.toLowerCase() as PetKind}
          />
        </div>

        <div className="w-full max-w-[480px] bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-xl flex flex-col gap-8 mt-10">
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase text-white/60 tracking-widest text-center block">
              Photo Zoom
            </label>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.1"
              value={imageZoom}
              onChange={(e) => setImageZoom(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
            />
          </div>
          <Button
            onClick={handleDownload}
            disabled={
              isDownloading || !imagePreview || !petName || !selectedBio
            }
            variant="primary"
            className="w-full"
          >
            {isDownloading ? "SAVING..." : "DOWNLOAD & SHARE"}
          </Button>
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
    <main className="py-10 px-6 max-w-7xl mx-auto flex flex-col gap-10">
      <div className="-mt-8">
        <BackToHomeButton onClick={goHome} />
      </div>
      <BioGeneratorInternal
        petInfo={petInfo}
        imageForBio={imageForBio}
        setImageForBio={setImageForBio}
      />
    </main>
  </div>
);
