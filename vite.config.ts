import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ShopSmart/",
  preview: {
    host: true,           // Listen on all addresses
    port: 4173,
    allowedHosts: ['smartshop.rovincy.com', '.rovincy.com', 'localhost', '127.0.0.1']
  },
  build: {
    chunkSizeWarningLimit: 3000,
  },
})
