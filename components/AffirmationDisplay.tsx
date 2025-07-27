import React from "react";
import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import { useResponsiveSizing } from "../hooks/useResponsiveSizing";

interface AffirmationDisplayProps {
  affirmation: string;
  showCreatingText: boolean;
  fadeAnim: Animated.Value;
  fadeCreatingAnim: Animated.Value;
  pulseAnim: Animated.Value;
  textFieldHeight: number;
}

export const AffirmationDisplay: React.FC<AffirmationDisplayProps> = ({
  affirmation,
  showCreatingText,
  fadeAnim,
  fadeCreatingAnim,
  pulseAnim,
  textFieldHeight,
}) => {
  console.log("🎬 AffirmationDisplay render:", { showCreatingText, affirmation: affirmation.substring(0, 50) });
  const { spacing } = useResponsiveSizing();
  // Calculate font size to cover 60% of the container height (50% bigger than 40%)
  const fontSize = Math.max(16, Math.min(36, textFieldHeight * 0.6));
  
  const responsiveStyles = createResponsiveStyles(spacing);
  
  return (
    <View style={[responsiveStyles.affirmationContainer, { height: textFieldHeight }]}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {showCreatingText ? (
          <Animated.Text style={[responsiveStyles.creatingText, { opacity: fadeCreatingAnim, transform: [{ scale: pulseAnim }], fontSize }]}>
            Creating Your Affirmation...
          </Animated.Text>
        ) : (
          <Animated.Text style={[responsiveStyles.affirmationText, { opacity: fadeAnim, fontSize }]}>
            {affirmation}
          </Animated.Text>
        )}
      </ScrollView>
    </View>
  );
};

const createResponsiveStyles = (spacing: any) => StyleSheet.create({
  affirmationContainer: {
    backgroundColor: "#F3EDE7",
    borderRadius: 12,
    padding: 20,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  affirmationText: {
    textAlign: "center",
    fontFamily: "serif",
    color: "#555",
    flex: 1,
    textAlignVertical: "center",
    lineHeight: 50,
  },
  creatingText: {
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: "serif",
    color: "#666",
    alignSelf: "center",
    textAlignVertical: "center",
  },
}); 