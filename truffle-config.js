require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY, // Load Private Key from .env
          `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}` // Infura URL for Sepolia
        ),
      network_id: 11155111,   // Sepolia Chain ID
      chainId: 11155111,      // Same as network_id
      gas: 5000000,           // Adjust if needed
      gasPrice: 10000000000,  // Sepolia gas price (adjust if necessary)
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.21", // Ensure it matches your contract version
    },
  },
};
