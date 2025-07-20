import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.title}>Your Affirmations</Text>
        
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F2",
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
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
    fontFamily: "serif",
  },
}); 