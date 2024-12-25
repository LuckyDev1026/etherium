import { Buffer } from 'buffer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useAccount, WagmiProvider } from 'wagmi';

import App from './App.tsx';
import { config } from './wagmi.ts';
import { SendTransaction } from './SendTransaction';
import { Account } from './account';
import { WalletOptions } from './wallet-options';

import './index.css';
function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
        <SendTransaction />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
