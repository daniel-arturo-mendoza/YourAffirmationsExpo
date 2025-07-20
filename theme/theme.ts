import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Color Palette
export const colors = {
  // Primary Colors
  primary: "#4A90E2",
  primaryLight: "#6BA3E8",
  primaryDark: "#357ABD",
  
  // Background Colors
  background: "#FFFFFF",
  surface: "#F8F9FA",
  card: "#F3EDE7",
  
  // Text Colors
  textPrimary: "#333333",
  textSecondary: "#666666",
  textLight: "#999999",
  textWhite: "#FFFFFF",
  
  // Status Colors
  success: "#28A745",
  warning: "#FFC107",
  error: "#DC3545",
  info: "#17A2B8",
  
  // Chip Colors
  chipSelected: "#4A90E2",
  chipUnselected: "#E9ECEF",
  chipTextSelected: "#FFFFFF",
  chipTextUnselected: "#495057",
  
  // Button Colors
  buttonPrimary: "#4A90E2",
  buttonSecondary: "#6C757D",
  buttonSuccess: "#28A745",
  buttonDanger: "#DC3545",
  
  // Border Colors
  border: "#DEE2E6",
  borderLight: "#E9ECEF",
  
  // Shadow Colors
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.2)",
};

// Typography
export const typography = {
  // Font Families
  fontFamily: {
    primary: "serif",
    secondary: "system",
    monospace: "monospace",
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Font Weights
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

// Spacing System
export const spacing = {
  // Base spacing units
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  
  // Screen-based spacing
  screenPadding: 20,
  sectionSpacing: 16,
  componentSpacing: 12,
  
  // Dynamic spacing based on screen size
  dynamicSpacing: height * 0.01,
  iconSpacing: height * 0.03,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Component-specific styles
export const components = {
  // Chip styles
  chip: {
    container: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      marginHorizontal: spacing.xs,
      marginVertical: spacing.xs,
      minHeight: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    selected: {
      backgroundColor: colors.chipSelected,
    },
    unselected: {
      backgroundColor: colors.chipUnselected,
    },
    text: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.primary,
      textAlign: "center",
    },
    textSelected: {
      color: colors.chipTextSelected,
    },
    textUnselected: {
      color: colors.chipTextUnselected,
    },
  },
  
  // Button styles
  button: {
    container: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 48,
      minWidth: 48,
    },
    primary: {
      backgroundColor: colors.buttonPrimary,
    },
    secondary: {
      backgroundColor: colors.buttonSecondary,
    },
    text: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.primary,
      fontWeight: "500",
      color: colors.textWhite,
      textAlign: "center",
    },
  },
  
  // Card styles
  card: {
    container: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginVertical: spacing.sm,
      ...shadows.md,
    },
  },
  
  // Text input styles
  textInput: {
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.primary,
      color: colors.textPrimary,
    },
  },
};

// Responsive dimensions
export const responsive = {
  screenHeight: height,
  screenWidth: width,
  textFieldHeight: height * 0.25,
  iconSize: Math.min(width, height) * 0.10,
  dynamicFontSize: (containerHeight: number) => containerHeight * 0.1,
  dynamicLineHeight: (fontSize: number) => fontSize * 1.5,
};

// Theme type
export interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  components: typeof components;
  responsive: typeof responsive;
}

// Theme object
export const theme: Theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  responsive,
};

export default theme; 