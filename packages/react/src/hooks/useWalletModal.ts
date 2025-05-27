import { useWalletManager } from './useWalletManager';

export const useWalletModal = () => {
  const { modalIsOpen, openModal, closeModal } = useWalletManager();
  return {
    modalIsOpen, open: openModal, close: closeModal
  };
};