var web3 = AlchemyWeb3.createAlchemyWeb3("wss://polygon-mumbai.g.alchemy.com/v2/Ptsa6JdQQUtTbRGM1Elvw_ed3cTszLoj");
//var web3 = AlchemyWeb3.createAlchemyWeb3("http://localhost:8545");
var BN = web3.utils.BN;

var showWizard = false;
const factoryAddress = "0xFF1eEde73A7E094F98572Ca9e48593c7238c2F65";
var vestorAddress = "";
var underlyingAddress = "";
var underlyingSymbol = "";
var underlyingDecimals = 18;
var superAddress = "";
var approved = 0;
const factory = new web3.eth.Contract(factoryABI, factoryAddress);
var vestor;
var roles = {
    MANAGER: web3.utils.keccak256("MANAGER_ROLE"),
    GRANTOR: web3.utils.keccak256("GRANTOR_ROLE"),
    CLOSER: web3.utils.keccak256("CLOSER_ROLE")
};

const prov = {"url": "https://polygon-mumbai.g.alchemy.com/v2/Ptsa6JdQQUtTbRGM1Elvw_ed3cTszLoj"};
var provider = new ethers.providers.JsonRpcProvider(prov);

var recipientAdresses = [];
var flowsByAddress = {};
var flows = [];
var chart = {
    "balances": [],
    "flowRates": [],
    "dates": []
};
var flowsChart;
var tokensVested = 0;
var tokensRemaining = 0;
var tokensTotal = 0;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

var chain = "mumbai";
var addr = {};
if (chain == "mumbai") {
    //Mumbai:
    addr.Resolver = "0x8C54C83FbDe3C59e59dd6E324531FB93d4F504d3";
    addr.SuperTokenFactory = "0x200657E2f123761662567A1744f9ACAe50dF47E6";
    addr.SuperHost = "0xEB796bdb90fFA0f28255275e16936D25d3418603";
    addr.cfa = "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873";
    addr.WETH = "0x3C68CE8504087f89c640D02d133646d98e64ddd9";
    addr.DAI = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F";
    addr.USDC = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";
}
if (chain == "polygon") {
    //Polygon
    addr.Resolver = "0xE0cc76334405EE8b39213E620587d815967af39C";
    addr.SuperTokenFactory = "0x2C90719f25B10Fc5646c82DA3240C76Fa5BcCF34";
    addr.SuperHost = "0x3E14dC1b13c488a8d5D310918780c983bD5982E7";
    addr.cfa = ""; // TODO: fill this in
    addr.WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
    addr.DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
    addr.USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    addr.ETHx = "0x27e1e4E6BC79D93032abef01025811B7E4727e85";
    addr.WETHx = addr.ETHx;
    addr.USDCx = "0xCAa7349CEA390F89641fe306D93591f87595dc1F";
    addr.WBTC = "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6";
    addr.WBTCx = "0x4086eBf75233e8492F1BCDa41C7f2A8288c2fB92";
    addr.DAIx = "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2";
}

const WETH = new web3.eth.Contract(tokenABI, addr.WETH); // need this?
const resolver = new web3.eth.Contract(resolverABI, addr.Resolver);
const cfa = new web3.eth.Contract(cfaABI, addr.cfa);

var gas = web3.utils.toHex(new BN('2000000000')); // 2 Gwei;
var dappChain = 80001; // default to Mumbai
var userChain;
var accounts;
var approved = 0;
var wethBal = 0;
var vestorBal = 0;
var dailyFlow = 0;
var daysLeft = 0;

function abbrAddress(address){
    if (!address) {
        address = ethereum.selectedAddress;
    }
    return address.slice(0,4) + "..." + address.slice(address.length - 4);
}


async function main() {
    dappChain = await web3.eth.getChainId();
    console.log("The chainId is " + dappChain);

    accounts = await web3.eth.getAccounts();
    
    userChain = await ethereum.request({ method: 'eth_chainId' });
    console.log("The chainId of connected account is " + web3.utils.hexToNumber(userChain));

    if ( !correctChain() ) {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(dappChain) }],
        });
    }

    window.ethereum.on('accountsChanged', function () {
        log("accounts changed");
        web3.eth.getAccounts(function (error, accts) {
            console.log(accts[0], 'current account after account change');
            accounts = accts;
            location.reload();
        });
    });

    window.ethereum.on('chainChanged', function () {
        log("chain changed");
        location.reload();
    });

    if (accounts.length > 0) {
        //$("li.profile-nav").find(".media-body span").text( abbrAddress() );
        //$(".card-buttons button.connect").hide().next().show();
        return afterConnection();
    } else {
        $(".section").hide();
        $(".chart_data_right.second").attr("style", "display: none !important");
        showWizard = true;
        $("#wizard").show();
    }
    
}

function correctChain() {
  var correct = false;
  if (dappChain == userChain) {
    correct = true;
  }
  return correct;
}

async function afterConnection() {
    return new Promise(async function(resolve, reject) {
        flowsByAddress = {};
        flows = []
        $("li.profile-nav").find(".media-body span").text( abbrAddress() );
        status("Connected as " + abbrAddress() );
        const vestors = await factory.methods.getVestorsForUser(ethereum.selectedAddress).call();
        console.log("vestors for user", vestors);
        if ( vestors.length > 0 ) {
            vestorAddress = vestors[vestors.length - 1];
            console.log("vestorAddress", vestorAddress);
            vestor = new web3.eth.Contract(vestorABI, vestorAddress);
            superAddress = await vestor.methods.acceptedToken().call({'from': ethereum.selectedAddress});
            console.log("superAddress", superAddress);
            const sToken = new web3.eth.Contract(superABI, superAddress);
            vestorBal = await sToken.methods.balanceOf(vestorAddress).call();
            console.log("vestorBal", vestorBal);
            underlyingAddress = await sToken.methods.getUnderlyingToken().call();
            console.log("underlyingAddress", underlyingAddress);
            const uToken = new web3.eth.Contract(tokenABI, underlyingAddress);
            symbol = await uToken.methods.symbol().call();
            console.log("symbol", symbol);
            underlyingDecimals = await uToken.methods.decimals().call();
            console.log("decimals", underlyingDecimals);
            dailyFlow = await cfa.methods.getNetFlow(superAddress, vestorAddress).call();
            dailyFlow = (parseInt(dailyFlow) * -1 ) / (10**underlyingDecimals) * (60*60*24);
            if ( symbol ) {
                underlyingSymbol = symbol;
            }
            const displayBal = parseInt(vestorBal) / (10**underlyingDecimals);
            $("#vestorBal").text(displayBal.toFixed(2));
            $("#flowRate").text(dailyFlow.toFixed(2));
            recipientAdresses = await vestor.methods.getAllAddresses().call({'from': ethereum.selectedAddress});
            console.log("allAdresses", JSON.stringify(recipientAdresses));
            $.each(recipientAdresses, async function( i, address ) {
                var flowsForAddress = await vestor.methods.getFlowRecipient(address).call({'from': ethereum.selectedAddress});
                console.log("flowsForAddress", JSON.stringify(flowsForAddress));
                $.each(flowsForAddress, function(j, flow) {
                    console.log("flow", flow);
                    flow = flowToObject(flow);
                    flow.flowIndex = j;
                    console.log("flow.flowRate", flow.flowRate);
                    flows.push(flow);
                    if ( !(flow.recipient in flowsByAddress) ) {
                        flowsByAddress[flow.recipient] = [];
                    }
                    flowsByAddress[flow.recipient].push(flow);
                });
                if ( i == (recipientAdresses.length - 1) ) {
                    // last recipient
                    tokensVested = tokensTotal - tokensRemaining;
                    console.log("flowsByAddress", flowsByAddress);
                    console.log("flows", flows);
                    renderTable(flows);
                    calcTotals(flows);
                    chart = flowsByDate(flows);
                    $(".daysLeft").text(daysLeft);
                    $("#tokensVested").text(tokensVested.toFixed(0));
                    $("#tokensRemaining").text(tokensRemaining.toFixed(0));
                    const vestPercent = tokensVested / tokensTotal * 100;
                    $("#tokensVestedKnob").val(vestPercent.toFixed(0));
                    const remainingPercent = 100 - vestPercent; 
                    $("#tokensRemainingKnob").val(remainingPercent.toFixed(0));
                    renderKnobs();
                    renderChart(chart, 30);
                }
            });
            
        } else {
            $(".section").hide();
            $(".chart_data_right.second").attr("style", "display: none !important");
            showWizard = true;
            $("#wizard").show();
        }
        resolve();    
    });
}


function flowToObject(f) {
    var flow = {
        "cliffEnd": f.cliffEnd,
        "flowRate": f.flowRate,
        "permanent": f.permanent,
        "recipient": f.recipient,
        "starttime": f.starttime,
        "state": f.state,
        "vestingDuration": f.vestingDuration
    };
    return flow;
}

function flowToArray(f) {
    var flow = [
        f.recipient,
        f.flowRate,
        f.cliffEnd,
        f.vestingDuration,
        f.permanent,
        f.state
    ];
    return flow;
}

function calcTotals(flows) {
    var today = moment().unix();
    $.each(flows, function(i, flow){
        tokensTotal += flow.vestingDuration * ( flow.flowRate / (10**underlyingDecimals));
        var elapsedDuration = today - flow.cliffEnd;
        if (elapsedDuration > 0) {
            tokensVested += elapsedDuration * ( flow.flowRate / (10**underlyingDecimals));
        }
    });
    tokensRemaining = tokensTotal - tokensVested;
}

async function renderTable(flows) {
    $('#all-flows').DataTable({
        destroy: true,
        data: flows,
        columns: [
            { 
                title: "Address",
                data: null,
                render: function ( data, type, full, meta ) {
                    var addr = full.recipient;
                    var short = abbrAddress(addr);
                    return `<span title="${addr}">${short}</span>`;
                }
            },
            { 
                title: "Flow Rate", 
                data: null,
                render: function ( data, type, full, meta ) {
                    var flowRate = full.flowRate;
                    flowRate = parseInt(flowRate) / ( 10**underlyingDecimals);
                    flowRate = flowRate * 60*60*24;
                    return flowRate.toFixed(2) + ` ${underlyingSymbol}x per day`;
                }
            },
            { 
                title: "Start Date",
                data: null,
                render: function ( data, type, full, meta ) {
                    var cliff = full.cliffEnd;
                    return moment.unix(cliff).format("YYYY-MM-DD");
                }
            },
            { 
                title: "Duration",
                data: null,
                render: function ( data, type, full, meta ) {
                    var dur = full.vestingDuration;
                    dur = parseInt(dur) / (60*60*24);
                    return dur.toFixed(1) + " days";
                }
            },
            { 
                title: "Permanent",
                data: null,
                render: function ( data, type, full, meta ) {
                    var perm = full.permanent;
                    if ( perm ) {
                        return `<i data-feather="check-circle"></i>`;
                    } else {
                        return `<i data-feather="x-circle"></i>`;
                    }
                }
            },
            { 
                title: "Status",
                data: null,
                render: function ( data, type, full, meta ) {
                    var state = full.state;
                    if ( state == 0 ) {
                        return "Registered";
                    } else if (state == 1) {
                        return "Flowing";
                    } else {
                        return "Ended";
                    }
                }
            },
            {
                title: "Actions",
                data: null,
                render: function ( data, type, full, meta ) {
                    var actions = "";
                    var state = full.state;
                    if ( state == 0 ) {
                        if ( parseInt(full.cliffEnd) < (Date.now()/1000) ) {
                            actions += `<button data-address="${full.recipient}" data-flowIndex="${full.flowIndex}" class="btn btn-success btn-xs launchFlow" type="button" title="Ready to start flowing">Launch</button>`;
                        }
                    } else if ( state == 1 ) {
                        if (!full.permanent) { 
                            actions += `<button data-address="${full.recipient}" data-flowIndex="${full.flowIndex}" class="btn btn-danger btn-xs stopFlow" type="button" title="still flowing but you can stop it early">Stop Early</button>`;
                        }
                        if ( ( parseInt(full.cliffEnd) + parseInt(full.vestingDuration) ) < (Date.now()/1000) ) {
                            actions += `<button data-address="${full.recipient}" data-flowIndex="${full.flowIndex}" class="btn btn-danger btn-xs stopFlow" type="button" title="ready to be closed">Close</button>`;
                        }
                    }
                    return actions;
                }
            }
        ]
    });
    feather.replace();
}

async function connectWallet() {
    status("Connecting...");
    if (window.ethereum) {
        //console.log("window.ethereum true");
        return window.ethereum
            .enable()
            .then(async result => {
                // Metamask is ready to go!
                //console.log(result);
                accounts = result;
                return afterConnection();
            })
            .catch(reason => {
                // Handle error. Likely the user rejected the login.
            });
    } else {
        // The user doesn't have Metamask installed.
        console.log("window.ethereum false");
    } 
} // connectWallet()

function fromWei(amount) {
    return web3.utils.fromWei(new BN(amount));
}

async function updateStats() {

}



$( document ).ready(function() {

    main();

    $("#connect").click(function(){
        //wizard
        var $tab = $(this).parents(".tab");
        connectWallet()
        .then(function(){
            $tab.hide().next().show();
            $("#setup-wizard span.active").removeClass("active").next().addClass("active");
        });
        return false;
    });

    $("#underlying").change(function(){
        if ( $(this).val() == "other" ) {
            $(this).parent("div").hide();
            $("#underlying-custom").show();
        }
    });

    $("#chooseUnderlying").click(async function(){
        var $tab = $(this).parents(".tab");
        var underlying = $("#underlying").val();
        var wrapIt = false;
        var symbol = "";
        if ( underlying == "other" ) {
            underlyingAddress = $("underlyingCustom").val();
            const token = new web3.eth.Contract(tokenABI, underlyingAddress);
            symbol = await token.methods.symbol().call();
            underlyingDecimals = await token.methods.decimals().call();
            if ( symbol ) {
                underlyingSymbol = symbol;
                var resolved = await resolver.methods.get("supertokens.v1." + symbol + "x").call();
                console.log(resolved);
                if ( resolved == "0x0000000000000000000000000000000000000000" || resolved == "0xc64a23013768e0be8751fd6a2381624194edb6a6" ) {
                    wrapIt = true;
                } else {
                    superAddress = resolved;
                }
            } else {
                // TODO: throw error
            }
        } else {
            underlyingSymbol = underlying;
            underlyingAddress = addr[underlying];
            if ( underlying + 'x' in addr ) {
                superAddress = addr[underlying + 'x'];
            } else {
                wrapIt = true;
            }
        }
        if ( wrapIt ) {
            log("need transaction to create wrapper for " + underlyingSymbol);
            $("#wrap").text("Create Super Token for " + underlyingSymbol);
            $tab.hide().next().show();
        } else {
            log("wrapper exists");
            // skip one
            $tab.hide().next().next().show();
            $("#setup-wizard span.active").removeClass("active").next().addClass("active");
        }
        return false;
    });

    $("#wrap").click(async function(){
        var $tab = $(this).parents(".tab");
        status("creating super token...");
        var $button = $(this);
        $button.text("Creating...");
        const decimals = underlyingDecimals;
        const superTokenFactory = new web3.eth.Contract(superTokenFactoryABI, addr.SuperTokenFactory);
        const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
        const tx = {
            'from': ethereum.selectedAddress,
            'to': addr.SuperTokenFactory,
            'gasPrice': gas,
            'nonce': "" + nonce,
            'data': superTokenFactory.methods.createERC20Wrapper(underlyingAddress, decimals, 2, "Super " + underlyingSymbol, underlyingSymbol + "x").encodeABI()
        };
        const block = web3.eth.getBlockNumber();
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        });
        //console.log(txHash);
        var pendingTxHash = txHash;

        const ethersSTF = new ethers.Contract(addr.SuperTokenFactory, superTokenFactoryABI, provider);
        var filter = await ethersSTF.filters.SuperTokenCreated();
        //var events = await ethersSTF.queryFilter(filter, block, 'latest');
        //superAddress = events[0].args.token;
        ethersSTF.on(filter, (token, event) => { 
            console.log("token", token);
            superAddress = token;
            log("super token " + underlyingSymbol + "x created at " + superAddress);
            $tab.hide().next().show();
            $("#setup-wizard span.active").removeClass("active").next().addClass("active");
        });
        return false;
    });

    $("#createVestor").click(async function(){
        var $tab = $(this).parents(".tab");
        var $button = $(this);
        status("deploying vesting contract for " + underlyingSymbol + "x...");
        $button.text("Deploying...");
        const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
        const tx = {
            'from': ethereum.selectedAddress,
            'to': factoryAddress,
            'gasPrice': gas,
            'nonce': "" + nonce,
            'data': factory.methods.createVestor(superAddress).encodeABI()
        };
        const block = web3.eth.getBlockNumber();
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        });
        //console.log(txHash);
        var pendingTxHash = txHash;

        const ethersFactory = new ethers.Contract(factoryAddress, factoryABI, provider);
        var filter = await ethersFactory.filters.VestorCreated();
        //var events = await ethersSTF.queryFilter(filter, block, 'latest');
        ethersFactory.on(filter, (owner, address, count, event) => { 
            console.log("address", address);
            console.log(event);
            //vestorAddress = events[0].args._contract;
            vestorAddress = address;
            log("Vestor created at " + vestorAddress);
            $button.text("Contract Deployed");
            vestor = new web3.eth.Contract(vestorABI, vestorAddress);
            $tab.next().find("p.lead").text("Deposit " + underlyingSymbol + " into vesting contract");
            $tab.hide().next().show();
            $("#setup-wizard span.active").removeClass("active").next().addClass("active");
        });
        return false;
    });

    $(".deposit").click(async function(){
        var $tab = $(this).parents(".tab");
        var amt = 0;
        var wizard = false;
        var $button = $(this);
        var $amount;
        var prefix = "";
        if ( $(this).data("form") == "wizard" ) {
            wizard = true;
            prefix = "wizard";
        } else {
            prefix = "section";
        }
        amt = $("#" + prefix + "Amount").val();
        $amount = $("#" + prefix + "Amount");
        if ( approved >= amt ) {
            $("button.deposit").text("Waiting...");
            const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
            const tx = {
                'from': ethereum.selectedAddress,
                'to': vestorAddress,
                'gasPrice': gas,
                'nonce': "" + nonce,
                'data': vestor.methods.deposit(underlyingAddress, web3.utils.toHex(web3.utils.toWei(amt))).encodeABI()
            };
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx],
            });
            //console.log(txHash);
            let transactionReceipt = null
            while (transactionReceipt == null) { 
                transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
                await sleep(500)
            }
            status(amt + " " + underlyingSymbol + " desposited and upgraded to " + underlyingSymbol + "x");
            $amount.val(0);
            approved = 0;
            $button.text("Approve");
            if (wizard) {
                $tab.hide().next().show();
                $("#setup-wizard span.active").removeClass("active").next().addClass("active");
            } else {
                $("#depositCard").hide();
                $(".stats.section").show();
            }
            afterConnection()
                .then(function(){
                    renderChart(flows, 30);
                });
        } else {
            // need approval
            $("button.deposit").text("Approving...");
            const token = new web3.eth.Contract(tokenABI, underlyingAddress);
            const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
            const tx = {
                'from': ethereum.selectedAddress,
                'to': underlyingAddress,
                'gasPrice': gas,
                'nonce': "" + nonce,
                'data': token.methods.approve(vestorAddress, web3.utils.toHex(web3.utils.toWei(amt))).encodeABI()
            };
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx],
            });
            //console.log(txHash);
            let transactionReceipt = null
            while (transactionReceipt == null) { 
                transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
                await sleep(500)
            }
            $button.text("Deposit");
            approved = amt;
            status("Approved");
        }
        return false;
    });

    $("#skipDeposit").click(function(){
        var $tab = $(this).parents(".tab");
        $tab.hide().next().show();
        $("#setup-wizard span.active").removeClass("active").next().addClass("active");
        return false;
    });

    $(".per-time-period").click(function(){
        $(".total-amount-field").hide().find("input").val("");
        $(".time-period-fields").show();
    });

    $(".total-amount").click(function(){
        $(".total-amount-field").show();
        $(".time-period-fields").hide().find("input").val("");
    });

    $("#addFlow, #addFlowCard").click(async function(){
        var $tab = $(this).parents(".tab");
        var wizard = false;
        var $button = $(this);
        $button.text("Adding Flow...");
        var prefix = "";
        if ( $(this).data("form") == "wizard" ) {
            wizard = true;
            prefix = "wizard";
        } else {
            prefix = "section";
        }
        var flowAddress = $("#" + prefix + "Address").val();
        var start = moment( $("#" + prefix + "Start").val() );
        var end = moment( $("#" + prefix + "End").val() );
        var duration = end.unix() - start.unix();;
        console.log("duration", duration);
        var flowRate = 0;
        var seconds = 0;
        var amount = $("#" + prefix + "FlowAmount").val();
        if (amount) {
            seconds = $("#" + prefix + "FlowSeconds").val();
        } else {
            amount = $("#" + prefix + "TotalAmount").val();
            if (!amount) {
                console.log("ERROR: no amount specified");
                return;
            }
            seconds = duration;
        }
        flowRate = parseInt( amount / seconds * ( 10**underlyingDecimals) );
        console.log("flowRate", flowRate);
        var permanent = false;
        if ( $("#" + prefix + "Permanent:checked").val() ) {
            permanent = true;
        }
        console.log("permanent", permanent);
        const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
        const tx = {
            'from': ethereum.selectedAddress,
            'to': vestorAddress,
            'gasPrice': gas,
            'nonce': "" + nonce,
            'data': vestor.methods.registerFlow(flowAddress, flowRate, permanent, start.unix(), duration).encodeABI()
        };
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        });
        console.log(txHash);
        const ethersVestor = new ethers.Contract(vestorAddress, vestorABI, provider);
        var filter = await ethersVestor.filters.FlowCreated();
        ethersVestor.on(filter, (address, rate, perm, event) => { 
            status("Vesting flow added for " + flowAddress);
            $button.text("Flow Added");
            if (wizard) {
                $("#wizard").hide();
                showWizard = false;
            } else {
                $("#addFlowSection").hide();
            }
            $("#flowsTable").show();
            $button.text("Add Flow");
            if (typeof flowsChart !== 'undefined') {
                flowsChart.destroy();
            }
            afterConnection()
                .then(function(){
                    renderChart(flows, 30);
                });
        });
        return false;
    });

    $( "#all-flows" ).on( "click", ".launchFlow", async function() {
        var $button = $(this);
        $button.text("Launching...");
        const recipient = $(this).data("address");
        const flowIndex = $(this).data("flowIndex");
        const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
        const tx = {
            'from': ethereum.selectedAddress,
            'to': vestorAddress,
            'gasPrice': gas,
            'nonce': "" + nonce,
            'data': vestor.methods.launchVesting([recipient]).encodeABI()
        };
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        });
        console.log(txHash);
        let transactionReceipt = null
        while (transactionReceipt == null) { 
            transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
            await sleep(500)
        }
        status("Vesting flow(s) launched for " + recipient);
        afterConnection();
    });

    $( "#all-flows" ).on( "click", ".stopFlow", async function() {
        var $button = $(this);
        $button.text("Stopping...");
        const recipient = $(this).data("address");
        const flowIndex = $(this).data("flowindex");
        console.log("flowIndex", flowIndex);
        const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
        const tx = {
            'from': ethereum.selectedAddress,
            'to': vestorAddress,
            'gasPrice': gas,
            'nonce': "" + nonce,
            'data': vestor.methods.closeStream(recipient, flowIndex).encodeABI()
        };
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        });
        console.log(txHash);
        let transactionReceipt = null
        while (transactionReceipt == null) { 
            transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
            await sleep(500)
        }
        status("Vesting flow stopped");
        afterConnection();
    });

    $("#addTeam").click(async function(){
        var $button = $(this);
        $button.text("Adding...");
        var teamMember = $("#teamAddress").val();
        var chosenRole = $("#teamRole").val();
        const role = roles[chosenRole];
        status("adding " + teamMember + " as a " + chosenRole + "...");
        const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
        const tx = {
            'from': ethereum.selectedAddress,
            'to': vestorAddress,
            'gasPrice': gas,
            'nonce': "" + nonce,
            'data': vestor.methods.grantRole(role, teamMember).encodeABI()
        };
        const block = web3.eth.getBlockNumber();
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        });
        //console.log(txHash);
        let transactionReceipt = null
        while (transactionReceipt == null) { 
            transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
            await sleep(500)
        }
        status("Added " + teamMember + " as a " + chosenRole);
        $("#teamAddress").val("");
        $button.text("Add Team Member");
        return false;
    });

    $(".chart-days li").click(function(){
        var days = parseInt( $(this).data("days") );
        $(this).addClass("active").siblings().removeClass("active");
        renderChart(chart, days);
    });

    $(".navFlows").click(function(){
        $(".section").hide();
        $(".chart_data_right.second").attr("style", "display: none !important");
        $("#flowsTable").show();
        return false;
    });

    $(".navStats").click(function(){
        $(".section").hide();
        $(".section.stats").show();
        $(".chart_data_right.second").attr("style", "display: block !important");
        return false;
    });

    $(".addFlow").click(function(){
        $(".section").hide();
        $(".chart_data_right.second").attr("style", "display: none !important");
        $("#addFlowSection").show();
        return false;
    });

    $(".team").click(function(){
        $(".section").hide();
        $(".chart_data_right.second").attr("style", "display: none !important");
        $("#teamCard").show();
        return false;
    });

    $(".navDeposit").click(function(){
        $(".section").hide();
        $(".chart_data_right.second").attr("style", "display: none !important");
        $("#depositCard").show();
        return false;
    });

    $(".connect").click(function(){
        connectWallet();
        return false;
    });

    $(".max").click(function(){
        var max = 0;
        if (mode == "deposit") {
            max = web3.utils.fromWei(wethBal);
        } else {
            max = web3.utils.fromWei(userBal);
        }
        $("#amount").val(max);
    });

});



// HTML templates

function getHTML(ctx) {
    var html = "";
    html = `
    TBD
    `;
    return html;
}

function wrongNetworkModal(ctx){
    var html = "";
    html = `
    <div class="fade modal-backdrop show"></div>
    <div role="dialog" aria-modal="true" class="modal-theme modal-switch light modal" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header"><div class="modal-title-custom modal-title h4">Switch Network</div></div>
                <div class="modal-body" style="margin-left: 20px;">
                    <p>Airlift is currently deployed on a fork of mainnet.</p>
                    <p><b>To get started, please switch your network by following the instructions below:</b></p>
                    <ol>
                        <li>Open Metamask</li>
                        <li>Click the network select dropdown</li>
                        <li>Click on "Mumbai Test Network"</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
    `;
    return html;
}

function log(message) {
    console.log(message);
    status(message);
}

function status(message) {
    $.notify({
        message: message
     },
     {
        type:'primary',
        allow_dismiss:false,
        newest_on_top:false ,
        mouse_over:false,
        showProgressbar:false,
        spacing:10,
        timer:2000,
        placement:{
          from:'top',
          align:'right'
        },
        offset:{
          x:30,
          y:30
        },
        delay:1000 ,
        z_index:10000,
        animate:{
          enter:'animated bounce',
          exit:'animated bounce'
      }
    });
}

function flowPerDay(flowRate) {
    return parseInt(flowRate) / (10**underlyingDecimals) * (60*60*24);
}

function flowsByDate(flows) {
    const days = 90;
    var bal = parseInt(vestorBal) / (10**underlyingDecimals);
    var perDay = 0;
    var start = moment().startOf('day');
    var balances = [];
    var flowRates = [];
    var dates = []
    for (let day = 1; day <= days; day++) {
        var dayStart = start.unix();
        var end = moment(start).endOf('day');
        var dayEnd = end.unix();
        console.log("dayStart,dayEnd", dayStart,dayEnd);
        $.each(flows, function( i, flow ) {
            //check for new flows on this day
            var flowStart = parseInt(flow.cliffEnd);
            var flowEnd = flowStart + parseInt(flow.vestingDuration);
            console.log("flowStart,flowEnd", flowStart,flowEnd);
            if ( (flowStart >= dayStart) && (flowStart <= dayEnd) ) {
                console.log("starting on this day");
                perDay += flowPerDay(flow.flowRate);
            }
            //check for ending flows
            if ( (flowEnd >= dayStart) && (flowEnd <= dayEnd) ) {
                console.log("ending on this day");
                perDay -= flowPerDay(flow.flowRate);
            }
        });
        if ( perDay < 0 ) {
            preDay = 0;
        }
        bal -= perDay;
        if (bal < 0) {
            bal = 0;
            if (daysLeft == 0) {
                daysLeft = day;
            }
        }
        balances.push(bal.toFixed(4));
        flowRates.push(perDay.toFixed(4));
        dates.push(start.format("YYYY-MM-DD"));
        start = start.add(1, 'days');
    }
    if (bal > 0) {
        daysLeft = days + "+";
    }
    console.log(balances);
    console.log(flowRates);
    console.log(dates);
    chart.balances = balances;
    chart.flowRates = flowRates;
    chart.dates = dates;
    return chart;
}

function renderChart(chart, days) {
    var options = {
        series: [{
            name: 'Balance',
            data: chart.balances.slice(0,days)
        }, {
            name: 'flow rate',
            data: chart.flowRates.slice(0,days)
        }],
        chart: {
            height: 240,
            type: 'area',
            toolbar: {
                show: false
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'category',
            low: 0,
            offsetX: 0,
            offsetY: 0,
            show: false,
            categories: chart.dates.slice(0,days),
            labels: {
                low: 0,
                offsetX: 0,
                show: false,
            },
            axisBorder: {
                low: 0,
                offsetX: 0,
                show: false,
            },
        },
        markers: {
            strokeWidth: 3,
            colors: "#ffffff",
            strokeColors: [ CubaAdminConfig.primary , CubaAdminConfig.secondary ],
            hover: {
                size: 6,
            }
        },
        yaxis: [
                {
                //low: 0,
                //offsetX: 0,
                //offsetY: 0,
                show: false,
                labels: {
                    low: 0,
                    offsetX: 0,
                    show: false,
                },
                axisBorder: {
                    //low: 0,
                    //offsetX: 0,
                    show: false,
                },
            },
            {
                opposite: true,
                //low: 0,
                //offsetX: 0,
                //offsetY: 0,
                show: false,
                labels: {
                    low: 0,
                    offsetX: 0,
                    show: false,
                },
                axisBorder: {
                    //low: 0,
                    //offsetX: 0,
                    show: false,
                },
            }
        ],
        grid: {
            show: false,
            padding: {
                left: 0,
                right: 0,
                bottom: -15,
                //top: -40
            }
        },
        colors: [ CubaAdminConfig.primary , CubaAdminConfig.secondary ],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.5,
                stops: [0, 80, 100]
            }
        },
        legend: {
            show: false,
        },
        tooltip: {
            x: {
                format: 'MM'
            },
        },
    };
    console.log("ready to render chart");
    $("#flows-chart").html("");
    flowsChart = new ApexCharts(document.querySelector("#flows-chart"), options);
    flowsChart.render();
    console.log("rendered chart");
}

function renderKnobs(){
    $(".knob1").knob({

        'width': 65,
        'height': 65,
        'max': 100,

        change: function (value) {
            //console.log("change : " + value);
        },
        release: function (value) {
            //console.log(this.$.attr('value'));
            console.log("release : " + value);
        },
        cancel: function () {
            console.log("cancel : ", this);
        },
        format: function (value) {
            return value + '%';
        },
        draw: function () {

            // "tron" case
            if (this.$.data('skin') == 'tron') {

                this.cursorExt = 1;

                var a = this.arc(this.cv)  // Arc
                    , pa                   // Previous arc
                    , r = 1;

                this.g.lineWidth = this.lineWidth;

                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }
    });
}
