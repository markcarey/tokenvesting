// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.4;

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
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract FluidVesting is Ownable {

    using SafeMath for uint256;

    enum RecipientState { Registered, Flowing, Stopped }
    
    struct FlowRecipient {
        address recipient;
        uint256 flowRate;
        bool permanent;
        RecipientState state;
    }

    event FlowStopped(
        address recipient,
        uint256 flowRate,
        bool wasPermanent
    );

    ISuperfluid _host;
    IConstantFlowAgreementV1 _cfa;
    ISuperToken public acceptedToken;
   
    mapping(address => FlowRecipient) _recipients;
    mapping(address => bool) _permanentRecipients;
    mapping(address => bool) _impermanentRecipients;
    mapping(address => uint256) _recipientLastStopped;
    mapping(address => uint256) _recipientToPauseDuration;
   
    address admin;
    uint256 public cliffEnd;
    uint256 public starttime;
    uint256 public vestingDuration;
    bool public vestingActive;

    constructor(ISuperfluid host, IConstantFlowAgreementV1 cfa, ISuperToken _acceptedToken, uint256 _cliffEnd, uint256 _vestingDuration) {
        require(address(host) != address(0), "host is zero address");
        require(address(cfa) != address(0), "cfa is zero address");
        require(address(_acceptedToken) != address(0), "acceptedToken is zero address");
        require(_vestingDuration > 0, "vestingDuration must be larger than 0");

        if(_cliffEnd == 0) _cliffEnd = block.timestamp;
        _host = host;
        _cfa = cfa;
        acceptedToken = _acceptedToken;
        cliffEnd = _cliffEnd;
        vestingDuration = _vestingDuration;
        admin = msg.sender;

        initializeRecipients();
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only allowed by admin");
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

    

    function initializeRecipients() virtual internal;

    

    function launchVesting(address[] calldata recipientAddresses) public onlyOwner {

        require(block.timestamp > cliffEnd, "Cliff period not ended.");

        

        for(uint i = 0; i < recipientAddresses.length; i++) {

            openStream(recipientAddresses[i]);

        }

        

        if(!vestingActive) {

            starttime = block.timestamp;

            vestingActive = true;

        }

    }

    

    function openStream(address recipient) internal {

        _host.callAgreement(

            _cfa,

            abi.encodeWithSelector(

                _cfa.createFlow.selector,

                acceptedToken,

                recipient,

                _recipients[recipient].flowRate,

                new bytes(0)

            ),

            new bytes(0)

        );

        

        _recipients[recipient].state = RecipientState.Flowing;

    }

    

    function resumeStream() public {

        if(isRecipientRegistered(msg.sender) && isPermanentRecipient(msg.sender)) {

            

            openStream(msg.sender);

            

            if(_recipientLastStopped[msg.sender] > 0) {

                uint256 lastPauseDuration = block.timestamp.sub(_recipientLastStopped[msg.sender]);

                _recipientToPauseDuration[msg.sender] = _recipientToPauseDuration[msg.sender].add(lastPauseDuration);

                _recipientLastStopped[msg.sender] = 0;

            }

        } else {

            revert("Only Stream Recipient can reopen the stream.");

        }

    }

    

    function elapsedTime() public view returns (uint256) {

        require(starttime > 0, "Vesting has not yet started.");

        return block.timestamp.sub(starttime);

    }



    function estimateElapsedTokens(address recipient) public view onlyAdmin returns (uint256) {

        require(vestingActive, "Vesting inactive");

        

        uint256 durationEstimate = block.timestamp

                                    .sub(starttime)

                                    .mul(_recipients[recipient].flowRate);

        uint256 pauseEstimate = _recipientToPauseDuration[recipient].mul(_recipients[recipient].flowRate);

        

        return durationEstimate.sub(pauseEstimate);

    }

    

    function estimateTotalTokens(address recipient) public onlyAdmin view returns (uint256) {

        return vestingDuration.mul(_recipients[recipient].flowRate);

    }

    

    function estimateRemainingTokens(address recipient) public onlyAdmin  view returns (uint256) {

        return estimateTotalTokens(recipient).sub(estimateElapsedTokens(recipient));

    }

    

    function getFlowRecipient(address adr) public onlyAdmin view returns (FlowRecipient memory) {

        return _recipients[adr];

    }

    

    function registerRecipient(address adr, uint256 flowRate, bool isPermanent) public onlyOwner notRegistered(adr) returns (FlowRecipient memory) {

        FlowRecipient memory newRecipient = FlowRecipient(adr, flowRate, isPermanent, RecipientState.Registered);

        _recipients[adr] = newRecipient;

        

        return newRecipient;

    }

    

    function isRecipientRegistered(address adr) internal view returns (bool) {

        return _recipients[adr].recipient != address(0);

    }

    

    function isPermanentRecipient(address adr) internal registeredRecipient(adr) view returns (bool) {

        return _recipients[adr].permanent;

    }

    

    function flowTokenBalance() public view returns (uint256) {

        return acceptedToken.balanceOf(address(this));

    }



    function withdraw(IERC20 token, uint256 amount) public onlyOwner {

        require(amount <= token.balanceOf(address(this)), "Withdrawal amount exceeds balance");



        bool transferSuccess = token.transfer(msg.sender, amount);

        if(!transferSuccess) revert("Token transfer failed");

    }

}



contract InvestorsVesting is FluidVesting {



    constructor(ISuperfluid host, IConstantFlowAgreementV1 cfa, ISuperToken _acceptedToken, uint256 _cliffEnd, uint256 _vestingDuration) FluidVesting(host, cfa, _acceptedToken, _cliffEnd, _vestingDuration) {}

    

    function initializeRecipients() internal override {

        // Investors (36 months)

        registerRecipient(0x08AAE6A5979625F2173f1C31A3417251B2386777, 317097919800000, true);

        registerRecipient(0x6b339824883E59676EA605260E4DdA71DcCA29Ae, 158548959900000, true);

        registerRecipient(0xC71F1e087AadfBaE3e8578b5eFAFDeC8aFA95a16, 1268391679000000, true);

        registerRecipient(0x54a55291aF851f5d439536889eeF191B81D3c091, 4756468798000000, true);

        registerRecipient(0x51787a2C56d710c68140bdAdeFD3A98BfF96FeB4, 317097919800000, true);

        registerRecipient(0x6d16749cEfb3892A101631279A8fe7369A281D0E, 634195839700000, true);

        registerRecipient(0x91ec125BC831ab9985DAec9a52fa98b2825F0b84, 158548959900000, true);

        registerRecipient(0x96481CB0fCd7673254eBccC42DcE9B92da10ea04, 317097919800000, true);

        registerRecipient(0xbB6EEfC580453f68f04d7f29C82b6BA71D25eacB, 158548959900000, true);

        registerRecipient(0x30B48995C89cc09e6d1dA2d97Ca384249e289285, 63419583970000, true);

        registerRecipient(0x0caCf3518029666703c08aB7f1F9AD1Aca4C38D1, 317097919800000, true);

    }

}



contract TeamVesting is FluidVesting {



    constructor(ISuperfluid host, IConstantFlowAgreementV1 cfa, ISuperToken _acceptedToken, uint256 _cliffEnd, uint256 _vestingDuration) FluidVesting(host, cfa, _acceptedToken, _cliffEnd, _vestingDuration) {}

    

    function initializeRecipients() internal override {

        // Team (48 months)

        registerRecipient(0x9BBD23d2A0e8078e5f17827f4b25baB18E0fc432, 3170979198000000, true);

        registerRecipient(0x3FA26ceeD3bb6c68b9a82bDE411eE2DAF3aE78E3, 3170979198000000, true);

        registerRecipient(0xaA38dDc7411462A195c9a8020aab1A04E8672B6B, 3170979198000000, true);

        registerRecipient(0xAe9DB1fF69cfCa2720fF2e5d81807d7383138A39, 3963723998000000, true);

        registerRecipient(0x6960CcbAe6A13813618f275B10EE0FB55271ce1D, 396372399800000, true);

    }

}



contract StoppableVesting is FluidVesting {



    constructor(ISuperfluid host, IConstantFlowAgreementV1 cfa, ISuperToken _acceptedToken, uint256 _cliffEnd, uint256 _vestingDuration) FluidVesting(host, cfa, _acceptedToken, _cliffEnd, _vestingDuration) {}

    

    function initializeRecipients() internal override {

        // Stoppable (48 months, no cliff)

        registerRecipient(0x474B73e8966D61999B1f829704337C0133F77b56, 396372399800000, false);

    }

    

    function closeVesting(address[] calldata recipientAddresses) public onlyOwner {

        require(vestingActive, "Vesting not started");

        require(elapsedTime() > vestingDuration, "Vesting duration has not expired yet.");

        

        for(uint i = 0; i < recipientAddresses.length; i++) {

            closeStream(recipientAddresses[i]);

        }

    }

    

    function closeStream(address recipient) public onlyOwner {

        require(_recipients[recipient].state == RecipientState.Flowing, "Stream inactive");

        

        if(elapsedTime() < vestingDuration) {

            require(!isPermanentRecipient(recipient), "Stream for this receiver is permanent and cannot be closed.");

        }

        

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



        _recipients[recipient].state = RecipientState.Stopped;

        _recipientLastStopped[recipient] = block.timestamp;

        emit FlowStopped(recipient,  _recipients[recipient].flowRate, isPermanentRecipient(recipient));

    }

}