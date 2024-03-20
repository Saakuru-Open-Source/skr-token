import * as ether from 'ethers';

const main = async () => {
  const wallet = ether.Wallet.createRandom();
  console.log('Address: ', wallet.address);
  console.log('Sig: ', wallet.privateKey.slice(2));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
