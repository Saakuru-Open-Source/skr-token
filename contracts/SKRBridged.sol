// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./core/LERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SKRBridged is Context, LERC20, AccessControl {
    constructor(
      address admin_, 
      address recoveryAdmin_, 
      uint256 timelockPeriod_, 
      address lossless_,
      address minter_
    ) LERC20(
      "Saakuru", 
      "SKR", 
      admin_, 
      recoveryAdmin_, 
      timelockPeriod_, 
      lossless_
    ) {
        require(minter_ != address(0), "SKRBridged: initial owner is the zero address");
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(keccak256("MINTER_ROLE"), minter_);
    }

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

    function mint(address to, uint256 amount) public onlyRole(keccak256("MINTER_ROLE")) {
        _mint(to, amount);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view virtual 
        override(AccessControl, LERC20)
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}