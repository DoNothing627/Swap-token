// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SwaperV2 is Initializable, OwnableUpgradeable {
    using SafeERC20Upgradeable for ERC20Upgradeable;

    struct Rate {
        uint256 rate;
        uint32 rateDecimals;
    }

    mapping(address => mapping(address => Rate)) public tokenRate;

    function __Swap_init() public initializer {
        __Ownable_init();
    }

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

    // function withdraw(
    //     address _token,
    //     uint256 _amount,
    //     address _receiver
    // ) external payable onlyOwner {}

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
            ERC20Upgradeable token = ERC20Upgradeable(_tokenIn);
            token.safeTransferFrom(_msgSender(), address(this), _amount);
        }
    }

    function _tokenOutHandle(address _tokenOut, uint256 _amount) private {
        if (_tokenOut != address(0)) {
            ERC20Upgradeable token = ERC20Upgradeable(_tokenOut);
            token.safeTransfer(_msgSender(), _amount);
            return;
        }
        (bool sent, ) = (_msgSender()).call{value: _amount}("");
        require(sent, "Transfer token failed");
    }
}
