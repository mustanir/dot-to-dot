import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/{REPO_NAME}/', // IMPORTANT: Replace {REPO_NAME} with your GitHub repository name
  define: {
    // Vite does not expose process.env to the client by default for security reasons.
    // This shim makes the API key available during the build process.
    // It reads from a VITE_API_KEY variable, which you should set in a .env.local file or a GitHub secret.
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  }
})
