import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` lets the build work from any sub-path (GitHub Pages, Netlify, etc.)
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // Windows locks image/audio files while they are open or being copied
    // (EBUSY), which crashes the file watcher — these never need hot reload.
    watch: { ignored: ['**/public/images/**', '**/public/audio/**', '**/dist/**'] },
  },
});
