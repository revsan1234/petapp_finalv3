
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Cast process to any to avoid TS error: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, (process as any).cwd(), '')
  
  // Try to find the key in various likely places
  // Added 'apikeyfinal' based on user screenshot
  const apiKey = process.env.API_KEY || process.env.VITE_API_KEY || process.env.apikeyfinal || env.API_KEY || env.VITE_API_KEY || env.apikeyfinal || '';

  // Log to build output to help debugging (masked)
  if (apiKey) {
    console.log('✅ API_KEY found in build environment: ' + apiKey.substring(0, 5) + '...');
  } else {
    console.log('⚠️ API_KEY NOT found in build environment. App will not function correctly.');
  }

  return {
    plugins: [react()],
    define: {
      // Stringify ensures it's wrapped in quotes for the browser
      // We expose it as process.env.API_KEY for compatibility with our service code
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})