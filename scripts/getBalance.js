const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contractAddress = "0xFe98F69b562Aa214E47a2e45a2F079e58B73b0d6"; // Update with the correct deployed address

async function getBalance() {
    try {
        const balance = await provider.getBalance(contractAddress);
        console.log(`💰 Contract Balance: ${ethers.formatEther(balance)} ETH`);
    } catch (error) {
        console.error("❌ Error fetching balance:", error);
    }
}

getBalance();
