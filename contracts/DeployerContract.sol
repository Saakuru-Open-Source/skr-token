// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "solmate/src/utils/CREATE3.sol";
import "solmate/src/auth/Owned.sol";

contract DeployerContract is Owned {
    event ContractDeploy(bytes32 salt, address deployment);

    constructor() Owned(msg.sender) {}

    function deploy(
        bytes memory creationCode,
        bytes32 salt
    ) external onlyOwner {
        address ctc = CREATE3.deploy(salt, creationCode, 0);
        emit ContractDeploy(salt, ctc);
    }
}
