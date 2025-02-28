import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      'Widgets/InfoBox/InfoBoxDescription.css',
      'Workers/transferTypedArrayTest.js',
      'Workers/createVerticesFromHeightmap.js'
    ]
  },
  build: {
    chunkSizeWarningLimit: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true
      }
    }
  }
})
