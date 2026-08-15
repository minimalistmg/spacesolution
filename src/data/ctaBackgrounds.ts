import type { ImageMetadata } from 'astro';
import type { NavPage } from '../components/Header.astro';
import type { ConnectCategoryId } from './connectFormInterests';
import { heroImages } from './images';

const categoryBackgrounds: Record<ConnectCategoryId, ImageMetadata> = {
  home: heroImages.residential,
  commercial: heroImages.commercial,
  institutional: heroImages.institutional,
  hospitality: heroImages.hospitality,
  others: heroImages.cta,
};

/**
 * Get Started background by nav segment / connect category.
 * Home-interior pages share the residential photo; other L1 segments
 * use their own hero. Studio pages keep the generic CTA banner.
 */
export function resolveCtaBackground(
  activePage: NavPage,
  category: ConnectCategoryId,
): ImageMetadata {
  if (
    activePage === 'home-interiors' ||
    activePage === 'services-residential' ||
    activePage === 'home'
  ) {
    return heroImages.residential;
  }

  if (activePage === 'commercial' || activePage === 'services-commercial') {
    return heroImages.commercial;
  }

  if (activePage === 'institutional' || activePage === 'services-institutional') {
    return heroImages.institutional;
  }

  if (activePage === 'hospitality' || activePage === 'services-hospitality') {
    return heroImages.hospitality;
  }

  if (activePage === 'studio' || activePage === 'portfolio' || activePage === 'library') {
    return heroImages.cta;
  }

  return categoryBackgrounds[category] ?? heroImages.cta;
}
