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

const API_APP_LAMBDA_URL = "https://iw26yfkgne.execute-api.us-east-1.amazonaws.com/Prod/affirmation";
const KOFI_URL = "https://ko-fi.com/youraffirmations";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
const moods = ["Happy", "Motivated", "Calm", "Confident", "Stressed", "Sad"];
const items = ["Success", "Love", "Health", "Wealth", "Money", "Travel"];
const topics = ["Mindset", "Productivity", "Relationships", "Happiness", "Prosperity", "Ownership"];

const App: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);

  //const related to the modal for rewarded Ad
  const [isModalVisible, setModalVisible] = useState(false);
  const [question1, setQuestion1] = useState(""); // User input for Q1
  const [question2, setQuestion2] = useState(""); // User input for Q2
  const [specialAffirmation, setSpecialAffirmation] = useState("");
  const question1Ref = useRef("");
  const question2Ref = useRef("");

  const hasEarnedReward = useRef(false);

  const isAlternativeAdPath = useRef(false);

  // Toggle modal visibility
  const toggleModal = () => setModalVisible(!isModalVisible);

  const openKoFi = () => {
    Linking.openURL(KOFI_URL);
  };

  const KoFiButton = () => {
    return (
      <TouchableOpacity onPress={openKoFi} style={styles.kofiButton}>
        <Image source={{ uri: "https://storage.ko-fi.com/cdn/cup-border.png" }} style={styles.kofiIcon} />
      </TouchableOpacity>
    );
  };

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [affirmation, setAffirmation] = useState<string>(
    "Tap the green reload button to generate your affirmation!"
  );

  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const chipContainerAnim = useRef(new Animated.Value(0)).current; // Initial height is 0

  // Animated values for chip movement
  const moodAnim = useRef(new Animated.Value(0)).current;
  const itemAnim = useRef(new Animated.Value(0)).current;
  const topicAnim = useRef(new Animated.Value(0)).current;

  const selectChip = (category: "mood" | "item" | "topic", chip: string) => {
    let newChip = null;

    if (category === "mood") {
      if (selectedMood === chip) return; // Prevent deselecting last chip
      setSelectedMood(chip); // Update state immediately
      animateChip(moodAnim);
    }
    if (category === "item") {
      if (selectedItem === chip) return;
      setSelectedItem(chip);
      animateChip(itemAnim);
    }
    if (category === "topic") {
      if (selectedTopic === chip) return;
      setSelectedTopic(chip);
      animateChip(topicAnim);
    }
  };

  // Determine the number of selected chips
  useEffect(() => {
    const selectedCount = (selectedMood ? 1 : 0) + (selectedItem ? 1 : 0) + (selectedTopic ? 1 : 0);

    Animated.timing(chipContainerAnim, {
      toValue: selectedCount > 0 ? 1 : 0, // Expand when at least 1 chip is selected
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedMood, selectedItem, selectedTopic]);

  const animateChip = (animation: Animated.Value) => {
    animation.setValue(0); // Reset animation before starting
    Animated.timing(animation, {
      toValue: 1,
      duration: 300, // Adjust for smoothness
      useNativeDriver: true,
    }).start();
  };

  const fadeAnim = useRef(new Animated.Value(1)).current; // 👈 Opacity animation value
  const [isLoading, setIsLoading] = useState(false);
  const [showCreatingText, setShowCreatingText] = useState(false);
  const fadeCreatingAnim = useRef(new Animated.Value(0)).current; // Controls the loading text opacity

  const updateAffirmation = async (fetchFunction: () => Promise<void>) => {
      setIsLoading(true); // Disable button
      setShowCreatingText(false);

      // 🔹 Fade out existing text
      Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
      }).start();

      // 🔹 Wait for fade out to complete
      await wait(300);

      // 🔹 Show "Creating..." text
      setShowCreatingText(true);
      Animated.timing(fadeCreatingAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
      }).start();

      try {
          // 🔹 Execute the provided function
          await fetchFunction();

          // 🔹 Fade out "Creating..." text
          Animated.timing(fadeCreatingAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
          }).start();

          await wait(300);
          setShowCreatingText(false);

          // 🔹 Fade in new text
          Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
          }).start();

      } catch (error) {
          console.error("❌ Error in updateAffirmation:", error);
          setAffirmation("❌ Error generating affirmation. Please try again.");
          
          // 🔹 Fade out "Creating..." text
          Animated.timing(fadeCreatingAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
          }).start();
          
          await wait(300);
          setShowCreatingText(false);

          // 🔹 Fade in error text
          Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
          }).start();
      } finally {
          setIsLoading(false); // Re-enable button
      }
  };

  const testGenerateAffirmation = async () => {
      console.log("🧪 Test function called");
      setAffirmation("🧪 Test affirmation generated successfully!");
  };

  const generateAffirmation = async () => {
      console.log("🎯 Generating affirmation...");
      
      const selectedChips = [];
      if (selectedMood) selectedChips.push(selectedMood);
      if (selectedItem) selectedChips.push(selectedItem);
      if (selectedTopic) selectedChips.push(selectedTopic);

      if (selectedChips.length === 0) {
          setAffirmation("Please select at least one category to generate an affirmation!");
          return;
      }

      const requestBody = {
          chips: selectedChips,
          userUUID: await getStoredUUID()
      };

      console.log("📤 Request body:", requestBody);

      try {
          const response = await fetch(API_APP_LAMBDA_URL, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("📥 Response data:", data);

          if (data.affirmation) {
              setAffirmation(data.affirmation);
          } else {
              throw new Error("No affirmation in response");
          }

      } catch (error) {
          console.error("❌ Error generating affirmation:", error);
          setAffirmation("❌ Error generating affirmation. Please try again.");
      }
  };

  const generateSpecialAffirmation = async () => {
      console.log("🎯 Generating special affirmation...");
      
      if (!question1.trim() || !question2.trim()) {
          setSpecialAffirmation("Please fill in both questions to generate a special affirmation!");
          return;
      }

      const requestBody = {
          need: question1.trim(),
          tone: question2.trim(),
          userUUID: await getStoredUUID()
      };

      console.log("📤 Special request body:", requestBody);

      try {
          const response = await fetch(API_APP_LAMBDA_URL, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("📥 Special response data:", data);

          if (data.affirmation) {
              setSpecialAffirmation(data.affirmation);
          } else {
              throw new Error("No affirmation in response");
          }

      } catch (error) {
          console.error("❌ Error generating special affirmation:", error);
          setSpecialAffirmation("❌ Error generating special affirmation. Please try again.");
      }
  };

  const generateSpecialAffirmationAfterAd = async (need: string, tone: string) => {
      console.log("🎯 Generating special affirmation after ad...");
      
      if (!need.trim() || !tone.trim()) {
          setSpecialAffirmation("Please fill in both questions to generate a special affirmation!");
          return;
      }

      const requestBody = {
          need: need.trim(),
          tone: tone.trim(),
          userUUID: await getStoredUUID()
      };

      console.log("📤 After-ad request body:", requestBody);

      try {
          const response = await fetch(API_APP_LAMBDA_URL, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("📥 After-ad response data:", data);

          if (data.affirmation) {
              setSpecialAffirmation(data.affirmation);
          } else {
              throw new Error("No affirmation in response");
          }

      } catch (error) {
          console.error("❌ Error generating special affirmation after ad:", error);
          setSpecialAffirmation("❌ Error generating special affirmation. Please try again.");
      }
  };

  const copyToClipboard = () => {
      Clipboard.setString(affirmation);
      if (Platform.OS === 'android') {
          ToastAndroid.show('Affirmation copied to clipboard!', ToastAndroid.SHORT);
      } else {
          Alert.alert('Copied!', 'Affirmation copied to clipboard!');
      }
  };

  const shareAffirmation = async () => {
      try {
          await Share.share({
              message: affirmation,
              title: 'My Affirmation'
          });
      } catch (error) {
          console.error('Error sharing:', error);
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
              updateAffirmation(generateAffirmation);
            }} 
            style={[styles.iconButton, isLoading && { opacity: 0.5 }]}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="reload" size={iconSize} color={isLoading ? "#999" : "#5F8B66"} />
          </Pressable>

          <TouchableOpacity 
            onPress={() => {
              console.log("📋 Copy button pressed");
              copyToClipboard();
            }} 
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="content-copy" size={iconSize} color="#BFA58A" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              console.log("📤 Share button pressed");
              shareAffirmation();
            }} 
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="share-variant" size={iconSize} color="#BFA58A" />
          </TouchableOpacity>

          <KoFiButton />
        </View>

        {/* Rewarded Ad Button */}
        <View style={styles.specialAffirmationWrapper}>  
          <TouchableOpacity 
            onPress={() => {
              console.log("🎯 Special affirmation button pressed");
              generateSpecialAffirmation();
            }} 
            style={[styles.confirmButton, isLoading && { opacity: 0.5 }]} 
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Get a Special Affirmation</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet Modal */}
        <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Personalize Your Affirmation</Text>

            {/* Question 1 */}
            <Text style={styles.modalLabel}>What do you need most right now?</Text>
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
            <TouchableOpacity onPress={generateSpecialAffirmation} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Generate</Text>
            </TouchableOpacity>
          </View>
        </Modal>

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
    marginBottom: hp("2%"),
    alignItems: "center",
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
  //start - syle conf for rewarded Ad modal
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "serif",
  },
  modalLabel: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "serif",
  },
  input: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "serif",
  },
  confirmButton: {
    marginTop: hp("0.6%"),
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
  //end - syle conf for rewarded Ad modal
  adInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3EDE7",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
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
  kofiContainer: {
    alignItems: "flex-start", // 🔹 Aligns to the left inside parent
  },
  kofiButton: {
    padding: width * 0.02, // Adds some tappable area like the other icons
  },
  kofiIcon: {
    width: iconSize,
    height: iconSize,
    resizeMode: "contain",
  },
});

export default App;
