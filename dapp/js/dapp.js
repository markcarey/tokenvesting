//var web3 = AlchemyWeb3.createAlchemyWeb3("wss://polygon-mumbai.g.alchemy.com/v2/Ptsa6JdQQUtTbRGM1Elvw_ed3cTszLoj");
var web3 = AlchemyWeb3.createAlchemyWeb3("http://localhost:8545");
var BN = web3.utils.BN;

const factoryAddress = "0x0Fd7Bcb003C166cb8d09dA5771B9f5a5E7a41A26";
const vestorAddress = "";
const factory = new web3.eth.Contract(factoryABI, factoryAddress);
const wethAddress = "0x3C68CE8504087f89c640D02d133646d98e64ddd9"; // Mumbai
//const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";  // Mainnet (fork)
const WETH = new web3.eth.Contract(tokenABI, wethAddress);

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
        $("li.profile-nav").find("media-body span").text( abbrAddress() );
        //$(".card-buttons button.connect").hide().next().show();
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

async function connectWallet() {
    notify("Connecting...");
    if (window.ethereum) {
        //console.log("window.ethereum true");
        window.ethereum
            .enable()
            .then(async result => {
                // Metamask is ready to go!
                //console.log(result);
                accounts = result;
                $("li.profile-nav").find("media-body span").text( abbrAddress() );
                notify("Connected as " + abbrAddress() );
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
        connectWallet();
        //TODO: next step
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


    $(".deposit").click(async function(){
        var amt = $("#amount").val();
        if ( approved >= amt ) {
            $("button.deposit").text("Waiting...");
            const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');

            //the transaction
            const tx = {
                'from': ethereum.selectedAddress,
                'to': vestorAddress,
                'gasPrice': gas,
                'nonce': "" + nonce,
                'data': vault.methods.deposit(web3.utils.toHex(web3.utils.toWei(amt))).encodeABI()
            };
            //console.log(tx);

            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx],
            });
            //console.log(txHash);
            var pendingTxHash = txHash;
            if (dappChain != 31337) {
                web3.eth.subscribe('newBlockHeaders', async (error, event) => {
                    if (error) {
                        console.log("error", error);
                    }
                    const blockTxHashes = (await web3.eth.getBlock(event.hash)).transactions;

                    if (blockTxHashes.includes(pendingTxHash)) {
                        web3.eth.clearSubscriptions();
                        $("button.deposit").text("Deposited!");
                        $("#amount").val(0.00);
                        updateStats();
                    }
                });
            } else {
                $("button.deposit").text("Deposited!");
                $("#amount").val(0.00);
                updateStats();
            }
        } else {
            // need approval
            $("button.deposit").text("Approving...");
            const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');

            //the transaction
            const tx = {
                'from': ethereum.selectedAddress,
                'to': wethAddress,
                'gasPrice': gas,
                'nonce': "" + nonce,
                'data': WETH.methods.approve(vaultAddress, web3.utils.toHex(web3.utils.toWei(amt))).encodeABI()
            };
            //console.log(tx);

            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx],
            });
            //console.log(txHash);
            var pendingTxHash = txHash;
            if (dappChain != 31337) {
                web3.eth.subscribe('newBlockHeaders', async (error, event) => {
                    if (error) {
                        console.log("error", error);
                    }
                    const blockTxHashes = (await web3.eth.getBlock(event.hash)).transactions;

                    if (blockTxHashes.includes(pendingTxHash)) {
                        web3.eth.clearSubscriptions();
                        //console.log("Bid received!");
                        $("button.deposit").text("Deposit");
                        approved = amt;
                    }
                });
            } else {
                $("button.deposit").text("Deposit");
                approved = amt;
            }
        }
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

function notify(message) {
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
