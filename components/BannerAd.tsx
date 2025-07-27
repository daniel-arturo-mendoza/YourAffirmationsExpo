import React from 'react';
import { View, Text, requireNativeComponent } from 'react-native';

// Import the native banner view
const StartIoBannerView = requireNativeComponent('StartIoBanner');

const BannerAd = () => {
  return (
    <View style={{
      height: 100,
      backgroundColor: '#ff0000',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0'
    }}>
      <StartIoBannerView style={{ flex: 1 }} />
    </View>
  );
};

export default BannerAd; 