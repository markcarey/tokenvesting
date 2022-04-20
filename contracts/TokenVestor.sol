// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import {
    ISuperfluid,
    ISuperToken,
    ISuperAgreement
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {
    CFAv1Library
} from "./superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IVestingFactory {
    function addUser(address user) external returns (bool);    
}

contract TokenVestor is Initializable, AccessControlEnumerableUpgradeable {
    using SafeMath for uint256;
    using CFAv1Library for CFAv1Library.InitData;

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
    CFAv1Library.InitData public cfaV1;
    ISuperToken public acceptedToken;
   
    address[] recipientAddresses;
    mapping(address => Flow[]) _recipients;
    mapping(address => int96) flowRates;
    address public nextCloseAddress;
    uint256 public nextCloseDate;

    bytes32 public constant MANAGER = keccak256("MANAGER_ROLE");
    bytes32 public constant GRANTOR = keccak256("GRANTOR_ROLE");
    bytes32 public constant CLOSER = keccak256("CLOSER_ROLE");
    bytes32 public constant LAUNCHER = keccak256("LAUNCHER_ROLE");
   
    address admin;
    IVestingFactory factory;

    function initialize(
        address _acceptedToken,
        address owner,
        address host,
        address cfa
    ) public virtual initializer {
        require(address(_acceptedToken) != address(0), "!0x");
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();

        _host = ISuperfluid(host);
        _cfa = IConstantFlowAgreementV1(cfa);
        cfaV1 = CFAv1Library.InitData(_host, IConstantFlowAgreementV1(address(_host.getAgreementClass(keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")))));

        acceptedToken = ISuperToken(_acceptedToken);
        admin = owner;
        factory = IVestingFactory(msg.sender);
        nextCloseDate = 2524608000;

        //Access Control
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MANAGER, admin);
        _setupRole(MANAGER, address(this));
        _setupRole(GRANTOR, admin);
        _setupRole(CLOSER, admin);
    }

    modifier onlyManager() {
        require(hasRole(MANAGER, msg.sender) || 
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 
                "!Manager");
        _;
    }
    
    modifier atLeastGrantor() {
        require(hasRole(MANAGER,msg.sender) || 
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(GRANTOR, msg.sender),
                "!>Grantor");
        _;
    }
    
    modifier atLeastCloser() {
        require(hasRole(MANAGER,msg.sender) || 
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(GRANTOR, msg.sender) ||
                hasRole(CLOSER, msg.sender),
                "!>Closer");
        _;
    }

    modifier atLeastLauncher() {
        require(hasRole(MANAGER,msg.sender) || 
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                hasRole(GRANTOR, msg.sender) ||
                hasRole(LAUNCHER, msg.sender),
                "!>Launcher");
        _;
    }

    modifier notRegistered(address adr) {
        require(!isRecipientRegistered(adr), "!reg");
        _;
    }

    modifier registeredRecipient(address adr) {
        require(isRecipientRegistered(adr), "!reg");
        _;
    }

    function grantRole(bytes32 role, address account) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        factory.addUser(account);
        super.grantRole(role, account);
    }

    function launchVesting(address[] calldata targetAddresses) public onlyManager {
        for(uint i = 0; i < targetAddresses.length; i++) {
            address addr = targetAddresses[i];
            _launchVestingForAddress(addr);
        }
    }

    function launchVestingToSender() public {
        _launchVestingForAddress(msg.sender);
    }

    function launchVestingForAddress(address addr) public atLeastLauncher {
        _launchVestingForAddress(addr);
    }

    function _launchVestingForAddress(address addr) internal {
        Flow[] memory flows = _recipients[addr];
        int96 newFlowRate;
        uint256 launchCount;
        for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
            if (flows[flowIndex].state == FlowState.Registered) {
                if (block.timestamp > flows[flowIndex].cliffEnd) {
                    newFlowRate = newFlowRate + _recipients[addr][flowIndex].flowRate;
                    if ( _recipients[addr][flowIndex].cliffAmount > 0 ) {
                        // @dev send cliff lump sum
                        acceptedToken.transfer(addr, _recipients[addr][flowIndex].cliffAmount);
                    }
                    _recipients[addr][flowIndex].state = FlowState.Flowing;
                    if (_recipients[addr][flowIndex].starttime == 0) {
                        _recipients[addr][flowIndex].starttime = block.timestamp;
                    }
                    if ( _recipients[addr][flowIndex].starttime.add(_recipients[addr][flowIndex].vestingDuration) < nextCloseDate ) {
                        nextCloseDate = _recipients[addr][flowIndex].starttime.add(_recipients[addr][flowIndex].vestingDuration);
                        nextCloseAddress = addr;
                    }
                    _emitFlowStarted(addr, flowIndex);
                    launchCount++;
                }
            }
            // @dev limit the function 25 flow launches per address
            if (launchCount > 25) {
                break;
            }
        }
        if ( newFlowRate > 0 ) {
            (, int96 outFlowRate, , ) = _cfa.getFlow(acceptedToken, address(this), addr);
            flowRates[addr] = outFlowRate + newFlowRate;
            cfaV1.flow(addr, acceptedToken, outFlowRate + newFlowRate);
        }
    }

    function elapsedTime(address recipient, uint256 flowIndex) public view returns (uint256) {
        if (_recipients[recipient][flowIndex].starttime > 0) {
            return block.timestamp.sub(_recipients[recipient][flowIndex].starttime);
        } else {
            return 0;
        }
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
    function launchReady(address addr) external view returns(bool canExec, bytes memory execPayload) {
        Flow[] memory flows = _recipients[addr];
        for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
            if (flows[flowIndex].state == FlowState.Registered) {
                if (block.timestamp > flows[flowIndex].cliffEnd) {
                    canExec = true;
                    execPayload = abi.encodeWithSelector(
                        this.launchVestingForAddress.selector,
                        address(addr)
                    );
                    break;
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
        // @dev now update nextCloseAddress (expensive?)
        nextCloseAddress = findNextCloseAddress();
    }

    function setNextClose(address _addr, uint256 _closeDate) public atLeastCloser {
        require(_addr != address(0), "!0x");
        require(_closeDate > nextCloseDate, "!next");
        nextCloseDate = _closeDate;
        nextCloseAddress = _addr;
    }

    function closeVesting(address[] calldata targetAddresses) public atLeastCloser {
        for(uint i = 0; i < targetAddresses.length; i++) {
            address addr = targetAddresses[i];
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

    function closeStream(address recipient, uint256 flowIndex) public atLeastCloser {
        require(_recipients[recipient][flowIndex].state == FlowState.Flowing, "inactive");

        if(elapsedTime(recipient, flowIndex) < _recipients[recipient][flowIndex].vestingDuration) {
            require(!isPermanentFlow(recipient, flowIndex), "permanent");
        }
        _closeStream(recipient, flowIndex);
    }

    function _closeStream(address recipient, uint256 flowIndex) internal {
        (, int96 outFlowRate, , ) = _cfa.getFlow(acceptedToken, address(this), recipient);
        cfaV1.flow(recipient, acceptedToken, outFlowRate - _recipients[recipient][flowIndex].flowRate);
        flowRates[recipient] = outFlowRate - _recipients[recipient][flowIndex].flowRate;
        _recipients[recipient][flowIndex].state = FlowState.Stopped;
        _emitFlowStopped(recipient, flowIndex);
    }

    function redirectStreams(address oldRecipient, address newRecipient, bytes32 ref) external onlyManager {
        Flow[] memory flows = _recipients[oldRecipient];
        if (flows.length > 0) {
            int96 redirectedFlowRate;
            for (uint256 flowIndex = 0; flowIndex < flows.length; flowIndex++) {
                if ( ref == bytes32(0) || ref == flows[flowIndex].ref ) {
                    if ( flows[flowIndex].state != FlowState.Stopped) {
                        Flow memory newFlow = Flow(newRecipient, flows[flowIndex].flowRate, false, FlowState.Registered, flows[flowIndex].cliffEnd, flows[flowIndex].vestingDuration, 0, flows[flowIndex].cliffAmount, flows[flowIndex].ref);
                        if ( flows[flowIndex].state == FlowState.Flowing) {
                            _recipients[oldRecipient][flowIndex].state = FlowState.Stopped;
                            _emitFlowStopped(oldRecipient, flowIndex);
                            redirectedFlowRate = redirectedFlowRate + flows[flowIndex].flowRate;
                            newFlow.cliffEnd = block.timestamp + 1;
                            newFlow.cliffAmount = 0;
                            newFlow.vestingDuration = flows[flowIndex].vestingDuration.sub(elapsedTime(oldRecipient, flowIndex));
                        } else if ( flows[flowIndex].state == FlowState.Registered) {
                            // @dev flow exists but not yet started, bump start date to prevent auto-launch
                            _recipients[oldRecipient][flowIndex].state = FlowState.Stopped;
                            newFlow.cliffEnd = block.timestamp + 1;
                        } else {
                            // @dev already stopped so don't redirect
                            continue;
                        }
                        _registerFlow(newFlow, false);
                    }
                }
            }
            // @dev reduce or delete flow to oldRecipient
            (, int96 outFlowRate, , ) = _cfa.getFlow(acceptedToken, address(this), oldRecipient);
            cfaV1.flow(oldRecipient, acceptedToken, outFlowRate - redirectedFlowRate);
            // @dev launch the newly created Flows to newRecipient
            _launchVestingForAddress(newRecipient);
        }
    }

    function _emitFlowStopped(address addr, uint256 flowIndex) internal {
        emit FlowStopped(
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

    function _emitFlowStarted(address addr, uint256 flowIndex) internal {
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

    // @dev returns an array of {Flow}s
    function getFlowRecipient(address adr) public view returns (Flow[] memory) {
        return _recipients[adr];
    }

    function getFlowRecipientPaginated(address adr, uint256 start, uint256 length) public view returns (Flow[] memory flows) {
        if (length > _recipients[adr].length - start) {
            length = _recipients[adr].length - start;
        }
        flows = new Flow[](length);
        for (uint256 i = 0; i < length; i++) {
            flows[i] = _recipients[adr][start + i];
        }
    }

    function getFlowCount(address adr) public view returns (uint256) {
        return _recipients[adr].length;
    }

    function getAllAddresses() public onlyManager view returns (address[] memory) {
        return recipientAddresses;
    }

    function getAllAddressesPaginated(uint256 start, uint256 length) public onlyManager view returns (address[] memory recipients) {
        if (length > recipientAddresses.length - start) {
            length = recipientAddresses.length - start;
        }
        recipients = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            recipients[i] = recipientAddresses[start + i];
        }
    }

    function registerFlow(address adr, int96 flowRate, bool isPermanent, uint256 cliffEnd, uint256 vestingDuration, uint256 cliffAmount, bytes32 ref) public atLeastGrantor returns (Flow memory) {
        require(flowRate > 0, "<= 0");
        Flow memory newFlow = Flow(adr, flowRate, isPermanent, FlowState.Registered, cliffEnd, vestingDuration, 0, cliffAmount, ref);
        return _registerFlow(newFlow, true);
    }

    function registerBatch(address[] calldata adr, int96[] calldata flowRate, uint256[] calldata cliffEnd, uint256[] calldata vestingDuration, uint256[] calldata cliffAmount, bytes32[] calldata ref) public atLeastGrantor {
        for(uint i = 0; i < adr.length; i++) {
            Flow memory newFlow = Flow(adr[i], flowRate[i], false, FlowState.Registered, cliffEnd[i], vestingDuration[i], 0, cliffAmount[i], ref[i]);
            _registerFlow(newFlow, true);
        }
    }

    function registerBatchPermanent(address[] calldata adr, int96[] calldata flowRate, uint256[] calldata cliffEnd, uint256[] calldata vestingDuration, uint256[] calldata cliffAmount, bytes32[] calldata ref) public atLeastGrantor {
        for(uint i = 0; i < adr.length; i++) {
            Flow memory newFlow = Flow(adr[i], flowRate[i], true, FlowState.Registered, cliffEnd[i], vestingDuration[i], 0, cliffAmount[i], ref[i]);
            _registerFlow(newFlow, true);
        }
    }

    function addRef(address adr, uint256 flowIndex, bytes32 ref) external atLeastGrantor {
        _recipients[adr][flowIndex].ref = ref;
    }

    function _registerFlow(Flow memory newFlow, bool autoLaunch) internal returns (Flow memory) {
        if (_recipients[newFlow.recipient].length == 0) {
            recipientAddresses.push(newFlow.recipient);
        }
        _recipients[newFlow.recipient].push(newFlow);
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
        if ( autoLaunch && (block.timestamp > newFlow.cliffEnd) ) {
            // @dev launch this flow
            if ( newFlow.cliffAmount > 0 ) {
                // @dev send cliff lump sum
                acceptedToken.transfer(newFlow.recipient, newFlow.cliffAmount);
            }
            _recipients[newFlow.recipient][flowIndex].state = FlowState.Flowing;
            if (_recipients[newFlow.recipient][flowIndex].starttime == 0) {
                _recipients[newFlow.recipient][flowIndex].starttime = block.timestamp;
            }
            _emitFlowStarted(newFlow.recipient, flowIndex);
            (, int96 outFlowRate, , ) = _cfa.getFlow(acceptedToken, address(this), newFlow.recipient);
            flowRates[newFlow.recipient] = outFlowRate + newFlow.flowRate;
            cfaV1.flow(newFlow.recipient, acceptedToken, outFlowRate + newFlow.flowRate);
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

    function flowTokenBalance() public view returns (uint256) {
        return acceptedToken.balanceOf(address(this));
    }

    function getNetFlow() public view returns (int96) {
       return _cfa.getNetFlow(acceptedToken, address(this));
    }

    function withdraw(IERC20 token, uint256 amount) public onlyManager {
        require(amount <= token.balanceOf(address(this)), ">bal");
        bool transferSuccess = token.transfer(msg.sender, amount);
        if(!transferSuccess) revert("failed");
    }

    function deposit(IERC20 token, uint256 amount) public {
        bool transferSuccess = token.transferFrom(msg.sender, address(this), amount);
        if(!transferSuccess) revert("failed");
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
