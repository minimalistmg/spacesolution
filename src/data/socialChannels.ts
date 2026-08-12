import type { ImageMetadata } from 'astro';
import type { IconName } from './iconPaths';
import { SITE } from './site';
import { heroImages, roomImages } from './images';

export type SocialPlatform = 'youtube' | 'instagram' | 'facebook';

export type SocialChannelItem = {
  platform: SocialPlatform;
  category: string;
  title: string;
  href: string;
  image: ImageMetadata;
  alt: string;
  featured?: boolean;
};

export const socialPlatformMeta: Record<
  SocialPlatform,
  { label: string; icon: IconName }
> = {
  youtube: { label: 'YouTube', icon: 'youtube' },
  instagram: { label: 'Instagram', icon: 'instagram' },
  facebook: { label: 'Facebook', icon: 'facebook' },
};

export const socialChannelsFollow = {
  label: 'Follow us @spacesolutions.mys',
  href: SITE.social.instagram,
} as const;

/** Curated channel highlights for the above-footer social section. */
export const socialChannelItems: SocialChannelItem[] = [
  {
    platform: 'youtube',
    category: 'Walkthrough',
    title: 'Timeless Interiors, Thoughtfully Crafted for Everyday Living',
    href: SITE.social.youtube,
    image: roomImages.livingDining,
    alt: 'Living and dining interior walkthrough',
    featured: true,
  },
  {
    platform: 'instagram',
    category: 'Kitchen Detail',
    title: 'Where function meets flow in a modular kitchen',
    href: `${SITE.social.instagram}/reels/`,
    image: roomImages.modularKitchen,
    alt: 'Modular kitchen island detail',
  },
  {
    platform: 'facebook',
    category: 'Behind the Design',
    title: 'Crafting calm, one space at a time in the home',
    href: SITE.social.facebook,
    image: roomImages.bedroom,
    alt: 'Calm residential seating corner',
  },
  {
    platform: 'instagram',
    category: 'Project Snapshot',
    title: 'Clean lines and considered details in every finish',
    href: `${SITE.social.instagram}/reels/`,
    image: heroImages.kitchen2,
    alt: 'Kitchen cabinetry and styling detail',
  },
];
