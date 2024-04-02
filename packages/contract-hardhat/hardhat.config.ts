import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity:{
    compilers: [
      {
        version: '0.8.20',
        settings: {
          evmVersion: 'paris' // for fuji
        }
      }
    ]
  },
  networks: {
    stylus_testnet: {
      url: "https://stylus-testnet.arbitrum.io/rpc",
      accounts: [PRIVATE_KEY as string],
      chainId: 23011913,
      allowUnlimitedContractSize: true,
    }
  },
};

export default config;

