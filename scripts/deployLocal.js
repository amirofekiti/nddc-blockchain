const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying contract to local Hardhat blockchain...");

    // Get contract factory
    const NDDCTransparency = await hre.ethers.getContractFactory("NDDCTransparency");

    // Deploy contract
    const contract = await NDDCTransparency.deploy();
    await contract.waitForDeployment();  // ✅ Fix applied here

    const contractAddress = await contract.getAddress();
    console.log(`✅ Contract deployed at: ${contractAddress}`);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});
