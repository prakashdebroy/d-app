const GaslessTransaction = artifacts.require("GaslessTransaction");

module.exports = async function(deployer) {
  // Deploy the contract
  await deployer.deploy(GaslessTransaction);
  
  // Get the contract instance and log the address
  const contract = await GaslessTransaction.deployed();
  console.log("GaslessTransaction deployed at:", contract.address);
};
