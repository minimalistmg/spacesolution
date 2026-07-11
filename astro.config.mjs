import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://spacesolution.in',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Flat .html files so Cloudflare Pages serves /portfolio without /portfolio/ redirects.
    format: 'file',
  },
});
