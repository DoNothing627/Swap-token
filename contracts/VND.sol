pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Token.sol";
import "hardhat/console.sol";

contract VND is Token {
    constructor() public Token(20000, "Vietnamese Dong", "VND") {}
}
