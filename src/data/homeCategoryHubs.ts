import type { ImageMetadata } from 'astro';
import type { MenuIconName } from './headerMenuIcons';
import { heroImages, hubRoomImages, l2HeroImages, roomImages } from './images';
import { mainNavPanels } from './mainNav';
import { projects } from './projects';

const CATEGORY_PANEL_IDS = ['home', 'commercial', 'institutional', 'hospitality'] as const;

const panelImages: Record<(typeof CATEGORY_PANEL_IDS)[number], ImageMetadata> = {
  home: heroImages.residential,
  commercial: heroImages.commercial,
  institutional: heroImages.institutional,
  hospitality: heroImages.hospitality,
};

const PROJECTS_HEADING: Record<(typeof CATEGORY_PANEL_IDS)[number], string> = {
  home: 'Latest projects',
  commercial: 'Latest projects',
  institutional: 'Latest projects',
  hospitality: 'Latest projects',
};

const RESOURCES_HEADING: Record<(typeof CATEGORY_PANEL_IDS)[number], string> = {
  home: 'Residential tools and guides',
  commercial: 'Commercial tools and guides',
  institutional: 'Institutional tools and guides',
  hospitality: 'Hospitality tools and guides',
};

const spaceImages: Record<string, ImageMetadata> = {
  '/modular-kitchen': roomImages.modularKitchen,
  '/wardrobes-storage': l2HeroImages.wardrobes,
  '/living-dining': roomImages.livingDining,
  '/bedrooms': roomImages.bedroom,
  '/pooja-room': roomImages.pooja,
  '/full-home-interiors': roomImages.fullHome,
  '/office-interiors': roomImages.office,
  '/clinic-interiors': roomImages.clinic,
  '/retail-interiors': roomImages.retail,
  '/coworking-interiors': l2HeroImages.coworking,
  '/school-interiors': roomImages.classroom,
  '/hostel-furniture': roomImages.hostel,
  '/library-lab-interiors': roomImages.libraryLab,
  '/admin-office-interiors': l2HeroImages.admin,
  '/cafe-restaurant-interiors': roomImages.cafe,
  '/hotel-interiors': roomImages.hotel,
  '/bar-lounge-interiors': roomImages.bar,
  '/salon-wellness-interiors': roomImages.salon,
};

export interface HomeCategoryHub {
  id: string;
  label: string;
  hubHref: string;
  title: string;
  description: string;
  icon: MenuIconName;
  image: ImageMetadata;
  spacesHeading: string;
  spaces: { label: string; href: string; icon: MenuIconName; image: ImageMetadata }[];
  projectsHeading: string;
  resourcesHeading: string;
  projects: { label: string; href: string; image: ImageMetadata }[];
  tools: { label: string; href: string }[];
  guides: { label: string; href: string }[];
  turnkey?: { label: string; href: string };
}

export function getHomeCategoryHubs(): HomeCategoryHub[] {
  return CATEGORY_PANEL_IDS.map((id) => {
    const panel = mainNavPanels.find((entry) => entry.id === id);
    if (!panel) {
      throw new Error(`Missing main nav panel: ${id}`);
    }

    const spacesSection = panel.sections[0];
    const projectsSection = panel.sections.find((section) => section.heading === 'Projects');
    const turnkeySection = panel.sections.find((section) => section.heading === 'Turnkey');

    return {
      id: panel.id,
      label: panel.label,
      hubHref: panel.hubHref,
      title: panel.featured.title,
      description: panel.featured.description,
      icon: panel.featured.icon,
      image: panelImages[id],
      spacesHeading: spacesSection.heading,
      spaces: spacesSection.items.map(({ label, href, icon }) => {
        const image = spaceImages[href];
        if (!image) {
          throw new Error(`Missing category band image for ${href}`);
        }
        return { label, href, icon, image };
      }),
      projectsHeading: PROJECTS_HEADING[id],
      resourcesHeading: RESOURCES_HEADING[id],
      projects: (projectsSection?.items ?? []).slice(0, 3).map(({ label, href }) => {
        const match = projects.find((entry) => entry.href === href);
        const image = match?.images[0]?.src;
        if (!image) {
          throw new Error(`Missing project image for ${href}`);
        }
        return { label, href, image };
      }),
      tools: (panel.toolsBand?.items ?? []).slice(0, 3).map(({ label, href }) => ({ label, href })),
      guides: (panel.footerBand?.items ?? []).slice(0, 3).map(({ label, href }) => ({ label, href })),
      turnkey: turnkeySection?.items[0],
    };
  });
}

export type HubRoomBandCopy = {
  lead: string;
  cta: string;
  bullets: string[];
  images: ImageMetadata[];
};

/** Copy and 3-image sets for residential L1 room bands. */
export const hubRoomBandCopy: Record<string, HubRoomBandCopy> = {
  '/modular-kitchen': {
    lead: 'Layouts and storage built for how you cook every day.',
    cta: 'Explore Kitchen',
    bullets: [
      'L-shaped, U-shaped, parallel, and island layouts',
      'Tandem drawers and tall pantry units',
      'Acrylic, laminate, and BWP boards for Indian cooking',
      'Factory-made cabinets, installed in Mysuru',
    ],
    images: hubRoomImages.kitchen,
  },
  '/wardrobes-storage': {
    lead: 'Closets and storage systems that stay calm and organised.',
    cta: 'Explore Wardrobes',
    bullets: [
      'Sliding, hinged, walk-in, and loft systems',
      'Internals for hanging, folding, shoes, and accessories',
      'Floor-to-ceiling storage sized to your room',
      'Factory carcasses, aligned on site',
    ],
    images: hubRoomImages.wardrobes,
  },
  '/living-dining': {
    lead: 'Seating, flow, and lighting for the heart of the home.',
    cta: 'Explore Living',
    bullets: [
      'Custom TV units and display niches',
      'Seating, dining storage, and clear circulation',
      'Layered lighting for day to evening',
      'Joinery that can match kitchen and bedrooms',
    ],
    images: hubRoomImages.living,
  },
  '/bedrooms': {
    lead: 'Restful suites with storage beds and soft finishes.',
    cta: 'Explore Bedrooms',
    bullets: [
      'Hydraulic storage beds and calm palettes',
      'Headboards with bedside storage',
      'Master, kids, and guest rooms in one language',
      'Wardrobes and vanity units from our factory',
    ],
    images: hubRoomImages.bedrooms,
  },
  '/pooja-room': {
    lead: 'Quiet mandir spaces with warm timber and clean light.',
    cta: 'Explore Pooja',
    bullets: [
      'Wall-mounted and floor-standing mandirs',
      'Teak, Corian, and laminate options',
      'Diya shelves and closed storage for puja items',
      'Compact niches or a dedicated room',
    ],
    images: hubRoomImages.pooja,
  },
  '/full-home-interiors': {
    lead: 'One design language from kitchen to bedrooms. Turnkey.',
    cta: 'Explore Full Home',
    bullets: [
      'Kitchen, wardrobes, living, bedrooms, and pooja',
      'One design language and one timeline',
      'Factory joinery consistent from room to room',
      'Single Mysuru team from 3D to handover',
    ],
    images: hubRoomImages.fullHome,
  },
  '/office-interiors': {
    lead: 'Workstations, cabins, and meeting rooms built for real workdays.',
    cta: 'Explore Office',
    bullets: [
      'Workstations and executive cabins',
      'Glass partitions and meeting rooms',
      'Hybrid zones for focus and collaboration',
      'Factory joinery, installed in Mysuru',
    ],
    images: hubRoomImages.office,
  },
  '/clinic-interiors': {
    lead: 'Calm care spaces for patients, with storage and flow for staff.',
    cta: 'Explore Clinics',
    bullets: [
      'Reception, waiting, and consultation rooms',
      'Hygiene-focused surfaces and storage',
      'Clear circulation for staff workflow',
      'Procedure rooms planned with the rest of the floor',
    ],
    images: hubRoomImages.clinic,
  },
  '/retail-interiors': {
    lead: 'Showrooms that map the customer journey and keep product in view.',
    cta: 'Explore Retail',
    bullets: [
      'Boutique and flagship showroom layouts',
      'Display units and product lighting',
      'Circulation that increases dwell time',
      'Durable finishes for high footfall',
    ],
    images: hubRoomImages.retail,
  },
  '/coworking-interiors': {
    lead: 'Shared floors with private cabins, hot desks, and meeting rooms.',
    cta: 'Explore Co-working',
    bullets: [
      'Hot desks and dedicated desks',
      'Phone booths and meeting rooms',
      'Brand-ready reception and pantry',
      'Modular furniture that can reconfigure',
    ],
    images: hubRoomImages.coworking,
  },
  '/school-interiors': {
    lead: 'Classroom sets built for every day of the academic year.',
    cta: 'Explore Schools',
    bullets: [
      'Standard and custom classroom desks',
      'Staffroom and admin furniture',
      'Easy-clean finishes for facility teams',
      'Volume orders from our Mysuru factory',
    ],
    images: hubRoomImages.school,
  },
  '/hostel-furniture': {
    lead: 'Beds, lockers, and study units for shared student living.',
    cta: 'Explore Hostels',
    bullets: [
      'Single beds, bunks, and dorm layouts',
      'Wardrobes, lockers, and study units',
      'Space-efficient rooms without crowding',
      'Durable hardware for high occupancy',
    ],
    images: hubRoomImages.hostel,
  },
  '/library-lab-interiors': {
    lead: 'Shelving, reading tables, and lab benches sized for campus use.',
    cta: 'Explore Libraries',
    bullets: [
      'Library shelving and reading tables',
      'Laboratory benches and storage',
      'Quiet zones with clear circulation',
      'Furniture specified for continuous use',
    ],
    images: hubRoomImages.library,
  },
  '/admin-office-interiors': {
    lead: 'Staff offices that keep campus administration calm and efficient.',
    cta: 'Explore Admin',
    bullets: [
      'Workstations and file storage',
      'Meeting rooms for faculty and admin',
      'Finishes that match classroom programmes',
      'Factory furniture, aligned on site',
    ],
    images: hubRoomImages.admin,
  },
  '/cafe-restaurant-interiors': {
    lead: 'Seating, counters, and service flow from front of house to kitchen.',
    cta: 'Explore Cafés',
    bullets: [
      'Guest seating and table layouts',
      'Counters, display, and service runs',
      'Kitchen and back-of-house coordination',
      'Durable finishes for daily F&B use',
    ],
    images: hubRoomImages.cafe,
  },
  '/hotel-interiors': {
    lead: 'One guest language from lobby to room, ready for opening day.',
    cta: 'Explore Hotels',
    bullets: [
      'Reception, lounge, and lobby seating',
      'Guest-room furniture and wardrobes',
      'Amenity spaces with coordinated finishes',
      'One timeline from design to handover',
    ],
    images: hubRoomImages.hotel,
  },
  '/bar-lounge-interiors': {
    lead: 'Counters, seating, and lighting for evenings that run long.',
    cta: 'Explore Bars',
    bullets: [
      'Bar counters and bottle display',
      'Lounge seating and booth layouts',
      'Lighting planned for day to late night',
      'Materials that handle spills and footfall',
    ],
    images: hubRoomImages.bar,
  },
  '/salon-wellness-interiors': {
    lead: 'Stations, waiting, and storage for salons and wellness rooms.',
    cta: 'Explore Salons',
    bullets: [
      'Styling stations and mirrors',
      'Waiting lounge and reception',
      'Treatment rooms with calm finishes',
      'Wet-area and storage coordination',
    ],
    images: hubRoomImages.salon,
  },
};

export interface HomeStripLink {
  label: string;
  href: string;
  category: string;
}

/** Planning tools from one category mega menu. */
export function getHubTools(hubId: string): HomeStripLink[] {
  const panel = mainNavPanels.find((entry) => entry.id === hubId);
  if (!panel?.toolsBand) return [];
  return panel.toolsBand.items.map((item) => ({
    label: item.label,
    href: item.href,
    category: panel.label,
  }));
}

/** Guides from one category mega menu. */
export function getHubGuides(hubId: string): HomeStripLink[] {
  const panel = mainNavPanels.find((entry) => entry.id === hubId);
  if (!panel?.footerBand) return [];
  return panel.footerBand.items.map((item) => ({
    label: item.label,
    href: item.href,
    category: panel.label,
  }));
}

/** All planning tools from category mega menus - for the home tools strip. */
export function getAllHomeTools(): HomeStripLink[] {
  return CATEGORY_PANEL_IDS.flatMap((id) => {
    const panel = mainNavPanels.find((entry) => entry.id === id);
    if (!panel?.toolsBand) return [];
    return panel.toolsBand.items.map((item) => ({
      label: item.label,
      href: item.href,
      category: panel.label,
    }));
  });
}

/** Unique guides from category mega menus - for the home guides strip. */
export function getAllHomeGuides(): HomeStripLink[] {
  const seen = new Set<string>();
  const links: HomeStripLink[] = [];

  for (const id of CATEGORY_PANEL_IDS) {
    const panel = mainNavPanels.find((entry) => entry.id === id);
    if (!panel?.footerBand) continue;

    for (const item of panel.footerBand.items) {
      if (seen.has(item.href)) continue;
      seen.add(item.href);
      links.push({
        label: item.label,
        href: item.href,
        category: panel.label,
      });
    }
  }

  return links;
}
