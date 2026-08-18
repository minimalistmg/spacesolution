import type { NavResourceSegment } from './navResourceSegments';
import { TURNKEY_PATHS } from './navResourceSegments';
import type { IconName } from './iconPaths';

export interface TurnkeyFitoutPageConfig {
  segment: NavResourceSegment;
  path: string;
  seoTitle: string;
  metaDescription: string;
  breadcrumbCurrent: string;
  heroLead: string;
}

export interface TurnkeyHubLink {
  label: string;
  href: string;
  eyebrow: string;
  description: string;
  icon: IconName;
}

export const turnkeyFitoutPages: Record<NavResourceSegment, TurnkeyFitoutPageConfig> = {
  'home-interiors': {
    segment: 'home-interiors',
    path: TURNKEY_PATHS.residential,
    seoTitle: 'Turnkey Residential Fitout Mysuru | Space Solution',
    metaDescription:
      'Turnkey residential interior fitout in Mysuru - design, in-house manufacturing, and installation for kitchens, wardrobes, and full homes by Space Solution.',
    breadcrumbCurrent: 'Turnkey residential fitout',
    heroLead:
      'One team for design, factory production, and installation - so your home finishes on a clear plan before move-in.',
  },
  commercial: {
    segment: 'commercial',
    path: TURNKEY_PATHS.commercial,
    seoTitle: 'Turnkey Commercial Fitout Mysuru | Space Solution',
    metaDescription:
      'Turnkey commercial interior fitout in Mysuru - offices, clinics, and retail delivered design-to-handover by Space Solution.',
    breadcrumbCurrent: 'Turnkey commercial fitout',
    heroLead:
      'One team for workplace design, factory joinery, and site installation - so your office or store opens on schedule.',
  },
  institutional: {
    segment: 'institutional',
    path: TURNKEY_PATHS.institutional,
    seoTitle: 'Turnkey Institutional Fitout Mysuru | Space Solution',
    metaDescription:
      'Turnkey institutional interior fitout in Mysuru - classrooms, hostels, labs, and admin spaces built to last by Space Solution.',
    breadcrumbCurrent: 'Turnkey institutional fitout',
    heroLead:
      'One team for durable institutional interiors - furniture, storage, and finishes planned for daily student and staff use.',
  },
  hospitality: {
    segment: 'hospitality',
    path: TURNKEY_PATHS.hospitality,
    seoTitle: 'Turnkey Hospitality Fitout Mysuru | Space Solution',
    metaDescription:
      'Turnkey hospitality interior fitout in Mysuru - cafés, hotels, bars, and salons ready for opening day by Space Solution.',
    breadcrumbCurrent: 'Turnkey hospitality fitout',
    heroLead:
      'One team for guest-facing hospitality interiors - counters, seating, and back-of-house coordination before you open.',
  },
};

export const turnkeyHubLinks: TurnkeyHubLink[] = [
  {
    label: 'Residential turnkey',
    href: TURNKEY_PATHS.residential,
    eyebrow: 'Homes',
    description: 'Kitchens, wardrobes, and full-home interiors - design to handover under one team.',
    icon: 'house',
  },
  {
    label: 'Commercial turnkey',
    href: TURNKEY_PATHS.commercial,
    eyebrow: 'Workplaces',
    description: 'Offices, clinics, and retail fitouts planned for opening day and daily use.',
    icon: 'building',
  },
  {
    label: 'Institutional turnkey',
    href: TURNKEY_PATHS.institutional,
    eyebrow: 'Campuses',
    description: 'Classrooms, hostels, labs, and admin spaces built for durable student and staff use.',
    icon: 'school',
  },
  {
    label: 'Hospitality turnkey',
    href: TURNKEY_PATHS.hospitality,
    eyebrow: 'Guest spaces',
    description: 'Cafés, hotels, bars, and salons coordinated from concept to opening.',
    icon: 'store',
  },
];

export function getTurnkeyFitoutPage(segment: NavResourceSegment): TurnkeyFitoutPageConfig {
  return turnkeyFitoutPages[segment];
}
