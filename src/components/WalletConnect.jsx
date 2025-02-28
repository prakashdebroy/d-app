import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const WalletConnect = ({ setAccount }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0.00");
  const [loading, setLoading] = useState(false); // Loading state for balance fetching
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      // Listen for account change
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          setWalletAddress("");
          setAccount("");
          setBalance("0.00");
          toast.warn("Wallet disconnected!");
        } else {
          setWalletAddress(accounts[0]);
          setAccount(accounts[0]);
          fetchBalance(accounts[0], newProvider);
        }
      });

      // Listen for network change
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected. Please install it!");
      return;
    }

    try {
      // Request network change to Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });

      // Request wallet connection
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      setAccount(accounts[0]);

      fetchBalance(accounts[0], provider);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Connection error:", error);

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
          toast.info("Sepolia network added. Please reconnect your wallet.");
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError);
          toast.error("Failed to add Sepolia network.");
        }
      } else {
        toast.error("Failed to connect wallet.");
      }
    }
  };

  const fetchBalance = async (account, provider) => {
    if (!account) return;
    setLoading(true);
    try {
      const balanceWei = await provider.getBalance(account);
      setBalance(parseFloat(ethers.formatEther(balanceWei)).toFixed(4)); 
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to fetch balance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (walletAddress && provider) {
      fetchBalance(walletAddress, provider);
      interval = setInterval(() => fetchBalance(walletAddress, provider), 5000);
    }
    return () => clearInterval(interval);
  }, [walletAddress, provider]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet Address Copied!");
  };

  // Listen for network change prompt
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (chainId) => {
        if (chainId !== "0xaa36a7") {
          toast.warn("You are not connected to Sepolia network. Please switch.");
        }
      });
    }
  }, []);

  return (
    <div className="wallet-container">
      <button onClick={connectWallet} className="wallet-button">
        {walletAddress
          ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`
          : "Connect Wallet"}
      </button>

      {walletAddress && (
        <>
          <p className="balance-text">
            {loading ? "Loading balance..." : `Balance: ${balance} ETH`}
          </p>
          <button onClick={copyToClipboard} className="copy-button">📋 Copy</button>
        </>
      )}
    </div>
  );
};

export default WalletConnect;
