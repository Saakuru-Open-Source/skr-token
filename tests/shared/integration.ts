import { ethers } from 'hardhat';
import { Fixture } from 'ethereum-waffle';
import { MockLssController, SKR } from '../../dist/types';

interface ContractFixture {
  skr: SKR;
}

export const integrationFixture: Fixture<ContractFixture> =
  async function (): Promise<ContractFixture> {
    const users = await ethers.getSigners();

    const mockLss = await (
      await ethers.getContractFactory('MockLssController')
    ).deploy() as MockLssController;

    // nft
    const skr = await (
      await ethers.getContractFactory('SKR')
    ).deploy(
      users[0].address,
      users[1].address,
      86400, // 1 day
      mockLss.address,
    ) as SKR;
    await skr.deployed();

    return {
      skr,
    };
  };
