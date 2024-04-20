import { Wallet } from 'ethers';
import { waffle, ethers, network } from 'hardhat';
import { MockLssController, SKR } from '../dist/types';
import { integrationFixture } from './shared/integration';

const { expect } = require('chai');

describe('Admin', function () {
  let users: Wallet[];
  let skr: SKR;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;
  
  before('create fixture loader', async () => {
    users = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader(users);
  });
  
  beforeEach('deploy fixture', async () => {
    ({ skr } = await loadFixture(integrationFixture));
  });

  it('Only recoveryAdmin can propose lossless turn off', async function () {
    await expect(skr.connect(users[0]).proposeLosslessTurnOff())
      .to.be.revertedWith('LERC20: Must be recovery admin');
  });

  it('RecoveryAdmin can propose lossless turn off and on', async function () {
    await expect(skr.connect(users[1]).proposeLosslessTurnOff())
      .to.emit(skr, 'LosslessTurnOffProposal');
  });

  it('Only recoveryAdmin can execute lossless turn off after timelock', async function () {
    await skr.connect(users[1]).proposeLosslessTurnOff();
    // Assuming there's a timelockPeriod of 1 day for the simplicity of the test
    await network.provider.send('evm_increaseTime', [24 * 60 * 60 + 1]);
    await network.provider.send('evm_mine');

    // Attempt by non-recoveryAdmin should fail
    await expect(skr.connect(users[0]).executeLosslessTurnOff())
      .to.be.revertedWith('LERC20: Must be recovery admin');
    // Execution by recoveryAdmin
    await expect(skr.connect(users[1]).executeLosslessTurnOff())
      .to.emit(skr, 'LosslessOff');
  });

  it('Admin cannot be set to the same address', async function () {
    // Assuming users[0] is the recoveryAdmin
    await expect(skr.connect(users[1]).setLosslessAdmin(users[2].address))
      .to.not.be.reverted;
    await expect(skr.connect(users[1]).setLosslessAdmin(users[2].address))
      .to.be.revertedWith('LERC20: Cannot set same address');
  });

  it('RecoveryAdmin can transfer admin role', async function () {
    // Assuming users[0] is the recoveryAdmin
    await expect(skr.connect(users[1]).setLosslessAdmin(users[2].address))
      .to.emit(skr, 'NewAdmin');
    expect(await skr.admin()).to.equal(users[2].address);
  });

  // get admin
  it('Should return correct admin', async function () {
    expect(await skr.admin()).to.equal(users[0].address);
  });

  describe('Setup', async function () {
    const mockLss = await(
      await ethers.getContractFactory('MockLssController')
    ).deploy() as MockLssController;
    
    it('Should not allow set to long timelock', async function () {
      // Timelock period must be less than 2 days
      await expect((
        await ethers.getContractFactory('SKR')
      ).deploy(
        users[0].address,
        users[1].address,
        86400 * 2, // 1 day
        mockLss.address,
      )).to.be.revertedWith('LERC20: Timelock period must be less than 2 days');
    });

    it('Should not allow set to zero timelock', async function () {
      // Timelock period must be greater than 0
      await expect((
        await ethers.getContractFactory('SKR')
      ).deploy(
        users[0].address,
        users[1].address,
        0, // 1 day
        mockLss.address,
      )).to.be.revertedWith('LERC20: Timelock period must be greater than 0');
    });

    it('Should not allow set to zero recoveryAdmin', async function () {
      // Recovery admin must be set
      await expect((
        await ethers.getContractFactory('SKR')
      ).deploy(
        ethers.constants.AddressZero,
        users[1].address,
        86400, // 1 day
        mockLss.address,
      )).to.be.revertedWith('LERC20: Recovery admin must be set');
    });

    it('Should not allow set to zero admin', async function () {
      // Admin must be set
      await expect((
        await ethers.getContractFactory('SKR')
      ).deploy(
        users[0].address,
        ethers.constants.AddressZero,
        86400, // 1 day
        mockLss.address,
      )).to.be.revertedWith('LERC20: Admin must be set');
    });

    it('Should not allow set to zero lssController', async function () {
      // LssController must be set
      await expect((
        await ethers.getContractFactory('SKR')
      ).deploy(
        users[0].address,
        users[1].address,
        86400, // 1 day
        ethers.constants.AddressZero,
      )).to.be.revertedWith('LERC20: LssController must be set');
    });
  });
});