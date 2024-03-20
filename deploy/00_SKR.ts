import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import config from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy('SKR', {
    from: deployer,
    args: [
      config.LOSSLESS_ADMIN,
      config.LOSSLESS_RECOVERY_ADMIN,
      config.TIMELOCK_PERIOD,
      config.LOSSLESS_IMPLEMENTATION,
    ],
    log: true,
    skipIfAlreadyDeployed: true,
    contract: 'SKR',
  });
};

export default func;
func.id = 'SKR';
func.tags = ['hardhat', 'v1'];
func.dependencies = [];
