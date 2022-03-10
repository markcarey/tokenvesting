const factoryABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_contract",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "VestorCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "addUser",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allVestors",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_host",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_cfa",
        "type": "address"
      }
    ],
    "name": "createVestor",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllVestors",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getVestorsForUser",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const vestorABI =  [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "flowIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "permanent",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "enum TokenVestor.FlowState",
        "name": "state",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cliffEnd",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "vestingDuration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "starttime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cliffAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "ref",
        "type": "bytes32"
      }
    ],
    "name": "FlowCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "flowIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "permanent",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "enum TokenVestor.FlowState",
        "name": "state",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cliffEnd",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "vestingDuration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "starttime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cliffAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "ref",
        "type": "bytes32"
      }
    ],
    "name": "FlowStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "flowIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "permanent",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "enum TokenVestor.FlowState",
        "name": "state",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cliffEnd",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "vestingDuration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "starttime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cliffAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "ref",
        "type": "bytes32"
      }
    ],
    "name": "FlowStopped",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "CLOSER",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "GRANTOR",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "LAUNCHER",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MANAGER",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "acceptedToken",
    "outputs": [
      {
        "internalType": "contract ISuperToken",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "adr",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "flowIndex",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "ref",
        "type": "bytes32"
      }
    ],
    "name": "addRef",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cfaV1",
    "outputs": [
      {
        "internalType": "contract ISuperfluid",
        "name": "host",
        "type": "address"
      },
      {
        "internalType": "contract IConstantFlowAgreementV1",
        "name": "cfa",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "closeReady",
    "outputs": [
      {
        "internalType": "bool",
        "name": "canExec",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "execPayload",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "flowIndex",
        "type": "uint256"
      }
    ],
    "name": "closeStream",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "targetAddresses",
        "type": "address[]"
      }
    ],
    "name": "closeVesting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "closeVestingForAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "flowIndex",
        "type": "uint256"
      }
    ],
    "name": "elapsedTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "flowTokenBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllAddresses",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "name": "getAllAddressesPaginated",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "recipients",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "adr",
        "type": "address"
      }
    ],
    "name": "getFlowCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "adr",
        "type": "address"
      }
    ],
    "name": "getFlowRecipient",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "int96",
            "name": "flowRate",
            "type": "int96"
          },
          {
            "internalType": "bool",
            "name": "permanent",
            "type": "bool"
          },
          {
            "internalType": "enum TokenVestor.FlowState",
            "name": "state",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "cliffEnd",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "vestingDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "starttime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cliffAmount",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "ref",
            "type": "bytes32"
          }
        ],
        "internalType": "struct TokenVestor.Flow[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "adr",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "name": "getFlowRecipientPaginated",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "int96",
            "name": "flowRate",
            "type": "int96"
          },
          {
            "internalType": "bool",
            "name": "permanent",
            "type": "bool"
          },
          {
            "internalType": "enum TokenVestor.FlowState",
            "name": "state",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "cliffEnd",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "vestingDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "starttime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cliffAmount",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "ref",
            "type": "bytes32"
          }
        ],
        "internalType": "struct TokenVestor.Flow[]",
        "name": "flows",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNetFlow",
    "outputs": [
      {
        "internalType": "int96",
        "name": "",
        "type": "int96"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getRoleMember",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleMemberCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_acceptedToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "host",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "cfa",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "launchReady",
    "outputs": [
      {
        "internalType": "bool",
        "name": "canExec",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "execPayload",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "targetAddresses",
        "type": "address[]"
      }
    ],
    "name": "launchVesting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "launchVestingForAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "launchVestingToSender",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextCloseAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextCloseDate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "oldRecipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "newRecipient",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "ref",
        "type": "bytes32"
      }
    ],
    "name": "redirectStreams",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "adr",
        "type": "address[]"
      },
      {
        "internalType": "int96[]",
        "name": "flowRate",
        "type": "int96[]"
      },
      {
        "internalType": "uint256[]",
        "name": "cliffEnd",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "vestingDuration",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "cliffAmount",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes32[]",
        "name": "ref",
        "type": "bytes32[]"
      }
    ],
    "name": "registerBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "adr",
        "type": "address[]"
      },
      {
        "internalType": "int96[]",
        "name": "flowRate",
        "type": "int96[]"
      },
      {
        "internalType": "uint256[]",
        "name": "cliffEnd",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "vestingDuration",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "cliffAmount",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes32[]",
        "name": "ref",
        "type": "bytes32[]"
      }
    ],
    "name": "registerBatchPermanent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "adr",
        "type": "address"
      },
      {
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "internalType": "bool",
        "name": "isPermanent",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "cliffEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "vestingDuration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "cliffAmount",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "ref",
        "type": "bytes32"
      }
    ],
    "name": "registerFlow",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "int96",
            "name": "flowRate",
            "type": "int96"
          },
          {
            "internalType": "bool",
            "name": "permanent",
            "type": "bool"
          },
          {
            "internalType": "enum TokenVestor.FlowState",
            "name": "state",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "cliffEnd",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "vestingDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "starttime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cliffAmount",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "ref",
            "type": "bytes32"
          }
        ],
        "internalType": "struct TokenVestor.Flow",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_addr",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_closeDate",
        "type": "uint256"
      }
    ],
    "name": "setNextClose",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "upgrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const superABI = [
    {
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
}
];

const resolverABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"get","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"target","type":"address"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const superTokenFactoryABI = [{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract SuperTokenFactoryHelper","name":"helper","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"uuid","type":"bytes32"},{"indexed":false,"internalType":"address","name":"codeAddress","type":"address"}],"name":"CodeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperToken","name":"token","type":"address"}],"name":"CustomSuperTokenCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperToken","name":"token","type":"address"}],"name":"SuperTokenCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperToken","name":"tokenLogic","type":"address"}],"name":"SuperTokenLogicCreated","type":"event"},{"inputs":[{"internalType":"contract ERC20WithTokenInfo","name":"underlyingToken","type":"address"},{"internalType":"enum ISuperTokenFactory.Upgradability","name":"upgradability","type":"uint8"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"name":"createERC20Wrapper","outputs":[{"internalType":"contract ISuperToken","name":"superToken","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"underlyingToken","type":"address"},{"internalType":"uint8","name":"underlyingDecimals","type":"uint8"},{"internalType":"enum ISuperTokenFactory.Upgradability","name":"upgradability","type":"uint8"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"name":"createERC20Wrapper","outputs":[{"internalType":"contract ISuperToken","name":"superToken","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"}],"name":"createSuperTokenLogic","outputs":[{"internalType":"address","name":"logic","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCodeAddress","outputs":[{"internalType":"address","name":"codeAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getHost","outputs":[{"internalType":"address","name":"host","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSuperTokenLogic","outputs":[{"internalType":"contract ISuperToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"customSuperTokenProxy","type":"address"}],"name":"initializeCustomSuperToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"updateCode","outputs":[],"stateMutability":"nonpayable","type":"function"}];

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



const tokenABI = [
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