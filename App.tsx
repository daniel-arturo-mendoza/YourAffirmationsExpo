import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { MOODS, ITEMS, TOPICS } from "./utils/constants";
import { copyToClipboard, shareAffirmation } from "./utils/affirmationUtils";
import { AffirmationService } from "./services/affirmationService";
import { useAffirmationAnimation } from "./hooks/useAffirmationAnimation";
import { useChipSelection } from "./hooks/useChipSelection";
import { useModalDialog } from "./hooks/useModalDialog";
import { SpecialAffirmationModal } from "./components/SpecialAffirmationModal";
import { ChipSelectionSection } from "./components/ChipSelectionSection";
import { SelectedChipsDisplay } from "./components/SelectedChipsDisplay";
import { AffirmationDisplay } from "./components/AffirmationDisplay";
import { ActionButtons } from "./components/ActionButtons";
import { MainLayout } from "./components/MainLayout";






const screenHeight = Dimensions.get("window").height;
const { width, height } = Dimensions.get("window");
const dynamicSpacing = screenHeight * 0.01; // 3% of screen height
const textFieldHeight = screenHeight * 0.25; // 15% of screen height

const iconSize = Math.min(width, height) * 0.10; // Adjust multiplier for best size
const iconSpacing = height * 0.03; // Adjust vertical spacing

const clicksBeforeAds = 10;

// Define chip categories
const moods = MOODS;
const items = ITEMS;
const topics = TOPICS;

const App: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);

  // Modal state
  const { isModalVisible, toggleModal } = useModalDialog();
  const [specialAffirmation, setSpecialAffirmation] = useState("");




  const [affirmation, setAffirmation] = useState<string>(
    "Tap the green reload button to generate your affirmation!"
  );

  const {
    selectedMood,
    selectedItem,
    selectedTopic,
    selectedChips,
    moodAnim,
    itemAnim,
    topicAnim,
    chipContainerAnim,
    selectChip,
    getSelectedChips,
  } = useChipSelection();



  const { fadeAnim, fadeCreatingAnim, isLoading, showCreatingText, updateAffirmation } = useAffirmationAnimation();



  const generateAffirmation = async () => {
      const selectedChips = getSelectedChips();

      try {
          const affirmation = await AffirmationService.generateAffirmation(selectedChips);
          setAffirmation(affirmation);
      } catch (error) {
          console.error("❌ Error generating affirmation:", error);
          setAffirmation("❌ Error generating affirmation. Please try again.");
      }
  };



  const generateSpecialAffirmationAfterAd = async (need: string, tone: string) => {
      try {
          const affirmation = await AffirmationService.generateSpecialAffirmationAfterAd(need, tone);
          setSpecialAffirmation(affirmation);
      } catch (error) {
          console.error("❌ Error generating special affirmation after ad:", error);
          setSpecialAffirmation("❌ Error generating special affirmation. Please try again.");
      }
  };



  return (
    <MainLayout>
      <SelectedChipsDisplay
        selectedMood={selectedMood}
        selectedItem={selectedItem}
        selectedTopic={selectedTopic}
        moodAnim={moodAnim}
        itemAnim={itemAnim}
        topicAnim={topicAnim}
        chipContainerAnim={chipContainerAnim}
      />

      {/* Chip Selection Sections */}
      <ChipSelectionSection
        title="How do you feel?"
        chips={moods}
        selectedChip={selectedMood}
        onChipSelect={(chip) => selectChip("mood", chip)}
        dynamicSpacing={dynamicSpacing}
        onChipPress={(chip) => console.log("🎯 Mood chip pressed:", chip)}
      />

      <ChipSelectionSection
        title="What do you need?"
        chips={items}
        selectedChip={selectedItem}
        onChipSelect={(chip) => selectChip("item", chip)}
        dynamicSpacing={dynamicSpacing}
      />

      <ChipSelectionSection
        title="Your focus?"
        chips={topics}
        selectedChip={selectedTopic}
        onChipSelect={(chip) => selectChip("topic", chip)}
        dynamicSpacing={dynamicSpacing}
      />

      {/* Affirmation Display */}
      <AffirmationDisplay
        affirmation={affirmation}
        showCreatingText={showCreatingText}
        fadeAnim={fadeAnim}
        fadeCreatingAnim={fadeCreatingAnim}
        textFieldHeight={textFieldHeight}
      />

      {/* Action Buttons */}
      <ActionButtons
        iconSize={iconSize}
        isLoading={isLoading}
        onReload={() => {
          console.log("🔄 Reload button pressed");
          updateAffirmation(generateAffirmation, setAffirmation);
        }}
        onCopy={() => {
          console.log("📋 Copy button pressed");
          copyToClipboard(affirmation);
        }}
        onShare={() => {
          console.log("📤 Share button pressed");
          shareAffirmation(affirmation);
        }}
      />

      {/* Special Affirmation Button */}
      <View style={styles.specialAffirmationWrapper}>  
        <TouchableOpacity 
          onPress={() => {
            console.log("🧪 Test button pressed!");
            toggleModal();
          }} 
          style={[styles.specialAffirmationButton, isLoading && { opacity: 0.5 }]} 
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Get a Special Affirmation</Text>
        </TouchableOpacity>
      </View>

      {/* Special Affirmation Modal */}
      <SpecialAffirmationModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        onAffirmationGenerated={setSpecialAffirmation}
      />

      {/* Display Special Affirmation */}
      {specialAffirmation ? (
        <View style={styles.affirmationContainer}>
          <Text style={styles.affirmationText}>{specialAffirmation}</Text>
        </View>
      ) : null}
    </MainLayout>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F2", // Matching background
    justifyContent: "space-between",
    //paddingHorizontal: 20,
    //paddingTop: 40,
  },
  contentContainer: {
    flex: 1, // Makes sure this takes available space but doesn't push the ad down
    paddingHorizontal: wp("5%"),
    paddingTop: wp("10%"),
    paddingBottom: hp("10%"),
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: hp("2%"),
    paddingBottom: hp("2%"),
    fontFamily: "serif", // Adjust if you have a specific font
  },
  specialAffirmationWrapper: {
    marginTop: hp("3%"),
    marginBottom: hp("2%"),
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  testButton: {
    backgroundColor: "#F28B82",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  specialAffirmationButton: {
    backgroundColor: "#F28B82",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "serif",
  },
  affirmationContainer: {
    backgroundColor: "#F3EDE7",
    borderRadius: 12,
    padding: 20,
    height: textFieldHeight,
    marginTop: hp("0.5%"),
    marginBottom: hp("0.5%"),
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  affirmationText: {
    fontSize: textFieldHeight * 0.1,
    textAlign: "center",
    fontFamily: "serif",
    color: "#555",
    flex: 1,
    textAlignVertical: "center",
  },

  rewardedAdButton: {
    backgroundColor: "#F5A9B8",
    paddingVertical: hp("0.5%"), // Slightly bigger for better touch area
    //marginVertical: hp("20%"),
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "75%", // Slightly reduced width to look better
    elevation: 3, // Subtle shadow for depth
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
  adContainer: {
    position: "absolute", // ✅ Keeps the ad at the bottom
    bottom: 0,
    width: "100%",
    height: 60, // ✅ Ad banner height
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  adText: {
    fontSize: 16,
    color: "#555",
    fontFamily: "serif",
  },


});

export default App;
