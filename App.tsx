import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { MOODS, ITEMS, TOPICS } from "./utils/constants";
import { useAffirmationAnimation } from "./hooks/useAffirmationAnimation";
import { useChipSelection } from "./hooks/useChipSelection";
import { useModalDialog } from "./hooks/useModalDialog";
import { useAffirmationGeneration } from "./hooks/useAffirmationGeneration";
import { useDimensions } from "./hooks/useDimensions";
import { useEventHandlers } from "./hooks/useEventHandlers";
import { SpecialAffirmationModal } from "./components/SpecialAffirmationModal";
import { ChipSelectionSection } from "./components/ChipSelectionSection";
import { SelectedChipsDisplay } from "./components/SelectedChipsDisplay";
import { AffirmationDisplay } from "./components/AffirmationDisplay";
import { ActionButtons } from "./components/ActionButtons";
import { MainLayout } from "./components/MainLayout";






// Define chip categories
const moods = MOODS;
const items = ITEMS;
const topics = TOPICS;

const App: React.FC = () => {
  // Hooks for business logic
  const { dynamicSpacing, textFieldHeight, iconSize } = useDimensions();
  const { affirmation, specialAffirmation, isLoading, generateAffirmation, setAffirmation, setSpecialAffirmation } = useAffirmationGeneration();
  const { isModalVisible, toggleModal } = useModalDialog();
  
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

  const { fadeAnim, fadeCreatingAnim, showCreatingText, updateAffirmation } = useAffirmationAnimation();

  // Event handlers
  const { handleReload, handleCopy, handleShare, handleSpecialAffirmation, handleChipPress } = useEventHandlers({
    affirmation,
    generateAffirmation,
    setAffirmation,
    toggleModal,
    getSelectedChips,
  });



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
        onChipPress={(chip) => handleChipPress(chip, "Mood")}
      />

      <ChipSelectionSection
        title="What do you need?"
        chips={items}
        selectedChip={selectedItem}
        onChipSelect={(chip) => selectChip("item", chip)}
        dynamicSpacing={dynamicSpacing}
        onChipPress={(chip) => handleChipPress(chip, "Item")}
      />

      <ChipSelectionSection
        title="Your focus?"
        chips={topics}
        selectedChip={selectedTopic}
        onChipSelect={(chip) => selectChip("topic", chip)}
        dynamicSpacing={dynamicSpacing}
        onChipPress={(chip) => handleChipPress(chip, "Topic")}
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
        onReload={handleReload}
        onCopy={handleCopy}
        onShare={handleShare}
      />

      {/* Special Affirmation Button */}
      <View style={styles.specialAffirmationWrapper}>  
        <TouchableOpacity 
          onPress={handleSpecialAffirmation} 
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
