import type { MenuIconName } from './headerMenuIcons';
import { SITE } from './site';

export interface MainNavLink {
  label: string;
  href: string;
  icon: MenuIconName;
  /** Opens a site modal instead of navigating when set (e.g. enquiry). */
  modal?: string;
}

export interface MainNavSection {
  heading: string;
  items: MainNavLink[];
  /** Default 2. Use 1 for short lists to avoid empty grid cells. */
  columns?: 1 | 2;
}

export interface MainNavFeatured {
  icon: MenuIconName;
  title: string;
  description: string;
  href: string;
}

export interface MainNavFooterBand {
  heading: string;
  items: MainNavLink[];
}

export interface MainNavPanel {
  id: string;
  label: string;
  hubHref: string;
  width: number;
  featured: MainNavFeatured;
  sections: MainNavSection[];
  toolsBand?: MainNavFooterBand;
  footerBand?: MainNavFooterBand;
}

export const MEGA_MENU_PANEL_WIDTH = 780;

export const mainNavPanels: MainNavPanel[] = [
  {
    id: 'home',
    label: 'Home Interiors',
    hubHref: '/residential-interiors',
    width: MEGA_MENU_PANEL_WIDTH,
    featured: {
      icon: 'house',
      title: 'Residential interiors',
      description: 'Kitchens, wardrobes and whole-home interiors from our Mysuru factory.',
      href: '/residential-interiors',
    },
    sections: [
      {
        heading: 'By room',
        items: [
          { label: 'Modular Kitchen', href: '/modular-kitchen', icon: 'gear-six' },
          { label: 'Wardrobes & Storage', href: '/wardrobes-storage', icon: 'stack' },
          { label: 'Living & Dining', href: '/living-dining', icon: 'couch' },
          { label: 'Bedrooms', href: '/bedrooms', icon: 'bed' },
          { label: 'Pooja Room', href: '/pooja-room', icon: 'hands-praying' },
          { label: 'Full Home Interiors', href: '/full-home-interiors', icon: 'house' },
        ],
      },
      {
        heading: 'Projects',
        columns: 1,
        items: [
          { label: 'Vijayanagar Residence', href: '/projects/vijayanagar-residence', icon: 'images' },
          { label: 'Heritage Home', href: '/projects/heritage-home', icon: 'images' },
          { label: 'Wellness Studio', href: '/projects/wellness-studio', icon: 'images' },
        ],
      },
      {
        heading: 'Turnkey',
        columns: 1,
        items: [
          { label: 'Turnkey home interiors', href: '/turnkey-fitout', icon: 'key' },
          { label: 'Free 3D consultation', href: '/contact', icon: 'compass-tool' },
        ],
      },
    ],
    toolsBand: {
      heading: 'Tools',
      items: [
        { label: 'Kitchen Cost Estimator', href: '/tools/kitchen-cost-estimator', icon: 'tag' },
        { label: 'Home Budget Calculator', href: '/tools/home-budget-calculator', icon: 'ruler' },
        { label: 'Kitchen Layout Recommender', href: '/tools/kitchen-layout-recommender', icon: 'compass-tool' },
      ],
    },
    footerBand: {
      heading: 'Guides',
      items: [
        { label: 'Modular Kitchen Guide', href: '/design-library/modular-kitchen-guide', icon: 'ruler' },
        { label: 'Space Planning', href: '/design-library/space-planning', icon: 'compass-tool' },
        { label: 'Budget Planning', href: '/design-library/budget-planning', icon: 'tag' },
        { label: 'Before You Renovate', href: '/design-library/before-you-renovate', icon: 'check-circle' },
      ],
    },
  },
  {
    id: 'commercial',
    label: 'Commercial',
    hubHref: '/commercial-interiors',
    width: MEGA_MENU_PANEL_WIDTH,
    featured: {
      icon: 'buildings',
      title: 'Commercial interiors',
      description: 'Workplaces, clinics and shops fitted end to end by one team.',
      href: '/commercial-interiors',
    },
    sections: [
      {
        heading: 'By space',
        items: [
          { label: 'Office Interiors', href: '/office-interiors', icon: 'building-office' },
          { label: 'Clinics & Healthcare', href: '/clinic-interiors', icon: 'first-aid' },
          { label: 'Retail & Showrooms', href: '/retail-interiors', icon: 'storefront' },
          { label: 'Co-working', href: '/coworking-interiors', icon: 'users-three' },
        ],
      },
      {
        heading: 'Projects',
        columns: 1,
        items: [
          { label: 'Infotech Workspace', href: '/projects/infotech-workspace', icon: 'images' },
          { label: 'Clinic Fit-Out', href: '/projects/clinic-fitout', icon: 'images' },
          { label: 'Retail Pop-Up', href: '/projects/retail-pop-up', icon: 'images' },
        ],
      },
      {
        heading: 'Turnkey',
        columns: 1,
        items: [
          { label: 'Turnkey office fitout', href: '/turnkey-fitout', icon: 'key' },
          { label: 'Site survey & quote', href: '/contact', icon: 'envelope' },
        ],
      },
    ],
    toolsBand: {
      heading: 'Tools',
      items: [
        { label: 'Office Space Calculator', href: '/tools/office-space-calculator', icon: 'users-three' },
        { label: 'Commercial Fitout Estimator', href: '/tools/commercial-fitout-estimator', icon: 'tag' },
        { label: 'Clinic Room Planner', href: '/tools/clinic-room-planner', icon: 'first-aid' },
      ],
    },
    footerBand: {
      heading: 'Guides',
      items: [
        { label: 'Materials & Finishes', href: '/design-library/materials-and-finishes', icon: 'stack' },
        { label: 'Interior Styles', href: '/design-library/interior-styles', icon: 'paint-brush' },
      ],
    },
  },
  {
    id: 'institutional',
    label: 'Institutional',
    hubHref: '/institutional-interiors',
    width: MEGA_MENU_PANEL_WIDTH,
    featured: {
      icon: 'student',
      title: 'Institutional interiors',
      description: 'Classrooms, hostels and labs with furniture built to last.',
      href: '/institutional-interiors',
    },
    sections: [
      {
        heading: 'By space',
        columns: 1,
        items: [
          { label: 'Schools & Colleges', href: '/school-interiors', icon: 'student' },
          { label: 'Hostel & PG Furniture', href: '/hostel-furniture', icon: 'bed' },
          { label: 'Libraries & Labs', href: '/library-lab-interiors', icon: 'books' },
        ],
      },
      {
        heading: 'Projects',
        columns: 1,
        items: [
          { label: 'Infotech Workspace', href: '/projects/infotech-workspace', icon: 'images' },
          { label: 'Wellness Studio', href: '/projects/wellness-studio', icon: 'images' },
          { label: 'Clinic Fit-Out', href: '/projects/clinic-fitout', icon: 'images' },
        ],
      },
      {
        heading: 'Turnkey',
        columns: 1,
        items: [
          { label: 'Turnkey institutional fitout', href: '/turnkey-fitout', icon: 'key' },
          { label: 'Bulk furniture enquiry', href: '/contact', icon: 'envelope' },
        ],
      },
    ],
    toolsBand: {
      heading: 'Tools',
      items: [
        { label: 'Classroom Furniture Calculator', href: '/tools/classroom-furniture-calculator', icon: 'student' },
        { label: 'Hostel Bed Planner', href: '/tools/hostel-bed-planner', icon: 'bed' },
        { label: 'Bulk Furniture Estimator', href: '/tools/bulk-furniture-estimator', icon: 'tag' },
      ],
    },
    footerBand: {
      heading: 'Guides',
      items: [
        { label: 'Space Planning', href: '/design-library/space-planning', icon: 'compass-tool' },
        { label: 'Materials & Finishes', href: '/design-library/materials-and-finishes', icon: 'stack' },
        { label: 'Budget Planning', href: '/design-library/budget-planning', icon: 'tag' },
      ],
    },
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    hubHref: '/hospitality-interiors',
    width: MEGA_MENU_PANEL_WIDTH,
    featured: {
      icon: 'flower-lotus',
      title: 'Hospitality interiors',
      description: 'Café counters to hotel lobbies, ready for your opening day.',
      href: '/hospitality-interiors',
    },
    sections: [
      {
        heading: 'By space',
        items: [
          { label: 'Cafés & Restaurants', href: '/cafe-restaurant-interiors', icon: 'coffee' },
          { label: 'Hotels & Resorts', href: '/hotel-interiors', icon: 'buildings' },
          { label: 'Bars & Lounges', href: '/bar-lounge-interiors', icon: 'wine' },
          { label: 'Salons & Wellness', href: '/salon-wellness-interiors', icon: 'scissors' },
        ],
      },
      {
        heading: 'Projects',
        columns: 1,
        items: [
          { label: 'Soft Café', href: '/projects/soft-cafe-mysuru', icon: 'images' },
          { label: 'Boutique Hotel Lobby', href: '/projects/boutique-hotel-lobby', icon: 'images' },
          { label: 'Wellness Studio', href: '/projects/wellness-studio', icon: 'images' },
        ],
      },
      {
        heading: 'Turnkey',
        columns: 1,
        items: [
          { label: 'Turnkey hospitality fitout', href: '/turnkey-fitout', icon: 'key' },
          { label: 'Free 3D consultation', href: '/contact', icon: 'compass-tool' },
        ],
      },
    ],
    toolsBand: {
      heading: 'Tools',
      items: [
        { label: 'Café Seating Calculator', href: '/tools/cafe-seating-calculator', icon: 'coffee' },
        { label: 'Hospitality Fitout Estimator', href: '/tools/hospitality-fitout-estimator', icon: 'tag' },
        { label: 'Opening Day Countdown', href: '/tools/opening-day-countdown', icon: 'check-circle' },
      ],
    },
    footerBand: {
      heading: 'Guides',
      items: [
        { label: 'Interior Styles', href: '/design-library/interior-styles', icon: 'paint-brush' },
        { label: 'Materials & Finishes', href: '/design-library/materials-and-finishes', icon: 'stack' },
      ],
    },
  },
  {
    id: 'studio',
    label: 'Studio',
    hubHref: '/about',
    width: MEGA_MENU_PANEL_WIDTH,
    featured: {
      icon: 'medal',
      title: 'Space Solutions',
      description: 'Mysuru studio since 2011. 800+ projects delivered from our own factory floor.',
      href: '/about',
    },
    sections: [
      {
        heading: 'About',
        columns: 1,
        items: [
          { label: 'About us', href: '/about', icon: 'medal' },
          { label: 'Turnkey fitout hub', href: '/turnkey-fitout', icon: 'key' },
          { label: 'FAQ', href: '/faq', icon: 'check-circle' },
        ],
      },
      {
        heading: 'Services',
        columns: 1,
        items: [
          { label: 'Home Interiors', href: '/residential-interiors', icon: 'house' },
          { label: 'Commercial', href: '/commercial-interiors', icon: 'buildings' },
          { label: 'Institutional', href: '/institutional-interiors', icon: 'student' },
          { label: 'Hospitality', href: '/hospitality-interiors', icon: 'flower-lotus' },
        ],
      },
      {
        heading: 'Explore',
        columns: 1,
        items: [
          { label: 'All projects', href: '/portfolio', icon: 'images' },
          { label: 'Design library', href: '/design-library', icon: 'books' },
          { label: 'All tools', href: '/tools', icon: 'compass-tool' },
        ],
      },
    ],
    footerBand: {
      heading: 'Contact',
      items: [
        { label: 'Get quote', href: '#', icon: 'envelope', modal: 'enquiry' },
        { label: 'Call us', href: 'tel:+916364564563', icon: 'phone' },
        { label: 'WhatsApp', href: 'https://wa.me/916364564563', icon: 'whatsapp-logo' },
        { label: 'Get directions', href: SITE.mapDirectionsUrl, icon: 'map-pin' },
        { label: 'Book 3D consult', href: '/contact', icon: 'compass-tool' },
      ],
    },
  },
];

export function isNavPanelActive(panelId: string, activePage: string): boolean {
  if (activePage === 'home') return false;
  if (activePage === panelId) return true;

  if (panelId === 'home' && (activePage === 'home-interiors' || activePage === 'services-residential')) {
    return true;
  }
  if (panelId === 'commercial' && (activePage === 'commercial' || activePage === 'services-commercial')) {
    return true;
  }
  if (panelId === 'institutional' && (activePage === 'institutional' || activePage === 'services-institutional')) {
    return true;
  }
  if (panelId === 'hospitality' && (activePage === 'hospitality' || activePage === 'services-hospitality')) {
    return true;
  }
  if (
    panelId === 'studio' &&
    (activePage === 'studio' || activePage === 'enquire' || activePage === 'library')
  ) {
    return true;
  }

  return false;
}
