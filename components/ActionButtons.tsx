import React from "react";
import { View, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useResponsiveSizing } from "../hooks/useResponsiveSizing";
import KoFiButton from "./KoFiButton";

interface ActionButtonsProps {
  iconSize: number;
  isLoading: boolean;
  onReload: () => void;
  onCopy: () => void;
  onShare: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  iconSize,
  isLoading,
  onReload,
  onCopy,
  onShare,
}) => {
  const { componentSizes, spacing } = useResponsiveSizing();
  
  const responsiveStyles = createResponsiveStyles(componentSizes, spacing);
  
  return (
    <View style={responsiveStyles.iconContainer}>
      <Pressable 
        onPress={() => {
          console.log("🎯 Pressable reload pressed");
          onReload();
        }} 
        style={[responsiveStyles.iconButton, isLoading && { opacity: 0.5 }]}
        disabled={isLoading}
      >
        <MaterialCommunityIcons name="reload" size={iconSize} color={isLoading ? "#999" : "#5F8B66"} />
      </Pressable>

      <TouchableOpacity 
        onPress={() => {
          console.log("🎯 TouchableOpacity copy pressed");
          onCopy();
        }} 
        style={responsiveStyles.iconButton}
      >
        <MaterialCommunityIcons name="content-copy" size={iconSize} color="#BFA58A" />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => {
          console.log("🎯 TouchableOpacity share pressed");
          onShare();
        }} 
        style={responsiveStyles.iconButton}
      >
        <MaterialCommunityIcons name="share-variant" size={iconSize} color="#BFA58A" />
      </TouchableOpacity>

      <KoFiButton iconSize={iconSize} />
    </View>
  );
};

const createResponsiveStyles = (componentSizes: any, spacing: any) => StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.sm,
    gap: spacing.xl,
    marginBottom: spacing.xs,
    width: "100%", // Ensure full width
  },
  iconButton: {
    padding: componentSizes.buttonPadding,
    alignItems: "center",
    justifyContent: "center",
    minWidth: componentSizes.buttonHeight,
    minHeight: componentSizes.buttonHeight,
  },
}); 