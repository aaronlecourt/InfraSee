import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@vis.gl/react-google-maps": path.resolve(__dirname, "node_modules/@vis.gl/react-google-maps"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable source maps in production
    rollupOptions: {
      external: ["@vis.gl/react-google-maps"],  // Externalize this library
    },
  },
});
