import { createPublicClient, http, parseEther } from "viem";
import { sepolia } from "viem/chains";
import contractABI from "./contractABI.json";
import { getAccount, getWalletClient } from "@wagmi/core";

const contractAddress = "0x6B5AE94549fABe3595874d1b10262921011d484B"; // ✅ Ensure contract address is correct
const sepoliaRpcUrl = "https://sepolia.infura.io/v3/6e124f6c5b0d4399a01ada5669a7fc1f"; // ✅ Ensure Infura RPC URL is correct

// ✅ Create Public Client
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(sepoliaRpcUrl),
});

// ✅ Function to Ensure Wallet is Connected
async function getConnectedWallet() {
  let account = getAccount();
  console.log("📌 Checking `getAccount()`: ", account);

  if (!account || !account.address) {
    console.warn("⚠️ No connected wallet found. Trying `getWalletClient()`...");

    const walletClient = await getWalletClient();
    if (!walletClient) {
      throw new Error("❌ No connected wallet! Please connect to MetaMask.");
    }

    const addresses = await walletClient.getAddresses();
    if (!addresses.length) {
      throw new Error("❌ No connected wallet addresses! Please connect your wallet.");
    }

    account = { address: addresses[0] };
  }

  console.log("✅ Wallet detected: ", account.address);

  const walletClient = await getWalletClient();
  if (!walletClient) {
    throw new Error("❌ Wallet client is missing!");
  }

  return { account, walletClient };
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
        title: project[0],
        amount: project[1].toString(),
        releasedFunds: project[2].toString(),
        contractor: project[3],
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

// ✅ Fixed `addProject()`
export async function addProject(title, amount) {
  try {
    console.log("🟢 Checking connected wallet...");

    const { account, walletClient } = await getConnectedWallet();
    console.log("✅ Wallet client fetched:", walletClient);

    // ✅ Ensure walletClient is connected to the correct address
    const walletClientWithAccount = walletClient.withAccount(account.address);

    console.log(`🚀 Sending transaction to contract at ${contractAddress}`);
    console.log(`📌 Title: "${title}", Amount: ${amount} ETH, From: ${account.address}`);

    const txHash = await walletClientWithAccount.writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "createProject",
      args: [title, parseEther(amount), account.address],
      account: account.address,
    });

    console.log("✅ Project added successfully! Transaction hash:", txHash);
    return txHash;
  } catch (error) {
    console.error("🚨 Error in addProject:", error.message || error);
    alert("Transaction failed! Check console logs.");
  }
}

// ✅ Fixed `approveProject()`
export async function approveProject(projectId) {
  try {
    console.log(`🚀 Approving project ID: ${projectId}...`);

    const { account, walletClient } = await getConnectedWallet();
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

// ✅ Fixed `releaseFunds()`
export async function releaseFunds(projectId, amount) {
  try {
    console.log(`🚀 Releasing funds for Project ID ${projectId}, Amount: ${amount} ETH...`);

    const { account, walletClient } = await getConnectedWallet();
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
