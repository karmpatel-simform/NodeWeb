import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure this is the correct port for the Vite dev server
    allowedHosts: [
      'frontend',        // Allow requests from 'frontend' hostname
      'localhost',       // Allow localhost for local development
      '127.0.0.1',       // Also allow 127.0.0.1 if needed
      'your-domain.com', // Optionally add your domain if accessing via a domain
    ],
    proxy: {
      // Proxy settings if you need them
      '/api': 'http://localhost:3000',
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',  // Set this to the hostname you are using
      port: 5173,
    },
  },
})
