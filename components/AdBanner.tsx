// AdMob banner temporarily disabled for testing crash issue
import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID } from '../constants/adMob';

const AdBanner = () => (
  <View style={{ alignItems: 'center' }}>
    <BannerAd
      unitId={BANNER_AD_UNIT_ID}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      onAdLoaded={() => console.log('Banner ad loaded')}
      onAdFailedToLoad={(error: any) => console.error('Banner ad failed to load', error)}
    />
  </View>
);

export default AdBanner; 