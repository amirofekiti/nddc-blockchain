const { ethers } = require("ethers");
require("dotenv").config();

// Sepolia network provider
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Your contract details
const contractAddress = "0xFe98F69b562Aa214E47a2e45a2F079e58B73b0d6";
const contractABI = [
    "function admin() public view returns (address)"
];

async function getAdmin() {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const adminAddress = await contract.admin();
        console.log(`👑 Admin Address: ${adminAddress}`);
    } catch (error) {
        console.error("❌ Error fetching admin address:", error);
    }
}

getAdmin();
