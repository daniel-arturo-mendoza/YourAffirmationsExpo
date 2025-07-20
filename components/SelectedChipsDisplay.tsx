import React from "react";
import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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
  return (
    <Animated.View
      style={[
        styles.animatedChipContainer,
        {
          height: chipContainerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 60],
          }),
          opacity: chipContainerAnim,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectedChipsContainer}
        contentInsetAdjustmentBehavior="automatic"
        snapToAlignment="center"
      >
        {selectedMood && (
          <Animated.View style={[styles.selectedChip, { opacity: moodAnim }]}>
            <Text style={styles.selectedChipText}>{selectedMood}</Text>
          </Animated.View>
        )}

        {selectedItem && (
          <Animated.View style={[styles.selectedChip, { opacity: itemAnim }]}>
            <Text style={styles.selectedChipText}>{selectedItem}</Text>
          </Animated.View>
        )}

        {selectedTopic && (
          <Animated.View style={[styles.selectedChip, { opacity: topicAnim }]}>
            <Text style={styles.selectedChipText}>{selectedTopic}</Text>
          </Animated.View>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedChipContainer: {
    overflow: "hidden",
    marginBottom: hp("0.5%"),
  },
  selectedChipsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: hp("0.3%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: 10,
    alignItems: "center",
    minWidth: "100%",
  },
  selectedChip: {
    backgroundColor: "#D9C4B1",
    paddingVertical: hp("0.8%"),
    paddingHorizontal: wp("3%"),
    borderRadius: 15,
    margin: wp("1%"),
    fontSize: 16,
    fontFamily: "serif",
    color: "#000",
    marginRight: 8,
    marginHorizontal: 4,
  },
  selectedChipText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#000",
  },
}); 