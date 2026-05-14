import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: { port: 3000, host: '0.0.0.0' },
    publicDir: 'public',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,         // gerenciado pelo PWAManager.tsx
        strategies: 'generateSW',
        includeAssets: [
          'icon.svg',
          'apple-touch-icon.png',
          'favicon.ico',
          'fonts/*.woff2',
        ],
        manifest: {
          name: 'Serenamente — Sua mente em paz',
          short_name: 'Serenamente',
          description: 'Apoio emocional diário com IA para reduzir ansiedade, melhorar sono e cuidar de você.',
          lang: 'pt-BR',
          dir: 'ltr',
          start_url: '/?source=pwa',
          scope: '/',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone'],
          orientation: 'portrait',
          background_color: '#f8fafc',
          theme_color: '#1a6b73',
          categories: ['health', 'lifestyle', 'medical'],
          icons: [
            { src: '/icon.svg', sizes: 'any',     type: 'image/svg+xml', purpose: 'any' },
            { src: '/icon.svg', sizes: 'any',     type: 'image/svg+xml', purpose: 'maskable' },
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
          shortcuts: [
            { name: 'Check-in', short_name: 'Check-in', description: 'Como você tá agora?',
              url: '/?action=checkin',
              icons: [{ src: '/icon.svg', sizes: '96x96' }] },
            { name: 'SOS Ansiedade', short_name: 'SOS', description: 'Ajuda imediata',
              url: '/?action=sos',
              icons: [{ src: '/icon.svg', sizes: '96x96' }] },
            { name: 'Conversar com Sereno', short_name: 'Chat', description: 'Conversa com IA',
              url: '/?action=chat',
              icons: [{ src: '/icon.svg', sizes: '96x96' }] },
            { name: 'Respirar agora', short_name: 'Respirar', description: 'Respiração 4-7-8',
              url: '/?action=breathe',
              icons: [{ src: '/icon.svg', sizes: '96x96' }] },
          ],
          share_target: {
            action: '/?share=1',
            method: 'GET',
            params: { title: 'title', text: 'text', url: 'url' },
          },
          prefer_related_applications: false,
        },
        workbox: {
          // SPA navigation fallback
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/sw\.js/],
          // Cache de assets buildados (JS/CSS/imagens com hash)
          globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,json}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: false,           // PWAManager decide quando trocar de versão
          runtimeCaching: [
            // Fontes do Google: cache-first com expiração longa
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // Tailwind CDN (DEV: produção deve buildar Tailwind)
            {
              urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'tailwind-cdn',
                expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // esm.sh: as deps importadas via importmap em dev
            {
              urlPattern: /^https:\/\/esm\.sh\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'esm-sh',
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            // Firebase Firestore: NetworkFirst (dados frescos quando online)
            {
              urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'firestore',
                networkTimeoutSeconds: 6,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            // NUNCA cachear chamadas à IA (custo + privacidade)
            {
              urlPattern: /generativelanguage\.googleapis\.com/,
              handler: 'NetworkOnly',
            },
          ],
        },
        devOptions: {
          enabled: false,             // em dev usa registro manual via PWAManager
          type: 'module',
        },
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') }
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          },
        },
      },
    },
  };
});
