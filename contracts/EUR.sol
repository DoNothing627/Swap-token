pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Token.sol";
import "hardhat/console.sol";

contract EUR is Token {
    constructor() public Token(2, "Euro", "EUR") {
        // console.log("Create new VND with owner: ", _owner);
        // console.log("Create new VND with initial supply: ", initialSupply);
    }
}
