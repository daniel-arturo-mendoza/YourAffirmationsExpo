import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-get-random-values"; // 🔹 This enables UUID generation
import { v4 as uuidv4 } from 'uuid';

export const getStoredUUID = async (): Promise<string> => {
    try {
        let userUUID = await AsyncStorage.getItem('user_uuid');

        if (!userUUID) {
            userUUID = uuidv4(); // Generate a new UUID
            await AsyncStorage.setItem('user_uuid', userUUID); // Store persistently
        }

        return userUUID;
    } catch (error) {
        console.error("Error accessing AsyncStorage for UUID:", error);
        return "00000000-0000-0000-0000-000000000000"; // Fallback UUID
    }
};
