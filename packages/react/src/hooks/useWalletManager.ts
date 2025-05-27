import { useStore } from 'zustand';

import { useTitanKitContext } from '../provider';

export const useWalletManager = () => {
  const store = useTitanKitContext();
  return useStore(store);
};
