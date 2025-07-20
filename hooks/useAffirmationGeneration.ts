import { useState } from "react";
import { AffirmationService } from "../services/affirmationService";

interface UseAffirmationGenerationReturn {
  affirmation: string;
  specialAffirmation: string;
  isLoading: boolean;
  generateAffirmation: (selectedChips: string[]) => Promise<void>;
  generateSpecialAffirmation: (question1: string, question2: string) => Promise<void>;
  generateSpecialAffirmationAfterAd: (need: string, tone: string) => Promise<void>;
  setAffirmation: (affirmation: string) => void;
  setSpecialAffirmation: (affirmation: string) => void;
}

export const useAffirmationGeneration = (): UseAffirmationGenerationReturn => {
  const [affirmation, setAffirmation] = useState<string>(
    "Tap the green reload button to generate your affirmation!"
  );
  const [specialAffirmation, setSpecialAffirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateAffirmation = async (selectedChips: string[]) => {
    setIsLoading(true);
    try {
      const newAffirmation = await AffirmationService.generateAffirmation(selectedChips);
      setAffirmation(newAffirmation);
    } catch (error) {
      console.error("❌ Error generating affirmation:", error);
      setAffirmation("❌ Error generating affirmation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSpecialAffirmation = async (question1: string, question2: string) => {
    setIsLoading(true);
    try {
      const newAffirmation = await AffirmationService.generateSpecialAffirmation(question1, question2);
      setSpecialAffirmation(newAffirmation);
    } catch (error) {
      console.error("❌ Error generating special affirmation:", error);
      setSpecialAffirmation("❌ Error generating special affirmation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSpecialAffirmationAfterAd = async (need: string, tone: string) => {
    setIsLoading(true);
    try {
      const newAffirmation = await AffirmationService.generateSpecialAffirmationAfterAd(need, tone);
      setSpecialAffirmation(newAffirmation);
    } catch (error) {
      console.error("❌ Error generating special affirmation after ad:", error);
      setSpecialAffirmation("❌ Error generating special affirmation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    affirmation,
    specialAffirmation,
    isLoading,
    generateAffirmation,
    generateSpecialAffirmation,
    generateSpecialAffirmationAfterAd,
    setAffirmation,
    setSpecialAffirmation,
  };
}; 