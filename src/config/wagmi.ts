import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { PROJECT_DISPLAY_NAME } from '@/config/brand';

// 0G Network Testnet Configuration
export const zeroGTestnet = defineChain({
  id: 16602,
  name: '0G-Testnet-Galileo',
  network: '0g-testnet',
  nativeCurrency: {
    decimals: 18,
    name: '0G',
    symbol: '0G',
  },
  rpcUrls: {
    default: {
      http: ['https://evmrpc-testnet.0g.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: '0G Explorer',
      url: 'https://explorer.0g.ai',
    },
  },
  contracts: {},
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: PROJECT_DISPLAY_NAME,
  projectId: 'cfeff636de5cb2db8fa76930256dd185',
  chains: [zeroGTestnet],
  ssr: true,
});
