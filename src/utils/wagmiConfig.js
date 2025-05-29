import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bscTestnet } from 'wagmi/chains';

import { IS_MAINNET } from './constants';

const wagmiConfig = getDefaultConfig({
  appName: 'SUNBIX',
  projectId: '63aea1d4c557365dd6e48a032236a602',
  chains: [
    IS_MAINNET
      ? {
          id: 56,
          name: 'BNB Smart Chain',
          nativeCurrency: {
            decimals: 18,
            name: 'BNB',
            symbol: 'BNB'
          },
          rpcUrls: {
            default: { http: ['https://bsc-rpc.publicnode.com'] }
          },
          blockExplorers: {
            default: {
              name: 'BscScan',
              url: 'https://bscscan.com',
              apiUrl: 'https://api.bscscan.com/api'
            }
          },
          contracts: {
            multicall3: {
              address: '0xca11bde05977b3631167028862be2a173976ca11',
              blockCreated: 15921452
            }
          }
        }
      : bscTestnet
  ]
});

export default wagmiConfig;
