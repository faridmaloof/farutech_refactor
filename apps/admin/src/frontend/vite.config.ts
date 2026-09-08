import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Golden path: React + TypeScript + Vite + Tailwind v4.
// Admin servido bajo /admin (ver ADR-006, TASK-015)
export default defineConfig({
  base: "/admin/",
  plugins: [react(), tailwindcss()],
  server: { port: 5174 },
  build: {
    target: "esnext",
    minify: "esbuild",
  },
});
