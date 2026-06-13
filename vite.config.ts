import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base must match the GitHub Pages repo path, or the built SPA loads its
// assets from the wrong URL and renders a blank page.
// https://vite.dev/config/
export default defineConfig({
  base: '/evidentry-dashboard/',
  plugins: [react(), tailwindcss()],
})
