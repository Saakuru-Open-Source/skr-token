import { BigNumber, Wallet } from 'ethers';
import { waffle, ethers } from 'hardhat';
import { SKR } from '../dist/types';
import { integrationFixture } from './shared/integration';

const { expect } = require('chai');

describe('ERC20', function () {
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

  it('Should return correct balance after transfer', async function () {
    const balanceBefore = await skr.balanceOf(users[0].address);
    await skr.transfer(users[1].address, 100); // Transfer 100 tokens for testing
    expect(await skr.balanceOf(users[0].address)).to.equal(balanceBefore.sub(100));
    expect(await skr.balanceOf(users[1].address)).to.equal(100);
  });

  it('Should correctly set allowance', async function () {
    await skr.approve(users[1].address, 500);
    expect(await skr.allowance(users[0].address, users[1].address)).to.equal(500);
  });

  it('Should correctly update allowance after transferFrom', async function () {
    await skr.approve(users[1].address, 1000);
    await skr.connect(users[1]).transferFrom(users[0].address, users[2].address, 500);
    expect(await skr.allowance(users[0].address, users[1].address)).to.equal(500);
  });

  it('Should fail transfer more than balance', async function () {
    await expect(skr.transfer(users[1].address, ethers.constants.MaxUint256)).to.be.reverted;
  });

  it('Should emit Transfer event on transfers', async function () {
    await expect(skr.transfer(users[1].address, 100))
      .to.emit(skr, 'Transfer')
      .withArgs(users[0].address, users[1].address, 100);
  });

  it('Should emit Approval event on approve', async function () {
    await expect(skr.approve(users[1].address, 100))
      .to.emit(skr, 'Approval')
      .withArgs(users[0].address, users[1].address, 100);
  });

  it('Approve should set allowance for zero address', async function () {
    await skr.approve(ethers.constants.AddressZero, 1000);
    expect(await skr.allowance(users[0].address, ethers.constants.AddressZero)).to.equal(1000);
  });

  it('Transfer from should fail for insufficient allowance', async function () {
    await skr.approve(users[1].address, 499); // Approve less than what is attempted to transfer
    await expect(skr.connect(users[1]).transferFrom(users[0].address, users[2].address, 500))
      .to.be.revertedWith('ERC20: transfer amount exceeds allowance');
  });

  it('Decrease allowance should fail if it tries to decrease below zero', async function () {
    await skr.approve(users[1].address, 200);
    await expect(skr.decreaseAllowance(users[1].address, 300))
      .to.be.revertedWith('ERC20: decreased allowance below zero');
  });

  it('Decrease allowance should update allowance accordingly', async function () {
    await skr.approve(users[1].address, 500);
    await skr.decreaseAllowance(users[1].address, 300);
    expect(await skr.allowance(users[0].address, users[1].address)).to.equal(200);
  });

  it('Increase allowance should update allowance accordingly', async function () {
    await skr.approve(users[1].address, 200);
    await skr.increaseAllowance(users[1].address, 300);
    expect(await skr.allowance(users[0].address, users[1].address)).to.equal(500);
  });

  it('User1 should be able to transfer out of User0 wallet with sufficient allowance', async function () {
    const transferAmount = 100;
    const initialOwnerBalance = await skr.balanceOf(users[0].address);

    // User0 approves User1 to spend `transferAmount` tokens
    await skr.connect(users[0]).approve(users[1].address, transferAmount);

    // Confirm allowance is set correctly
    expect(await skr.allowance(users[0].address, users[1].address)).to.equal(transferAmount);

    // User1 transfers `transferAmount` tokens from User0's account to User2's account
    await skr.connect(users[1]).transferFrom(users[0].address, users[2].address, transferAmount);

    // Verify User0's balance decreased by `transferAmount`
    expect(await skr.balanceOf(users[0].address)).to.equal(initialOwnerBalance.sub(transferAmount));

    // Verify User2's balance increased by `transferAmount`
    expect(await skr.balanceOf(users[2].address)).to.equal(transferAmount);

    // Verify allowance is updated (reduced to zero)
    expect(await skr.allowance(users[0].address, users[1].address)).to.equal(0);
  });

  it('Should support IERC20 interface', async function () {
    // IERC20 interface ID is 0x36372b07
    await expect(await skr.supportsInterface('0x36372b07')).to.be.true;
  });

  it('Should allow a spender to burn tokens from an owner\'s account with sufficient allowance', async function () {
    const initialOwnerBalance = await skr.balanceOf(users[0].address);
    const burnAmount = ethers.utils.parseUnits('50', 18);

    // User0 approves User1 to burn on their behalf
    await skr.connect(users[0]).approve(users[1].address, burnAmount);

    // User1 burns tokens from User0's account
    await skr.connect(users[1]).burnFrom(users[0].address, burnAmount);

    // Verify User0's balance is reduced
    expect(await skr.balanceOf(users[0].address)).to.equal(initialOwnerBalance.sub(burnAmount));

    // Verify total supply is reduced
    expect(await skr.totalSupply()).to.equal(initialOwnerBalance.sub(burnAmount));

    // Verify User1's allowance is reduced to 0
    expect(await skr.allowance(users[0].address, users[1].address)).to.equal(0);
  });

  it('Should revert when a spender tries to burn more than their allowance', async function () {
    const burnAmount = ethers.utils.parseUnits('100', 18);
    await skr.connect(users[0]).approve(users[1].address, burnAmount.sub(1)); // Approve less than burnAmount

    // Expect burnFrom to revert due to insufficient allowance
    await expect(skr.connect(users[1]).burnFrom(users[0].address, burnAmount))
      .to.be.revertedWith('ERC20: burn amount exceeds allowance');
  });

  // symbol
  it('Should return the correct symbol', async function () {
    expect(await skr.symbol()).to.equal('SKR');
  });

  // name
  it('Should return the correct name', async function () {
    expect(await skr.name()).to.equal('Saakuru');
  });

  // decimals
  it('Should return the correct decimals', async function () {
    expect(await skr.decimals()).to.equal(18);
  });

  // totalSupply
  it('Should return the correct total supply', async function () {
    // 1 billion tokens
    expect(await skr.totalSupply()).to.equal(ethers.utils.parseUnits('1000000000', 18));
  });

  // burn
  it('Should burn tokens from caller', async function () {
    const initialBalance = await skr.balanceOf(users[0].address);
    await skr.burn(100);
    expect(await skr.balanceOf(users[0].address)).to.equal(initialBalance.sub(100));
    expect(await skr.totalSupply()).to.equal(ethers.BigNumber.from('10').pow(18).mul(BigNumber.from(10).pow(9)).sub(100));
  });

  it('Should not allow burn more than balance', async function () {
    await expect(skr.burn(ethers.constants.MaxUint256)).to.be.reverted;
  });

  it('Should not allow transfer to zero address', async function () {
    await expect(skr.transfer(ethers.constants.AddressZero, 100)).to.be.revertedWith('ERC20: transfer to the zero address');
  });
});

