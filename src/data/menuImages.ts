export const MENU_IMAGE_WIDTH = 192;
export const MENU_IMAGE_HEIGHT = 144;
export const MENU_IMAGE_DISPLAY_WIDTH = 96;
export const MENU_IMAGE_DISPLAY_HEIGHT = 72;

const menuBase = '/images/menu';

export const interiorMenuImages: Record<string, string> = {
  '/residential-interiors': `${menuBase}/residential.webp`,
  '/commercial-interiors': `${menuBase}/commercial.webp`,
  '/institutional-interiors': `${menuBase}/institutional.webp`,
  '/turnkey-fitout': `${menuBase}/turnkey.webp`,
};

export const libraryMenuImages: Record<string, string> = {
  'modular-kitchen-guide': `${menuBase}/modular-kitchen-guide.webp`,
  'materials-and-finishes': `${menuBase}/materials-and-finishes.webp`,
  'space-planning': `${menuBase}/space-planning.webp`,
  'interior-styles': `${menuBase}/interior-styles.webp`,
  'budget-planning': `${menuBase}/budget-planning.webp`,
  'before-you-renovate': `${menuBase}/before-you-renovate.webp`,
};

export const allMenuImageUrls: string[] = [
  ...Object.values(interiorMenuImages),
  ...Object.values(libraryMenuImages),
];

export function getInteriorMenuImage(href: string): string {
  return interiorMenuImages[href];
}

export function getLibraryMenuImage(slug: string): string {
  return libraryMenuImages[slug];
}
