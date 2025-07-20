import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  TextInput,
  Animated,
  Dimensions,
  Easing,
  Clipboard,
  ToastAndroid, 
  Platform, 
  Alert,
  Share,
  Linking, 
  Image
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { getStoredUUID } from "./utils/uuidGenerator";
import KoFiButton from "./components/KoFiButton";
import { KOFI_URL, MOODS, ITEMS, TOPICS } from "./utils/constants";
import { copyToClipboard, shareAffirmation } from "./utils/affirmationUtils";
import { AffirmationService } from "./services/affirmationService";
import { useAffirmationAnimation } from "./hooks/useAffirmationAnimation";
import { useChipSelection } from "./hooks/useChipSelection";
import { useModalDialog } from "./hooks/useModalDialog";
import { SpecialAffirmationModal } from "./components/SpecialAffirmationModal";




const fetchUUID = async () => {
    const userUUID = await getStoredUUID();
    console.log("Generated UUID:", userUUID);
};

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
  const question1Ref = useRef("");
  const question2Ref = useRef("");

  const hasEarnedReward = useRef(false);

  const isAlternativeAdPath = useRef(false);



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

  const testGenerateAffirmation = async () => {
      console.log("🧪 Test function called");
      setAffirmation("🧪 Test affirmation generated successfully!");
  };

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

    <View style={styles.container}>
      
      <View style={styles.contentContainer}>
        
        {/* Title */}
        <Text style={styles.title}>Your Affirmations</Text>

        <Animated.View
          style={[
            styles.animatedChipContainer, // ✅ Keeps animation behavior
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
              contentInsetAdjustmentBehavior="automatic" // ✅ Centers items on iOS
              snapToAlignment="center" // ✅ Ensures alignment in the center
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

        {/* How do you feel? List */}
        <View style={{ marginBottom: dynamicSpacing }}>
          <Text style={styles.label}>How do you feel?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipList}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood}
                onPress={() => {
                  console.log("🎯 Mood chip pressed:", mood);
                  selectChip("mood", mood);
                }}
                style={[styles.chip, selectedMood === mood && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selectedMood === mood && styles.chipTextSelected]}>
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* What do you need? List */}
        <View style={{ marginBottom: dynamicSpacing }}>
          <Text style={styles.label}>What do you need?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipList}>
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => selectChip("item", item)}
                style={[styles.chip, selectedItem === item && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selectedItem === item && styles.chipTextSelected]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Your focus? List */}
        <View style={{ marginBottom: dynamicSpacing }}>
          <Text style={styles.label}>Your focus?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipList}>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic}
                onPress={() => selectChip("topic", topic)}
                style={[styles.chip, selectedTopic === topic && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selectedTopic === topic && styles.chipTextSelected]}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Affirmation Text Field */}
        <View style={styles.affirmationContainer}>
            <ScrollView 
              style={{ flex: 1 }} 
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              showsVerticalScrollIndicator={false} // ✅ Hides scroll bar for cleaner UI
            >
              {showCreatingText ? (
                  <Animated.Text style={[styles.creatingText, { opacity: fadeCreatingAnim }]}>
                      Creating Your Affirmation...
                  </Animated.Text>
              ) : (
                  <Animated.Text style={[styles.affirmationText, { opacity: fadeAnim }]}>
                      {affirmation}
                  </Animated.Text>
              )}
            </ScrollView>
        </View>

        {/* Buttons */}
        <View style={styles.iconContainer}>
          <Pressable 
            onPress={() => {
              console.log("🔄 Reload button pressed");
              updateAffirmation(generateAffirmation, setAffirmation);
            }} 
            style={[styles.iconButton, isLoading && { opacity: 0.5 }]}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="reload" size={iconSize} color={isLoading ? "#999" : "#5F8B66"} />
          </Pressable>

          <TouchableOpacity 
            onPress={() => {
              console.log("📋 Copy button pressed");
              copyToClipboard(affirmation);
            }} 
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="content-copy" size={iconSize} color="#BFA58A" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              console.log("📤 Share button pressed");
              shareAffirmation(affirmation);
            }} 
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="share-variant" size={iconSize} color="#BFA58A" />
          </TouchableOpacity>

          <KoFiButton iconSize={iconSize} />
        </View>

        {/* Test Button */}
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

      </View>

      {/* Banner Ad Placeholder - Temporarily disabled for debugging */}
      {/* <View style={styles.adContainer}>
        <BannerAd
          unitId={BANNER_AD_UNIT_ID} // Use TestIds.BANNER for testing, replace with BANNER_AD_UNIT_ID for production
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}/>
      </View> */}

    </View>
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
  selectedChipsContainer: {
    flexDirection: "row",
    //flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: hp("0.3%"),
    paddingVertical: hp("0.5%"),
    //overflow: "hidden",
    paddingHorizontal: 10, // ✅ Adds space around chips
    alignItems: "center", // ✅ Ensures vertical alignment
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
    marginRight: 8, // ✅ Ensures spacing between chips in horizontal scroll
    marginHorizontal: 4, // ✅ Equal spacing on both sides
  },
  selectedChipText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "#000",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "serif",
  },
  chipList: {
    marginBottom: hp("0.8%"),
  },
  animatedChipContainer: {
    overflow: "hidden",
    marginBottom: hp("0.5%"),
  },
  chip: {
    backgroundColor: "#E1D4C9",
    borderRadius: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    height: hp("4%"),  // 4% of screen height
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
  affirmationContainer: {
    backgroundColor: "#F3EDE7",
    borderRadius: 12,
    padding: 20,
    height: textFieldHeight, // 👈 Dynamically sized text field
    marginTop: hp("0.5%"),
    marginBottom: hp("0.5%"),
    elevation: 3,  // Adds soft shadow
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  affirmationText: {
    fontSize: textFieldHeight * 0.1,  // 👈 Dynamic font size
    textAlign: "center",
    fontFamily: "serif",
    color: "#555",
    flex: 1, // 👈 Makes text take up full height
    //flexGrow: 1,
    textAlignVertical: "center", // 👈 Centers text vertically
    //alignSelf: "center",
  },
  creatingText: {
    fontSize: 22,
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: "serif",
    color: "#666",
    alignSelf: "center",
    textAlignVertical: "center", // ✅ Ensures vertical centering on Android
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    //marginBottom: hp("0.5%"), // Extra space below buttons
  },
  button: {
    flex: 1,
    backgroundColor: "#C9B299",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "serif",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",  // Centers icons horizontally
    alignItems: "center",       // Aligns vertically in case of multi-line
    marginVertical: hp("0.5%"), // Adjusts spacing from other elements
    gap: width * 0.10,           // Adds spacing between icons dynamically
    marginBottom: hp("0.05%"),
  },
  iconButton: {
    padding: width * 0.01,       // Adds touchable padding
    alignItems: "center",
    justifyContent: "center",
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
