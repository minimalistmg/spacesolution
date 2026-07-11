export type ImagePreset = 'hero' | 'content' | 'grid' | 'logo' | 'thumbnail' | 'cover';

export const IMAGE_QUALITY = 88;

export const IMAGE_PRESETS: Record<
  ImagePreset,
  {
    sizes: string;
    widths: number[];
    loading: 'lazy' | 'eager';
    fetchpriority?: 'high' | 'low' | 'auto';
  }
> = {
  hero: {
    sizes: '100vw',
    widths: [768, 1024, 1440, 1920],
    loading: 'eager',
    fetchpriority: 'high',
  },
  content: {
    sizes: '(max-width: 768px) 100vw, 50vw',
    widths: [480, 768, 1024, 1440],
    loading: 'lazy',
  },
  grid: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    widths: [480, 768, 1024],
    loading: 'lazy',
  },
  logo: {
    sizes: '180px',
    widths: [180, 360],
    loading: 'eager',
  },
  thumbnail: {
    sizes: '(max-width: 768px) 100vw, 33vw',
    widths: [480, 768, 1024],
    loading: 'lazy',
  },
  cover: {
    sizes: '100vw',
    widths: [768, 1024, 1440],
    loading: 'lazy',
  },
};

export function getEffectiveWidths(sourceWidth: number, widths: number[]) {
  const capped = widths.filter((width) => width <= sourceWidth);
  if (capped.length === 0 || !capped.includes(sourceWidth)) {
    capped.push(sourceWidth);
  }
  return [...new Set(capped)].sort((a, b) => a - b);
}
