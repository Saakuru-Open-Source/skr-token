const { expect } = require('chai');
const { BigNumber } = require('ethers');

export function compareEventArgs(actualArgs: unknown[], expectedValues: unknown[]) {
  // Define the keys of the indexed arguments in the order they appear in the event
  const indexedKeys = expectedValues.map((_, index) => index); // adjust according to your event
  indexedKeys.forEach((key, index) => {
    const actualValue = actualArgs[key];
    const expectedValue = expectedValues[index];

    if (typeof expectedValue === 'string') {
      expect(actualValue).to.equal(expectedValue);
    } else if (typeof expectedValue === 'number') {
      expect(BigNumber.from(actualValue)).to.equal(BigNumber.from(expectedValue));
    } else if (expectedValue instanceof Date) {
      // If the expected value is a Date object, convert it to a timestamp and allow some tolerance
      const tolerance = 5 * 60; // 5 minutes tolerance, adjust as needed
      const actualTimestamp = BigNumber.from(actualValue).toNumber();
      const expectedTimestamp = Math.floor(expectedValue.getTime() / 1000);
      expect(actualTimestamp).to.be.closeTo(expectedTimestamp, tolerance);
    }
  });
}