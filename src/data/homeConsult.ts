import type { MenuIconName } from './headerMenuIcons';

export type HomeConsultRoom = {
  id: string;
  label: string;
  short: string;
  value: string;
  icon: MenuIconName;
  isFullHome?: boolean;
};

export const homeConsultRooms: HomeConsultRoom[] = [
  { id: 'kitchen', label: 'Modular Kitchen', short: 'Kitchen', value: 'Modular Kitchen', icon: 'gear-six' },
  { id: 'wardrobe', label: 'Wardrobes & Storage', short: 'Wardrobes', value: 'Wardrobes & Storage', icon: 'stack' },
  { id: 'living', label: 'Living & Dining', short: 'Living', value: 'Living & Dining', icon: 'couch' },
  { id: 'bedroom', label: 'Bedrooms', short: 'Bedrooms', value: 'Bedrooms', icon: 'bed' },
  { id: 'pooja', label: 'Pooja Room', short: 'Pooja', value: 'Pooja Room', icon: 'hands-praying' },
  {
    id: 'full',
    label: 'Full Home Interiors',
    short: 'Full Home',
    value: 'Full Home Interiors',
    icon: 'house',
    isFullHome: true,
  },
];

export const homeConsultSteps = [
  {
    title: 'Choose your rooms',
    description: 'Kitchen, wardrobes, living, bedrooms, pooja — or the full home in one language.',
  },
  {
    title: 'We design in 3D',
    description: 'A Mysuru designer maps layout, storage, and finishes to how your family actually lives.',
  },
  {
    title: 'Review, then we build',
    description: 'Approve the look before factory production. No obligation until you say yes.',
  },
];

export const HOME_CONSULT_PATH = '/free-3d-consultation';
