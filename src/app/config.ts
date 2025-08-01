import { createPublicClient, http } from 'viem';
import { bscTestnet } from 'wagmi/chains';
import { createWalletClient, custom } from 'viem';

export const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: bscTestnet,
  transport: custom(window.ethereum),
}); 