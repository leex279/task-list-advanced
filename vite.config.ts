import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import dotenv from 'dotenv';
    import path from 'path';

    dotenv.config({ path: path.resolve(__dirname, '.env') });

    // Derive URLs outside of defineConfig
    let defaultGithubTasklistsUrl = '';
    let defaultGithubRawUrl = '';

    try {
      const url = new URL(process.env.VITE_DEFAULT_GITHUB_REPO_URL || '');
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        const username = parts[0];
        const project = parts[1];
        defaultGithubTasklistsUrl = `https://api.github.com/repos/${username}/${project}/contents/tasklists`;
        defaultGithubRawUrl = `https://raw.githubusercontent.com/${username}/${project}/main/tasklists`;
      }
    } catch (error) {
      console.error("Invalid URL:", error);
    }

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
        'import.meta.env.VITE_DEFAULT_GITHUB_REPO_URL': JSON.stringify(process.env.VITE_DEFAULT_GITHUB_REPO_URL),
        'import.meta.env.VITE_DEFAULT_GITHUB_TASKLISTS_URL': JSON.stringify(defaultGithubTasklistsUrl),
        'import.meta.env.VITE_DEFAULT_GITHUB_RAW_URL': JSON.stringify(defaultGithubRawUrl),
      }
    });
