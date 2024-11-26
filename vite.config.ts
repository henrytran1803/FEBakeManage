import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";

export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0',   // Để chấp nhận tất cả các kết nối
    port: 3000,         // Cổng mà Vite sẽ chạy (bạn có thể thay đổi nếu cần)
    open: true,    
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})