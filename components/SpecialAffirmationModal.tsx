import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AffirmationService } from '../services/affirmationService';

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
      console.error("❌ Error generating special affirmation: Please fill in both questions to generate a special affirmation!");
      return;
    }

    setIsLoading(true);
    try {
      const affirmation = await AffirmationService.generateSpecialAffirmation(question1, question2);
      onAffirmationGenerated(affirmation);
      onClose();
      // Reset form
      setQuestion1("");
      setQuestion2("");
    } catch (error) {
      console.error("❌ Error generating special affirmation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Personalize Your Affirmation</Text>

        {/* Question 1 */}
        <Text style={styles.firstModalLabel}>What do you need most right now?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Confidence for my job interview"
          value={question1}
          onChangeText={setQuestion1}
          maxLength={50}
        />

        {/* Question 2 */}
        <Text style={styles.modalLabel}>How do you want it to feel?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Powerful and inspiring"
          value={question2}
          onChangeText={setQuestion2}
          maxLength={50}
        />

        {/* 🔹 New Message to Inform About Ad */}
        <View style={styles.adInfoContainer}>
          <MaterialCommunityIcons name="play-circle-outline" size={24} color="#C9B299" />
          <Text style={styles.adInfoText}>
            🎥 You'll watch a short ad before receiving your personalized affirmation!
          </Text>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity 
          onPress={generateSpecialAffirmation} 
          style={[styles.confirmButton, isLoading && { opacity: 0.5 }]}
          disabled={isLoading}
        >
          <Text style={styles.confirmButtonText}>Generate</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    width: "90%",
    height: "40%", // Takes 40% of screen height
    justifyContent: "space-between", // Distributes content evenly
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "serif",
    textAlign: "center",
  },
  firstModalLabel: {
    marginBottom: 10,
    marginTop: 35,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "serif",
  },
  modalLabel: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "serif",
  },
  input: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: "serif",
    minHeight: 50, // Makes inputs taller
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: "#C9B299",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "serif",
  },
  adInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3EDE7",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  adInfoText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10, // Ensures space between icon & text
    fontWeight: "600",
    fontFamily: "serif",
  },
}); 