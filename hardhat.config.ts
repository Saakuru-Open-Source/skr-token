
import * as path from 'path';
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

import { networks } from './helpers/networks';

import '@nomiclabs/hardhat-ganache';
import '@symblox/hardhat-abi-gen';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-deploy';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import { ethers } from 'hardhat';
// import '@nomicfoundation/hardhat-verify';
// import '@nomicfoundation/hardhat-toolbox';

dotenv.config();

const config: HardhatUserConfig = {
  // default network
  defaultNetwork: 'hardhat',

  // network config
  networks: {
    hardhat: {
      throwOnCallFailures: true,
      throwOnTransactionFailures: true,
    },
    ...networks,
  },

  // solidity config
  solidity: {
    compilers: [
      {
        version: '0.8.2',
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: 'berlin',
        },
      },
    ],
  },
  etherscan: {
    apiKey: {
      ethereumMainnet: process.env.ETHERSCAN_API_KEY,
      bscMainnet: process.env.BSCSCAN_API_KEY, 
      baseMainnet: process.env.BASESCAN_API_KEY,
      optimisticEthereum: process.env.OPTIMISTICSCAN_API_KEY,
      polygonMainnet: process.env.POLYGONSCAN_API_KEY,
      arbitrumMainnet: process.env.ARBITRUMSCAN_API_KEY,
      saakuruMainnet: 'no-needed',
      saakuruTestnet: 'no-needed',
    },
    customChains: [
      {
        network: 'saakuruMainnet',
        chainId: 7225878,
        urls: {
          apiURL: 'https://explorer.saakuru.network/api',
          browserURL: 'https://explorer.saakuru.network/',
        },
      },
      {
        network: 'ethereumMainnet',
        chainId: 1,
        urls: {
          apiURL: 'https://api.etherscan.io/api',
          browserURL: 'https://etherscan.io/',
        },
      },
      {
        network: 'saakuruTestnet',
        chainId: 247253,
        urls: {
          apiURL: 'https://explorer-testnet.saakuru.network/api',
          browserURL: 'https://explorer-testnet.saakuru.network/',
        },
      },
      {
        network: 'baseMainnet',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org/',
        },
      },
      {
        network: 'bscMainnet',
        chainId: 56,
        urls: {
          apiURL: 'https://api.bscscan.com/api',
          browserURL: 'https://bscscan.com/',
        },
      },
      {
        network: 'optimisticEthereum',
        chainId: 11155420,
        urls: {
          apiURL: 'https://api-optimistic.etherscan.io/api',
          browserURL: 'https://optimistic.etherscan.io/',
        },
      },
      {
        network: 'polygonMainnet',
        chainId: 137,
        urls: {
          apiURL: 'https://api.polygonscan.com/api',
          browserURL: 'https://polygonscan.com/',
        },
      },
      {
        network: 'arbitrumMainnet',
        chainId: 42161,
        urls: {
          apiURL: 'https://api.arbiscan.io/api',
          browserURL: 'https://arbiscan.io/',
        },
      },
    ],
  },
  // repository config
  paths: {
    sources: path.resolve(__dirname, 'contracts'),
    tests: path.resolve(__dirname, 'tests'),
    cache: path.resolve(__dirname, 'dist/.cache'),
    artifacts: path.resolve(__dirname, 'dist/artifacts'),
    deploy: path.resolve(__dirname, 'deploy'),
    deployments: path.resolve(__dirname, 'deployments'),
  },

  // typechain
  typechain: {
    outDir: 'dist/types',
    target: 'ethers-v5',
  },

  // hardhat-deploy
  namedAccounts: {
    deployer: 0,
  },
};

export default config;
