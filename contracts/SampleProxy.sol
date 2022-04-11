//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleProxy is ERC1967Proxy, Ownable {
    constructor(address _logic) ERC1967Proxy(_logic, "") {}
}
