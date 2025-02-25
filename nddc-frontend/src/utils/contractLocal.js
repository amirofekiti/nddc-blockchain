import { createPublicClient, http, parseEther } from "viem";
import contractABI from "./contractABI.json"; // ✅ Ensure correct path
import { getAccount, getWalletClient } from "@wagmi/core";

// ✅ Replace with local blockchain contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

const localRpcUrl = "http://127.0.0.1:8545";

const publicClient = createPublicClient({
  chain: {
    id: 1337, // Hardhat local network ID
    name: "Local Hardhat",
    rpcUrls: { default: { http: [localRpcUrl] } },
  },
  transport: http(localRpcUrl),
});

// ✅ Improved Wallet Connection Function
async function getConnectedWallet() {
  try {
    let account = getAccount();
    console.log("📌 Checking `getAccount()`: ", account);

    if (!account || !account.address) {
      console.warn("⚠️ No connected wallet found. Trying `getWalletClient()`...");

      const walletClient = await getWalletClient();
      if (!walletClient) {
        alert("❌ No connected wallet! Please connect to MetaMask.");
        throw new Error("❌ No connected wallet! Please connect to MetaMask.");
      }

      const addresses = await walletClient.getAddresses();
      if (!addresses || addresses.length === 0) {
        alert("❌ No connected wallet addresses! Please connect your wallet.");
        throw new Error("❌ No connected wallet addresses! Please connect your wallet.");
      }

      account = { address: addresses[0] };
    }

    console.log("✅ Wallet detected: ", account.address);

    const walletClient = await getWalletClient();
    if (!walletClient) {
      alert("❌ Wallet client is missing! Refresh and reconnect.");
      throw new Error("❌ Wallet client is missing!");
    }

    return { account, walletClient };
  } catch (error) {
    console.error("🚨 Error getting wallet:", error.message || error);
    return null; // Return `null` instead of crashing
  }
}

// ✅ Fetch Projects
export async function fetchProjects() {
  try {
    console.log("📌 Fetching project count from contract...");

    const projectCount = await publicClient.readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "getProjectCount",
    });

    console.log("✅ Total Projects in contract:", Number(projectCount));

    let projects = [];
    for (let i = 0; i < Number(projectCount); i++) {
      console.log(`📌 Fetching project ID ${i}...`);

      const project = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "getProjectDetails",
        args: [i],
      });

      console.log(`✅ Project ${i} details:`, project);

      projects.push({
        title: project[0], // ✅ Project name
        amount: project[1].toString(),
        releasedFunds: project[2].toString(),
        contractor: project[3], // ✅ Correctly displaying contractor
        approved: project[4],
      });
    }

    console.log("📌 Final list of fetched projects:", projects);
    return projects;
  } catch (error) {
    console.error("🚨 Error fetching projects:", error);
    return [];
  }
}

// ✅ Add a New Project
export async function addProject(title, amount) {
  try {
    console.log("🟢 Checking connected wallet...");

    const walletData = await getConnectedWallet();
    if (!walletData) return; // Stop if wallet is not connected

    const { account, walletClient } = walletData;
    console.log("✅ Wallet client fetched:", walletClient);

    const walletClientWithAccount = walletClient.withAccount(account.address);

    console.log(`🚀 Sending transaction to contract at ${contractAddress}`);
    console.log(`📌 Title: "${title}", Amount: ${amount} ETH, Contractor: ${account.address}`);

    const txHash = await walletClientWithAccount.writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "createProject",
      args: [title, parseEther(amount), account.address], // ✅ Contractor now properly passed
      account: account.address,
    });

    console.log("✅ Project added successfully! Transaction hash:", txHash);
    return txHash;
  } catch (error) {
    console.error("🚨 Error in addProject:", error.message || error);
    alert("Transaction failed! Check console logs.");
  }
}

// ✅ Approve a Project
export async function approveProject(projectId) {
  try {
    console.log(`🚀 Approving project ID: ${projectId}...`);

    const walletData = await getConnectedWallet();
    if (!walletData) return; // Stop if wallet is not connected

    const { account, walletClient } = walletData;
    console.log("✅ Wallet client fetched:", walletClient);

    const walletClientWithAccount = walletClient.withAccount(account.address);

    const hash = await walletClientWithAccount.writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "approveProject",
      args: [projectId],
      account: account.address,
    });

    console.log("✅ Project approved! Transaction hash:", hash);
    return hash;
  } catch (error) {
    console.error("🚨 Error approving project:", error);
  }
}

// ✅ Release Funds for a Project
export async function releaseFunds(projectId, amount) {
  try {
    console.log(`🚀 Releasing funds for Project ID ${projectId}, Amount: ${amount} ETH...`);

    const walletData = await getConnectedWallet();
    if (!walletData) return; // Stop if wallet is not connected

    const { account, walletClient } = walletData;
    console.log("✅ Wallet client fetched:", walletClient);

    const walletClientWithAccount = walletClient.withAccount(account.address);

    const hash = await walletClientWithAccount.writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "releaseFunds",
      args: [projectId, parseEther(amount)],
      account: account.address,
    });

    console.log("✅ Funds released successfully! Transaction hash:", hash);
    return hash;
  } catch (error) {
    console.error("🚨 Error releasing funds:", error);
  }
}

// ✅ Export `publicClient`
export { publicClient };
