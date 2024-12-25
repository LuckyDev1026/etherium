import { http, createConfig } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import {
  coinbaseWallet,
  injected,
  walletConnect,
  metaMask,
} from 'wagmi/connectors';

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
