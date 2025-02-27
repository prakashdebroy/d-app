import { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import SendTransaction from "./components/SendTransaction";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);

  return (
    <div className="app-container">
      <h1>Web3 DApp</h1>
      <WalletConnect setAccount={setAccount} />
      {account && <SendTransaction account={account} />}
    </div>
  );
}

export default App;
