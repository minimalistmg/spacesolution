import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://spacesolution.in',
  output: 'static',
  integrations: [sitemap()],
});
