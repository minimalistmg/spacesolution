import type { NavPage } from '../components/Header.astro';

export type NavResourceSegment = Exclude<
  NavPage,
  'home' | 'studio' | 'portfolio' | 'library' | 'enquire' | 'services' | 'services-residential' | 'services-commercial' | 'services-institutional' | 'services-hospitality'
>;

/** Which L1 nav segment a tool slug belongs to. */
export const toolNavSegment: Record<string, NavResourceSegment> = {
  'kitchen-cost-estimator': 'home-interiors',
  'home-budget-calculator': 'home-interiors',
  'kitchen-layout-recommender': 'home-interiors',
  'office-space-calculator': 'commercial',
  'commercial-fitout-estimator': 'commercial',
  'clinic-room-planner': 'commercial',
  'classroom-furniture-calculator': 'institutional',
  'hostel-bed-planner': 'institutional',
  'bulk-furniture-estimator': 'institutional',
  'cafe-seating-calculator': 'hospitality',
  'hospitality-fitout-estimator': 'hospitality',
  'opening-day-countdown': 'hospitality',
};

/** Which L1 nav segment a design-library guide slug belongs to. */
export const guideNavSegment: Record<string, NavResourceSegment> = {
  'modular-kitchen-guide': 'home-interiors',
  'budget-planning': 'home-interiors',
  'before-you-renovate': 'home-interiors',
  'space-planning': 'home-interiors',
  'materials-and-finishes': 'commercial',
  'interior-styles': 'commercial',
};

export const TURNKEY_PATHS = {
  hub: '/turnkey-fitout',
  residential: '/turnkey-residential-fitout',
  commercial: '/turnkey-commercial-fitout',
  institutional: '/turnkey-institutional-fitout',
  hospitality: '/turnkey-hospitality-fitout',
} as const;

export const turnkeyNavSegment: Record<string, NavResourceSegment> = {
  [TURNKEY_PATHS.residential]: 'home-interiors',
  [TURNKEY_PATHS.commercial]: 'commercial',
  [TURNKEY_PATHS.institutional]: 'institutional',
  [TURNKEY_PATHS.hospitality]: 'hospitality',
};

export function resolveToolNavSegment(slug: string): NavPage | null {
  return toolNavSegment[slug] ?? null;
}

export function resolveGuideNavSegment(slug: string): NavPage | null {
  return guideNavSegment[slug] ?? null;
}

export function resolveTurnkeyNavSegment(path: string): NavPage | null {
  return turnkeyNavSegment[path] ?? null;
}
