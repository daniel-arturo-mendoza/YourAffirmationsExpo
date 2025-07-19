import { Clipboard, ToastAndroid, Platform, Alert, Share } from 'react-native';

export const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    if (Platform.OS === 'android') {
        ToastAndroid.show('Affirmation copied to clipboard!', ToastAndroid.SHORT);
    } else {
        Alert.alert('Copied!', 'Affirmation copied to clipboard!');
    }
};

export const shareAffirmation = async (affirmation: string) => {
    try {
        await Share.share({
            message: affirmation,
            title: 'My Affirmation'
        });
    } catch (error) {
        console.error('Error sharing:', error);
    }
}; 