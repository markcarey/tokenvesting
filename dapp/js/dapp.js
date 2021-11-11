//var web3 = AlchemyWeb3.createAlchemyWeb3("wss://polygon-mumbai.g.alchemy.com/v2/Ptsa6JdQQUtTbRGM1Elvw_ed3cTszLoj");
var web3 = AlchemyWeb3.createAlchemyWeb3("http://localhost:8545");
var BN = web3.utils.BN;

var showWizard = false;
const factoryAddress = "0xeD8893EaD510F7eBF690B5DCb22b20D6FBE42263";
var vestorAddress = "";
var underlyingAddress = "";
var underlyingSymbol = "";
var underlyingDecimals = 18;
var superAddress = "";
var approved = 0;
const factory = new web3.eth.Contract(factoryABI, factoryAddress);
var vestor;

var recipientAdresses = [];
var flowsByAddress = {};
var flows = [];

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
        //$("body").append(wrongNetworkModal());
        //$(".close, .modal-backdrop").click(function(){
        //    $(".fade.show").remove();
        //});
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
            superAddress = await vestor.methods.acceptedToken().call();
            console.log("superAddress", superAddress);
            const sToken = new web3.eth.Contract(superABI, superAddress);
            vestorBal = await sToken.methods.balanceOf(vestorAddress).call();
            underlyingAddress = await sToken.methods.getUnderlyingToken().call();
            const uToken = new web3.eth.Contract(tokenABI, underlyingAddress);
            symbol = await uToken.methods.symbol().call();
            underlyingDecimals = await uToken.methods.decimals().call();
            dailyFlow = await cfa.methods.getNetFlow(sToken, vestorAddress).call();
            dailyFlow = (parseInt(dailyFlow) * -1 ) / (10**underlyingDecimals) * (60*60*24);
            if ( symbol ) {
                underlyingSymbol = symbol;
            }
            recipientAdresses = await vestor.methods.getAllAddresses().call();
            console.log("allAdresses", JSON.stringify(recipientAdresses));
            $.each(recipientAdresses, async function( i, address ) {
                var flowsForAddress = await vestor.methods.getFlowRecipient(address).call();
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
                console.log("flowsByAddress", flowsByAddress);
                console.log("flows", flows);
                renderTable(flows);
                flowsByDate(flows);
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

        var provider = new ethers.providers.JsonRpcProvider();
        const ethersSTF = new ethers.Contract(addr.SuperTokenFactory, superTokenFactoryABI, provider);
        var filter = await ethersSTF.filters.SuperTokenCreated();
        var events = await ethersSTF.queryFilter(filter, block, 'latest');
        superAddress = events[0].args.token;
        log("super token " + underlyingSymbol + "x created at " + superAddress);
        $tab.hide().next().show();
        $("#setup-wizard span.active").removeClass("active").next().addClass("active");
        return false;
    });

    $("#createVestor").click(async function(){
        var $tab = $(this).parents(".tab");
        status("deploying vesting contract for " + underlyingSymbol + "x...");
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

        var provider = new ethers.providers.JsonRpcProvider();
        const ethersSTF = new ethers.Contract(factoryAddress, factoryABI, provider);
        var filter = await ethersSTF.filters.VestorCreated();
        var events = await ethersSTF.queryFilter(filter, block, 'latest');
        vestorAddress = events[0].args._contract;
        log("Vestor created at " + vestorAddress);
        vestor = new web3.eth.Contract(vestorABI, vestorAddress);
        $tab.next().find("p.lead").text("Deposit " + underlyingSymbol + " into vesting contract");
        $tab.hide().next().show();
        $("#setup-wizard span.active").removeClass("active").next().addClass("active");
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
            var pendingTxHash = txHash;
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
            var pendingTxHash = txHash;
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

    $("#addFlow, #addFlowCard").click(async function(){
        var $tab = $(this).parents(".tab");
        var wizard = false;
        var $button = $(this);
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
        var amount = $("#" + prefix + "FlowAmount").val();
        var seconds = $("#" + prefix + "FlowSeconds").val();
        var flowRate = parseInt( amount / seconds * ( 10**underlyingDecimals) );
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
        status("Vesting flow added for " + flowAddress);
        if (wizard) {
            $("#wizard").hide();
            showWizard = false;
        } else {
            $("#addFlowSection").hide();
        }
        $("#flowsTable").show();
        afterConnection();
        return false;
    });

    $( "#all-flows" ).on( "click", ".launchFlow", async function() {
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
        status("Vesting flow(s) launched for " + recipient);
        afterConnection();
    });

    $( "#all-flows" ).on( "click", ".stopFlow", async function() {
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
        status("Vesting flow stopped");
        afterConnection();
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

function perDay(flowRate) {
    return parseInt(flowRate) / (10**underlyingDecimals) * (60*60*24);
}

function flowsByDate(flows) {
    const days = 90;
    var bal = vestorBal;
    var perDay = dailyFlow;
    var start = moment().startOf('day');
    var balances = [bal];
    var flowRates = [perDay];
    for (let day = 1; day <= days.length; day++) {
        var dayStart = start.unix();
        var end = moment(start).endOf('day');
        var dayEnd = end.unix();
        $.each(flows, function( i, flow ) {
            //check for new flows on this day
            var flowStart = parseInt(flow.cliffEnd);
            var flowEnd = flowStart + parseInt(flow.vestingDuration);
            if ( (flowStart > dayStart) && (flowStart < dayEnd) ) {
                // starting on this day
                perDay += perDay(flow.flowRate);
            }
            //check for ending flows
            if ( (flowEnd > dayStart) && (flowEnd < dayEnd) ) {
                // starting on this day
                perDay -= perDay(flow.flowRate);
            }
        });
        bal -= perDay;
        balances.push(bal);
        flowRates.push(perDay);
        start = start.add(1, 'days');
    }
    console.log(balances);
    console.log(flowRates);
    return "TODO";
}

function renderChat() {
    var options = {
        series: [{
            name: 'series1',
            data: [6, 20, 15, 40, 18, 20, 18, 23, 18, 35, 30, 55, 0]
        }, {
            name: 'series2',
            data: [2, 22, 35, 32, 40, 25, 50, 38, 42, 28, 20, 45, 0]
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
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
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
        yaxis: {
            low: 0,
            offsetX: 0,
            offsetY: 0,
            show: false,
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
        grid: {
            show: false,
            padding: {
                left: 0,
                right: 0,
                bottom: -15,
                top: -40
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
    
    var chart = new ApexCharts(document.querySelector("#TBD"), options);
    chart.render();
}
