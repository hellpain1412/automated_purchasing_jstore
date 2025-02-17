import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // build: {
  //   rollupOptions: {
  //     external: ["electron", "/home/hellpain/WorkSpace/out-source/automated_purchasing_jstore/index.html"], // Nếu module là Electron hoặc module ngoài
  //   },
  // },
});
