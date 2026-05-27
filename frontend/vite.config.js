import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      // Professional path aliasing: '@' points to the 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    strictPort: true, 
    proxy: {
      // Forwarding /api requests to the Flask backend
      '/api': {
        target: 'http://127.0.0.1:5000', // Use 127.0.0.1 for more reliable local resolution
        changeOrigin: true,
        secure: false,
        // Increased timeout to infinite 
        // This accounts for the high CPU overhead during NNPACK fallback processing
        timeout: 0, 
        proxyTimeout: 0,
      },
    },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', 
    // Ensuring larger assets (like audio processing chunks) don't trigger warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', 'axios'],
        },
      },
    },
  },
});
