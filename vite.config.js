import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: mode === 'production' ? env.VITE_BASE_URL || '/' : '/',
    plugins: [react()],
    server: {
      proxy:
        mode === 'development'
          ? {
              '/api': {
                target: env.VITE_API_BASE_URL,
                changeOrigin: true,
              },
            }
          : undefined,
    },
  };
});
