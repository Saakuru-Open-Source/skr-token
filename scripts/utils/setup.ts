import * as ethers from 'ethers';
import * as dotenv  from 'dotenv';
import { networks } from '../../helpers/networks';
import { SKR } from '../../dist/types';

dotenv.config();

console.log('Running... ', process.env.NETWORK);

const skr = require(`../../deployments/${process.env.NETWORK}/SKRBridged.json`);

export const deployments = {
  skr,
};

const rpcUrl = networks[process.env.NETWORK || ''].url;
const provider = ethers.getDefaultProvider(rpcUrl);

export const wallet = new ethers.Wallet(networks[process.env.NETWORK || '0'].accounts[0], provider);

export const getContracts = () => {
  return {
    skr: new ethers.Contract(skr.address, skr.abi, wallet) as SKR,
  };
};

export const txConfig = {
  gasPrice: networks[process.env.NETWORK || ''].gasPrice !== undefined ? networks[process.env.NETWORK || ''].gasPrice : undefined,
  gasLimit: 10000000,
};