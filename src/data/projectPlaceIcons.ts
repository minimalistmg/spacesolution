import type { MenuIconName } from './headerMenuIcons';

/** Resolve a place icon from a project location label. */
export function getProjectPlaceIcon(location: string, override?: MenuIconName): MenuIconName {
  if (override) return override;

  const normalized = location.toLowerCase();

  if (normalized.includes('mysuru') || normalized.includes('mysore')) {
    return 'castle-turret';
  }
  if (normalized.includes('bengaluru') || normalized.includes('bangalore')) {
    return 'buildings';
  }
  if (normalized.includes('madikeri') || normalized.includes('coorg')) {
    return 'mountains';
  }
  if (normalized.includes('mandya')) {
    return 'flag';
  }

  return 'map-pin';
}
