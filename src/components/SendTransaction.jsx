import { useState } from "react";
import { ethers } from "ethers";

const SendTransaction = ({ account }) => {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");

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
      console.log("Transaction sent:", tx);
      alert(`Transaction sent! Hash: ${tx.hash}`);
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Transaction failed!");
    }
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
      <button onClick={sendTransaction} className="send-button">Send ETH</button>
      {txHash && <p className="tx-hash">Transaction Hash: {txHash}</p>}
    </div>
  );
};

export default SendTransaction;
