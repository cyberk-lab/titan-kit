
import { useStore } from 'zustand';

import { useInterchainWalletContext } from '../provider';

export const useWalletManager = () => {
  const store = useInterchainWalletContext();
  return useStore(store);
};