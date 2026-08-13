import type { ImageMetadata } from 'astro';
import type { ServiceActivePage, ServiceGalleryHero, ServiceVistaHero } from './servicePages';
import { l2HeroImages } from './images';

const PROJECTS = '/portfolio';

function flank(
  src: ImageMetadata,
  headline: string,
  lead: string,
  primaryCta: string,
  alts: [string, string, string],
  positions: [string, string, string]
): ServiceGalleryHero {
  return {
    headline,
    lead,
    primaryCta,
    secondaryCta: 'Explore Our Projects',
    secondaryHref: PROJECTS,
    images: [
      { src, alt: alts[0], position: positions[0] },
      { src, alt: alts[1], position: positions[1] },
      { src, alt: alts[2], position: positions[2] },
    ],
  };
}

function vista(
  src: ImageMetadata,
  headline: string,
  kicker: string,
  description: string,
  statValue: string,
  statLabel: string,
  alt: string,
  category: ServiceActivePage
): ServiceVistaHero {
  return {
    headline,
    kicker,
    description,
    statValue,
    statLabel,
    category,
    image: { src, alt },
  };
}

/** Tall-flank editorial hero — same project cropped left / full / right. */
export const l2FlankHeroes: Record<string, ServiceGalleryHero> = {
  'modular-kitchen': flank(
    l2HeroImages.kitchen,
    'Modular Kitchens.',
    'Space Solution combines layouts, natural materials, and craftsmanship for timeless, functional kitchens.',
    'Plan Your Dream Kitchen',
    [
      'Oak tall units and integrated ovens in a light modular kitchen',
      'Full view of a cream and oak L-shaped modular kitchen',
      'Window-side sink run with open organised drawers',
    ],
    ['12% 50%', '50% 50%', '88% 48%']
  ),
  'wardrobes-storage': flank(
    l2HeroImages.wardrobes,
    'Wardrobes.',
    'Floor-to-ceiling storage tailored to how you dress, fold, and put things away.',
    'Plan Your Storage',
    [
      'Open wardrobe internals with hanging rails and shelves',
      'Full bedroom view with a custom pale-oak wardrobe wall',
      'Sliding oak wardrobe doors and a dressing bench',
    ],
    ['14% 50%', '50% 50%', '86% 50%']
  ),
  bedrooms: flank(
    l2HeroImages.bedrooms,
    'Bedrooms.',
    'Private retreats with smart storage, calm finishes, and light that lasts the day.',
    'Plan Your Bedroom',
    [
      'Bedroom corner with a pale-oak nightstand and brass reading lamp',
      'Full light bedroom with bed, wardrobe wall, and sheer curtains',
      'Floor-to-ceiling slatted oak wardrobe in a cream bedroom',
    ],
    ['16% 50%', '48% 50%', '86% 48%']
  ),
  'pooja-room': flank(
    l2HeroImages.pooja,
    'Pooja Rooms.',
    'Dedicated spiritual spaces with respectful proportions, oak jali, and quiet light.',
    'Plan Your Pooja Room',
    [
      'Tall oak jali lattice panel with soft backlight',
      'Full pooja room with marble altar, brass lamps, and flowers',
      'Matching jali panel and daylight at the prayer room window',
    ],
    ['16% 50%', '50% 50%', '84% 50%']
  ),
  'retail-interiors': flank(
    l2HeroImages.retail,
    'Retail Spaces.',
    'Showrooms that guide customers, hold product, and feel calm under daylight.',
    'Plan Your Showroom',
    [
      'Boutique window display with an olive tree and clothing rail',
      'Full retail interior with a central oak display table',
      'Floor-to-ceiling recessed shelves with ceramics and linen',
    ],
    ['14% 50%', '50% 50%', '86% 50%']
  ),
  'hostel-furniture': flank(
    l2HeroImages.hostel,
    'Hostel Furniture.',
    'Space-efficient bunks, desks, and wardrobes built for shared student living.',
    'Plan Hostel Furniture',
    [
      'Built-in pale-birch bunk beds with ladders and drawers',
      'Full hostel room looking toward the window',
      'Study desk, lit shelf, and floor-to-ceiling wardrobe',
    ],
    ['16% 50%', '50% 50%', '86% 50%']
  ),
  'library-lab-interiors': flank(
    l2HeroImages.library,
    'Libraries & Labs.',
    'Specialist furniture for reading, research, and practical learning — built to last.',
    'Plan Your Lab',
    [
      'Daylit window wall with plants and a sink island',
      'Full library-lab aisle with parallel work islands',
      'Floor-to-ceiling open shelving for books and glassware',
    ],
    ['16% 50%', '50% 50%', '86% 48%']
  ),
  'bar-lounge-interiors': flank(
    l2HeroImages.bar,
    'Bars & Lounges.',
    'Daylit hospitality bars with a strong back, a calm lounge, and easy service flow.',
    'Plan Your Lounge',
    [
      'Back-bar oak shelves with backlit glassware',
      'Full cream bar with stone counter and lounge beyond',
      'Sunlit lounge seating with cream chairs',
    ],
    ['14% 50%', '48% 50%', '86% 50%']
  ),
  'salon-wellness-interiors': flank(
    l2HeroImages.salon,
    'Salons.',
    'Calm, premium rooms for beauty and wellness — stations, product, and treatment in one language.',
    'Plan Your Salon',
    [
      'Styling station with a round mirror and cream salon chair',
      'Full salon looking toward the treatment room',
      'Recessed oak product shelves and a waiting armchair',
    ],
    ['16% 50%', '50% 50%', '86% 50%']
  ),
};

/** Full-bleed lifestyle hero — headline over the still, proof bar along the wash. */
export const l2VistaHeroes: Record<string, ServiceVistaHero> = {
  'living-dining': vista(
    l2HeroImages.living,
    'Elevate your\neveryday living',
    'Inspired interiors, designed for living',
    'We plan living and dining as one volume — seating, storage, and light finished for how the family actually uses the room.',
    '800+',
    'Homes delivered',
    'Open-plan living and dining with pale oak table, cream chairs, and a linen sofa',
    'home-interiors'
  ),
  'full-home-interiors': vista(
    l2HeroImages.fullhome,
    'One language\nfor the whole home',
    'Turnkey homes, kitchen to bedroom',
    'A single design language across kitchen, wardrobes, living, and bedrooms — one team from drawing to handover.',
    '800+',
    'Homes delivered',
    'Full-home interior with living, kitchen opening, and a hallway of tall oak wardrobes',
    'home-interiors'
  ),
  'office-interiors': vista(
    l2HeroImages.office,
    'Workplaces made\nto stay clear',
    'Workplaces designed to perform',
    'We fit offices for focus, meetings, and growth — joinery, lighting, and layout under one accountable team.',
    '15+',
    'Years of fitouts',
    'Bright conference room with a pale oak table, cream chairs, and glass partitions',
    'commercial'
  ),
  'admin-office-interiors': vista(
    l2HeroImages.admin,
    'Staff rooms built\nfor daily use',
    'Campus offices, built to last',
    'Registrar and staff rooms planned for daily institutional use — durable desks, storage, and clear circulation.',
    '15+',
    'Years on campus',
    'Bright admin office with pale oak workstations, filing, and a small meeting table',
    'institutional'
  ),
  'clinic-interiors': vista(
    l2HeroImages.clinic,
    'Clinics that feel\ncalm on arrival',
    'Calm clinics, clear circulation',
    'Reception, waiting, and consult rooms planned so patients feel settled and staff can move without friction.',
    '15+',
    'Years in Mysuru',
    'Bright clinic reception with a curved oak desk and a cream waiting area',
    'commercial'
  ),
  'coworking-interiors': vista(
    l2HeroImages.coworking,
    'Shared rooms\nthat still focus',
    'Flexible rooms for shared work',
    'Booths, lounges, and communal tables planned for teams that need both quiet and a place to gather.',
    '15+',
    'Years of fitouts',
    'Bright coworking lounge with a communal oak table, cream seating, and arched booths',
    'commercial'
  ),
  'school-interiors': vista(
    l2HeroImages.school,
    'Classrooms built\nto last the day',
    'Furniture for daily teaching',
    'Desks, storage, and layouts specified for real classroom use — durable, light, and easy to keep in order.',
    '15+',
    'Years on campus',
    'Bright classroom with pale birch desks in rows and a window wall of daylight',
    'institutional'
  ),
  'cafe-restaurant-interiors': vista(
    l2HeroImages.cafe,
    'Rooms guests\nwant to stay in',
    'Atmosphere and service in balance',
    'We plan cafés from the first table to the pass — seating, counters, and kitchen flow finished for opening day.',
    '15+',
    'Years of openings',
    'Bright café dining room with pale oak tables, cane chairs, and an open kitchen beyond',
    'hospitality'
  ),
  'hotel-interiors': vista(
    l2HeroImages.hotel,
    'Lobbies ready\nfor opening day',
    'Guest rooms, ready to receive',
    'A full-service interior studio for hotels and resorts — lobby, lounge, and guest-facing rooms under one finish.',
    '15+',
    'Years of openings',
    'Bright boutique hotel lobby with cream lounge seating and an oak reception desk',
    'hospitality'
  ),
};

export function getL2FlankHero(slug: string): ServiceGalleryHero | undefined {
  return l2FlankHeroes[slug];
}

export function getL2VistaHero(slug: string): ServiceVistaHero | undefined {
  return l2VistaHeroes[slug];
}
