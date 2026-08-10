import type { MenuIconName } from './headerMenuIcons';
import { getProjectPlaceIcon } from './projectPlaceIcons';

export interface SegmentMenuLink {
  label: string;
  href: string;
  icon: MenuIconName;
}

export interface SegmentMenuProject {
  label: string;
  href: string;
  location: string;
  placeIcon?: MenuIconName;
}

export interface SegmentMegaMenuConfig {
  spacesHeading: string;
  spaces: SegmentMenuLink[];
  turnkey: SegmentMenuLink[];
  projects: SegmentMenuProject[];
}

export const SEGMENT_MENU_WIDTH = 780;
export const SEGMENT_MENU_PROJECT_ICON: MenuIconName = 'images';
export const SEGMENT_MENU_PORTFOLIO_HREF = '/portfolio';
export const SEGMENT_MENU_PORTFOLIO_LABEL = 'View all projects';
export const SEGMENT_MENU_PROJECTS_HEADING = 'Projects';
export const SEGMENT_MENU_DESIGN_LIBRARY_HREF = '/design-library';
export const SEGMENT_MENU_DESIGN_LIBRARY_LABEL = 'Design library';
export const SEGMENT_MENU_DESIGN_LIBRARY_ICON: MenuIconName = 'books';

export type SegmentMegaMenuId = 'home' | 'commercial' | 'institutional' | 'hospitality';

export function getSegmentMenuLinkRowCount(menu: SegmentMegaMenuConfig): number {
  return menu.spaces.length + menu.turnkey.length;
}

/** Projects column rows = column 1 link rows, with the last projects row reserved for View all. */
export function getSegmentMenuProjectCount(menu: SegmentMegaMenuConfig): number {
  return Math.max(1, getSegmentMenuLinkRowCount(menu) - 1);
}

export function resolveSegmentMenuProjectPlaceIcon(project: SegmentMenuProject): MenuIconName {
  return getProjectPlaceIcon(project.location, project.placeIcon);
}

export const segmentMegaMenus: Record<SegmentMegaMenuId, SegmentMegaMenuConfig> = {
  home: {
    spacesHeading: 'By room',
    spaces: [
      { label: 'Modular Kitchen', href: '/modular-kitchen', icon: 'gear-six' },
      { label: 'Wardrobes & Storage', href: '/wardrobes-storage', icon: 'stack' },
      { label: 'Living & Dining', href: '/living-dining', icon: 'couch' },
      { label: 'Bedrooms', href: '/bedrooms', icon: 'bed' },
      { label: 'Pooja Room', href: '/pooja-room', icon: 'hands-praying' },
      { label: 'Full Home Interiors', href: '/full-home-interiors', icon: 'house' },
    ],
    turnkey: [
      { label: 'Turnkey home interiors', href: '/turnkey-fitout', icon: 'key' },
      { label: 'Free 3D consultation', href: '/contact', icon: 'compass-tool' },
    ],
    projects: [
      { label: 'Vijayanagar Residence', href: '/projects/vijayanagar-residence', location: 'Mysuru' },
      { label: 'Heritage Home', href: '/projects/heritage-home', location: 'Madikeri' },
      { label: 'Wellness Studio', href: '/projects/wellness-studio', location: 'Mandya' },
      { label: 'Boutique Hotel Lobby', href: '/projects/boutique-hotel-lobby', location: 'Mysuru' },
      { label: 'Soft Café', href: '/projects/soft-cafe-mysuru', location: 'Mysuru' },
      { label: 'Clinic Fit-Out', href: '/projects/clinic-fitout', location: 'Mysuru' },
      { label: 'Infotech Workspace', href: '/projects/infotech-workspace', location: 'Bengaluru' },
    ],
  },
  commercial: {
    spacesHeading: 'By space',
    spaces: [
      { label: 'Office Interiors', href: '/office-interiors', icon: 'building-office' },
      { label: 'Clinics & Healthcare', href: '/clinic-interiors', icon: 'first-aid' },
      { label: 'Retail & Showrooms', href: '/retail-interiors', icon: 'storefront' },
      { label: 'Co-working', href: '/coworking-interiors', icon: 'users-three' },
    ],
    turnkey: [
      { label: 'Turnkey office fitout', href: '/turnkey-fitout', icon: 'key' },
      { label: 'Site survey & quote', href: '/contact', icon: 'envelope' },
    ],
    projects: [
      { label: 'Infotech Workspace', href: '/projects/infotech-workspace', location: 'Bengaluru' },
      { label: 'Clinic Fit-Out', href: '/projects/clinic-fitout', location: 'Mysuru' },
      { label: 'Retail Pop-Up', href: '/projects/retail-pop-up', location: 'Bengaluru' },
      { label: 'Boutique Hotel Lobby', href: '/projects/boutique-hotel-lobby', location: 'Mysuru' },
      { label: 'Soft Café', href: '/projects/soft-cafe-mysuru', location: 'Mysuru' },
    ],
  },
  institutional: {
    spacesHeading: 'By space',
    spaces: [
      { label: 'Schools & Colleges', href: '/school-interiors', icon: 'student' },
      { label: 'Hostel & PG Furniture', href: '/hostel-furniture', icon: 'bed' },
      { label: 'Libraries & Labs', href: '/library-lab-interiors', icon: 'books' },
    ],
    turnkey: [
      { label: 'Turnkey institutional fitout', href: '/turnkey-fitout', icon: 'key' },
      { label: 'Bulk furniture enquiry', href: '/contact', icon: 'envelope' },
    ],
    projects: [
      { label: 'Infotech Workspace', href: '/projects/infotech-workspace', location: 'Bengaluru' },
      { label: 'Wellness Studio', href: '/projects/wellness-studio', location: 'Mandya' },
      { label: 'Clinic Fit-Out', href: '/projects/clinic-fitout', location: 'Mysuru' },
      { label: 'Heritage Home', href: '/projects/heritage-home', location: 'Madikeri' },
    ],
  },
  hospitality: {
    spacesHeading: 'By space',
    spaces: [
      { label: 'Cafés & Restaurants', href: '/cafe-restaurant-interiors', icon: 'coffee' },
      { label: 'Hotels & Resorts', href: '/hotel-interiors', icon: 'buildings' },
      { label: 'Bars & Lounges', href: '/bar-lounge-interiors', icon: 'wine' },
      { label: 'Salons & Wellness', href: '/salon-wellness-interiors', icon: 'scissors' },
    ],
    turnkey: [
      { label: 'Turnkey hospitality fitout', href: '/turnkey-fitout', icon: 'key' },
      { label: 'Free 3D consultation', href: '/contact', icon: 'compass-tool' },
    ],
    projects: [
      { label: 'Soft Café', href: '/projects/soft-cafe-mysuru', location: 'Mysuru' },
      { label: 'Boutique Hotel Lobby', href: '/projects/boutique-hotel-lobby', location: 'Mysuru' },
      { label: 'Wellness Studio', href: '/projects/wellness-studio', location: 'Mandya' },
      { label: 'Retail Pop-Up', href: '/projects/retail-pop-up', location: 'Bengaluru' },
      { label: 'Vijayanagar Residence', href: '/projects/vijayanagar-residence', location: 'Mysuru' },
    ],
  },
};

export const segmentMegaMenuIds: SegmentMegaMenuId[] = [
  'home',
  'commercial',
  'institutional',
  'hospitality',
];

export function isSegmentMegaMenuId(id: string): id is SegmentMegaMenuId {
  return segmentMegaMenuIds.includes(id as SegmentMegaMenuId);
}
