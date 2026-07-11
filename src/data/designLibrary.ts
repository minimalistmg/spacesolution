import type { ImageMetadata } from 'astro';
import { heroImages, projectImages } from './images';

export interface DesignLibrarySection {
  label?: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  image?: ImageMetadata;
  reverse?: boolean;
}

export interface DesignLibraryGuide {
  slug: string;
  title: string;
  menuTitle: string;
  description: string;
  heroDescription: string;
  image: ImageMetadata;
  intro: string;
  sections: DesignLibrarySection[];
  highlights?: { title: string; items: string[] };
  mistakes?: { title: string; items: string[] };
  ctaLabel?: string;
}

export interface LibraryRoomTopic {
  title: string;
  slug: string;
}

export const designLibraryHub = {
  title: 'Design Library',
  heroDescription:
    'Practical guides for kitchens, materials, planning, and budgets — drawn from 15+ years and 800+ real projects across Karnataka.',
  intro:
    'Whether you are planning a modular kitchen, choosing finishes, or setting a renovation budget, these guides help you make confident decisions before you build.',
  trustLine: 'Written by the Space Solutions design team · Based on real project experience',
};

export const libraryRoomTopics: LibraryRoomTopic[] = [
  { title: 'Kitchen', slug: 'modular-kitchen-guide' },
  { title: 'Bedroom', slug: 'interior-styles' },
  { title: 'Living Room', slug: 'interior-styles' },
  { title: 'Full Home', slug: 'before-you-renovate' },
];

export const featuredGuideSlug = 'modular-kitchen-guide';

export function getGuideHref(slug: string): string {
  return `/design-library/${slug}`;
}

export function getGuideBySlug(slug: string): DesignLibraryGuide | undefined {
  return designLibraryGuides.find((guide) => guide.slug === slug);
}

export const designLibraryGuides: DesignLibraryGuide[] = [
  {
    slug: 'modular-kitchen-guide',
    title: 'Modular Kitchen Guide',
    menuTitle: 'Modular Kitchen Guide',
    description: 'Layouts, storage, and workflow for kitchens that work every day.',
    heroDescription:
      'Plan a modular kitchen with the right layout, storage, and finishes — before you commit to build.',
    image: projectImages.modularKitchen,
    intro:
      'A well-planned kitchen saves time every day. This guide covers layout types, the work triangle, storage priorities, and finish choices we use on real projects in Mysuru and across Karnataka.',
    sections: [
      {
        label: 'Layout Types',
        title: 'Choose a Layout That Fits Your Space',
        paragraphs: [
          'Kitchen layout is the first decision — it defines circulation, storage, and how comfortably you cook. Most Indian homes work best with L-shaped, U-shaped, parallel, or compact straight runs.',
        ],
        bullets: [
          'L-shaped — efficient for open plans and corner utility',
          'U-shaped — maximum counter and storage in larger kitchens',
          'Parallel — ideal for long, narrow galley-style spaces',
          'Island kitchens — best when room width allows free movement on all sides',
        ],
        image: heroImages.kitchen1,
      },
      {
        label: 'Work Triangle',
        title: 'Sink, Stove, and Fridge — Keep Movement Logical',
        paragraphs: [
          'The work triangle connects your three most-used zones. When distances are balanced, cooking feels effortless instead of cramped.',
        ],
        bullets: [
          'Keep the sink near the entry side for easy unloading',
          'Place the stove away from the main walkway',
          'Allow clear landing space beside the refrigerator',
          'Avoid placing the fridge directly beside the hob',
        ],
        image: heroImages.kitchen2,
        reverse: true,
      },
      {
        label: 'Storage',
        title: 'Design Storage for Daily Habits, Not Just Looks',
        paragraphs: [
          'Drawers beat deep shelves for daily utensils. Tall units and corner solutions recover space that is often wasted in standard layouts.',
        ],
        bullets: [
          'Base drawers for pots, pans, and daily essentials',
          'Tandem boxes and corner carousels for hard-to-reach areas',
          'Tall pantry units for groceries and small appliances',
          'Overhead shutters with lift-up or soft-close hardware',
        ],
        image: projectImages.modularKitchen,
      },
    ],
    highlights: {
      title: 'Kitchen Planning Checklist',
      items: [
        'Confirm chimney size and placement before finalizing wall units',
        'Plan water points and drainage before civil work closes',
        'Reserve space for RO unit, bin, and dishwasher if needed',
        'Choose handles or handle-less based on cleaning habits',
        'Request 3D views for wall runs and tall units before production',
      ],
    },
    mistakes: {
      title: 'Common Kitchen Mistakes We See on Site',
      items: [
        'Too many wall cabinets with no landing counter beside the hob',
        'Corner units left as dead storage without internal fittings',
        'Lighting planned only for the ceiling — under-cabinet light ignored',
        'Appliance sizes assumed instead of measured before cabinetry',
      ],
    },
    ctaLabel: 'Get a Kitchen Designed for Your Home',
  },
  {
    slug: 'materials-and-finishes',
    title: 'Material & Finish Guide',
    menuTitle: 'Materials & Finishes',
    description: 'Laminates, hardware, countertops, and what lasts in daily use.',
    heroDescription:
      'Understand finishes, cores, and hardware so your interiors look good and hold up for years.',
    image: heroImages.kitchen1,
    intro:
      'Material choices affect durability, maintenance, and how premium a space feels. This guide explains what we specify for kitchens, wardrobes, and living areas — and where it pays to invest.',
    sections: [
      {
        label: 'Carcass & Boards',
        title: 'Start With the Right Core',
        paragraphs: [
          'The board inside your shutters matters more than the outer finish. Moisture-resistant cores are essential for kitchens and utility areas.',
        ],
        bullets: [
          'BWP / MR-grade plywood or quality HDHMR for wet zones',
          'Calibrated boards for consistent shutter alignment',
          'Edge banding on all exposed sides to limit swelling',
          'Factory drilling for hinges improves long-term alignment',
        ],
        image: projectImages.homeInterior3,
      },
      {
        label: 'Surface Finishes',
        title: 'Laminates, Acrylic, and Veneer — When to Use What',
        paragraphs: [
          'Each finish has a role. We match the material to traffic, cleaning frequency, and the visual tone you want.',
        ],
        bullets: [
          'Laminates — versatile, cost-effective, wide colour range',
          'Acrylic — high-gloss, smooth, popular for modern kitchens',
          'Veneer — warm, natural grain for living and bedroom panels',
          'Quartz / stone — durable, premium countertops for kitchens',
        ],
        image: heroImages.bedroom,
        reverse: true,
      },
      {
        label: 'Hardware',
        title: 'Hinges, Runners, and Handles',
        paragraphs: [
          'Hardware is felt every day. Soft-close hinges and full-extension drawers are small upgrades with a large impact on usability.',
        ],
        bullets: [
          'Soft-close hinges reduce noise and shutter slam',
          'Full-extension drawer runners improve access to depth',
          'Handle profiles should match grip and cleaning preference',
          'Lift-up systems for overhead units in compact kitchens',
        ],
        image: heroImages.kitchen2,
      },
    ],
    highlights: {
      title: 'Finish Selection Quick Guide',
      items: [
        'Kitchen shutters — moisture-resistant core + easy-clean finish',
        'Wardrobes — laminate or veneer based on budget and tone',
        'TV units — veneer or PU for a refined living room look',
        'Hardware — prioritize runners and hinges over decorative add-ons',
      ],
    },
    ctaLabel: 'Discuss Materials for Your Project',
  },
  {
    slug: 'space-planning',
    title: 'Space Planning Basics',
    menuTitle: 'Space Planning',
    description: 'Measurements, circulation, and zoning for usable rooms.',
    heroDescription:
      'Plan rooms that breathe — with clear movement paths, balanced furniture, and storage that stays out of the way.',
    image: heroImages.bedroom,
    intro:
      'Good interiors start with how a room works. Space planning balances furniture scale, walkways, storage, and light before any finishing detail is chosen.',
    sections: [
      {
        label: 'Measure First',
        title: 'Work From Accurate Dimensions',
        paragraphs: [
          'Design decisions should come from measured drawings, not assumptions. Even small errors in wall length or window height affect furniture and wardrobe sizing.',
        ],
        bullets: [
          'Record ceiling height, beam drops, and column positions',
          'Mark door swing direction and window sill heights',
          'Note switch, socket, and AC point locations early',
          'Photograph the bare space before civil changes begin',
        ],
        image: projectImages.homeInterior3,
      },
      {
        label: 'Circulation',
        title: 'Keep Walkways Clear and Predictable',
        paragraphs: [
          'Circulation paths should feel natural. When furniture blocks movement, a room reads smaller regardless of actual square footage.',
        ],
        bullets: [
          'Allow 90 cm+ paths in main walking routes where possible',
          'Keep seating layouts conversational, not pushed to walls only',
          'Align storage to unused walls rather than window zones',
          'Separate dry and wet zones clearly in kitchens and utilities',
        ],
        image: heroImages.kitchen1,
        reverse: true,
      },
      {
        label: 'Zoning',
        title: 'Group Functions, Not Just Furniture',
        paragraphs: [
          'Zoning helps families use a home comfortably — work, rest, storage, and display each get a defined place.',
        ],
        bullets: [
          'Living — seating, media, and display in one visual cluster',
          'Bedroom — sleep zone separate from dressing and storage',
          'Entry — shoe, bag, and mirror points near the door',
          'Kids / study — daylight and quiet corners prioritized',
        ],
        image: heroImages.bedroom,
      },
    ],
    highlights: {
      title: 'Space Planning Checklist',
      items: [
        'Furniture layout approved before electrical finalization',
        'Wardrobe depth checked against bed clearance',
        'TV viewing distance matched to wall width',
        'Storage mapped to daily habits, not generic templates',
      ],
    },
    ctaLabel: 'Plan Your Space With Our Team',
  },
  {
    slug: 'interior-styles',
    title: 'Interior Styles Explained',
    menuTitle: 'Interior Styles',
    description: 'Modern, contemporary, traditional, and minimal — what fits your home.',
    heroDescription:
      'Find a style direction that matches your taste, lifestyle, and the architecture of your home.',
    image: projectImages.homeInterior3,
    intro:
      'Style is more than a Pinterest board — it is how colours, materials, and furniture work together over time. These are the directions we help clients choose between most often.',
    sections: [
      {
        label: 'Modern',
        title: 'Clean Lines and Controlled Palettes',
        paragraphs: [
          'Modern interiors favour clarity — flat panels, integrated storage, and a restrained colour story with one or two accent materials.',
        ],
        bullets: [
          'Handle-less or slim-profile shutters',
          'Neutral bases with one bold accent wall or island',
          'Recessed or linear lighting',
          'Minimal open shelving',
        ],
        image: heroImages.kitchen2,
      },
      {
        label: 'Contemporary',
        title: 'Warm, Current, and Livable',
        paragraphs: [
          'Contemporary design mixes modern function with softer textures — wood tones, fabric seating, and layered lighting.',
        ],
        bullets: [
          'Mixed materials: wood, stone, metal, and fabric',
          'Comfort-first furniture sizing',
          'Feature walls with paneling or veneer',
          'Flexible layouts for family use',
        ],
        image: heroImages.bedroom,
        reverse: true,
      },
      {
        label: 'Traditional & Minimal',
        title: 'Two Ends of the Spectrum',
        paragraphs: [
          'Traditional interiors lean on mouldings, richer tones, and classic proportions. Minimal spaces reduce visual noise and maximize calm.',
        ],
        bullets: [
          'Traditional — paneling, classic hardware, warmer palettes',
          'Minimal — hidden storage, fewer colours, flush surfaces',
          'Both need careful lighting to avoid feeling flat or heavy',
          'Choose based on architecture, not trend alone',
        ],
        image: projectImages.modularKitchen,
      },
    ],
    highlights: {
      title: 'How to Pick a Direction',
      items: [
        'Collect 5–10 reference images, then look for repeating themes',
        'Match style to maintenance comfort (gloss vs matte, open vs closed)',
        'Keep flooring and main walls consistent across connected rooms',
        'Use one hero material per room instead of mixing many',
      ],
    },
    ctaLabel: 'Find Your Interior Style With Us',
  },
  {
    slug: 'budget-planning',
    title: 'Budget Planning for Interiors',
    menuTitle: 'Budget Planning',
    description: 'Realistic ranges and where to invest first in your home.',
    heroDescription:
      'Plan interior costs with clarity — what drives price, where to prioritize, and how to phase work sensibly.',
    image: heroImages.kitchen1,
    intro:
      'Budget conversations work best when scope is clear. This guide explains the main cost drivers on interior projects and how to allocate spend for the best long-term result.',
    sections: [
      {
        label: 'Cost Drivers',
        title: 'What Actually Moves the Number',
        paragraphs: [
          'Price follows scope — room count, material tier, hardware, and complexity of services all affect the final estimate more than small decorative choices.',
        ],
        bullets: [
          'Modular scope — kitchen, wardrobes, TV unit, study, etc.',
          'Material and finish tier across shutters and panels',
          'Hardware quality — hinges, runners, lift systems',
          'Services — electrical, false ceiling, painting, civil tweaks',
        ],
        image: projectImages.modularKitchen,
      },
      {
        label: 'Prioritize',
        title: 'Invest Where Daily Use Is Highest',
        paragraphs: [
          'Kitchens, wardrobes, and bathrooms deliver the most daily value. Decorative elements can follow once core utility is resolved.',
        ],
        bullets: [
          'Kitchen carcass and hardware before purely decorative extras',
          'Wardrobe internals before external feature cladding',
          'Lighting plan early — cheaper to wire before closing surfaces',
          'Appliances and sizes confirmed before final cabinetry drawings',
        ],
        image: heroImages.bedroom,
        reverse: true,
      },
      {
        label: 'Phasing',
        title: 'Split Work Without Losing Cohesion',
        paragraphs: [
          'Phased execution can help cash flow when the design language is fixed upfront. Colour, handle style, and panel profiles should be locked in phase one.',
        ],
        bullets: [
          'Phase 1 — kitchen + master wardrobe + electrical basics',
          'Phase 2 — living, guest bedroom, and remaining storage',
          'Phase 3 — decorative walls, loose furniture, and styling',
          'Keep one material palette across phases for visual continuity',
        ],
        image: projectImages.homeInterior3,
      },
    ],
    highlights: {
      title: 'Before You Request a Quote',
      items: [
        'List rooms to be covered and must-have items',
        'Share floor plan or rough dimensions if available',
        'Note move-in timeline and any hard deadlines',
        'Mention finish preference — laminate, acrylic, veneer, etc.',
      ],
    },
    ctaLabel: 'Get a Clear Project Estimate',
  },
  {
    slug: 'before-you-renovate',
    title: 'Before You Renovate',
    menuTitle: 'Before You Renovate',
    description: 'Timeline, approvals, and a practical handover checklist.',
    heroDescription:
      'Prepare for a smoother renovation — from timeline expectations to final handover.',
    image: heroImages.kitchen2,
    intro:
      'Renovation runs better when expectations are set early. Use this guide to plan timelines, coordinate trades, and know what a proper handover should include.',
    sections: [
      {
        label: 'Timeline',
        title: 'What Happens, and in What Order',
        paragraphs: [
          'Interior projects move through design, production, and site installation. Skipping steps in design usually costs time later on site.',
        ],
        bullets: [
          'Design & approval — layouts, 3D views, material selections',
          'Production — factory manufacturing after sign-off',
          'Site readiness — civil, electrical, and painting prerequisites',
          'Installation & handover — fitting, punch-list, and final checks',
        ],
        image: heroImages.kitchen1,
      },
      {
        label: 'Site Readiness',
        title: 'Get the Space Ready Before Install Teams Arrive',
        paragraphs: [
          'Installation quality depends on the condition of walls, floors, and services. Small civil fixes are easier before cabinetry arrives.',
        ],
        bullets: [
          'Complete waterproofing and tile work in wet areas first',
          'Finalize electrical points based on approved layouts',
          'Ensure floors are level where modular units will sit',
          'Clear storage space for material delivery and assembly',
        ],
        image: projectImages.homeInterior3,
        reverse: true,
      },
      {
        label: 'Handover',
        title: 'What a Proper Close-Out Looks Like',
        paragraphs: [
          'Handover is more than installation — it includes alignment checks, hardware tuning, and clarity on care and warranty.',
        ],
        bullets: [
          'Shutter alignment and soft-close adjustment on site',
          'Snag list closed before final payment',
          'Care instructions for finishes and hardware',
          'Warranty terms documented for modular scope',
        ],
        image: heroImages.bedroom,
      },
    ],
    highlights: {
      title: 'Pre-Renovation Checklist',
      items: [
        'Approved layout saved and shared with all trades',
        'Material selections signed off in writing',
        'Move-out or room-clear plan for install dates',
        'Single point of contact for site decisions',
      ],
    },
    mistakes: {
      title: 'Delays We Help Clients Avoid',
      items: [
        'Changing layout after production drawings are released',
        'Appliance models selected after kitchen carcass is built',
        'Painting schedule conflicting with modular installation',
        'Multiple decision-makers giving conflicting site instructions',
      ],
    },
    ctaLabel: 'Start Your Renovation the Right Way',
  },
];
