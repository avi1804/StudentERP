import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'recharts', 'lucide-react', 'react-icons'],
          utils: ['axios', 'jwt-decode', 'zod', 'zustand', 'react-hook-form'],
          three: ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})