//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract StargazerGreeter {
    string private greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(uint256 _greetingId) public {
        string memory _greeting;

        if (_greetingId == 0) {
            _greeting = "Good Morning!";
        }

        if (_greetingId == 1) {
            _greeting = "Bon Matin!";
        }

        if (_greetingId == 2) {
            _greeting = "Buenos D\xC3\xADas!";
        }

        if (_greetingId == 3) {
            _greeting = "Guten Morgen!";
        }

        if (_greetingId == 4) {
            _greeting = "Buongiorno!";
        }

        if (_greetingId == 5) {
            _greeting = "Bom Dia!";
        }

        if (_greetingId == 6) {
            _greeting = "Bonan Matenon!";
        }

        if (_greetingId == 7) {
            _greeting = "Yom Tov!";
        }

        if (_greetingId == 8) {
            _greeting = "Suprabhat!";
        }

        if (_greetingId == 9) {
            _greeting = "Selamat Siang!";
        }

        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }
}
