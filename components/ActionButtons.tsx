import React from "react";
import { View, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
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
  return (
    <View style={styles.iconContainer}>
      <Pressable 
        onPress={onReload} 
        style={[styles.iconButton, isLoading && { opacity: 0.5 }]}
        disabled={isLoading}
      >
        <MaterialCommunityIcons name="reload" size={iconSize} color={isLoading ? "#999" : "#5F8B66"} />
      </Pressable>

      <TouchableOpacity 
        onPress={onCopy} 
        style={styles.iconButton}
      >
        <MaterialCommunityIcons name="content-copy" size={iconSize} color="#BFA58A" />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onShare} 
        style={styles.iconButton}
      >
        <MaterialCommunityIcons name="share-variant" size={iconSize} color="#BFA58A" />
      </TouchableOpacity>

      <KoFiButton iconSize={iconSize} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp("0.5%"),
    gap: wp("10%"),
    marginBottom: hp("0.05%"),
  },
  iconButton: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
  },
}); 