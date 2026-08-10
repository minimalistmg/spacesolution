export interface FooterLoopObject {
  id: string;
  label: string;
  /** Compact caption under the cutout */
  shortLabel: string;
  src: string;
  width: number;
  /** Vertical offset from floor line (px) */
  lift: number;
  /** Resting tilt (deg) */
  rotate: number;
}

const V = 'u5';

/** Space Solutions service categories — transparent cutouts for the infinite footer loop */
export const FOOTER_LOOP_OBJECTS: FooterLoopObject[] = [
  { id: 'kitchen', label: 'Modular Kitchen', shortLabel: 'Modular Kitchen', src: `/images/footer-objects/ss-obj-kitchen.png?${V}`, width: 168, lift: 0, rotate: 0 },
  { id: 'wardrobe', label: 'Wardrobes & Storage', shortLabel: 'Wardrobes', src: `/images/footer-objects/ss-obj-wardrobe.png?${V}`, width: 88, lift: 0, rotate: 0 },
  { id: 'living-dining', label: 'Living & Dining', shortLabel: 'Living & Dining', src: `/images/footer-objects/ss-obj-living-dining.png?${V}`, width: 172, lift: 0, rotate: 0 },
  { id: 'bedroom', label: 'Bedrooms', shortLabel: 'Bedrooms', src: `/images/footer-objects/ss-obj-bedroom.png?${V}`, width: 156, lift: 0, rotate: 0 },
  { id: 'pooja', label: 'Pooja Room', shortLabel: 'Pooja Room', src: `/images/footer-objects/ss-obj-pooja.png?${V}`, width: 128, lift: 0, rotate: 0 },
  { id: 'office', label: 'Office Interiors', shortLabel: 'Office', src: `/images/footer-objects/ss-obj-office.png?${V}`, width: 148, lift: 0, rotate: 0 },
  { id: 'clinic', label: 'Clinics & Healthcare', shortLabel: 'Clinics', src: `/images/footer-objects/ss-obj-clinic.png?${V}`, width: 150, lift: 0, rotate: 0 },
  { id: 'retail', label: 'Retail & Showrooms', shortLabel: 'Retail', src: `/images/footer-objects/ss-obj-retail.png?${V}`, width: 148, lift: 0, rotate: 0 },
  { id: 'coworking', label: 'Co-working', shortLabel: 'Co-working', src: `/images/footer-objects/ss-obj-coworking.png?${V}`, width: 154, lift: 0, rotate: 0 },
  { id: 'school', label: 'Schools & Colleges', shortLabel: 'Schools', src: `/images/footer-objects/ss-obj-school.png?${V}`, width: 132, lift: 0, rotate: 0 },
  { id: 'hostel', label: 'Hostel & PG Furniture', shortLabel: 'Hostel & PG', src: `/images/footer-objects/ss-obj-hostel.png?${V}`, width: 150, lift: 0, rotate: 0 },
  { id: 'library', label: 'Libraries & Labs', shortLabel: 'Libraries', src: `/images/footer-objects/ss-obj-library.png?${V}`, width: 140, lift: 0, rotate: 0 },
  { id: 'cafe', label: 'Cafés & Restaurants', shortLabel: 'Cafés', src: `/images/footer-objects/ss-obj-cafe.png?${V}`, width: 100, lift: 0, rotate: 0 },
  { id: 'hotel', label: 'Hotels & Resorts', shortLabel: 'Hotels', src: `/images/footer-objects/ss-obj-hotel.png?${V}`, width: 160, lift: 0, rotate: 0 },
  { id: 'bar', label: 'Bars & Lounges', shortLabel: 'Bars', src: `/images/footer-objects/ss-obj-bar.png?${V}`, width: 152, lift: 0, rotate: 0 },
  { id: 'salon', label: 'Salons & Wellness', shortLabel: 'Salons', src: `/images/footer-objects/ss-obj-salon.png?${V}`, width: 110, lift: 0, rotate: 0 },
];
