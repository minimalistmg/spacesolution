import type { ImageMetadata } from 'astro';
import type { MenuIconName } from './headerMenuIcons';
import { homeServiceOffers, homeServicesHouseImage } from './homeServicesHero';
import {
  openHouseCommercialImage,
  openHouseHospitalityImage,
  openHouseInstitutionalImage,
} from './images';

export type DepthHeroOffer = {
  id: string;
  nav: string;
  titleLight: string;
  titleDark: string;
  label: string;
  lead: string;
  cta: string;
  href: string;
  spot: [number, number];
  cutout?: ImageMetadata;
};

export type DepthHeroVariant = 'diorama';

export type DepthHeroHubConfig = {
  slug: string;
  heading: string;
  /** Mega-menu featured icon (Phosphor Regular / outline) */
  menuIcon: MenuIconName;
  ariaLabel: string;
  houseAlt: string;
  variant: DepthHeroVariant;
  /** Modifier class for fill/zone calibration */
  stageClass: string;
  houseImage: ImageMetadata;
  offers: DepthHeroOffer[];
};

/** Residential - unchanged open-house diorama tour */
export const residentialDepthHero: DepthHeroHubConfig = {
  slug: 'residential-interiors',
  heading: 'Residential Interiors',
  menuIcon: 'house',
  ariaLabel: 'Home interiors services',
  houseAlt:
    'Space Solution full-home open-house interior with family across kitchen, living, bedroom, wardrobe, and pooja spaces',
  variant: 'diorama',
  stageClass: 'idh-hero--residential',
  houseImage: homeServicesHouseImage,
  offers: homeServiceOffers,
};

export const commercialDepthHero: DepthHeroHubConfig = {
  slug: 'commercial-interiors',
  heading: 'Commercial Interiors',
  menuIcon: 'buildings',
  ariaLabel: 'Commercial interiors services',
  houseAlt:
    'Space Solution commercial open-building interior with office, clinic, retail, and co-working spaces',
  variant: 'diorama',
  stageClass: 'idh-hero--commercial',
  houseImage: openHouseCommercialImage,
  offers: [
    {
      id: 'office',
      nav: 'Office',
      titleLight: 'Office',
      titleDark: 'Interiors',
      label: 'Office Interiors',
      lead: 'Walk into a workplace that works as hard as your team. Clear zones, calm focus, and furniture that keeps pace with every meeting and deadline.',
      cta: 'Explore Office',
      href: '/office-interiors',
      spot: [22, 58],
    },
    {
      id: 'clinic',
      nav: 'Clinics',
      titleLight: 'Clinics',
      titleDark: '& Healthcare',
      label: 'Clinics & Healthcare',
      lead: 'Care starts at the door. Soft light, clear flow, and hygiene-ready finishes help patients feel settled and staff move with ease.',
      cta: 'Explore Clinics',
      href: '/clinic-interiors',
      spot: [72, 62],
    },
    {
      id: 'retail',
      nav: 'Retail',
      titleLight: 'Retail',
      titleDark: '& Showrooms',
      label: 'Retail & Showrooms',
      lead: 'Give your brand a room people want to linger in. Display, lighting, and pathways planned so product and story lead the way.',
      cta: 'Explore Retail',
      href: '/retail-interiors',
      spot: [46, 28],
    },
    {
      id: 'coworking',
      nav: 'Co-working',
      titleLight: 'Co-working',
      titleDark: 'Spaces',
      label: 'Co-working',
      lead: 'Shared floors that still feel personal. Flexible desks, quiet corners, and community energy without the clutter.',
      cta: 'Explore Co-working',
      href: '/coworking-interiors',
      spot: [74, 18],
    },
    {
      id: 'full',
      nav: 'Full Fitout',
      titleLight: 'Full',
      titleDark: 'Commercial Fitout',
      label: 'Full Commercial Fitout',
      lead: 'One team from first plan to opening day. Offices, clinics, retail, and co-working delivered with a single accountable handover in Mysuru.',
      cta: 'Explore Commercial',
      href: '/commercial-interiors',
      spot: [50, 48],
    },
  ],
};

export const institutionalDepthHero: DepthHeroHubConfig = {
  slug: 'institutional-interiors',
  heading: 'Institutional Interiors',
  menuIcon: 'student',
  ariaLabel: 'Institutional interiors services',
  houseAlt:
    'Space Solution institutional open-building interior with classroom, hostel, library, and admin spaces',
  variant: 'diorama',
  stageClass: 'idh-hero--institutional',
  houseImage: openHouseInstitutionalImage,
  offers: [
    {
      id: 'school',
      nav: 'Schools',
      titleLight: 'Schools',
      titleDark: '& Colleges',
      label: 'Schools & Colleges',
      lead: 'Classrooms built for real learning days. Durable desks, clear sightlines, and layouts that keep focus where it belongs.',
      cta: 'Explore Schools',
      href: '/school-interiors',
      spot: [24, 43],
    },
    {
      id: 'hostel',
      nav: 'Hostels',
      titleLight: 'Hostel',
      titleDark: '& PG Furniture',
      label: 'Hostel & PG Furniture',
      lead: 'Beds, lockers, and study corners that survive continuous use. Practical comfort for students, easy upkeep for campuses.',
      cta: 'Explore Hostels',
      href: '/hostel-furniture',
      spot: [68, 25],
    },
    {
      id: 'library',
      nav: 'Libraries',
      titleLight: 'Libraries',
      titleDark: '& Labs',
      label: 'Libraries & Labs',
      lead: 'Quiet shelves, bright benches, and lab stations planned for safety and flow. Spaces where research and reading feel natural.',
      cta: 'Explore Libraries',
      href: '/library-lab-interiors',
      spot: [42, 78],
    },
    {
      id: 'admin',
      nav: 'Admin',
      titleLight: 'Admin',
      titleDark: '& Staff Offices',
      label: 'Admin & Staff Offices',
      lead: 'Back-of-house that supports the whole campus. Efficient desks, storage, and meeting points for the teams who keep institutions running.',
      cta: 'Explore Admin',
      href: '/admin-office-interiors',
      spot: [76, 70],
    },
    {
      id: 'full',
      nav: 'Full Campus',
      titleLight: 'Full',
      titleDark: 'Campus Interiors',
      label: 'Full Campus Interiors',
      lead: 'From classrooms to hostels, one factory-backed programme. Durable interiors with clearer timelines and fewer vendors to chase.',
      cta: 'Explore Institutional',
      href: '/institutional-interiors',
      spot: [50, 48],
    },
  ],
};

export const hospitalityDepthHero: DepthHeroHubConfig = {
  slug: 'hospitality-interiors',
  heading: 'Hospitality Interiors',
  menuIcon: 'flower-lotus',
  ariaLabel: 'Hospitality interiors services',
  houseAlt:
    'Space Solution hospitality open-building interior with café, hotel lobby, bar, and salon spaces',
  variant: 'diorama',
  stageClass: 'idh-hero--hospitality',
  houseImage: openHouseHospitalityImage,
  offers: [
    {
      id: 'cafe',
      nav: 'Cafés',
      titleLight: 'Cafés',
      titleDark: '& Restaurants',
      label: 'Cafés & Restaurants',
      lead: 'Tables that invite a second order. Warm light, smart circulation, and finishes that stay beautiful through every service.',
      cta: 'Explore Cafés',
      href: '/cafe-restaurant-interiors',
      spot: [24, 24],
    },
    {
      id: 'hotel',
      nav: 'Hotels',
      titleLight: 'Hotels',
      titleDark: '& Resorts',
      label: 'Hotels & Resorts',
      lead: 'Arrival that feels remembered. Lobbies, rooms, and guest journeys planned for comfort, brand, and smooth operations.',
      cta: 'Explore Hotels',
      href: '/hotel-interiors',
      spot: [70, 24],
    },
    {
      id: 'bar',
      nav: 'Bars',
      titleLight: 'Bars',
      titleDark: '& Lounges',
      label: 'Bars & Lounges',
      lead: 'Evenings with atmosphere. Soft glow, easy seating, and a bar line that looks as good as it works when the room fills up.',
      cta: 'Explore Bars',
      href: '/bar-lounge-interiors',
      spot: [36, 68],
    },
    {
      id: 'salon',
      nav: 'Salons',
      titleLight: 'Salons',
      titleDark: '& Wellness',
      label: 'Salons & Wellness',
      lead: 'Calm stations, clear flow, and finishes that stay fresh. Wellness spaces where clients relax and teams move with confidence.',
      cta: 'Explore Salons',
      href: '/salon-wellness-interiors',
      spot: [74, 68],
    },
    {
      id: 'full',
      nav: 'Full Venue',
      titleLight: 'Full',
      titleDark: 'Venue Interiors',
      label: 'Full Venue Interiors',
      lead: 'FOH and BOH planned together. One Mysuru team from concept to opening, so your venue feels ready on day one.',
      cta: 'Explore Hospitality',
      href: '/hospitality-interiors',
      spot: [50, 48],
    },
  ],
};

export const depthHeroBySlug: Record<string, DepthHeroHubConfig> = {
  [residentialDepthHero.slug]: residentialDepthHero,
  [commercialDepthHero.slug]: commercialDepthHero,
  [institutionalDepthHero.slug]: institutionalDepthHero,
  [hospitalityDepthHero.slug]: hospitalityDepthHero,
};

export function getDepthHeroHub(slug: string): DepthHeroHubConfig | undefined {
  return depthHeroBySlug[slug];
}
