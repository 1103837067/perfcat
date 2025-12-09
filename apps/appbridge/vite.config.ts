import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // 允许从网络访问，Android 设备需要
    port: 5173,
    hmr: {
      // 使用 Tauri CLI 设置的环境变量，或者回退到 localhost
      host: process.env.TAURI_DEV_HOST || "localhost",
      port: 5173,
      protocol: "ws",
    },
  },
})
