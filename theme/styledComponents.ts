import { StyleSheet } from "react-native";
import { theme } from "./theme";

// Styled components using theme
export const styledComponents = {
  // Chip styles
  chip: {
    container: (isSelected: boolean) => ({
      ...theme.components.chip.container,
      ...(isSelected ? theme.components.chip.selected : theme.components.chip.unselected),
    }),
    text: (isSelected: boolean) => ({
      ...theme.components.chip.text,
      ...(isSelected ? theme.components.chip.textSelected : theme.components.chip.textUnselected),
    }),
  },

  // Button styles
  button: {
    primary: {
      ...theme.components.button.container,
      ...theme.components.button.primary,
    },
    secondary: {
      ...theme.components.button.container,
      ...theme.components.button.secondary,
    },
    text: {
      ...theme.components.button.text,
      fontWeight: "500" as const,
      textAlign: "center" as const,
    },
  },

  // Card styles
  card: {
    container: theme.components.card.container,
  },

  // Text input styles
  textInput: {
    container: theme.components.textInput.container,
    text: theme.components.textInput.text,
  },

  // Layout styles
  layout: {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.screenPadding,
    },
    section: {
      marginVertical: theme.spacing.sectionSpacing,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
  },

  // Text styles
  text: {
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: "bold" as const,
      color: theme.colors.textPrimary,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: "500" as const,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    body: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.primary,
      color: theme.colors.textPrimary,
      lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    },
    caption: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.primary,
      color: theme.colors.textLight,
      textAlign: "center",
    },
  },
};

// StyleSheet for performance
export const globalStyles = StyleSheet.create({
  // Global container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Safe area
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Scroll view
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Content container
  contentContainer: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.lg,
  },

  // Loading overlay
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },
});

export default styledComponents; 