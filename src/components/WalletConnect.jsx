import { useState } from "react";
import { ethers } from "ethers";

const WalletConnect = ({ setAccount }) => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Connection error:", error);
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
