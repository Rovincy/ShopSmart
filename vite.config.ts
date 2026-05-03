import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/',                    // ← Add or change this to '/'
  
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['smartshop.rovincy.com', '.rovincy.com']
  }
})