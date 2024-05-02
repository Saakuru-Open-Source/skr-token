import * as dotenv from 'dotenv';
import { decrypt } from '../scripts/encrypt';
import { ethers } from 'ethers';

// @ts-ignore
dotenv.config();

const privateKeyEncrypted = process.env.WLT;
const key = process.env.KEY;
const salt = process.env.SALT;

const privateKey = decrypt(privateKeyEncrypted, key, salt);

const wallet = new ethers.Wallet(privateKey);

export const testnets = {
  saakuruTestnet:{
    url: 'https://rpc-testnet.saakuru.network',
    chainId: 247253,
    accounts: [`0x${privateKey}`],
    live: true,
    saveDeployments: true,
    gasPrice: 0,
  },
  bscTestnet: {
    url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainId: 97,
    accounts: [`0x${privateKey}`],
    live: true,
    saveDeployments: true,
  },
  baseTestnet: {
    url: 'https://sepolia.base.org',
    accounts: [`0x${privateKey}`],
    chainId: 84532,
    live: true,
    saveDeployments: true,
  },
  optimismTestnet: {
    url: 'https://endpoints.omniatech.io/v1/op/sepolia/public',
    accounts: [`0x${privateKey}`],
    chainId: 11155420,
    live: true,
    saveDeployments: true,
  },
};

export const networks = {
  saakuruMainnet:{
    url: 'https://rpc.saakuru.network',
    accounts: [`0x${privateKey}`],
    chainId: 7225878,
    live: true,
    saveDeployments: true,
    gasPrice: 0,
  },
  bscMainnet: {
    url: 'https://bsc-dataseed1.ninicoin.io',
    chainId: 56,
    accounts: [`0x${privateKey}`],
    live: true,
    saveDeployments: true,
  },
  baseMainnet: {
    url: 'https://mainnet.base.org',
    accounts: [`0x${privateKey}`],
    chainId: 8453,
    live: true,
    saveDeployments: true,
  },
  optimismMainnet: {
    url: 'https://mainnet.optimism.io',
    accounts: [`0x${privateKey}`],
    chainId: 10,
    live: true,
    saveDeployments: true,
  },
  ethereumMainnet: {
    url: 'https://ethereum-rpc.publicnode.com',
    accounts: [`0x${privateKey}`],
    chainId: 1,
    live: true,
    saveDeployments: true,
  },
  polygonMainnet: {
    url: 'https://1rpc.io/matic',
    accounts: [`0x${privateKey}`],
    chainId: 137,
    live: true,
    saveDeployments: true,
    gasPrice: 90000000000,
  },
  avalancheMainnet: {
    url: 'https://api.avax.network/ext/bc/C/rpc',
    accounts: [`0x${privateKey}`],
    chainId: 43114,
    live: true,
    saveDeployments: true,
  },
  arbitrumMainnet: {
    url: 'https://arbitrum-one-rpc.publicnode.com',
    accounts: [`0x${privateKey}`],
    chainId: 42161,
    live: true,
    saveDeployments: true,
  },
  ...testnets,
};





// Supported networks by Router Protocol
export const AssetBridges = {
  '1': '0xf9f4c3dc7ba8f56737a92d74fd67230c38af51f2', // Ethereum
  '10': '0x21c1e74caadf990e237920d5515955a024031109', // Optimism
  '137': '0xa62ec33abd6d7ebdf8ec98ce874820517ae71e4d', // Polygon
  '42161': '0x0fa205c0446cd9eedcc7538c9e24bc55ad08207f', // Arbitrum
  '43114': '0x8c4acd74ff4385f3b7911432fa6787aa14406f8b', // Avalanche
  '56': '0x21c1e74caadf990e237920d5515955a024031109', // BSC
  '7225878': '0x260687ebc6c55dadd578264260f9f6e968f7b2a5', // Saakuru
  '8453': '0x21c1e74caadf990e237920d5515955a024031109', // Base

  // Testnets
  '247253': wallet.address, // Saakuru Testnet
  '97': wallet.address, // BSC Testnet
  '84532': wallet.address, // Base Testnet
  '11155420': wallet.address, // Optimism Testnet
};

// npx hardhat verify --network saakuruMainnet "0xe2dCA969624795985F2f083BcD0b674337ba130a" "0x57fb3A4205dcdFaE514d13c211D6C8c08Be58E86" "0x53745Cc2c6Dc4B1468F41D286Cd1AAb7aa7a1B81" "86400" "0x38D40f5c8375F84C5B90bc460A94a436D09133fB" 
// npx hardhat verify --network bscMainnet 0xe2dCA969624795985F2f083BcD0b674337ba130a "0x57fb3A4205dcdFaE514d13c211D6C8c08Be58E86" "0x53745Cc2c6Dc4B1468F41D286Cd1AAb7aa7a1B81" "86400" "0xDBB5125CEEaf7233768c84A5dF570AeECF0b4634"  "0x21c1e74caadf990e237920d5515955a024031109" 
// npx hardhat verify --network baseMainnet 0xe2dCA969624795985F2f083BcD0b674337ba130a "0x57fb3A4205dcdFaE514d13c211D6C8c08Be58E86" "0x53745Cc2c6Dc4B1468F41D286Cd1AAb7aa7a1B81" "86400" "0x38D40f5c8375F84C5B90bc460A94a436D09133fB"  "0x21c1e74caadf990e237920d5515955a024031109" 
// npx hardhat verify --network optimismMainnet 0xe2dCA969624795985F2f083BcD0b674337ba130a "0x57fb3A4205dcdFaE514d13c211D6C8c08Be58E86" "0x53745Cc2c6Dc4B1468F41D286Cd1AAb7aa7a1B81" "86400" "0x38D40f5c8375F84C5B90bc460A94a436D09133fB"  "0x21c1e74caadf990e237920d5515955a024031109" 
// npx hardhat verify --network ethereumMainnet 0xe2dCA969624795985F2f083BcD0b674337ba130a "0x57fb3A4205dcdFaE514d13c211D6C8c08Be58E86" "0x53745Cc2c6Dc4B1468F41D286Cd1AAb7aa7a1B81" "86400" "0xe91D7cEBcE484070fc70777cB04F7e2EfAe31DB4"  "0xf9f4c3dc7ba8f56737a92d74fd67230c38af51f2" 
// npx hardhat verify --network polygonMainnet 0xe2dCA969624795985F2f083BcD0b674337ba130a "0x57fb3A4205dcdFaE514d13c211D6C8c08Be58E86" "0x53745Cc2c6Dc4B1468F41D286Cd1AAb7aa7a1B81" "86400" "0x66622e2C1b991983e88132da19b2C31f71009035"  "0xa62ec33abd6d7ebdf8ec98ce874820517ae71e4d" 
// npx hardhat verify --network avalancheMainnet 0xe2dCA969624795985F2f083BcD0b674337ba130a "0x57fb3A4205dcdFaE514d13c211D6C8c08Be58E86" "0x53745Cc2c6Dc4B1468F41D286Cd1AAb7aa7a1B81" "86400" "0xe5b5753cFEaD850f7069b05B3A76645Af63A9102"  "0x8c4acd74ff4385f3b7911432fa6787aa14406f8b" 
// npx hardhat verify --network arbitrumMainnet 0xe2dCA969624795985F2f083BcD0b674337ba130a "0x57fb3A4205dcdFaE514d13c211D6C8c08Be58E86" "0x53745Cc2c6Dc4B1468F41D286Cd1AAb7aa7a1B81" "86400" "0x38D40f5c8375F84C5B90bc460A94a436D09133fB"  "0x0fa205c0446cd9eedcc7538c9e24bc55ad08207f" 


export const LossLessImplementations = {
  '1': '0xe91D7cEBcE484070fc70777cB04F7e2EfAe31DB4', // Ethereum
  '10': '0x38D40f5c8375F84C5B90bc460A94a436D09133fB', // Optimism
  '137': '0x66622e2C1b991983e88132da19b2C31f71009035', // Polygon
  '42161': '0x38D40f5c8375F84C5B90bc460A94a436D09133fB', // Arbitrum
  '43114': '0xe5b5753cFEaD850f7069b05B3A76645Af63A9102', // Avalanche
  '56': '0xDBB5125CEEaf7233768c84A5dF570AeECF0b4634', // BSC
  '7225878': '0x38D40f5c8375F84C5B90bc460A94a436D09133fB', // Saakuru
  '8453': '0x38D40f5c8375F84C5B90bc460A94a436D09133fB', // Base

  // Testnets
  '247253': ethers.constants.AddressZero, // Saakuru Testnet
  '97': ethers.constants.AddressZero, // BSC Testnet
  '84532': ethers.constants.AddressZero, // Base Testnet
  '11155420': ethers.constants.AddressZero, // Optimism Testnet
};