import { useState } from "react";
import { ethers } from "ethers";

const SendTransaction = ({ account }) => {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isHashVisible, setIsHashVisible] = useState(false); // State to control visibility

  const sendTransaction = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    if (!ethers.isAddress(toAddress)) {
      alert("Invalid recipient address!");
      return;
    }

    if (parseFloat(amount) <= 0) {
      alert("Amount must be a positive value!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
      });

      setTxHash(tx.hash);
      setIsHashVisible(false); // Keep the hash hidden initially
      console.log("Transaction sent:", tx);
      alert(`Transaction sent! Hash: ${tx.hash}`);
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Transaction failed!");
    }
  };

  const copyToClipboard = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      alert("Transaction Hash copied to clipboard!");
    }
  };

  const handleShowHash = () => {
    setIsHashVisible(true); // Show the hash when the button is clicked
  };

  return (
    <div className="transaction-container">
      <input
        type="text"
        placeholder="Recipient Address"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="input-field"
      />
      <input
        type="number"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input-field"
        min="0"
      />
      <button onClick={sendTransaction} className="send-button">
        Send ETH
      </button>

      {txHash && !isHashVisible && (
        <button className="copy-button" onClick={handleShowHash}>
          Show Transaction Hash
        </button>
      )}

      {isHashVisible && txHash && (
        <div className="tx-hash-container">
          <p className="tx-hash">{txHash}</p>
          <button className="copy-button" onClick={copyToClipboard}>
            Copy Hash
          </button>
        </div>
      )}
    </div>
  );
};

export default SendTransaction;
