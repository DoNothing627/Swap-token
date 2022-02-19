pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Token is ERC20 {

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function setAccount(address account, uint256 amount) public virtual returns (bool) {
        _mint(account, amount);
        return true;
    }
}
