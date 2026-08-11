import type { IconName } from './iconPaths';

export interface ContactFormServiceOption {
  label: string;
  value: string;
  icon: IconName;
}

export const contactFormServiceOptions: ContactFormServiceOption[] = [
  { label: 'Residential', value: 'Residential Interiors', icon: 'couch' },
  { label: 'Commercial', value: 'Commercial Interiors', icon: 'building' },
  { label: 'Hospitality', value: 'Hospitality Interiors', icon: 'bed' },
  { label: 'Renovation', value: 'Renovation', icon: 'tools' },
  { label: 'Space Planning', value: 'Space Planning', icon: 'compass' },
  { label: 'Custom Solutions', value: 'Custom Solutions', icon: 'gear' },
];

export const headerConnectInterestOptions = [
  { label: 'Home', value: 'Home Interiors' },
  { label: 'Commercial', value: 'Commercial Interiors' },
  { label: 'Institutional', value: 'Institutional Interiors' },
  { label: 'Hospitality', value: 'Hospitality Interiors' },
] as const;

export type ConnectNavPage =
  | 'home-interiors'
  | 'commercial'
  | 'institutional'
  | 'hospitality'
  | 'studio'
  | 'portfolio'
  | 'library'
  | 'enquire'
  | 'services-residential'
  | 'services-commercial'
  | 'services-institutional'
  | 'services-hospitality'
  | 'home'
  | 'services';

export function resolveDefaultConnectInterest(
  activePage: ConnectNavPage = 'home',
  pathname = '',
): (typeof headerConnectInterestOptions)[number]['value'] {
  const path = pathname.toLowerCase();

  if (
    activePage === 'institutional' ||
    activePage === 'services-institutional' ||
    path.includes('/institutional-interiors')
  ) {
    return 'Institutional Interiors';
  }

  if (
    activePage === 'hospitality' ||
    activePage === 'services-hospitality' ||
    path.includes('/hospitality-interiors')
  ) {
    return 'Hospitality Interiors';
  }

  if (
    activePage === 'commercial' ||
    activePage === 'services-commercial' ||
    path.includes('/commercial-interiors') ||
    path.includes('/office-interiors') ||
    path.includes('/clinic') ||
    path.includes('/retail') ||
    path.includes('/co-working')
  ) {
    return 'Commercial Interiors';
  }

  if (
    activePage === 'home-interiors' ||
    activePage === 'services-residential' ||
    activePage === 'home' ||
    activePage === 'services' ||
    path.includes('/modular-kitchen') ||
    path.includes('/wardrobe') ||
    path.includes('/living-dining') ||
    path.includes('/bedroom') ||
    path.includes('/pooja') ||
    path.includes('/full-home') ||
    path.includes('/residential')
  ) {
    return 'Home Interiors';
  }

  return 'Home Interiors';
}
