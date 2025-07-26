import { Platform } from 'react-native';
// import { TestIds } from 'react-native-google-mobile-ads';

const TEST_BANNER_ID_IOS = 'ca-app-pub-3940256099942544/2934735716';
const TEST_BANNER_ID_ANDROID = 'ca-app-pub-3940256099942544/6300978111';

export const BANNER_AD_UNIT_ID =
  (__DEV__
    ? (Platform.OS === 'ios' ? TEST_BANNER_ID_IOS : TEST_BANNER_ID_ANDROID)
    : Platform.select({
        ios: 'ca-app-pub-xxx/yyy', // TODO: Replace with your real iOS Ad Unit ID
        android: 'ca-app-pub-xxx/yyy', // TODO: Replace with your real Android Ad Unit ID
      }) || (Platform.OS === 'ios' ? TEST_BANNER_ID_IOS : TEST_BANNER_ID_ANDROID)
  ); 