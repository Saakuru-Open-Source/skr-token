import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy('DeployerContract', {
    from: deployer,
    args: [],
    log: true,
    skipIfAlreadyDeployed: true,
    contract: 'DeployerContract',
  });
};

export default func;
func.id = 'Deployer';
func.tags = ['hardhat', 'deployer'];
func.dependencies = [];
