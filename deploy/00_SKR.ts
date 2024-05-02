import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import config from '../config';
import { ethers } from 'hardhat';
import { DeployerContract } from '../dist/types';
import { LossLessImplementations } from '../helpers/networks';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get, save } = hre.deployments;

  // if network chain id is not saakuru, exit script
  const chainId = hre.network.config.chainId;

  if (chainId !== 7225878 && chainId !== 247253) {
    throw new Error('ChainId not supported');
  }

  const lossLessImplementation = LossLessImplementations[chainId];

  if (!lossLessImplementation) {
    throw new Error('LossLess implementation not found for chainId: ' + chainId);
  }

  // Deploy the SKR contract using CreateCall contract
  const deployerContractDeployment = await get('DeployerContract');
  const deployerContract = await ethers.getContractAt('DeployerContract', deployerContractDeployment.address) as DeployerContract;

  const SKRContract = await ethers.getContractFactory('SKR');

  console.log(
    config.LOSSLESS_ADMIN,
    config.LOSSLESS_RECOVERY_ADMIN,
    config.TIMELOCK_PERIOD,
    lossLessImplementation,
  );
  // Encode constructor parameters for SKR
  const deploymentData = SKRContract.getDeployTransaction(
    config.LOSSLESS_ADMIN,
    config.LOSSLESS_RECOVERY_ADMIN,
    config.TIMELOCK_PERIOD,
    lossLessImplementation,
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

  await save('SKR', {
    address: contractAddress,
    args: [
      config.LOSSLESS_ADMIN,
      config.LOSSLESS_RECOVERY_ADMIN,
      config.TIMELOCK_PERIOD,
      lossLessImplementation,
    ],
    // @ts-ignore
    abi: JSON.parse(SKRContract.interface.format(ethers.utils.FormatTypes.json)),
    receipt: receipt,
    transactionHash: tx.hash,
    deployedBytecode: SKRContract.bytecode,
    linkedData: deploymentData,
  });
  console.log('SKR deployed:', contractAddress);
};

export default func;
func.id = 'SKR';
func.tags = ['hardhat', 'v1'];
func.dependencies = [];
