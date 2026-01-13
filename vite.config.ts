// v2.4.9-forced-refresh
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})