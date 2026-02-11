import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: !isProduction,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@public': path.resolve(__dirname, 'public'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
})
