// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./TokenVestor.sol";

import "@openzeppelin/contracts/proxy/Clones.sol";

contract VestingFactory {
    address immutable tokenImplementation;
    address owner;
    address[] public allVestors;
    mapping(address => address[]) userToVestors;
    mapping(address => address) ownerOfVestor;

    constructor() {
        tokenImplementation = address(new TokenVestor());
        owner = msg.sender;
    }

    event VestorCreated(
        address indexed _owner,
        address _contract,
        uint
    );

    // @dev deploys a TokenVestor contract
    function createVestor(address _token, address _host, address _cfa) external returns (address) {
        address clone = Clones.clone(tokenImplementation);
        TokenVestor(clone).initialize(_token, msg.sender, _host, _cfa);
        allVestors.push(clone);
        userToVestors[msg.sender].push(clone);
        ownerOfVestor[clone] = msg.sender;
        emit VestorCreated(msg.sender, clone, allVestors.length);
        return clone;
    }

    // @dev should be called only by TokenVestor contract
    function addUser(address user) external returns (bool) {
        userToVestors[user].push(msg.sender);
        return true;
    }

    // @dev returns array of all TokenVestor contract addresses
    function getAllVestors() public view returns (address[] memory){
       return allVestors;
    }

    // @dev returns array of all TokenVestor contract addresses for a specified user address
    function getVestorsForUser(address user) public view returns (address[] memory){
       return userToVestors[user];
    }

}
