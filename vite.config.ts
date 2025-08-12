import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig(async () => ({
  plugins: [preact()],

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  
  build: {
    target: 'baseline-widely-available',
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'youtube-api': ['./src/services/youtube-player.ts'],
          'audio-hooks': ['./src/hooks/use-audio-player.ts'],
        },
      },
    },
  },
  
  css: {
    preprocessorMaxWorkers: true,
  },
  
  optimizeDeps: {
    include: ['preact', 'preact/hooks'],
    holdUntilCrawlEnd: false,
  },
}));
