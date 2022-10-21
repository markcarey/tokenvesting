async function main() {
    //const Factory = await ethers.getContractFactory("VestingFactory");
    const Factory = await ethers.getContractFactory("TokenVestor");
    
    // Start deployment, returning a promise that resolves to a contract object
    const contract = await Factory.deploy();
    console.log("Contract deployed to address:", contract.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });

// npx hardhat run scripts/deploy.js --network mumbai
// npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
// npx hardhat node --fork https://polygon-mumbai.g.alchemy.com/v2/zdeZwAwHBiBZzLtxdWtShZzuAjBPjoUW --fork-block-number 21123603
// 24390154