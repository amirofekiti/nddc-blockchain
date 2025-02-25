const { ethers } = require("ethers");
require("dotenv").config();

// Sepolia network configuration
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract details
const contractAddress = "0xFe98F69b562Aa214E47a2e45a2F079e58B73b0d6"; // Update this!
const contractABI = [
    "function approveProject(uint256 _projectId) public"
];

async function approveProject(projectId) {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        const tx = await contract.approveProject(projectId);
        console.log("⏳ Transaction sent... waiting for confirmation...");
        
        await tx.wait();
        console.log(`✅ Project ${projectId} has been approved!`);
    } catch (error) {
        console.error("❌ Error approving project:", error);
    }
}

// Run the function
const projectId = 0; // Change if you have multiple projects
approveProject(projectId);
