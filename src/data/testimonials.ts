import type { ImageMetadata } from 'astro';
import { heroImages, projectImages, roomImages } from './images';

export type TestimonialCategory =
  | 'home-interiors'
  | 'commercial'
  | 'institutional'
  | 'hospitality';

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  initials: string;
  project: string;
  locality: string;
  category: TestimonialCategory;
  rating: 5;
  roomImage: ImageMetadata;
  roomAlt: string;
}

export interface TestimonialsCopy {
  badge: string;
  headingBefore: string;
  accent: string;
  headingAfter: string;
}

export const GOOGLE_REVIEWS_HREF =
  'https://www.google.com/search?q=Space+Solution+Kalidasa+Road+Mysuru+reviews';

export const testimonials: Testimonial[] = [
  {
    id: 'sunilkumar-sm',
    quote:
      'From our first meeting, they truly listened. Karthik understood every requirement. I recommend Space Solution without a moment’s hesitation.',
    name: 'Sunilkumar SM',
    initials: 'SS',
    project: 'Full home',
    locality: 'Vijayanagar',
    category: 'home-interiors',
    rating: 5,
    roomImage: projectImages.villa,
    roomAlt: 'Finished living interiors from a full-home project in Vijayanagar',
  },
  {
    id: 'aparna-prasannakumar',
    quote:
      'Impressed by the kitchen options and materials. Harshita and team gave us the best design, a reasonable quote, and neat execution.',
    name: 'Aparna Prasannakumar',
    initials: 'AP',
    project: 'Modular kitchen',
    locality: 'Kalidasa Road',
    category: 'home-interiors',
    rating: 5,
    roomImage: roomImages.modularKitchen,
    roomAlt: 'Modular kitchen interiors completed by Space Solution',
  },
  {
    id: 'mbh-creation',
    quote:
      'High-quality materials, excellent designs, and a quick response. The process was well-organised and the finish was beautifully detailed.',
    name: 'MBH Creation',
    initials: 'MC',
    project: 'Workplace interiors',
    locality: 'Mysuru',
    category: 'commercial',
    rating: 5,
    roomImage: roomImages.office,
    roomAlt: 'Commercial workplace interiors with clean joinery and lighting',
  },
  {
    id: 'karthik-prasad-m',
    quote:
      'A game-changer in modular furniture. Stylish, modern, and remarkably functional - every inch of space in my home works harder.',
    name: 'Karthik Prasad M',
    initials: 'KP',
    project: 'Modular furniture',
    locality: 'Mysuru',
    category: 'home-interiors',
    rating: 5,
    roomImage: projectImages.apartment,
    roomAlt: 'Modular storage and furniture in a completed home',
  },
  {
    id: 'vilina-ramesh',
    quote:
      'One of the best kitchen designers. From design to execution, everything was perfect as envisioned. We are absolutely in love with our new kitchen.',
    name: 'Vilina Ramesh',
    initials: 'VR',
    project: 'Modular kitchen',
    locality: 'Mysuru',
    category: 'home-interiors',
    rating: 5,
    roomImage: heroImages.kitchen1,
    roomAlt: 'Warm contemporary kitchen completed for a Mysuru home',
  },
  {
    id: 'sumitha-uchil',
    quote:
      'Absolutely beautiful interior solution. Well priced, great quality, and timely completion of work.',
    name: 'Sumitha Uchil',
    initials: 'SU',
    project: 'Home interiors',
    locality: 'Mysuru',
    category: 'home-interiors',
    rating: 5,
    roomImage: roomImages.bedroom,
    roomAlt: 'Bedroom interiors with custom wardrobe and calm finishes',
  },
];

const COPY: Record<TestimonialCategory | 'home', TestimonialsCopy> = {
  home: {
    badge: 'Rated 4.9 on Google · 800+ homes in Mysuru',
    headingBefore: 'Words from the ',
    accent: 'homes',
    headingAfter: ' we make.',
  },
  'home-interiors': {
    badge: 'Rated 4.9 on Google · Residential interiors',
    headingBefore: 'Words from the ',
    accent: 'homes',
    headingAfter: ' we make.',
  },
  commercial: {
    badge: 'Rated 4.9 on Google · Workplaces we fit',
    headingBefore: 'Words from the ',
    accent: 'workplaces',
    headingAfter: ' we fit.',
  },
  institutional: {
    badge: 'Rated 4.9 on Google · Campus & care interiors',
    headingBefore: 'Trusted in rooms that ',
    accent: 'work hard',
    headingAfter: ' every day.',
  },
  hospitality: {
    badge: 'Rated 4.9 on Google · Cafés, hotels, wellness',
    headingBefore: 'Loved in rooms guests ',
    accent: 'return to',
    headingAfter: '.',
  },
};

export const MIN_TESTIMONIALS_FOR_MARQUEE = 3;

export function getTestimonials(category?: TestimonialCategory): Testimonial[] {
  if (!category) return testimonials;
  return testimonials.filter((item) => item.category === category);
}

export function getTestimonialsCopy(category?: TestimonialCategory): TestimonialsCopy {
  return COPY[category ?? 'home'];
}
