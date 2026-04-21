import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  // Force these packages to be bundled (not externalized)
  ssr: {
    noExternal: ["react-router-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    force: true,
  },
  resolve: {
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
});
