import type { ImageMetadata } from 'astro';

export interface MegaMenuService {
  title: string;
  description: string;
  href: string;
}

export const megaMenuServices: MegaMenuService[] = [
  {
    title: 'Residential',
    description: 'Beautiful, functional spaces crafted for modern living.',
    href: '/residential-interiors',
  },
  {
    title: 'Commercial',
    description: 'Inspiring workspaces that elevate productivity.',
    href: '/commercial-interiors',
  },
  {
    title: 'Institutional',
    description: 'Designing spaces that empower communities.',
    href: '/institutional-interiors',
  },
  {
    title: 'Turnkey',
    description: 'End-to-end solutions delivered seamlessly.',
    href: '/turnkey-fitout',
  },
];
