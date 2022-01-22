pragma solidity ^0.8.4;
import "./Token.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Swaper {
    using SafeMath for uint256;

    Token private aliceOld;
    Token private aliceNew;
    Token private bobOld;
    Token private bobNew;

    constructor(
        address _aliceOld,
        address _aliceNew,
        address _bobOld,
        address _bobNew
    ) {
        aliceOld = Token(_aliceOld);
        aliceNew = Token(_aliceNew);
        bobOld = Token(_bobOld);
        bobNew = Token(_bobNew);
        console.log("Create a swaper");
        console.log("Create token with symbol: ", aliceOld.symbol());
        console.log("Create token with symbol: ", aliceNew.symbol());
        console.log("Create token with symbol: ", bobOld.symbol());
        console.log("Create token with symbol: ", bobNew.symbol());
    }

    function swap(uint256 _amount) public {
        
        require(
            aliceOld.balanceOf(msg.sender) >= _amount,
            "Alice has not enough token"
        );
        require(
            _amount.div(aliceOld.getRate()) <
                (bobOld.balanceOf(bobOld.getOwner())).div(bobOld.getRate()),
            "Bob has not enough token"
        );
        require(msg.sender == aliceOld.getOwner());

        aliceOld.transferFrom(aliceOld.getOwner(), bobNew.getOwner(), _amount);

        //bobOld.transferFrom(bobOld.getOwner(), aliceNew.getOwner(), (_amount.div(aliceOld.getRate())).mul(bobOld.getRate()));
        // bobOld.transfer(
        //     address(aliceNew),
        //     (_amount / aliceOld.getRate()) * bobOld.getRate()
        // );
    }
}
