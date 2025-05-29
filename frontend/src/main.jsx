
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';

import App from './App.jsx';
import './index.scss';
import { theme } from './utils/theme.js';

import { createNetworkConfig, lightTheme, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';

import { getFullnodeUrl } from '@mysten/sui/client';
import { createContext } from 'react';
import { AppContextProvider } from './context/AppContext.jsx';
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
});



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});



createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
      <WalletProvider
        theme={lightTheme}
        autoConnect={true}
        storage={localStorage}
        storageKey="sui-wallet"
        preferredWallets={["Sui Wallet"]}
        stashedWallet={{
          name: 'Bucket Protocol',
        }}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#ff97d6'
            }
          }}
        >
          <ThemeProvider theme={theme}>
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </ThemeProvider>
        </ConfigProvider>
      </WalletProvider>
    </SuiClientProvider>
  </QueryClientProvider>
);
