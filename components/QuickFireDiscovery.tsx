import React, { useState, useCallback } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { generateQuickFireList } from "../services/geminiService";
import { NAME_STYLES, PET_GENDERS, PET_TYPES } from "../constants";
import type { GeneratedName, PetInfo } from "../types";
import { PetCharacter } from "./assets/pets/PetCharacter";
import { useLanguage } from "../contexts/LanguageContext";

const RocketIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a12.02 12.02 0 0 0-5.84 7.38m5.84-7.38L18 16.5m-2.41-2.13a6 6 0 0 0-5.84-7.38m5.84 7.38v4.82m-5.84-7.38a12.02 12.02 0 0 1 5.84-7.38m-5.84 7.38L6 8.25m2.41 2.13a6 6 0 0 1 5.84-7.38m-5.84 7.38L8.25 6m-2.41 2.13a12.02 12.02 0 0 0-5.84-7.38m5.84 7.38L3.75 6m-1.5 2.25a11.953 11.953 0 0 0-1.42-7.38M3.75 6a11.953 11.953 0 0 0-1.42 7.38"
    />
  </svg>
);

const HEART_PATH =
  "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z";
const HeartIconFilled = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d={HEART_PATH} />
  </svg>
);
const HeartIconOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={HEART_PATH} />
  </svg>
);

type GameState = "idle" | "playing" | "results";
const TOTAL_ROUNDS = 10;

interface QuickFireDiscoveryProps {
  addSavedName: (name: GeneratedName) => void;
  savedNames: GeneratedName[];
  petInfo: PetInfo;
  setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
}

export const QuickFireDiscovery: React.FC<QuickFireDiscoveryProps> = ({
  addSavedName,
  savedNames,
  petInfo,
  setPetInfo,
}) => {
  const { t, language } = useLanguage();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [gameNames, setGameNames] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [votedNames, setVotedNames] = useState<string[]>([]);
  const [currentPair, setCurrentPair] = useState<[string, string]>(["", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAll, setSavedAll] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPetInfo((prev) => ({ ...prev, [name]: value }));
  };

  const startGame = async () => {
    setIsLoading(true);
    setError(null);
    setSavedAll(false);

    try {
      const names = await generateQuickFireList(
        petInfo.style,
        petInfo.type,
        petInfo.gender,
        language,
      );
      if (names.length < TOTAL_ROUNDS * 2) {
        throw new Error("Not enough unique names generated for a full game.");
      }
      setGameNames(names);
      setVotedNames([]);
      setCurrentRound(1);
      setCurrentPair([names[0], names[1]]);
      setGameState("playing");
    } catch (err: any) {
      setError(err.message);
      setGameState("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = (name: string) => {
    setVotedNames((prev) => [...prev, name]);
    if (currentRound < TOTAL_ROUNDS) {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setCurrentPair([
        gameNames[nextRound * 2 - 2],
        gameNames[nextRound * 2 - 1],
      ]);
    } else {
      setGameState("results");
    }
  };

  const handleRestart = () => {
    setGameState("idle");
  };

  const isNameSaved = useCallback(
    (name: string) => {
      return savedNames.some((saved) => saved.name === name);
    },
    [savedNames],
  );

  const handleSaveSingleName = (name: string) => {
    const generatedName: GeneratedName = {
      id: `${Date.now()}-${name}`,
      name: name,
      meaning: `${t.quick_fire.generated_meaning_prefix} ${t.options.styles[petInfo.style]} ${t.quick_fire.generated_meaning_suffix}`,
      style: petInfo.style,
    };
    addSavedName(generatedName);
  };

  const handleSaveAll = () => {
    votedNames.forEach((name) => {
      if (!isNameSaved(name)) {
        handleSaveSingleName(name);
      }
    });
    setSavedAll(true);
  };

  const renderIdle = () => (
    <div className="text-center space-y-4">
      <div className="mb-4">
        <PetCharacter pet="cat" className="w-24 h-24 mx-auto drop-shadow-md" />
      </div>
      <p className="opacity-80 text-xl max-w-md mx-auto">
        {t.quick_fire.subtitle}
      </p>
      <div className="max-w-md w-full mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="qf-type"
            name="type"
            label={t.generator.label_type}
            value={petInfo.type}
            onChange={handleChange}
          >
            {PET_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.options.types[type] || type}
              </option>
            ))}
          </Select>
          <Select
            id="qf-gender"
            name="gender"
            label={t.generator.label_gender}
            value={petInfo.gender}
            onChange={handleChange}
          >
            {PET_GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {t.options.genders[gender] || gender}
              </option>
            ))}
          </Select>
        </div>
        <Select
          id="quickfire-style"
          name="style"
          label={t.generator.label_style}
          value={petInfo.style}
          onChange={handleChange}
        >
          {NAME_STYLES.map((s) => (
            <option key={s} value={s}>
              {t.options.styles[s] || s}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex justify-center pt-2">
        <Button onClick={startGame} disabled={isLoading}>
          {isLoading ? t.quick_fire.btn_preparing : t.quick_fire.btn_start}
          <RocketIcon className="w-5 h-5" />
        </Button>
      </div>
      {error && <p className="mt-2 text-center text-red-500">{error}</p>}
    </div>
  );

  const renderPlaying = () => (
    <div className="text-center animate-fade-in w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4 px-4">
        <span className="font-bold text-[#666666] opacity-70 uppercase tracking-wider text-sm">
          {t.options.styles[petInfo.style]} {t.quick_fire.mode}
        </span>
        <span className="bg-[#AA336A] text-white px-3 py-1 rounded-full text-sm font-bold">
          {t.quick_fire.round} {currentRound}/{TOTAL_ROUNDS}
        </span>
      </div>

      {/* VS Battle Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        {/* Option 1 */}
        <button
          onClick={() => handleVote(currentPair[0])}
          className="group relative h-32 md:h-40 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#AA336A]/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#aab2a1] to-[#8da38d] opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <span className="text-white text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
              {currentPair[0]}
            </span>
            <span className="mt-2 text-white/80 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
              {t.quick_fire.pick_me}
            </span>
          </div>
        </button>

        {/* VS Badge */}
        <div className="relative flex items-center justify-center">
          <div className="bg-white text-[#AA336A] font-black text-xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 border-4 border-[#e889b5]">
            VS
          </div>
          <div className="hidden md:block absolute top-0 bottom-0 w-1 bg-white/30 -z-0"></div>
        </div>

        {/* Option 2 */}
        <button
          onClick={() => handleVote(currentPair[1])}
          className="group relative h-32 md:h-40 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#AA336A]/40"
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-[#e889b5] to-[#ffc4d6] opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <span className="text-white text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
              {currentPair[1]}
            </span>
            <span className="mt-2 text-white/80 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
              {t.quick_fire.pick_me}
            </span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="text-center animate-fade-in space-y-4 w-full">
      {/* Larger Cat Mascot in Winners Circle */}
      <div className="inline-block mb-2">
        <PetCharacter pet="cat" className="w-32 h-32 drop-shadow-lg" />
      </div>
      <h3 className="text-3xl font-bold text-[#AA336A]">
        {t.quick_fire.winner_title}
      </h3>
      <p className="opacity-80 max-w-lg mx-auto text-xl">
        {t.quick_fire.winner_desc}
      </p>

      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto py-6">
        {votedNames.map((name, index) => (
          <li
            key={index}
            className="bg-gradient-to-r from-white/40 to-white/20 border border-white/30 p-3 rounded-xl font-bold text-lg flex justify-between items-center shadow-sm hover:shadow-md transition-all"
          >
            <span className="pl-2 text-[#666666]">{name}</span>
            <button
              onClick={() => handleSaveSingleName(name)}
              disabled={isNameSaved(name)}
              className="p-2 hover:bg-white/40 rounded-full transition-colors"
            >
              {isNameSaved(name) ? (
                <HeartIconFilled className="w-6 h-6 text-[#AA336A]" />
              ) : (
                <HeartIconOutline className="w-6 h-6 text-[#AA336A]" />
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleSaveAll}
          disabled={savedAll}
          variant="primary"
          className="shadow-lg"
        >
          {savedAll ? t.quick_fire.btn_saved_all : t.quick_fire.btn_save_all}
        </Button>
        <Button onClick={handleRestart} variant="secondary">
          {t.quick_fire.btn_play_again}
        </Button>
      </div>
      <p className="mt-6 text-sm font-medium opacity-70 bg-white/20 py-2 px-4 rounded-full inline-block">
        {t.quick_fire.saved_note}
      </p>
    </div>
  );

  const renderContent = () => {
    switch (gameState) {
      case "playing":
        return renderPlaying();
      case "results":
        return renderResults();
      case "idle":
      default:
        return renderIdle();
    }
  };

  return (
    <Card>
      <div className="flex flex-col items-center gap-2 mb-6 text-center">
        <h2 className="text-3xl font-bold">{t.quick_fire.title}</h2>
      </div>
      <div className="min-h-[150px] flex items-center justify-center">
        {isLoading && gameState === "idle" ? (
          <div className="text-center">
            <PetCharacter
              pet="cat"
              className="w-24 h-24 mx-auto mb-4 animate-bounce"
            />
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto"></div>
            <p className="mt-3 opacity-80 text-xl">{t.quick_fire.loading}</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </Card>
  );
};
