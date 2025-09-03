import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This server block configures the Vite development server.
  // The 'proxy' setting is crucial for local development with a separate backend API.
  server: {
    // Proxy API requests to the backend server during development to avoid CORS issues.
    // Any request to a path starting with '/api' will be forwarded to the target.
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Your backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
      },
    },
    port: 5173, // You can specify a port for the dev server
  }
})
