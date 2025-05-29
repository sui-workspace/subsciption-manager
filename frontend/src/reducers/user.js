import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Create Zustand store with persist middleware
const useWalletStore = create()(
  persist(
    (set) => ({
      isConnected: false,
      accountAddress: null,
      walletName: null,
      setWalletState: ({ isConnected, accountAddress, walletName }) =>
        set({ isConnected, accountAddress, walletName }),
      clearWalletState: () => set({ isConnected: false, accountAddress: null, walletName: null }),
    }),
    {
      name: 'sui-wallet-connection', // Key for localStorage
    },
  ),
);

export default useWalletStore