import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig, createConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet } from "wagmi/chains";
import { http } from "viem"; // using viem for HTTP transport
import App from "./App";

// Create a Query Client
const queryClient = new QueryClient();

// Configure wagmi
const wagmiConfig = createConfig({
  autoConnect: true,
  chains: [mainnet],
  // Here we assume that 'transports' is the correct key. 
  // If your version of wagmi uses a different configuration object, adjust accordingly.
  transports: {
    [mainnet.id]: http(), 
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={[mainnet]}>
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>
);
