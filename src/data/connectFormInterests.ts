import type { NavPage } from '../components/Header.astro';
import { TURNKEY_PATHS } from './navResourceSegments';
import { getServiceLandingPage } from './servicePages';

export type ConnectCategoryId = 'home' | 'commercial' | 'institutional' | 'hospitality' | 'others';

export interface ConnectCategoryOption {
  id: ConnectCategoryId;
  label: string;
}

export interface ConnectSubServiceOption {
  label: string;
  value: string;
}

export const connectCategories: ConnectCategoryOption[] = [
  { id: 'home', label: 'Home' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'institutional', label: 'Institutional' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'others', label: 'Others' },
];

export const connectSubServicesByCategory: Record<ConnectCategoryId, ConnectSubServiceOption[]> = {
  home: [
    { label: 'Modular Kitchen', value: 'Modular Kitchen' },
    { label: 'Wardrobes & Storage', value: 'Wardrobes & Storage' },
    { label: 'Living & Dining', value: 'Living & Dining' },
    { label: 'Bedrooms', value: 'Bedrooms' },
    { label: 'Pooja Room', value: 'Pooja Room' },
    { label: 'Full Home Interiors', value: 'Full Home Interiors' },
    { label: 'Others', value: 'Others' },
  ],
  commercial: [
    { label: 'Office Interiors', value: 'Office Interiors' },
    { label: 'Clinics & Healthcare', value: 'Clinics & Healthcare' },
    { label: 'Retail & Showrooms', value: 'Retail & Showrooms' },
    { label: 'Co-working', value: 'Co-working' },
    { label: 'Others', value: 'Others' },
  ],
  institutional: [
    { label: 'Schools & Colleges', value: 'Schools & Colleges' },
    { label: 'Hostel & PG Furniture', value: 'Hostel & PG Furniture' },
    { label: 'Libraries & Labs', value: 'Libraries & Labs' },
    { label: 'Admin & Staff Offices', value: 'Admin & Staff Offices' },
    { label: 'Others', value: 'Others' },
  ],
  hospitality: [
    { label: 'Cafés & Restaurants', value: 'Cafés & Restaurants' },
    { label: 'Hotels & Resorts', value: 'Hotels & Resorts' },
    { label: 'Bars & Lounges', value: 'Bars & Lounges' },
    { label: 'Salons & Wellness', value: 'Salons & Wellness' },
    { label: 'Others', value: 'Others' },
  ],
  others: [
    { label: 'Turnkey Fitout', value: 'Turnkey Fitout' },
    { label: 'Space Planning / Consultation', value: 'Space Planning / Consultation' },
    { label: 'Custom Requirement', value: 'Custom Requirement' },
    { label: 'Not sure yet', value: 'Not sure yet' },
  ],
};

/** Service landing slug → sub-service label (must match connectSubServicesByCategory values). */
export const serviceSlugToSubService: Record<string, string> = {
  'modular-kitchen': 'Modular Kitchen',
  'wardrobes-storage': 'Wardrobes & Storage',
  'living-dining': 'Living & Dining',
  bedrooms: 'Bedrooms',
  'pooja-room': 'Pooja Room',
  'full-home-interiors': 'Full Home Interiors',
  'office-interiors': 'Office Interiors',
  'clinic-interiors': 'Clinics & Healthcare',
  'retail-interiors': 'Retail & Showrooms',
  'coworking-interiors': 'Co-working',
  'school-interiors': 'Schools & Colleges',
  'hostel-furniture': 'Hostel & PG Furniture',
  'library-lab-interiors': 'Libraries & Labs',
  'admin-office-interiors': 'Admin & Staff Offices',
  'cafe-restaurant-interiors': 'Cafés & Restaurants',
  'hotel-interiors': 'Hotels & Resorts',
  'bar-lounge-interiors': 'Bars & Lounges',
  'salon-wellness-interiors': 'Salons & Wellness',
};

const hubSlugToCategory: Record<string, ConnectCategoryId> = {
  'residential-interiors': 'home',
  'commercial-interiors': 'commercial',
  'institutional-interiors': 'institutional',
  'hospitality-interiors': 'hospitality',
};

const turnkeyPaths = new Set<string>(Object.values(TURNKEY_PATHS));

export interface ConnectFormDefaults {
  category: ConnectCategoryId;
  subServices: string[];
}

function normalizePathname(pathname: string): string {
  let path = pathname.split('?')[0].split('#')[0].replace(/\.html$/, '');
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path || '/';
}

function categoryFromActivePage(activePage: NavPage): ConnectCategoryId {
  if (activePage === 'institutional' || activePage === 'services-institutional') {
    return 'institutional';
  }
  if (activePage === 'hospitality' || activePage === 'services-hospitality') {
    return 'hospitality';
  }
  if (activePage === 'commercial' || activePage === 'services-commercial') {
    return 'commercial';
  }
  if (
    activePage === 'home-interiors' ||
    activePage === 'services-residential' ||
    activePage === 'home' ||
    activePage === 'services'
  ) {
    return 'home';
  }
  return 'home';
}

/** Consult landing + common ?interest= aliases → CONNECT sub-service values. */
const interestAliases: Record<string, string> = {
  kitchen: 'Modular Kitchen',
  wardrobe: 'Wardrobes & Storage',
  wardrobes: 'Wardrobes & Storage',
  living: 'Living & Dining',
  bedroom: 'Bedrooms',
  bedrooms: 'Bedrooms',
  pooja: 'Pooja Room',
  full: 'Full Home Interiors',
  'full-home': 'Full Home Interiors',
  office: 'Office Interiors',
  clinic: 'Clinics & Healthcare',
  clinics: 'Clinics & Healthcare',
  retail: 'Retail & Showrooms',
  coworking: 'Co-working',
  school: 'Schools & Colleges',
  hostel: 'Hostel & PG Furniture',
  library: 'Libraries & Labs',
  admin: 'Admin & Staff Offices',
  cafe: 'Cafés & Restaurants',
  café: 'Cafés & Restaurants',
  hotel: 'Hotels & Resorts',
  bar: 'Bars & Lounges',
  salon: 'Salons & Wellness',
  turnkey: 'Turnkey Fitout',
};

function findCategoryForSubService(value: string): ConnectCategoryId | null {
  for (const category of connectCategories) {
    if (connectSubServicesByCategory[category.id].some((option) => option.value === value)) {
      return category.id;
    }
  }
  return null;
}

export function resolveConnectInterestParam(interest?: string | null): ConnectFormDefaults | null {
  if (!interest) return null;

  const raw = interest.trim();
  if (!raw) return null;

  const key = raw.toLowerCase();
  if (key === 'others' || key === 'other') return null;

  for (const category of connectCategories) {
    if (category.id === key || category.label.toLowerCase() === key) {
      return { category: category.id, subServices: [] };
    }
  }

  const fromSlug = serviceSlugToSubService[raw] || serviceSlugToSubService[key];
  const fromAlias = interestAliases[key];
  const sub = fromSlug || fromAlias;

  if (sub) {
    const category = findCategoryForSubService(sub);
    if (category) return { category, subServices: [sub] };
  }

  for (const category of connectCategories) {
    const option = connectSubServicesByCategory[category.id].find(
      (item) => item.value.toLowerCase() === key || item.label.toLowerCase() === key,
    );
    if (option) {
      return { category: category.id, subServices: [option.value] };
    }
  }

  return null;
}

function resolveFromPath(path: string): ConnectFormDefaults | null {
  if (path === '/free-3d-consultation') {
    return { category: 'home', subServices: [] };
  }

  if (path === '/commercial-site-survey') {
    return { category: 'commercial', subServices: [] };
  }

  if (path === '/bulk-furniture-enquiry') {
    return { category: 'institutional', subServices: [] };
  }

  if (path === '/hospitality-3d-consultation') {
    return { category: 'hospitality', subServices: [] };
  }

  if (turnkeyPaths.has(path)) {
    return { category: 'others', subServices: ['Turnkey Fitout'] };
  }

  if (path === '/design-library/space-planning') {
    return { category: 'others', subServices: ['Space Planning / Consultation'] };
  }

  if (path === '/contact' || path === '/about') {
    return { category: 'home', subServices: [] };
  }

  const slug = path.startsWith('/') ? path.slice(1) : path;

  if (hubSlugToCategory[slug]) {
    return { category: hubSlugToCategory[slug], subServices: [] };
  }

  const subService = serviceSlugToSubService[slug];
  if (subService) {
    const landing = getServiceLandingPage(slug);
    const category = landing ? categoryFromActivePage(landing.activePage) : 'home';
    return { category, subServices: [subService] };
  }

  return null;
}

export function resolveConnectFormDefaults(
  activePage: NavPage = 'home',
  pathname = '',
  interest?: string | null,
): ConnectFormDefaults {
  const path = normalizePathname(pathname);
  const fromInterest = resolveConnectInterestParam(interest);
  const fromPath = resolveFromPath(path);
  const fallback: ConnectFormDefaults = {
    category: categoryFromActivePage(activePage),
    subServices: [],
  };
  const base = fromPath ?? fallback;

  if (!fromInterest) {
    return base;
  }

  if (fromInterest.subServices.length) {
    return fromInterest;
  }

  return {
    category: fromInterest.category,
    subServices: fromInterest.category === base.category ? base.subServices : [],
  };
}
