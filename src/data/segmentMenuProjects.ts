import type { MenuIconName } from './headerMenuIcons';
import { getProjectPlaceIcon } from './projectPlaceIcons';
import { segmentMegaMenus } from './segmentMegaMenus';

export interface SegmentMenuProjectLink {
  label: string;
  href: string;
  location: string;
  placeIcon?: MenuIconName;
}

/** Desktop segment mega menu projects - mirrors segmentMegaMenus project lists. */
export const segmentMenuProjects: Record<
  'home' | 'commercial' | 'institutional' | 'hospitality',
  SegmentMenuProjectLink[]
> = {
  home: segmentMegaMenus.home.projects,
  commercial: segmentMegaMenus.commercial.projects,
  institutional: segmentMegaMenus.institutional.projects,
  hospitality: segmentMegaMenus.hospitality.projects,
};

export function segmentMenuProjectIcon(project: SegmentMenuProjectLink): MenuIconName {
  return getProjectPlaceIcon(project.location, project.placeIcon);
}
