import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Static routes (no trailing slash) — must match Astro `trailingSlash: 'never'`. */
const routes = [
  '/about',
  '/commercial-interiors',
  '/contact',
  '/faq',
  '/institutional-interiors',
  '/portfolio',
  '/privacy-policy',
  '/project-detail',
  '/residential-interiors',
  '/turnkey-fitout',
  '/design-library',
  '/design-library/modular-kitchen-guide',
  '/design-library/materials-and-finishes',
  '/design-library/space-planning',
  '/design-library/interior-styles',
  '/design-library/budget-planning',
  '/design-library/before-you-renovate',
];

const lines = [
  '# Serve pretty URLs without redirect loops (Cloudflare Pages / Workers assets)',
  '# 200 rewrites map both slash and no-slash requests to the built HTML file.',
  '',
];

for (const route of routes) {
  const destination = `${route}/index.html`;
  lines.push(`${route} ${destination} 200`);
  lines.push(`${route}/ ${destination} 200`);
}

const output = join(root, 'public', '_redirects');
writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');

console.log(`Wrote ${routes.length * 2} rewrite rules to public/_redirects`);
