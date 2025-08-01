import { createPublicClient, http } from 'viem';
import { morphHolesky } from 'wagmi/chains';
import { createWalletClient, custom } from 'viem';

export const publicClient = createPublicClient({
  chain: morphHolesky,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: morphHolesky,
  transport: custom(window.ethereum),
}); 