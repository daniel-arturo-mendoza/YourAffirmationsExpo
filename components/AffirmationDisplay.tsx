import React from "react";
import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface AffirmationDisplayProps {
  affirmation: string;
  showCreatingText: boolean;
  fadeAnim: Animated.Value;
  fadeCreatingAnim: Animated.Value;
  textFieldHeight: number;
}

export const AffirmationDisplay: React.FC<AffirmationDisplayProps> = ({
  affirmation,
  showCreatingText,
  fadeAnim,
  fadeCreatingAnim,
  textFieldHeight,
}) => {
  // Calculate font size to cover 60% of the container height (50% bigger than 40%)
  const fontSize = Math.max(16, Math.min(36, textFieldHeight * 0.6));
  
  return (
    <View style={[styles.affirmationContainer, { height: textFieldHeight }]}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {showCreatingText ? (
          <Animated.Text style={[styles.creatingText, { opacity: fadeCreatingAnim, fontSize }]}>
            Creating Your Affirmation...
          </Animated.Text>
        ) : (
          <Animated.Text style={[styles.affirmationText, { opacity: fadeAnim, fontSize }]}>
            {affirmation}
          </Animated.Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  affirmationContainer: {
    backgroundColor: "#F3EDE7",
    borderRadius: 12,
    padding: 20,
    marginTop: hp("0.5%"),
    marginBottom: hp("0.5%"),
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