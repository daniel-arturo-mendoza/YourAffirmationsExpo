import React from "react";
import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import { useResponsiveSizing } from "../hooks/useResponsiveSizing";

interface SelectedChipsDisplayProps {
  selectedMood: string | null;
  selectedItem: string | null;
  selectedTopic: string | null;
  moodAnim: Animated.Value;
  itemAnim: Animated.Value;
  topicAnim: Animated.Value;
  chipContainerAnim: Animated.Value;
}

export const SelectedChipsDisplay: React.FC<SelectedChipsDisplayProps> = ({
  selectedMood,
  selectedItem,
  selectedTopic,
  moodAnim,
  itemAnim,
  topicAnim,
  chipContainerAnim,
}) => {
  const { componentSizes, spacing } = useResponsiveSizing();
  
  const responsiveStyles = createResponsiveStyles(componentSizes, spacing);
  
  return (
    <Animated.View
      style={[
        responsiveStyles.animatedChipContainer,
        {
          height: chipContainerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, componentSizes.containerHeight],
          }),
          opacity: chipContainerAnim,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={responsiveStyles.selectedChipsContainer}
        contentInsetAdjustmentBehavior="automatic"
        snapToAlignment="center"
        bounces={false}
        alwaysBounceHorizontal={false}
      >
        {selectedMood && (
          <Animated.View style={[responsiveStyles.selectedChip, { opacity: moodAnim }]}>
            <Text style={responsiveStyles.selectedChipText}>{selectedMood}</Text>
          </Animated.View>
        )}

        {selectedItem && (
          <Animated.View style={[responsiveStyles.selectedChip, { opacity: itemAnim }]}>
            <Text style={responsiveStyles.selectedChipText}>{selectedItem}</Text>
          </Animated.View>
        )}

        {selectedTopic && (
          <Animated.View style={[responsiveStyles.selectedChip, { opacity: topicAnim }]}>
            <Text style={responsiveStyles.selectedChipText}>{selectedTopic}</Text>
          </Animated.View>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const createResponsiveStyles = (componentSizes: any, spacing: any) => StyleSheet.create({
  animatedChipContainer: {
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  selectedChipsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    minWidth: "100%",
    flexGrow: 1,
  },
  selectedChip: {
    backgroundColor: "#D9C4B1",
    paddingVertical: componentSizes.chipPadding,
    paddingHorizontal: componentSizes.chipPadding,
    borderRadius: 15,
    margin: spacing.xs,
    marginRight: spacing.sm,
    marginHorizontal: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    minHeight: componentSizes.chipHeight,
  },
  selectedChipText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#000",
  },
}); 