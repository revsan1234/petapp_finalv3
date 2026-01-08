
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // API KEY REMOVED FROM BUNDLE. 
    // All requests are now server-side to protect keys and enforce budget/limits.
  },
})
