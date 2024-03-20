import * as dotenv from 'dotenv';
import { decrypt } from '../scripts/encrypt';

// @ts-ignore
dotenv.config();

const privateKeyEncrypted = process.env.WLT;
const password = process.env.KEY;
const salt = process.env.SALT;

const privateKey = decrypt(privateKeyEncrypted, password, salt);

export const networks = {
  saakuruTestnet:{
    url: 'https://rpc-testnet.saakuru.network',
    chainId: 247253,
    accounts: [`0x${privateKey}`],
    live: true,
    saveDeployments: true,
    gasPrice: 0,
  },

  saakuruMainnet:{
    url: 'https://rpc.saakuru.network',
    accounts: [`0x${privateKey}`],
    chainId: 7225878,
    live: true,
    saveDeployments: true,
    gasPrice: 0,
  },
};