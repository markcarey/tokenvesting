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
        uint256 cliffAmount;
        bytes32 ref;
    }

    event FlowStopped(
        address recipient,
        uint256 flowIndex,
        int96 flowRate,
        bool permanent,
        FlowState state,
        uint256 cliffEnd,
        uint256 vestingDuration,
        uint256 starttime,
        uint256 cliffAmount,
        bytes32 ref
    );

    event FlowCreated(
        address recipient,
        uint256 flowIndex,
        int96 flowRate,
        bool permanent,
        FlowState state,
        uint256 cliffEnd,
        uint256 vestingDuration,
        uint256 starttime,
        uint256 cliffAmount,
        bytes32 ref
    );

    event FlowStarted(
        address recipient,
        uint256 flowIndex,
        int96 flowRate,
        bool permanent,
        FlowState state,
        uint256 cliffEnd,
        uint256 vestingDuration,
        uint256 starttime,
        uint256 cliffAmount,
        bytes32 ref
    );

    ISuperfluid _host;
    IConstantFlowAgreementV1 _cfa;
    ISuperToken public acceptedToken;
   
    address[] recipientAddresses;
    mapping(address => Flow[]) _recipients;
    mapping(address => int96) flowRates;
    address public nextCloseAddress;
    uint256 public nextCloseDate;

    bytes32 public constant MANAGER = keccak256("MANAGER_ROLE");
    bytes32 public constant GRANTOR = keccak256("GRANTOR_ROLE");
    bytes32 public constant CLOSER = keccak256("CLOSER_ROLE");
   
    address admin;
    IVestingFactory factory;

    function initialize(
        address _acceptedToken,
        address owner,
        address host,
        address cfa
    ) public virtual initializer {
        require(address(_acceptedToken) != address(0), "acceptedToken is zero address");
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();

        _host = ISuperfluid(host);
        _cfa = IConstantFlowAgreementV1(cfa);

        acceptedToken = ISuperToken(_acceptedToken);
        admin = owner;
        factory = IVestingFactory(msg.sender);
        nextCloseDate = 2524608000;

        //Access Control
        console.log("before any role granting");
        //_setupRole(DEFAULT_ADMIN_ROLE, address(this));
        console.log("before grant default to admin");
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        console.log("after granting DEFAULT admin role");
        _setupRole(MANAGER, admin);
        _setupRole(MANAGER, address(this));
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
                if (flows[flowIndex].state == FlowState.Registered) {
                    if (block.timestamp > flows[flowIndex].cliffEnd) {
                        console.log("before createOrUpdate");
                        createOrUpdateStream(recipientAddresses[i], flowIndex);
                        emit FlowStarted(
                            addr, 
                            flowIndex, 
                            _recipients[addr][flowIndex].flowRate, 
                            _recipients[addr][flowIndex].permanent,
                            _recipients[addr][flowIndex].state,
                            _recipients[addr][flowIndex].cliffEnd,
                            _recipients[addr][flowIndex].vestingDuration,
                            _recipients[addr][flowIndex].starttime,
                            _recipients[addr][flowIndex].cliffAmount,
                            _recipients[addr][flowIndex].ref  
                        );
                    }
                }
            }
        }
    }

    function createOrUpdateStream(address recipient, uint256 flowIndex) internal {
        (, int96 outFlowRate, , ) = _cfa.getFlow(acceptedToken, address(this), recipient);
        require(_recipients[recipient][flowIndex].starttime == 0, "!already started");
        if ( _recipients[recipient][flowIndex].cliffAmount > 0 ) {
            // send cliff lump sum
            acceptedToken.transfer(recipient, _recipients[recipient][flowIndex].cliffAmount);
        }
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

    // for Gelato Network
    function closeReady() external view returns(bool canExec, bytes memory execPayload) {
        if ( nextCloseAddress == address(0) ) {
            canExec = false;
        } else {
            Flow[] memory flows = _recipients[nextCloseAddress];
            for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
                if (elapsedTime(nextCloseAddress, flowIndex) > flows[flowIndex].vestingDuration) {
                    canExec = true;
                    execPayload = abi.encodeWithSelector(
                        this.closeVestingForAddress.selector,
                        address(nextCloseAddress)
                    );
                }
            }
        }
    }
    function closeVestingForAddress(address addr) public {
        Flow[] memory flows = _recipients[addr];
        for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
            if (flows[flowIndex].state == FlowState.Flowing) {
                if (elapsedTime(addr, flowIndex) > flows[flowIndex].vestingDuration) {
                    _closeStream(addr, flowIndex);
                }
            }
        }
        // now update nextCloseAddress (expensive?)
        nextCloseAddress = findNextCloseAddress();
    }

    function setNextClose(address _addr, uint256 _closeDate) public atLeastCloser {
        require(_addr != address(0), "!zero addr");
        require(_closeDate > nextCloseDate, "!not next");
        nextCloseDate = _closeDate;
        nextCloseAddress = _addr;
    }

    function closeVesting(address[] calldata recipientAddresses) public atLeastCloser {
        for(uint i = 0; i < recipientAddresses.length; i++) {
            address addr = recipientAddresses[i];
            Flow[] memory flows = _recipients[addr];
            for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
                if (flows[flowIndex].state == FlowState.Flowing) {
                    if (elapsedTime(addr, flowIndex) > flows[flowIndex].vestingDuration) {
                        closeStream(addr, flowIndex);
                    }
                }
            }
        }
    }

    // TODO: delete this function? no longer needed?
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
        _closeStream(recipient, flowIndex);
    }

    function _closeStream(address recipient, uint256 flowIndex) internal {
        (, int96 outFlowRate, , ) = _cfa.getFlow(acceptedToken, address(this), recipient);
        //console.log("outFlowRate, flowRate for this flow");
        //console.logInt(outFlowRate);
        //console.logInt(_recipients[recipient][flowIndex].flowRate);
        if (outFlowRate > _recipients[recipient][flowIndex].flowRate) {
            // decrease the outflow by flowRate
            //console.log("there is more than one flow, so update it");
            updateStream(recipient, flowIndex, outFlowRate - _recipients[recipient][flowIndex].flowRate);
            flowRates[recipient] = outFlowRate - _recipients[recipient][flowIndex].flowRate;
        } else {
            //console.log("only flow, so delete it");
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
        }
        _recipients[recipient][flowIndex].state = FlowState.Stopped;
        emit FlowStopped(
            recipient, 
            flowIndex, 
            _recipients[recipient][flowIndex].flowRate, 
            _recipients[recipient][flowIndex].permanent,
            _recipients[recipient][flowIndex].state,
            _recipients[recipient][flowIndex].cliffEnd,
            _recipients[recipient][flowIndex].vestingDuration,
            _recipients[recipient][flowIndex].starttime,
            _recipients[recipient][flowIndex].cliffAmount,
            _recipients[recipient][flowIndex].ref
        );
    }

    function redirectStreams(address oldRecipient, address newRecipient, bytes32 ref) external onlyManager {
        //console.log("start redirectStreams: from, to, ref:->", oldRecipient, newRecipient);
        //console.logBytes32(ref);
        Flow[] memory flows = _recipients[oldRecipient];
        for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
            //console.log("starting on flowIndex", flowIndex);
            if ( ref == bytes32(0) || ref == flows[flowIndex].ref ) {
                //console.log("passed ref check");
                if ( flows[flowIndex].state != FlowState.Stopped) {
                    //console.log("state is not stopped");
                    uint256 newVestingDuration = flows[flowIndex].vestingDuration;
                    uint256 newCliffAmount = flows[flowIndex].cliffAmount;
                    uint256 newCliffEnd = flows[flowIndex].cliffEnd;
                    if ( flows[flowIndex].state == FlowState.Flowing) {
                        //console.log("state is Flowing, ready to close");
                        _closeStream(oldRecipient, flowIndex);
                        //console.log("after _closeStream");
                        newCliffEnd = block.timestamp - 1;
                        newCliffAmount = 0;
                        newVestingDuration = flows[flowIndex].vestingDuration.sub(elapsedTime(oldRecipient, flowIndex));
                        //console.log("newVestingDuration", newVestingDuration);
                    } else {
                        _recipients[oldRecipient][flowIndex].state = FlowState.Stopped;
                    }
                    Flow memory newFlow = Flow(newRecipient, flows[flowIndex].flowRate, false, FlowState.Registered, newCliffEnd, newVestingDuration, 0, newCliffAmount, flows[flowIndex].ref);
                    //console.log("b4 _registerFlow");
                    _registerFlow(newFlow);
                    //console.log("after _registerFlow");
                }
            }
        }
    }

    // now this returns an array of {Flow}s
    function getFlowRecipient(address adr) public onlyManager view returns (Flow[] memory) {
        return _recipients[adr];
    }

    function getAllAddresses() public onlyManager view returns (address[] memory) {
        return recipientAddresses;
    }


    function registerFlow(address adr, int96 flowRate, bool isPermanent, uint256 cliffEnd, uint256 vestingDuration, uint256 cliffAmount, bytes32 ref) public atLeastGrantor returns (Flow memory) {
        require(flowRate > 0, "flowRate <= 0");
        Flow memory newFlow = Flow(adr, flowRate, isPermanent, FlowState.Registered, cliffEnd, vestingDuration, 0, cliffAmount, ref);
        return _registerFlow(newFlow);
    }

    function registerBatch(address[] calldata adr, int96[] calldata flowRate, uint256[] calldata cliffEnd, uint256[] calldata vestingDuration, uint256[] calldata cliffAmount, bytes32[] calldata ref) public atLeastGrantor {
        //TODO: check that lengths match
        for(uint i = 0; i < adr.length; i++) {
            Flow memory newFlow = Flow(adr[i], flowRate[i], false, FlowState.Registered, cliffEnd[i], vestingDuration[i], 0, cliffAmount[i], ref[i]);
            _registerFlow(newFlow);
        }
    }

    function registerBatchPermanent(address[] calldata adr, int96[] calldata flowRate, uint256[] calldata cliffEnd, uint256[] calldata vestingDuration, uint256[] calldata cliffAmount, bytes32[] calldata ref) public atLeastGrantor {
        //TODO: check that lengths match
        for(uint i = 0; i < adr.length; i++) {
            Flow memory newFlow = Flow(adr[i], flowRate[i], true, FlowState.Registered, cliffEnd[i], vestingDuration[i], 0, cliffAmount[i], ref[i]);
            _registerFlow(newFlow);
        }
    }

    function addRef(address adr, uint256 flowIndex, bytes32 ref) external atLeastGrantor {
        _recipients[adr][flowIndex].ref = ref;
    }

    function _registerFlow(Flow memory newFlow) internal returns (Flow memory) {
        if (_recipients[newFlow.recipient].length == 0) {
            recipientAddresses.push(newFlow.recipient);
        }
        _recipients[newFlow.recipient].push(newFlow);
        if ( newFlow.cliffEnd.add(newFlow.vestingDuration) < nextCloseDate ) {
            nextCloseDate = newFlow.cliffEnd.add(newFlow.vestingDuration);
            nextCloseAddress = newFlow.recipient;
        }
        uint256 flowIndex = _recipients[newFlow.recipient].length - 1;
        emit FlowCreated(
            newFlow.recipient, 
            flowIndex, 
            newFlow.flowRate, 
            newFlow.permanent,
            newFlow.state,
            newFlow.cliffEnd,
            newFlow.vestingDuration,
            newFlow.starttime,
            newFlow.cliffAmount,
            newFlow.ref
        );
        if (block.timestamp > newFlow.cliffEnd) {
            createOrUpdateStream(newFlow.recipient, flowIndex);
            emit FlowStarted(
                newFlow.recipient, 
                flowIndex, 
                newFlow.flowRate, 
                newFlow.permanent,
                newFlow.state,
                newFlow.cliffEnd,
                newFlow.vestingDuration,
                newFlow.starttime,
                newFlow.cliffAmount,
                newFlow.ref  
            );
        }
        return newFlow;
    }

    function closeDate(address recipient, uint256 flowIndex) internal view returns(uint256) {
        return _recipients[recipient][flowIndex].cliffEnd.add(_recipients[recipient][flowIndex].vestingDuration);
    }

    function findNextCloseAddress() internal returns(address) {
        uint256 nextDate = 2524608000;
        address nextAddress;
        for(uint i = 0; i < recipientAddresses.length; i++) {
            address addr = recipientAddresses[i];
            Flow[] memory flows = _recipients[addr];
            for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
                if ( closeDate(addr, flowIndex) < nextDate ) {
                    nextDate = closeDate(addr, flowIndex);
                    nextAddress = addr;
                }
            }
        }
        nextCloseDate = nextDate;
        return nextAddress;
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

    function getNetFlow() public view returns (int96) {
       return _cfa.getNetFlow(acceptedToken, address(this));
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
