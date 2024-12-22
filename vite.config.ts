import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    fs: {
      allow: ['src', 'node_modules'],
    },
  },
  define: {
    'import.meta.env.VITE_DEFAULT_GITHUB_TASKLISTS_URL': JSON.stringify(process.env.VITE_DEFAULT_GITHUB_TASKLISTS_URL),
    'import.meta.env.VITE_DEFAULT_GITHUB_REPO_URL': JSON.stringify(process.env.VITE_DEFAULT_GITHUB_REPO_URL),
    'import.meta.env.VITE_DEFAULT_GITHUB_RAW_URL': JSON.stringify(process.env.VITE_DEFAULT_GITHUB_RAW_URL),
  }
});
