import wagmiConfig from '@/utils/wagmiConfig';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { WagmiProvider } from 'wagmi';

import App from './App.jsx';
import './index.scss';
import { theme } from './utils/theme.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

createRoot(document.getElementById('root')).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#ff97d6'
            }
          }}
        >
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </ConfigProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
