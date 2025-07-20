import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface ChipSelectionSectionProps {
  title: string;
  chips: string[];
  selectedChip: string | null;
  onChipSelect: (chip: string) => void;
  dynamicSpacing: number;
  onChipPress?: (chip: string) => void; // Optional callback for logging
}

export const ChipSelectionSection: React.FC<ChipSelectionSectionProps> = ({
  title,
  chips,
  selectedChip,
  onChipSelect,
  dynamicSpacing,
  onChipPress,
}) => {
  const handleChipPress = (chip: string) => {
    onChipPress?.(chip);
    onChipSelect(chip);
  };

  return (
    <View style={{ marginBottom: dynamicSpacing }}>
      <Text style={styles.label}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipList}>
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip}
            onPress={() => handleChipPress(chip)}
            style={[styles.chip, selectedChip === chip && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selectedChip === chip && styles.chipTextSelected]}>
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "serif",
  },
  chipList: {
    marginBottom: hp("0.8%"),
  },
  chip: {
    backgroundColor: "#E1D4C9",
    borderRadius: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    height: hp("4%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("3%"),
  },
  chipSelected: {
    backgroundColor: "#BFA58A",
  },
  chipText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "serif",
  },
  chipTextSelected: {
    color: "#FFF",
  },
}); 