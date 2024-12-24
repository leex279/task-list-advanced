import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

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
