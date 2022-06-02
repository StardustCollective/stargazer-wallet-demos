//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StargazerSampleToken is ERC20 {
    constructor() ERC20("StargazerSampleToken", "SST") {
        _mint(msg.sender, 10_000_000 * 10**18);
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
