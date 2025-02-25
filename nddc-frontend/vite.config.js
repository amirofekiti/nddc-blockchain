import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupNodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    rollupNodePolyfills(),
  ],
  resolve: {
    alias: {
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer"],
  },
  define: {
    'process.env': {}, // ✅ Fix for CSP `eval()` issue in dev mode
  },
});
