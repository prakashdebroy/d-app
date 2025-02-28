// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GaslessTransaction {
    mapping(address => uint256) public balances;
    address public relayer;

    event Deposited(address indexed sender, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);

    constructor() {
        relayer = msg.sender; // The deployer is the default relayer
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Not authorized relayer");
        _;
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function executeMetaTransaction(
        address sender,
        address recipient,
        uint256 amount,
        bytes memory signature
    ) public onlyRelayer {
        require(balances[sender] >= amount, "Insufficient balance");

        // Hash the transaction for signature verification
        bytes32 messageHash = keccak256(abi.encodePacked(sender, recipient, amount));
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        address recoveredAddress = recoverSigner(prefixedHash, signature);

        // Verify that the sender authorized the transaction
        require(recoveredAddress == sender, "Invalid signature");

        // Perform the transfer
        balances[sender] -= amount;
        balances[recipient] += amount;

        emit Transferred(sender, recipient, amount);
    }

    function recoverSigner(bytes32 hash, bytes memory signature) public pure returns (address) {
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) v += 27;
        require(v == 27 || v == 28, "Invalid signature version");

        return ecrecover(hash, v, r, s);
    }
}
