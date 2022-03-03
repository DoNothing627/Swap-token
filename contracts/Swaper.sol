pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Swaper is Ownable {
    using SafeERC20 for ERC20;

    struct Rate {
        uint256 rate;
        uint32 rateDecimals;
    }

    mapping(address => mapping(address => Rate)) public tokenRate;

    receive() external payable {}

    event ChangeRate(
        address _tokenIn,
        address _tokenOut,
        uint256 _rate,
        uint32 _rateDecimals
    );
    event Swap(address _tokenIn, address _tokenOut, uint256 _amount);

    function changeRate(
        address _tokenIn,
        address _tokenOut,
        uint256 _rate,
        uint32 _rateDecimals
    ) external onlyOwner {
        require(_rate > 0, "Rate must be greater than 0");

        tokenRate[_tokenIn][_tokenOut].rate = _rate;
        tokenRate[_tokenIn][_tokenOut].rateDecimals = _rateDecimals;

        emit ChangeRate(_tokenIn, _tokenOut, _rate, _rateDecimals);
    }

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amount
    ) public payable {
        require(
            _tokenIn != _tokenOut,
            "Can not change 2 token with same address"
        );
        require(
            tokenRate[_tokenIn][_tokenOut].rate > 0,
            "Rate between 2 tokens is unavailable"
        );

        uint256 amountIn = msg.value;
        uint256 amountOut;

        if (_tokenIn != address(0)) {
            amountIn = _amount;
        }

        require(amountIn > 0, "Transfer value must be greater than 0");

        amountOut =
            (amountIn * tokenRate[_tokenIn][_tokenOut].rate) /
            (10**tokenRate[_tokenIn][_tokenOut].rateDecimals);

        _tokenInHandle(_tokenIn, amountIn);
        _tokenOutHandle(_tokenOut, amountOut);

        emit Swap(_tokenIn, _tokenOut, _amount);
    }

    function _tokenInHandle(address _tokenIn, uint256 _amount) private {
        if (_tokenIn != address(0)) {
            ERC20 token = ERC20(_tokenIn);
            token.safeTransferFrom(msg.sender, address(this), _amount);
        }
    }

    function _tokenOutHandle(address _tokenOut, uint256 _amount) private {
        if (_tokenOut != address(0)) {
            ERC20 token = ERC20(_tokenOut);
            token.safeTransfer(msg.sender, _amount);
            return;
        }
        (bool sent, ) = (msg.sender).call{value: _amount}("");
        require(sent, "Transfer token failed");
    }
}
