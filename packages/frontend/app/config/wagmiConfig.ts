import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { stylusTestnet } from "./customChain";

const { chains, publicClient } = configureChains(
  [
    ...(process.env.NODE_ENV === "development"
      ? [stylusTestnet]
      : [stylusTestnet]),
  ],
  [
    jsonRpcProvider({
      rpc: (chain: any) => {
        if (chain.id === stylusTestnet.id)
          return {
            http: stylusTestnet.rpcUrls.public.http[0],
          };
        return null;
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
  projectId: `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}`,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };