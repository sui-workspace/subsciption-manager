import sunbixService from '@/services/apis/sunbix';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  accessToken: null,
  isLoggedIn: false,
  username: null,
  address: null,
  systemConfig: null
};

const useUser = create(
  persist(
    (set, get) => ({
      user: initialState,
      login: async (address, signature) => {
        try {
          const { accessToken } = await sunbixService.login({ address, signature });
          set({ user: { ...get().user, accessToken } });
          const profile = await sunbixService.fetchMe();
          const user = jwtDecode(accessToken);
          const result = await sunbixService.fetchSystemConfig();
          let priceSol = 0;
          const fetchPrice = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
          const resultPrice = await fetchPrice.json();
          if (resultPrice) {
            priceSol = parseFloat(resultPrice.price).toFixed(4);
          }
          set({
            user: {
              ...get().user,
              ...user,
              accessToken,
              isLoggedIn: true,
              ...profile,
              systemConfig: { ...result, priceSol }
            }
          });
        } catch (error) {
          console.log({ error });
        }
      },
      logout: async () => {
        set({ user: initialState });
      },
      fetchData: async (isConnected, address) => {
        try {
          const user = get().user;
          let profile = {};
          if (isConnected && address && address === user?.address && user?.accessToken) {
            profile = await sunbixService.fetchMe();
          }
          const result = await sunbixService.fetchSystemConfig();
          let priceSol = 0;
          const fetchPrice = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
          const resultPrice = await fetchPrice.json();
          if (resultPrice) {
            priceSol = parseFloat(resultPrice.price).toFixed(4);
          }
          set({ user: { ...get().user, ...profile, systemConfig: { ...result, priceSol } } });
        } catch (error) {
          console.log({ error });
        }
      },
      updateUser: async (data) => {
        set({ user: { ...get().user, ...data } });
      }
    }),
    {
      name: 'sunbix'
    }
  )
);

export default useUser;
