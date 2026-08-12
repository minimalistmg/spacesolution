import type { NavPage } from '../components/Header.astro';

import type { ProjectCategory } from './projects';

import { getProjectBySlug } from './projects';

import { getServiceHub, getServiceLandingPage } from './servicePages';

import {

  resolveGuideNavSegment,

  resolveToolNavSegment,

  resolveTurnkeyNavSegment,

} from './navResourceSegments';



const STUDIO_PATH_PREFIXES = [

  '/about',

  '/contact',

  '/tools',

  '/design-library',

  '/portfolio',

  '/showcase',

  '/stories',

  '/faq',

  '/project-detail',

];



function normalizePathname(pathname: string): string {

  let path = pathname.split('?')[0].split('#')[0].replace(/\.html$/, '');

  if (path !== '/' && path.endsWith('/')) {

    path = path.slice(0, -1);

  }

  return path || '/';

}



function categoryToNavPage(category: ProjectCategory): NavPage {

  if (category === 'Residential') return 'home-interiors';

  if (category === 'Hospitality') return 'hospitality';

  if (category === 'Commercial' || category === 'Wellness' || category === 'Pop-Up Events') {

    return 'commercial';

  }

  return 'studio';

}



function resolveProjectNav(slug: string): NavPage {

  const project = getProjectBySlug(slug);

  if (!project?.categories.length) return 'studio';



  const categories = project.categories;

  if (categories.includes('Residential')) return 'home-interiors';

  if (categories.includes('Hospitality')) return 'hospitality';

  if (categories.some((category) => categoryToNavPage(category) === 'commercial')) {

    return 'commercial';

  }



  return categoryToNavPage(categories[0]);

}



function resolveServiceSlug(slug: string): NavPage | null {

  const landing = getServiceLandingPage(slug);

  if (landing) return landing.activePage;



  const hub = getServiceHub(slug);

  if (hub) return hub.activePage;



  return null;

}



function isStudioPath(path: string): boolean {

  return STUDIO_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

}



/**

 * Resolve which main-nav panel should appear active for a URL.

 * Returns `home` when no segment menu should be highlighted (homepage, legal, unknown).

 * Pass `override` only when a page must force a specific nav state.

 */

export function resolveNavActive(pathname: string, override?: NavPage): NavPage {

  if (override) return override;



  const path = normalizePathname(pathname);

  if (path === '/') return 'home';

  if (path === '/privacy-policy') return 'home';



  const turnkeyNav = resolveTurnkeyNavSegment(path);

  if (turnkeyNav) return turnkeyNav;



  const projectMatch = path.match(/^\/projects\/([^/]+)$/);

  if (projectMatch) return resolveProjectNav(projectMatch[1]);



  const toolMatch = path.match(/^\/tools\/([^/]+)$/);

  if (toolMatch) {

    const toolNav = resolveToolNavSegment(toolMatch[1]);

    if (toolNav) return toolNav;

  }



  const guideMatch = path.match(/^\/design-library\/([^/]+)$/);

  if (guideMatch) {

    const guideNav = resolveGuideNavSegment(guideMatch[1]);

    if (guideNav) return guideNav;

  }



  if (isStudioPath(path)) return 'studio';



  const slug = path.slice(1);

  const serviceNav = resolveServiceSlug(slug);

  if (serviceNav) return serviceNav;



  return 'home';

}


