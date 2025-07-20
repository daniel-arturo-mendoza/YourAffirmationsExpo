import { useMemo } from "react";
import { Dimensions, PixelRatio } from "react-native";

interface ResponsiveSizingReturn {
  // Screen dimensions
  screenWidth: number;
  screenHeight: number;
  
  // Responsive spacing
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  
  // Responsive font sizes
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    "2xl": number;
    "3xl": number;
    "4xl": number;
  };
  
  // Responsive component sizes
  componentSizes: {
    chipHeight: number;
    chipPadding: number;
    buttonHeight: number;
    buttonPadding: number;
    iconSize: number;
    modalHeight: number;
    containerHeight: number;
  };
  
  // Responsive calculations
  calculateResponsiveSize: (baseSize: number, scaleFactor?: number) => number;
  calculateFontSize: (baseSize: number, containerHeight?: number) => number;
  calculateLineHeight: (fontSize: number) => number;
}

export const useResponsiveSizing = (): ResponsiveSizingReturn => {
  const dimensions = useMemo(() => {
    const { width, height } = Dimensions.get("window");
    const pixelRatio = PixelRatio.get();
    
    // Base calculations
    const baseWidth = 375; // iPhone X width as reference
    const baseHeight = 812; // iPhone X height as reference
    
    // Scale factors
    const widthScale = width / baseWidth;
    const heightScale = height / baseHeight;
    const scale = Math.min(widthScale, heightScale); // Use smaller scale to prevent oversized elements
    
    return {
      screenWidth: width,
      screenHeight: height,
      widthScale,
      heightScale,
      scale,
      pixelRatio,
    };
  }, []);

  const responsiveSizing = useMemo(() => {
    const { screenWidth, screenHeight, scale } = dimensions;
    
    // Responsive spacing based on screen size
    const spacing = {
      xs: Math.max(4, Math.round(4 * scale)),
      sm: Math.max(8, Math.round(8 * scale)),
      md: Math.max(16, Math.round(16 * scale)),
      lg: Math.max(24, Math.round(24 * scale)),
      xl: Math.max(32, Math.round(32 * scale)),
      xxl: Math.max(48, Math.round(48 * scale)),
    };
    
    // Responsive font sizes
    const fontSize = {
      xs: Math.max(12, Math.round(12 * scale)),
      sm: Math.max(14, Math.round(14 * scale)),
      base: Math.max(16, Math.round(16 * scale)),
      lg: Math.max(18, Math.round(18 * scale)),
      xl: Math.max(20, Math.round(20 * scale)),
      "2xl": Math.max(24, Math.round(24 * scale)),
      "3xl": Math.max(30, Math.round(30 * scale)),
      "4xl": Math.max(36, Math.round(36 * scale)),
    };
    
    // Responsive component sizes
    const componentSizes = {
      chipHeight: Math.max(32, Math.round(32 * scale)),
      chipPadding: Math.max(8, Math.round(12 * scale)),
      buttonHeight: Math.max(53, Math.round(58 * scale)), // 20% bigger (48 * 1.2 = 57.6)
      buttonPadding: Math.max(14, Math.round(19 * scale)), // 20% bigger (16 * 1.2 = 19.2)
      iconSize: Math.max(29, Math.round(Math.min(screenWidth, screenHeight) * 0.072)), // 20% bigger (0.06 * 1.2 = 0.072)
      modalHeight: Math.max(300, Math.round(screenHeight * 0.4)),
      containerHeight: Math.max(60, Math.round(screenHeight * 0.08)), // For chip container
    };
    
    return {
      spacing,
      fontSize,
      componentSizes,
    };
  }, [dimensions]);

  const calculateResponsiveSize = (baseSize: number, scaleFactor: number = 1) => {
    return Math.max(baseSize, Math.round(baseSize * dimensions.scale * scaleFactor));
  };

  const calculateFontSize = (baseSize: number, containerHeight?: number) => {
    if (containerHeight) {
      // Dynamic font size based on container height
      return Math.max(12, Math.min(48, Math.round(containerHeight * 0.15)));
    }
    return Math.max(baseSize, Math.round(baseSize * dimensions.scale));
  };

  const calculateLineHeight = (fontSize: number) => {
    return Math.round(fontSize * 1.5);
  };

  return {
    screenWidth: dimensions.screenWidth,
    screenHeight: dimensions.screenHeight,
    spacing: responsiveSizing.spacing,
    fontSize: responsiveSizing.fontSize,
    componentSizes: responsiveSizing.componentSizes,
    calculateResponsiveSize,
    calculateFontSize,
    calculateLineHeight,
  };
}; 