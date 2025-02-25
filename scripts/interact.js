const { ethers } = require("ethers");

// Sepolia RPC URL
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/6e124f6c5b0d4399a01ada5669a7fc1f");

// Replace with the actual contract address after deployment
const contractAddress = "0xFe98F69b562Aa214E47a2e45a2F079e58B73b0d6";  // Ensure this matches the deployed contract address

const contractABI = [
    "function getProjectCount() public view returns (uint256)",
    "function createProject(string memory _name, uint256 _funds, address _contractor) public",
    "function getProjectDetails(uint256 _projectId) public view returns (string memory, uint256, uint256, address, bool)"
];

// Function to get the project count
async function getProjectCount() {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const count = await contract.getProjectCount();
        console.log("Project Count:", count.toString());
    } catch (error) {
        console.error("Error calling getProjectCount:", error);
    }
}

// Function to create a new project (requires a signer/wallet)
async function createNewProject() {
    try {
        const signer = provider.getSigner();  // Get the signer (your wallet)
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Ensure this address is valid and replace it with the actual contractor address
        const contractorAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with actual contractor address

        const tx = await contract.createProject("New Project", ethers.utils.parseEther("10"), contractorAddress);
        await tx.wait();  // Wait for the transaction to be mined
        console.log("Project created successfully.");
    } catch (error) {
        console.error("Error creating project:", error);
    }
}

// Main function to execute actions
async function main() {
    await getProjectCount();  // Get the project count
    // Uncomment below to create a new project
    // await createNewProject();  
}

// Call the main function
main();
