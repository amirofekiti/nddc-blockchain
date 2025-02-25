const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = "0xFe98F69b562Aa214E47a2e45a2F079e58B73b0d6"; // Replace with actual address
const contractABI = [
    "function createProject(string memory _name, uint256 _funds, address _contractor) public"
];

async function addProject() {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        const tx = await contract.createProject("Road Construction", ethers.parseEther("1"), wallet.address);
        await tx.wait();

        console.log("✅ Project added successfully!");
    } catch (error) {
        console.error("❌ Error adding project:", error);
    }
}

addProject();
