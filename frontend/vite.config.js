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
        target: "https://infrasee.onrender.com",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false, 
  },
  optimizeDeps: {
    include: [
      "@googlemaps/markerclusterer",
      "@cloudinary/url-gen",
      "react-dropzone",
      'export-to-csv'
    ],
  }  
});
