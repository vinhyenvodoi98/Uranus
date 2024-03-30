import { Chain } from "@rainbow-me/rainbowkit";

export const stylusTestnet = {
  id: 23011913,
  name: "Stylus testnet",
  network: "stylus",
  iconUrl: "/png/arbitrum.png",
  iconBackground: "#000",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://stylus-testnet.arbitrum.io/rpc"] },
    default: { http: ["https://stylus-testnet.arbitrum.io/rpc"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Stylus Blockscout",
      url: "https://stylus-testnet-explorer.arbitrum.io/",
    },
    default: {
      name: "Stylus Blockscount",
      url: "https://stylus-testnet-explorer.arbitrum.io/",
    },
  },
  testnet: true,
} as Chain;
