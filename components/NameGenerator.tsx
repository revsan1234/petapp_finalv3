import React, { useState, useCallback } from "react";
import type { PetInfo, GeneratedName } from "../types";
import {
  PET_TYPES,
  PET_GENDERS,
  PET_PERSONALITIES,
  NAME_STYLES,
} from "../constants";
import { generatePetNames } from "../services/geminiService";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { Modal } from "./ui/Modal";
import { CelebrationEffect } from "./ui/CelebrationEffect";
import { useLanguage } from "../contexts/LanguageContext";
import { QuotaError } from "../types";
import { PetCharacter } from "./assets/pets/PetCharacter";

interface NameGeneratorProps {
  addSavedName: (name: GeneratedName) => void;
  savedNames: GeneratedName[];
  petInfo: PetInfo;
  setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
}

const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
    />
  </svg>
);

const HeartIconFilled = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.372 0 2.615.552 3.515 1.442.899-.89 2.143-1.442 3.515-1.442 2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
  </svg>
);

const HeartIconOutline = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

export const NameGenerator: React.FC<NameGeneratorProps> = ({
  addSavedName,
  savedNames,
  petInfo,
  setPetInfo,
}) => {
  const { t, language } = useLanguage();
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [quotaModal, setQuotaModal] = useState<{
    isOpen: boolean;
    title: string;
    desc: string;
  }>({
    isOpen: false,
    title: "",
    desc: "",
  });

  const generateNames = useCallback(
    async (info: PetInfo) => {
      setIsLoading(true);
      setError(null);
      setGeneratedNames([]);
      try {
        const names = await generatePetNames(info, language);
        setGeneratedNames(names);
        setShowCelebration(true);
      } catch (err: any) {
        if (err instanceof QuotaError) {
          setQuotaModal({
            isOpen: true,
            title: t.quota.rate_limit_title,
            desc: t.quota.rate_limit_desc,
          });
        } else {
          setError(t.generator.error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [language, t],
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPetInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    generateNames(petInfo);
  };

  const isNameSaved = (name: string) => savedNames.some((n) => n.name === name);

  return (
    <Card className="!bg-[#fffdf2] !p-8 sm:!p-12 shadow-premium rounded-[3rem] border-none">
      <CelebrationEffect
        trigger={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />

      <div className="flex flex-col gap-2 mb-10 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-[#333] uppercase tracking-tight font-heading">
          {t.generator.title}
        </h2>
        <p className="opacity-80 text-xl sm:text-2xl font-bold text-[#666]">
          {t.generator.subtitle}
        </p>
      </div>

      <form
        onSubmit={handleSubmitForm}
        className="space-y-10 w-full max-w-4xl mx-auto mb-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <Select
            id="type"
            name="type"
            label={t.generator.label_type}
            value={petInfo.type}
            onChange={handleChange}
            className="!bg-[#f7f5ea] !border-none !text-[#333]"
          >
            {PET_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.options.types[type] || type}
              </option>
            ))}
          </Select>
          <Select
            id="gender"
            name="gender"
            label={t.generator.label_gender}
            value={petInfo.gender}
            onChange={handleChange}
            className="!bg-[#f7f5ea] !border-none !text-[#333]"
          >
            {PET_GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {t.options.genders[gender] || gender}
              </option>
            ))}
          </Select>
          <Select
            id="personality"
            name="personality"
            label={t.generator.label_personality}
            value={petInfo.personality}
            onChange={handleChange}
            className="!bg-[#f7f5ea] !border-none !text-[#333]"
          >
            {PET_PERSONALITIES.map((p) => (
              <option key={p} value={p}>
                {t.options.personalities[p] || p}
              </option>
            ))}
          </Select>
          <Select
            id="style"
            name="style"
            label={t.generator.label_style}
            value={petInfo.style}
            onChange={handleChange}
            className="!bg-[#f7f5ea] !border-none !text-[#333]"
          >
            {NAME_STYLES.map((s) => (
              <option key={s} value={s}>
                {t.options.styles[s] || s}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="!bg-[#AA336A] !py-5 !px-12 !text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            {isLoading ? t.generator.btn_generating : t.generator.btn_generate}
            {!isLoading && <SparkleIcon className="w-6 h-6 ml-2" />}
          </Button>
        </div>
      </form>

      {/* Results Section */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center animate-pulse">
          <PetCharacter
            pet={petInfo.type.toLowerCase() as any}
            className="w-32 h-32 mb-6"
          />
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 bg-[#AA336A] rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#AA336A] rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#AA336A] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="mt-6 text-[#333] font-bold text-xl uppercase tracking-widest">
            {t.generator.loading_text}
          </p>
        </div>
      )}

      {!isLoading && generatedNames.length > 0 && (
        <div className="animate-fade-in w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
            <h3 className="text-2xl font-bold text-[#333] uppercase tracking-tight font-heading">
              {t.generator.results_title}
            </h3>
            <div className="flex items-center gap-2">
              <PetCharacter
                pet={petInfo.type.toLowerCase() as any}
                className="w-10 h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedNames.map((nameData) => (
              <div
                key={nameData.id}
                className="bg-[#f7f5ea] p-6 rounded-[2rem] shadow-sm border border-black/5 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-3xl font-bold text-[#333] font-heading uppercase tracking-tighter">
                    {nameData.name}
                  </h4>
                  <button
                    onClick={() => addSavedName(nameData)}
                    className={`p-3 rounded-full transition-all active:scale-90 ${isNameSaved(nameData.name) ? "text-[#AA336A]" : "text-gray-300 hover:text-[#AA336A]"}`}
                  >
                    {isNameSaved(nameData.name) ? (
                      <HeartIconFilled className="w-7 h-7" />
                    ) : (
                      <HeartIconOutline className="w-7 h-7" />
                    )}
                  </button>
                </div>
                <p className="text-[#333]/70 font-medium leading-relaxed italic">
                  "{nameData.meaning}"
                </p>
              </div>
            ))}
          </div>

          <p className="text-center mt-12 text-[#333]/40 font-bold text-xs uppercase tracking-[0.2em]">
            Found a favorite? It's been saved to your Top Picks!
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold animate-fade-in border border-red-100">
          {error}
        </div>
      )}

      <Modal
        isOpen={quotaModal.isOpen}
        onClose={() => setQuotaModal({ ...quotaModal, isOpen: false })}
        title={quotaModal.title}
        confirmText={t.quota.btn_dismiss}
        onConfirm={() => setQuotaModal({ ...quotaModal, isOpen: false })}
      >
        <div className="flex flex-col items-center text-center py-4">
          <PetCharacter pet="dog" className="w-24 h-24 mb-6" />
          <p className="text-xl font-bold text-[#333] leading-relaxed">
            {quotaModal.desc}
          </p>
        </div>
      </Modal>
    </Card>
  );
};
