import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    fs: {
      allow: ['public/tasklists', 'src', 'node_modules'],
    },
    middleware: [
      {
        pattern: '/tasklists',
        handler: async (req, res, next) => {
          try {
            const tasklistsDir = path.resolve(__dirname, 'public/tasklists');
            const files = await fs.promises.readdir(tasklistsDir);
            const jsonFiles = files.filter(file => file.endsWith('.json'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(jsonFiles));
          } catch (error) {
            console.error('Error reading task lists directory:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to read task lists' }));
          }
        },
      },
    ],
  },
});
