import type { ImageMetadata } from 'astro';
import { l3BandSet } from './images';
import type { HomeStripLink } from './homeCategoryHubs';

export type L3HubId = 'home' | 'commercial' | 'institutional' | 'hospitality';

export interface L3Band {
  title: string;
  lead: string;
  bullets: string[];
  images: ImageMetadata[];
  ctaLabel: string;
  ctaHref?: string;
  quoteCta?: boolean;
}

export interface L3Finish {
  title: string;
  description: string;
}

export interface L3GalleryItem {
  src: ImageMetadata;
  alt: string;
  caption: string;
}

export interface L3RelatedLink {
  href: string;
  label: string;
}

export interface L3Page {
  slug: string;
  hubId: L3HubId;
  bandsLabel: string;
  bands: L3Band[];
  finishesHeading: string;
  finishes: L3Finish[];
  toolsHeading: string;
  tools: HomeStripLink[];
  guidesHeading: string;
  guides: HomeStripLink[];
  why: {
    label: string;
    title: string;
    lead: string;
    reasons: { title: string; description: string }[];
  };
  processLead: string;
  process: { title: string; description: string }[];
  galleryTitle: string;
  galleryDescription: string;
  gallery: L3GalleryItem[];
  relatedHeading: string;
  related: L3RelatedLink[];
}

function band(
  title: string,
  lead: string,
  bullets: string[],
  prefix: string,
  ctaLabel = 'Request a Quote',
): L3Band {
  return {
    title,
    lead,
    bullets,
    images: l3BandSet(prefix),
    ctaLabel,
    quoteCta: true,
  };
}

function tool(label: string, href: string, category: string): HomeStripLink {
  return { label, href, category };
}

function galleryFrom(bands: L3Band[], alts: string[]): L3GalleryItem[] {
  return bands.slice(0, 4).map((item, index) => ({
    src: item.images[0],
    alt: alts[index] ?? `${item.title} interiors by Space Solution`,
    caption: item.title,
  }));
}

const homeCategory = 'Home interiors';
const commercialCategory = 'Commercial interiors';
const institutionalCategory = 'Institutional interiors';
const hospitalityCategory = 'Hospitality interiors';

const kitchenBands: L3Band[] = [
  band(
    'L-shaped kitchen',
    'Two walls of storage with a clear cook, wash, and prep run. The layout most Mysuru apartments start with.',
    [
      'Work triangle stays short on a typical 2BHK plan',
      'Corner carousel or magic corner for deep storage',
      'Tall pantry on the longer wall if the room allows',
      'Easy to phase if you are renovating around existing plumbing',
    ],
    'kitchen-l',
  ),
  band(
    'U-shaped kitchen',
    'Three sides of cabinets for families who cook daily and want more counter without an island.',
    [
      'Extra counter for spice, dough, and serving',
      'Two people can work without crossing paths',
      'Tall units close the third wall neatly',
      'Best when the room is roughly square',
    ],
    'kitchen-u',
  ),
  band(
    'Parallel kitchen',
    'Two facing runs for a narrow kitchen. Sink on one side, hob on the other, aisle kept clear.',
    [
      'Fits galley rooms and many builder apartments',
      'Full-height storage at one end if depth allows',
      'Good task light on both walls',
      'Keep the aisle wide enough for two people to pass',
    ],
    'kitchen-parallel',
  ),
  band(
    'Island kitchen',
    'A centre island for prep, seating, or a hob, when the room is open to living or dining.',
    [
      'Breakfast ledge without crowding the work run',
      'Hob or sink on the island only when services can reach it',
      'Pendant light and clear circulation around all sides',
      'Suits villas and larger open-plan apartments',
    ],
    'kitchen-island',
  ),
  band(
    'Storage and internals',
    'Drawers, pantries, and corner fittings planned around how you actually cook and restock.',
    [
      'Tandem drawers for vessels and groceries',
      'Tall pantry with adjustable shelves',
      'Bottle pull-outs and cutlery trays',
      'Appliance housing for oven, microwave, and chimney',
    ],
    'kitchen-storage',
  ),
];

const wardrobeBands: L3Band[] = [
  band(
    'Sliding wardrobes',
    'Floor-to-ceiling storage that does not need swing clearance. Useful in tighter bedrooms.',
    [
      'Two or three sliding panels on a quiet track',
      'Hanging, shelves, and drawers behind the same face',
      'Mirrors on one panel if the room needs it',
      'Loft option above if ceiling height allows',
    ],
    'wardrobe-sliding',
  ),
  band(
    'Hinged wardrobes',
    'Full-width access when you open the doors. A clear look for larger bedrooms.',
    [
      'Shutter faces in laminate, acrylic, or membrane',
      'Internal lighting on the hanging bay',
      'Shoe and accessory drawers at the base',
      'Soft-close hinges as standard',
    ],
    'wardrobe-hinged',
  ),
  band(
    'Walk-in wardrobes',
    'A dressing room when the suite has the depth. Island drawers and a dressing mirror in one volume.',
    [
      'Hanging on both sides with a centre aisle',
      'Island for folded clothes and jewellery',
      'Seating and a full-length mirror',
      'Suits master suites and villas',
    ],
    'wardrobe-walkin',
  ),
  band(
    'Loft and extra storage',
    'High-level storage for luggage and seasonal items, coordinated with the wardrobe below.',
    [
      'Loft shutters that match the wardrobe face',
      'Safe access with a planned ladder or stool zone',
      'Useful in apartments with 10 ft ceilings',
      'Keeps the bedroom floor clear',
    ],
    'wardrobe-loft',
  ),
];

const livingBands: L3Band[] = [
  band(
    'TV and living wall',
    'A low unit and panel that hides wires, holds the screen, and keeps the room calm.',
    [
      'TV panel with storage for boxes and remotes',
      'Display niches with soft light',
      'Sofa wall and circulation planned together',
      'Finishes that match dining joinery',
    ],
    'living-tv',
  ),
  band(
    'Dining',
    'A table setting that seats the family without blocking the kitchen or living path.',
    [
      'Table size from the actual room, not a catalogue default',
      'Storage for crockery close to the table',
      'Pendant light centred on the table',
      'Easy to serve from the kitchen',
    ],
    'living-dining',
  ),
  band(
    'Lighting and layering',
    'Daylight first, then pendants, cove, and lamps so the room works from morning to evening.',
    [
      'Cove and profile light on the TV wall',
      'Dining pendant as a clear focus',
      'Warm lamps for late seating',
      'No glare on the screen',
    ],
    'living-lighting',
  ),
];

const bedroomBands: L3Band[] = [
  band(
    'Master bedroom',
    'A quiet suite with storage, a dressing zone, and finishes that stay calm at night.',
    [
      'Bed wall with panels or a light headboard',
      'Wardrobe on the long wall or in a walk-in',
      'Bedside storage that does not crowd the bed',
      'Blackout-ready window treatment',
    ],
    'bedroom-master',
  ),
  band(
    'Kids bedroom',
    'Study, sleep, and storage in one room, with furniture that can change as they grow.',
    [
      'Study desk with pin-up or shelf above',
      'Wardrobe with easy-reach hanging',
      'Safe corners and durable faces',
      'Room to add a bunk or extra bed later',
    ],
    'bedroom-kids',
  ),
  band(
    'Guest bedroom',
    'A simple room that still feels finished, with storage for visitors and a clear bed wall.',
    [
      'Compact wardrobe or wall unit',
      'Bedside tables and reading light',
      'Luggage space at the foot of the bed',
      'Finishes that match the rest of the home',
    ],
    'bedroom-guest',
  ),
];

const poojaBands: L3Band[] = [
  band(
    'Wall-mounted pooja',
    'A compact shrine on the wall when the room is small or shared with living.',
    [
      'Shuttered unit that closes after aarti',
      'Drawer for lamps, oil, and matchboxes',
      'Safe electrical point for lights',
      'Finishes that sit quietly with living joinery',
    ],
    'pooja-wall',
  ),
  band(
    'Floor-standing pooja',
    'A dedicated unit with storage below when you have a clear wall and a daily ritual.',
    [
      'Mandir height set for comfortable standing',
      'Storage for pooja materials below',
      'Back panel in wood, laminate, or stone look',
      'Room for a small seating mat in front',
    ],
    'pooja-floor',
  ),
  band(
    'Niche pooja',
    'A recessed shrine when the wall can be built in, so the unit sits flush with the room.',
    [
      'Flush doors or an open niche with a frame',
      'Cove light that does not glare',
      'Hidden storage in the thickness of the wall',
      'Works in apartments and villas',
    ],
    'pooja-niche',
  ),
];

const fullHomeBands: L3Band[] = [
  band(
    'Apartment interiors',
    'Kitchen, wardrobes, and living planned as one language on a typical Mysuru floor plate.',
    [
      'Measure the builder plan before drawings start',
      'Kitchen and bedrooms first if you are phasing',
      'False ceiling and lighting in the same schedule',
      'Handover room by room without leaving the house unfinished',
    ],
    'fullhome-apartment',
  ),
  band(
    'Villa interiors',
    'Larger rooms, taller storage, and joinery that still feels like one home across floors.',
    [
      'Staircase, living, and kitchen as one arrival',
      'Master suite with walk-in if the plan allows',
      'Outdoor-adjacent dining kept practical',
      'Factory schedule matched to civil progress',
    ],
    'fullhome-villa',
  ),
  band(
    'Phased interiors',
    'Start with the rooms you use every day, then add the rest without changing the look later.',
    [
      'Kitchen and wardrobes as the first factory batch',
      'Living and pooja in a second visit if needed',
      'Same materials held for later rooms',
      'Clear quote for each phase before work starts',
    ],
    'fullhome-phased',
  ),
];

const officeBands: L3Band[] = [
  band(
    'Workstations',
    'Desks, screens, and storage that keep a team focused without a noisy floor.',
    [
      'Linear or cluster desks from the headcount',
      'Cable management in the desk run',
      'Pedestals and overhead storage',
      'Lighting that works on screens',
    ],
    'office-workstations',
  ),
  band(
    'Cabins',
    'Closed rooms for partners and managers, with glass or solid partitions as the plan needs.',
    [
      'Desk, side unit, and visitor chairs in one volume',
      'Acoustic glass where privacy still needs light',
      'Storage that does not crowd the desk',
      'A door and blinds that actually close',
    ],
    'office-cabins',
  ),
  band(
    'Meeting rooms',
    'A table, screen, and finish that make client meetings feel settled.',
    [
      'Table size from the largest usual meeting',
      'Screen wall with cable points',
      'Soft seating outside for waiting',
      'Quiet finishes and a door that seals',
    ],
    'office-meeting',
  ),
];

const clinicBands: L3Band[] = [
  band(
    'Reception and waiting',
    'A calm first room with a desk, seating, and a clear path to consultation.',
    [
      'Reception desk with storage for files',
      'Waiting seats that do not block circulation',
      'Easy-clean faces and floors',
      'Signage and lighting that feel clinical, not harsh',
    ],
    'clinic-reception',
  ),
  band(
    'Consultation rooms',
    'A quiet room for doctor and patient, with a desk, exam zone, and storage.',
    [
      'Desk facing the door without a glare screen',
      'Couch or chair with a privacy curtain if needed',
      'Cabinets for instruments and records',
      'Wash point coordinated with plumbing',
    ],
    'clinic-consult',
  ),
  band(
    'Procedure and support',
    'Treatment, sterilisation, and staff rooms planned so the clinic can run all day.',
    [
      'Procedure room with wipeable surfaces',
      'Sterilisation and dirty-clean split',
      'Staff locker and pantry',
      'Factory joinery that matches the reception language',
    ],
    'clinic-procedure',
  ),
];

const retailBands: L3Band[] = [
  band(
    'Boutique fitout',
    'A compact shop with display, cash, and a trial zone that still feels open.',
    [
      'Perimeter display and a focal centre table',
      'Cash desk with storage behind',
      'Trial room with a mirror and hook rail',
      'Lighting that shows product colour correctly',
    ],
    'retail-boutique',
  ),
  band(
    'Flagship and showroom',
    'A longer floor with zones for collections, a feature wall, and a place to sit with a client.',
    [
      'Clear aisle from entrance to the back wall',
      'Feature display for new collections',
      'Client seating near the cash or cabin',
      'Storage that does not read as back-of-house from the floor',
    ],
    'retail-flagship',
  ),
  band(
    'Display and storage',
    'Shelving, hanging, and drawers planned for how stock actually turns.',
    [
      'Adjustable shelves and hanging rails',
      'Drawer units for small goods',
      'Back storage with a staff door',
      'Finishes that take handling all day',
    ],
    'retail-display',
  ),
];

const coworkingBands: L3Band[] = [
  band(
    'Hot desks',
    'Open desks that can be booked by the day, with power and a quiet enough floor.',
    [
      'Bench desks with screens',
      'Power and data at every seat',
      'Lockers nearby for bags',
      'Daylight first, then even task light',
    ],
    'coworking-desks',
  ),
  band(
    'Pods and phone rooms',
    'Small rooms for calls and focused work so the open floor stays usable.',
    [
      'One and two person pods',
      'Acoustic lining that actually works',
      'A light and a power point in each pod',
      'Visible from the floor so they stay booked, not empty',
    ],
    'coworking-pods',
  ),
  band(
    'Community and lounge',
    'A shared table, pantry, and soft seating that make the centre feel looked after.',
    [
      'Community table for lunch and workshops',
      'Pantry with durable counters',
      'Lounge that can host a small event',
      'Reception that still controls access',
    ],
    'coworking-community',
  ),
];

const schoolBands: L3Band[] = [
  band(
    'Classrooms',
    'Desks, storage, and a teaching wall that a class can use every day.',
    [
      'Furniture sized for the age group',
      'Teacher storage and a board wall',
      'Bag hooks or cubbies at the door',
      'Durable edges and easy-clean faces',
    ],
    'school-classroom',
  ),
  band(
    'Staff rooms',
    'A place for teachers to plan, sit, and store, away from the corridor noise.',
    [
      'Work table and lockers',
      'Pantry point if the brief allows',
      'Notice wall and a quiet corner',
      'Finishes that match the campus, not a home kitchen',
    ],
    'school-staffroom',
  ),
  band(
    'Campus furniture sets',
    'Repeated classroom and office sets so a block can be fitted in one factory run.',
    [
      'Standard desk and storage modules',
      'Admin office next to the classrooms',
      'Bulk quantities with one finish language',
      'Install sequenced around term dates',
    ],
    'school-sets',
  ),
];

const hostelBands: L3Band[] = [
  band(
    'Bunk rooms',
    'Beds, study, and lockers in a shared room that still feels orderly.',
    [
      'Bunk or loft beds with safe ladders',
      'Study ledge per student',
      'Under-bed or locker storage',
      'Durable laminate that takes daily wear',
    ],
    'hostel-bunk',
  ),
  band(
    'Single occupancy',
    'A compact room with a bed, desk, and wardrobe for PG or staff housing.',
    [
      'Bed and study in one wall run if the room is narrow',
      'Wardrobe with a lock option',
      'Pin-up or shelf above the desk',
      'Easy to repeat across a floor',
    ],
    'hostel-single',
  ),
  band(
    'Lockers and common storage',
    'Corridor lockers and common-room storage so personal items are not on the bed.',
    [
      'Locker banks with numbering',
      'Common-room benches and tables',
      'Shoe and bag storage at entries',
      'Hardware that survives a full occupancy year',
    ],
    'hostel-lockers',
  ),
];

const libraryBands: L3Band[] = [
  band(
    'Shelving',
    'Runs of shelves planned for load, aisle width, and how students actually browse.',
    [
      'Fixed or adjustable library shelving',
      'End panels that take signage',
      'Aisles that meet campus circulation',
      'Finishes that hide wear at the edges',
    ],
    'library-shelving',
  ),
  band(
    'Reading rooms',
    'Tables and carrels with light that is kind to long study hours.',
    [
      'Long tables and two-person carrels',
      'Task light without glare on pages',
      'Bag storage under the table',
      'Quiet finishes and a clear supervisor view',
    ],
    'library-reading',
  ),
  band(
    'Labs and specialist rooms',
    'Lab benches, teacher demo tables, and storage for equipment.',
    [
      'Chemical-resistant or laminate tops as specified',
      'Under-bench storage and service voids',
      'Teacher table with a clear view of the room',
      'Install coordinated with campus services',
    ],
    'library-lab',
  ),
];

const adminBands: L3Band[] = [
  band(
    'Staff workstations',
    'Desks for clerks and officers that keep files close and aisles clear.',
    [
      'Linear desks with pedestals',
      'Overhead storage for files',
      'Visitor side of the desk kept open',
      'Same language as campus classrooms if they share a block',
    ],
    'admin-workstations',
  ),
  band(
    'Meeting and cabin',
    'A principal or HO cabin plus a small meeting table for parents and vendors.',
    [
      'Desk, side unit, and two visitor chairs',
      'Meeting table for four to six',
      'Storage for certificates and files',
      'A door and blinds for privacy',
    ],
    'admin-meeting',
  ),
  band(
    'Reception',
    'The first desk of the campus, with waiting seats and a notice wall.',
    [
      'Reception counter with storage behind',
      'Waiting bench that does not block the door',
      'Display for circulars and awards',
      'Durable faces for daily public use',
    ],
    'admin-reception',
  ),
];

const cafeBands: L3Band[] = [
  band(
    'Seating',
    'Tables and banquettes planned from covers, not from a furniture catalogue page.',
    [
      'Two-top and four-top mix',
      'Banquette on the long wall if the room is narrow',
      'Aisle width for service',
      'Finishes that take spills and bag traffic',
    ],
    'cafe-seating',
  ),
  band(
    'Counter and display',
    'The order point, pastry case, and back counter as one working wall.',
    [
      'Service counter height for standing orders',
      'Display for food and retail',
      'POS and billing with cable management',
      'Back storage that staff can reach quickly',
    ],
    'cafe-counter',
  ),
  band(
    'Kitchen coordination',
    'Front-of-house joinery that matches the kitchen pass and the opening date.',
    [
      'Pass and pickup aligned with the kitchen plan',
      'Waiter station with a small sink if needed',
      'Materials that match the seating language',
      'Install sequenced with kitchen equipment',
    ],
    'cafe-kitchen',
  ),
];

const hotelBands: L3Band[] = [
  band(
    'Lobby and arrival',
    'A reception desk, seating, and a first impression that still works at noon.',
    [
      'Reception with luggage space beside it',
      'Lounge seating that does not block check-in',
      'A feature wall or screen in daylight',
      'Durable floors and faces for arrivals all day',
    ],
    'hotel-lobby',
  ),
  band(
    'Guest rooms',
    'A bed wall, luggage bench, and wardrobe that can be repeated across a floor.',
    [
      'Headboard and bedside as one joinery run',
      'Luggage bench and a writing ledge',
      'Wardrobe with a safe zone',
      'Finishes that housekeeping can clean quickly',
    ],
    'hotel-guestroom',
  ),
  band(
    'Amenities',
    'Breakfast, corridor, and small meeting rooms in the same material language as the rooms.',
    [
      'Breakfast seating that turns over fast',
      'Corridor dado and lighting',
      'A compact meeting or business room',
      'Factory modules that repeat cleanly',
    ],
    'hotel-amenities',
  ),
];

const barBands: L3Band[] = [
  band(
    'Bar counter',
    'A working bar with bottle display, a service top, and storage that staff can reach.',
    [
      'Bar top and foot rail planned for standing guests',
      'Back bar with bottle and glass storage',
      'POS at one end, not in the middle of service',
      'Light finishes that still photograph well by day',
    ],
    'bar-counter',
  ),
  band(
    'Lounge seating',
    'Booths and low tables for groups, with an aisle for service.',
    [
      'Booth and loose seating mix',
      'Table height for drinks and small plates',
      'Acoustic softness so conversation holds',
      'Upholstery specified for hospitality wear',
    ],
    'bar-lounge',
  ),
  band(
    'Lighting',
    'Daylight plus warm layers so the room is not a dark box at lunch and not flat at night.',
    [
      'Pendant over the bar',
      'Low light on tables',
      'Display light on bottles without glare',
      'Dimmer scenes for afternoon and evening',
    ],
    'bar-lighting',
  ),
];

const salonBands: L3Band[] = [
  band(
    'Styling stations',
    'Mirrors, chairs, and wet points laid out so two stylists are not in each other\'s way.',
    [
      'Station spacing from the chair swing',
      'Mirror wall with storage below',
      'Wet area grouped, not scattered',
      'Easy-clean faces around colour and water',
    ],
    'salon-stations',
  ),
  band(
    'Waiting and retail',
    'A calm wait with a small retail shelf, so the first five minutes feel looked after.',
    [
      'Waiting seats with a view of the floor, not the street glare',
      'Retail for product without crowding the desk',
      'Reception with appointment storage',
      'Light that is kind to skin and hair',
    ],
    'salon-waiting',
  ),
  band(
    'Treatment rooms',
    'Closed rooms for facials, spa, or colour, with storage and a wash point.',
    [
      'Couch or chair with circulation on three sides',
      'Cabinets for towels and product',
      'Dimmer light and a door that closes',
      'Wet-area coordination with plumbing',
    ],
    'salon-treatment',
  ),
];

function kitchenPage(): L3Page {
  return {
    slug: 'modular-kitchen',
    hubId: 'home',
    bandsLabel: 'Kitchen layouts',
    bands: kitchenBands,
    finishesHeading: 'Faces and counters we specify often',
    finishes: [
      { title: 'Acrylic', description: 'High-gloss shutters that wipe clean after Indian cooking.' },
      { title: 'Laminate', description: 'Durable faces for daily use and a wide colour range.' },
      { title: 'BWP boards', description: 'Moisture-resistant carcasses for sink runs and wet zones.' },
      { title: 'Quartz and granite', description: 'Counters chosen for heat, stain, and how you prep.' },
    ],
    toolsHeading: 'Price a kitchen before you enquire',
    tools: [
      tool('Kitchen Cost Estimator', '/tools/kitchen-cost-estimator', homeCategory),
      tool('Kitchen Layout Recommender', '/tools/kitchen-layout-recommender', homeCategory),
      tool('Home Budget Calculator', '/tools/home-budget-calculator', homeCategory),
    ],
    guidesHeading: 'Read before you lock a layout',
    guides: [
      tool('Modular Kitchen Guide', '/design-library/modular-kitchen-guide', homeCategory),
      tool('Space Planning', '/design-library/space-planning', homeCategory),
      tool('Budget Planning', '/design-library/budget-planning', homeCategory),
    ],
    why: {
      label: 'Why us',
      title: 'Why clients choose us for kitchens',
      lead: 'Since 2011, one Mysuru team has designed, manufactured, and installed modular kitchens so the cabinets that leave the factory are the ones that fit your wall.',
      reasons: [
        {
          title: 'Factory-made cabinets',
          description: 'Carcasses and shutters are made in our factory, then installed on site against the approved drawing.',
        },
        {
          title: 'Layouts for Indian cooking',
          description: 'L, U, parallel, and island plans drawn around heat, spice storage, and how two people actually cook.',
        },
        {
          title: 'Hardware that lasts',
          description: 'Soft-close, tandem, and corner fittings specified for daily use, not a show-kitchen open once a week.',
        },
        {
          title: 'Clear kitchen quotes',
          description: 'A measured scope for cabinets, counters, and internals before production starts.',
        },
        {
          title: 'One team to handover',
          description: 'Design, factory, and install stay with us so chimney, hob, and plumbing coordination is not left to chance.',
        },
        {
          title: 'Matches the rest of the home',
          description: 'Kitchen faces can follow into wardrobes and living joinery when you extend the project.',
        },
      ],
    },
    processLead: 'Three steps from the first measure to a kitchen you can cook in.',
    process: [
      {
        title: 'Share Your Requirement',
        description: 'Tell us the room size, how you cook, and whether this is a renovation or a new home, so we can suggest a layout.',
      },
      {
        title: 'Design & Project Planning',
        description: 'We lock 3D, materials, internals, and a factory date before carcasses go into production.',
      },
      {
        title: 'Installation & Final Setup',
        description: 'We install on site, set counters and hardware, and leave the kitchen ready for appliances and daily use.',
      },
    ],
    galleryTitle: 'Modular kitchen gallery',
    galleryDescription: 'Light stills from L, U, parallel, and island kitchens.',
    gallery: galleryFrom(kitchenBands, [
      'L-shaped modular kitchen in a Mysuru home',
      'U-shaped modular kitchen with tall storage',
      'Parallel galley modular kitchen',
      'Island kitchen with pale oak and cream cabinets',
    ]),
    relatedHeading: 'Next rooms',
    related: [
      { href: '/wardrobes-storage', label: 'Wardrobes & Storage' },
      { href: '/living-dining', label: 'Living & Dining' },
      { href: '/full-home-interiors', label: 'Full Home Interiors' },
      { href: '/residential-interiors', label: 'All home interiors' },
    ],
  };
}

function page(
  slug: string,
  hubId: L3HubId,
  bandsLabel: string,
  bands: L3Band[],
  finishesHeading: string,
  finishes: L3Finish[],
  toolsHeading: string,
  tools: HomeStripLink[],
  guidesHeading: string,
  guides: HomeStripLink[],
  why: L3Page['why'],
  processLead: string,
  process: L3Page['process'],
  galleryTitle: string,
  galleryDescription: string,
  galleryAlts: string[],
  relatedHeading: string,
  related: L3RelatedLink[],
): L3Page {
  return {
    slug,
    hubId,
    bandsLabel,
    bands,
    finishesHeading,
    finishes,
    toolsHeading,
    tools,
    guidesHeading,
    guides,
    why,
    processLead,
    process,
    galleryTitle,
    galleryDescription,
    gallery: galleryFrom(bands, galleryAlts),
    relatedHeading,
    related,
  };
}

const homeTools = [
  tool('Home Budget Calculator', '/tools/home-budget-calculator', homeCategory),
  tool('Kitchen Cost Estimator', '/tools/kitchen-cost-estimator', homeCategory),
  tool('Kitchen Layout Recommender', '/tools/kitchen-layout-recommender', homeCategory),
];
const homeGuides = [
  tool('Space Planning', '/design-library/space-planning', homeCategory),
  tool('Budget Planning', '/design-library/budget-planning', homeCategory),
  tool('Before You Renovate', '/design-library/before-you-renovate', homeCategory),
];
const commercialTools = [
  tool('Office Space Calculator', '/tools/office-space-calculator', commercialCategory),
  tool('Commercial Fitout Estimator', '/tools/commercial-fitout-estimator', commercialCategory),
  tool('Clinic Room Planner', '/tools/clinic-room-planner', commercialCategory),
];
const commercialGuides = [
  tool('Materials & Finishes', '/design-library/materials-and-finishes', commercialCategory),
  tool('Interior Styles', '/design-library/interior-styles', commercialCategory),
];
const institutionalTools = [
  tool('Classroom Furniture Calculator', '/tools/classroom-furniture-calculator', institutionalCategory),
  tool('Hostel Bed Planner', '/tools/hostel-bed-planner', institutionalCategory),
  tool('Bulk Furniture Estimator', '/tools/bulk-furniture-estimator', institutionalCategory),
];
const institutionalGuides = [
  tool('Space Planning', '/design-library/space-planning', institutionalCategory),
  tool('Materials & Finishes', '/design-library/materials-and-finishes', institutionalCategory),
];
const hospitalityTools = [
  tool('Café Seating Calculator', '/tools/cafe-seating-calculator', hospitalityCategory),
  tool('Hospitality Fitout Estimator', '/tools/hospitality-fitout-estimator', hospitalityCategory),
  tool('Opening Day Countdown', '/tools/opening-day-countdown', hospitalityCategory),
];
const hospitalityGuides = [
  tool('Interior Styles', '/design-library/interior-styles', hospitalityCategory),
  tool('Materials & Finishes', '/design-library/materials-and-finishes', hospitalityCategory),
];

const laminateFinishes: L3Finish[] = [
  { title: 'Laminate', description: 'Durable faces for daily contact and a wide colour range.' },
  { title: 'Membrane and acrylic', description: 'Smoother shutters where you want a quieter, brighter face.' },
  { title: 'Hardware', description: 'Soft-close and tracks specified for how often the doors actually open.' },
  { title: 'Internals', description: 'Hanging, shelves, and drawers drawn around what you store.' },
];

const workplaceFinishes: L3Finish[] = [
  { title: 'Laminate worktops', description: 'Desks and counters that take daily bags, cups, and cleaning.' },
  { title: 'Glass and partitions', description: 'Cabins and meeting rooms that keep light without losing privacy.' },
  { title: 'Acoustic fabrics', description: 'Screens and panels where the floor would otherwise be noisy.' },
  { title: 'Metal and hardware', description: 'Legs, handles, and tracks specified for commercial use.' },
];

const campusFinishes: L3Finish[] = [
  { title: 'High-pressure laminate', description: 'Edges and faces that survive a full academic year.' },
  { title: 'Metal frames', description: 'Beds, desks, and tables that can be repeated across a block.' },
  { title: 'Easy-clean edges', description: 'PVC and ABS edges that do not chip at the first scrape.' },
  { title: 'Standard modules', description: 'One factory set, many rooms, one maintenance language.' },
];

const hospitalityFinishes: L3Finish[] = [
  { title: 'Hospitality laminate', description: 'Faces that take bags, plates, and daily wipe-down.' },
  { title: 'Stone and solid surface', description: 'Counters at bars, reception, and service points.' },
  { title: 'Upholstery', description: 'Seating specified for covers, not a one-evening photoshoot.' },
  { title: 'Warm metals', description: 'Handles and trims that read as guest-facing, not back-of-house.' },
];

export const l3ServicePages: L3Page[] = [
  kitchenPage(),
  page(
    'wardrobes-storage',
    'home',
    'Wardrobe types',
    wardrobeBands,
    'Faces and internals we specify often',
    laminateFinishes,
    'Plan storage before you enquire',
    homeTools,
    'Read before you lock a wardrobe',
    homeGuides,
    {
      label: 'Why us',
      title: 'Why clients choose us for wardrobes',
      lead: 'Floor-to-ceiling storage is made in our Mysuru factory, then installed so hanging, drawers, and lofts stay one language with the rest of the home.',
      reasons: [
        { title: 'Factory carcasses', description: 'Wardrobe boxes are manufactured for consistent gaps and finish, then fitted on site.' },
        { title: 'Internals that match the routine', description: 'Hanging, folding, shoes, and accessories are drawn from how you actually dress.' },
        { title: 'Sliding, hinged, and walk-in', description: 'The door system follows the room, not a single catalogue default.' },
        { title: 'Clear wardrobe quotes', description: 'A measured scope for shutters, internals, and loft before production.' },
        { title: 'One team to handover', description: 'Design, factory, and install stay with us so the bedroom is left ready to use.' },
        { title: 'Matches kitchen and living', description: 'Faces can follow the kitchen language when you are doing more than one room.' },
      ],
    },
    'Three steps from a measured wall to storage you can fill.',
    [
      { title: 'Share Your Requirement', description: 'Tell us the bedrooms, what you store, and whether you need sliding, hinged, or a walk-in.' },
      { title: 'Design & Project Planning', description: 'We lock internals, finishes, and a factory date before carcasses are cut.' },
      { title: 'Installation & Final Setup', description: 'We install on site, set tracks and lighting, and leave the wardrobe ready to load.' },
    ],
    'Wardrobe gallery',
    'Sliding, hinged, walk-in, and loft storage in light finishes.',
    ['Sliding wardrobe in a Mysuru bedroom', 'Hinged wardrobe with open internals', 'Walk-in dressing room', 'Loft storage above a wardrobe'],
    'Next rooms',
    [
      { href: '/modular-kitchen', label: 'Modular Kitchen' },
      { href: '/bedrooms', label: 'Bedrooms' },
      { href: '/full-home-interiors', label: 'Full Home Interiors' },
      { href: '/residential-interiors', label: 'All home interiors' },
    ],
  ),
  page(
    'living-dining',
    'home',
    'Living layouts',
    livingBands,
    'Finishes that sit quietly in a living room',
    [
      { title: 'Wood and laminate', description: 'TV units and tables that match kitchen and wardrobe faces.' },
      { title: 'Soft seating fabrics', description: 'Upholstery chosen for family use, not a show-flat photo.' },
      { title: 'Stone and ceramic', description: 'Coffee tables and ledges that take cups and remote clutter.' },
      { title: 'Layered light', description: 'Cove, pendants, and lamps specified with the joinery.' },
    ],
    'Plan living spend before you enquire',
    homeTools,
    'Read before you lock a living layout',
    homeGuides,
    {
      label: 'Why us',
      title: 'Why clients choose us for living rooms',
      lead: 'TV walls, dining, and lighting are drawn with the kitchen language so the house does not feel like three different projects.',
      reasons: [
        { title: 'One material language', description: 'Living joinery can follow kitchen and wardrobe faces when you want a calm house.' },
        { title: 'Wires stay hidden', description: 'TV panels and units are drawn around boxes, not stuck on after the sofa arrives.' },
        { title: 'Dining that serves', description: 'Table size and storage come from how you actually host, not a catalogue set.' },
        { title: 'Clear living quotes', description: 'Joinery, lighting, and dining are scoped before production.' },
        { title: 'Factory and site', description: 'Units are made in Mysuru and installed so gaps and levels stay honest.' },
        { title: 'Family-proof finishes', description: 'Faces and fabrics specified for daily use, not a one-day shoot.' },
      ],
    },
    'Three steps from a measured living room to a space you can sit in.',
    [
      { title: 'Share Your Requirement', description: 'Tell us how you sit, dine, and watch, and whether the kitchen opens into this room.' },
      { title: 'Design & Project Planning', description: 'We lock the TV wall, dining, lighting, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install joinery, set lighting, and leave the room ready for furniture.' },
    ],
    'Living and dining gallery',
    'TV walls, dining, and layered light in bright Mysuru homes.',
    ['Living room TV wall', 'Dining room with pale oak table', 'Living room with layered lighting'],
    'Next rooms',
    [
      { href: '/modular-kitchen', label: 'Modular Kitchen' },
      { href: '/bedrooms', label: 'Bedrooms' },
      { href: '/full-home-interiors', label: 'Full Home Interiors' },
      { href: '/residential-interiors', label: 'All home interiors' },
    ],
  ),
  page(
    'bedrooms',
    'home',
    'Bedroom types',
    bedroomBands,
    'Finishes for sleep and storage',
    laminateFinishes,
    'Plan bedroom spend before you enquire',
    homeTools,
    'Read before you lock a bedroom',
    homeGuides,
    {
      label: 'Why us',
      title: 'Why clients choose us for bedrooms',
      lead: 'Bed walls, wardrobes, and study desks are made as one factory set so the room stays quiet and consistent.',
      reasons: [
        { title: 'Storage first', description: 'Wardrobes and lofts are drawn with the bed wall, not added as an afterthought.' },
        { title: 'Master, kids, and guest', description: 'Each room gets a brief, not a copied layout from the master.' },
        { title: 'Factory joinery', description: 'Panels and carcasses are made in Mysuru for even gaps and finish.' },
        { title: 'Clear bedroom quotes', description: 'Wardrobe, bed wall, and study are scoped before production.' },
        { title: 'One team to handover', description: 'Install includes lighting on the wardrobe and a room you can sleep in.' },
        { title: 'Matches the house', description: 'Bedroom faces can follow kitchen and living when you are doing a full home.' },
      ],
    },
    'Three steps from a measured bedroom to a room you can rest in.',
    [
      { title: 'Share Your Requirement', description: 'Tell us who uses the room, what must be stored, and whether a study desk is needed.' },
      { title: 'Design & Project Planning', description: 'We lock the bed wall, wardrobe internals, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install on site, set lighting, and leave the room ready for the bed.' },
    ],
    'Bedroom gallery',
    'Master, kids, and guest rooms with light storage and calm walls.',
    ['Master bedroom with wardrobe', 'Kids bedroom with study desk', 'Guest bedroom with compact storage'],
    'Next rooms',
    [
      { href: '/wardrobes-storage', label: 'Wardrobes & Storage' },
      { href: '/pooja-room', label: 'Pooja Room' },
      { href: '/full-home-interiors', label: 'Full Home Interiors' },
      { href: '/residential-interiors', label: 'All home interiors' },
    ],
  ),
  page(
    'pooja-room',
    'home',
    'Pooja types',
    poojaBands,
    'Finishes for a quiet shrine',
    [
      { title: 'Wood and laminate', description: 'Faces that sit with living joinery without looking like kitchen shutters.' },
      { title: 'Stone looks', description: 'Back panels that take oil, lamps, and daily wipe-down.' },
      { title: 'Soft light', description: 'Cove and spots that do not glare during aarti.' },
      { title: 'Safe electrics', description: 'Points planned for lights and a small exhaust if needed.' },
    ],
    'Plan pooja joinery before you enquire',
    homeTools,
    'Read before you lock a pooja unit',
    homeGuides,
    {
      label: 'Why us',
      title: 'Why clients choose us for pooja units',
      lead: 'Wall, floor, and niche shrines are made in the same factory as the kitchen, so the unit feels part of the house.',
      reasons: [
        { title: 'Sized to the ritual', description: 'Height, shutters, and storage follow how you actually do aarti, not a catalogue mandir.' },
        { title: 'Closes when you need it to', description: 'Doors and niches that keep the living room calm between use.' },
        { title: 'Factory joinery', description: 'Units are made in Mysuru and installed flush to the wall.' },
        { title: 'Clear pooja quotes', description: 'Carcass, back panel, and lighting are scoped before production.' },
        { title: 'Safe daily use', description: 'Electrics and materials specified for lamps and oil, not just display.' },
        { title: 'Matches living joinery', description: 'The shrine can follow the TV wall or dining language.' },
      ],
    },
    'Three steps from a measured wall to a shrine you can use every day.',
    [
      { title: 'Share Your Requirement', description: 'Tell us wall or floor, what you store, and whether the unit must close after aarti.' },
      { title: 'Design & Project Planning', description: 'We lock size, finishes, lighting, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install on site, set lights, and leave the unit ready for idols and lamps.' },
    ],
    'Pooja gallery',
    'Wall-mounted, floor-standing, and niche pooja units in light homes.',
    ['Wall-mounted pooja unit', 'Floor-standing pooja unit', 'Niche pooja shrine'],
    'Next rooms',
    [
      { href: '/living-dining', label: 'Living & Dining' },
      { href: '/bedrooms', label: 'Bedrooms' },
      { href: '/full-home-interiors', label: 'Full Home Interiors' },
      { href: '/residential-interiors', label: 'All home interiors' },
    ],
  ),
  page(
    'full-home-interiors',
    'home',
    'How we take on a whole home',
    fullHomeBands,
    'One finish language across rooms',
    [
      { title: 'Kitchen faces', description: 'The kitchen often sets laminate, acrylic, and hardware for the house.' },
      { title: 'Wardrobe faces', description: 'Bedroom storage follows the kitchen so the house does not split in two.' },
      { title: 'Living joinery', description: 'TV and dining units stay in the same family of colour and grain.' },
      { title: 'Counters and light', description: 'Quartz, granite, and lighting specified once, then repeated.' },
    ],
    'Plan a full-home budget before you enquire',
    homeTools,
    'Read before you lock a full-home brief',
    homeGuides,
    {
      label: 'Why us',
      title: 'Why clients choose us for full homes',
      lead: 'Kitchen, wardrobes, living, and pooja stay one factory schedule, so the house is one language at handover.',
      reasons: [
        { title: 'One team', description: 'Design, factory, and install for every room, not a different carpenter per floor.' },
        { title: 'Apartment or villa', description: 'The brief follows the floor plate, not a single catalogue home.' },
        { title: 'Phased if you need it', description: 'Kitchen and bedrooms first, living later, with materials held for the next batch.' },
        { title: 'Clear home quotes', description: 'Room-wise scope before production, so the budget is not a surprise at install.' },
        { title: 'Factory control', description: 'Carcasses leave Mysuru consistent, then fit the measured walls.' },
        { title: '15+ years of homes', description: 'Apartments and independent houses across Mysuru and Karnataka.' },
      ],
    },
    'Three steps from a house brief to a coordinated handover.',
    [
      { title: 'Share Your Requirement', description: 'Tell us which rooms, whether you will phase, and when you need to move in.' },
      { title: 'Design & Project Planning', description: 'We lock 3D, materials, and a factory schedule so every room stays one language.' },
      { title: 'Installation & Final Setup', description: 'We install room by room, review the house, and leave it ready to live in.' },
    ],
    'Full-home gallery',
    'Apartment, villa, and phased interiors in one light language.',
    ['Apartment interiors', 'Villa interiors', 'Phased home interiors'],
    'Start with a room',
    [
      { href: '/modular-kitchen', label: 'Modular Kitchen' },
      { href: '/wardrobes-storage', label: 'Wardrobes & Storage' },
      { href: '/living-dining', label: 'Living & Dining' },
      { href: '/residential-interiors', label: 'All home interiors' },
    ],
  ),
  page(
    'office-interiors',
    'commercial',
    'Office layouts',
    officeBands,
    'Workplace finishes we specify often',
    workplaceFinishes,
    'Size a floor before you enquire',
    commercialTools,
    'Read before you lock a workplace',
    commercialGuides,
    {
      label: 'Why us',
      title: 'Why teams choose us for offices',
      lead: 'Workstations, cabins, and meeting rooms are manufactured in Mysuru and installed as one workplace, not a mix of vendors.',
      reasons: [
        { title: 'Headcount-led layouts', description: 'Desks and cabins follow how the team actually sits, not a leftover floor plate.' },
        { title: 'Factory desks and storage', description: 'Workstations and overheads are made for commercial wear, then installed on site.' },
        { title: 'Meeting rooms that work', description: 'Table, screen, and acoustics are part of the same drawing.' },
        { title: 'Clear fitout quotes', description: 'Joinery, partitions, and loose furniture scoped before production.' },
        { title: 'One install team', description: 'We coordinate power, data, and desks so the floor is usable at handover.' },
        { title: 'Mysuru-based', description: 'Design and factory stay close to site for offices across Karnataka.' },
      ],
    },
    'Three steps from a headcount to a floor you can work on.',
    [
      { title: 'Share Your Requirement', description: 'Tell us headcount, cabins, and when the team needs to sit.' },
      { title: 'Design & Project Planning', description: 'We lock the furniture plan, finishes, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install desks, cabins, and meeting rooms, then leave the floor ready.' },
    ],
    'Office gallery',
    'Workstations, cabins, and meeting rooms in light workplaces.',
    ['Office workstations', 'Manager cabin', 'Meeting room'],
    'Next spaces',
    [
      { href: '/clinic-interiors', label: 'Clinics & Healthcare' },
      { href: '/coworking-interiors', label: 'Co-working' },
      { href: '/retail-interiors', label: 'Retail & Showrooms' },
      { href: '/commercial-interiors', label: 'All commercial interiors' },
    ],
  ),
  page(
    'clinic-interiors',
    'commercial',
    'Clinic rooms',
    clinicBands,
    'Clinic finishes that wipe clean',
    [
      { title: 'Wipeable laminates', description: 'Reception and cabinets specified for daily disinfectant.' },
      { title: 'Solid surface counters', description: 'Reception and procedure tops that take clinical cleaning.' },
      { title: 'Quiet floors and fabrics', description: 'Waiting that feels calm without looking like a home living room.' },
      { title: 'Clinical hardware', description: 'Hinges and handles that survive a full clinic day.' },
    ],
    'Plan clinic rooms before you enquire',
    [
      tool('Clinic Room Planner', '/tools/clinic-room-planner', commercialCategory),
      tool('Commercial Fitout Estimator', '/tools/commercial-fitout-estimator', commercialCategory),
      tool('Office Space Calculator', '/tools/office-space-calculator', commercialCategory),
    ],
    'Read before you lock a clinic layout',
    commercialGuides,
    {
      label: 'Why us',
      title: 'Why practices choose us for clinics',
      lead: 'Reception, consultation, and procedure rooms are drawn as one patient path, then manufactured and installed by one team.',
      reasons: [
        { title: 'Patient path first', description: 'Waiting, consult, and procedure follow how a session actually runs.' },
        { title: 'Easy-clean joinery', description: 'Faces and counters specified for clinical wipe-down, not a home kitchen look.' },
        { title: 'Factory cabinets', description: 'Reception and treatment storage are made in Mysuru for consistent gaps.' },
        { title: 'Clear clinic quotes', description: 'Rooms and joinery scoped before production.' },
        { title: 'Services coordinated', description: 'Wash points and electrics sit on the furniture drawing, not as a later patch.' },
        { title: 'Calm, not cold', description: 'Light finishes that still read as a clinic, not a showroom.' },
      ],
    },
    'Three steps from a clinic brief to rooms you can consult in.',
    [
      { title: 'Share Your Requirement', description: 'Tell us speciality, room list, and when patients should start arriving.' },
      { title: 'Design & Project Planning', description: 'We lock the room plan, finishes, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install joinery, review wet points, and leave the clinic ready to stock.' },
    ],
    'Clinic gallery',
    'Reception, consultation, and procedure rooms in light clinics.',
    ['Clinic reception', 'Consultation room', 'Procedure support room'],
    'Next spaces',
    [
      { href: '/office-interiors', label: 'Office Interiors' },
      { href: '/retail-interiors', label: 'Retail & Showrooms' },
      { href: '/salon-wellness-interiors', label: 'Salons & Wellness' },
      { href: '/commercial-interiors', label: 'All commercial interiors' },
    ],
  ),
  page(
    'retail-interiors',
    'commercial',
    'Shop layouts',
    retailBands,
    'Retail finishes that take handling',
    [
      { title: 'Display laminates', description: 'Shelves and counters that take daily product handling.' },
      { title: 'Lighting', description: 'Spots and tracks specified to show colour correctly.' },
      { title: 'Mirrors and glass', description: 'Trial rooms and feature display that still feel open.' },
      { title: 'Durable floors', description: 'Aisles that take bags and footfall all day.' },
    ],
    'Estimate a shop fitout before you enquire',
    commercialTools,
    'Read before you lock a shop layout',
    commercialGuides,
    {
      label: 'Why us',
      title: 'Why retailers choose us for shops',
      lead: 'Display, cash, and back storage are manufactured as one shop language, then installed against the opening date.',
      reasons: [
        { title: 'Display first', description: 'Shelves and hanging are drawn around how stock turns, not leftover wall space.' },
        { title: 'Factory joinery', description: 'Counters and units leave Mysuru consistent, then fit the measured shop.' },
        { title: 'Trial and cash planned', description: 'The customer path includes a place to try and a place to pay.' },
        { title: 'Clear shop quotes', description: 'Display, lighting, and back storage scoped before production.' },
        { title: 'Opening-date install', description: 'We sequence site work so the floor is ready for merchandising.' },
        { title: 'Light, not nightclub', description: 'Shops stay bright so product colour reads true.' },
      ],
    },
    'Three steps from a shop brief to a floor you can merchandise.',
    [
      { title: 'Share Your Requirement', description: 'Tell us category, area, and when you need to open.' },
      { title: 'Design & Project Planning', description: 'We lock display, cash, lighting, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install joinery, set lighting, and leave the shop ready for stock.' },
    ],
    'Retail gallery',
    'Boutique, flagship, and display joinery in bright shops.',
    ['Boutique shop fitout', 'Flagship showroom', 'Retail display storage'],
    'Next spaces',
    [
      { href: '/office-interiors', label: 'Office Interiors' },
      { href: '/clinic-interiors', label: 'Clinics & Healthcare' },
      { href: '/cafe-restaurant-interiors', label: 'Cafés & Restaurants' },
      { href: '/commercial-interiors', label: 'All commercial interiors' },
    ],
  ),
  page(
    'coworking-interiors',
    'commercial',
    'Coworking layouts',
    coworkingBands,
    'Coworking finishes for daily turnover',
    workplaceFinishes,
    'Size a coworking floor before you enquire',
    commercialTools,
    'Read before you lock a coworking layout',
    commercialGuides,
    {
      label: 'Why us',
      title: 'Why operators choose us for coworking',
      lead: 'Hot desks, pods, and community rooms are made as one centre, so members see a looked-after floor, not a mix of leftover furniture.',
      reasons: [
        { title: 'Desks that book', description: 'Power, screens, and spacing follow how members actually sit.' },
        { title: 'Pods that work', description: 'Phone rooms are lined and powered, not a cupboard with a chair.' },
        { title: 'Community that hosts', description: 'Lounge and pantry can take lunch and a small event on the same day.' },
        { title: 'Factory modules', description: 'Desks and lockers repeat cleanly across a floor.' },
        { title: 'Clear centre quotes', description: 'Joinery and loose furniture scoped before production.' },
        { title: 'One install', description: 'We leave the floor ready for members, not a punch-list week later.' },
      ],
    },
    'Three steps from a member mix to a floor you can open.',
    [
      { title: 'Share Your Requirement', description: 'Tell us hot desks, cabins, and when members should walk in.' },
      { title: 'Design & Project Planning', description: 'We lock the furniture plan, pods, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install desks, pods, and community rooms, then leave the centre ready.' },
    ],
    'Coworking gallery',
    'Hot desks, pods, and community rooms in light centres.',
    ['Coworking hot desks', 'Phone pods', 'Coworking community lounge'],
    'Next spaces',
    [
      { href: '/office-interiors', label: 'Office Interiors' },
      { href: '/cafe-restaurant-interiors', label: 'Cafés & Restaurants' },
      { href: '/retail-interiors', label: 'Retail & Showrooms' },
      { href: '/commercial-interiors', label: 'All commercial interiors' },
    ],
  ),
  page(
    'school-interiors',
    'institutional',
    'School spaces',
    schoolBands,
    'Campus finishes that last a term',
    campusFinishes,
    'Estimate classroom sets before you enquire',
    institutionalTools,
    'Read before you lock campus furniture',
    institutionalGuides,
    {
      label: 'Why us',
      title: 'Why campuses choose us for classrooms',
      lead: 'Classroom, staff, and admin sets are manufactured in bulk in Mysuru, then installed around term dates.',
      reasons: [
        { title: 'Age-right furniture', description: 'Desk height and storage follow the class, not a single adult office desk.' },
        { title: 'Bulk factory runs', description: 'Repeated classroom sets leave the factory consistent.' },
        { title: 'Staff rooms included', description: 'Teachers get a place to plan, not leftover corridor furniture.' },
        { title: 'Clear campus quotes', description: 'Room counts and finishes scoped before production.' },
        { title: 'Install around term', description: 'We sequence site work so teaching can resume on time.' },
        { title: 'Durable edges', description: 'Laminate and metal specified for a full academic year.' },
      ],
    },
    'Three steps from a room count to classrooms you can teach in.',
    [
      { title: 'Share Your Requirement', description: 'Tell us class count, age groups, and when the block must open.' },
      { title: 'Design & Project Planning', description: 'We lock standard modules, finishes, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install room by room and leave the block ready for term.' },
    ],
    'School gallery',
    'Classrooms, staff rooms, and campus furniture sets.',
    ['School classroom', 'Staff room', 'Campus furniture set'],
    'Next spaces',
    [
      { href: '/hostel-furniture', label: 'Hostel & PG Furniture' },
      { href: '/library-lab-interiors', label: 'Libraries & Labs' },
      { href: '/admin-office-interiors', label: 'Admin & Staff Offices' },
      { href: '/institutional-interiors', label: 'All institutional interiors' },
    ],
  ),
  page(
    'hostel-furniture',
    'institutional',
    'Hostel rooms',
    hostelBands,
    'Hostel finishes for daily occupancy',
    campusFinishes,
    'Plan beds and lockers before you enquire',
    [
      tool('Hostel Bed Planner', '/tools/hostel-bed-planner', institutionalCategory),
      tool('Bulk Furniture Estimator', '/tools/bulk-furniture-estimator', institutionalCategory),
      tool('Classroom Furniture Calculator', '/tools/classroom-furniture-calculator', institutionalCategory),
    ],
    'Read before you lock hostel furniture',
    institutionalGuides,
    {
      label: 'Why us',
      title: 'Why campuses choose us for hostels',
      lead: 'Bunks, singles, and lockers are made as repeated room sets, then installed so a floor can fill on day one.',
      reasons: [
        { title: 'Beds that take occupancy', description: 'Bunks and singles specified for daily student use, not a guest-house weekend.' },
        { title: 'Study in the room', description: 'A ledge or desk per student, not a bed that doubles as a table.' },
        { title: 'Lockers that number', description: 'Personal storage that can be issued and maintained.' },
        { title: 'Clear hostel quotes', description: 'Room type counts scoped before a bulk factory run.' },
        { title: 'Repeatable rooms', description: 'One module, many doors, one maintenance language.' },
        { title: 'Install by floor', description: 'We sequence so a wing can occupy while the next is still in production.' },
      ],
    },
    'Three steps from a bed count to rooms you can occupy.',
    [
      { title: 'Share Your Requirement', description: 'Tell us bunk vs single, locker needs, and when students arrive.' },
      { title: 'Design & Project Planning', description: 'We lock the room module, finishes, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install floor by floor and leave rooms ready for occupancy.' },
    ],
    'Hostel gallery',
    'Bunk rooms, single occupancy, and locker storage.',
    ['Hostel bunk room', 'Single occupancy hostel room', 'Hostel locker bank'],
    'Next spaces',
    [
      { href: '/school-interiors', label: 'Schools & Colleges' },
      { href: '/admin-office-interiors', label: 'Admin & Staff Offices' },
      { href: '/library-lab-interiors', label: 'Libraries & Labs' },
      { href: '/institutional-interiors', label: 'All institutional interiors' },
    ],
  ),
  page(
    'library-lab-interiors',
    'institutional',
    'Library and lab layouts',
    libraryBands,
    'Library and lab finishes',
    campusFinishes,
    'Estimate bulk furniture before you enquire',
    institutionalTools,
    'Read before you lock library furniture',
    institutionalGuides,
    {
      label: 'Why us',
      title: 'Why campuses choose us for libraries and labs',
      lead: 'Shelving, reading tables, and lab benches are manufactured for load and daily student use, then installed to campus aisles.',
      reasons: [
        { title: 'Shelving for load', description: 'Runs are specified for books and equipment, not decorative living-room shelves.' },
        { title: 'Reading that lasts hours', description: 'Tables, carrels, and light drawn for long study, not a lounge photo.' },
        { title: 'Lab benches with services', description: 'Tops and voids coordinated with campus plumbing and power.' },
        { title: 'Clear campus quotes', description: 'Shelf bays and table counts scoped before production.' },
        { title: 'Factory consistency', description: 'Repeated bays leave Mysuru with the same edge and colour.' },
        { title: 'Install to term', description: 'We sequence around exams and opening dates.' },
      ],
    },
    'Three steps from a bay count to rooms students can use.',
    [
      { title: 'Share Your Requirement', description: 'Tell us library vs lab, student load, and when the room must open.' },
      { title: 'Design & Project Planning', description: 'We lock shelving, tables, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install bays and benches, then leave the room ready to stock.' },
    ],
    'Library and lab gallery',
    'Shelving, reading rooms, and lab benches.',
    ['Library shelving', 'Reading room', 'Campus lab benches'],
    'Next spaces',
    [
      { href: '/school-interiors', label: 'Schools & Colleges' },
      { href: '/hostel-furniture', label: 'Hostel & PG Furniture' },
      { href: '/admin-office-interiors', label: 'Admin & Staff Offices' },
      { href: '/institutional-interiors', label: 'All institutional interiors' },
    ],
  ),
  page(
    'admin-office-interiors',
    'institutional',
    'Admin layouts',
    adminBands,
    'Admin finishes for public-facing desks',
    workplaceFinishes,
    'Size admin desks before you enquire',
    [
      tool('Office Space Calculator', '/tools/office-space-calculator', institutionalCategory),
      tool('Bulk Furniture Estimator', '/tools/bulk-furniture-estimator', institutionalCategory),
      tool('Classroom Furniture Calculator', '/tools/classroom-furniture-calculator', institutionalCategory),
    ],
    'Read before you lock admin furniture',
    institutionalGuides,
    {
      label: 'Why us',
      title: 'Why campuses choose us for admin offices',
      lead: 'Staff desks, cabins, and reception are made in the same factory as classrooms, so a block feels like one campus.',
      reasons: [
        { title: 'Public-facing desks', description: 'Reception and officer desks take files and visitors all day.' },
        { title: 'Cabins with a door', description: 'Principal and HO rooms get privacy without leaving the campus language.' },
        { title: 'Matches classrooms', description: 'Admin finishes can follow the teaching block if they share a wing.' },
        { title: 'Clear office quotes', description: 'Desk counts and cabins scoped before production.' },
        { title: 'Factory modules', description: 'Repeated staff desks leave Mysuru consistent.' },
        { title: 'One install team', description: 'We leave the office ready for files, not a second vendor visit.' },
      ],
    },
    'Three steps from a staff count to offices you can run.',
    [
      { title: 'Share Your Requirement', description: 'Tell us staff seats, cabins, and when the office must open.' },
      { title: 'Design & Project Planning', description: 'We lock desks, reception, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install joinery and leave the office ready for staff.' },
    ],
    'Admin gallery',
    'Staff workstations, cabins, and campus reception.',
    ['Admin workstations', 'Campus meeting cabin', 'Campus reception'],
    'Next spaces',
    [
      { href: '/school-interiors', label: 'Schools & Colleges' },
      { href: '/hostel-furniture', label: 'Hostel & PG Furniture' },
      { href: '/library-lab-interiors', label: 'Libraries & Labs' },
      { href: '/institutional-interiors', label: 'All institutional interiors' },
    ],
  ),
  page(
    'cafe-restaurant-interiors',
    'hospitality',
    'Café layouts',
    cafeBands,
    'Hospitality finishes for service',
    hospitalityFinishes,
    'Count covers before you enquire',
    hospitalityTools,
    'Read before you lock a café layout',
    hospitalityGuides,
    {
      label: 'Why us',
      title: 'Why operators choose us for cafés',
      lead: 'Seating, counter, and waiter stations are manufactured to a cover count, then installed against the kitchen pass and opening date.',
      reasons: [
        { title: 'Covers first', description: 'Tables follow how many guests you can serve, not leftover floor.' },
        { title: 'A working counter', description: 'POS, display, and back storage sit on one service wall.' },
        { title: 'Kitchen coordinated', description: 'Front-of-house joinery lines up with the pass, not against it.' },
        { title: 'Clear F&B quotes', description: 'Seating and counters scoped before production.' },
        { title: 'Opening-date install', description: 'We sequence with kitchen equipment so you can train staff on time.' },
        { title: 'Light guest rooms', description: 'Cafés stay bright so food and faces read well by day.' },
      ],
    },
    'Three steps from a cover count to a room you can serve in.',
    [
      { title: 'Share Your Requirement', description: 'Tell us covers, counter needs, and the opening date.' },
      { title: 'Design & Project Planning', description: 'We lock seating, counter, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install joinery, review the pass, and leave the room ready for service.' },
    ],
    'Café gallery',
    'Seating, counters, and kitchen-coordinated joinery.',
    ['Café seating', 'Café service counter', 'Café kitchen coordination'],
    'Next spaces',
    [
      { href: '/hotel-interiors', label: 'Hotels & Resorts' },
      { href: '/bar-lounge-interiors', label: 'Bars & Lounges' },
      { href: '/retail-interiors', label: 'Retail & Showrooms' },
      { href: '/hospitality-interiors', label: 'All hospitality interiors' },
    ],
  ),
  page(
    'hotel-interiors',
    'hospitality',
    'Hotel spaces',
    hotelBands,
    'Hotel finishes for housekeeping',
    hospitalityFinishes,
    'Estimate a hospitality fitout before you enquire',
    hospitalityTools,
    'Read before you lock hotel joinery',
    hospitalityGuides,
    {
      label: 'Why us',
      title: 'Why hotels choose us for guest spaces',
      lead: 'Lobby, rooms, and breakfast joinery are made as repeatable modules, then installed so housekeeping can run from day one.',
      reasons: [
        { title: 'Arrival that works at noon', description: 'Reception and lounge stay light and durable for all-day check-in.' },
        { title: 'Repeatable rooms', description: 'Bed walls and wardrobes that can roll out across a floor.' },
        { title: 'Housekeeping-ready', description: 'Faces and ledges specified for daily clean, not a photoshoot finish.' },
        { title: 'Clear hotel quotes', description: 'Room modules and public areas scoped before production.' },
        { title: 'Factory control', description: 'Modules leave Mysuru consistent, then fit the measured rooms.' },
        { title: 'Opening sequenced', description: 'We install so a floor can sell while the next is still in production.' },
      ],
    },
    'Three steps from a room count to spaces you can sell.',
    [
      { title: 'Share Your Requirement', description: 'Tell us room types, public areas, and when you need to open.' },
      { title: 'Design & Project Planning', description: 'We lock modules, finishes, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install floor by floor and leave rooms ready for housekeeping.' },
    ],
    'Hotel gallery',
    'Lobbies, guest rooms, and amenities in light hospitality interiors.',
    ['Hotel lobby', 'Hotel guest room', 'Hotel amenities'],
    'Next spaces',
    [
      { href: '/cafe-restaurant-interiors', label: 'Cafés & Restaurants' },
      { href: '/bar-lounge-interiors', label: 'Bars & Lounges' },
      { href: '/salon-wellness-interiors', label: 'Salons & Wellness' },
      { href: '/hospitality-interiors', label: 'All hospitality interiors' },
    ],
  ),
  page(
    'bar-lounge-interiors',
    'hospitality',
    'Bar layouts',
    barBands,
    'Bar finishes that still read light by day',
    hospitalityFinishes,
    'Plan seating and fitout before you enquire',
    hospitalityTools,
    'Read before you lock a bar layout',
    hospitalityGuides,
    {
      label: 'Why us',
      title: 'Why operators choose us for bars',
      lead: 'Counters, lounge, and lighting are drawn for afternoon as well as evening, then manufactured and installed as one room.',
      reasons: [
        { title: 'A working bar', description: 'Bottle display, POS, and storage sit where staff can actually reach them.' },
        { title: 'Lounge that hosts', description: 'Booths and tables follow how groups sit, not a nightclub cliché.' },
        { title: 'Light by day', description: 'We keep cream, oak, and daylight so the room is not a dark box at lunch.' },
        { title: 'Clear bar quotes', description: 'Counter, seating, and lighting scoped before production.' },
        { title: 'Hospitality wear', description: 'Tops and fabrics specified for spills and late service.' },
        { title: 'One install', description: 'We leave the room ready to stock, not waiting on a second joiner.' },
      ],
    },
    'Three steps from a bar brief to a room you can serve in.',
    [
      { title: 'Share Your Requirement', description: 'Tell us covers, bar length, and whether the room must work at lunch as well as night.' },
      { title: 'Design & Project Planning', description: 'We lock counter, seating, lighting, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install joinery, set lighting scenes, and leave the bar ready for stock.' },
    ],
    'Bar gallery',
    'Counters, lounge seating, and lighting in bright bar interiors.',
    ['Bar counter', 'Bar lounge seating', 'Bar lighting'],
    'Next spaces',
    [
      { href: '/cafe-restaurant-interiors', label: 'Cafés & Restaurants' },
      { href: '/hotel-interiors', label: 'Hotels & Resorts' },
      { href: '/salon-wellness-interiors', label: 'Salons & Wellness' },
      { href: '/hospitality-interiors', label: 'All hospitality interiors' },
    ],
  ),
  page(
    'salon-wellness-interiors',
    'hospitality',
    'Salon layouts',
    salonBands,
    'Salon finishes around water and colour',
    [
      { title: 'Wipeable laminates', description: 'Stations and cabinets specified for colour, water, and daily clean.' },
      { title: 'Mirrors and light', description: 'Lighting that is kind to skin and hair, not a harsh downlight.' },
      { title: 'Wet-area hardware', description: 'Hinges and handles that survive a full salon day.' },
      { title: 'Calm waiting fabrics', description: 'Seating that feels looked after without looking like a home sofa.' },
    ],
    'Plan a salon fitout before you enquire',
    hospitalityTools,
    'Read before you lock a salon layout',
    hospitalityGuides,
    {
      label: 'Why us',
      title: 'Why salons choose us for stations and rooms',
      lead: 'Stations, waiting, and treatment rooms are drawn around water and chairs, then manufactured and installed as one floor.',
      reasons: [
        { title: 'Stations that space', description: 'Chair swing and wet points are on the drawing, not guessed on site.' },
        { title: 'Waiting that calms', description: 'The first five minutes have a seat, retail, and light that is kind to faces.' },
        { title: 'Treatment rooms that close', description: 'Doors, dimmers, and storage for towels and product.' },
        { title: 'Clear salon quotes', description: 'Stations and rooms scoped before production.' },
        { title: 'Wet areas coordinated', description: 'Plumbing sits with the furniture plan.' },
        { title: 'Factory joinery', description: 'Cabinets leave Mysuru consistent, then fit the measured walls.' },
      ],
    },
    'Three steps from a station count to a floor you can open.',
    [
      { title: 'Share Your Requirement', description: 'Tell us station count, treatment rooms, and the opening date.' },
      { title: 'Design & Project Planning', description: 'We lock the floor plan, wet points, and a factory date.' },
      { title: 'Installation & Final Setup', description: 'We install stations and rooms, then leave the salon ready to stock.' },
    ],
    'Salon gallery',
    'Stations, waiting, and treatment rooms in light salons.',
    ['Salon styling stations', 'Salon waiting lounge', 'Salon treatment room'],
    'Next spaces',
    [
      { href: '/clinic-interiors', label: 'Clinics & Healthcare' },
      { href: '/cafe-restaurant-interiors', label: 'Cafés & Restaurants' },
      { href: '/hotel-interiors', label: 'Hotels & Resorts' },
      { href: '/hospitality-interiors', label: 'All hospitality interiors' },
    ],
  ),
];

const l3BySlug = new Map(l3ServicePages.map((entry) => [entry.slug, entry]));

export function getL3Page(slug: string): L3Page | undefined {
  return l3BySlug.get(slug);
}
