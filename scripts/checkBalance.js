const hre = require("hardhat");

async function main() {
    const [admin] = await hre.ethers.getSigners(); // Get the first account
    const balance = await hre.ethers.provider.getBalance(admin.address); // Get balance

    console.log(`💰 Your Sepolia ETH Balance: ${hre.ethers.formatEther(balance)} ETH`);

    if (balance < hre.ethers.parseEther("0.1")) {
        console.log("⚠️ Warning: Low balance! Consider getting more Sepolia ETH.");
    } else {
        console.log("✅ Sufficient balance for transactions.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
