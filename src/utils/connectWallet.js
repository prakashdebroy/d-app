import { ethers } from "ethers";

export async function connectWallet() {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      return account;
    } catch (error) {
      console.error("Wallet connection failed:", error);
      return null;
    }
  } else {
    alert("Please install MetaMask to use this DApp!");
    return null;
  }
}
