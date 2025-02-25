const { ethers } = require("ethers");
require("dotenv").config();

// Sepolia network configuration
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract details
const contractAddress = "0xFe98F69b562Aa214E47a2e45a2F079e58B73b0d6"; // Update this!
const contractABI = [
    "function releaseFunds(uint256 _projectId, uint256 _amount) public"
];

async function releaseFunds(projectId, amountInEth) {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        const amountInWei = ethers.parseEther(amountInEth.toString());

        const tx = await contract.releaseFunds(projectId, amountInWei);
        console.log("⏳ Transaction sent... waiting for confirmation...");

        await tx.wait();
        console.log(`✅ Released ${amountInEth} ETH for project ID ${projectId}!`);
    } catch (error) {
        console.error("❌ Error releasing funds:", error);
    }
}

// Run the function
const projectId = 0;  // Change if you have multiple projects
const amountToRelease = 0.5;  // Amount in ETH
releaseFunds(projectId, amountToRelease);
