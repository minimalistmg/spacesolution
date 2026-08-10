/** Interior design color palettes for the site theme selector */

function hexToRgbChannels(hex) {
  let value = String(hex).replace('#', '');
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const num = parseInt(value, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function darkenHex(hex, amount) {
  const [r, g, b] = hexToRgbChannels(hex);
  const factor = 1 - amount;
  const toHex = (channel) =>
    Math.max(0, Math.min(255, Math.round(channel * factor)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lightenHex(hex, amount) {
  const [r, g, b] = hexToRgbChannels(hex);
  const mix = (channel) =>
    Math.max(0, Math.min(255, Math.round(channel + (255 - channel) * amount)))
      .toString(16)
      .padStart(2, '0');
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

function rgba(hex, alpha) {
  const [r, g, b] = hexToRgbChannels(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function relativeLuminance(hex) {
  const channels = hexToRgbChannels(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function buildPalette({ id, name, tagline, colors }) {
  const gold = colors['--gold'];
  const dark = colors['--dark'];
  const [r, g, b] = hexToRgbChannels(gold);
  const goldIsLight = relativeLuminance(gold) > 0.45;

  // Light surface system, derived from each palette's own cream so every theme
  // keeps its hue while the page body stays airy.
  const base = lightenHex(colors['--cream'] ?? '#fff9e7', 0.35);
  const veilBase = lightenHex(base, 0.5);

  return {
    id,
    name,
    tagline,
    colors: {
      '--white': '#ffffff',
      '--border': '#eeeeee',
      '--border-strong': '#e3e3e3',
      '--surface': '#fdfaf5',
      '--text-muted': '#888888',
      '--text-placeholder': '#aaaaaa',
      ...colors,
      '--gold-rgb': `${r}, ${g}, ${b}`,
      '--gold-hover': colors['--gold-hover'] ?? (goldIsLight ? darkenHex(gold, 0.14) : lightenHex(gold, 0.12)),
      '--gold-on-light': colors['--gold-on-light'] ?? darkenHex(gold, 0.42),
      '--on-gold': colors['--on-gold'] ?? (goldIsLight ? dark : '#ffffff'),
      '--surface-band': darkenHex(base, 0.045),
      '--surface-sand': darkenHex(base, 0.1),
      '--hairline': darkenHex(base, 0.14),
      '--hero-bg': darkenHex(base, 0.02),
      '--overlay': rgba(dark, 0.22),
      '--veil-hero': `linear-gradient(100deg, ${rgba(veilBase, 0.93)} 0%, ${rgba(veilBase, 0.78)} 42%, ${rgba(veilBase, 0.5)} 100%)`,
      '--veil-card': `linear-gradient(to top, ${rgba(veilBase, 0.95)} 0%, ${rgba(veilBase, 0)} 62%)`,
      '--header-bg': 'floralwhite',
      '--header-bg-scrolled': 'floralwhite',
      '--header-glass-border': colors['--header-glass-border'] ?? '#eeeeee',
      '--header-glass-border-scrolled':
        colors['--header-glass-border-scrolled'] ?? '#e3e3e3',
      '--header-glass-blur': '0px',
      '--header-glass-blur-scrolled': '0px',
      '--header-text': colors['--header-text'] ?? dark,
    },
  };
}

export const DEFAULT_PALETTE_ID = 'classic-gold';

export const colorPalettes = [
  buildPalette({
    id: 'classic-gold',
    name: 'Classic Gold',
    tagline: 'Timeless luxury with warm gold accents',
    colors: {
      '--gold': '#c5a23a',
      '--gold-hover': '#b8932f',
      '--gold-on-light': '#7a6520',
      '--on-gold': '#181818',
      '--dark': '#181818',
      '--dark-2': '#2a2a2a',
      '--dark-3': '#333333',
      '--gray-text': '#666666',
      '--gray-light': '#f8f4ed',
      '--cream': '#fff9e7',
      '--brown': '#3c2516',
      '--header-dropdown-bg': 'rgba(12, 12, 12, 0.98)',
      '--footer-cta-bg': '#0a0a0a',
    },
  }),
  buildPalette({
    id: 'white-gold',
    name: 'White Gold',
    tagline: 'Luminous ivory fading into champagne gold',
    colors: {
      '--gold': '#c9b896',
      '--gold-hover': '#b8a682',
      '--gold-on-light': '#8a7a55',
      '--on-gold': '#2a2824',
      '--dark': '#2a2824',
      '--dark-2': '#3c3934',
      '--dark-3': '#4a4740',
      '--gray-text': '#7a756c',
      '--gray-light': '#f7f5f0',
      '--cream': '#faf7f0',
      '--brown': '#5c5648',
      '--surface': '#fbfaf7',
      '--border': '#efece4',
      '--border-strong': '#e3dfd4',
      '--header-dropdown-bg': 'rgba(32, 30, 26, 0.98)',
      '--footer-cta-bg': '#1a1814',
    },
  }),
  buildPalette({
    id: 'warm-terracotta',
    name: 'Warm Terracotta',
    tagline: 'Earthy warmth with terracotta highlights',
    colors: {
      '--gold': '#c4714a',
      '--gold-hover': '#b05f3a',
      '--gold-on-light': '#8a4a2e',
      '--on-gold': '#ffffff',
      '--dark': '#2c1a14',
      '--dark-2': '#3d261c',
      '--dark-3': '#4a3024',
      '--gray-text': '#7a5c4e',
      '--gray-light': '#faf3eb',
      '--cream': '#f5ebe0',
      '--brown': '#5c3d2e',
      '--surface': '#faf6f1',
      '--border': '#efe6dc',
      '--border-strong': '#e4d8cc',
      '--header-dropdown-bg': 'rgba(36, 20, 14, 0.98)',
      '--footer-cta-bg': '#1a0f0a',
    },
  }),
  buildPalette({
    id: 'scandinavian-sage',
    name: 'Scandinavian Sage',
    tagline: 'Calm Nordic tones with soft green accents',
    colors: {
      '--gold': '#7a9e7e',
      '--gold-hover': '#6a8e6e',
      '--gold-on-light': '#4f6b53',
      '--on-gold': '#1e2426',
      '--dark': '#2d3436',
      '--dark-2': '#3d4446',
      '--dark-3': '#4a5254',
      '--gray-text': '#636e72',
      '--gray-light': '#f5f5f0',
      '--cream': '#eef2ed',
      '--brown': '#4a5568',
      '--surface': '#f7f8f5',
      '--border': '#e8ebe6',
      '--border-strong': '#dce0d9',
      '--header-dropdown-bg': 'rgba(38, 44, 46, 0.98)',
      '--footer-cta-bg': '#1e2426',
    },
  }),
  buildPalette({
    id: 'modern-copper',
    name: 'Modern Copper',
    tagline: 'Sleek contemporary with copper warmth',
    colors: {
      '--gold': '#b87333',
      '--gold-hover': '#a6652b',
      '--gold-on-light': '#7a4a1f',
      '--on-gold': '#ffffff',
      '--dark': '#1a1a1a',
      '--dark-2': '#2c2c2c',
      '--dark-3': '#3a3a3a',
      '--gray-text': '#6b6b6b',
      '--gray-light': '#f8f6f3',
      '--cream': '#f3f0eb',
      '--brown': '#3d3d3d',
      '--surface': '#f7f5f2',
      '--border': '#ebe8e3',
      '--border-strong': '#dfdbd5',
      '--header-dropdown-bg': 'rgba(18, 18, 18, 0.98)',
      '--footer-cta-bg': '#0d0d0d',
    },
  }),
  buildPalette({
    id: 'coastal-serenity',
    name: 'Coastal Serenity',
    tagline: 'Relaxed seaside blues and sandy neutrals',
    colors: {
      '--gold': '#4a7c8c',
      '--gold-hover': '#3f6d7b',
      '--gold-on-light': '#2f5562',
      '--on-gold': '#ffffff',
      '--dark': '#1e3a4c',
      '--dark-2': '#2a5068',
      '--dark-3': '#356078',
      '--gray-text': '#5a7080',
      '--gray-light': '#f0ebe3',
      '--cream': '#e8e2d8',
      '--brown': '#2c4a5e',
      '--surface': '#f5f1ea',
      '--border': '#e5dfd5',
      '--border-strong': '#d8d1c6',
      '--header-dropdown-bg': 'rgba(24, 48, 62, 0.98)',
      '--footer-cta-bg': '#0f2030',
    },
  }),
  buildPalette({
    id: 'forest-haven',
    name: 'Forest Haven',
    tagline: 'Natural greens with organic wood tones',
    colors: {
      '--gold': '#5d7a4a',
      '--gold-hover': '#4f6a3e',
      '--gold-on-light': '#3d5230',
      '--on-gold': '#ffffff',
      '--dark': '#1c2618',
      '--dark-2': '#283520',
      '--dark-3': '#344428',
      '--gray-text': '#5a6b52',
      '--gray-light': '#f2efe6',
      '--cream': '#eae6dc',
      '--brown': '#3d4f32',
      '--surface': '#f4f2eb',
      '--border': '#e6e2d8',
      '--border-strong': '#d9d4c8',
      '--header-dropdown-bg': 'rgba(22, 30, 18, 0.98)',
      '--footer-cta-bg': '#0f140c',
    },
  }),
  buildPalette({
    id: 'blush-elegance',
    name: 'Blush Elegance',
    tagline: 'Soft rose and refined taupe sophistication',
    colors: {
      '--gold': '#c49a9a',
      '--gold-hover': '#b48787',
      '--gold-on-light': '#8a6060',
      '--on-gold': '#3d2c2c',
      '--dark': '#3d2c2c',
      '--dark-2': '#4e3838',
      '--dark-3': '#5c4444',
      '--gray-text': '#8a7070',
      '--gray-light': '#faf5f3',
      '--cream': '#f5ece9',
      '--brown': '#6b4f4f',
      '--surface': '#faf6f4',
      '--border': '#efe6e3',
      '--border-strong': '#e4d8d4',
      '--header-dropdown-bg': 'rgba(50, 36, 36, 0.98)',
      '--footer-cta-bg': '#241818',
    },
  }),
  buildPalette({
    id: 'industrial-loft',
    name: 'Industrial Loft',
    tagline: 'Urban edge with rust and concrete tones',
    colors: {
      '--gold': '#c45c26',
      '--gold-hover': '#b04f1e',
      '--gold-on-light': '#8a3f18',
      '--on-gold': '#ffffff',
      '--dark': '#2a2a2a',
      '--dark-2': '#383838',
      '--dark-3': '#454545',
      '--gray-text': '#707070',
      '--gray-light': '#e8e6e3',
      '--cream': '#ddd9d4',
      '--brown': '#4a4a4a',
      '--surface': '#f2f0ed',
      '--border': '#e4e1dc',
      '--border-strong': '#d5d1cb',
      '--header-dropdown-bg': 'rgba(34, 34, 34, 0.98)',
      '--footer-cta-bg': '#141414',
    },
  }),
];

export function getPaletteById(id) {
  return colorPalettes.find((p) => p.id === id) ?? colorPalettes[0];
}
