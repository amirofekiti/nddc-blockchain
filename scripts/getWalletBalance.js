const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// 🔹 Replace with your contractor's wallet address
const contractorAddress = "0xFe98F69b562Aa214E47a2e45a2F079e58B73b0d6"; 

async function getWalletBalance() {
    try {
        const balance = await provider.getBalance(contractorAddress);
        console.log(`💰 Contractor Wallet Balance: ${ethers.formatEther(balance)} ETH`);
    } catch (error) {
        console.error("❌ Error fetching wallet balance:", error);
    }
}

getWalletBalance();
