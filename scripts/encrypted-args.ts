import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config();

const skr = require(`../deployments/${process.env.NETWORK}/SKRBridged.json`);

async function main() {
  // Constructor arguments
  const admin = skr.args[0];
  const recoveryAdmin = skr.args[1];
  const timelockPeriod = skr.args[2];
  const lossless = skr.args[3];
  const minter = skr.args[4];

  // ABI for constructor inputs
  const inputs = [
    'address',
    'address',
    'uint256',
    'address',
    'address',
  ];

  console.log([admin, recoveryAdmin, timelockPeriod, lossless, minter]);

  const encoded = ethers.utils.defaultAbiCoder.encode(
    inputs,
    [admin, recoveryAdmin, timelockPeriod, lossless, minter],
  );

  console.log('Encoded ABI: ', encoded);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});