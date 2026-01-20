import React, { useState } from "react";
import { Header } from "../Header";
import { ImageEditor } from "../ImageEditor";
import { VideoGenerator } from "../VideoGenerator";
import { Card } from "../ui/Card";
import { Button, BackToHomeButton } from "../ui/Button";
import { Tab } from "../layout/TabNavigator";
import { PetCharacter } from "../assets/pets/PetCharacter";
import { useLanguage } from "../../contexts/LanguageContext";

const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

interface PhotoScreenProps {
  setActiveTab: (tab: Tab) => void;
  setImageForBio: (image: string | null) => void;
  goHome: () => void;
}

type PhotoMode = "menu" | "scene" | "video";

export const PhotoScreen: React.FC<PhotoScreenProps> = ({
  setActiveTab,
  setImageForBio,
  goHome,
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<PhotoMode>("menu");
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);

  const handleImageUpdate = (image: string | null) => {
    setCurrentPhoto(image);
    setImageForBio(image);
  };

  if (mode === "menu") {
    return (
      <div className="relative min-h-screen flex flex-col">
        <Header leftPet="lizard" rightPet="rabbit" onLogoClick={goHome} />
        <main className="px-4 pb-24 max-w-5xl mx-auto w-full flex flex-col gap-10 mt-12">
          <div className="-mt-16 flex justify-start">
            <BackToHomeButton onClick={goHome} />
          </div>

          <div className="grid grid-cols-1 gap-12 mt-4">
            <button
              onClick={() => setMode("scene")}
              className="!bg-[#fffdf2] rounded-[3.5rem] p-12 shadow-premium border-none flex flex-col items-center text-center gap-6 transition-all hover:scale-[1.02] group active:scale-95"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500">
                <PetCharacter
                  pet="lizard"
                  className="w-48 h-48 drop-shadow-2xl"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-5xl font-black text-[#333] uppercase tracking-tight font-heading">
                  {t.image_editor.title}
                </h3>
                <p className="text-[#333] font-bold text-2xl opacity-90 max-w-md mx-auto">
                  {t.image_editor.subtitle}
                </p>
              </div>
            </button>

            <button
              onClick={() => setMode("video")}
              className="!bg-[#fffdf2] rounded-[3.5rem] p-12 shadow-premium border-none flex flex-col items-center text-center gap-6 transition-all hover:scale-[1.02] group active:scale-95"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500">
                <PetCharacter
                  pet="rabbit"
                  className="w-48 h-48 drop-shadow-2xl"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-5xl font-black text-[#333] uppercase tracking-tight font-heading">
                  {t.video_studio.title}
                </h3>
                <p className="text-[#333] font-bold text-2xl opacity-90 max-w-md mx-auto">
                  {t.video_studio.subtitle}
                </p>
              </div>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header
        leftPet="dog"
        rightPet="cat"
        onLogoClick={() => setMode("menu")}
      />
      <main className="py-6 px-4 pb-48">
        <div className="flex flex-col gap-10 w-full mx-auto max-w-7xl">
          <div className="-mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setMode("menu")}
              className="flex items-center gap-2 text-white hover:scale-105 transition-all bg-white/30 px-6 py-3 rounded-full backdrop-blur-md font-black uppercase tracking-widest text-sm w-fit shadow-xl border-2 border-white/30 active:scale-95"
            >
              <BackIcon className="w-5 h-5" />
              {t.common.back_menu}
            </button>
            <BackToHomeButton onClick={goHome} />
          </div>

          {mode === "scene" ? (
            <div className="flex flex-col gap-12">
              <Card className="!bg-[#fffdf2] !p-16 shadow-premium border-none">
                <h2 className="text-5xl font-black text-[#333] text-center mb-4 font-heading uppercase">
                  {t.image_editor.title}
                </h2>
                <p className="text-2xl font-bold text-[#666] text-center mb-12">
                  {t.image_editor.subtitle}
                </p>
                <ImageEditor
                  setImageForBio={handleImageUpdate}
                  sharedImage={currentPhoto}
                />
              </Card>

              <Card className="!bg-transparent !p-12 border-none relative overflow-visible text-center">
                <h2 className="text-6xl sm:text-7xl font-black text-[#333] mb-6 font-heading tracking-tight">
                  {t.bio.turn_photo_into_card}
                </h2>
                <p className="text-2xl sm:text-3xl font-black text-[#333] leading-tight max-w-5xl mx-auto mb-16">
                  {t.bio.turn_photo_desc}
                </p>

                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12">
                  <div className="flex items-end -space-x-12 sm:-space-x-16">
                    <PetCharacter
                      pet="dog"
                      className="w-24 h-24 sm:w-36 sm:h-36 drop-shadow-lg"
                    />
                    <PetCharacter
                      pet="cat"
                      className="w-24 h-24 sm:w-36 sm:h-36 -mb-2 sm:-mb-4 drop-shadow-lg z-10"
                    />
                    <PetCharacter
                      pet="rabbit"
                      className="w-24 h-24 sm:w-36 sm:h-36 drop-shadow-lg"
                    />
                  </div>

                  <Button
                    onClick={() => setActiveTab("bio")}
                    variant="primary"
                    className="!bg-[#AA336A] !py-6 sm:!py-8 !px-10 sm:!px-16 !text-2xl sm:!text-3xl font-black shadow-[0_15px_35px_rgba(170,51,106,0.4)] rounded-full uppercase flex items-center gap-4 transition-transform hover:scale-105 active:scale-95"
                  >
                    <EditIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                    {t.bio.go_to_creator}
                  </Button>

                  <div className="flex items-end -space-x-12 sm:-space-x-16">
                    <PetCharacter
                      pet="hamster"
                      className="w-24 h-24 sm:w-36 sm:h-36 drop-shadow-lg"
                    />
                    <PetCharacter
                      pet="bird"
                      className="w-24 h-24 sm:w-36 sm:h-36 -mb-2 sm:-mb-4 drop-shadow-lg z-10"
                    />
                    <PetCharacter
                      pet="lizard"
                      className="w-24 h-24 sm:w-36 sm:h-36 drop-shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="!bg-[#fffdf2] !p-16 shadow-premium border-none">
              <h2 className="text-5xl font-black text-[#333] text-center mb-4 font-heading uppercase">
                {t.video_studio.title}
              </h2>
              <p className="text-2xl font-bold text-[#666] text-center mb-12">
                {t.video_studio.subtitle}
              </p>
              <VideoGenerator sharedImage={currentPhoto} />
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};
