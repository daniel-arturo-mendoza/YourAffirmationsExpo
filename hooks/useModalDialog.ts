import { useState } from "react";

export const useModalDialog = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return {
    isModalVisible,
    toggleModal,
  };
}; 