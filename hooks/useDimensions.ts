import { useMemo } from "react";
import { Dimensions } from "react-native";

interface UseDimensionsReturn {
  screenHeight: number;
  screenWidth: number;
  dynamicSpacing: number;
  textFieldHeight: number;
  iconSize: number;
  iconSpacing: number;
}

export const useDimensions = (): UseDimensionsReturn => {
  const dimensions = useMemo(() => {
    const screenHeight = Dimensions.get("window").height;
    const { width, height } = Dimensions.get("window");
    
    // Use responsive calculations
    const baseWidth = 375; // iPhone X width as reference
    const baseHeight = 812; // iPhone X height as reference
    const scale = Math.min(width / baseWidth, height / baseHeight);
    
    return {
      screenHeight,
      screenWidth: width,
      dynamicSpacing: Math.max(4, Math.round(8 * scale)), // Responsive spacing
      textFieldHeight: Math.max(200, Math.round(screenHeight * 0.25)), // Responsive height
      iconSize: Math.max(29, Math.round(Math.min(width, height) * 0.072)), // 20% bigger icon size
      iconSpacing: Math.max(16, Math.round(height * 0.03)), // Responsive spacing
    };
  }, []);

  return dimensions;
}; 