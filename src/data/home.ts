import type { ImageMetadata } from 'astro';
import { heroImages, projectImages, roomImages } from './images';

export interface HomeService {
  title: string;
  description: string;
  href: string;
  icon: 'house' | 'building' | 'school';
  hoverImage: ImageMetadata;
}

export interface HomeGalleryItem {
  title: string;
  category: 'residential' | 'corporate' | 'restaurant' | 'commercial';
  label: string;
  image: ImageMetadata;
  href: string;
}

export const homeServices: HomeService[] = [
  {
    title: 'Residential Interiors',
    description:
      'Smart, functional home interiors designed for comfort, storage, and everyday living.',
    href: '/residential-interiors',
    icon: 'house',
    hoverImage: heroImages.residential,
  },
  {
    title: 'Commercial Interiors',
    description:
      'Efficient workspace solutions that support smooth operations and organized layouts.',
    href: '/commercial-interiors',
    icon: 'building',
    hoverImage: heroImages.commercial,
  },
  {
    title: 'Institutional Interiors',
    description:
      'Durable interiors for high-usage spaces including schools, healthcare, retail, and hospitality.',
    href: '/institutional-interiors',
    icon: 'school',
    hoverImage: heroImages.institutional,
  },
];

export const homeGalleryItems: HomeGalleryItem[] = [
  {
    title: 'Vijayanagar Residence',
    category: 'residential',
    label: 'Residential',
    image: projectImages.apartment,
    href: '/projects/vijayanagar-residence',
  },
  {
    title: 'Infotech Workspace',
    category: 'corporate',
    label: 'Corporate',
    image: roomImages.office,
    href: '/projects/infotech-workspace',
  },
  {
    title: 'Retail Pop-Up',
    category: 'commercial',
    label: 'Commercial',
    image: roomImages.retail,
    href: '/projects/retail-pop-up',
  },
  {
    title: 'Soft Café, Mysuru',
    category: 'restaurant',
    label: 'Hospitality',
    image: roomImages.cafe,
    href: '/projects/soft-cafe-mysuru',
  },
  {
    title: 'Heritage Home',
    category: 'residential',
    label: 'Residential',
    image: projectImages.villa,
    href: '/projects/heritage-home',
  },
  {
    title: 'Co-working Lounge',
    category: 'corporate',
    label: 'Workplace',
    image: projectImages.coworking,
    href: '/projects/infotech-workspace',
  },
];

export const galleryFilters = [
  { id: 'all', label: 'All' },
  { id: 'residential', label: 'Residential' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'commercial', label: 'Commercial' },
] as const;
