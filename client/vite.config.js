import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import dotenv from 'dotenv';
import tailwindcss from '@tailwindcss/vite';

// Load environment variables from .env.development file
dotenv.config({ path: '.env.development' });

export default defineConfig({
  plugins: [react(), tailwindcss()],
  mode: process.env.NODE_ENV,
  optimizeDeps: {
    include: ['lodash', 'axios'],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: process.env.PORT,
  },
  define: {
    _API_URL_: JSON.stringify(process.env.API_URL),
    // _SOCKET_URL_: JSON.stringify(process.env.SOCKET_URL),
    // _SOCKET_PATH_: JSON.stringify(process.env.SOCKET_PATH),
    // _SOCKET_QUERY_PREFIX_: JSON.stringify(process.env.SOCKET_QUERY_PREFIX),
    // _SOCKET_TRANSPORTS_: JSON.stringify(process.env.SOCKET_TRANSPORTS.split(',')),
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: false, // Don't include source maps in production
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      treeshake: true,
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    assetsInlineLimit: 4096,
    analyze: true,
  }
});
