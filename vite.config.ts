import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Cast process to any to avoid TS error: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, (process as any).cwd(), '')
  
  // Priority: Vercel System Env -> .env file -> Empty
  // We check both process.env (Vercel) and env (Vite's loader)
  const apiKey = process.env.API_KEY || env.API_KEY || '';

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
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})