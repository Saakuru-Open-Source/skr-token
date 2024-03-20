
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
