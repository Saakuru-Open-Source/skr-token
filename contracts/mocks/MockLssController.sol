// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/ILosslessController.sol";

contract MockLssController is ILssController {
    constructor() {}

    // Implementing empty functions for the ILssController interface
    function retrieveBlacklistedFunds(address[] calldata, ILERC20, uint256) external pure override returns (uint256) {}
    function whitelist(address) external pure override returns (bool) { return true; }
    function dexList(address) external pure override returns (bool) { return true; }
    function blacklist(address) external pure override returns (bool) { return false; }
    function admin() external view override returns (address) { return address(this); }
    function pauseAdmin() external view override returns (address) { return address(this); }
    function recoveryAdmin() external view override returns (address) { return address(this); }
    function guardian() external view override returns (address) { return address(this); }
    function losslessStaking() external view override returns (ILssStaking) { return ILssStaking(address(this)); }
    function losslessReporting() external view override returns (ILssReporting) { return ILssReporting(address(this)); }
    function losslessGovernance() external view override returns (ILssGovernance) { return ILssGovernance(address(this)); }
    function dexTranferThreshold() external pure override returns (uint256) { return 0; }
    function settlementTimeLock() external pure override returns (uint256) { return 0; }
    function extraordinaryRetrievalProposalPeriod() external pure override returns (uint256) { return 0; }

    // Mock control functions do nothing but are required for interface compliance
    function pause() external override {}
    function unpause() external override {}
    function setAdmin(address) external override {}
    function setRecoveryAdmin(address) external override {}
    function setPauseAdmin(address) external override {}
    function setSettlementTimeLock(uint256) external override {}
    function setDexTransferThreshold(uint256) external override {}
    function setDexList(address[] calldata, bool) external override {}
    function setWhitelist(address[] calldata, bool) external override {}
    function addToBlacklist(address) external override {}
    function resolvedNegatively(address) external override {}
    function setStakingContractAddress(ILssStaking) external override {}
    function setReportingContractAddress(ILssReporting) external override {}
    function setGovernanceContractAddress(ILssGovernance) external override {}
    function setTokenMintLimit(ILERC20, uint256) external override {}
    function setTokenMintPeriod(ILERC20, uint256) external override {}
    function setTokenBurnLimit(ILERC20, uint256) external override {}
    function setTokenBurnPeriod(ILERC20, uint256) external override {}
    function proposeNewSettlementPeriod(ILERC20, uint256) external override {}
    function executeNewSettlementPeriod(ILERC20) external override {}
    function activateEmergency(ILERC20) external override {}
    function deactivateEmergency(ILERC20) external override {}
    function setGuardian(address) external override {}
    function removeProtectedAddress(ILERC20, address) external override {}
    function beforeTransfer(address, address, uint256) external override {}
    function beforeTransferFrom(address, address, address, uint256) external override {}
    function beforeApprove(address, address, uint256) external override {}
    function beforeIncreaseAllowance(address, address, uint256) external override {}
    function beforeDecreaseAllowance(address, address, uint256) external override {}
    function beforeMint(address, uint256) external override {}
    function beforeBurn(address, uint256) external override {}
    function afterTransfer(address, address, uint256) external override {}
    function setProtectedAddress(ILERC20, address, ProtectionStrategy) external override {}
    function setExtraordinaryRetrievalPeriod(uint256) external override {}
    function extraordinaryRetrieval(ILERC20, address[] calldata, uint256) external override {}
}
