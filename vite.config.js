import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is set for GitHub Pages project sites (https://<user>.github.io/<repo>/).
// Override at build time with: VITE_BASE=/my-repo/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/asu-data-center/',
})
