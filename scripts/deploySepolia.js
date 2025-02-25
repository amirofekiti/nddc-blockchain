const hre = require("hardhat");

async function main() {
    console.log("🔹 Deploying contract to Sepolia...");

    // Get contract factory
    const NDDCTransparency = await hre.ethers.getContractFactory("NDDCTransparency");

    // Deploy contract
    const contract = await NDDCTransparency.deploy();
    await contract.waitForDeployment();  // ✅ Fix applied here

    console.log(`✅ Contract deployed at: ${await contract.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
