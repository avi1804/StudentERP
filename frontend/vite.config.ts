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
        manualChunks: (id) => { if (id.includes('node_modules')) { if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor'; if (id.includes('framer-motion') || id.includes('recharts') || id.includes('lucide-react') || id.includes('react-icons')) return 'ui'; if (id.includes('axios') || id.includes('jwt-decode') || id.includes('zod') || id.includes('zustand') || id.includes('react-hook-form')) return 'utils'; if (id.includes('three') || id.includes('@react-three')) return 'three'; } }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})