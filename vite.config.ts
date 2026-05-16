import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const rawBase = env.VITE_BASE_PATH || '/';
  const baseUrl = rawBase === '/'
    ? '/'
    : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;
  return {
    base: baseUrl,
    server: { port: 3000, host: '0.0.0.0' },
    publicDir: 'public',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,
        strategies: 'generateSW',
        includeAssets: ['icon.svg','apple-touch-icon.png','favicon.ico','fonts/*.woff2'],
        manifest: {
          name: 'Resiliência e Luz — Seja a mudança',
          short_name: 'Resiliência e Luz',
          description: 'Frases, reflexões e bem-estar diário para cultivar resiliência e leveza no seu dia a dia.',
          lang: 'pt-BR',
          dir: 'ltr',
          start_url: `${baseUrl}?source=pwa`,
          scope: baseUrl,
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone'],
          orientation: 'portrait',
          background_color: '#f4f6fc',
          theme_color: '#1a3f8f',
          categories: ['health', 'lifestyle', 'medical'],
          icons: [
            { src: `${baseUrl}icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: `${baseUrl}icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
            { src: `${baseUrl}icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: `${baseUrl}icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: `${baseUrl}icon-512-maskable.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
          shortcuts: [
            { name: 'Check-in', short_name: 'Check-in', description: 'Como você tá agora?', url: `${baseUrl}?action=checkin`, icons: [{ src: `${baseUrl}icon.svg`, sizes: '96x96' }] },
            { name: 'SOS Ansiedade', short_name: 'SOS', description: 'Ajuda imediata', url: `${baseUrl}?action=sos`, icons: [{ src: `${baseUrl}icon.svg`, sizes: '96x96' }] },
            { name: 'Conversar com Luz', short_name: 'Chat', description: 'Conversa com IA', url: `${baseUrl}?action=chat`, icons: [{ src: `${baseUrl}icon.svg`, sizes: '96x96' }] },
            { name: 'Respirar agora', short_name: 'Respirar', description: 'Respiração 4-7-8', url: `${baseUrl}?action=breathe`, icons: [{ src: `${baseUrl}icon.svg`, sizes: '96x96' }] },
          ],
          share_target: { action: `${baseUrl}?share=1`, method: 'GET', params: { title: 'title', text: 'text', url: 'url' } },
          prefer_related_applications: false,
        },
        workbox: {
          navigateFallback: `${baseUrl}index.html`,
          navigateFallbackDenylist: [/^\/api\//, /^\/sw\.js/],
          globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,json}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: false,
          runtimeCaching: [
            { urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i, handler: 'StaleWhileRevalidate', options: { cacheName: 'google-fonts-stylesheets', expiration: { maxEntries: 10, maxAgeSeconds: 31536000 } } },
            { urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i, handler: 'CacheFirst', options: { cacheName: 'google-fonts-webfonts', expiration: { maxEntries: 20, maxAgeSeconds: 31536000 }, cacheableResponse: { statuses: [0, 200] } } },
            { urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i, handler: 'CacheFirst', options: { cacheName: 'tailwind-cdn', expiration: { maxEntries: 5, maxAgeSeconds: 604800 }, cacheableResponse: { statuses: [0, 200] } } },
            { urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i, handler: 'NetworkFirst', options: { cacheName: 'firestore', networkTimeoutSeconds: 6, expiration: { maxEntries: 50, maxAgeSeconds: 86400 } } },
            { urlPattern: /generativelanguage\.googleapis\.com/, handler: 'NetworkOnly' },
          ],
        },
        devOptions: { enabled: false, type: 'module' },
      }),
    ],
    define: { 'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '') },
    resolve: { alias: { '@': path.resolve(__dirname, '.') } },
    build: {
      sourcemap: false,
      rollupOptions: { output: { manualChunks: { 'react-vendor': ['react', 'react-dom'], 'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'] } } },
    },
  };
});
