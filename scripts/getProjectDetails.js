const { ethers } = require("ethers");
require("dotenv").config(); // Load environment variables

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Use your deployed contract address
const contractAddress = "0xFe98F69b562Aa214E47a2e45a2F079e58B73b0d6"; 

const contractABI = [
    "function getProjectDetails(uint256) public view returns (string memory, uint256, uint256, address, bool)"
];

async function getProjectDetails(projectId) {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const details = await contract.getProjectDetails(projectId);

        console.log(`📌 Project ID: ${projectId}`);
        console.log(`📌 Name: ${details[0]}`);
        console.log(`📌 Allocated Funds: ${ethers.formatEther(details[1])} ETH`);
        console.log(`📌 Released Funds: ${ethers.formatEther(details[2])} ETH`);
        console.log(`📌 Contractor Address: ${details[3]}`);
        console.log(`📌 Approved: ${details[4]}`);

    } catch (error) {
        console.error("❌ Error fetching project details:", error);
    }
}

// Change project ID as needed
getProjectDetails(0);
