import type { IconName } from './iconPaths';
import { SITE } from './site';

export type SocialPlatform = 'youtube' | 'instagram' | 'facebook';

export type SocialChannelItem = {
  platform: SocialPlatform;
  category: string;
  title: string;
  href: string;
  image: string;
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

/** Cinema-strip reels — Facebook, Instagram, and YouTube kept as separate items. */
export const socialChannelItems: SocialChannelItem[] = [
  {
    platform: 'instagram',
    category: 'Kitchen Detail',
    title: 'Modular kitchen reel',
    href: `${SITE.social.instagram}/reels/`,
    image: '/images/reels/modular-kitchen-interior-mysuru.webp',
  },
  {
    platform: 'youtube',
    category: 'Walkthrough',
    title: 'Home interior video',
    href: SITE.social.youtube,
    image: '/images/reels/home-interior-walkthrough-mysuru.webp',
  },
  {
    platform: 'facebook',
    category: 'Behind the Design',
    title: 'Kitchen styling on Facebook',
    href: SITE.social.facebook,
    image: '/images/reels/kitchen-interior-design-mysuru.webp',
  },
  {
    platform: 'instagram',
    category: 'Project Snapshot',
    title: 'Bedroom reel',
    href: `${SITE.social.instagram}/reels/`,
    image: '/images/reels/bedroom-interior-mysuru.webp',
  },
  {
    platform: 'youtube',
    category: 'Walkthrough',
    title: 'Project showcase',
    href: SITE.social.youtube,
    image: '/images/reels/interior-project-showcase-mysuru.webp',
  },
  {
    platform: 'facebook',
    category: 'Site Moment',
    title: 'Kitchen finishes on Facebook',
    href: SITE.social.facebook,
    image: '/images/reels/contemporary-kitchen-styling-mysuru.webp',
  },
  {
    platform: 'instagram',
    category: 'Project Snapshot',
    title: 'Project reel',
    href: `${SITE.social.instagram}/reels/`,
    image: '/images/reels/interior-space-planning-mysuru.webp',
  },
  {
    platform: 'youtube',
    category: 'Walkthrough',
    title: 'Site walkthrough',
    href: SITE.social.youtube,
    image: '/images/reels/completed-interior-tour-mysuru.webp',
  },
];
