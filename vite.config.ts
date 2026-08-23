import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Inject the service-worker registration script automatically
      injectRegister: 'auto',
      // Dev mode — set true to test SW locally during `vite dev`
      devOptions: {
        enabled: false,
      },

      /* ── Web App Manifest ── */
      manifest: {
        name: 'Peerless Academy - Next-Gen EdTech',
        short_name: 'Peerless',
        description: 'AI-Powered Learning, 3D Simulation Labs & NTA Exam CBT Simulator',
        theme_color: '#0f172a',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        lang: 'en',
        categories: ['education'],
        icons: [
          {
            src: '/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any maskable',
          },
          {
            src: '/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Practice Lab',
            short_name: 'Practice',
            description: 'Jump into the MCQ practice lab',
            url: '/#practice',
            icons: [{ src: '/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg', sizes: '96x96' }],
          },
          {
            name: 'The Arena',
            short_name: 'Arena',
            description: 'Enter live 1v1 MCQ battles',
            url: '/#arena',
            icons: [{ src: '/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg', sizes: '96x96' }],
          },
        ],
      },

      /* ── Workbox Caching Strategy ── */
      workbox: {
        // Pre-cache all build output assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,jpg,webp,woff2,woff}'],
        
        // Allow caching the massive 10k questions JSON file (up to 5MB)
        maximumFileSizeToCacheInBytes: 5000000,

        // Runtime caching rules
        runtimeCaching: [
          /* 1. Google Fonts stylesheets — StaleWhileRevalidate */
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          /* 2. Google Fonts files — CacheFirst (immutable) */
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          /* 3. Supabase API — NetworkFirst (fresh data, fallback to cache) */
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          /* 4. Local images — CacheFirst (long-lived) */
          {
            urlPattern: /\/images\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-images',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          /* 5. JS / CSS chunks — StaleWhileRevalidate */
          {
            urlPattern: /\/assets\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],

        // Ensure the SW activates immediately without waiting for old tabs to close
        skipWaiting: true,
        clientsClaim: true,

        // Clean up outdated caches on activation
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
