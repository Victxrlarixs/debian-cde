import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://debian.com.mx',
  vite: {
    define: {
      'import.meta.env.PUBLIC_APP_VERSION': JSON.stringify(process.env.npm_package_version),
    },
  },
});
