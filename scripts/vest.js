require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const factoryJSON = require("../artifacts/contracts/TokenVesting.sol/VestingFactory.json");
const vestorJSON = require("../artifacts/contracts/TokenVesting.sol/TokenVestor.json");

const factoryAddress = "0x47869752497e9f7A5AE6719111a297fC1D5ce457";
const vestorAddress = "0x23F23daB0Aa8F7aAAA2EaA694509139562024F93";

const resolverAddress = "0x8C54C83FbDe3C59e59dd6E324531FB93d4F504d3";

const resolverABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"get","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"target","type":"address"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}];


var ERC20abi = [
  {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_spender",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_from",
              "type": "address"
          },
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
          {
              "name": "",
              "type": "uint8"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "name": "balance",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
          {
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transfer",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          },
          {
              "name": "_spender",
              "type": "address"
          }
      ],
      "name": "allowance",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "spender",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Approval",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Transfer",
      "type": "event"
  }
];

var WETHabi = [{
  "inputs": [{
    "internalType": "string",
    "name": "name",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "symbol",
    "type": "string"
  }, {
    "internalType": "uint8",
    "name": "decimals",
    "type": "uint8"
  }],
  "stateMutability": "nonpayable",
  "type": "constructor"
  }, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "owner",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
  }, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "from",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
  }, {
  "inputs": [{
    "internalType": "address",
    "name": "owner",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "internalType": "uint8",
    "name": "",
    "type": "uint8"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "subtractedValue",
    "type": "uint256"
  }],
  "name": "decreaseAllowance",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "addedValue",
    "type": "uint256"
  }],
  "name": "increaseAllowance",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "mint",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "name",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
  }, {
  "inputs": [{
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "sender",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}
];

var superABI = [{
  "inputs": [{
    "internalType": "contract ISuperfluid",
    "name": "host",
    "type": "address"
  }],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "state",
    "type": "bytes"
  }],
  "name": "AgreementAccountStateUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "indexed": false,
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "name": "AgreementCreated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "penaltyAccount",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "rewardAccount",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "rewardAmount",
    "type": "uint256"
  }],
  "name": "AgreementLiquidated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "address",
    "name": "liquidatorAccount",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "penaltyAccount",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "bondAccount",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "rewardAmount",
    "type": "uint256"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "bailoutAmount",
    "type": "uint256"
  }],
  "name": "AgreementLiquidatedBy",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "slotId",
    "type": "uint256"
  }],
  "name": "AgreementStateUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }],
  "name": "AgreementTerminated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "indexed": false,
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "name": "AgreementUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "owner",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "tokenHolder",
    "type": "address"
  }],
  "name": "AuthorizedOperator",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "bailoutAccount",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "bailoutAmount",
    "type": "uint256"
  }],
  "name": "Bailout",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "from",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "Burned",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "bytes32",
    "name": "uuid",
    "type": "bytes32"
  }, {
    "indexed": false,
    "internalType": "address",
    "name": "codeAddress",
    "type": "address"
  }],
  "name": "CodeUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "Minted",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "tokenHolder",
    "type": "address"
  }],
  "name": "RevokedOperator",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "from",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "Sent",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "TokenDowngraded",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "TokenUpgraded",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "from",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }],
  "name": "authorizeOperator",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "internalType": "uint256",
    "name": "balance",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }],
  "name": "burn",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "name": "createAgreement",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "internalType": "uint8",
    "name": "",
    "type": "uint8"
  }],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "subtractedValue",
    "type": "uint256"
  }],
  "name": "decreaseAllowance",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "defaultOperators",
  "outputs": [{
    "internalType": "address[]",
    "name": "",
    "type": "address[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "downgrade",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "getAccountActiveAgreements",
  "outputs": [{
    "internalType": "contract ISuperAgreement[]",
    "name": "",
    "type": "address[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "uint256",
    "name": "dataLength",
    "type": "uint256"
  }],
  "name": "getAgreementData",
  "outputs": [{
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "slotId",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "dataLength",
    "type": "uint256"
  }],
  "name": "getAgreementStateSlot",
  "outputs": [{
    "internalType": "bytes32[]",
    "name": "slotData",
    "type": "bytes32[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getCodeAddress",
  "outputs": [{
    "internalType": "address",
    "name": "codeAddress",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getHost",
  "outputs": [{
    "internalType": "address",
    "name": "host",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getUnderlyingToken",
  "outputs": [{
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "granularity",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "addedValue",
    "type": "uint256"
  }],
  "name": "increaseAllowance",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "contract IERC20",
    "name": "underlyingToken",
    "type": "address"
  }, {
    "internalType": "uint8",
    "name": "underlyingDecimals",
    "type": "uint8"
  }, {
    "internalType": "string",
    "name": "n",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "s",
    "type": "string"
  }],
  "name": "initialize",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }],
  "name": "isAccountCritical",
  "outputs": [{
    "internalType": "bool",
    "name": "isCritical",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "isAccountCriticalNow",
  "outputs": [{
    "internalType": "bool",
    "name": "isCritical",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }],
  "name": "isAccountSolvent",
  "outputs": [{
    "internalType": "bool",
    "name": "isSolvent",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "isAccountSolventNow",
  "outputs": [{
    "internalType": "bool",
    "name": "isSolvent",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "tokenHolder",
    "type": "address"
  }],
  "name": "isOperatorFor",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "address",
    "name": "liquidator",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "penaltyAccount",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "rewardAmount",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "bailoutAmount",
    "type": "uint256"
  }],
  "name": "makeLiquidationPayouts",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "name",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "operationApprove",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "operationDowngrade",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "operationTransferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "operationUpgrade",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "operatorBurn",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "sender",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "operatorSend",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "proxiableUUID",
  "outputs": [{
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }],
  "name": "realtimeBalanceOf",
  "outputs": [{
    "internalType": "int256",
    "name": "availableBalance",
    "type": "int256"
  }, {
    "internalType": "uint256",
    "name": "deposit",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "owedDeposit",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "realtimeBalanceOfNow",
  "outputs": [{
    "internalType": "int256",
    "name": "availableBalance",
    "type": "int256"
  }, {
    "internalType": "uint256",
    "name": "deposit",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "owedDeposit",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }],
  "name": "revokeOperator",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "userData",
    "type": "bytes"
  }],
  "name": "selfBurn",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "userData",
    "type": "bytes"
  }],
  "name": "selfMint",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }],
  "name": "send",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "int256",
    "name": "delta",
    "type": "int256"
  }],
  "name": "settleBalance",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "uint256",
    "name": "dataLength",
    "type": "uint256"
  }],
  "name": "terminateAgreement",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }],
  "name": "transferAll",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "holder",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "name": "updateAgreementData",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "slotId",
    "type": "uint256"
  }, {
    "internalType": "bytes32[]",
    "name": "slotData",
    "type": "bytes32[]"
  }],
  "name": "updateAgreementStateSlot",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "newAddress",
    "type": "address"
  }],
  "name": "updateCode",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "upgrade",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }],
  "name": "upgradeTo",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];

var addr = {};
addr.dai = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F"; // Mumbai
addr.WETH = "0x3C68CE8504087f89c640D02d133646d98e64ddd9"; // Mumbai
addr.WETHx = "0xC64A23013768E0BE8751Fd6a2381624194Edb6A6"; // Mumbai

const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);
let factory = new ethers.Contract(
  factoryAddress,
  factoryJSON.abi,
  signer
);
let vestor = new ethers.Contract(
  vestorAddress,
  vestorJSON.abi,
  signer
);
let wethx = new ethers.Contract(
  addr.WETHx,
  superABI,
  signer
);
let resolver = new ethers.Contract(
  resolverAddress,
  resolverABI,
  signer
);

async function main() {
  
  

 

 }

 async function clone() {
  await factory.createVestor(addr.WETHx);
  const clones = await factory.getAllVestors();
  console.log("Vestor deployed to: " + clones[clones.length -1]);
}

async function addFlow() {
  await vestor.registerFlow(PUBLIC_KEY, 3170979198376, false, 1636215467, 60*60*24*365);
  const flows = await vestor.getFlowRecipient(PUBLIC_KEY);
  console.log("Flows are " + JSON.stringify(flows));
}

async function getFlows(address) {
  const flows = await vestor.getFlowRecipient(address);
  console.log("Flows are " + JSON.stringify(flows));
}

async function launchVesting() {
  await vestor.launchVesting([PUBLIC_KEY], { gasLimit: 5000000 });
  const flows = await vestor.getFlowRecipient(PUBLIC_KEY);
  console.log("Flows are " + JSON.stringify(flows));
}

async function getSomeWETH(eoa) {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [eoa],
  });
  const signer = await ethers.getSigner(eoa);
  let contract = new ethers.Contract(
    addr.WETH,
    ERC20abi,
    signer
  );
  var bal = contract.balanceOf(eoa);
  await contract.transfer(PUBLIC_KEY, bal).then((transferResult) => {
    console.log(transferResult);
  });
  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [eoa],
  });
}

async function mintSomeWETH() {
  let contract = new ethers.Contract(
    addr.WETH,
    WETHabi,
    signer
  );
  await contract.mint('1000000000000000000000000');
  await contract.approve(addr.WETHx, '1000000000000000000000000');
  await wethx.upgrade('10000000000000000000000');
}

async function mintSomeDAI() {
  let contract = new ethers.Contract(
    addr.dai,
    WETHabi,
    signer
  );
  await contract.mint('1000000000000000000000000');
  //await contract.approve(addr.WETHx, '1000000000000000000000000');
  //await wethx.upgrade('10000000000000000000000');
}

async function checkBalance() {
  var balance = await wethx.balanceOf(PUBLIC_KEY);
  console.log(balance);
  balance = await wethx.balanceOf(PUBLIC_KEY);
  console.log(balance);
  balance = await wethx.balanceOf(PUBLIC_KEY);
  console.log(balance);
  balance = await wethx.balanceOf(PUBLIC_KEY);
  console.log(balance);
  balance = await wethx.balanceOf(PUBLIC_KEY);
  console.log(balance);
  balance = await wethx.balanceOf(PUBLIC_KEY);
  console.log(balance);
}

async function resolve(symbol) {
  var addr = await resolver.get(symbol);
  console.log("The address is " + addr);
}

async function underlying(addr) {
  var superToken = new ethers.Contract(
    addr,
    superABI,
    signer
  );
  var addr = await superToken.getUnderlyingToken();
  console.log("The address is " + addr);
}



 //clone();
 //addFlow();
 //getFlows(PUBLIC_KEY)
 //mintSomeWETH()
 //mintSomeDAI()
 //launchVesting()
 //checkBalance()
 //resolve("SuperToken")
 //underlying("0x1748479504a92d69dEb5f5ADd61a17b563d82C15")

 getFlows(PUBLIC_KEY)
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });

// npx hardhat run scripts/deploy.js --network mumbai
// npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
// npx hardhat node --fork https://polygon-mumbai.g.alchemy.com/v2/zdeZwAwHBiBZzLtxdWtShZzuAjBPjoUW --fork-block-number 21123603