import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      jsxImportSource: 'react',
      include: '**/*.tsx'
    }),
    cesium()
  ],
  build: {
    assetsInlineLimit: 0
  }
}); 