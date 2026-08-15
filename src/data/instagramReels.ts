import { SITE } from './site';

export type InstagramReel = {
  /** Display title under the card */
  caption: string;
  /** Local thumbnail under /images/reels/ */
  thumbnail: string;
  /**
   * Instagram reel shortcode from the URL:
   * https://www.instagram.com/reel/{shortcode}/
   * When omitted, links to the profile reels tab.
   */
  shortcode?: string;
};

export const instagramProfileReelsUrl = `${SITE.social.instagram}/reels/`;

export function getInstagramReelUrl(reel: InstagramReel): string {
  if (reel.shortcode) {
    return `https://www.instagram.com/reel/${reel.shortcode}/`;
  }

  return instagramProfileReelsUrl;
}

/** Curated highlights — add `shortcode` from Instagram when available. */
export const instagramReels: InstagramReel[] = [
  {
    caption: 'Modular kitchen finish & storage',
    thumbnail: '/images/reels/modular-kitchen-interior-mysuru.webp',
  },
  {
    caption: 'Residential interior walkthrough',
    thumbnail: '/images/reels/home-interior-walkthrough-mysuru.webp',
  },
  {
    caption: 'Bedroom layout & wardrobes',
    thumbnail: '/images/reels/bedroom-interior-mysuru.webp',
  },
  {
    caption: 'Kitchen design details',
    thumbnail: '/images/reels/kitchen-interior-design-mysuru.webp',
  },
  {
    caption: 'Contemporary kitchen styling',
    thumbnail: '/images/reels/contemporary-kitchen-styling-mysuru.webp',
  },
  {
    caption: 'Project showcase reel',
    thumbnail: '/images/reels/interior-project-showcase-mysuru.webp',
  },
  {
    caption: 'Space planning in action',
    thumbnail: '/images/reels/interior-space-planning-mysuru.webp',
  },
  {
    caption: 'Completed interior tour',
    thumbnail: '/images/reels/completed-interior-tour-mysuru.webp',
  },
];
