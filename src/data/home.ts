import type { ImageMetadata } from 'astro';
import { heroImages, projectImages } from './images';

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
    hoverImage: heroImages.bedroom,
  },
  {
    title: 'Commercial Interiors',
    description:
      'Efficient workspace solutions that support smooth operations and organized layouts.',
    href: '/commercial-interiors',
    icon: 'building',
    hoverImage: heroImages.kitchen1,
  },
  {
    title: 'Institutional Interiors',
    description:
      'Durable interiors for high-usage spaces including schools, healthcare, retail, and hospitality.',
    href: '/institutional-interiors',
    icon: 'school',
    hoverImage: heroImages.kitchen2,
  },
];

export const homeGalleryItems: HomeGalleryItem[] = [
  {
    title: 'Residential Design',
    category: 'residential',
    label: 'Residential',
    image: heroImages.bedroom,
    href: '/project-detail',
  },
  {
    title: 'Corporate Design',
    category: 'corporate',
    label: 'Corporate',
    image: heroImages.kitchen1,
    href: '/project-detail',
  },
  {
    title: 'Commercial Design',
    category: 'commercial',
    label: 'Commercial',
    image: heroImages.kitchen2,
    href: '/project-detail',
  },
  {
    title: 'Restaurant Design',
    category: 'restaurant',
    label: 'Restaurant',
    image: projectImages.modularKitchen,
    href: '/project-detail',
  },
  {
    title: 'Residential Design',
    category: 'residential',
    label: 'Residential',
    image: projectImages.homeInterior3,
    href: '/project-detail',
  },
  {
    title: 'Restaurant Design',
    category: 'restaurant',
    label: 'Restaurant',
    image: heroImages.kitchen1,
    href: '/project-detail',
  },
];

export const galleryFilters = [
  { id: 'all', label: 'All' },
  { id: 'residential', label: 'Residential' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'commercial', label: 'Commercial' },
] as const;
