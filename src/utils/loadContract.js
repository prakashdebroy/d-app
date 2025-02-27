import { ethers } from "ethers";
import contractABI from "../../build/contracts/MyContract.json"; // Update path based on your Truffle build folder

export async function loadContract() {
  if (!window.ethereum) {
    alert("MetaMask is required to use this DApp.");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  // Replace with your deployed contract address
  const contractAddress = "0xe55ae70c5A49f2AeA8d9167c9169F15435B01b97"; 

  const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
  return contract;
}
