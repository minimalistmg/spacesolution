import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

const pages = [
  '/',
  '/about/',
  '/commercial-interiors/',
  '/contact/',
  '/faq/',
  '/institutional-interiors/',
  '/portfolio/',
  '/privacy-policy/',
  '/project-detail/',
  '/residential-interiors/',
  '/turnkey-fitout/',
];

export const GET: APIRoute = () => {
  const urls = pages
    .map(
      (path) =>
        `  <url><loc>${new URL(path, SITE.url).href}</loc><changefreq>monthly</changefreq><priority>${path === '/' ? '1.0' : '0.8'}</priority></url>`
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
