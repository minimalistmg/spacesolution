export interface FooterLoopObject {
  id: string;
  label: string;
  /** Compact caption under the cutout */
  shortLabel: string;
  href: string;
  src: string;
  width: number;
  /** Vertical offset from floor line (px) */
  lift: number;
  /** Resting tilt (deg) */
  rotate: number;
}

const V = 'u6';

/** Space Solution service categories — transparent cutouts for the infinite footer loop */
export const FOOTER_LOOP_OBJECTS: FooterLoopObject[] = [
  { id: 'kitchen', label: 'Modular Kitchen', shortLabel: 'Modular Kitchen', href: '/modular-kitchen', src: `/images/footer-objects/ss-obj-kitchen.png?${V}`, width: 168, lift: 0, rotate: 0 },
  { id: 'wardrobe', label: 'Wardrobes & Storage', shortLabel: 'Wardrobes', href: '/wardrobes-storage', src: `/images/footer-objects/ss-obj-wardrobe.png?${V}`, width: 88, lift: 0, rotate: 0 },
  { id: 'living-dining', label: 'Living & Dining', shortLabel: 'Living & Dining', href: '/living-dining', src: `/images/footer-objects/ss-obj-living-dining.png?${V}`, width: 172, lift: 0, rotate: 0 },
  { id: 'bedroom', label: 'Bedrooms', shortLabel: 'Bedrooms', href: '/bedrooms', src: `/images/footer-objects/ss-obj-bedroom.png?${V}`, width: 156, lift: 0, rotate: 0 },
  { id: 'pooja', label: 'Pooja Room', shortLabel: 'Pooja Room', href: '/pooja-room', src: `/images/footer-objects/ss-obj-pooja.png?${V}`, width: 128, lift: 0, rotate: 0 },
  { id: 'full-home', label: 'Full Home Interiors', shortLabel: 'Full Home', href: '/full-home-interiors', src: `/images/footer-objects/ss-obj-full-home.png?${V}`, width: 164, lift: 0, rotate: 0 },
  { id: 'office', label: 'Office Interiors', shortLabel: 'Office', href: '/office-interiors', src: `/images/footer-objects/ss-obj-office.png?${V}`, width: 148, lift: 0, rotate: 0 },
  { id: 'clinic', label: 'Clinics & Healthcare', shortLabel: 'Clinics', href: '/clinic-interiors', src: `/images/footer-objects/ss-obj-clinic.png?${V}`, width: 150, lift: 0, rotate: 0 },
  { id: 'retail', label: 'Retail & Showrooms', shortLabel: 'Retail', href: '/retail-interiors', src: `/images/footer-objects/ss-obj-retail.png?${V}`, width: 148, lift: 0, rotate: 0 },
  { id: 'coworking', label: 'Co-working', shortLabel: 'Co-working', href: '/coworking-interiors', src: `/images/footer-objects/ss-obj-coworking.png?${V}`, width: 154, lift: 0, rotate: 0 },
  { id: 'school', label: 'Schools & Colleges', shortLabel: 'Schools', href: '/school-interiors', src: `/images/footer-objects/ss-obj-school.png?${V}`, width: 132, lift: 0, rotate: 0 },
  { id: 'hostel', label: 'Hostel & PG Furniture', shortLabel: 'Hostel & PG', href: '/hostel-furniture', src: `/images/footer-objects/ss-obj-hostel.png?${V}`, width: 150, lift: 0, rotate: 0 },
  { id: 'library', label: 'Libraries & Labs', shortLabel: 'Libraries', href: '/library-lab-interiors', src: `/images/footer-objects/ss-obj-library.png?${V}`, width: 140, lift: 0, rotate: 0 },
  { id: 'cafe', label: 'Cafés & Restaurants', shortLabel: 'Cafés', href: '/cafe-restaurant-interiors', src: `/images/footer-objects/ss-obj-cafe.png?${V}`, width: 100, lift: 0, rotate: 0 },
  { id: 'hotel', label: 'Hotels & Resorts', shortLabel: 'Hotels', href: '/hotel-interiors', src: `/images/footer-objects/ss-obj-hotel.png?${V}`, width: 160, lift: 0, rotate: 0 },
  { id: 'bar', label: 'Bars & Lounges', shortLabel: 'Bars', href: '/bar-lounge-interiors', src: `/images/footer-objects/ss-obj-bar.png?${V}`, width: 152, lift: 0, rotate: 0 },
  { id: 'salon', label: 'Salons & Wellness', shortLabel: 'Salons', href: '/salon-wellness-interiors', src: `/images/footer-objects/ss-obj-salon.png?${V}`, width: 110, lift: 0, rotate: 0 },
];
