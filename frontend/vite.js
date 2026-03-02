import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      // Professional path aliasing: use '@/' to point to your 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    strictPort: true, // Prevents Vite from skipping to 5174 if 5173 is busy
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Enable if your backend doesn't use the /api prefix
      },
    },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Switching to esbuild for significantly faster build times
    minify: 'esbuild', 
    rollupOptions: {
      output: {
        // Code Splitting: Separates heavy libraries to improve browser caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lucide-icons': ['lucide-react'],
        },
      },
    },
  },
});
