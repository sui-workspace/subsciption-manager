import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import type { FC } from 'react';

import App from './App';
import './index.scss';
import { theme } from './utils/theme';

import { createNetworkConfig, lightTheme, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { AppContextProvider } from './context/AppContext';

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

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const AppRoot: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
      <WalletProvider
        theme={lightTheme}
        autoConnect={true}
        storage={localStorage}
        storageKey="sui-wallet"
        preferredWallets={["Sui Wallet"]}
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

createRoot(rootElement).render(<AppRoot />); 