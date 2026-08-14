import type { IconName } from './iconPaths';
import type { NavPage } from '../components/Header.astro';
import {
  resolveConnectFormDefaults,
  type ConnectCategoryId,
  type ConnectFormDefaults,
} from './connectFormInterests';

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
  { label: 'Custom Solution', value: 'Custom Solution', icon: 'gear' },
];

/** @deprecated Use connectCategories from connectFormInterests.ts */
export const headerConnectInterestOptions = [
  { label: 'Home', value: 'Home Interiors' },
  { label: 'Commercial', value: 'Commercial Interiors' },
  { label: 'Institutional', value: 'Institutional Interiors' },
  { label: 'Hospitality', value: 'Hospitality Interiors' },
] as const;

export type ConnectNavPage = NavPage;

export { resolveConnectFormDefaults, type ConnectCategoryId, type ConnectFormDefaults };

/** @deprecated Use resolveConnectFormDefaults instead */
export function resolveDefaultConnectInterest(
  activePage: ConnectNavPage = 'home',
  pathname = '',
): (typeof headerConnectInterestOptions)[number]['value'] {
  const { category } = resolveConnectFormDefaults(activePage, pathname);
  const legacyMap: Record<ConnectCategoryId, (typeof headerConnectInterestOptions)[number]['value']> = {
    home: 'Home Interiors',
    commercial: 'Commercial Interiors',
    institutional: 'Institutional Interiors',
    hospitality: 'Hospitality Interiors',
    others: 'Home Interiors',
  };
  return legacyMap[category];
}
