import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { projects } from '../data/projects';
import { getServiceLandingSlugs } from '../data/servicePages';
import { designLibraryGuides } from '../data/designLibrary';
import { getToolSlugs } from '../data/tools';

const staticPages = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/portfolio',
  '/showcase',
  '/privacy-policy',
  '/residential-interiors',
  '/commercial-interiors',
  '/institutional-interiors',
  '/hospitality-interiors',
  '/turnkey-fitout',
  '/design-library',
  '/tools',
];

const pages = [
  ...staticPages,
  ...getServiceLandingSlugs().map((slug) => `/${slug}`),
  ...designLibraryGuides.map((guide) => `/design-library/${guide.slug}`),
  ...getToolSlugs().map((slug) => `/tools/${slug}`),
  ...projects.map((project) => project.href),
];

export const GET: APIRoute = () => {
  const urls = [...new Set(pages)]
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
