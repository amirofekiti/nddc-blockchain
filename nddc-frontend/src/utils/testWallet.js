import { createConfig, getAccount, connect } from "@wagmi/core";
import { InjectedConnector } from "@wagmi/connectors";  // ✅ FIXED Import
import { mainnet } from "@wagmi/core/chains";
import { http } from "viem";

// ✅ Create Wagmi Configuration
const wagmiConfig = createConfig({
  autoConnect: true,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [new InjectedConnector()], // ✅ FIXED Injected Wallet (e.g., MetaMask)
});

async function connectWallet() {
  console.log("🔗 Attempting to connect wallet...");

  try {
    const result = await connect({ connector: new InjectedConnector() });  // ✅ Request wallet connection
    console.log("✅ Wallet connected:", result.accounts[0]);  // Log the wallet address
  } catch (error) {
    console.error("🚨 Error connecting wallet:", error);
  }
}

async function testWalletConnection() {
  console.log("🔍 Checking wallet connection...");

  const account = getAccount();
  if (account?.address) {
    console.log("✅ Wallet is already connected:", account.address);
  } else {
    console.log("❌ No wallet connected. Trying to connect...");
    await connectWallet(); // 🔥 Try connecting if no wallet is found
  }
}

testWalletConnection();
