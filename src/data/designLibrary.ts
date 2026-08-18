import type { ImageMetadata } from 'astro';
import {
  heroImages,
  projectImages,
  roomImages,
  studioImages,
} from './images';

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
  gallery?: { src: ImageMetadata; alt: string; caption?: string }[];
  galleryTitle?: string;
  galleryDescription?: string;
  faqs?: { question: string; answer: string }[];
  faqTitle?: string;
  faqDescription?: string;
}

export interface LibraryRoomTopic {
  title: string;
  slug: string;
}

export const designLibraryHub = {
  title: 'Design Library',
  heroDescription:
    'Practical guides for kitchens, materials, planning, and budgets - drawn from 15+ years and 800+ real projects across Karnataka.',
  intro:
    'Whether you are planning a modular kitchen, choosing finishes, or setting a renovation budget, these guides help you make confident decisions before you build.',
  trustLine: 'Written by the Space Solution design team · Based on real project experience',
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
      'Plan a modular kitchen with the right layout, storage, and finishes - before you commit to build.',
    image: roomImages.modularKitchen,
    intro:
      'A well-planned kitchen saves time every day. This guide covers layout types, the work triangle, storage priorities, and finish choices we use on real projects in Mysuru and across Karnataka. Use it before you finalize drawings so production starts from a kitchen that already works for how you cook - not only how it looks in a render.',
    sections: [
      {
        label: 'Layout Types',
        title: 'Choose a Layout That Fits Your Space',
        paragraphs: [
          'Kitchen layout is the first decision - it defines circulation, storage, and how comfortably you cook. Most Indian homes work best with L-shaped, U-shaped, parallel, or compact straight runs.',
          'Open-plan apartments often prefer an L-shape that keeps the dining view clear. Narrow utility-linked kitchens may need a parallel run with a disciplined work triangle. Island layouts only succeed when there is true walking clearance on all sides - otherwise the island becomes an obstacle.',
        ],
        bullets: [
          'L-shaped - efficient for open plans and corner utility',
          'U-shaped - maximum counter and storage in larger kitchens',
          'Parallel - ideal for long, narrow galley-style spaces',
          'Island kitchens - best when room width allows free movement on all sides',
        ],
        image: roomImages.modularKitchen,
      },
      {
        label: 'Work Triangle',
        title: 'Sink, Stove, and Fridge - Keep Movement Logical',
        paragraphs: [
          'The work triangle connects your three most-used zones. When distances are balanced, cooking feels effortless instead of cramped.',
          'In Indian kitchens, also plan for the mixer, RO, and bin - these “fourth points” matter as much as the classic triangle. Landing space beside the hob and fridge prevents hot pans and grocery bags from fighting for the same counter.',
        ],
        bullets: [
          'Keep the sink near the entry side for easy unloading',
          'Place the stove away from the main walkway',
          'Allow clear landing space beside the refrigerator',
          'Avoid placing the fridge directly beside the hob',
        ],
        image: roomImages.fullHome,
        reverse: true,
      },
      {
        label: 'Storage',
        title: 'Design Storage for Daily Habits, Not Just Looks',
        paragraphs: [
          'Drawers beat deep shelves for daily utensils. Tall units and corner solution recover space that is often wasted in standard layouts.',
          'Map groceries, vessels, and small appliances before you approve shutters. A beautiful kitchen that forces deep crouching for daily items will frustrate you within a week. Soft-close hardware and full-extension runners are not luxuries - they are what make modular storage feel finished.',
        ],
        bullets: [
          'Base drawers for pots, pans, and daily essentials',
          'Tandem boxes and corner carousels for hard-to-reach areas',
          'Tall pantry units for groceries and small appliances',
          'Overhead shutters with lift-up or soft-close hardware',
        ],
        image: projectImages.apartment,
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
        'Lighting planned only for the ceiling - under-cabinet light ignored',
        'Appliance sizes assumed instead of measured before cabinetry',
      ],
    },
    gallery: [
      { src: roomImages.modularKitchen, alt: 'Light modular kitchen', caption: 'Modular kitchen' },
      { src: roomImages.livingDining, alt: 'Kitchen opening to dining', caption: 'Open to dining' },
      { src: projectImages.apartment, alt: 'Apartment kitchen context', caption: 'Apartment context' },
    ],
    faqs: [
      {
        question: 'Which kitchen layout is best for Indian cooking?',
        answer:
          'There is no single best layout - L and U shapes usually offer the strongest balance of counter, storage, and ventilation for Indian cooking when chimney and wet zones are planned early.',
      },
      {
        question: 'When should I finalize appliances?',
        answer:
          'Before production drawings. Hob cut-outs, fridge depth, dishwasher width, and chimney size all affect carcass design.',
      },
      {
        question: 'Is acrylic better than laminate for shutters?',
        answer:
          'Acrylic offers a high-gloss look; quality laminates are more forgiving on fingerprints and cost. Choose based on cleaning habits and the visual tone you want, not trend alone.',
      },
      {
        question: 'Can Space Solution design from this guide?',
        answer:
          'Yes. Bring your kitchen photos, appliance list, and layout preference to a consultation. We will turn the guide into measured drawings and a factory-made kitchen.',
      },
    ],
    ctaLabel: 'Get a Kitchen Designed for Your Home',
  },
  {
    slug: 'materials-and-finishes',
    title: 'Material & Finish Guide',
    menuTitle: 'Materials & Finishes',
    description: 'Laminates, hardware, countertops, and what lasts in daily use.',
    heroDescription:
      'Understand finishes, cores, and hardware so your interiors look good and hold up for years.',
    image: studioImages.craft,
    intro:
      'Material choices affect durability, maintenance, and how premium a space feels. This guide explains what we specify for kitchens, wardrobes, and living areas - and where it pays to invest. Think of finishes as a system: core board, surface, edge, and hardware must work together, or the most beautiful shutter will still fail early.',
    sections: [
      {
        label: 'Carcass & Boards',
        title: 'Start With the Right Core',
        paragraphs: [
          'The board inside your shutters matters more than the outer finish. Moisture-resistant cores are essential for kitchens and utility areas.',
          'Calibrated boards keep shutter gaps consistent over time. Edge banding on every exposed edge is a small detail that prevents swelling when humidity rises - especially important in Karnataka’s monsoon months.',
        ],
        bullets: [
          'BWP / MR-grade plywood or quality HDHMR for wet zones',
          'Calibrated boards for consistent shutter alignment',
          'Edge banding on all exposed sides to limit swelling',
          'Factory drilling for hinges improves long-term alignment',
        ],
        image: studioImages.craft,
      },
      {
        label: 'Surface Finishes',
        title: 'Laminates, Acrylic, and Veneer - When to Use What',
        paragraphs: [
          'Each finish has a role. We match the material to traffic, cleaning frequency, and the visual tone you want.',
          'Kitchens usually need easy-clean shutters; living rooms can carry richer veneer or textured panels; bedrooms often balance calm laminates with a warmer feature surface. Mixing five finishes in one room rarely looks premium - one hero material with supporting neutrals does.',
        ],
        bullets: [
          'Laminates - versatile, cost-effective, wide colour range',
          'Acrylic - high-gloss, smooth, popular for modern kitchens',
          'Veneer - warm, natural grain for living and bedroom panels',
          'Quartz / stone - durable, premium countertops for kitchens',
        ],
        image: roomImages.livingDining,
        reverse: true,
      },
      {
        label: 'Hardware',
        title: 'Hinges, Runners, and Handles',
        paragraphs: [
          'Hardware is felt every day. Soft-close hinges and full-extension drawers are small upgrades with a large impact on usability.',
          'Spend on runners and hinges before decorative extras. A quiet drawer you open twenty times a day matters more than a feature handle that photographs once. Lift-up systems help compact kitchens where overhead swing doors would collide with heads or pendants.',
        ],
        bullets: [
          'Soft-close hinges reduce noise and shutter slam',
          'Full-extension drawer runners improve access to depth',
          'Handle profiles should match grip and cleaning preference',
          'Lift-up systems for overhead units in compact kitchens',
        ],
        image: roomImages.bedroom,
      },
    ],
    highlights: {
      title: 'Finish Selection Quick Guide',
      items: [
        'Kitchen shutters - moisture-resistant core + easy-clean finish',
        'Wardrobes - laminate or veneer based on budget and tone',
        'TV units - veneer or PU for a refined living room look',
        'Hardware - prioritize runners and hinges over decorative add-ons',
      ],
    },
    gallery: [
      { src: studioImages.craft, alt: 'Material samples on studio table', caption: 'Studio materials' },
      { src: roomImages.modularKitchen, alt: 'Kitchen finish example', caption: 'Kitchen finishes' },
      { src: roomImages.bedroom, alt: 'Bedroom panel finishes', caption: 'Bedroom panels' },
    ],
    faqs: [
      {
        question: 'Where should I spend more - shutters or hardware?',
        answer:
          'Invest in core board and hardware first. A premium outer finish on a weak carcass or soft runners will not feel premium for long.',
      },
      {
        question: 'Are veneers practical for family homes?',
        answer:
          'Yes when placed thoughtfully - great for living feature panels and wardrobes with moderate touch. High-splash kitchen zones usually prefer laminates or other easy-clean surfaces.',
      },
      {
        question: 'Can I see materials before I decide?',
        answer:
          'Yes. Visit the Mysuru experience centre or ask us to bring samples to a consultation so you can compare cores, laminates, and hardware in person.',
      },
      {
        question: 'Do you specify materials for the whole home?',
        answer:
          'In turnkey projects we lock a finish palette across kitchen, wardrobes, and living joinery so rooms feel consistent and maintenance stays simple.',
      },
    ],
    ctaLabel: 'Discuss Materials for Your Project',
  },
  {
    slug: 'space-planning',
    title: 'Space Planning Basics',
    menuTitle: 'Space Planning',
    description: 'Measurements, circulation, and zoning for usable rooms.',
    heroDescription:
      'Plan rooms that breathe - with clear movement paths, balanced furniture, and storage that stays out of the way.',
    image: roomImages.livingDining,
    intro:
      'Good interiors start with how a room works. Space planning balances furniture scale, walkways, storage, and light before any finishing detail is chosen. When planning is weak, even expensive materials feel cramped. When planning is strong, a modest apartment can feel generous.',
    sections: [
      {
        label: 'Measure First',
        title: 'Work From Accurate Dimensions',
        paragraphs: [
          'Design decisions should come from measured drawings, not assumptions. Even small errors in wall length or window height affect furniture and wardrobe sizing.',
          'Photograph the empty room, note beam drops, and mark every service point. Wardrobe depths and bed clearances fail most often because a column or AC unit was ignored until installation day.',
        ],
        bullets: [
          'Record ceiling height, beam drops, and column positions',
          'Mark door swing direction and window sill heights',
          'Note switch, socket, and AC point locations early',
          'Photograph the bare space before civil changes begin',
        ],
        image: roomImages.fullHome,
      },
      {
        label: 'Circulation',
        title: 'Keep Walkways Clear and Predictable',
        paragraphs: [
          'Circulation paths should feel natural. When furniture blocks movement, a room reads smaller regardless of actual square footage.',
          'In living rooms, leave a clear path from entry to dining and balcony. In bedrooms, keep the dressing route free between bed and wardrobe. In kitchens, never force a cook to pivot around an island that is too tight.',
        ],
        bullets: [
          'Allow 90 cm+ paths in main walking routes where possible',
          'Keep seating layouts conversational, not pushed to walls only',
          'Align storage to unused walls rather than window zones',
          'Separate dry and wet zones clearly in kitchens and utilities',
        ],
        image: roomImages.livingDining,
        reverse: true,
      },
      {
        label: 'Zoning',
        title: 'Group Functions, Not Just Furniture',
        paragraphs: [
          'Zoning helps families use a home comfortably - work, rest, storage, and display each get a defined place.',
          'A study nook needs daylight and quiet more than a decorative backdrop. An entry zone with shoe and bag storage prevents clutter from migrating into the living room. Kids’ zones benefit from durable finishes and clear toy or study storage.',
        ],
        bullets: [
          'Living - seating, media, and display in one visual cluster',
          'Bedroom - sleep zone separate from dressing and storage',
          'Entry - shoe, bag, and mirror points near the door',
          'Kids / study - daylight and quiet corners prioritized',
        ],
        image: roomImages.bedroom,
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
    gallery: [
      { src: roomImages.livingDining, alt: 'Living dining planning reference', caption: 'Living & dining' },
      { src: roomImages.bedroom, alt: 'Bedroom zoning reference', caption: 'Bedroom zoning' },
      { src: projectImages.villa, alt: 'Villa volume planning', caption: 'Larger volumes' },
    ],
    faqs: [
      {
        question: 'Should electrical points wait until furniture is chosen?',
        answer:
          'No. Approve a furniture layout first, then freeze electrical points. Moving sockets after plaster wastes time and money.',
      },
      {
        question: 'How much walkway width is enough?',
        answer:
          'Aim for about 90 cm on main paths where the plan allows. Tight secondary paths can be narrower, but daily routes should never feel like a squeeze.',
      },
      {
        question: 'Do you plan from existing furniture?',
        answer:
          'We can keep pieces you already own and plan joinery around them. Share photos and sizes so the new layout does not fight what stays.',
      },
      {
        question: 'When should I book a space-planning consultation?',
        answer:
          'Before civil or electrical work if you can. A measured plan early prevents sockets, AC, and openings landing in the wrong place.',
      },
    ],
    ctaLabel: 'Plan Your Space With Our Team',
  },
  {
    slug: 'interior-styles',
    title: 'Interior Styles Explained',
    menuTitle: 'Interior Styles',
    description: 'Modern, contemporary, traditional, and minimal - what fits your home.',
    heroDescription:
      'Find a style direction that matches your taste, lifestyle, and the architecture of your home.',
    image: projectImages.villa,
    intro:
      'Style is more than a Pinterest board - it is how colours, materials, and furniture work together over time. These are the directions we help clients choose between most often in Mysuru and across Karnataka. The right style should still feel like your home after the trend cycle moves on.',
    sections: [
      {
        label: 'Modern',
        title: 'Clean Lines and Controlled Palettes',
        paragraphs: [
          'Modern interiors favour clarity - flat panels, integrated storage, and a restrained colour story with one or two accent materials.',
          'This direction suits apartments that need calm and order. Hidden storage is essential; open clutter fights the style. Lighting is usually recessed or linear, and furniture silhouettes stay simple.',
        ],
        bullets: [
          'Handle-less or slim-profile shutters',
          'Neutral bases with one bold accent wall or island',
          'Recessed or linear lighting',
          'Minimal open shelving',
        ],
        image: roomImages.modularKitchen,
      },
      {
        label: 'Contemporary',
        title: 'Warm, Current, and Livable',
        paragraphs: [
          'Contemporary design mixes modern function with softer textures - wood tones, fabric seating, and layered lighting.',
          'Families often land here because it photographs current without demanding museum-level maintenance. Feature walls, mixed materials, and comfort-first furniture sizing make everyday living feel intentional.',
        ],
        bullets: [
          'Mixed materials: wood, stone, metal, and fabric',
          'Comfort-first furniture sizing',
          'Feature walls with paneling or veneer',
          'Flexible layouts for family use',
        ],
        image: roomImages.livingDining,
        reverse: true,
      },
      {
        label: 'Traditional & Minimal',
        title: 'Two Ends of the Spectrum',
        paragraphs: [
          'Traditional interiors lean on mouldings, richer tones, and classic proportions. Minimal spaces reduce visual noise and maximize calm.',
          'Neither is “better” - both need disciplined lighting and storage. Traditional can feel heavy without light control; minimal can feel cold without texture. Choose based on architecture, maintenance comfort, and how formal you want guests to feel when they enter.',
        ],
        bullets: [
          'Traditional - paneling, classic hardware, warmer palettes',
          'Minimal - hidden storage, fewer colours, flush surfaces',
          'Both need careful lighting to avoid feeling flat or heavy',
          'Choose based on architecture, not trend alone',
        ],
        image: roomImages.bedroom,
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
    gallery: [
      { src: projectImages.villa, alt: 'Villa style reference', caption: 'Villa living' },
      { src: roomImages.livingDining, alt: 'Contemporary living dining', caption: 'Contemporary' },
      { src: roomImages.bedroom, alt: 'Calm bedroom style', caption: 'Bedroom calm' },
      { src: roomImages.fullHome, alt: 'Full home style cohesion', caption: 'Full-home cohesion' },
    ],
    faqs: [
      {
        question: 'Can I mix modern and traditional in one home?',
        answer:
          'Yes, if you keep a shared palette and repeat a few details. Mixing everything equally usually reads as unfinished - pick a dominant direction and use the other as accent.',
      },
      {
        question: 'Which style is easiest to maintain?',
        answer:
          'Matte laminates, closed storage, and fewer open shelves are usually easiest for family homes - often aligning with modern or contemporary directions.',
      },
      {
        question: 'Should every room use the same style?',
        answer:
          'Keep one dominant direction through the home. A bedroom can be quieter and a living room richer, as long as colours and materials still talk to each other.',
      },
      {
        question: 'Can you help us choose a style from references?',
        answer:
          'Yes. Bring images you like and we will separate what is structure, what is finish, and what will actually work in your rooms and light.',
      },
    ],
    ctaLabel: 'Find Your Interior Style With Us',
  },
  {
    slug: 'budget-planning',
    title: 'Budget Planning for Interiors',
    menuTitle: 'Budget Planning',
    description: 'Realistic ranges and where to invest first in your home.',
    heroDescription:
      'Plan interior costs with clarity - what drives price, where to prioritize, and how to phase work sensibly.',
    image: roomImages.fullHome,
    intro:
      'Budget conversations work best when scope is clear. This guide explains the main cost drivers on interior projects and how to allocate spend for the best long-term result. A clear room list and finish tier prevent quotes that look cheap on paper and inflate later on site.',
    sections: [
      {
        label: 'Cost Drivers',
        title: 'What Actually Moves the Number',
        paragraphs: [
          'Price follows scope - room count, material tier, hardware, and complexity of services all affect the final estimate more than small decorative choices.',
          'Civil tweaks, false ceilings, and electrical changes often surprise homeowners because they sit outside “modular furniture” line items. Ask for a scope that separates carpentry, services, and loose furniture so comparisons between vendors stay honest.',
        ],
        bullets: [
          'Modular scope - kitchen, wardrobes, TV unit, study, etc.',
          'Material and finish tier across shutters and panels',
          'Hardware quality - hinges, runners, lift systems',
          'Services - electrical, false ceiling, painting, civil tweaks',
        ],
        image: projectImages.apartment,
      },
      {
        label: 'Prioritize',
        title: 'Invest Where Daily Use Is Highest',
        paragraphs: [
          'Kitchens, wardrobes, and bathrooms deliver the most daily value. Decorative elements can follow once core utility is resolved.',
          'If the budget is tight, protect carcass quality, hardware, and kitchen workflow first. Feature walls and styling can phase later without forcing a redesign of the whole home.',
        ],
        bullets: [
          'Kitchen carcass and hardware before purely decorative extras',
          'Wardrobe internals before external feature cladding',
          'Lighting plan early - cheaper to wire before closing surfaces',
          'Appliances and sizes confirmed before final cabinetry drawings',
        ],
        image: roomImages.modularKitchen,
        reverse: true,
      },
      {
        label: 'Phasing',
        title: 'Split Work Without Losing Cohesion',
        paragraphs: [
          'Phased execution can help cash flow when the design language is fixed upfront. Colour, handle style, and panel profiles should be locked in phase one.',
          'Without a locked palette, phase two often looks like a different project. Keep one material family and hardware language across rooms even if installation happens months apart.',
        ],
        bullets: [
          'Phase 1 - kitchen + master wardrobe + electrical basics',
          'Phase 2 - living, guest bedroom, and remaining storage',
          'Phase 3 - decorative walls, loose furniture, and styling',
          'Keep one material palette across phases for visual continuity',
        ],
        image: roomImages.livingDining,
      },
    ],
    highlights: {
      title: 'Before You Request a Quote',
      items: [
        'List rooms to be covered and must-have items',
        'Share floor plan or rough dimensions if available',
        'Note move-in timeline and any hard deadlines',
        'Mention finish preference - laminate, acrylic, veneer, etc.',
      ],
    },
    gallery: [
      { src: roomImages.fullHome, alt: 'Full home budget planning reference', caption: 'Full-home scope' },
      { src: roomImages.modularKitchen, alt: 'Kitchen investment priority', caption: 'Kitchen priority' },
      { src: projectImages.apartment, alt: 'Apartment interiors budget context', caption: 'Apartment scope' },
    ],
    faqs: [
      {
        question: 'Why do interior quotes vary so widely?',
        answer:
          'Vendors include different scopes - some exclude electrical, ceilings, or hardware tiers. Compare line items, not only the bottom number.',
      },
      {
        question: 'Is phasing more expensive overall?',
        answer:
          'Phasing can add minor mobilization cost, but it often protects cash flow. It works best when design and materials are locked before phase one starts.',
      },
      {
        question: 'What should I budget first?',
        answer:
          'Kitchen and primary storage usually come first - they work the hardest every day. Living feature pieces can follow once the functional rooms are locked.',
      },
      {
        question: 'How do I get a number I can plan with?',
        answer:
          'Use the home budget calculator for a range, then book a consultation. A measured quote with a room list is the only figure you should build to.',
      },
    ],
    ctaLabel: 'Get a Clear Project Estimate',
  },
  {
    slug: 'before-you-renovate',
    title: 'Before You Renovate',
    menuTitle: 'Before You Renovate',
    description: 'Timeline, approvals, and a practical handover checklist.',
    heroDescription:
      'Prepare for a smoother renovation - from timeline expectations to final handover.',
    image: projectImages.villa,
    intro:
      'Renovation runs better when expectations are set early. Use this guide to plan timelines, coordinate trades, and know what a proper handover should include. Most delays we see are decision delays - not factory delays - so clarity before production is the real accelerator.',
    sections: [
      {
        label: 'Timeline',
        title: 'What Happens, and in What Order',
        paragraphs: [
          'Interior projects move through design, production, and site installation. Skipping steps in design usually costs time later on site.',
          'A realistic residential timeline includes measurement, layout approval, 3D and material sign-off, factory production, site readiness, installation, and snag closure. Compressing the approval stage rarely shortens the calendar - it usually lengthens it.',
        ],
        bullets: [
          'Design & approval - layouts, 3D views, material selections',
          'Production - factory manufacturing after sign-off',
          'Site readiness - civil, electrical, and painting prerequisites',
          'Installation & handover - fitting, punch-list, and final checks',
        ],
        image: studioImages.craft,
      },
      {
        label: 'Site Readiness',
        title: 'Get the Space Ready Before Install Teams Arrive',
        paragraphs: [
          'Installation quality depends on the condition of walls, floors, and services. Small civil fixes are easier before cabinetry arrives.',
          'Wet-area waterproofing, final electrical points, and level floors prevent the classic problem of beautiful modules fighting crooked walls. Clear a staging area for materials so installers are not improvising storage in finished rooms.',
        ],
        bullets: [
          'Complete waterproofing and tile work in wet areas first',
          'Finalize electrical points based on approved layouts',
          'Ensure floors are level where modular units will sit',
          'Clear storage space for material delivery and assembly',
        ],
        image: roomImages.fullHome,
        reverse: true,
      },
      {
        label: 'Handover',
        title: 'What a Proper Close-Out Looks Like',
        paragraphs: [
          'Handover is more than installation - it includes alignment checks, hardware tuning, and clarity on care and warranty.',
          'Walk the snag list room by room before final payment. Soft-close adjustments, edge touch-ups, and care instructions should be documented so the home stays as good as day one.',
        ],
        bullets: [
          'Shutter alignment and soft-close adjustment on site',
          'Snag list closed before final payment',
          'Care instructions for finishes and hardware',
          'Warranty terms documented for modular scope',
        ],
        image: roomImages.bedroom,
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
    gallery: [
      { src: projectImages.villa, alt: 'Villa renovation reference', caption: 'Villa renovation' },
      { src: studioImages.craft, alt: 'Material decisions before build', caption: 'Decide materials early' },
      { src: roomImages.fullHome, alt: 'Finished home after renovation', caption: 'After handover' },
    ],
    faqs: [
      {
        question: 'When should painting happen relative to modular install?',
        answer:
          'Coordinate carefully - many projects paint walls before install and touch up after. Agree the sequence in writing so carpentry and painting do not block each other.',
      },
      {
        question: 'What should a handover include?',
        answer:
          'Aligned shutters, closed snags, care guidance, and documented warranty for the modular scope - not only a visual walkthrough.',
      },
      {
        question: 'How far ahead should I start planning?',
        answer:
          'Begin design and measurements a few months before you need the space. Factory production and site work need a frozen drawing set, not last-week decisions.',
      },
      {
        question: 'Can Space Solution manage the full renovation sequence?',
        answer:
          'For turnkey interiors we coordinate design, factory production, and installation. Civil and MEP trades are aligned to that programme so handover stays in one conversation.',
      },
    ],
    ctaLabel: 'Start Your Renovation the Right Way',
  },
];
