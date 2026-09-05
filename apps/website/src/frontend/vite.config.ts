import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// Mock API plugin for in-memory handling of contact and newsletter in dev
function mockApiPlugin() {
  return {
    name: 'mock-api',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.method === 'POST' && (req.url === '/contact' || req.url === '/api/contact')) {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              lead_id: Date.now(),
              lead_score: 95,
              lead_quality: 'A',
              message: '¡Gracias por contactarnos! Un consultor senior de FaruTech se comunicará pronto.'
            }));
          });
          return;
        }
        if (req.method === 'POST' && (req.url === '/newsletter' || req.url === '/api/newsletter')) {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: '¡Suscripción confirmada! Te mantendremos informado sobre nuestras novedades de ingeniería.'
            }));
          });
          return;
        }
        next();
      });
    }
  };
}

// Golden path: React + TypeScript + Vite. Tailwind v4 vía plugin oficial (sin config JS).
export default defineConfig({
  plugins: [react(), tailwindcss(), mockApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      plugins: [
        visualizer({
          filename: './dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true
        })
      ]
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
  }
});
