/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
const { API_URL, RINKEBY_API_URL, POLYGON_API_URL, PRIVATE_KEY, DEPLOYER_PRIV, ETHERSCAN_API_KEY, POLYSCAN_API_KEY } = process.env;
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
   defaultNetwork: "mumbai",
   networks: {
      hardhat: {
        accounts: [{ privateKey: `0x${DEPLOYER_PRIV}`, balance: "10000000000000000000000"}],
        forking: {
          url: POLYGON_API_URL,
          blockNumber: 31471513  // assumes polygon fork
        },
        loggingEnabled: true,
        //gasMultiplier: 5,
        //gasPrice: 1000000000 * 7
      },
      mumbai: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`],
        gasMultiplier: 3,
        gasPrice: 1000000000 * 2
     },
     polygon: {
        url: POLYGON_API_URL,
        accounts: [`0x${PRIVATE_KEY}`]
     },
     rinkeby: {
      url: RINKEBY_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gasMultiplier: 3,
      gasPrice: 1000000000 * 2
    }
   },
   etherscan: {
     apiKey: POLYSCAN_API_KEY
   }
}