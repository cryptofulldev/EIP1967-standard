//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract LogicContract is Ownable {
    string public name;
    string public publicStr;
    uint256 public publicNumber;
    uint256 public publicValue;

    string public ownerStr;
    uint256 public ownerNumer;
    uint256 public ownerValue;

    event LogicEvent(
        address indexed emitter,
        string eventName,
        uint256 eventValue
    );

    constructor(string memory _name) {
        name = _name;
    }

    function publicFunc(string memory _str, uint256 _num) external payable {
        publicStr = _str;
        publicNumber = _num;
        publicValue = msg.value;
    }

    function ownerFunc(string calldata _str, uint256 _num)
        external
        payable
        onlyOwner
    {
        ownerStr = _str;
        ownerNumer = _num;
        ownerValue = msg.value;
    }

    function eventTest(string memory _eventName, uint256 _eventValue) external {
        emit LogicEvent(msg.sender, _eventName, _eventValue);
    }
}
