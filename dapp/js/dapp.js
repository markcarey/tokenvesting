//var web3 = AlchemyWeb3.createAlchemyWeb3("wss://polygon-mumbai.g.alchemy.com/v2/Ptsa6JdQQUtTbRGM1Elvw_ed3cTszLoj");
var web3 = AlchemyWeb3.createAlchemyWeb3("http://localhost:8545");
var BN = web3.utils.BN;

var showWizard = false;
const factoryAddress = "0x70210B719b90BcA3D81cb8026BFC8677F65EB1d7";
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
    addr.WETH = "0x3C68CE8504087f89c640D02d133646d98e64ddd9";
    addr.DAI = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F";
    addr.USDC = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";
    addr.ETHx = "0xC64A23013768E0BE8751Fd6a2381624194Edb6A6"; 
    addr.WETHx = addr.ETHx;
}
if (chain == "polygon") {
    //Polygon
    addr.Resolver = "0xE0cc76334405EE8b39213E620587d815967af39C";
    addr.SuperTokenFactory = "0x2C90719f25B10Fc5646c82DA3240C76Fa5BcCF34";
    addr.SuperHost = "0x3E14dC1b13c488a8d5D310918780c983bD5982E7";
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

var gas = web3.utils.toHex(new BN('2000000000')); // 2 Gwei;
var dappChain = 80001; // default to Mumbai
var userChain;
var accounts;
var approved = 0;
var wethBal = 0;
var vestorBal = 0;

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
    //connectWallet();
    if (accounts.length > 0) {
        //$("li.profile-nav").find(".media-body span").text( abbrAddress() );
        //$(".card-buttons button.connect").hide().next().show();
        return afterConnection();
    }

    userChain = await ethereum.request({ method: 'eth_chainId' });
    console.log("The chainId of connected account is " + web3.utils.hexToNumber(userChain));

    if ( !correctChain() ) {
        //$("body").append(wrongNetworkModal());
        //$(".close, .modal-backdrop").click(function(){
        //    $(".fade.show").remove();
        //});
    }

    window.ethereum.on('accountsChanged', function () {
        web3.eth.getAccounts(function (error, accts) {
            console.log(accts[0], 'current account after account change');
            accounts = accts;
            location.reload();
        });
    });

    window.ethereum.on('chainChanged', function () {
      location.reload();
    });

    //updateStats();
    
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
        $("li.profile-nav").find(".media-body span").text( abbrAddress() );
        status("Connected as " + abbrAddress() );
        const vestors = await factory.methods.getVestorsForUser(ethereum.selectedAddress).call();
        console.log("vestors for user", vestors);
        if ( vestors.length > 0 ) {
            vestorAddress = vestors[vestors.length - 1];
            vestor = new web3.eth.Contract(vestorABI, vestorAddress);
            recipientAdresses = await vestor.methods.getAllAddresses().call();
            console.log("allAdresses", JSON.stringify(recipientAdresses));
            $.each(recipientAdresses, async function( i, address ) {
                var flowsForAddress = await vestor.methods.getFlowRecipient(address).call();
                console.log("flowsForAddress", JSON.stringify(flowsForAddress));
                $.each(flowsForAddress, function(j, flow) {
                    console.log("flow", flow);
                    flow = flowToObject(flow);
                    console.log("flow.flowRate", flow.flowRate);
                    flows.push(flow);
                    if ( !(flow.recipient in flowsByAddress) ) {
                        flowsByAddress[flow.recipient] = [];
                    }
                    flowsByAddress[flow.recipient].push(flow);
                });
                console.log("flowsByAddress", flowsByAddress);
                console.log("flows", flows);
                $('#all-flows').DataTable({
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
                                return moment(cliff).format("YYYY-MM-DD");
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
                                    return `<i data-feather="check-cirlce"></i>`;
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
                        }
                    ]
                });
            });
        } else {
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
                if ( resolved == "0x0000000000000000000000000000000000000000" ) {
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
            log("need transaction to create wrapper for " + symbol);
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
        if ( $(this).data("form") == "wizard" ) {
            wizard = true;
        }
        if ( wizard ) {
            amt = $("#wizardAmount").val();
            $amount = $("#wizardAmount");
        } else {
            amt = $("#amount").val();
            $amount = $("#amount");
        }
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
            $tab.hide().next().show();
            $("#setup-wizard span.active").removeClass("active").next().addClass("active");
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

    $("#addFlow").click(async function(){
        var $tab = $(this).parents(".tab");
        var wizard = false;
        var $button = $(this);
        if ( $(this).data("form") == "wizard" ) {
            wizard = true;
        }
        var flowAddress = $("#wizardAddress").val();
        var start = moment( $("#wizardStart").val() );
        var end = moment( $("#wizardEnd").val() );
        var duration = end.unix() - start.unix();;
        console.log("duration", duration);
        var amount = $("#wizardFlowAmount").val();
        var seconds = $("#wizardFlowSeconds").val();
        var flowRate = parseInt( amount / seconds * ( 10**underlyingDecimals) );
        console.log("flowRate", flowRate);
        var permanent = false;
        if ( $("#wizardPermanent:checked").val() ) {
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
