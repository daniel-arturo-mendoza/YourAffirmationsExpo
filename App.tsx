import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { MOODS, ITEMS, TOPICS } from "./utils/constants";
import { ThemeProvider } from "./theme/ThemeContext";
import { useTheme } from "./theme/ThemeContext";
import { styledComponents, globalStyles } from "./theme/styledComponents";
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
// import AdBanner from './components/AdBanner';






// Define chip categories
const moods = MOODS;
const items = ITEMS;
const topics = TOPICS;

const ThemedApp: React.FC = () => {
  const { theme } = useTheme();
  
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

  const { fadeAnim, fadeCreatingAnim, pulseAnim, isLoading: animationLoading, showCreatingText, updateAffirmation } = useAffirmationAnimation();

  // Event handlers
  const { handleReload, handleCopy, handleShare, handleSpecialAffirmation, handleChipPress } = useEventHandlers({
    affirmation,
    generateAffirmation,
    updateAffirmation, // <-- pass this
    setAffirmation,
    toggleModal,
    getSelectedChips,
  });

  
  const themedStyles = createThemedStyles(theme);
  
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
        pulseAnim={pulseAnim}
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
      <View style={themedStyles.specialAffirmationWrapper}>  
        <TouchableOpacity 
          onPress={handleSpecialAffirmation} 
          style={[
            themedStyles.specialAffirmationButton,
            isLoading && globalStyles.disabled
          ]} 
          disabled={isLoading}
        >
          <Text style={themedStyles.buttonText}>Get a Special Affirmation</Text>
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
        <View style={themedStyles.affirmationContainer}>
          <Text style={themedStyles.affirmationText}>{specialAffirmation}</Text>
        </View>
      ) : null}

      {/* Banner Ad anchored at the bottom */}
      {/* Remove the AdBanner and adContainer View */}
    </MainLayout>
  );
};

// Themed styles using theme system
const createThemedStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: wp("10%"),
    paddingBottom: hp("10%"),
    justifyContent: "space-evenly",
  },
  title: {
    ...styledComponents.text.title,
    paddingTop: hp("2%"),
    paddingBottom: hp("2%"),
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
    backgroundColor: theme.colors.primary,
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
    borderRadius: theme.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  specialAffirmationButton: {
    backgroundColor: "#F28B82", // Original color
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 25, // Original border radius
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18, // Original font size
    fontWeight: "bold" as const,
    color: "#000", // Original text color
    fontFamily: "serif",
    textAlign: "center" as const,
  },
  affirmationContainer: {
    ...styledComponents.card.container,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  affirmationText: {
    ...styledComponents.text.body,
    textAlign: "center",
    flex: 1,
    textAlignVertical: "center",
  },
  rewardedAdButton: {
    backgroundColor: theme.colors.warning,
    paddingVertical: hp("0.5%"),
    borderRadius: theme.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    width: "75%",
    ...theme.shadows.md,
  },
  adInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  adInfoText: {
    ...styledComponents.text.caption,
    marginLeft: theme.spacing.sm,
    fontWeight: "600" as const,
  },
  adContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  adText: {
    ...styledComponents.text.body,
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};

export default App;
