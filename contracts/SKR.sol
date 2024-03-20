// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./core/LERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract SKR is Context, LERC20 {
    constructor(
      address admin_, 
      address recoveryAdmin_, 
      uint256 timelockPeriod_, 
      address lossless_
    ) LERC20(
      10**9 * 10**18, 
      "Saakuru", 
      "SKR", 
      admin_, 
      recoveryAdmin_, 
      timelockPeriod_, 
      lossless_
    ) {}

    modifier lssBurn(address account, uint256 amount) {
        if (isLosslessOn) {
            lossless.beforeBurn(account, amount);
        } 
        _;
    }

    function burn(uint256 amount) public virtual lssBurn(_msgSender(), amount) {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public virtual lssBurn(account, amount) {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }
}