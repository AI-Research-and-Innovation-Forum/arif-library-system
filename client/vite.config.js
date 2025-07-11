import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  if (!process.env.VITE_API_BASE_URL) {
    process.env.VITE_API_BASE_URL = "https://arif-library-system.onrender.com";
  }
  return {
    plugins: [react()],
    server: {
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
}) 