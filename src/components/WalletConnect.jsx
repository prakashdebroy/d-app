import { useState } from "react";
import { ethers } from "ethers";

const WalletConnect = ({ setAccount }) => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Request network change to Sepolia
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Sepolia Chain ID
        });

        // Request wallet connection
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Connection error:", error);

        // If Sepolia is not added, prompt to add it
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Ethereum Sepolia Testnet",
                  rpcUrls: ["https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
                  nativeCurrency: {
                    name: "SepoliaETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add Sepolia network:", addError);
          }
        }
      }
    } else {
      alert("MetaMask not detected. Please install it!");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet Address Copied!");
  };

  return (
    <div className="wallet-container">
      <button onClick={connectWallet} className="wallet-button">
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}` : "Connect Wallet"}
      </button>
      {walletAddress && (
        <button onClick={copyToClipboard} className="copy-button">📋 Copy</button>
      )}
    </div>
  );
};

export default WalletConnect;
