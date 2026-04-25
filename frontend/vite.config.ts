import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import relay from 'rolldown-plugin-relay'

export default defineConfig({
  plugins: [
    react(),
    relay(),
  ],
  server: {
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
