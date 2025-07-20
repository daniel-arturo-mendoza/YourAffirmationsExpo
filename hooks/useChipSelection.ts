import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useChipSelection = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  // Animated values for chip movement
  const moodAnim = useRef(new Animated.Value(0)).current;
  const itemAnim = useRef(new Animated.Value(0)).current;
  const topicAnim = useRef(new Animated.Value(0)).current;
  const chipContainerAnim = useRef(new Animated.Value(0)).current;

  const animateChip = (animation: Animated.Value) => {
    animation.setValue(0); // Reset animation before starting
    Animated.timing(animation, {
      toValue: 1,
      duration: 300, // Adjust for smoothness
      useNativeDriver: true,
    }).start();
  };

  const selectChip = (category: "mood" | "item" | "topic", chip: string) => {
    if (category === "mood") {
      if (selectedMood === chip) return; // Prevent deselecting last chip
      setSelectedMood(chip); // Update state immediately
      animateChip(moodAnim);
    }
    if (category === "item") {
      if (selectedItem === chip) return;
      setSelectedItem(chip);
      animateChip(itemAnim);
    }
    if (category === "topic") {
      if (selectedTopic === chip) return;
      setSelectedTopic(chip);
      animateChip(topicAnim);
    }
  };

  // Determine the number of selected chips and animate container
  useEffect(() => {
    const selectedCount = (selectedMood ? 1 : 0) + (selectedItem ? 1 : 0) + (selectedTopic ? 1 : 0);

    Animated.timing(chipContainerAnim, {
      toValue: selectedCount > 0 ? 1 : 0, // Expand when at least 1 chip is selected
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedMood, selectedItem, selectedTopic]);

  // Update selectedChips array when selections change
  useEffect(() => {
    const chips = [];
    if (selectedMood) chips.push(selectedMood);
    if (selectedItem) chips.push(selectedItem);
    if (selectedTopic) chips.push(selectedTopic);
    setSelectedChips(chips);
  }, [selectedMood, selectedItem, selectedTopic]);

  const getSelectedChips = () => {
    const chips = [];
    if (selectedMood) chips.push(selectedMood);
    if (selectedItem) chips.push(selectedItem);
    if (selectedTopic) chips.push(selectedTopic);
    return chips;
  };

  const clearSelections = () => {
    setSelectedMood(null);
    setSelectedItem(null);
    setSelectedTopic(null);
  };

  return {
    // State
    selectedMood,
    selectedItem,
    selectedTopic,
    selectedChips,
    
    // Animations
    moodAnim,
    itemAnim,
    topicAnim,
    chipContainerAnim,
    
    // Functions
    selectChip,
    getSelectedChips,
    clearSelections,
  };
}; 