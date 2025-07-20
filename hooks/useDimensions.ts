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
    
    return {
      screenHeight,
      screenWidth: width,
      dynamicSpacing: screenHeight * 0.01, // 1% of screen height
      textFieldHeight: screenHeight * 0.25, // 25% of screen height
      iconSize: Math.min(width, height) * 0.10, // 10% of smaller dimension
      iconSpacing: height * 0.03, // 3% of screen height
    };
  }, []);

  return dimensions;
}; 