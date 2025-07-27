import { useCallback } from "react";
import { copyToClipboard, shareAffirmation } from "../utils/affirmationUtils";

interface UseEventHandlersProps {
  affirmation: string;
  generateAffirmation: (selectedChips: string[]) => Promise<void>;
  updateAffirmation: (fetchFunction: () => Promise<void>, setAffirmation?: (text: string) => void) => Promise<void>;
  setAffirmation: (text: string) => void;
  toggleModal: () => void;
  getSelectedChips: () => string[];
}

interface UseEventHandlersReturn {
  handleReload: () => void;
  handleCopy: () => void;
  handleShare: () => void;
  handleSpecialAffirmation: () => void;
  handleChipPress: (chip: string, category: string) => void;
}

export const useEventHandlers = ({
  affirmation,
  generateAffirmation,
  updateAffirmation,
  setAffirmation,
  toggleModal,
  getSelectedChips,
}: UseEventHandlersProps): UseEventHandlersReturn => {
  const handleReload = useCallback(() => {
    console.log("🔄 Reload button pressed");
    const selectedChips = getSelectedChips();
    updateAffirmation(() => generateAffirmation(selectedChips), setAffirmation);
  }, [updateAffirmation, generateAffirmation, getSelectedChips, setAffirmation]);

  const handleCopy = useCallback(() => {
    console.log("📋 Copy button pressed");
    copyToClipboard(affirmation);
  }, [affirmation]);

  const handleShare = useCallback(() => {
    console.log("📤 Share button pressed");
    shareAffirmation(affirmation);
  }, [affirmation]);

  const handleSpecialAffirmation = useCallback(() => {
    console.log("🧪 Test button pressed!");
    toggleModal();
  }, [toggleModal]);

  const handleChipPress = useCallback((chip: string, category: string) => {
    console.log(`🎯 ${category} chip pressed:`, chip);
  }, []);

  return {
    handleReload,
    handleCopy,
    handleShare,
    handleSpecialAffirmation,
    handleChipPress,
  };
}; 