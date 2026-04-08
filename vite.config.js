import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Increase chunk size warning limit for Three.js bundles
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 3000,
    open: true,
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
})
