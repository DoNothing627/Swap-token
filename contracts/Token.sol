pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token {
    uint256 private rate;
    string private name;
    string private symbol;

    mapping(address => uint256) private balances;

    constructor(
        uint256 _rate,
        string memory _name,
        string memory _symbol
    ) {
        rate = _rate;
        name = _name;
        symbol = _symbol;
    }

    function setAccount(uint256 _amount, address _owner) public {
        balances[_owner] = _amount;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external payable {
        balances[_from] -= _amount;
        balances[_to] += _amount;
    }

    function getRate() public view returns (uint256) {
        return rate;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getSymbol() public view returns (string memory) {
        return symbol;
    }
}
