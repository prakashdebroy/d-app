require('dotenv').config();
const Web3 = require('web3');
const { ethers } = require('ethers');
const ContractABI = require('../../build/contracts/GaslessTransaction.json');

// Load environment variables
const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;  // Relayer's private key
const INFURA_URL = process.env.INFURA_SEPOLIA_URL;    // Infura Sepolia endpoint
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Deployed contract address

// Initialize Web3 provider
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Initialize contract
const contract = new web3.eth.Contract(ContractABI.abi, CONTRACT_ADDRESS);

// Function to relay transactions
async function relayTransaction(sender, recipient, amount, signature) {
    try {
        console.log(`Relaying transaction from ${sender} to ${recipient} of ${amount} wei...`);

        // Estimate gas for the meta-transaction
        const gasEstimate = await contract.methods
            .executeMetaTransaction(sender, recipient, amount, signature)
            .estimateGas({ from: account.address });

        // Send the transaction as the relayer
        const tx = await contract.methods.executeMetaTransaction(sender, recipient, amount, signature).send({
            from: account.address,
            gas: gasEstimate
        });

        console.log("Transaction successful:", tx.transactionHash);
    } catch (error) {
        console.error("Error relaying transaction:", error);
    }
}

// Example usage: Call relayTransaction() when a signed transaction is received
module.exports = { relayTransaction };
