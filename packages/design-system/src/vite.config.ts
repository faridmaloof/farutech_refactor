import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.lib.json',
      outDir: './dist',
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', 'docs/**'],
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'index.ts'),
        'components/ui': path.resolve(__dirname, 'components/ui/index.ts'),
        'components/crud': path.resolve(__dirname, 'components/crud/index.ts'),
        'components/layout': path.resolve(__dirname, 'components/layout/index.ts'),
        'auth-screens': path.resolve(__dirname, 'auth-screens/index.ts'),
        tokens: path.resolve(__dirname, 'tokens/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
        preserveModules: false,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles.css'
          }
          return '[name].js'
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
})
