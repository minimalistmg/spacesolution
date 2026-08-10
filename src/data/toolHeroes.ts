import type { ImageMetadata } from 'astro';
import { heroImages, roomImages, projectImages } from './images';

/** Subject-fit hero for each tool — reuses existing photography only. */
export const toolHeroBySlug: Record<string, ImageMetadata> = {
  'kitchen-cost-estimator': roomImages.modularKitchen,
  'home-budget-calculator': roomImages.fullHome,
  'kitchen-layout-recommender': roomImages.modularKitchen,
  'office-space-calculator': roomImages.office,
  'commercial-fitout-estimator': heroImages.commercial,
  'clinic-room-planner': roomImages.clinic,
  'classroom-furniture-calculator': roomImages.classroom,
  'hostel-bed-planner': roomImages.hostel,
  'bulk-furniture-estimator': heroImages.institutional,
  'cafe-seating-calculator': roomImages.cafe,
  'hospitality-fitout-estimator': heroImages.hospitality,
  'opening-day-countdown': roomImages.hotel,
};

export const toolSegments = [
  {
    id: 'home',
    title: 'Home interiors',
    description: 'Kitchen budgets, whole-home planning, and layout helpers.',
    slugs: ['kitchen-cost-estimator', 'home-budget-calculator', 'kitchen-layout-recommender'],
  },
  {
    id: 'commercial',
    title: 'Commercial',
    description: 'Office capacity, clinic planning, and fitout ranges.',
    slugs: ['office-space-calculator', 'commercial-fitout-estimator', 'clinic-room-planner'],
  },
  {
    id: 'institutional',
    title: 'Institutional',
    description: 'Classrooms, hostels, and bulk furniture estimates.',
    slugs: ['classroom-furniture-calculator', 'hostel-bed-planner', 'bulk-furniture-estimator'],
  },
  {
    id: 'hospitality',
    title: 'Hospitality',
    description: 'Café seating, F&B fitouts, and opening-day timelines.',
    slugs: ['cafe-seating-calculator', 'hospitality-fitout-estimator', 'opening-day-countdown'],
  },
] as const;

export function getToolHero(slug: string): ImageMetadata {
  return toolHeroBySlug[slug] ?? projectImages.apartment;
}
