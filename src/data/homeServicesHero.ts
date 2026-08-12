import type { ImageMetadata } from 'astro';
import { cutoutImages, openHouseWideFamilyImage } from './images';

export type HomeServiceOffer = {
  id: string;
  nav: string;
  titleLight: string;
  titleDark: string;
  label: string;
  lead: string;
  /** CTA uses shared “Explore …” prefix; width is fixed in CSS */
  cta: string;
  href: string;
  spot: [number, number];
  cutout: ImageMetadata;
};

/** Residential hub hero — room offerings for auto-tour + hover sync. */
export const homeServiceOffers: HomeServiceOffer[] = [
  {
    id: 'kitchen',
    nav: 'Kitchen',
    titleLight: 'Modular',
    titleDark: 'Kitchen',
    label: 'Modular Kitchen',
    lead: 'Imagine a kitchen that greets you every morning. Smart storage, easy flow, and finishes that stay beautiful through years of family cooking. Designed and built here in Mysuru, ready when you are.',
    cta: 'Explore Kitchen',
    href: '/modular-kitchen',
    spot: [29, 24],
    cutout: cutoutImages.kitchen,
  },
  {
    id: 'wardrobe',
    nav: 'Wardrobes',
    titleLight: 'Wardrobes',
    titleDark: '& Storage',
    label: 'Wardrobes & Storage',
    lead: 'Open a wardrobe that finally fits your life. Quiet doors, tailored shelves, and room to breathe. Storage designed for you, not squeezed into leftover space.',
    cta: 'Explore Wardrobes',
    href: '/wardrobes-storage',
    spot: [71.5, 22],
    cutout: cutoutImages.wardrobe,
  },
  {
    id: 'living',
    nav: 'Living',
    titleLight: 'Living',
    titleDark: '& Dining',
    label: 'Living & Dining',
    lead: 'This is where evenings gather. Warm light, easy seating, and a dining corner that invites people to linger. Living spaces shaped for how your family actually lives.',
    cta: 'Explore Living',
    href: '/living-dining',
    spot: [48, 58],
    cutout: cutoutImages.sofa,
  },
  {
    id: 'bedroom',
    nav: 'Bedrooms',
    titleLight: 'Restful',
    titleDark: 'Bedrooms',
    label: 'Bedrooms',
    lead: 'Come home to a bedroom that softens the day. Restful tones, smart storage, and a calm you can feel the moment you walk in. Privacy, planned with care.',
    cta: 'Explore Bedrooms',
    href: '/bedrooms',
    spot: [77.5, 38],
    cutout: cutoutImages.bed,
  },
  {
    id: 'pooja',
    nav: 'Pooja',
    titleLight: 'Pooja',
    titleDark: 'Room',
    label: 'Pooja Room',
    lead: 'A quiet corner for prayer and presence. Warm timber, respectful proportions, and finishes meant for daily ritual. A space that holds meaning, beautifully.',
    cta: 'Explore Pooja',
    href: '/pooja-room',
    spot: [6.5, 50],
    cutout: cutoutImages.pooja,
  },
  {
    id: 'full',
    nav: 'Full Home',
    titleLight: 'Full Home',
    titleDark: 'Interiors',
    label: 'Full Home Interiors',
    lead: 'One home, one language. From kitchen to bedrooms, designed and delivered by a single Mysuru team. Less juggling, more joy when you walk through the door for the first time.',
    cta: 'Explore Full Home',
    href: '/full-home-interiors',
    spot: [49, 47],
    cutout: cutoutImages.chair,
  },
];

export const homeServicesHouseImage = openHouseWideFamilyImage;
