import * as dotenv  from 'dotenv';
import { getContracts } from './utils/setup';
import { BigNumber } from 'ethers';

dotenv.config();

console.log('Running... ', process.env.NETWORK);

const main = async () => {

  const contracts = getContracts();

  // const balance = await contracts.skr.balanceOf('0x981374d3cf4928d46d39e814a5bc4db77cdca92b');
  // console.log(balance.div(BigNumber.from(10).pow(18)).toString());


  const admin = await contracts.skr.admin();
  console.log('admin', admin);
  const recoveryAdmin = await contracts.skr.recoveryAdmin();
  console.log('recoveryAdmin', recoveryAdmin);
  const totalSupply = await contracts.skr.totalSupply();
  console.log('totalSupply', totalSupply.toString());
  const name = await contracts.skr.name();
  console.log('name', name);
  const symbol = await contracts.skr.symbol();
  console.log('symbol', symbol);
  const lossless = await contracts.skr.lossless();
  console.log('lossless', lossless);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
