import React from 'react';
import { TouchableOpacity, Image, Linking } from 'react-native';

interface KoFiButtonProps {
  iconSize: number;
}

const KoFiButton: React.FC<KoFiButtonProps> = ({ iconSize }) => {
  const KOFI_URL = "https://ko-fi.com/youraffirmations";

  const openKoFi = () => {
    Linking.openURL(KOFI_URL);
  };

  return (
    <TouchableOpacity 
      onPress={openKoFi} 
      style={{ 
        padding: iconSize * 0.3, // Match other button padding
        alignItems: "center",
        justifyContent: "center",
        minWidth: iconSize * 1.5, // Match other button size
        minHeight: iconSize * 1.5,
      }}
    >
      <Image 
        source={{ uri: "https://storage.ko-fi.com/cdn/cup-border.png" }} 
        style={{ width: iconSize, height: iconSize, resizeMode: "contain" }} 
      />
    </TouchableOpacity>
  );
};

export default KoFiButton; 