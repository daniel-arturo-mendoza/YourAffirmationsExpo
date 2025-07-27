import React from 'react';
import { View, requireNativeComponent, Dimensions } from 'react-native';
import { colors } from '../theme/theme';

// Import the native banner view
const StartIoBannerView = requireNativeComponent('StartIoBanner');

const { width: screenWidth } = Dimensions.get('window');

const BannerAd = () => {
  // Let Start.io determine the optimal banner size automatically
  // Use a reasonable minimum height but let the native component size itself
  const bannerHeight = 100; // Minimum height, but native component will override
  
  return (
    <View style={{
      height: bannerHeight,
      backgroundColor: colors.background, // Use app's background color
      borderTopWidth: 1,
      borderTopColor: colors.border, // Use app's border color
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <StartIoBannerView style={{ 
        flex: 1, 
        width: '100%',
        height: '100%',
      }} />
    </View>
  );
};

export default BannerAd; 