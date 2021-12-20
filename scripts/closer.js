require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const vestorJSON = require("../artifacts/contracts/TokenVesting.sol/TokenVestor.json");

const vestorAddress = "0x4d4ECca72249012A1135520a5bD15F1A252cF045";

const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);

let vestor = new ethers.Contract(
  vestorAddress,
  vestorJSON.abi,
  signer
);

async function closer() {
  var ready = false;
  var nextDate;
  var nextAddress;
  var now = Math.floor(Date.now() / 1000);
  nextDate = await vestor.nextCloseDate();
  console.log("nextDate", nextDate);
  if ( nextDate < now ) {
    nextAddress = await vestor.nextCloseAddress();
    console.log("nextAddess", nextAddress);

    // double check
    var flows = await vestor.getFlowRecipient(nextAddress);
    console.log("flows", flows);
    flows.forEach(async function(flow, flowIndex) {
      var start = parseInt(flow.cliffEnd);
      if ( parseInt(flow.starttime) > 0 ) {
        start = parseInt(flow.starttime);
      }
      var endDate = start + parseInt(flow.vestingDuration);
      console.log("endDate", endDate);
      console.log("now", now);
      if ( ( flow.state == 1 ) && ( endDate < now ) ) {
        console.log("ready close vesting for " + nextAddress);
        var result = await vestor.closeVesting([nextAddress]);
        await result.wait(5);
      }
      if (flowIndex === flows.length - 1) {

        // now set next
        nextDate = 2524608000;
        var recipients = await vestor.getAllAddresses();
        console.log("recipients", recipients);
        await recipients.forEach(async function(adr, idx) {
          var flowsForAddress = await vestor.getFlowRecipient(adr);
          console.log("flowsForAddress", flowsForAddress);
          flowsForAddress.forEach(function(flow) {
            var start = parseInt(flow.cliffEnd);
            if ( parseInt(flow.starttime) > 0 ) {
              start = parseInt(flow.starttime);
            }
            var endDate = start + parseInt(flow.vestingDuration);
            console.log("endDate", endDate);
            if (endDate < nextDate) {
              nextDate = endDate;
              nextAddress = flow.recipient;
            }
          });
          if (idx === recipients.length - 1) {
            // last address
            console.log("next next", nextDate, nextAddress);
            await vestor.setNextClose(nextAddress, nextDate);
            console.log( await vestor.nextCloseDate() );
            console.log( await vestor.nextCloseAddress() );
          }
        });

      }
    });

    
    
  } else {
    console.log("nothing to close now");
  }
}

 closer()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });
