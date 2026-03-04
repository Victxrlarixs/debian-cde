import { defineConfig } from 'astro/config';

// Centralized default backdrop path - single source of truth
const DEFAULT_BACKDROP = '/backdrops/SkyDarkTall.pm';

export default defineConfig({
  site: 'https://debian.com.mx',
  vite: {
    define: {
      'import.meta.env.PUBLIC_APP_VERSION': JSON.stringify(process.env.npm_package_version),
      'import.meta.env.DEFAULT_BACKDROP': JSON.stringify(DEFAULT_BACKDROP),
    },
    server: {
      proxy: {
        '/docs': {
          target: 'https://victxrlarixs-debian-cde-48.mintlify.dev',
          changeOrigin: true,
          rewrite: (path) => path,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              proxyReq.setHeader('Host', 'victxrlarixs-debian-cde-48.mintlify.dev');
              proxyReq.setHeader('X-Forwarded-Host', req.headers.host || 'localhost');
              proxyReq.setHeader('X-Forwarded-Proto', 'https');
            });
          },
        },
      },
    },
  },
});
