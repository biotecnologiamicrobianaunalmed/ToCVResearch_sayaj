import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sitio publicado en GitHub Pages bajo /ToCVResearch_sayaj/
export default defineConfig({
  plugins: [react()],
  base: '/ToCVResearch_sayaj/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/sigma') || id.includes('node_modules/graphology') || id.includes('node_modules/@sigma')) return 'sigma';
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) return 'leaflet';
          if (id.includes('node_modules/react')) return 'react';
          return undefined;
        },
      },
    },
  },
});
