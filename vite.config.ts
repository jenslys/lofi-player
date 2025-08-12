import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => ({
  plugins: [react()],

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
    include: ['react', 'react-dom'],
    holdUntilCrawlEnd: false,
  },
}));
