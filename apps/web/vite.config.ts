import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3005",
        changeOrigin: true,
      },
    },
  },
  plugins: [TanStackRouterVite(), react(), VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'sw.ts', // Source service worker file
    registerType: 'autoUpdate',
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
    },
    devOptions: {
      enabled: true, // Keep disabled in dev to avoid stale asset caching
      type: 'module'
    }
  }), tailwindcss()],
});
