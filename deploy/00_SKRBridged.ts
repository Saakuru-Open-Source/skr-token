import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import config from '../config';
import { ethers } from 'hardhat';
import { DeployerContract } from '../dist/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get, save } = hre.deployments;

  // Deploy the SKR contract using CreateCall contract
  const deployerContractDeployment = await get('DeployerContract');
  const deployerContract = await ethers.getContractAt('DeployerContract', deployerContractDeployment.address) as DeployerContract;

  const SKRContract = await ethers.getContractFactory('SKRBridged');

  // Encode constructor parameters for SKR
  const deploymentData = SKRContract.getDeployTransaction(
    config.LOSSLESS_ADMIN,
    config.LOSSLESS_RECOVERY_ADMIN,
    config.TIMELOCK_PERIOD,
    config.LOSSLESS_IMPLEMENTATION,
    config.MINTER,
  ).data;

  if (!deploymentData) {
    throw new Error('Deployment data not generated');
  }

  const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(config.DEPLOYMENT_SALT));
   
  // Perform the create2 deploy
  const tx = await deployerContract.deploy(
    deploymentData,
    salt,
  );

  const receipt = await tx.wait();
  const contractAddress = receipt.events.find((x) => x.event === 'ContractDeploy')?.args?.[1];

  await save('SKRBridged', {
    address: contractAddress,
    args: [
      config.LOSSLESS_ADMIN,
      config.LOSSLESS_RECOVERY_ADMIN,
      config.TIMELOCK_PERIOD,
      config.LOSSLESS_IMPLEMENTATION,
      config.MINTER,
    ],
    // @ts-ignore
    abi: JSON.parse(SKRContract.interface.format(ethers.utils.FormatTypes.json)),
    receipt: receipt,
    transactionHash: tx.hash,
    deployedBytecode: SKRContract.bytecode,
    linkedData: deploymentData,
  });
  console.log('SKRBridged deployed:', contractAddress);
};

export default func;
func.id = 'SKRBridged';
func.tags = ['hardhat', 'bridged'];
func.dependencies = [];
