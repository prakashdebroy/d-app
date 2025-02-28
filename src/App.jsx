import { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import SendTransaction from "./components/SendTransaction";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null); // Track connected wallet address

  return (
    <div className="app-container">
      <h1>META-Fi</h1>
      <WalletConnect setAccount={setAccount} /> {/* Wallet connection component */}
      {account && <SendTransaction account={account} />} {/* SendTransaction component */}
    </div>
  );
}

export default App;
