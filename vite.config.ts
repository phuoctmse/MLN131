import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Removed COEP header that was blocking CDN resources
        // headers: {
        //   'Cross-Origin-Embedder-Policy': 'require-corp',
        //   'Cross-Origin-Opener-Policy': 'same-origin',
        // },
        // Configure MIME types for worker files
        mimeTypes: {
          'application/javascript': ['js', 'mjs']
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_BACKEND': JSON.stringify(env.VITE_BACKEND),
        'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
        'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      assetsInclude: ['**/*.pdf'],
      build: {
        assetsInlineLimit: 0, // Prevent inlining of PDF files
      },
      optimizeDeps: {
        include: ['pdfjs-dist']
      }
    };
});
