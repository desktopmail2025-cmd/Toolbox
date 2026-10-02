import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'favicon.png',
          'apple-touch-icon.png',
          'icon.svg',
          'screenshot-wide.png',
          'screenshot-narrow.png',
        ],
        manifest: {
          id: '/',
          name: 'OmniToolbox — All-in-One Utility Hub',
          short_name: 'OmniToolbox', // ≤ 12 chars
          description: 'Comprehensive, lightning-fast utility suite featuring 100+ calculators, scientific solvers, unit converter hub, student tools, encrypted vault, camera utilities, and games.',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui', 'browser'],
          orientation: 'any',
          start_url: '/',
          scope: '/',
          lang: 'en-US',
          dir: 'ltr',
          categories: ['utilities', 'productivity', 'education', 'finance', 'lifestyle'],
          prefer_related_applications: false,
          launch_handler: {
            client_mode: 'auto',
          },
          edge_side_panel: {
            preferred_width: 420,
          },
          screenshots: [
            {
              src: '/screenshot-wide.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide',
              label: 'OmniToolbox Dashboard for PC, Mac, Chromebook & Tablet',
            },
            {
              src: '/screenshot-narrow.png',
              sizes: '750x1334',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'OmniToolbox Mobile App View for Android & iOS',
            },
          ],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Search Tools',
              short_name: 'Search',
              description: 'Quickly find any tool or calculator',
              url: '/?tab=search',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Subject Formulas',
              short_name: 'Formulas',
              description: 'Scientific and mathematical formula solver',
              url: '/?tool=study-formulas',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Prime Calculator',
              short_name: 'Primes',
              description: 'Deterministic prime number tester & factor tree',
              url: '/?tool=prime-checker',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Quick Notes',
              short_name: 'Notes',
              description: 'Instant scratchpad and private vault notes',
              url: '/?tab=notes',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true, // Enables service worker in development / AI Studio preview
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
