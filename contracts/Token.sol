pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    uint256 internal rate;
    address internal owner;

    constructor(
        uint256 _rate,
        string memory _name,
        string memory _symbol
    ) public ERC20(_name, _symbol) {
        rate = _rate;
        
    }

    function setAccount(uint256 initialSupply, address _owner) public {
        _mint(_owner, initialSupply);
        owner = _owner;
    }

    function getRate() public view returns (uint256) {
        return rate;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
