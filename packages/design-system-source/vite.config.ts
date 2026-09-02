import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Separar librerías grandes en chunks propios (Rolldown/Vite 8:
          // manualChunks como función, ya no acepta objeto literal).
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/@headlessui') || id.includes('node_modules/@heroicons') || id.includes('node_modules/framer-motion')) {
            return 'ui-vendor'
          }
          if (id.includes('node_modules/@tanstack') || id.includes('node_modules/zustand')) {
            return 'data-vendor'
          }
          if (id.includes('node_modules/recharts') || id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs')) {
            return 'chart-vendor'
          }
          if (id.includes('node_modules/axios') || id.includes('node_modules/clsx') || id.includes('node_modules/date-fns') || id.includes('node_modules/zod')) {
            return 'utils-vendor'
          }
          return undefined
        },
        // Mejorar nombres de chunks para debugging
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Aumentar límite a 700KB ya que con lazy loading el chunk inicial será más pequeño
    chunkSizeWarningLimit: 700,
  },
})
