require('dotenv').config();
var crypto = require('crypto');
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const factoryJSON = require("../artifacts/contracts/VestingFactory.sol/VestingFactory.json");
const vestorJSON = require("../artifacts/contracts/TokenVestor.sol/TokenVestor.json");
const { setUncaughtExceptionCaptureCallback } = require('process');

const factoryAddress = "0xFF1eEde73A7E094F98572Ca9e48593c7238c2F65";
const vestorAddress = "0xF7dD255aeDb67965320F332316a7f62A53D6dbD0"; // loclahost:polygon

const resolverAddress = "0x8C54C83FbDe3C59e59dd6E324531FB93d4F504d3";

const cfaAddress = "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873"; // mumbai

const MANAGER = web3.utils.keccak256("MANAGER_ROLE");
const GRANTOR = web3.utils.keccak256("GRANTOR_ROLE");
const CLOSER = web3.utils.keccak256("CLOSER_ROLE");

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

const cfaABI = [{
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
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "indexed": true,
      "internalType": "address",
      "name": "sender",
      "type": "address"
  }, {
      "indexed": true,
      "internalType": "address",
      "name": "receiver",
      "type": "address"
  }, {
      "indexed": false,
      "internalType": "int96",
      "name": "flowRate",
      "type": "int96"
  }, {
      "indexed": false,
      "internalType": "int256",
      "name": "totalSenderFlowRate",
      "type": "int256"
  }, {
      "indexed": false,
      "internalType": "int256",
      "name": "totalReceiverFlowRate",
      "type": "int256"
  }, {
      "indexed": false,
      "internalType": "bytes",
      "name": "userData",
      "type": "bytes"
  }],
  "name": "FlowUpdated",
  "type": "event"
}, {
  "inputs": [],
  "name": "agreementType",
  "outputs": [{
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
  }],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [{
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "address",
      "name": "receiver",
      "type": "address"
  }, {
      "internalType": "int96",
      "name": "flowRate",
      "type": "int96"
  }, {
      "internalType": "bytes",
      "name": "ctx",
      "type": "bytes"
  }],
  "name": "createFlow",
  "outputs": [{
      "internalType": "bytes",
      "name": "newCtx",
      "type": "bytes"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "address",
      "name": "sender",
      "type": "address"
  }, {
      "internalType": "address",
      "name": "receiver",
      "type": "address"
  }, {
      "internalType": "bytes",
      "name": "ctx",
      "type": "bytes"
  }],
  "name": "deleteFlow",
  "outputs": [{
      "internalType": "bytes",
      "name": "newCtx",
      "type": "bytes"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "address",
      "name": "account",
      "type": "address"
  }],
  "name": "getAccountFlowInfo",
  "outputs": [{
      "internalType": "uint256",
      "name": "timestamp",
      "type": "uint256"
  }, {
      "internalType": "int96",
      "name": "flowRate",
      "type": "int96"
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
  "inputs": [{
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "int96",
      "name": "flowRate",
      "type": "int96"
  }],
  "name": "getDepositRequiredForFlowRate",
  "outputs": [{
      "internalType": "uint256",
      "name": "deposit",
      "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "address",
      "name": "sender",
      "type": "address"
  }, {
      "internalType": "address",
      "name": "receiver",
      "type": "address"
  }],
  "name": "getFlow",
  "outputs": [{
      "internalType": "uint256",
      "name": "timestamp",
      "type": "uint256"
  }, {
      "internalType": "int96",
      "name": "flowRate",
      "type": "int96"
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
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "bytes32",
      "name": "flowId",
      "type": "bytes32"
  }],
  "name": "getFlowByID",
  "outputs": [{
      "internalType": "uint256",
      "name": "timestamp",
      "type": "uint256"
  }, {
      "internalType": "int96",
      "name": "flowRate",
      "type": "int96"
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
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "uint256",
      "name": "deposit",
      "type": "uint256"
  }],
  "name": "getMaximumFlowRateFromDeposit",
  "outputs": [{
      "internalType": "int96",
      "name": "flowRate",
      "type": "int96"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "address",
      "name": "account",
      "type": "address"
  }],
  "name": "getNetFlow",
  "outputs": [{
      "internalType": "int96",
      "name": "flowRate",
      "type": "int96"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "initialize",
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
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "address",
      "name": "account",
      "type": "address"
  }, {
      "internalType": "uint256",
      "name": "time",
      "type": "uint256"
  }],
  "name": "realtimeBalanceOf",
  "outputs": [{
      "internalType": "int256",
      "name": "dynamicBalance",
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
      "name": "newAddress",
      "type": "address"
  }],
  "name": "updateCode",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
      "internalType": "contract ISuperfluidToken",
      "name": "token",
      "type": "address"
  }, {
      "internalType": "address",
      "name": "receiver",
      "type": "address"
  }, {
      "internalType": "int96",
      "name": "flowRate",
      "type": "int96"
  }, {
      "internalType": "bytes",
      "name": "ctx",
      "type": "bytes"
  }],
  "name": "updateFlow",
  "outputs": [{
      "internalType": "bytes",
      "name": "newCtx",
      "type": "bytes"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}];


var addr = {};
var chain = "polygon";
if (chain == "mumbai") {
  //Mumbai:
  addr.router = "";
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
  addr.cfa = "0x6EeE6060f715257b970700bc2656De21dEdF074C";
  addr.WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
  addr.DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
  addr.USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  addr.ETHx = "0x27e1e4E6BC79D93032abef01025811B7E4727e85";
  addr.WETHx = addr.ETHx;
  addr.USDCx = "0xCAa7349CEA390F89641fe306D93591f87595dc1F";
  addr.WBTC = "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6";
  addr.WBTCx = "0x4086eBf75233e8492F1BCDa41C7f2A8288c2fB92";
  addr.DAIx = "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2";
  addr.idleWETH = "0xfdA25D931258Df948ffecb66b5518299Df6527C4";
  addr.idleWETHYield = addr.idleWETH;
  addr.idleWETHx = "0xEB5748f9798B11aF79F892F344F585E3a88aA784";
  addr.idleWETHYieldx = addr.idleWETHx;
  addr.IDLE = "0xC25351811983818c9Fe6D8c580531819c8ADe90f";
}
if (chain == "kovan") {
  //Kovan
  addr.router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  addr.Resolver = "0x851d3dd9dc97c1df1DA73467449B3893fc76D85B";
  addr.SuperTokenFactory = "0xF5F666AC8F581bAef8dC36C7C8828303Bd4F8561";
  addr.SuperHost = "0xF0d7d1D47109bA426B9D8A3Cde1941327af1eea3";
  addr.cfa = "0xECa8056809e7e8db04A8fF6e4E82cD889a46FE2F";
  addr.WETH = "";
  addr.DAI = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
  addr.USDC = "";
  addr.ETHx = "";
  addr.WETHx = addr.ETHx;
  addr.USDCx = "";
  addr.WBTC = "";
  addr.WBTCx = "";
  addr.DAIx = "0x900B1D89FeC799D4D47b5dB345d6a460eb2530E8";
}
if ( chain == "rinkeby" ) {
  addr.router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  addr.Resolver = "0x659635Fab0A0cef1293f7eb3c7934542B6A6B31A";
  addr.SuperTokenFactory = "0xd465e36e607d493cd4CC1e83bea275712BECd5E0";
  addr.SuperHost = "0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6";
  addr.cfa = "0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A";
  addr.WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  addr.DAI = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
  addr.USDC = "";
  addr.ETHx = "0xa623b2DD931C5162b7a0B25852f4024Db48bb1A0";
  addr.WETHx = addr.ETHx; // "0x3FbcaeaA76d6f7Fe31DaEa1655b97F1436c0a747";
  addr.USDCx = "";
  addr.WBTC = "";
  addr.WBTCx = "";
  addr.DAIx = "";
  addr.fDAI = "0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7";
  addr.fDAIx = "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90";
}

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
  //await vestor.registerFlow(PUBLIC_KEY, 3170979198376, false, 1636215467, 60*60*24*365);
  await vestor.registerFlow(PUBLIC_KEY, 3170979198376, false, 1640112967, 60*10, 1);
  const flows = await vestor.getFlowRecipient(PUBLIC_KEY);
  console.log("Flows are " + JSON.stringify(flows));
}

function randomAddress() {
  var id = crypto.randomBytes(32).toString('hex');
  var privateKey = "0x"+id;
  var wallet = new ethers.Wallet(privateKey);
  return wallet.address;
}

async function addBatch() {
  //await vestor.registerFlow(PUBLIC_KEY, 3170979198376, false, 1636215467, 60*60*24*365);
  var addr = [];
  var fr = [];
  var perm = [];
  var cliff = [];
  var dur = [];
  var lump = [];
  var ref = [];
  var start = 1640624994;
  for (let i = 0; i < 10; i++) {
    start += 0;
    //addr[i] = randomAddress();
    addr[i] = PUBLIC_KEY;
    fr[i] = 123456;
    perm[i] = false;
    cliff[i] = start;
    dur[i] = 60*10;
    lump[i] = 1;
    ref[i] = ethers.utils.id(PUBLIC_KEY + "salt4");
  }
  await vestor.registerBatch(addr, fr, cliff, dur, lump, ref); // assumes permanent == false
  const flows = await vestor.getFlowRecipient(PUBLIC_KEY);
  console.log("Flows are " + JSON.stringify(flows));
}

async function redirect() {
  //const ref = ethers.utils.id(PUBLIC_KEY + "salt4");
  //await vestor.redirectStreams(PUBLIC_KEY, "0xFa083DfD09F3a7380f6dF6E25dd277E2780de41D", ref);
  var ref = ethers.utils.id("0x22d4B66bEBd2059756D107CaB261d84836D9B3BC" + 4);
  ref = "0x79bc23a83ad8ce0dff0b1f046dbc6b51341a6b780772d872f128f7a3a0bf4955";
  await vestor.redirectStreams("0xfa083dfd09f3a7380f6df6e25dd277e2780de41d", "0xcb49713a2f0f509f559f3552692642c282db397f", ref);
  console.log("redirected");
}


async function grantRole(role, addr) {
  await vestor.grantRole(role, addr);
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

async function claim() {
  await vestor.launchVestingForSender();
}

async function launchVestingForAddress(addr) {
  return await (await vestor.launchVestingForAddress(addr, { gasLimit: 5000000 })).wait();
}

async function flowTokenBalance() {
  const bal = await vestor.flowTokenBalance();
  console.log("balance is " + JSON.stringify(bal));
}

async function launchReady(addr) {
  const ready = await vestor.launchReady(addr);
  console.log("ready is " + JSON.stringify(ready));
}

async function estimateTotalTokens(addr) {
  const totals = await vestor.estimateTotalTokens(addr);
  console.log(totals);
}

async function estimateRemainingTokens(addr) {
  const totals = await vestor.estimateRemainingTokens(addr);
  console.log(totals);
}

async function getNetFlow() {
  const totals = await vestor.getNetFlow();
  console.log(totals);
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

async function vestorFlow(){
  const sToken = await vestor.acceptedToken();
  var cfa = new ethers.Contract(
    addr.cfa,
    cfaABI,
    signer
  );
  var flow = await cfa.getNetFlow(sToken, vestorAddress);
  console.log("Total flow from vestor is " + flow);
}

async function getFlow(){
  const sToken = await vestor.acceptedToken();
  var cfa = new ethers.Contract(
    addr.cfa,
    cfaABI,
    signer
  );
  var flow = await cfa.getFlow(sToken, vestorAddress, "0xFa083DfD09F3a7380f6dF6E25dd277E2780de41D");
  console.log("Total flow from vestor to 0xFa083DfD09F3a7380f6dF6E25dd277E2780de41D is " + flow);
}

async function transaction(hash) {
  var txn = await hre.network.provider.request({
    method: "eth_getTransactionByHash",
    params: [hash],
  });
  console.log(txn);
  var block = await hre.network.provider.request({
    method: "eth_getBlockByNumber",
    params: [txn.blockNumber, true],
  });
  console.log(block);
}

async function setTimestamp(seconds) {
  var txn = await hre.network.provider.request({
    method: "evm_setNextBlockTimestamp",
    params: [seconds],
  });
}

async function getSome(token, eoa) {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [eoa],
  });
  const signer = await ethers.getSigner(eoa);
  let contract = new ethers.Contract(
    token,
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

async function upgrade() {
  let superToken = new ethers.Contract(
    addr.fDAIx,
    superABI,
    signer
  );
  let underlying = new ethers.Contract(
    addr.fDAI,
    ERC20abi,
    signer
  );
  await underlying.approve(addr.fDAIx, '1000000000000000000000000');
  await superToken.upgrade('10000000000000000000000');
}

async function withdrawAll() {
  let superToken = new ethers.Contract(
    addr.idleWETHx,
    superABI,
    signer
  );
  var bal = await superToken.balanceOf(vestorAddress);
  console.log("bal", bal);
  var tx = await vestor.withdraw(addr.idleWETHx, bal);
  await tx.wait();
  bal = await superToken.balanceOf(vestorAddress);
  console.log("bal", bal);
}

async function setNonce(nonce) {
  await hre.network.provider.send("hardhat_setNonce", [
    PUBLIC_KEY,
    ethers.utils.hexlify(nonce)
  ]);
}

async function balanceOf(token, addr) {
  let contract = new ethers.Contract(
    token,
    ERC20abi,
    signer
  );
  var bal = await contract.balanceOf(addr);
  console.log("Bal: " + bal);
}

 //setNonce(56)
 //clone();
 //addFlow()
 //addBatch()
 //redirect()
 //withdrawAll()
 //addBatchCall()
 //getFlows(PUBLIC_KEY)
 //mintSomeWETH()
 //mintSomeDAI()
 //launchVesting()
 //checkBalance()
 //resolve("SuperToken")
 //underlying("0x1748479504a92d69dEb5f5ADd61a17b563d82C15")
 //transaction("0xecfb9380ff01f84dd35c6975ceff0b1b02cbb36afd35fbae9595f9b1ad291ab4")
 //getBlock("0x1427066")
 //setTimestamp(1641308985)
 //flowTokenBalance()
 //vestorFlow()
 //getFlow()
 //grantRole(MANAGER, "0x16C63df4C1915C0c4Da929fcA9fB7D83CAAE9A67")
 //estimateTotalTokens("0x09A900eB2ff6e9AcA12d4d1a396DdC9bE0307661")
 //estimateRemainingTokens("0x09A900eB2ff6e9AcA12d4d1a396DdC9bE0307661")
 //getSome(addr.fDAI, "0xae1c976a25c6d0dccb5f1a7a9cdf81e518b27942")
 //getSome(addr.fDAIx, "0xac7605770e89ef96f68a081815b2fb8d59532896")
//getSome(addr.WETH, "0x5c5a4ae893c4232a050b01a84e193e107dd80ca2")
 //upgrade()
 //getNetFlow()
 //balanceOf(addr.IDLE, "0x1e646cc354B3e94080892307b516dBfF09F4f39A")
 // 
 //balanceOf(addr.WETH, "0xe124a44E9C13F07be177f78ACb5180C005E5FD2F")
 //balanceOf("0x61ADDCd8F9CCf5a978CF09c76E77073Ae37F9563", "0xFa083DfD09F3a7380f6dF6E25dd277E2780de41D")
 //balanceOf(addr.idleWETH, "0x369e06C46790d7174Bd96Da75Db5c2977647Ce11")
 //mintSomeWETH()
 //launchReady("0xFa083DfD09F3a7380f6dF6E25dd277E2780de41D")
 //launchReady("0x2C61B8e23c2128a05C6EA2D1Ac0622531b1afcF7")
 launchVestingForAddress("0x2C61B8e23c2128a05C6EA2D1Ac0622531b1afcF7")
 //claim()
 

   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });

// npx hardhat run scripts/deploy.js --network mumbai
// npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
// npx hardhat node --fork https://polygon-mumbai.g.alchemy.com/v2/zdeZwAwHBiBZzLtxdWtShZzuAjBPjoUW --fork-block-number 21123603