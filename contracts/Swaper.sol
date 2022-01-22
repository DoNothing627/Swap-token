pragma solidity ^0.8.4;
import "./Token.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Swaper {
    using SafeMath for uint256;

    address private alice;
    address private bob;
    Token private token1;
    Token private token2;

    constructor(
        address _alice,
        address _bob,
        address _token1,
        address _token2
    ) {
        alice= _alice;
        bob= _bob;
        token1 = Token(_token1);
        token2 = Token(_token2);
        // console.log("Create a swaper");
        // console.log("Create token with symbol: ", aliceOld.symbol());
        // console.log("Create token with symbol: ", aliceNew.symbol());
        // console.log("Create token with symbol: ", bobOld.symbol());
        // console.log("Create token with symbol: ", bobNew.symbol());
    }

    function swap(uint256 _amount) public {
        require(
            token1.balanceOf(alice) >= _amount,
            "Alice has not enough token"
        );
        require(
            _amount.div(token1.getRate()) <
                (token2.balanceOf(bob)).div(token2.getRate()),
            "Bob has not enough token"
        );
        //require(msg.sender == aliceOld.getOwner());

        console.log(alice);
        console.log(bob);

        token1.approve(address(this), _amount);
        token1.transferFrom(alice, bob, _amount);
        //token2.transferFrom(bob, alice, _amount);

        //bobOld.transferFrom(bobOld.getOwner(), aliceNew.getOwner(), (_amount.div(aliceOld.getRate())).mul(bobOld.getRate()));
        // bobOld.transfer(
        //     address(aliceNew),
        //     (_amount / aliceOld.getRate()) * bobOld.getRate()
        // );
    }
}
