// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("Uni token ", "UTK") {
        _mint(msg.sender, 1500000000000 * 10**decimals());
    }

    function rewardUser(address owner, uint256 amount) external {
        transfer(owner, amount);
    }
}
