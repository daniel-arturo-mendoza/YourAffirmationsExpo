import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { AffirmationService } from "../services/affirmationService";

interface SpecialAffirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAffirmationGenerated: (affirmation: string) => void;
}

export const SpecialAffirmationModal: React.FC<SpecialAffirmationModalProps> = ({
  isVisible,
  onClose,
  onAffirmationGenerated,
}) => {
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateSpecialAffirmation = async () => {
    if (!question1.trim() || !question2.trim()) {
      Alert.alert("Error", "Please fill in both questions to generate a special affirmation!");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🎯 Generating special affirmation...");
      const affirmation = await AffirmationService.generateSpecialAffirmation(question1, question2);
      onAffirmationGenerated(affirmation);
      onClose();
      setQuestion1("");
      setQuestion2("");
    } catch (error) {
      console.error("❌ Error generating special affirmation:", error);
      Alert.alert("Error", "Failed to generate special affirmation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContent}>
        <View style={styles.handle} />
        
        <Text style={styles.modalTitle}>Get a Special Affirmation</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>What do you need help with?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., I need help with my confidence"
            value={question1}
            onChangeText={setQuestion1}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>What tone would you like?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., encouraging, motivational, gentle"
            value={question2}
            onChangeText={setQuestion2}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.generateButton, isLoading && styles.generateButtonDisabled]}
          onPress={generateSpecialAffirmation}
          disabled={isLoading}
        >
          <Text style={styles.generateButtonText}>
            {isLoading ? "Generating..." : "Generate Special Affirmation"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#F9F6F2",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: hp("40%"),
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D0D0D0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp("4%"),
    color: "#333",
    fontFamily: "serif",
  },
  inputContainer: {
    marginBottom: hp("3%"),
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
    fontFamily: "serif",
  },
  textInput: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontFamily: "serif",
    textAlignVertical: "top",
  },
  generateButton: {
    backgroundColor: "#F28B82",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    fontFamily: "serif",
  },
  cancelButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "serif",
  },
}); 