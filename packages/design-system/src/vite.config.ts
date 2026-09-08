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
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(import.meta.dirname, 'index.ts'),
        'components/ui': path.resolve(import.meta.dirname, 'components/ui/index.ts'),
        'components/crud': path.resolve(import.meta.dirname, 'components/crud/index.ts'),
        'components/layout': path.resolve(import.meta.dirname, 'components/layout/index.ts'),
        'components/basic': path.resolve(import.meta.dirname, 'components/basic/index.ts'),
        'components/navigation': path.resolve(import.meta.dirname, 'components/navigation/index.ts'),
        'auth-screens': path.resolve(import.meta.dirname, 'auth-screens/index.ts'),
        tokens: path.resolve(import.meta.dirname, 'tokens/index.ts'),
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
