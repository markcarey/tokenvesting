// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import {
    ISuperfluid,
    ISuperToken,
    ISuperAgreement
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts/proxy/Clones.sol";

interface IVestingFactory {
    function addUser(address user) external returns (bool);    
}

contract TokenVestor is Initializable, AccessControlEnumerableUpgradeable {
    using SafeMath for uint256;

    enum FlowState { Registered, Flowing, Stopped }
    
    struct Flow {
        address recipient;
        int96 flowRate;
        bool permanent;
        FlowState state;
        uint256 cliffEnd;
        uint256 vestingDuration;
        uint256 starttime;
    }

    event FlowStopped(
        address recipient,
        int96 flowRate,
        bool wasPermanent
    );

    event FlowCreated(
        address recipient,
        int96 flowRate,
        bool wasPermanent
    );

    ISuperfluid _host;
    IConstantFlowAgreementV1 _cfa;
    ISuperToken public acceptedToken;
   
    address[] recipientAddresses;
    mapping(address => Flow[]) _recipients;
    mapping(address => int96) flowRates;

    bytes32 public constant MANAGER = keccak256("MANAGER_ROLE");
    bytes32 public constant GRANTOR = keccak256("GRANTOR_ROLE");
    bytes32 public constant CLOSER = keccak256("CLOSER_ROLE");
   
    address admin;
    IVestingFactory factory;

    function initialize(
        address _acceptedToken,
        address owner
    ) public virtual initializer {
        require(address(_acceptedToken) != address(0), "acceptedToken is zero address");
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();

        console.log("chainid", block.chainid);
        if ( block.chainid == 137 ) {
            _host = ISuperfluid(0x3E14dC1b13c488a8d5D310918780c983bD5982E7);
            _cfa = IConstantFlowAgreementV1(0x6EeE6060f715257b970700bc2656De21dEdF074C);
        }
        if ( block.chainid == 80001 || block.chainid == 31337 ) {
            _host = ISuperfluid(0xEB796bdb90fFA0f28255275e16936D25d3418603);
            _cfa = IConstantFlowAgreementV1(0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873);
        }

        // Mumbai: change this!!!
        _host = ISuperfluid(0xEB796bdb90fFA0f28255275e16936D25d3418603);
        _cfa = IConstantFlowAgreementV1(0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873);


        acceptedToken = ISuperToken(_acceptedToken);
        admin = owner;
        factory = IVestingFactory(msg.sender);

        //Access Control
        console.log("before any role granting");
        //_setupRole(DEFAULT_ADMIN_ROLE, address(this));
        console.log("before grant default to admin");
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        console.log("after granting DEFAULT admin role");
        _setupRole(MANAGER, admin);
        _setupRole(GRANTOR, admin);
        _setupRole(CLOSER, admin);
    }

    modifier onlyManager() {
        require(hasRole(MANAGER, msg.sender) || 
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 
                "Only allowed by Manager");
        _;
    }
    
    modifier atLeastGrantor() {
        require(hasRole(MANAGER,msg.sender) || 
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(GRANTOR, msg.sender),
                "Only allowed by Grantor or Manager");
        _;
    }
    
    modifier atLeastCloser() {
        require(hasRole(MANAGER,msg.sender) || 
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(GRANTOR, msg.sender) ||
                hasRole(CLOSER, msg.sender),
                "Only allowed by Closer or Grantor or Manager");
        _;
    }

    modifier notRegistered(address adr) {
        require(!isRecipientRegistered(adr), "Registered Recipient");
        _;
    }

    modifier registeredRecipient(address adr) {
        require(isRecipientRegistered(adr), "Not Registered Recipient");
        _;
    }

    function grantRole(bytes32 role, address account) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        factory.addUser(account);
        super.grantRole(role, account);
    }

    function launchVesting(address[] calldata recipientAddresses) public onlyManager {
        console.log("start launchVesting");
        for(uint i = 0; i < recipientAddresses.length; i++) {
            address addr = recipientAddresses[i];
            console.log("starting on address ", addr);
            Flow[] memory flows = _recipients[addr];
            for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
                console.log("starting on flow with flowIndex", flowIndex);
                if (block.timestamp > flows[flowIndex].cliffEnd) {
                    console.log("before createOrUpdate");
                    createOrUpdateStream(recipientAddresses[i], flowIndex);
                }
            }
        }
    }

    function createOrUpdateStream(address recipient, uint256 flowIndex) internal {
        (, int96 outFlowRate, , ) = _cfa.getFlow(acceptedToken, address(this), recipient);
        if (outFlowRate == 0) {
            if (recipient != address(this)) {
                openStream(recipient, flowIndex);
            }
        } else {
            // increase the outflow by flowRate
            updateStream(recipient, flowIndex, outFlowRate + _recipients[recipient][flowIndex].flowRate);
        }
    }

    function openStream(address recipient, uint256 i) internal {
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.createFlow.selector,
                acceptedToken,
                recipient,
                _recipients[recipient][i].flowRate,
                new bytes(0)
            ),
            new bytes(0)
        );
        _recipients[recipient][i].state = FlowState.Flowing;
        if (_recipients[recipient][i].starttime == 0) {
            _recipients[recipient][i].starttime = block.timestamp;
        }
        flowRates[recipient] = _recipients[recipient][i].flowRate;
    }

    function updateStream(address recipient, uint256 i, int96 newFlowRate) internal {
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.updateFlow.selector,
                acceptedToken,
                recipient,
                newFlowRate,
                new bytes(0)
            ),
            new bytes(0)
        );
        _recipients[recipient][i].state = FlowState.Flowing;
        if (_recipients[recipient][i].starttime == 0) {
            _recipients[recipient][i].starttime = block.timestamp;
        }
        flowRates[recipient] = newFlowRate;
    }

    function elapsedTime(address recipient, uint256 flowIndex) public view returns (uint256) {
        uint256 elapsed = 0;
        if (_recipients[recipient][flowIndex].starttime > 0) {
            elapsed = block.timestamp.sub(_recipients[recipient][flowIndex].starttime);
        }
        return elapsed;
    }

    function closeVesting(address[] calldata recipientAddresses) public atLeastCloser {
        for(uint i = 0; i < recipientAddresses.length; i++) {
            address addr = recipientAddresses[i];
            Flow[] memory flows = _recipients[addr];
            for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
                if (elapsedTime(addr, flowIndex) > flows[flowIndex].vestingDuration) {
                    closeOrUpdateStream(addr, flowIndex);
                }
            }
        }
    }

    function closeOrUpdateStream(address recipient, uint256 flowIndex) internal {
        (, int96 outFlowRate, , ) = _cfa.getFlow(acceptedToken, address(this), recipient);
        if (outFlowRate == _recipients[recipient][flowIndex].flowRate) {
            closeStream(recipient, flowIndex);
        } else if (outFlowRate > _recipients[recipient][flowIndex].flowRate) {
            // decrease the outflow by flowRate
            updateStream(recipient, flowIndex, outFlowRate - _recipients[recipient][flowIndex].flowRate);
        }
    }

    function closeStream(address recipient, uint256 flowIndex) public atLeastCloser {
        require(_recipients[recipient][flowIndex].state == FlowState.Flowing, "Stream inactive");

        if(elapsedTime(recipient, flowIndex) < _recipients[recipient][flowIndex].vestingDuration) {
            require(!isPermanentFlow(recipient, flowIndex), "Stream is permanent and cannot be closed.");
        }

        (, int96 outFlowRate, , ) = _cfa.getFlow(acceptedToken, address(this), recipient);
        if (outFlowRate > _recipients[recipient][flowIndex].flowRate) {
            // decrease the outflow by flowRate
            updateStream(recipient, flowIndex, outFlowRate - _recipients[recipient][flowIndex].flowRate);
        } else {

            _host.callAgreement(
                _cfa,
                abi.encodeWithSelector(
                    _cfa.deleteFlow.selector,
                    acceptedToken,
                    address(this),
                    recipient,
                    new bytes(0)
                ),
                new bytes(0)
            );

            flowRates[recipient] = 0;
            _recipients[recipient][flowIndex].state = FlowState.Stopped;
            emit FlowStopped(recipient,  _recipients[recipient][flowIndex].flowRate, isPermanentFlow(recipient, flowIndex));
        }
    }

    // now this returns an array of {Flow}s
    function getFlowRecipient(address adr) public onlyManager view returns (Flow[] memory) {
        return _recipients[adr];
    }

    function getAllAddresses() public onlyManager view returns (address[] memory) {
        return recipientAddresses;
    }

    function registerFlow(address adr, int96 flowRate, bool isPermanent, uint256 cliffEnd, uint256 vestingDuration) public atLeastGrantor returns (Flow memory) {
        require(flowRate > 0, "flowRate <= 0");
        Flow memory newFlow = Flow(adr, flowRate, isPermanent, FlowState.Registered, cliffEnd, vestingDuration, 0);
        if (_recipients[adr].length == 0) {
            recipientAddresses.push(adr);
        }
        _recipients[adr].push(newFlow);
        emit FlowCreated(adr, flowRate, isPermanent);
        return newFlow;
    }

    function isRecipientRegistered(address adr) internal view returns (bool) {
        return _recipients[adr].length > 0;
    }

    function isPermanentFlow(address adr, uint256 flowIndex) internal registeredRecipient(adr) view returns (bool) {
        return _recipients[adr][flowIndex].permanent;
    }

    // converts a flowRate from int96 to uint256 for math purposes
    function toUint256(int96 flowRate) internal view returns (uint256) {
        return uint256(uint96(flowRate));
    }

    function flowTokenBalance() public view returns (uint256) {
        return acceptedToken.balanceOf(address(this));
    }

    function withdraw(IERC20 token, uint256 amount) public onlyManager {
        require(amount <= token.balanceOf(address(this)), "Withdrawal amount exceeds balance");
        bool transferSuccess = token.transfer(msg.sender, amount);
        if(!transferSuccess) revert("Token transfer failed");
    }

    function deposit(IERC20 token, uint256 amount) public {
        bool transferSuccess = token.transferFrom(msg.sender, address(this), amount);
        if(!transferSuccess) revert("Token transfer failed");
        upgrade(token);
    }

    function upgrade(IERC20 token) public {
        uint256 amount = token.balanceOf(address(this));
        if (amount > 0) {
            token.approve(address(acceptedToken), amount);
            acceptedToken.upgrade(amount);
        }
    }

}


contract VestingFactory {
    address immutable tokenImplementation;
    address owner;
    address[] public allVestors;
    mapping(address => address[]) userToVestors;
    mapping(address => address) ownerOfVestor;


    constructor() public {
        tokenImplementation = address(new TokenVestor());
        owner = msg.sender;
    }

    event VestorCreated(
        address indexed _owner,
        address _contract,
        uint
    );

    function createVestor(address _token) external returns (address) {
        address clone = Clones.clone(tokenImplementation);
        TokenVestor(clone).initialize(_token, msg.sender);
        allVestors.push(clone);
        userToVestors[msg.sender].push(clone);
        ownerOfVestor[clone] = msg.sender;
        emit VestorCreated(msg.sender, clone, allVestors.length);
        return clone;
    }

    // should be called only by vestor contract
    function addUser(address user) external returns (bool) {
        userToVestors[user].push(msg.sender);
        return true;
    }

    // returns array of all TokenVestor contract addresses
    function getAllVestors() public view returns (address[] memory){
       return allVestors;
    }

    // returns array of all Garden contract addresses for a specified user address
    function getVestorsForUser(address user) public view returns (address[] memory){
       return userToVestors[user];
    }

}
