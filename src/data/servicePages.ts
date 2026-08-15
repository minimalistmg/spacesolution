import type { ImageMetadata } from 'astro';
import type { IconName } from './iconPaths';
import { cutoutImages, heroImages, projectImages, roomImages, studioImages } from './images';

export type ServiceActivePage = 'home-interiors' | 'commercial' | 'institutional' | 'hospitality';

export interface ServiceBlock {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  image: ImageMetadata;
  reverse?: boolean;
}

export interface ServiceCard {
  icon: IconName;
  title: string;
  description: string;
}

export interface ServiceTable {
  headers: string[];
  rows: string[][];
}

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceRelatedLink {
  label: string;
  href: string;
}

export interface ServicePastelCard {
  title: string;
  description: string;
  href: string;
  image: ImageMetadata;
  tone?: 'blue' | 'peach' | 'yellow' | 'sage' | 'sand' | 'mist';
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceGalleryItem {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

export interface ServiceGalleryHeroShot {
  src: ImageMetadata;
  alt: string;
  /** CSS object-position, e.g. "14% 50%" for same-project crops. */
  position?: string;
}

/** Editorial three-image hero used on selected L2 service pages. */
export interface ServiceGalleryHero {
  headline: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryHref: string;
  images: [ServiceGalleryHeroShot, ServiceGalleryHeroShot, ServiceGalleryHeroShot];
}

/** Panoramic L2 hero — full-bleed lifestyle still with a three-column proof bar. */
export interface ServiceVistaHero {
  headline: string;
  kicker: string;
  description: string;
  statValue: string;
  statLabel: string;
  image: ServiceGalleryHeroShot;
  category: ServiceActivePage;
}

export interface ServicePageData {
  slug: string;
  metaDescription: string;
  seoTitle?: string;
  activePage: ServiceActivePage;
  breadcrumb: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: ImageMetadata;
  galleryHero?: ServiceGalleryHero;
  overview?: { label: string; title: string; description: string };
  /** Long-form SEO body paragraphs shown under the overview / intro. */
  body?: string[];
  stats?: ServiceStat[];
  blocks: ServiceBlock[];
  gallery?: ServiceGalleryItem[];
  galleryTitle?: string;
  galleryDescription?: string;
  showVideo?: boolean;
  videoTitle?: string;
  videoDescription?: string;
  cards?: ServiceCard[];
  cardsHeading?: string;
  table?: ServiceTable;
  steps?: ServiceStep[];
  faqs?: ServiceFaq[];
  faqTitle?: string;
  faqDescription?: string;
  relatedLinks?: ServiceRelatedLink[];
  relatedHeading?: string;
  /** Soft pastel product cards (e.g. residential explore-by-room). Replaces relatedLinks list when set. */
  pastelCards?: ServicePastelCard[];
}

function crumb(parent: { label: string; href: string } | null, current: string): string {
  const home = '<a href="/">Space Solution</a> <span class="breadcrumb-sep">/</span>';
  if (!parent) {
    return `${home} ${current}`;
  }
  return `${home} <a href="${parent.href}">${parent.label}</a> <span class="breadcrumb-sep">/</span> ${current}`;
}

const residentialParent = { label: 'Residential Interiors', href: '/residential-interiors' };
const commercialParent = { label: 'Commercial Interiors', href: '/commercial-interiors' };
const institutionalParent = { label: 'Institutional Interiors', href: '/institutional-interiors' };
const hospitalityParent = { label: 'Hospitality Interiors', href: '/hospitality-interiors' };

function block(
  label: string,
  title: string,
  description: string,
  bullets: string[],
  image: ImageMetadata,
  reverse?: boolean
): ServiceBlock {
  return { label, title, description, bullets, image, reverse };
}

export const residentialHub: ServicePageData = {
  slug: 'residential-interiors',
  metaDescription:
    'Residential interior design in Mysuru — modular kitchens, bedrooms, living rooms, and complete home interiors by Space Solution.',
  seoTitle: 'Residential Interiors in Mysuru & Karnataka | Space Solution',
  activePage: 'home-interiors',
  breadcrumb: crumb(null, 'Residential Interiors'),
  heroTitle: 'Residential Interiors',
  heroDescription:
    'Your home should reflect your personality. We deliver end-to-end interior solution from kitchens to bedrooms.',
  heroImage: heroImages.residential,
  overview: {
    label: 'Overview',
    title: 'Turnkey Home Interiors Designed & Built in Mysuru',
    description:
      'From modular kitchens to full-home programmes, Space Solution plans, manufactures, and installs residential interiors across Mysuru and Karnataka — one accountable team from design to handover.',
  },
  body: [
    'Looking for residential interior design in Mysuru that feels personal and finishes on schedule? Space Solution delivers turnkey home interiors — modular kitchens, wardrobes, living and dining, bedrooms, and pooja spaces — coordinated under one design language.',
    'Our factory-backed production keeps cabinet quality consistent while site teams handle civil coordination, electrical planning, and installation. Whether you are furnishing an apartment, villa, or independent house, we build around how your family actually lives.',
    'Clients across Karnataka choose us for clear timelines, moisture-resistant materials suited to Indian kitchens, and 3D visualisations before fabrication begins. Explore room-wise solution or start with a full-home programme for a single accountable handover.',
    'From first measurement to final snag list, you work with one Mysuru-based team — designers, factory craftspeople, and installers — so decisions stay aligned and delivery stays predictable.',
  ],
  stats: [
    { value: '15+', label: 'Years' },
    { value: '800+', label: 'Homes' },
    { value: '1', label: 'Factory' },
    { value: '100%', label: 'Turnkey' },
  ],
  blocks: [
    block(
      'Living & Dining',
      'The Heart of Your Home',
      'Balanced layouts that maximise seating without compromising flow.',
      ['Custom TV units, accent walls, and ergonomic sofa layouts', 'Layered lighting for day-to-evening transitions'],
      roomImages.livingDining
    ),
    block(
      'Modular Kitchen',
      'Kitchens Built for Daily Use',
      'We design kitchens around the work triangle — sink, stove, and refrigerator.',
      ['L-shaped, U-shaped, parallel, and island kitchens', 'Tandem drawers, corner carousels, and tall pantry units'],
      roomImages.modularKitchen,
      true
    ),
    block(
      'Bedrooms',
      'Your Private Sanctuary',
      'Clutter-free surfaces and calming palettes for restful spaces.',
      ['Hydraulic storage bed frames', 'Upholstered headboards and integrated vanity units'],
      roomImages.bedroom
    ),
  ],
  galleryTitle: 'Residential interiors gallery',
  galleryDescription: 'Homes, kitchens, and living spaces designed and delivered across Mysuru.',
  gallery: [
    { src: roomImages.livingDining, alt: 'Living and dining interior in Mysuru', caption: 'Living & dining' },
    { src: roomImages.modularKitchen, alt: 'Modular kitchen by Space Solution', caption: 'Modular kitchen' },
    { src: roomImages.bedroom, alt: 'Bedroom interior with storage', caption: 'Bedroom' },
    { src: projectImages.apartment, alt: 'Apartment interior project', caption: 'Apartment home' },
  ],
  showVideo: true,
  videoTitle: 'See how we design homes',
  videoDescription: 'A look at our residential process — from 3D design to factory finish and on-site installation in Mysuru.',
  table: {
    headers: ['Category', 'Best For', 'Popular Material'],
    rows: [
      ['Modular Kitchen', 'High utility / cooking', 'Marine ply / acrylic finish'],
      ['Living Room', 'Entertaining / socialising', 'Veneer / Italian marble'],
      ['Master Bedroom', 'Relaxation / privacy', 'Laminate / fabric upholstery'],
      ['Pooja Room', 'Spiritual / traditional', 'Teak wood / Corian'],
    ],
  },
  steps: [
    { title: 'Custom 3D visualisations', description: 'See your home before the first brick is laid.' },
    { title: 'Quality materials', description: 'Premium, moisture-resistant materials for longevity.' },
    { title: 'Timely delivery', description: 'Transparent timeline from design to final handover.' },
  ],
  faqTitle: 'Residential interiors FAQs',
  faqDescription: 'Common questions about home interior design and turnkey delivery in Mysuru.',
  faqs: [
    {
      question: 'Do you offer turnkey residential interiors in Mysuru?',
      answer:
        'Yes. Space Solution handles design, factory production, and site installation for modular kitchens, wardrobes, living areas, bedrooms, and full-home programmes across Mysuru and Karnataka.',
    },
    {
      question: 'How long does a typical home interior project take?',
      answer:
        'Timelines depend on scope. A modular kitchen often completes faster than a full-home fitout. After site measurement and design approval, we share a clear production and installation schedule.',
    },
    {
      question: 'Can I start with one room and expand later?',
      answer:
        'Absolutely. Many clients begin with a kitchen or wardrobe package and later extend to living, dining, and bedrooms while keeping finishes consistent.',
    },
    {
      question: 'Are materials suited to Mysuru’s climate?',
      answer:
        'We specify moisture-resistant boards, quality hardware, and finishes chosen for Indian kitchens and humid conditions — fabricated in our factory for consistent quality.',
    },
  ],
  relatedHeading: 'Explore by room',
  relatedLinks: [
    { label: 'Modular Kitchen', href: '/modular-kitchen' },
    { label: 'Wardrobes & Storage', href: '/wardrobes-storage' },
    { label: 'Living & Dining', href: '/living-dining' },
    { label: 'Bedrooms', href: '/bedrooms' },
    { label: 'Pooja Room', href: '/pooja-room' },
    { label: 'Full Home Interiors', href: '/full-home-interiors' },
  ],
  pastelCards: [
    {
      title: 'Modular Kitchen',
      description: 'Layouts and storage built for how you cook every day.',
      href: '/modular-kitchen',
      image: cutoutImages.kitchen,
      tone: 'peach',
    },
    {
      title: 'Wardrobes & Storage',
      description: 'Closets and storage systems that stay calm and organised.',
      href: '/wardrobes-storage',
      image: cutoutImages.wardrobe,
      tone: 'blue',
    },
    {
      title: 'Living & Dining',
      description: 'Seating, flow, and lighting for the heart of the home.',
      href: '/living-dining',
      image: cutoutImages.sofa,
      tone: 'yellow',
    },
    {
      title: 'Bedrooms',
      description: 'Restful suites with storage beds and soft finishes.',
      href: '/bedrooms',
      image: cutoutImages.bed,
      tone: 'sage',
    },
    {
      title: 'Pooja Room',
      description: 'Quiet mandir spaces with warm timber and clean light.',
      href: '/pooja-room',
      image: cutoutImages.pooja,
      tone: 'sand',
    },
    {
      title: 'Full Home Interiors',
      description: 'One design language from kitchen to bedrooms — turnkey.',
      href: '/full-home-interiors',
      image: cutoutImages.chair,
      tone: 'mist',
    },
  ],
};

export const commercialHub: ServicePageData = {
  slug: 'commercial-interiors',
  metaDescription:
    'Commercial interior design in Mysuru — office, retail, clinic, and co-working spaces by Space Solution.',
  seoTitle: 'Commercial Interiors in Mysuru & Karnataka | Space Solution',
  activePage: 'commercial',
  breadcrumb: crumb(null, 'Commercial Interiors'),
  heroTitle: 'Commercial Interiors',
  heroDescription:
    'We design and deliver commercial interiors that support daily operations and create well-structured environments.',
  heroImage: heroImages.commercial,
  overview: {
    label: 'Overview',
    title: 'Commercial Fitouts That Work Hard Every Day',
    description:
      'Office, retail, clinic, and co-working interiors planned for workflow, brand presence, and durable daily use — delivered turnkey across Mysuru and Karnataka by Space Solution.',
  },
  body: [
    'Space Solution designs and delivers commercial interiors in Mysuru for offices, clinics, retail showrooms, and co-working spaces. We focus on layouts that support real operations — not just first impressions.',
    'Our turnkey approach covers planning, furniture, partitions, storage, and coordinated finishes. Factory-made cabinetry and modular systems help projects stay consistent from boardroom to reception.',
    'Whether you are fitting out a corporate floor, a neighbourhood clinic, or a brand showroom, we balance staff efficiency, customer experience, and maintenance-friendly materials suited to high-traffic use.',
    'From concept drawings to opening day, one Mysuru-based team keeps electrical, flooring, ceilings, and furniture aligned so your commercial space opens on schedule.',
  ],
  stats: [
    { value: '15+', label: 'Years' },
    { value: '200+', label: 'Workspaces' },
    { value: '4', label: 'Segments' },
    { value: '1', label: 'Turnkey Team' },
  ],
  blocks: [
    block(
      'Corporate & Office',
      'High-Performance Workplace Design',
      'Office solution that balance well-being with operational efficiency.',
      ['Executive suites, boardrooms, and co-working spaces', 'Modular furniture and activity-based zones'],
      roomImages.office
    ),
    block(
      'Retail & Showrooms',
      'Immersive Brand Environments',
      'Retail design that maps the customer journey and increases dwell time.',
      ['Boutique retail and flagship showrooms', 'Pop-up stores and curated product displays'],
      roomImages.retail,
      true
    ),
    block(
      'Clinics & Healthcare',
      'Calm, Compliant Care Spaces',
      'Clinical interiors that support patient comfort and staff workflow.',
      ['Reception, consultation, and procedure rooms', 'Hygiene-focused materials and storage'],
      roomImages.clinic
    ),
  ],
  galleryTitle: 'Commercial interiors gallery',
  galleryDescription: 'Offices, clinics, and retail spaces delivered across Mysuru and Karnataka.',
  gallery: [
    { src: roomImages.office, alt: 'Modern office interior in Mysuru', caption: 'Office' },
    { src: roomImages.retail, alt: 'Retail showroom interior', caption: 'Retail' },
    { src: roomImages.clinic, alt: 'Clinic and healthcare interior', caption: 'Clinic' },
    { src: projectImages.coworking, alt: 'Co-working workspace fitout', caption: 'Co-working' },
  ],
  showVideo: true,
  videoTitle: 'Commercial interiors in action',
  videoDescription: 'How we plan and deliver office, retail, and clinic fitouts for brands across Mysuru.',
  cards: [
    { icon: 'building', title: 'Office Interiors', description: 'Workstations, storage, and glass partitions.' },
    { icon: 'store', title: 'Retail Interiors', description: 'Layouts for display and smooth customer flow.' },
    { icon: 'key', title: 'Turnkey Fitouts', description: 'Electrical, flooring, ceilings, and furniture — one team.' },
  ],
  faqTitle: 'Commercial interiors FAQs',
  faqDescription: 'Questions about office, retail, and clinic fitouts in Mysuru.',
  faqs: [
    {
      question: 'What commercial spaces do you design in Mysuru?',
      answer:
        'We deliver interiors for offices, clinics and healthcare, retail showrooms, and co-working spaces — including turnkey fitouts with furniture, partitions, and coordinated finishes.',
    },
    {
      question: 'Can you handle a full turnkey commercial fitout?',
      answer:
        'Yes. Space Solution coordinates design, factory furniture production, and on-site installation so electrical, flooring, ceilings, and joinery stay on one timeline.',
    },
    {
      question: 'Do you work outside Mysuru?',
      answer:
        'We primarily serve Mysuru and projects across Karnataka. Share your location and scope and we will confirm feasibility and site logistics.',
    },
    {
      question: 'How do you plan clinic and healthcare interiors?',
      answer:
        'We zone reception, waiting, consultation, and procedure areas with hygiene-focused surfaces, clear circulation, and practical storage for staff workflow.',
    },
  ],
  relatedHeading: 'Explore by space',
  relatedLinks: [
    { label: 'Office Interiors', href: '/office-interiors' },
    { label: 'Clinics & Healthcare', href: '/clinic-interiors' },
    { label: 'Retail & Showrooms', href: '/retail-interiors' },
    { label: 'Co-working', href: '/coworking-interiors' },
    { label: 'Hospitality Interiors', href: '/hospitality-interiors' },
  ],
};

export const institutionalHub: ServicePageData = {
  slug: 'institutional-interiors',
  metaDescription:
    'Institutional interior and furniture solution for schools, hostels, and labs — durable layouts by Space Solution.',
  seoTitle: 'Institutional Interiors in Mysuru & Karnataka | Space Solution',
  activePage: 'institutional',
  breadcrumb: crumb(null, 'Institutional Interiors'),
  heroTitle: 'Institutional Interiors',
  heroDescription:
    'Durable interior and furniture solution for institutions that require efficient layouts and long-term usability.',
  heroImage: heroImages.institutional,
  overview: {
    label: 'Overview',
    title: 'Built for High-Usage Spaces Across Mysuru & Karnataka',
    description:
      'Institutional spaces demand well-planned layouts, strong materials, and practical designs that handle continuous usage without frequent maintenance — delivered by Space Solution with factory-backed furniture.',
  },
  body: [
    'Schools, colleges, hostels, libraries, and labs need furniture that survives continuous daily use. Space Solution designs and manufactures institutional interiors in Mysuru with durability and space efficiency at the core.',
    'Our factory produces classroom sets, hostel beds and lockers, library shelving, and lab furniture sized for heavy occupancy. Layouts prioritise clear circulation, storage, and easy maintenance for facility teams.',
    'Whether you are equipping a new campus block or refreshing an existing hostel, we deliver practical packages with consistent quality — from single classrooms to multi-floor programmes across Karnataka.',
    'Turnkey coordination means furniture, storage, and room planning arrive as one programme, so institutions open or expand with fewer vendors and clearer accountability.',
  ],
  stats: [
    { value: '15+', label: 'Years' },
    { value: '50+', label: 'Campuses' },
    { value: '1000+', label: 'Beds & Desks' },
    { value: '1', label: 'Factory' },
  ],
  blocks: [
    block(
      'Education & Learning',
      'Classroom Solution',
      'Furniture designed for comfort, durability, and efficient space use in schools and colleges.',
      ['Classroom desks and chairs', 'Laboratory furniture and library shelving'],
      roomImages.classroom
    ),
    block(
      'Accommodation',
      'Hostel & PG Furniture',
      'Solution for student accommodation and shared living environments.',
      ['Single beds, bunk beds, and dormitory setups', 'Wardrobes, lockers, and study units'],
      roomImages.hostel,
      true
    ),
  ],
  galleryTitle: 'Institutional interiors gallery',
  galleryDescription: 'Classrooms, hostels, and learning spaces built for continuous use.',
  gallery: [
    { src: roomImages.classroom, alt: 'Classroom furniture in Mysuru school', caption: 'Classroom' },
    { src: roomImages.hostel, alt: 'Hostel and PG furniture', caption: 'Hostel' },
    { src: roomImages.libraryLab, alt: 'Library and laboratory furniture', caption: 'Library & lab' },
    { src: heroImages.institutional, alt: 'Institutional interior project', caption: 'Campus spaces' },
  ],
  showVideo: true,
  videoTitle: 'Institutional furniture that lasts',
  videoDescription: 'How Space Solution builds durable classroom, hostel, and lab solution for Mysuru campuses.',
  cards: [
    { icon: 'bed', title: 'Student Hostels', description: 'Bunk beds, lockers, and shared study desks.' },
    { icon: 'house', title: 'PG Accommodations', description: 'Compact beds, wardrobes, and study tables.' },
    { icon: 'school', title: 'Schools & Colleges', description: 'Desks, lab furniture, and library shelving.' },
  ],
  faqTitle: 'Institutional interiors FAQs',
  faqDescription: 'Questions about school, hostel, and lab furniture in Mysuru.',
  faqs: [
    {
      question: 'What institutional furniture do you supply in Mysuru?',
      answer:
        'We design and manufacture classroom desks and chairs, hostel and PG beds with lockers, library shelving, reading tables, and laboratory furniture for schools and colleges.',
    },
    {
      question: 'Is your furniture built for heavy daily use?',
      answer:
        'Yes. Institutional pieces are specified for continuous occupancy — strong frames, practical finishes, and layouts that facility teams can maintain easily.',
    },
    {
      question: 'Can you furnish an entire hostel or classroom block?',
      answer:
        'We deliver packaged programmes for dormitories, classrooms, and labs with consistent specifications across rooms — ideal for campus expansions across Karnataka.',
    },
    {
      question: 'Do you offer turnkey institutional interiors?',
      answer:
        'Depending on scope, we can coordinate furniture supply with room planning and installation so institutions work with one accountable Mysuru-based team.',
    },
  ],
  relatedHeading: 'Explore by space',
  relatedLinks: [
    { label: 'Schools & Colleges', href: '/school-interiors' },
    { label: 'Hostel & PG Furniture', href: '/hostel-furniture' },
    { label: 'Libraries & Labs', href: '/library-lab-interiors' },
  ],
};

export const hospitalityHub: ServicePageData = {
  slug: 'hospitality-interiors',
  metaDescription:
    'Hospitality interior design in Mysuru — cafés, restaurants, hotels, bars, and wellness spaces by Space Solution.',
  seoTitle: 'Hospitality Interiors in Mysuru & Karnataka | Space Solution',
  activePage: 'hospitality',
  breadcrumb: crumb(null, 'Hospitality Interiors'),
  heroTitle: 'Hospitality Interiors',
  heroDescription:
    'Cafés, hotels, and restaurants — front of house to kitchen, built to open on schedule.',
  heroImage: heroImages.hospitality,
  overview: {
    label: 'Overview',
    title: 'Hospitality Spaces Built for Guests & Operations in Mysuru',
    description:
      'Hospitality design balances guest experience with back-of-house efficiency — from mood lighting and seating to kitchen flow and durable finishes — delivered turnkey by Space Solution.',
  },
  body: [
    'From cafés and restaurants to hotels, bars, and wellness studios, Space Solution creates hospitality interiors in Mysuru that feel distinctive and run efficiently every service.',
    'We plan front-of-house atmosphere alongside kitchen, service, and storage flow so openings stay on schedule. Factory-made joinery and furniture packages keep finish quality consistent across rooms and floors.',
    'Whether you are launching Soft Café–style dining, a boutique lobby, or a salon suite, durable materials and clear zoning help staff deliver a smoother guest experience.',
    'Our turnkey hospitality programmes cover design, production, and installation across Mysuru and Karnataka — one team from concept to opening day.',
  ],
  stats: [
    { value: '15+', label: 'Years' },
    { value: '100+', label: 'Venues' },
    { value: 'FOH+BOH', label: 'Planned Together' },
    { value: '1', label: 'Opening Team' },
  ],
  blocks: [
    block(
      'Cafés & Restaurants',
      'Spaces People Return To',
      'Warm, operational layouts for cafés, QSR, and full-service dining.',
      ['Front-of-house seating and counter design', 'Kitchen and service line planning'],
      roomImages.cafe
    ),
    block(
      'Hotels & Resorts',
      'Lobby to Room Consistency',
      'Cohesive interiors across lobbies, guest rooms, and amenity spaces.',
      ['Reception and lounge fitouts', 'Guest room furniture and wardrobes'],
      roomImages.hotel,
      true
    ),
    block(
      'Bars & Wellness',
      'Mood-Led Environments',
      'Bars, lounges, salons, and wellness studios with strong atmosphere.',
      ['Back-bar engineering and accent lighting', 'Treatment rooms and retail display'],
      roomImages.salon
    ),
  ],
  galleryTitle: 'Hospitality interiors gallery',
  galleryDescription: 'Cafés, hotels, bars, and wellness spaces across Mysuru.',
  gallery: [
    { src: roomImages.cafe, alt: 'Café and restaurant interior in Mysuru', caption: 'Café & restaurant' },
    { src: roomImages.hotel, alt: 'Hotel lobby and hospitality interior', caption: 'Hotel' },
    { src: roomImages.bar, alt: 'Bar and lounge interior', caption: 'Bar & lounge' },
    { src: roomImages.salon, alt: 'Salon and wellness studio interior', caption: 'Salon & wellness' },
  ],
  showVideo: true,
  videoTitle: 'Hospitality interiors that open on time',
  videoDescription: 'Front-of-house atmosphere and back-of-house planning for Mysuru hospitality brands.',
  cards: [
    { icon: 'store', title: 'Cafés & Restaurants', description: 'Soft Café Mysuru and more — see our portfolio.' },
    { icon: 'building', title: 'Hotels & Resorts', description: 'Lobbies, rooms, and F&B within one programme.' },
    { icon: 'key', title: 'Turnkey hospitality', description: 'One team from design to opening day.' },
  ],
  faqTitle: 'Hospitality interiors FAQs',
  faqDescription: 'Common questions about café, hotel, bar, and salon fitouts in Mysuru.',
  faqs: [
    {
      question: 'Do you design cafés and restaurants in Mysuru?',
      answer:
        'Yes. We plan seating, counters, lighting, and kitchen coordination for cafés, QSR, and full-service restaurants — including projects like Soft Café Mysuru in our portfolio.',
    },
    {
      question: 'Can you deliver hotel interiors turnkey?',
      answer:
        'We deliver lobby, lounge, guest room, and amenity programmes with consistent furniture and finish packages so boutique hotels open with one accountable team.',
    },
    {
      question: 'How do you balance atmosphere with operations?',
      answer:
        'Guest-facing mood and circulation are planned together with service lines, storage, and durable finishes so staff can run busy services without constant maintenance.',
    },
    {
      question: 'Do you work on bars and wellness studios?',
      answer:
        'Yes. Bars and lounges get back-bar engineering and accent lighting; salons and wellness spaces get calm treatment rooms, reception, and retail display planning.',
    },
  ],
  relatedHeading: 'Explore by space',
  relatedLinks: [
    { label: 'Cafés & Restaurants', href: '/cafe-restaurant-interiors' },
    { label: 'Hotels & Resorts', href: '/hotel-interiors' },
    { label: 'Bars & Lounges', href: '/bar-lounge-interiors' },
    { label: 'Salons & Wellness', href: '/salon-wellness-interiors' },
  ],
};

export const serviceLandingPages: ServicePageData[] = [
  {
    slug: 'modular-kitchen',
    metaDescription: 'Modular kitchen design and installation in Mysuru — factory-made cabinets, acrylic & BWP finishes.',
    seoTitle: 'Modular Kitchen in Mysuru & Karnataka | Space Solution',
    activePage: 'home-interiors',
    breadcrumb: crumb(residentialParent, 'Modular Kitchen'),
    heroTitle: 'Modular Kitchen',
    heroDescription: 'Factory-made kitchens designed around how you cook, store, and move every day.',
    heroImage: roomImages.modularKitchen,
    body: [
      'A modular kitchen in Mysuru should handle daily Indian cooking — heat, spice, and frequent cleaning — without looking tired after a year. Space Solution designs factory-made kitchens around your work triangle and storage habits.',
      'Choose L-shaped, U-shaped, parallel, or island layouts with tandem drawers, corner solution, and tall pantries. We specify acrylic, laminate, and BWP boards with soft-close hardware built for real use.',
      'Our turnkey kitchen programmes cover design, counter options (quartz or granite), and installation so cabinets arrive consistent from the factory and fit cleanly on site.',
      'Whether you are renovating an apartment kitchen or planning a villa island, you get clear timelines and one Mysuru-based team accountable from measurement to handover.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '500+', label: 'Kitchens' },
      { value: '4', label: 'Layout Types' },
      { value: 'Factory', label: 'Made' },
    ],
    blocks: [
      block(
        'Design',
        'Kitchens Built for Daily Use',
        'Layouts based on the work triangle with storage where you need it.',
        ['L-shaped, U-shaped, parallel, and island kitchens', 'Tandem drawers and tall pantry units'],
        roomImages.modularKitchen
      ),
      block(
        'Materials',
        'Finishes That Last',
        'Acrylic, laminate, and BWP boards suited to Indian cooking conditions.',
        ['Soft-close hardware and corner solution', 'Quartz and granite counter options'],
        studioImages.craft,
        true
      ),
    ],
    galleryTitle: 'Modular kitchen gallery',
    galleryDescription: 'Factory-finished kitchens designed for Mysuru homes.',
    gallery: [
      { src: roomImages.modularKitchen, alt: 'Modular kitchen interior in Mysuru', caption: 'Daily-use kitchen' },
      { src: projectImages.modularKitchen, alt: 'Factory-made modular kitchen project', caption: 'Project kitchen' },
      { src: heroImages.kitchen1, alt: 'Kitchen design with modern finishes', caption: 'Modern finish' },
      { src: studioImages.craft, alt: 'Factory craftsmanship for kitchen cabinets', caption: 'Factory craft' },
    ],
    showVideo: true,
    videoTitle: 'Modular kitchens from our factory',
    videoDescription: 'How we design, manufacture, and install modular kitchens for homes in Mysuru.',
    faqTitle: 'Modular kitchen FAQs',
    faqDescription: 'Answers about layouts, materials, and installation in Mysuru.',
    faqs: [
      {
        question: 'What modular kitchen layouts do you offer?',
        answer:
          'We design L-shaped, U-shaped, parallel, and island kitchens based on your room size, plumbing points, and how you cook every day.',
      },
      {
        question: 'Are cabinets factory-made?',
        answer:
          'Yes. Cabinets are manufactured in our factory for consistent quality, then installed on site in Mysuru with coordinated counters and hardware.',
      },
      {
        question: 'Which finishes work best for Indian cooking?',
        answer:
          'We commonly specify acrylic, laminate, and BWP boards with soft-close hardware — materials chosen for moisture, cleaning, and everyday durability.',
      },
      {
        question: 'Can a modular kitchen be part of a full-home project?',
        answer:
          'Absolutely. Many clients start with the kitchen and extend to wardrobes and living spaces under one turnkey residential programme.',
      },
    ],
  },
  {
    slug: 'wardrobes-storage',
    metaDescription: 'Custom wardrobes and storage solution in Mysuru — sliding, hinged, and walk-in designs.',
    seoTitle: 'Wardrobes & Storage in Mysuru & Karnataka | Space Solution',
    activePage: 'home-interiors',
    breadcrumb: crumb(residentialParent, 'Wardrobes & Storage'),
    heroTitle: 'Wardrobes & Storage',
    heroDescription: 'Floor-to-ceiling storage tailored to your room, routine, and belongings.',
    heroImage: roomImages.bedroom,
    body: [
      'Clutter disappears when storage matches how you dress and organise. Space Solution designs custom wardrobes in Mysuru — sliding, hinged, walk-in, and loft systems — sized to your room and ceiling height.',
      'Internal layouts balance hanging, folding, shoes, and accessories so every inch works. Factory-made carcasses keep finish quality consistent across bedrooms.',
      'Pair wardrobes with storage beds and vanity units for a calm, coordinated bedroom programme, or add loft storage where ceiling height allows.',
      'As part of our turnkey residential interiors, wardrobe packages can align materials with your kitchen and living joinery for a cohesive home across Mysuru and Karnataka.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '600+', label: 'Wardrobes' },
      { value: 'Floor–Ceiling', label: 'Storage' },
      { value: 'Custom', label: 'Internals' },
    ],
    blocks: [
      block(
        'Wardrobes',
        'Every Inch Counts',
        'Internal layouts for hanging, folding, shoes, and accessories.',
        ['Sliding and hinged door systems', 'Walk-in and loft storage'],
        roomImages.bedroom
      ),
    ],
    galleryTitle: 'Wardrobe & storage gallery',
    galleryDescription: 'Custom bedroom storage designed for Mysuru homes.',
    gallery: [
      { src: roomImages.bedroom, alt: 'Bedroom wardrobe and storage interior', caption: 'Bedroom storage' },
      { src: heroImages.bedroom, alt: 'Custom wardrobe design', caption: 'Wardrobe detail' },
      { src: roomImages.fullHome, alt: 'Full home storage coordination', caption: 'Coordinated home' },
      { src: projectImages.villa, alt: 'Villa bedroom storage project', caption: 'Villa project' },
    ],
    showVideo: true,
    videoTitle: 'Storage that fits your routine',
    videoDescription: 'Custom wardrobes and loft storage planned for real Mysuru bedrooms.',
    faqTitle: 'Wardrobe FAQs',
    faqDescription: 'Questions about custom wardrobes and storage in Mysuru.',
    faqs: [
      {
        question: 'Do you offer sliding and hinged wardrobes?',
        answer:
          'Yes. We design both sliding and hinged systems, plus walk-in and loft storage based on room width, ceiling height, and access.',
      },
      {
        question: 'Can internals be customised for my clothes?',
        answer:
          'Internals are planned around hanging lengths, shelves, drawers, shoes, and accessories so the wardrobe matches your daily routine.',
      },
      {
        question: 'Are wardrobes made in your factory?',
        answer:
          'Carcasses and panels are factory-produced for consistent finish quality, then installed and aligned on site in Mysuru.',
      },
      {
        question: 'Can wardrobes match my kitchen finishes?',
        answer:
          'In full-home programmes we coordinate materials and colours across kitchens, wardrobes, and living joinery for a unified look.',
      },
    ],
  },
  {
    slug: 'living-dining',
    metaDescription: 'Living and dining room interiors in Mysuru — TV units, seating layouts, and accent walls.',
    seoTitle: 'Living & Dining Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'home-interiors',
    breadcrumb: crumb(residentialParent, 'Living & Dining'),
    heroTitle: 'Living & Dining',
    heroDescription: 'Welcoming spaces for family time, guests, and everyday relaxation.',
    heroImage: roomImages.livingDining,
    body: [
      'Living and dining rooms set the tone for how guests experience your home. In Mysuru, Space Solution designs seating layouts, TV units, dining storage, and accent walls that balance comfort with clear circulation.',
      'We plan layered lighting for day-to-evening use, display niches for your collections, and furniture placement that keeps pathways open — especially important in apartments.',
      'Materials and joinery can coordinate with your modular kitchen and bedrooms under a turnkey residential programme, so the whole home feels intentional.',
      'From compact living rooms to open-plan villa spaces across Karnataka, we focus on practical elegance that works every day — not just for photographs.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '400+', label: 'Living Spaces' },
      { value: 'Open Plan', label: 'Ready' },
      { value: 'Custom', label: 'TV Units' },
    ],
    blocks: [
      block(
        'Living',
        'The Heart of Your Home',
        'Balanced seating, circulation, and focal points.',
        ['Custom TV units and display niches', 'Layered lighting for day to evening'],
        projectImages.apartment
      ),
    ],
    galleryTitle: 'Living & dining gallery',
    galleryDescription: 'Welcoming living and dining spaces across Mysuru homes.',
    gallery: [
      { src: roomImages.livingDining, alt: 'Living and dining room interior in Mysuru', caption: 'Living & dining' },
      { src: projectImages.apartment, alt: 'Apartment living room project', caption: 'Apartment living' },
      { src: projectImages.villa, alt: 'Villa living and dining interior', caption: 'Villa living' },
      { src: projectImages.homeInterior3, alt: 'Home interior living space', caption: 'Home interior' },
    ],
    showVideo: true,
    videoTitle: 'Living spaces that feel lived-in',
    videoDescription: 'How we plan seating, lighting, and joinery for Mysuru living and dining rooms.',
    faqTitle: 'Living & dining FAQs',
    faqDescription: 'Common questions about living and dining interiors in Mysuru.',
    faqs: [
      {
        question: 'Can you design living and dining for compact apartments?',
        answer:
          'Yes. We prioritise circulation, multi-use storage, and scaled furniture so smaller Mysuru apartments feel open and functional.',
      },
      {
        question: 'Do you build custom TV units and dining storage?',
        answer:
          'Custom TV units, display niches, and dining sideboards are part of our residential joinery — factory-made for consistent finish quality.',
      },
      {
        question: 'Can living finishes match the rest of the home?',
        answer:
          'In full-home turnkey projects we align colours, materials, and detailing across living, kitchen, and bedrooms.',
      },
      {
        question: 'Do you plan lighting with the furniture layout?',
        answer:
          'Layered lighting is planned with seating and focal points so the room works from daytime family use to evening entertaining.',
      },
    ],
  },
  {
    slug: 'bedrooms',
    metaDescription: 'Bedroom interior design in Mysuru — storage beds, wardrobes, and calm, restful palettes.',
    seoTitle: 'Bedroom Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'home-interiors',
    breadcrumb: crumb(residentialParent, 'Bedrooms'),
    heroTitle: 'Bedrooms',
    heroDescription: 'Private retreats with smart storage and soothing finishes.',
    heroImage: roomImages.bedroom,
    body: [
      'A well-planned bedroom in Mysuru should feel calm the moment you walk in. Space Solution designs bedrooms with storage beds, wardrobes, headboards, and vanity units that reduce clutter without sacrificing comfort.',
      'We favour soft palettes, practical lighting, and surfaces that stay tidy — hydraulic storage beds and integrated bedside solution keep everyday items out of sight.',
      'Master suites, kids’ rooms, and guest bedrooms can share a design language while meeting different storage needs. Factory-made furniture keeps quality consistent across rooms.',
      'Include bedrooms in a full-home turnkey programme to coordinate finishes with kitchens and living areas across your Mysuru or Karnataka residence.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '700+', label: 'Bedrooms' },
      { value: 'Storage', label: 'Beds' },
      { value: 'Calm', label: 'Palettes' },
    ],
    blocks: [
      block(
        'Bedroom',
        'Your Private Sanctuary',
        'Clutter-free surfaces and integrated storage.',
        ['Hydraulic storage beds', 'Headboards with bedside storage'],
        roomImages.bedroom
      ),
    ],
    galleryTitle: 'Bedroom interiors gallery',
    galleryDescription: 'Restful bedrooms with smart storage for Mysuru homes.',
    gallery: [
      { src: roomImages.bedroom, alt: 'Bedroom interior with storage bed', caption: 'Master bedroom' },
      { src: heroImages.bedroom, alt: 'Calm bedroom design in Mysuru', caption: 'Restful palette' },
      { src: roomImages.fullHome, alt: 'Bedroom as part of full home interiors', caption: 'Full-home suite' },
      { src: projectImages.villa, alt: 'Villa bedroom interior project', caption: 'Villa bedroom' },
    ],
    showVideo: true,
    videoTitle: 'Bedrooms designed for rest',
    videoDescription: 'Storage beds, wardrobes, and calm finishes for Mysuru bedrooms.',
    faqTitle: 'Bedroom FAQs',
    faqDescription: 'Questions about bedroom interiors and storage in Mysuru.',
    faqs: [
      {
        question: 'Do you offer storage beds and custom headboards?',
        answer:
          'Yes. Hydraulic storage beds, upholstered headboards, and bedside storage are common elements in our Mysuru bedroom programmes.',
      },
      {
        question: 'Can kids’ and guest bedrooms be included?',
        answer:
          'We design master, kids’, and guest rooms with age-appropriate storage and finishes while keeping the home’s overall material story consistent.',
      },
      {
        question: 'Are bedroom furniture pieces factory-made?',
        answer:
          'Wardrobes, beds, and vanity units are typically factory-produced for durability and finish consistency, then installed on site.',
      },
      {
        question: 'How do you keep bedrooms feeling calm?',
        answer:
          'We reduce visual clutter with integrated storage, soft palettes, and lighting planned for winding down — not just for display.',
      },
    ],
  },
  {
    slug: 'pooja-room',
    metaDescription: 'Pooja room design in Mysuru — traditional mandir units in teak, Corian, and laminate.',
    seoTitle: 'Pooja Room Design in Mysuru & Karnataka | Space Solution',
    activePage: 'home-interiors',
    breadcrumb: crumb(residentialParent, 'Pooja Room'),
    heroTitle: 'Pooja Room',
    heroDescription: 'Dedicated spiritual spaces with respectful proportions and durable finishes.',
    heroImage: roomImages.pooja,
    body: [
      'A pooja room deserves thoughtful proportions, respectful detailing, and finishes that last. Space Solution designs mandir units and pooja spaces for Mysuru homes — wall-mounted or floor-standing — in teak, Corian, and laminate options.',
      'We plan diya shelves, storage for puja items, and lighting that feels serene. Compact apartment niches and dedicated rooms both get careful attention to circulation and cleanliness.',
      'Materials are chosen for durability around incense, oil, and daily ritual use, while the design language can still coordinate with the rest of your residential interiors.',
      'Include your pooja space in a turnkey home programme so carpentry, finishes, and installation stay on one Mysuru-based schedule.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '300+', label: 'Pooja Spaces' },
      { value: 'Teak / Corian', label: 'Options' },
      { value: 'Custom', label: 'Mandirs' },
    ],
    blocks: [
      block(
        'Pooja',
        'Sacred Space at Home',
        'Wall-mounted and floor-standing mandir designs.',
        ['Teak, Corian, and laminate options', 'Integrated diya shelves and storage'],
        roomImages.pooja
      ),
    ],
    galleryTitle: 'Pooja room gallery',
    galleryDescription: 'Mandir units and sacred spaces for Mysuru homes.',
    gallery: [
      { src: roomImages.pooja, alt: 'Pooja room and mandir design in Mysuru', caption: 'Pooja room' },
      { src: roomImages.fullHome, alt: 'Pooja space within full home interiors', caption: 'In a full home' },
      { src: projectImages.apartment, alt: 'Apartment pooja niche design', caption: 'Apartment niche' },
      { src: studioImages.craft, alt: 'Crafted pooja unit carpentry', caption: 'Crafted unit' },
    ],
    showVideo: true,
    videoTitle: 'Pooja spaces with lasting craft',
    videoDescription: 'Mandir design and finishes for respectful home rituals in Mysuru.',
    faqTitle: 'Pooja room FAQs',
    faqDescription: 'Questions about mandir design and materials in Mysuru.',
    faqs: [
      {
        question: 'What materials do you use for pooja units?',
        answer:
          'Popular options include teak wood, Corian, and laminate — selected for durability around daily ritual use and ease of cleaning.',
      },
      {
        question: 'Can you design a compact pooja niche for an apartment?',
        answer:
          'Yes. Wall-mounted and niche designs work well in Mysuru apartments where a full room is not available.',
      },
      {
        question: 'Do you include storage for puja items?',
        answer:
          'Integrated shelves, drawers, and closed storage for diyas, utensils, and offerings are planned into most mandir designs.',
      },
      {
        question: 'Can the pooja room match our home interiors?',
        answer:
          'We can align proportions and select finishes that respect tradition while coordinating with your broader residential design language.',
      },
    ],
  },
  {
    slug: 'full-home-interiors',
    metaDescription: 'Full home interior design in Mysuru — kitchens, wardrobes, living, and bedrooms in one programme.',
    seoTitle: 'Full Home Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'home-interiors',
    breadcrumb: crumb(residentialParent, 'Full Home Interiors'),
    heroTitle: 'Full Home Interiors',
    heroDescription: 'One design language across every room — coordinated materials, colour, and storage.',
    heroImage: roomImages.fullHome,
    body: [
      'Full home interiors in Mysuru work best when one team owns the whole story — kitchen, wardrobes, living, dining, bedrooms, and pooja. Space Solution delivers turnkey residential programmes with a single design language and timeline.',
      'Factory production keeps joinery consistent from room to room, while site teams coordinate installation so handover stays accountable. You avoid juggling multiple vendors for carpentry, finishes, and storage.',
      'We start with measurement and 3D design, align materials and budgets early, then manufacture and install. Apartments, villas, and independent homes across Karnataka all benefit from this end-to-end approach.',
      'If you want one point of contact from first drawing to final snag list, a full-home turnkey programme is the clearest path to a cohesive Space Solution home.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '800+', label: 'Projects' },
      { value: 'Every Room', label: 'Coordinated' },
      { value: '1', label: 'Team' },
    ],
    blocks: [
      block(
        'Full home',
        'One Team, Every Room',
        'End-to-end residential programmes from 3D design to installation.',
        ['Kitchen, wardrobes, living, and bedrooms', 'Single timeline and accountable handover'],
        roomImages.fullHome
      ),
    ],
    galleryTitle: 'Full home interiors gallery',
    galleryDescription: 'Coordinated homes designed and delivered across Mysuru.',
    gallery: [
      { src: roomImages.fullHome, alt: 'Full home interior project in Mysuru', caption: 'Full home' },
      { src: roomImages.modularKitchen, alt: 'Kitchen within full home interiors', caption: 'Kitchen' },
      { src: roomImages.livingDining, alt: 'Living dining in full home project', caption: 'Living' },
      { src: roomImages.bedroom, alt: 'Bedroom in full home interiors', caption: 'Bedroom' },
    ],
    showVideo: true,
    videoTitle: 'One programme for the whole home',
    videoDescription: 'How Space Solution delivers turnkey full-home interiors in Mysuru.',
    faqTitle: 'Full home interiors FAQs',
    faqDescription: 'Questions about turnkey whole-home design in Mysuru.',
    faqs: [
      {
        question: 'What does a full-home interior programme include?',
        answer:
          'Typically modular kitchen, wardrobes, living and dining joinery, bedrooms, and often pooja — with coordinated materials, one timeline, and one handover.',
      },
      {
        question: 'Is full-home delivery turnkey?',
        answer:
          'Yes. Design, factory production, and site installation are managed by Space Solution so you have a single accountable team in Mysuru.',
      },
      {
        question: 'Can I phase rooms over time?',
        answer:
          'You can start with priority rooms and expand later; we keep finish standards documented so future phases match the original design language.',
      },
      {
        question: 'Do you work on apartments and villas?',
        answer:
          'We deliver full-home interiors for apartments, villas, and independent houses across Mysuru and Karnataka.',
      },
    ],
    relatedLinks: [
      { label: 'Modular Kitchen', href: '/modular-kitchen' },
      { label: 'Turnkey residential fitout', href: '/turnkey-residential-fitout' },
    ],
  },
  {
    slug: 'office-interiors',
    metaDescription: 'Office interior design in Mysuru — workstations, meeting rooms, and co-working fitouts.',
    seoTitle: 'Office Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'commercial',
    breadcrumb: crumb(commercialParent, 'Office Interiors'),
    heroTitle: 'Office Interiors',
    heroDescription: 'Workplaces that support focus, collaboration, and growth.',
    heroImage: heroImages.commercial,
    body: [
      'Office interiors in Mysuru should help teams focus, meet, and grow without constant rework. Space Solution designs workplaces with workstations, cabins, meeting rooms, and storage planned for hybrid routines.',
      'Glass partitions, modular furniture, and clear zoning create activity-based spaces — quiet focus areas alongside collaboration zones. Factory-made joinery keeps finish quality consistent across floors.',
      'Our turnkey commercial fitouts can coordinate furniture with flooring, ceilings, and electrical planning so opening or expansion stays on one timeline.',
      'From startups to established corporate floors across Karnataka, we deliver practical, professional environments built for daily performance.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '150+', label: 'Offices' },
      { value: 'Hybrid', label: 'Ready' },
      { value: 'Turnkey', label: 'Fitouts' },
    ],
    blocks: [
      block(
        'Office',
        'High-Performance Workplaces',
        'Layouts for hybrid teams, meetings, and focused work.',
        ['Workstations and executive cabins', 'Glass partitions and meeting rooms'],
        roomImages.office
      ),
    ],
    galleryTitle: 'Office interiors gallery',
    galleryDescription: 'Workplaces designed for focus and collaboration in Mysuru.',
    gallery: [
      { src: roomImages.office, alt: 'Office interior with workstations in Mysuru', caption: 'Office floor' },
      { src: heroImages.commercial, alt: 'Commercial office interior design', caption: 'Workplace' },
      { src: projectImages.coworking, alt: 'Flexible office and co-working layout', caption: 'Flexible zones' },
      { src: studioImages.craft, alt: 'Office furniture craftsmanship', caption: 'Joinery' },
    ],
    showVideo: true,
    videoTitle: 'Offices built for real workdays',
    videoDescription: 'Workstation, cabin, and meeting-room planning for Mysuru businesses.',
    faqTitle: 'Office interiors FAQs',
    faqDescription: 'Questions about workplace design and fitouts in Mysuru.',
    faqs: [
      {
        question: 'Do you design corporate offices and smaller team spaces?',
        answer:
          'Yes. We plan everything from compact team floors to multi-cabin corporate layouts with workstations, meeting rooms, and storage.',
      },
      {
        question: 'Can office interiors be delivered turnkey?',
        answer:
          'Space Solution can coordinate furniture, partitions, and related fitout elements under one timeline for Mysuru and Karnataka projects.',
      },
      {
        question: 'Do you support hybrid workplace layouts?',
        answer:
          'We zone focus work, collaboration, and meeting areas so hybrid teams have the right spaces without wasting floor area.',
      },
      {
        question: 'Are workstations and cabins factory-made?',
        answer:
          'Much of our commercial joinery and furniture is factory-produced for consistent quality, then installed and aligned on site.',
      },
    ],
  },
  {
    slug: 'admin-office-interiors',
    metaDescription:
      'Admin and staff office interiors for schools, colleges, and institutions in Mysuru — durable workstations and storage.',
    seoTitle: 'Admin & Staff Office Interiors Mysuru | Space Solution',
    activePage: 'institutional',
    breadcrumb: crumb(institutionalParent, 'Admin & Staff Offices'),
    heroTitle: 'Admin & Staff Offices',
    heroDescription: 'Back-office and admin zones planned for daily institutional use.',
    heroImage: heroImages.commercial,
    body: [
      'Admin and staff offices in schools, colleges, and campuses need durable desks, storage, and meeting space without feeling temporary. Space Solution plans institutional back-office zones with factory-made joinery and clear circulation.',
      'We coordinate workstations, filing, meeting rooms, and reception areas so admin teams can work efficiently while staying aligned with the wider campus finish palette.',
      'Turnkey institutional fitouts can include admin offices alongside classrooms and hostel furniture under one accountable team and timeline.',
    ],
    blocks: [
      block(
        'Admin offices',
        'Staff Spaces That Last',
        'Workstations and storage for registrar, admin, and faculty teams.',
        ['Executive and staff workstations', 'Meeting rooms and reception counters'],
        roomImages.office
      ),
    ],
    faqs: [
      {
        question: 'Do you fit admin offices within school and college projects?',
        answer:
          'Yes. We plan admin and staff zones alongside classrooms, labs, and hostel furniture so one team owns the full institutional scope.',
      },
      {
        question: 'Can admin furniture match the rest of the campus?',
        answer:
          'We keep laminates, edge profiles, and hardware consistent with classrooms and hostels so registrar, faculty, and reception areas feel like one institution.',
      },
      {
        question: 'Do you include meeting rooms and reception counters?',
        answer:
          'Yes. Typical admin packages cover workstations, filing, a compact meeting room, and a reception or enquiry counter sized to daily visitor flow.',
      },
      {
        question: 'Can this be a furniture-only package?',
        answer:
          'Yes. We can supply factory-made desks and storage only, or deliver a turnkey admin fitout with partitions and finishes under one timeline.',
      },
    ],
  },
  {
    slug: 'clinic-interiors',
    metaDescription: 'Clinic and healthcare interior fitouts in Mysuru — reception, consultation, and procedure rooms.',
    seoTitle: 'Clinic Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'commercial',
    breadcrumb: crumb(commercialParent, 'Clinics & Healthcare'),
    heroTitle: 'Clinics & Healthcare',
    heroDescription: 'Clinical spaces that feel calm for patients and efficient for staff.',
    heroImage: roomImages.clinic,
    body: [
      'Clinic interiors in Mysuru need to reassure patients while supporting fast, hygienic staff workflows. Space Solution plans reception, waiting, consultation, and procedure rooms with clear circulation and practical storage.',
      'We specify easy-clean surfaces and layouts that reduce bottlenecks between triage, consultation, and billing. Furniture and joinery are chosen for durability in high-traffic healthcare settings.',
      'Turnkey clinic fitouts help doctors and clinic groups open or expand with one accountable team — design through installation across Mysuru and Karnataka.',
      'From single-doctor clinics to multi-room centres, we focus on calm patient experience without compromising operational efficiency.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '80+', label: 'Clinics' },
      { value: 'Hygiene', label: 'Focused' },
      { value: 'Calm', label: 'Patient Flow' },
    ],
    blocks: [
      block(
        'Healthcare',
        'Designed for Care',
        'Reception, waiting, consultation, and procedure zones.',
        ['Hygiene-focused surfaces', 'Storage and equipment planning'],
        roomImages.clinic
      ),
    ],
    galleryTitle: 'Clinic interiors gallery',
    galleryDescription: 'Calm, efficient healthcare spaces across Mysuru.',
    gallery: [
      { src: roomImages.clinic, alt: 'Clinic and healthcare interior in Mysuru', caption: 'Clinic' },
      { src: heroImages.commercial, alt: 'Commercial healthcare fitout', caption: 'Healthcare fitout' },
      { src: roomImages.office, alt: 'Consultation and admin workspace', caption: 'Consultation zone' },
      { src: studioImages.craft, alt: 'Clinic cabinetry and storage craftsmanship', caption: 'Clinical storage' },
    ],
    showVideo: true,
    videoTitle: 'Clinics designed for care',
    videoDescription: 'Patient-friendly layouts and practical staff workflows for Mysuru clinics.',
    faqTitle: 'Clinic interiors FAQs',
    faqDescription: 'Questions about healthcare fitouts in Mysuru.',
    faqs: [
      {
        question: 'Which clinic zones do you design?',
        answer:
          'Reception, waiting, consultation, procedure, and support storage zones — planned for patient comfort and staff efficiency.',
      },
      {
        question: 'Do you use hygiene-focused materials?',
        answer:
          'Yes. Surfaces and finishes are selected for frequent cleaning and durable daily use in clinical environments.',
      },
      {
        question: 'Can you deliver a turnkey clinic fitout?',
        answer:
          'We coordinate design, joinery, and installation so clinic openings in Mysuru stay on a clearer single-team timeline.',
      },
      {
        question: 'Do you work with multi-room healthcare centres?',
        answer:
          'Yes. Multi-room centres benefit from consistent zoning, wayfinding clarity, and repeated room modules across floors.',
      },
    ],
  },
  {
    slug: 'retail-interiors',
    metaDescription: 'Retail and showroom interiors in Mysuru — layouts for display, flow, and brand impact.',
    seoTitle: 'Retail Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'commercial',
    breadcrumb: crumb(commercialParent, 'Retail & Showrooms'),
    heroTitle: 'Retail & Showrooms',
    heroDescription: 'Retail environments that guide customers and showcase products.',
    heroImage: roomImages.retail,
    body: [
      'Retail interiors in Mysuru should guide customers from entry to checkout while making products the hero. Space Solution designs showrooms and stores with display systems, lighting, and circulation planned around the brand journey.',
      'Boutique formats, flagship showrooms, and pop-up layouts each need different density and focal points. We balance visual impact with stock storage and staff movement behind the scenes.',
      'Factory-made display units and counters keep finish quality consistent, while turnkey delivery helps brands open on schedule across Karnataka.',
      'Whether you sell fashion, lifestyle, or specialised products, we create immersive yet practical retail environments built for daily footfall.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '100+', label: 'Stores' },
      { value: 'Brand', label: 'Led Layouts' },
      { value: 'Display', label: 'Systems' },
    ],
    blocks: [
      block(
        'Retail',
        'Immersive Brand Environments',
        'Customer journey mapping from entry to checkout.',
        ['Display systems and lighting', 'Pop-up and flagship formats'],
        roomImages.retail
      ),
    ],
    galleryTitle: 'Retail interiors gallery',
    galleryDescription: 'Showrooms and stores designed for brand impact in Mysuru.',
    gallery: [
      { src: roomImages.retail, alt: 'Retail showroom interior in Mysuru', caption: 'Showroom' },
      { src: heroImages.commercial, alt: 'Commercial retail interior design', caption: 'Retail floor' },
      { src: roomImages.salon, alt: 'Retail display and customer experience space', caption: 'Brand experience' },
      { src: studioImages.craft, alt: 'Custom retail display joinery', caption: 'Display craft' },
    ],
    showVideo: true,
    videoTitle: 'Retail spaces that convert',
    videoDescription: 'Display, lighting, and customer flow for Mysuru showrooms and stores.',
    faqTitle: 'Retail interiors FAQs',
    faqDescription: 'Questions about showroom and store design in Mysuru.',
    faqs: [
      {
        question: 'Do you design boutique and flagship retail?',
        answer:
          'Yes. We adapt density, lighting, and display systems for boutique stores, flagship showrooms, and temporary pop-up formats.',
      },
      {
        question: 'Can storage be planned behind the sales floor?',
        answer:
          'Back-of-house stock storage and staff movement are planned with the customer journey so the sales floor stays open and organised.',
      },
      {
        question: 'Are display units custom-made?',
        answer:
          'Many counters and display systems are factory-made for consistent brand finishes, then installed on site in Mysuru.',
      },
      {
        question: 'Do you offer turnkey retail fitouts?',
        answer:
          'Turnkey programmes help brands coordinate joinery, finishes, and installation under one timeline for openings across Karnataka.',
      },
    ],
  },
  {
    slug: 'coworking-interiors',
    metaDescription: 'Co-working space interiors in Mysuru — hot desks, meeting pods, and community zones.',
    seoTitle: 'Co-working Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'commercial',
    breadcrumb: crumb(commercialParent, 'Co-working'),
    heroTitle: 'Co-working Interiors',
    heroDescription: 'Flexible spaces for startups, teams, and shared work communities.',
    heroImage: projectImages.coworking,
    body: [
      'Co-working interiors in Mysuru need flexibility without chaos. Space Solution designs hot desks, meeting pods, phone booths, and community zones that members can understand immediately.',
      'We balance density with acoustics and circulation so focus work and networking can coexist. Café and lounge areas become social anchors without disrupting quiet zones.',
      'Modular furniture and factory-made joinery make future reconfiguration easier as membership grows. Turnkey delivery keeps openings coordinated for operators across Karnataka.',
      'Whether you are launching a new centre or refreshing an existing floor, we plan for operations — reception, access, storage, and brand presence included.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: 'Flexible', label: 'Zones' },
      { value: 'Hot Desk', label: 'Ready' },
      { value: 'Community', label: 'Spaces' },
    ],
    blocks: [
      block(
        'Co-working',
        'Flexible by Design',
        'Zones for focus, collaboration, and community.',
        ['Hot desks and phone booths', 'Café and lounge areas'],
        projectImages.coworking
      ),
    ],
    galleryTitle: 'Co-working interiors gallery',
    galleryDescription: 'Flexible shared workplaces for Mysuru teams and startups.',
    gallery: [
      { src: projectImages.coworking, alt: 'Co-working space interior in Mysuru', caption: 'Co-working floor' },
      { src: roomImages.office, alt: 'Hot desks and meeting zones', caption: 'Work zones' },
      { src: roomImages.cafe, alt: 'Community café lounge in co-working', caption: 'Community café' },
      { src: heroImages.commercial, alt: 'Commercial co-working interior design', caption: 'Shared workplace' },
    ],
    showVideo: true,
    videoTitle: 'Co-working that flexes with members',
    videoDescription: 'Hot desks, pods, and community zones planned for Mysuru co-working operators.',
    faqTitle: 'Co-working interiors FAQs',
    faqDescription: 'Questions about shared workplace design in Mysuru.',
    faqs: [
      {
        question: 'What zones do you typically include in co-working?',
        answer:
          'Hot desks, dedicated desks, meeting rooms or pods, phone booths, lounge or café areas, and reception — sized to your membership model.',
      },
      {
        question: 'Can the layout be reconfigured later?',
        answer:
          'We favour modular furniture and clear structural planning so operators can adjust density as demand changes.',
      },
      {
        question: 'Do you help with brand and community spaces?',
        answer:
          'Yes. Community lounges and café-style zones are planned as social anchors while protecting quieter focus areas.',
      },
      {
        question: 'Is turnkey delivery available for co-working centres?',
        answer:
          'Turnkey programmes coordinate joinery, furniture, and installation so new Mysuru centres open with fewer vendors.',
      },
    ],
  },
  {
    slug: 'school-interiors',
    metaDescription: 'School and college furniture in Mysuru — classrooms, labs, and staff rooms.',
    seoTitle: 'School Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'institutional',
    breadcrumb: crumb(institutionalParent, 'Schools & Colleges'),
    heroTitle: 'Schools & Colleges',
    heroDescription: 'Durable furniture and layouts for daily classroom use.',
    heroImage: roomImages.classroom,
    body: [
      'School and college interiors in Mysuru must survive continuous daily use. Space Solution supplies classroom desks, chairs, staffroom furniture, and related institutional pieces built for longevity.',
      'Layouts prioritise clear sightlines, bag storage, and easy cleaning for facility teams. Standard and custom classroom sets help campuses keep specifications consistent across blocks.',
      'Factory production supports volume orders for new academic years or campus expansions across Karnataka, with practical finishes that handle heavy occupancy.',
      'Pair classroom programmes with library, lab, or hostel furniture when you need a wider institutional package from one Mysuru-based manufacturer.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '50+', label: 'Campuses' },
      { value: 'Heavy Use', label: 'Ready' },
      { value: 'Classroom', label: 'Sets' },
    ],
    blocks: [
      block(
        'Education',
        'Classroom Solution',
        'Desks, chairs, and storage built for heavy daily use.',
        ['Standard and custom classroom sets', 'Staffroom and admin furniture'],
        roomImages.classroom
      ),
    ],
    galleryTitle: 'School interiors gallery',
    galleryDescription: 'Classroom and campus furniture for Mysuru institutions.',
    gallery: [
      { src: roomImages.classroom, alt: 'School classroom furniture in Mysuru', caption: 'Classroom' },
      { src: roomImages.libraryLab, alt: 'School library and lab furniture', caption: 'Library & lab' },
      { src: heroImages.institutional, alt: 'Institutional school interior', caption: 'Campus' },
      { src: roomImages.hostel, alt: 'Campus accommodation furniture', caption: 'Campus living' },
    ],
    showVideo: true,
    videoTitle: 'Classrooms built for every day',
    videoDescription: 'Durable school and college furniture manufactured for Mysuru campuses.',
    faqTitle: 'School interiors FAQs',
    faqDescription: 'Questions about classroom furniture in Mysuru.',
    faqs: [
      {
        question: 'Do you supply standard classroom desk sets?',
        answer:
          'Yes. We provide standard and custom classroom desks and chairs designed for heavy daily use in schools and colleges.',
      },
      {
        question: 'Can you furnish staffrooms and admin areas?',
        answer:
          'Staffroom and admin furniture can be included so academic and administrative spaces share consistent quality.',
      },
      {
        question: 'Are products suitable for high occupancy?',
        answer:
          'Institutional pieces are specified for continuous student use with practical, maintainable finishes.',
      },
      {
        question: 'Can classroom orders scale for a full campus?',
        answer:
          'Factory production supports volume campus programmes across Mysuru and Karnataka with consistent specifications.',
      },
    ],
  },
  {
    slug: 'hostel-furniture',
    metaDescription: 'Hostel and PG furniture in Mysuru — bunk beds, lockers, and study units.',
    seoTitle: 'Hostel & PG Furniture in Mysuru & Karnataka | Space Solution',
    activePage: 'institutional',
    breadcrumb: crumb(institutionalParent, 'Hostel & PG Furniture'),
    heroTitle: 'Hostel & PG Furniture',
    heroDescription: 'Space-efficient furniture for student and shared accommodation.',
    heroImage: roomImages.hostel,
    body: [
      'Hostel and PG furniture in Mysuru must maximise beds and storage without feeling cramped. Space Solution designs bunk beds, single beds, lockers, wardrobes, and study units for high-occupancy living.',
      'Layouts support shared living — clear bag storage, durable surfaces, and study desks that fit tight footprints. Factory-made pieces keep quality consistent across dormitory floors.',
      'Institutions and PG operators across Karnataka use our packages to furnish new blocks or refresh ageing rooms with less downtime.',
      'Combine hostel furniture with classroom or common-area pieces when you need a broader institutional programme from one accountable team.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: '1000+', label: 'Beds' },
      { value: 'Bunk / Single', label: 'Systems' },
      { value: 'Locker', label: 'Storage' },
    ],
    blocks: [
      block(
        'Hostel',
        'Built for Shared Living',
        'Beds, storage, and study furniture for high occupancy.',
        ['Bunk and single bed systems', 'Lockers and common-area storage'],
        roomImages.hostel
      ),
    ],
    galleryTitle: 'Hostel & PG furniture gallery',
    galleryDescription: 'Space-efficient accommodation furniture for Mysuru campuses.',
    gallery: [
      { src: roomImages.hostel, alt: 'Hostel and PG furniture in Mysuru', caption: 'Hostel room' },
      { src: roomImages.bedroom, alt: 'Study and storage furniture for shared living', caption: 'Study & storage' },
      { src: heroImages.institutional, alt: 'Institutional hostel accommodation', caption: 'Campus hostel' },
      { src: roomImages.classroom, alt: 'Campus furniture ecosystem', caption: 'Campus package' },
    ],
    showVideo: true,
    videoTitle: 'Hostel furniture for high occupancy',
    videoDescription: 'Bunk beds, lockers, and study units built for Mysuru student housing.',
    faqTitle: 'Hostel furniture FAQs',
    faqDescription: 'Questions about hostel and PG furniture in Mysuru.',
    faqs: [
      {
        question: 'Do you supply bunk beds and lockers?',
        answer:
          'Yes. Bunk and single bed systems with lockers, wardrobes, and study units are core to our hostel and PG packages.',
      },
      {
        question: 'Is the furniture suitable for continuous student use?',
        answer:
          'Pieces are specified for high occupancy and frequent turnover, with durable finishes facility teams can maintain.',
      },
      {
        question: 'Can you furnish an entire hostel block?',
        answer:
          'We deliver multi-room packages with consistent specifications across floors — ideal for campus expansions in Karnataka.',
      },
      {
        question: 'Do you also furnish common study areas?',
        answer:
          'Common-area study desks and storage can be included so dormitories and shared spaces feel coordinated.',
      },
    ],
  },
  {
    slug: 'library-lab-interiors',
    metaDescription: 'Library and laboratory furniture in Mysuru — shelving, lab tables, and storage.',
    seoTitle: 'Library & Lab Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'institutional',
    breadcrumb: crumb(institutionalParent, 'Libraries & Labs'),
    heroTitle: 'Libraries & Labs',
    heroDescription: 'Specialist furniture for reading, research, and practical learning.',
    heroImage: heroImages.institutional,
    body: [
      'Libraries and laboratories need specialist furniture — not generic office pieces. Space Solution designs shelving, reading tables, lab benches, and secure storage for Mysuru schools and colleges.',
      'Library layouts balance stack density with reading comfort and supervision. Lab furniture considers utility planning, chemical-resistant surfaces where needed, and organised equipment storage.',
      'Factory manufacturing supports consistent campus standards across multiple rooms or blocks in Karnataka, with durable materials for continuous academic use.',
      'Include libraries and labs in a wider institutional programme alongside classrooms and hostels for one coordinated Mysuru-based supplier.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: 'Specialist', label: 'Furniture' },
      { value: 'Shelving', label: 'Systems' },
      { value: 'Lab', label: 'Benches' },
    ],
    blocks: [
      block(
        'Libraries & labs',
        'Specialist Environments',
        'Shelving, lab benches, and secure storage.',
        ['Library shelving and reading tables', 'Lab furniture with utility planning'],
        roomImages.libraryLab
      ),
    ],
    galleryTitle: 'Library & lab gallery',
    galleryDescription: 'Reading and practical learning spaces for Mysuru institutions.',
    gallery: [
      { src: roomImages.libraryLab, alt: 'Library and laboratory furniture in Mysuru', caption: 'Library & lab' },
      { src: roomImages.classroom, alt: 'Academic learning furniture', caption: 'Learning spaces' },
      { src: heroImages.institutional, alt: 'Institutional library interior', caption: 'Campus library' },
      { src: studioImages.craft, alt: 'Specialist institutional furniture craftsmanship', caption: 'Specialist craft' },
    ],
    showVideo: true,
    videoTitle: 'Libraries and labs that support learning',
    videoDescription: 'Shelving, reading tables, and lab benches for Mysuru campuses.',
    faqTitle: 'Library & lab FAQs',
    faqDescription: 'Questions about specialist academic furniture in Mysuru.',
    faqs: [
      {
        question: 'What library furniture do you provide?',
        answer:
          'Library shelving, reading tables, and related storage designed for academic use and easy supervision.',
      },
      {
        question: 'Do you design laboratory benches and storage?',
        answer:
          'Yes. Lab furniture packages can include benches and secure storage with utility planning for practical learning spaces.',
      },
      {
        question: 'Can specifications stay consistent across a campus?',
        answer:
          'Factory production helps schools and colleges keep the same quality and dimensions across multiple rooms in Karnataka.',
      },
      {
        question: 'Can libraries and labs be ordered with classrooms?',
        answer:
          'Many institutions combine classroom, library, lab, and hostel packages for a single coordinated institutional programme.',
      },
    ],
  },
  {
    slug: 'cafe-restaurant-interiors',
    metaDescription: 'Café and restaurant interiors in Mysuru — front of house, counters, and kitchen planning.',
    seoTitle: 'Café & Restaurant Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'hospitality',
    breadcrumb: crumb(hospitalityParent, 'Cafés & Restaurants'),
    heroTitle: 'Cafés & Restaurants',
    heroDescription: 'Atmosphere and operations in balance — from counter to kitchen.',
    heroImage: heroImages.hospitality,
    body: [
      'Café and restaurant interiors in Mysuru succeed when atmosphere and operations stay in balance. Space Solution plans seating, counters, lighting, and service flow so guests feel welcome and staff can run busy services.',
      'Front-of-house design pairs with kitchen and back-of-house coordination — a turnkey approach that helps F&B brands open on schedule. See Soft Café Mysuru and other projects in our portfolio for the kind of warm, operational spaces we deliver.',
      'Durable finishes handle spills, footfall, and long hours, while factory-made joinery keeps counters and display units consistent.',
      'From neighbourhood cafés to full-service restaurants across Karnataka, we design spaces people return to — and operators can maintain.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: 'FOH+BOH', label: 'Planned' },
      { value: 'Soft Café', label: 'Mysuru' },
      { value: 'Opening', label: 'Ready' },
    ],
    blocks: [
      block(
        'F&B',
        'Spaces People Return To',
        'Seating, counters, and service flow for cafés and restaurants.',
        ['See Soft Café, Mysuru in our portfolio', 'Kitchen and back-of-house coordination'],
        roomImages.cafe
      ),
    ],
    galleryTitle: 'Café & restaurant gallery',
    galleryDescription: 'Warm F&B interiors delivered across Mysuru.',
    gallery: [
      { src: roomImages.cafe, alt: 'Café and restaurant interior in Mysuru', caption: 'Café seating' },
      { src: heroImages.hospitality, alt: 'Hospitality F&B interior design', caption: 'F&B atmosphere' },
      { src: roomImages.bar, alt: 'Restaurant bar and counter area', caption: 'Counter & bar' },
      { src: roomImages.hotel, alt: 'Hospitality dining environment', caption: 'Dining mood' },
    ],
    showVideo: true,
    videoTitle: 'Cafés built to open on schedule',
    videoDescription: 'Front-of-house atmosphere and kitchen coordination for Mysuru F&B brands.',
    faqTitle: 'Café & restaurant FAQs',
    faqDescription: 'Questions about F&B interiors in Mysuru.',
    faqs: [
      {
        question: 'Do you plan both dining areas and kitchens?',
        answer:
          'Yes. Seating, counters, and service flow are planned with kitchen and back-of-house coordination for smoother openings.',
      },
      {
        question: 'Have you completed café projects in Mysuru?',
        answer:
          'Our portfolio includes Soft Café Mysuru and other hospitality projects that balance warm atmosphere with practical operations.',
      },
      {
        question: 'Are finishes suitable for high footfall F&B?',
        answer:
          'We specify durable, maintainable finishes and joinery that stand up to daily café and restaurant use.',
      },
      {
        question: 'Can you deliver a turnkey restaurant fitout?',
        answer:
          'Turnkey programmes help F&B brands coordinate design, factory joinery, and installation under one Mysuru-based team.',
      },
    ],
  },
  {
    slug: 'hotel-interiors',
    metaDescription: 'Hotel and resort interior fitouts in Mysuru — lobbies, rooms, and amenity spaces.',
    seoTitle: 'Hotel Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'hospitality',
    breadcrumb: crumb(hospitalityParent, 'Hotels & Resorts'),
    heroTitle: 'Hotels & Resorts',
    heroDescription: 'Cohesive guest experiences from lobby to room.',
    heroImage: roomImages.hotel,
    body: [
      'Hotel interiors in Mysuru need consistency from lobby to guest room. Space Solution designs reception, lounge, and room programmes with furniture and wardrobe packages that feel cohesive across floors.',
      'Boutique hotels and resorts benefit from durable guest-facing finishes and practical housekeeping storage. Factory-made furniture helps keep room modules consistent for faster rollouts.',
      'Our hospitality turnkey approach aligns F&B amenity spaces with rooms when needed, so operators work with one accountable team through opening.',
      'Across Karnataka, we focus on guest comfort, brand atmosphere, and maintainable details that stand up to continuous occupancy.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: 'Lobby–Room', label: 'Consistency' },
      { value: 'Boutique', label: 'Ready' },
      { value: 'Turnkey', label: 'Opening' },
    ],
    blocks: [
      block(
        'Hotels',
        'Lobby to Room',
        'Reception, lounge, and guest room programmes.',
        ['Boutique hotel lobby projects', 'Furniture and wardrobe packages'],
        roomImages.hotel
      ),
    ],
    galleryTitle: 'Hotel interiors gallery',
    galleryDescription: 'Lobbies, rooms, and amenity spaces for Mysuru hospitality.',
    gallery: [
      { src: roomImages.hotel, alt: 'Hotel lobby interior in Mysuru', caption: 'Lobby' },
      { src: roomImages.bedroom, alt: 'Hotel guest room furniture', caption: 'Guest room' },
      { src: roomImages.cafe, alt: 'Hotel F&B amenity space', caption: 'F&B amenity' },
      { src: heroImages.hospitality, alt: 'Hospitality hotel interior design', caption: 'Hospitality' },
    ],
    showVideo: true,
    videoTitle: 'Hotels with lobby-to-room consistency',
    videoDescription: 'Reception, lounge, and guest room programmes for Mysuru hotels.',
    faqTitle: 'Hotel interiors FAQs',
    faqDescription: 'Questions about hotel and resort fitouts in Mysuru.',
    faqs: [
      {
        question: 'Do you design lobbies and guest rooms together?',
        answer:
          'Yes. Reception, lounge, and guest room programmes are planned as one cohesive hospitality experience.',
      },
      {
        question: 'Can you supply room furniture packages?',
        answer:
          'Furniture and wardrobe packages help boutique hotels keep room modules consistent across floors.',
      },
      {
        question: 'Do you include F&B amenity spaces?',
        answer:
          'Hotel F&B and amenity spaces can be coordinated with the guest room programme under a turnkey hospitality fitout.',
      },
      {
        question: 'Are materials chosen for continuous occupancy?',
        answer:
          'Guest-facing finishes and joinery are selected for durability and housekeeping practicality in busy hotels.',
      },
    ],
  },
  {
    slug: 'bar-lounge-interiors',
    metaDescription: 'Bar and lounge interiors in Mysuru — back-bar design, seating, and mood lighting.',
    seoTitle: 'Bar & Lounge Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'hospitality',
    breadcrumb: crumb(hospitalityParent, 'Bars & Lounges'),
    heroTitle: 'Bars & Lounges',
    heroDescription: 'Evening destinations with strong atmosphere and service flow.',
    heroImage: roomImages.bar,
    body: [
      'Bar and lounge interiors in Mysuru need mood, acoustics, and service flow working together. Space Solution designs back-bar engineering, seating zones, and accent lighting for evening destinations that still operate efficiently.',
      'Custom bar counters and bottle display create the visual hook, while circulation and storage keep staff moving during peak hours. Durable finishes handle spills and late-night use.',
      'Factory-made joinery keeps detailing sharp, and turnkey delivery helps venues open with design and installation on one schedule across Karnataka.',
      'Whether you are launching a standalone lounge or a hotel bar, we balance atmosphere with practical back-of-house planning.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: 'Mood', label: 'Lighting' },
      { value: 'Custom', label: 'Bars' },
      { value: 'Service', label: 'Flow' },
    ],
    blocks: [
      block(
        'Bars',
        'Mood-Led Design',
        'Back-bar engineering, seating zones, and accent lighting.',
        ['Custom bar counters and display', 'Acoustic and lighting planning'],
        roomImages.bar
      ),
    ],
    galleryTitle: 'Bar & lounge gallery',
    galleryDescription: 'Evening spaces with strong atmosphere across Mysuru.',
    gallery: [
      { src: roomImages.bar, alt: 'Bar and lounge interior in Mysuru', caption: 'Bar & lounge' },
      { src: roomImages.cafe, alt: 'Lounge seating and hospitality dining', caption: 'Lounge seating' },
      { src: roomImages.hotel, alt: 'Hotel bar and lobby lounge', caption: 'Hotel lounge' },
      { src: heroImages.hospitality, alt: 'Hospitality bar interior design', caption: 'Night atmosphere' },
    ],
    showVideo: true,
    videoTitle: 'Bars designed for peak service',
    videoDescription: 'Back-bar engineering, seating, and lighting for Mysuru lounges.',
    faqTitle: 'Bar & lounge FAQs',
    faqDescription: 'Questions about bar interiors in Mysuru.',
    faqs: [
      {
        question: 'Do you design custom bar counters?',
        answer:
          'Yes. Custom counters, bottle display, and back-bar storage are planned with service flow and guest sightlines in mind.',
      },
      {
        question: 'Can lighting and acoustics be part of the design?',
        answer:
          'Accent lighting and acoustic planning help evening venues feel immersive without making conversation or service difficult.',
      },
      {
        question: 'Are finishes suitable for late-night use?',
        answer:
          'We specify durable, maintainable finishes that handle spills, footfall, and long operating hours.',
      },
      {
        question: 'Do you work on hotel bars and standalone lounges?',
        answer:
          'Both. Standalone bars and hotel lounge programmes can be delivered as part of a hospitality turnkey fitout in Mysuru.',
      },
    ],
  },
  {
    slug: 'salon-wellness-interiors',
    metaDescription: 'Salon and wellness studio interiors in Mysuru — treatment rooms and retail display.',
    seoTitle: 'Salon & Wellness Interiors in Mysuru & Karnataka | Space Solution',
    activePage: 'hospitality',
    breadcrumb: crumb(hospitalityParent, 'Salons & Wellness'),
    heroTitle: 'Salons & Wellness',
    heroDescription: 'Calm, premium environments for beauty and wellness brands.',
    heroImage: roomImages.salon,
    body: [
      'Salon and wellness interiors in Mysuru should feel calm for clients and efficient for therapists and stylists. Space Solution designs treatment rooms, reception, and retail display with durable, easy-clean finishes.',
      'Zoning separates waiting, service, and wet areas where needed, while storage keeps tools and products organised. Premium atmosphere comes from lighting, materials, and uncluttered layouts — not clutter.',
      'Factory-made cabinetry and retail units keep brand presentation consistent. Turnkey delivery helps wellness studios and salons open across Karnataka with one accountable team.',
      'From boutique salons to multi-room wellness studios, we create client experiences that support repeat visits and smooth daily operations.',
    ],
    stats: [
      { value: '15+', label: 'Years' },
      { value: 'Calm', label: 'Client Flow' },
      { value: 'Treatment', label: 'Rooms' },
      { value: 'Retail', label: 'Display' },
    ],
    blocks: [
      block(
        'Wellness',
        'Calm Client Experiences',
        'Treatment rooms, reception, and product display.',
        ['Wellness studio portfolio projects', 'Durable, easy-clean finishes'],
        roomImages.salon
      ),
    ],
    galleryTitle: 'Salon & wellness gallery',
    galleryDescription: 'Calm beauty and wellness spaces across Mysuru.',
    gallery: [
      { src: roomImages.salon, alt: 'Salon and wellness studio interior in Mysuru', caption: 'Salon & wellness' },
      { src: roomImages.clinic, alt: 'Treatment room and calm care space', caption: 'Treatment room' },
      { src: roomImages.retail, alt: 'Retail product display in salon', caption: 'Retail display' },
      { src: heroImages.hospitality, alt: 'Hospitality wellness interior design', caption: 'Wellness brand' },
    ],
    showVideo: true,
    videoTitle: 'Wellness spaces clients return to',
    videoDescription: 'Treatment rooms, reception, and retail display for Mysuru salons.',
    faqTitle: 'Salon & wellness FAQs',
    faqDescription: 'Questions about salon and wellness studio interiors in Mysuru.',
    faqs: [
      {
        question: 'What areas do you design for salons and wellness studios?',
        answer:
          'Reception, waiting, treatment or styling rooms, wet areas where needed, storage, and retail product display.',
      },
      {
        question: 'Do you use easy-clean finishes?',
        answer:
          'Yes. Durable, easy-clean finishes are specified for beauty and wellness spaces with frequent client turnover.',
      },
      {
        question: 'Can retail display be included?',
        answer:
          'Product display and brand presentation are commonly included so salons can sell retail without cluttering service areas.',
      },
      {
        question: 'Is turnkey delivery available for wellness studios?',
        answer:
          'Turnkey programmes coordinate design, factory cabinetry, and installation so Mysuru studios open with one accountable team.',
      },
    ],
  },
];

export function getServiceLandingPage(slug: string): ServicePageData | undefined {
  return serviceLandingPages.find((page) => page.slug === slug);
}

export function getServiceLandingSlugs(): string[] {
  return serviceLandingPages.map((page) => page.slug);
}

export const serviceHubPages: Record<string, ServicePageData> = {
  'residential-interiors': residentialHub,
  'commercial-interiors': commercialHub,
  'institutional-interiors': institutionalHub,
  'hospitality-interiors': hospitalityHub,
};

export function getServiceHub(slug: string): ServicePageData | undefined {
  return serviceHubPages[slug];
}
