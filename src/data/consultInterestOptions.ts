import {
  connectSubServicesByCategory,
  serviceSlugToSubService,
  type ConnectCategoryId,
} from './connectFormInterests';
import type { MenuIconName } from './headerMenuIcons';
import type { ConsultInterestOption } from './consultFormConfigs';

/** Card display metadata keyed by submitted sub-service value. */
const consultInterestMeta: Record<string, { id: string; short: string; icon: MenuIconName; isFullHome?: boolean }> = {
  'Modular Kitchen': { id: 'kitchen', short: 'Kitchen', icon: 'gear-six' },
  'Wardrobes & Storage': { id: 'wardrobe', short: 'Wardrobes', icon: 'stack' },
  'Living & Dining': { id: 'living', short: 'Living', icon: 'couch' },
  Bedrooms: { id: 'bedroom', short: 'Bedrooms', icon: 'bed' },
  'Pooja Room': { id: 'pooja', short: 'Pooja', icon: 'hands-praying' },
  'Full Home Interiors': { id: 'full', short: 'Full Home', icon: 'house', isFullHome: true },
  'Office Interiors': { id: 'office', short: 'Office', icon: 'building-office' },
  'Clinics & Healthcare': { id: 'clinic', short: 'Clinic', icon: 'first-aid' },
  'Retail & Showrooms': { id: 'retail', short: 'Retail', icon: 'storefront' },
  'Co-working': { id: 'coworking', short: 'Co-working', icon: 'users-three' },
  'Schools & Colleges': { id: 'school', short: 'School', icon: 'student' },
  'Hostel & PG Furniture': { id: 'hostel', short: 'Hostel', icon: 'bed' },
  'Libraries & Labs': { id: 'library', short: 'Library', icon: 'books' },
  'Admin & Staff Offices': { id: 'admin', short: 'Admin', icon: 'building-office' },
  'Cafés & Restaurants': { id: 'cafe', short: 'Café', icon: 'coffee' },
  'Hotels & Resorts': { id: 'hotel', short: 'Hotel', icon: 'buildings' },
  'Bars & Lounges': { id: 'bar', short: 'Bar', icon: 'wine' },
  'Salons & Wellness': { id: 'salon', short: 'Salon', icon: 'scissors' },
  Others: { id: 'others', short: 'Others', icon: 'tag' },
};

export function getConsultInterestOptions(categoryId: ConnectCategoryId): ConsultInterestOption[] {
  return connectSubServicesByCategory[categoryId].map((option) => {
    const meta = consultInterestMeta[option.value] ?? {
      id: option.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      short: option.label.split(' ')[0],
      icon: 'tag' as MenuIconName,
    };

    return {
      id: meta.id,
      label: option.label,
      short: meta.short,
      value: option.value,
      icon: meta.icon,
      isFullHome: meta.isFullHome,
    };
  });
}

export function resolveConsultInterestFromSlug(
  slug: string,
  categoryId: ConnectCategoryId,
): string | undefined {
  const subService = serviceSlugToSubService[slug];
  if (!subService) return undefined;

  const options = connectSubServicesByCategory[categoryId];
  return options.some((option) => option.value === subService) ? subService : undefined;
}

export { serviceSlugToSubService };
