export interface StudioTeamMember {
  name: string;
  role: string;
  /** Initials shown in the circular avatar */
  initials: string;
  /** Soft fill for the avatar disc */
  tone: string;
}

/**
 * Studio faces for the About “small team” band.
 * Swap placeholder names / add photo srcs when real headshots are ready.
 */
export const studioTeam: StudioTeamMember[] = [
  {
    name: 'Karthik B.J',
    role: 'Founder & Principal',
    initials: 'KB',
    tone: '#e8d5c4',
  },
  {
    name: 'Harshita',
    role: 'Lead Interior Designer',
    initials: 'HA',
    tone: '#dccfc0',
  },
  {
    name: 'Karthick',
    role: 'Site Supervisor',
    initials: 'KT',
    tone: '#e2d2c0',
  },
  {
    name: 'Priya',
    role: 'Design Coordinator',
    initials: 'PR',
    tone: '#ddd0c2',
  },
  {
    name: 'Ravi',
    role: 'Factory Lead',
    initials: 'RA',
    tone: '#d6c8b8',
  },
  {
    name: 'Meera',
    role: 'Client Experience',
    initials: 'ME',
    tone: '#e6d8c8',
  },
];
