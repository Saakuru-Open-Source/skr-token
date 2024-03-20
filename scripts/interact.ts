import * as dotenv  from 'dotenv';
import { getContracts } from './utils/setup';
import { BigNumber } from 'ethers';

dotenv.config();

console.log('Running... ', process.env.NETWORK);

const main = async () => {

  const contracts = getContracts();

  const balance = await contracts.skr.balanceOf('0x00206a47F227E8518b3E80AD0794537223538b2E');
  console.log(balance.div(BigNumber.from(10).pow(18)).toString());

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
