pragma solidity ^0.8.4;
import "./Token.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Swaper{
    using SafeMath for uint256;

    function swap(address user, address _from, address _to, uint256 _amount, uint256 rate) public {
        Token from= Token(_from);
        Token to= Token(_to);

        require(
            from.balanceOf(user) >= _amount,
            "USER has not enough token"
        );
        require(
            _amount.div(rate) <=
                to.balanceOf(address(this)),
            "Bank has not enough token"
        );

        to.approve(user, _amount);

        from.transferFrom(user, address(this), _amount);
        to.transfer(user, _amount.div(rate));
    }
}
