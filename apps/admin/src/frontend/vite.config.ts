import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Golden path: React + TypeScript + Vite. Tailwind v4 vía plugin oficial.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5174 },
  build: {
    target: "esnext",
    minify: "esbuild",
  },
});
