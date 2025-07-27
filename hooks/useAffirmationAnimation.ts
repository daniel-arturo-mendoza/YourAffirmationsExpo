import { useRef, useState } from 'react';
import { Animated } from 'react-native';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAffirmationAnimation = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fadeCreatingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [isLoading, setIsLoading] = useState(false);
  const [showCreatingText, setShowCreatingText] = useState(false);

  const animateFadeOut = async (duration: number = 300) => {
    return new Promise<void>((resolve) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  };

  const animateFadeIn = async (duration: number = 300) => {
    return new Promise<void>((resolve) => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  };

  const animateCreatingTextFadeIn = async (duration: number = 300) => {
    return new Promise<void>((resolve) => {
      Animated.timing(fadeCreatingAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  };

  const animateCreatingTextFadeOut = async (duration: number = 300) => {
    return new Promise<void>((resolve) => {
      Animated.timing(fadeCreatingAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const updateAffirmation = async (fetchFunction: () => Promise<void>, setAffirmation?: (text: string) => void) => {
    console.log("🎬 Starting updateAffirmation animation...");
    setIsLoading(true);
    setShowCreatingText(false);

    // Fade out existing text
    await animateFadeOut();

    // Show "Creating..." text
    console.log("🎬 Showing creating text and starting pulse...");
    setShowCreatingText(true);
    await animateCreatingTextFadeIn();
    startPulseAnimation();

    try {
      // Execute the provided function
      await fetchFunction();

      // Fade out "Creating..." text
      stopPulseAnimation();
      await animateCreatingTextFadeOut();
      setShowCreatingText(false);

      // Fade in new text
      await animateFadeIn();

    } catch (error) {
      console.error("❌ Error in updateAffirmation:", error);
      
      // Set error message if setAffirmation is provided
      if (setAffirmation) {
        setAffirmation("❌ Error generating affirmation. Please try again.");
      }
      
      // Fade out "Creating..." text
      stopPulseAnimation();
      await animateCreatingTextFadeOut();
      setShowCreatingText(false);

      // Fade in error text
      await animateFadeIn();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fadeAnim,
    fadeCreatingAnim,
    pulseAnim,
    isLoading,
    showCreatingText,
    updateAffirmation,
  };
}; 