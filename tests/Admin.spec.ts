import { Wallet } from 'ethers';
import { waffle, ethers, network } from 'hardhat';
import { SKR } from '../dist/types';
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
});