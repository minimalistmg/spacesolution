export type CalendarPlatformId = 'meet' | 'zoom' | 'teams';

export interface CalendarPlatformLink {
  id: CalendarPlatformId;
  label: string;
  href: string;
}

export const CALENDAR_PLATFORM_LINKS: CalendarPlatformLink[] = [
  {
    id: 'meet',
    label: 'Google Meet',
    href: 'https://meet.google.com/landing',
  },
  {
    id: 'zoom',
    label: 'Zoom call',
    href: '/contact?platform=zoom',
  },
  {
    id: 'teams',
    label: "Team's meeting",
    href: '/contact?platform=teams',
  },
];

export function calendarLinkOpensExternal(href: string) {
  return href.startsWith('http');
}
