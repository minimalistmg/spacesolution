import { SITE } from './site';

export type InstagramReel = {
  /** Display title under the card */
  caption: string;
  /** Local thumbnail under /public/images/reels/ */
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
    thumbnail: '/images/reels/modular-kitchen.webp',
  },
  {
    caption: 'Residential interior walkthrough',
    thumbnail: '/images/reels/home-interior.webp',
  },
  {
    caption: 'Bedroom layout & wardrobes',
    thumbnail: '/images/reels/bedroom.webp',
  },
  {
    caption: 'Kitchen design details',
    thumbnail: '/images/reels/kitchen-1.webp',
  },
  {
    caption: 'Contemporary kitchen styling',
    thumbnail: '/images/reels/kitchen-2.webp',
  },
  {
    caption: 'Project showcase reel',
    thumbnail: '/images/reels/project-video-1.webp',
  },
  {
    caption: 'Space planning in action',
    thumbnail: '/images/reels/project-video-2.webp',
  },
  {
    caption: 'Completed interior tour',
    thumbnail: '/images/reels/project-video-3.webp',
  },
];
