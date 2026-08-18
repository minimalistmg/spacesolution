import type { ImageMetadata } from 'astro';
import {
  heroImages,
  projectImages,
  roomImages,
} from './images';

export type ProjectCategory =
  | 'Hospitality'
  | 'Commercial'
  | 'Residential'
  | 'Wellness'
  | 'Pop-Up Events';

export const projectFilters: ProjectCategory[] = [
  'Hospitality',
  'Commercial',
  'Residential',
  'Wellness',
  'Pop-Up Events',
];

export interface ProjectItem {
  slug: string;
  title: string;
  categories: ProjectCategory[];
  role: string;
  size: string;
  timeline: string;
  location: string;
  href: string;
  services: string[];
  headline: string;
  summary: string[];
  images: { src: ImageMetadata; alt: string }[];
  scope?: string[];
  faqs?: { question: string; answer: string }[];
}

function projectPath(slug: string) {
  return `/projects/${slug}`;
}

export const projects: ProjectItem[] = [
  {
    slug: 'vijayanagar-residence',
    title: 'Vijayanagar Residence',
    categories: ['Residential'],
    role: 'Full Service Design & Build',
    size: '2,400 SF',
    timeline: '4 Months',
    location: 'Mysuru, Karnataka',
    href: projectPath('vijayanagar-residence'),
    services: [
      'Space Planning',
      'Interior Design',
      'Modular Furniture',
      'Turnkey Execution',
    ],
    headline: 'A calm family home shaped around storage, light, and everyday flow.',
    summary: [
      'Space Solution designed and delivered a full residential interior for a family home in Vijayanagar, Mysuru - balancing open living areas with high-utility storage and durable finishes suited to Karnataka’s climate. The brief asked for a home that feels calm at first glance and stays practical through school mornings, guests, and long evenings.',
      'The layout prioritizes natural light and clear circulation between living, dining, and kitchen zones. Instead of treating rooms as isolated boxes, we planned sightlines and thresholds so the apartment reads as one composed volume while still giving each function its own quiet corner.',
      'Custom modular wardrobes and kitchen systems were manufactured in-house so shutter profiles, handle language, and edge detailing stay consistent from the entry console to the master suite. Tall storage absorbs seasonal clutter without crowding the rooms, and soft-close hardware keeps daily use quiet.',
      'Warm wood tones, soft neutrals, and carefully placed lighting create a lived-in atmosphere without sacrificing function. Under-cabinet and cove layers support cooking and reading after dark, while ceiling light remains restrained so the home never feels over-lit.',
      'Material selection favored moisture-aware cores in wet zones, wipeable laminate and acrylic in high-touch areas, and natural textures in living spaces where guests spend time. Every junction - from ceiling lines to skirting returns - was coordinated for a clean finished result.',
      'Our team managed design, material selection, factory production, and site installation as one process, so timeline and quality stayed aligned from first measure to handover. The family moved into a complete home, not a collection of unfinished trades.',
    ],
    scope: [
      'Full-home space planning and 3D visualization',
      'Modular kitchen with pantry and utility coordination',
      'Bedroom wardrobes, TV unit, and living storage',
      'False ceiling, lighting plan, and finish selection',
      'Factory production and on-site turnkey installation',
    ],
    faqs: [
      {
        question: 'Was this a full-home package or kitchen-only?',
        answer:
          'Vijayanagar Residence was a full-service residential package - kitchen, bedrooms, living storage, lighting coordination, and site installation managed as one scope.',
      },
      {
        question: 'How long did design and installation take?',
        answer:
          'The project ran approximately four months from measured survey and design approval through factory production and final site handover.',
      },
      {
        question: 'Can a similar apartment layout be adapted elsewhere in Mysuru?',
        answer:
          'Yes. The planning principles - light, storage, and clear circulation - adapt well to other 2–3 BHK footprints; we resize modules from fresh site measures rather than copying drawings blindly.',
      },
      {
        question: 'How would a similar home project start?',
        answer:
          'Share plans or photos, your must-have rooms, and a target move-in. We measure, design in 3D, then manufacture and install as one residential programme.',
      },
    ],
    images: [
      { src: projectImages.apartment, alt: 'Vijayanagar residence living interior' },
      { src: roomImages.livingDining, alt: 'Living and dining zone' },
      { src: roomImages.modularKitchen, alt: 'Light modular kitchen' },
      { src: roomImages.bedroom, alt: 'Bedroom suite with storage' },
      { src: roomImages.fullHome, alt: 'Full-home interior overview' },
    ],
  },
  {
    slug: 'soft-cafe-mysuru',
    title: 'Soft Café',
    categories: ['Hospitality'],
    role: 'Design + Fabrication + Construction',
    size: '1,800 SF',
    timeline: '5 Months',
    location: 'Mysuru, Karnataka',
    href: projectPath('soft-cafe-mysuru'),
    services: [
      'Interior Design',
      'Custom Millwork',
      'Lighting Design',
      'Site Execution',
    ],
    headline: 'A warm hospitality interior built for service speed and guest comfort.',
    summary: [
      'Soft Café called for a compact hospitality fit-out in Mysuru that feels inviting at the counter and efficient behind it. Peak-hour service, photo-ready seating, and durable finishes had to coexist in a footprint that cannot afford wasted circulation.',
      'We shaped seating density, service lines, and material choices around how staff actually move - order, plate, clear, reset. Custom counters and display millwork were fabricated to integrate equipment cleanly so the front-of-house never looks like a patchwork of machines.',
      'Lighting and material contrast guide guests from entry to order to seating, keeping the room readable and calm even when busy. Warm hospitality tones soften the commercial brief without compromising wipe-down surfaces at the bar and service edge.',
      'Banquette and loose seating were mixed to give couples, small groups, and solo guests different options. Acoustic softness in seating zones reduces clatter so conversation stays comfortable during lunch rushes.',
      'Behind the scenes, storage and prep adjacency were planned so restocking does not cut through guest paths. Durable laminates and sealed edges handle high footfall without looking cold or institutional.',
      'Design, fabrication, and installation were handled by one Space Solution team so detailing stayed consistent from drawings to site - a critical advantage when hospitality openings cannot absorb rework delays.',
    ],
    scope: [
      'Hospitality space planning and guest flow',
      'Custom service counter and display millwork',
      'Seating zones, bar edge, and finish package',
      'Lighting layers for day and evening service',
      'Fabrication and site installation coordination',
    ],
    faqs: [
      {
        question: 'Can café furniture and counters be fabricated in-house?',
        answer:
          'Yes. Soft Café’s custom counters, display millwork, and key joinery were fabricated by Space Solution so profiles and finishes matched the approved design.',
      },
      {
        question: 'How do you plan for peak-hour service?',
        answer:
          'We map order, pickup, seating, and clearing paths early, then size counters and storage so staff can move without crossing guest routes during rush periods.',
      },
      {
        question: 'Can you take on a similar café brief?',
        answer:
          'Yes. Bring your shopfront size, cover target, and kitchen vendor plan. We will design front-of-house joinery and seating around how the café actually serves.',
      },
      {
        question: 'Was this a turnkey hospitality fitout?',
        answer:
          'Soft Café was delivered as a coordinated interior package - counters, display millwork, and seating - so finishes and service flow stayed under one team.',
      },
    ],
    images: [
      { src: roomImages.cafe, alt: 'Café dining and counter interior' },
      { src: heroImages.hospitality, alt: 'Hospitality dining atmosphere' },
      { src: roomImages.bar, alt: 'Bar and lounge seating' },
      { src: roomImages.cafe, alt: 'Guest seating zone' },
    ],
  },
  {
    slug: 'infotech-workspace',
    title: 'Infotech Workspace',
    categories: ['Commercial'],
    role: 'Full Service Design & Build',
    size: '8,500 SF',
    timeline: '7 Months',
    location: 'Bengaluru, Karnataka',
    href: projectPath('infotech-workspace'),
    services: [
      'Workspace Planning',
      'Interior Design',
      'Furniture Systems',
      'Project Management',
    ],
    headline: 'An open workplace organized for collaboration, focus, and long-term flexibility.',
    summary: [
      'This Bengaluru workspace was planned for a growing tech team that needed clear zones for focus work, meetings, and informal collaboration without wasting floor area. The client wanted a professional interior that still felt approachable for long workdays.',
      'We combined open desks with enclosed cabins and lounge pockets, using modular systems that can reconfigure as headcount changes. Circulation spines stay wide enough for movement without turning the floor into a corridor maze.',
      'Acoustic finishes, practical lighting, and durable surfaces support concentration while keeping the interior visually quiet. Meeting rooms receive stronger sound control; open zones use softer treatments so collaboration does not overwhelm neighboring desks.',
      'Breakout and pantry adjacency was deliberate - informal conversation has a place to land so it does not spill across every workstation. Furniture systems were specified for cable management and daily cleaning routines.',
      'Brand presence appears through measured material accents and reception composure rather than loud graphics. The workplace should photograph well for hiring and still feel calm at 7 p.m. on a deadline week.',
      'From layout through manufacturing and installation, Space Solution managed the full delivery so operations could move in on schedule with punch-list items closed before go-live.',
    ],
    scope: [
      'Workspace zoning and furniture systems planning',
      'Cabins, meeting rooms, and collaboration lounges',
      'Reception, pantry, and support rooms',
      'Lighting, acoustics, and durable finish package',
      'Project management through installation handover',
    ],
    faqs: [
      {
        question: 'Is the layout flexible for future headcount changes?',
        answer:
          'Yes. Modular desk systems and reconfigurable meeting rooms were specified so the floor can adapt without a full rebuild when teams grow or shift.',
      },
      {
        question: 'Do you handle commercial project management end to end?',
        answer:
          'For Infotech Workspace we managed design, procurement coordination, and site installation as one timeline so IT move-in and interiors stayed aligned.',
      },
      {
        question: 'Can you deliver a similar office floor?',
        answer:
          'Yes. Share headcount, cabin needs, and your move-in date. We will plan workstations, meeting rooms, and a fitout sequence that matches IT and operations.',
      },
      {
        question: 'Was furniture factory-made for this project?',
        answer:
          'Key workstations and joinery were factory-produced for consistent quality, then installed and aligned on site so the floor could open as one workplace.',
      },
    ],
    images: [
      { src: roomImages.office, alt: 'Open office workspace' },
      { src: heroImages.commercial, alt: 'Commercial workplace interior' },
      { src: projectImages.coworking, alt: 'Collaboration and coworking zone' },
      { src: roomImages.office, alt: 'Focus desks and circulation' },
    ],
  },
  {
    slug: 'wellness-studio',
    title: 'Wellness Studio',
    categories: ['Wellness'],
    role: 'Design & Fabrication',
    size: '1,200 SF',
    timeline: '3 Months',
    location: 'Mandya, Karnataka',
    href: projectPath('wellness-studio'),
    services: ['Interior Design', 'Custom Fabrication', 'Lighting Design'],
    headline: 'A quiet wellness interior designed for calm routines and clear wayfinding.',
    summary: [
      'The Wellness Studio in Mandya needed a soft, orderly interior that separates reception, consultation, and treatment without feeling closed or clinical. Guests should understand where to wait and where to go with almost no verbal direction.',
      'Neutral materials, measured lighting, and custom joinery keep the rooms calm while remaining easy to maintain between appointments. Soft hospitality cues - warm tones, quiet seating, uncluttered surfaces - reduce arrival stress.',
      'Circulation is simple and intuitive: reception anchors the entry, treatment rooms sit behind a soft threshold, and support storage stays out of guest sightlines. Lighting levels shift gently from lobby brightness to quieter treatment ambience.',
      'Custom cabinetry supports linen, product, and equipment storage so rooms reset quickly. Surfaces were chosen for hygiene and wipe-down care without defaulting to a cold clinic look.',
      'Acoustic softness and door hardware detailing help sessions feel private even in a compact footprint. The brand identity appears through finish discipline rather than decorative clutter.',
      'Space Solution delivered design and fabrication as a coordinated package, keeping the three-month timeline realistic from first layout to install.',
    ],
    scope: [
      'Reception, consultation, and treatment zoning',
      'Custom cabinetry and soft seating joinery',
      'Calm lighting and finish selection',
      'Fabrication and site installation',
    ],
    faqs: [
      {
        question: 'How do you keep a wellness space from feeling clinical?',
        answer:
          'We use warm neutrals, soft lighting layers, and hospitality seating cues while still specifying wipeable, durable surfaces for hygiene and daily reset.',
      },
      {
        question: 'Can treatment rooms share a compact footprint?',
        answer:
          'Yes. Clear thresholds, acoustic care, and storage planning allow multiple rooms to work efficiently without visual clutter in the guest path.',
      },
      {
        question: 'Do you take on similar salon or wellness studios?',
        answer:
          'Yes. Bring your treatment-room count, hygiene needs, and brand palette. We will plan reception, rooms, and storage for daily reset.',
      },
      {
        question: 'How long did this studio take?',
        answer:
          'Wellness Studio ran about three months from brief and measure through fabrication and installation - a compact hospitality-grade fitout.',
      },
    ],
    images: [
      { src: roomImages.salon, alt: 'Wellness salon treatment interior' },
      { src: heroImages.hospitality, alt: 'Calm hospitality-inspired lounge' },
      { src: roomImages.salon, alt: 'Reception and consultation zone' },
    ],
  },
  {
    slug: 'heritage-home',
    title: 'Heritage Home',
    categories: ['Residential'],
    role: 'Full Service Design & Build',
    size: '3,600 SF',
    timeline: '6 Months',
    location: 'Madikeri, Karnataka',
    href: projectPath('heritage-home'),
    services: [
      'Residential Design',
      'Modular Kitchen',
      'Custom Storage',
      'Turnkey Fit-Out',
    ],
    headline: 'A hill-station home interiors package with warmth, storage, and lasting finishes.',
    summary: [
      'Heritage Home in Madikeri combines family living needs with a material palette suited to cooler weather and weekend hosting. The house needed to feel generous for gatherings yet restful when only the core family is home.',
      'Kitchen, bedrooms, and living volumes were planned for generous storage without crowding the rooms. In-house modular systems keep details aligned across floors so the villa reads as one continuous design language.',
      'Layered lighting and natural textures create a restful mood while remaining practical for daily use. Living-dining adjacency supports hosting; quieter bedroom suites hold wardrobe and dressing storage away from the social core.',
      'Finish choices lean warm - wood tones, soft neutrals, and durable kitchen surfaces that handle hill-station humidity and guest traffic. Full-home planning meant electrical and ceiling decisions happened before furniture production, not after.',
      'Outdoor connection and window light guided furniture placement so views stay open and seating never blocks the best daylight. Storage for seasonal items was absorbed into tall units rather than freestanding clutter.',
      'Space Solution delivered design through installation as a single coordinated scope, giving the owners a turnkey interior ready for both everyday living and holiday hosting.',
    ],
    scope: [
      'Villa-wide space planning and material palette',
      'Modular kitchen and utility coordination',
      'Bedroom suites, wardrobes, and living storage',
      'Lighting, ceiling, and finish execution',
      'Turnkey factory production and site install',
    ],
    faqs: [
      {
        question: 'Was the kitchen custom modular or off-the-shelf?',
        answer:
          'The kitchen was custom modular, manufactured in-house to the approved layout so carcass, shutters, and storage internals matched the Madikeri home’s dimensions.',
      },
      {
        question: 'How do you plan storage for a holiday-friendly home?',
        answer:
          'We map guest bedding, seasonal clothes, and hosting ware into tall units and bedroom wardrobes so living rooms stay clear when the house is full.',
      },
      {
        question: 'Do you work on homes outside Mysuru?',
        answer:
          'Yes. Heritage Home was delivered in Madikeri. We regularly take residential projects across Karnataka once site access and logistics are clear.',
      },
      {
        question: 'How would a similar villa project start?',
        answer:
          'Share plans, rooms in scope, and when you want to move in. We measure, lock 3D and materials, then manufacture and install as one home programme.',
      },
    ],
    images: [
      { src: projectImages.villa, alt: 'Heritage home villa interior' },
      { src: roomImages.livingDining, alt: 'Living and dining hall' },
      { src: roomImages.modularKitchen, alt: 'Modular kitchen in warm finishes' },
      { src: roomImages.bedroom, alt: 'Bedroom suite' },
      { src: roomImages.fullHome, alt: 'Full-home interiors overview' },
    ],
  },
  {
    slug: 'retail-pop-up',
    title: 'Retail Pop-Up',
    categories: ['Pop-Up Events', 'Commercial'],
    role: 'Design & Fabrication',
    size: '600 SF',
    timeline: '6 Weeks',
    location: 'Bengaluru, Karnataka',
    href: projectPath('retail-pop-up'),
    services: ['Pop-Up Design', 'Fabrication', 'Install Coordination'],
    headline: 'A fast-turn retail pop-up built to install cleanly and read strongly on day one.',
    summary: [
      'This Bengaluru pop-up needed a clear brand presence in a small footprint, with display systems that assemble quickly and photograph well for launch day. Permanent construction was not an option - modular clarity was.',
      'We designed modular walls, counters, and lighting that ship and install with minimal site disruption. Product stories read from the aisle: hero SKUs first, supporting merchandise second, checkout last.',
      'Lighting was planned for both in-person browsing and content capture, so the brand looks consistent on cameras as well as on the floor. Surfaces stay durable enough for a short, intense event calendar.',
      'Counters and storage hide packing materials and staff essentials so the guest-facing volume stays tidy through restocking. Wayfinding is almost graphical - edges, height changes, and light define zones without heavy signage clutter.',
      'Because timelines were measured in weeks, design decisions locked early and fabrication ran in parallel with site coordination. The install sequence was rehearsed so opening day did not depend on improvisation.',
      'The result is a focused retail environment that feels complete without permanent construction - and can be adapted for future pop-up dates with the same modular kit.',
    ],
    scope: [
      'Pop-up concept and brand-forward layout',
      'Modular display walls and checkout counter',
      'Lighting for browse and content capture',
      'Fabrication, ship, and install coordination',
    ],
    faqs: [
      {
        question: 'How fast can a retail pop-up be delivered?',
        answer:
          'This project completed in about six weeks. Speed depends on locking the layout and materials early so fabrication can run without late design changes.',
      },
      {
        question: 'Are the modules reusable for future events?',
        answer:
          'Yes. The display system was designed as a modular kit that can be reconfigured for later pop-ups with limited site work.',
      },
      {
        question: 'Can you build a similar retail pop-up?',
        answer:
          'Yes. Lock the layout and brand finishes early. We fabricate a kit that installs quickly and can travel to the next venue.',
      },
      {
        question: 'Was this a furniture-only package?',
        answer:
          'The brief was design and fabrication of display modules - a focused commercial kit rather than a full shop fitout - so the brand could open on a short timeline.',
      },
    ],
    images: [
      { src: roomImages.retail, alt: 'Retail showroom pop-up display' },
      { src: roomImages.retail, alt: 'Product wall and browsing zone' },
      { src: heroImages.commercial, alt: 'Commercial retail atmosphere' },
    ],
  },
  {
    slug: 'boutique-hotel-lobby',
    title: 'Boutique Hotel Lobby',
    categories: ['Hospitality'],
    role: 'Design + Construction',
    size: '4,200 SF',
    timeline: '8 Months',
    location: 'Mysuru, Karnataka',
    href: projectPath('boutique-hotel-lobby'),
    services: [
      'Hospitality Design',
      'Custom Joinery',
      'Lighting Design',
      'Construction Coordination',
    ],
    headline: 'A boutique lobby that balances arrival impact with durable daily operations.',
    summary: [
      'The boutique hotel lobby in Mysuru sets the tone for guest arrival - seating, reception, and circulation needed to feel generous while staying operationally efficient through check-ins, luggage, and evening lounge use.',
      'Custom desks, lounge seating zones, and finish transitions create a composed first impression without fragile detailing. Guests should understand where to wait, where to check in, and where to sit without staff choreography.',
      'Lighting layers highlight key surfaces after dark and keep wayfinding clear through the day. Warm hospitality materials soften the volume; durable wear layers protect high-traffic edges near doors and desks.',
      'Luggage paths and staff shortcuts were planned so operations never cut through the most photogenic seating. Acoustic softness in lounge pockets supports conversation without deadening the arrival energy.',
      'Joinery and furniture proportions were tuned to the architecture - not oversized showroom pieces that shrink the room, and not sparse furniture that makes the lobby feel unfinished.',
      'We coordinated design and site execution so public areas stayed cohesive from threshold to corridor, delivering a lobby that photographs like a boutique brand and works like a daily hotel operation.',
    ],
    scope: [
      'Lobby zoning for arrival, seating, and circulation',
      'Reception desk and custom hospitality joinery',
      'Lounge seating and finish transitions',
      'Day/evening lighting layers',
      'Construction coordination through handover',
    ],
    faqs: [
      {
        question: 'How do you balance lobby drama with durability?',
        answer:
          'Impact comes from composition, lighting, and a few hero materials. High-touch edges and floors get tougher specifications so the look survives daily hotel traffic.',
      },
      {
        question: 'Was construction coordinated with hotel operations?',
        answer:
          'Yes. Sequencing and access were planned with the site team so public-area work stayed aligned with the overall hotel programme.',
      },
      {
        question: 'Do you take on similar hotel public areas?',
        answer:
          'Yes. Share lobby size, seating capacity, and opening programme. We will plan reception, lounge, and durable finishes for daily hotel traffic.',
      },
      {
        question: 'How long did the lobby programme take?',
        answer:
          'Boutique Hotel Lobby ran about eight months, coordinated with the wider hotel construction so arrival spaces were ready with the rest of the building.',
      },
    ],
    images: [
      { src: roomImages.hotel, alt: 'Boutique hotel lobby seating' },
      { src: heroImages.hospitality, alt: 'Hospitality lounge atmosphere' },
      { src: roomImages.hotel, alt: 'Reception and arrival zone' },
      { src: roomImages.bar, alt: 'Lobby lounge seating detail' },
    ],
  },
  {
    slug: 'clinic-fitout',
    title: 'Clinic Fit-Out',
    categories: ['Wellness', 'Commercial'],
    role: 'Full Service Design & Build',
    size: '2,100 SF',
    timeline: '4.5 Months',
    location: 'Mysuru, Karnataka',
    href: projectPath('clinic-fitout'),
    services: [
      'Clinic Planning',
      'Interior Design',
      'Custom Cabinetry',
      'Turnkey Execution',
    ],
    headline: 'A clinic interior planned for patient comfort, staff workflow, and easy upkeep.',
    summary: [
      'Clinic Fit-Out in Mysuru organizes waiting, consultation, and support rooms so patients move calmly and staff can work without friction. The brief asked for hygiene-ready surfaces that still feel approachable on arrival.',
      'Materials favor durability and wipe-down care while warm neutrals keep the interior from reading as harsh. Custom cabinetry supports records, equipment, and consumables so counters stay clear during busy clinic hours.',
      'Clear sightlines and lighting reduce stress at arrival and keep rooms functional through long days. Waiting areas offer composed seating density; consultation rooms prioritize privacy, acoustics, and practical exam clearances.',
      'Staff workflows - entry, triage adjacency, consult, and exit - guided the plan more than decorative trends. Support rooms and a compact pantry sit out of the patient path but close enough for efficient resets.',
      'Electrical, plumbing adjacency, and storage depths were resolved in design so site installation did not invent workarounds. Signage and thresholds stay minimal; the architecture of the plan does most of the wayfinding.',
      'Space Solution delivered the fit-out end to end - planning, fabrication, and installation - so the clinic could open with a coherent interior and a closed punch list.',
    ],
    scope: [
      'Patient flow and clinic room planning',
      'Waiting, consultation, and support interiors',
      'Custom cabinetry for storage and equipment',
      'Hygienic, warm finish package',
      'Turnkey installation and handover',
    ],
    faqs: [
      {
        question: 'Can clinic interiors feel warm without sacrificing hygiene?',
        answer:
          'Yes. We pair wipeable, durable surfaces with warmer neutrals, soft lighting, and calm seating so the clinic feels approachable while remaining easy to maintain.',
      },
      {
        question: 'Do you plan staff workflow as well as patient areas?',
        answer:
          'Always. Support rooms, storage, and circulation are designed around how staff actually move, not only how the waiting area looks.',
      },
      {
        question: 'Can you deliver a similar clinic fitout?',
        answer:
          'Yes. Bring your room list, specialty, and patient flow. We will plan waiting, consultation, and support rooms as one healthcare interior.',
      },
      {
        question: 'How long did this clinic take?',
        answer:
          'Clinic Fit-Out ran about four and a half months from measure and design through factory production and site handover.',
      },
    ],
    images: [
      { src: roomImages.clinic, alt: 'Clinic waiting and healthcare interior' },
      { src: roomImages.clinic, alt: 'Consultation-ready clinic room' },
      { src: heroImages.institutional, alt: 'Institutional healthcare atmosphere' },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectNeighbors(slug: string): {
  previous: ProjectItem | null;
  next: ProjectItem | null;
} {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : projects[0],
  };
}
