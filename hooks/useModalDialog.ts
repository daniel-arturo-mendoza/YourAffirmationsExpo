import { useState } from 'react';

interface UseModalDialogReturn {
  isModalVisible: boolean;
  toggleModal: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalDialog = (): UseModalDialogReturn => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return {
    isModalVisible,
    toggleModal,
    openModal,
    closeModal,
  };
}; 