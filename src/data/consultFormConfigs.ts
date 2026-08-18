import type { NavPage } from '../components/Header.astro';

import type { ConnectCategoryId } from './connectFormInterests';

import { FORM_LABELS } from './formFieldLabels';

import { getConsultInterestOptions, resolveConsultInterestFromSlug, serviceSlugToSubService } from './consultInterestOptions';

import type { MenuIconName } from './headerMenuIcons';



export type ConsultFormKind = 'home-3d' | 'commercial-survey' | 'institutional-bulk' | 'hospitality-3d';



export interface ConsultInterestOption {

  id: string;

  label: string;

  short: string;

  value: string;

  icon: MenuIconName;

  isFullHome?: boolean;

}



export interface ConsultExtraField {

  id: string;

  name: string;

  label: string;

  placeholder?: string;

  type: 'text' | 'number' | 'month';

  optional?: boolean;

}



export interface ConsultFormStep {

  title: string;

  description: string;

}



export interface ConsultBreadcrumbItem {

  label: string;

  href?: string;

}



export interface ConsultFormConfig {

  kind: ConsultFormKind;

  path: string;

  activePage: NavPage;

  source: string;

  category: string;

  connectCategoryId: ConnectCategoryId;

  seoTitle: string;

  seoDescription: string;

  breadcrumb: ConsultBreadcrumbItem[];

  kicker: string;

  titleBefore: string;

  titleEm?: string;

  titleAfter?: string;

  lead: string;

  steps: ConsultFormStep[];

  interest: {

    legend: string;

    hint: string;

    variant: 'cards';

    columns: 3 | 4;

    options: ConsultInterestOption[];

    fullHomeSync?: boolean;

  };

  extraFields?: ConsultExtraField[];

  messagePlaceholder: string;

  messageNote: string;

  submitLabel: string;

}



export const CONSULT_PATHS = {

  home3d: '/free-3d-consultation',

  commercialSurvey: '/commercial-site-survey',

  institutionalBulk: '/bulk-furniture-enquiry',

  hospitality3d: '/hospitality-3d-consultation',

} as const;



const kindToConnectCategory: Record<ConsultFormKind, ConnectCategoryId> = {

  'home-3d': 'home',

  'commercial-survey': 'commercial',

  'institutional-bulk': 'institutional',

  'hospitality-3d': 'hospitality',

};



function buildInterest(

  connectCategoryId: ConnectCategoryId,

  legend: string,

  hint: string,

  columns: 3 | 4,

  fullHomeSync?: boolean,

): ConsultFormConfig['interest'] {

  return {

    legend,

    hint,

    variant: 'cards',

    columns,

    fullHomeSync,

    options: getConsultInterestOptions(connectCategoryId),

  };

}



export const consultFormConfigs: Record<ConsultFormKind, ConsultFormConfig> = {

  'home-3d': {

    kind: 'home-3d',

    path: CONSULT_PATHS.home3d,

    activePage: 'home-interiors',

    source: 'home-3d-consult',

    category: 'Home',

    connectCategoryId: 'home',

    seoTitle: 'Free 3D Home Interior Consultation in Mysuru | Space Solution',

    seoDescription:

      'Book a free 3D consultation for your Mysuru home. Choose kitchen, wardrobes, living, bedrooms, pooja, or full-home interiors - see the design before we build.',

    breadcrumb: [

      { label: 'Space Solution', href: '/' },

      { label: 'Home Interiors', href: '/residential-interiors' },

      { label: 'Free 3D consultation' },

    ],

    kicker: 'Home interiors',

    titleBefore: 'Free 3D ',

    titleEm: 'consultation',

    lead:

      'See your kitchen, wardrobes, and rooms in 3D before we build - designed and made at our Mysuru studio and factory.',

    steps: [

      {

        title: 'Choose your rooms',

        description: 'Kitchen, wardrobes, living, bedrooms, pooja - or the full home in one language.',

      },

      {

        title: 'We design in 3D',

        description: 'A Mysuru designer maps layout, storage, and finishes to how your family actually lives.',

      },

      {

        title: 'Review, then we build',

        description: 'Approve the look before factory production. No obligation until you say yes.',

      },

    ],

    interest: buildInterest(

      'home',

      'Rooms to visualise',

      'Select one or several. Full home covers every room.',

      3,

      true,

    ),

    messagePlaceholder: 'Kitchen, two wardrobes, moving in December…',

    messageNote: 'Floor plan, room sizes, or a budget range are enough to start. Photos on your phone are fine.',

    submitLabel: FORM_LABELS.submit,

  },

  'commercial-survey': {

    kind: 'commercial-survey',

    path: CONSULT_PATHS.commercialSurvey,

    activePage: 'commercial',

    source: 'commercial-site-survey',

    category: 'Commercial',

    connectCategoryId: 'commercial',

    seoTitle: 'Commercial Site Survey & Quote in Mysuru | Space Solution',

    seoDescription:

      'Request a site survey and fitout quote for your office, clinic, retail, or co-working space in Mysuru and Karnataka.',

    breadcrumb: [

      { label: 'Space Solution', href: '/' },

      { label: 'Commercial', href: '/commercial-interiors' },

      { label: 'Site survey & quote' },

    ],

    kicker: 'Commercial',

    titleBefore: 'Site survey & ',

    titleEm: 'quote',

    lead:

      'We measure your site, understand how your team works, and return a clear scope and quote for the fitout.',

    steps: [

      {

        title: 'Tell us about the space',

        description: 'Office, clinic, retail, or co-working - share location and approximate carpet area.',

      },

      {

        title: 'We survey on site',

        description: 'Our team visits Mysuru or your Karnataka location to measure and note services.',

      },

      {

        title: 'Quote & timeline',

        description: 'You receive a structured quote with milestones - no obligation until you approve.',

      },

    ],

    interest: buildInterest('commercial', 'Space type', 'Select the type that best matches your project.', 4),

    extraFields: [

      {

        id: 'carpet-area',

        name: 'carpet_area',

        label: 'Carpet area',

        placeholder: 'e.g. 2,500 sq ft',

        type: 'text',

        optional: true,

      },

    ],

    messagePlaceholder: 'Floor, power points, move-in date…',

    messageNote: 'Existing layout photos or a rough sketch help us prepare for the survey.',

    submitLabel: FORM_LABELS.submit,

  },

  'institutional-bulk': {

    kind: 'institutional-bulk',

    path: CONSULT_PATHS.institutionalBulk,

    activePage: 'institutional',

    source: 'institutional-bulk',

    category: 'Institutional',

    connectCategoryId: 'institutional',

    seoTitle: 'Bulk Furniture Enquiry for Campuses & Institutions | Space Solution',

    seoDescription:

      'Enquire about bulk furniture for schools, hostels, libraries, labs, and admin offices - manufactured in Mysuru, delivered across Karnataka.',

    breadcrumb: [

      { label: 'Space Solution', href: '/' },

      { label: 'Institutional', href: '/institutional-interiors' },

      { label: 'Bulk furniture enquiry' },

    ],

    kicker: 'Institutional',

    titleBefore: 'Bulk furniture ',

    titleEm: 'enquiry',

    lead:

      'Classrooms, hostels, labs, and admin blocks - tell us your scale and we will plan supply, delivery, and installation.',

    steps: [

      {

        title: 'Share institution type',

        description: 'School, hostel, library, lab, or admin - select what you need furnished.',

      },

      {

        title: 'We scope quantities',

        description: 'Unit counts, room types, and durability requirements for daily institutional use.',

      },

      {

        title: 'Quote & delivery plan',

        description: 'Factory-made furniture from Mysuru with a phased delivery schedule.',

      },

    ],

    interest: buildInterest(

      'institutional',

      'Institution type',

      'Select one or several areas you need furniture for.',

      4,

    ),

    extraFields: [

      {

        id: 'unit-count',

        name: 'unit_count',

        label: 'Units / rooms',

        placeholder: 'e.g. 120 beds, 8 classrooms',

        type: 'text',

        optional: true,

      },

    ],

    messagePlaceholder: 'Timeline, standards, existing furniture…',

    messageNote: 'Tender documents or a room list are helpful but not required to start.',

    submitLabel: FORM_LABELS.submit,

  },

  'hospitality-3d': {

    kind: 'hospitality-3d',

    path: CONSULT_PATHS.hospitality3d,

    activePage: 'hospitality',

    source: 'hospitality-3d-consult',

    category: 'Hospitality',

    connectCategoryId: 'hospitality',

    seoTitle: 'Free 3D Hospitality Interior Consultation | Space Solution Mysuru',

    seoDescription:

      'Book a free 3D consultation for your café, restaurant, hotel, bar, or salon - see the fitout before opening day.',

    breadcrumb: [

      { label: 'Space Solution', href: '/' },

      { label: 'Hospitality', href: '/hospitality-interiors' },

      { label: 'Free 3D consultation' },

    ],

    kicker: 'Hospitality',

    titleBefore: 'Free 3D ',

    titleEm: 'consultation',

    lead:

      'Cafés, hotels, bars, and salons - visualise counters, seating, and flow in 3D before your opening day.',

    steps: [

      {

        title: 'Choose your venue type',

        description: 'Café, hotel, bar, or salon - we design around guest flow and brand feel.',

      },

      {

        title: 'We design in 3D',

        description: 'Layout, materials, and lighting aligned to your service style and local codes.',

      },

      {

        title: 'Review before build',

        description: 'Approve the 3D look, then we manufacture and install on your timeline.',

      },

    ],

    interest: buildInterest('hospitality', 'Venue type', 'Select the type closest to your project.', 4),

    extraFields: [

      {

        id: 'opening-target',

        name: 'opening_target',

        label: 'Target opening',

        placeholder: 'Month or season',

        type: 'month',

        optional: true,

      },

    ],

    messagePlaceholder: 'Seating count, brand brief, lease dates…',

    messageNote: 'A floor plan or photos of the shell space are enough for a first consult.',

    submitLabel: FORM_LABELS.submit,

  },

};



const pathToKind: Record<string, ConsultFormKind> = {

  [CONSULT_PATHS.home3d]: 'home-3d',

  [CONSULT_PATHS.commercialSurvey]: 'commercial-survey',

  [CONSULT_PATHS.institutionalBulk]: 'institutional-bulk',

  [CONSULT_PATHS.hospitality3d]: 'hospitality-3d',

};



function normalizePathname(pathname: string): string {

  let path = pathname.split('?')[0].split('#')[0].replace(/\.html$/, '');

  if (path !== '/' && path.endsWith('/')) {

    path = path.slice(0, -1);

  }

  return path || '/';

}



export function getConsultConfigByPath(pathname: string): ConsultFormConfig | undefined {

  const path = normalizePathname(pathname);

  const kind = pathToKind[path];

  return kind ? consultFormConfigs[kind] : undefined;

}



export function getConsultConfig(kind: ConsultFormKind): ConsultFormConfig {

  return consultFormConfigs[kind];

}



export function resolveConsultPreselect(

  config: ConsultFormConfig,

  pathname: string,

  searchParams: URLSearchParams,

): string[] {

  const interestParam = searchParams.get('interest')?.trim();

  if (interestParam) {

    const byOption = config.interest.options.find(

      (option) =>

        option.id === interestParam ||

        option.value === interestParam ||

        option.label === interestParam,

    );

    if (byOption) return [byOption.value];



    const fromSlug = resolveConsultInterestFromSlug(interestParam, config.connectCategoryId);

    if (fromSlug) return [fromSlug];



    const fromGlobalSlug = serviceSlugToSubService[interestParam];

    if (fromGlobalSlug && config.interest.options.some((option) => option.value === fromGlobalSlug)) {

      return [fromGlobalSlug];

    }

  }



  const slug = normalizePathname(pathname).replace(/^\//, '');

  const fromPath = resolveConsultInterestFromSlug(slug, config.connectCategoryId);

  if (fromPath) return [fromPath];



  return [];

}



export function buildConsultBreadcrumbHtml(items: ConsultBreadcrumbItem[]): string {

  return items

    .map((item, index) => {

      const isLast = index === items.length - 1;

      if (isLast || !item.href) {

        return `<span>${item.label}</span>`;

      }

      return `<a href="${item.href}">${item.label}</a>`;

    })

    .join(' <span class="breadcrumb-sep">/</span> ');

}



export { FORM_LABELS };


