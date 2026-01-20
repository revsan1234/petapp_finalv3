import React, { useState, useCallback } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import {
  generatePetPersonality,
  generatePetNames,
} from "../services/geminiService";
import type {
  QuizQuestion,
  PetPersonalityResult,
  PetInfo,
  GeneratedName,
} from "../types";
import { PET_GENDERS, PET_TYPES } from "../constants";
import { useLanguage } from "../contexts/LanguageContext";
import { PetCharacter } from "./assets/pets/PetCharacter";

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

interface PersonalityQuizProps {
  onQuizComplete: (result: PetPersonalityResult) => void;
  petInfo: PetInfo;
  setPetInfo: (info: PetInfo | ((prev: PetInfo) => PetInfo)) => void;
  addSavedName: (name: GeneratedName) => void;
  savedNames: GeneratedName[];
}

export const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({
  onQuizComplete,
  petInfo,
  setPetInfo,
  addSavedName,
  savedNames,
}) => {
  const { t, language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personalityResult, setPersonalityResult] =
    useState<PetPersonalityResult | null>(null);
  const [nameIdeas, setNameIdeas] = useState<GeneratedName[]>([]);
  const [isGeneratingNames, setIsGeneratingNames] = useState(false);

  // Reconstruct questions from translations
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: t.quiz.q1,
      answers: [
        { text: t.quiz.a1_1, value: "High energy, loves to play" },
        { text: t.quiz.a1_2, value: "Calm, enjoys relaxing" },
        { text: t.quiz.a1_3, value: "Mischievous, food-motivated" },
      ],
    },
    {
      id: 2,
      question: t.quiz.q2,
      answers: [
        { text: t.quiz.a2_1, value: "Shy, cautious" },
        { text: t.quiz.a2_2, value: "Outgoing, friendly, goofy" },
        { text: t.quiz.a2_3, value: "Elegant, watchful, maybe a bit judgy" },
      ],
    },
    {
      id: 3,
      question: t.quiz.q3,
      answers: [
        { text: t.quiz.a3_1, value: "Chaotic, curious, likes to test gravity" },
        { text: t.quiz.a3_2, value: "Simple tastes, goofy, easily amused" },
        {
          text: t.quiz.a3_3,
          value: "Brave but sensible, not easily impressed",
        },
      ],
    },
  ];

  const isNameSaved = useCallback(
    (nameId: string) => {
      return savedNames.some((saved) => saved.id === nameId);
    },
    [savedNames],
  );

  const handleAnswer = (answerValue: string) => {
    const newAnswers = [...answers, answerValue];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePetPersonality(finalAnswers, language);
      setPersonalityResult(result);
      onQuizComplete(result);
      fetchNameIdeas(result);
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const fetchNameIdeas = async (result: PetPersonalityResult) => {
    setIsGeneratingNames(true);
    try {
      const tempPetInfo = {
        ...petInfo,
        personality: result.keywords.personality,
        style: result.keywords.style,
      };
      const names = await generatePetNames(tempPetInfo, language);
      setNameIdeas(names.slice(0, 6));
    } catch (e) {
      console.error("Failed to fetch name ideas for quiz result");
    } finally {
      setIsGeneratingNames(false);
      setIsLoading(false);
    }
  };

  const handleResetAndTryAgain = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setError(null);
    setIsLoading(false);
    setPersonalityResult(null);
    setNameIdeas([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPetInfo((prev) => ({ ...prev, [name]: value }));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-8 min-h-[200px] flex flex-col justify-center items-center">
          {/* Consistent Bird Mascot in Loading State */}
          <PetCharacter pet="bird" className="w-24 h-24 mb-4 animate-bounce" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto"></div>
          <p className="mt-4 opacity-80 text-xl">{t.quiz.loading}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-4 min-h-[200px] flex flex-col justify-center items-center">
          <p className="text-red-500 mb-4 bg-red-200/50 p-3 rounded-lg">
            {error}
          </p>
          <Button onClick={handleResetAndTryAgain}>{t.quiz.try_again}</Button>
        </div>
      );
    }

    if (personalityResult) {
      return (
        <div className="text-center p-4 min-h-[200px] flex flex-col justify-center items-center animate-fade-in space-y-4">
          <h3 className="text-xl font-bold">{t.quiz.result_title}</h3>
          <div className="bg-white/20 p-4 rounded-lg">
            <p className="text-3xl font-bold text-[#AA336A]">
              {personalityResult.title}
            </p>
            <p className="mt-2 opacity-90 italic text-xl">
              "{personalityResult.description}"
            </p>
          </div>

          {isGeneratingNames ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto"></div>
              <p className="mt-3 opacity-80 text-xl">
                {t.generator.loading_text}
              </p>
            </div>
          ) : nameIdeas.length > 0 ? (
            <div className="w-full max-w-2xl pt-4">
              <p className="opacity-80 mb-2 text-xl">{t.quiz.pick_name}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {nameIdeas.map((name) => (
                  <div
                    key={name.id}
                    className="bg-[#494d43]/10 p-2 rounded-md font-semibold text-base flex justify-between items-center"
                  >
                    <span>{name.name}</span>
                    <button
                      onClick={() => addSavedName(name)}
                      disabled={isNameSaved(name.id)}
                    >
                      {isNameSaved(name.id) ? (
                        <HeartIconFilled className="w-6 h-6 text-[#AA336A]" />
                      ) : (
                        <HeartIconOutline className="w-6 h-6 text-[#AA336A]" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pt-4">
            <Button onClick={handleResetAndTryAgain} variant="secondary">
              {t.quiz.play_again}
            </Button>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercentage = (answers.length / questions.length) * 100;

    return (
      <div className="animate-fade-in w-full">
        {currentQuestionIndex === 0 && answers.length === 0 && (
          <div className="max-w-md mx-auto space-y-4 mb-8 text-center">
            <p className="font-semibold text-xl">{t.quiz.intro_title}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="quiz-type"
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
                id="quiz-gender"
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
          </div>
        )}

        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-4">
            <p className="text-center text-xl font-semibold">
              {currentQuestion.question}
            </p>
            <div className="w-full bg-white/30 rounded-full h-4 my-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-pink-400 to-pink-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(answer.value)}
                variant="secondary"
                className="text-left !justify-start !w-full text-lg"
              >
                {answer.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="flex flex-col items-center gap-2 mb-6 text-center">
        {/* Bigger Bird Mascot for the Personality Quiz */}
        <div className="mb-2">
          <PetCharacter pet="bird" className="w-32 h-32 drop-shadow-md" />
        </div>
        <h2 className="text-3xl font-bold">{t.quiz.title}</h2>
        <p className="opacity-80 text-xl">{t.quiz.subtitle}</p>
      </div>
      {renderContent()}
    </Card>
  );
};
