import { defineConfig, passthroughImageService } from 'astro/config';

// Temporary: skip AVIF/WebP conversion during `astro build`.
// Remove this flag and the conditional `image` block to restore build-time optimization.
const disableBuildImageConversion = process.argv.includes('build');

export default defineConfig({
  site: 'https://spacesolution.in',
  output: 'static',
  trailingSlash: 'never',
  devToolbar: {
    enabled: false,
  },
  build: {
    // Flat .html files so Cloudflare Pages serves /portfolio without /portfolio/ redirects.
    format: 'file',
  },
  ...(disableBuildImageConversion
    ? {
        image: {
          service: passthroughImageService(),
        },
      }
    : {}),
});
