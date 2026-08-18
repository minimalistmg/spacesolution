import type { ConsultFormConfig, ConsultFormStep } from './consultFormConfigs';

interface InterestCopy {
  lead: string;
  step: ConsultFormStep;
  hint: string;
  messagePlaceholder: string;
  messageNote: string;
}

const INTEREST_COPY: Record<string, InterestCopy> = {
  kitchen: {
    lead: 'See your modular kitchen in 3D before we build - layout, storage, and finishes from our Mysuru studio and factory.',
    step: {
      title: 'Tell us about the kitchen',
      description: 'Shape, size, and how you cook - enough for a first 3D layout.',
    },
    hint: 'Kitchen is selected. Add other rooms if this is part of a larger home.',
    messagePlaceholder: 'L-shape, 10 ft, moving in December…',
    messageNote: 'A rough size or phone photo of the current kitchen is enough to start.',
  },
  wardrobe: {
    lead: 'See your wardrobes and storage in 3D before we build - designed around how you actually dress and put things away.',
    step: {
      title: 'Tell us about the storage',
      description: 'Bedrooms, loft, or a full wardrobe wall - share counts and room sizes.',
    },
    hint: 'Wardrobes are selected. Add other rooms if you want them in the same 3D.',
    messagePlaceholder: 'Two bedrooms, sliding wardrobes, loft storage…',
    messageNote: 'Room width and what you need to store are enough for a first pass.',
  },
  living: {
    lead: 'See your living and dining in 3D before we build - seating, storage, and flow designed for everyday use.',
    step: {
      title: 'Tell us about the living space',
      description: 'Living, dining, or both - share how the family uses the room.',
    },
    hint: 'Living is selected. Add other rooms if this is part of a full-home brief.',
    messagePlaceholder: 'Open living-dining, TV unit, seating for eight…',
    messageNote: 'A floor plan or a wide phone photo of the room is enough to start.',
  },
  bedroom: {
    lead: 'See your bedrooms in 3D before we build - wardrobes, beds, and study nooks designed around how you rest.',
    step: {
      title: 'Tell us about the bedrooms',
      description: 'Master, kids, or guest - share how many rooms and what storage you need.',
    },
    hint: 'Bedrooms are selected. Add other rooms if you want them in the same 3D.',
    messagePlaceholder: 'Master plus two kids rooms, study table, loft…',
    messageNote: 'Room counts and a rough size are enough for a first consult.',
  },
  pooja: {
    lead: 'See your pooja room in 3D before we build - a calm, well-lit space designed to the rituals you follow.',
    step: {
      title: 'Tell us about the pooja space',
      description: 'Dedicated room or a living-room niche - share size and what you want housed.',
    },
    hint: 'Pooja is selected. Add other rooms if this is part of a larger home.',
    messagePlaceholder: '4 x 5 ft niche, mandir unit, storage for pooja items…',
    messageNote: 'A photo of the current corner or the planned alcove is enough to start.',
  },
  full: {
    lead: 'See the full home in 3D before we build - kitchen, wardrobes, living, bedrooms, and pooja in one language.',
    step: {
      title: 'Tell us about the home',
      description: 'Share BHK, which floors, and which rooms matter most to start.',
    },
    hint: 'Full home is selected - every room on this list is included.',
    messagePlaceholder: '3 BHK, kitchen plus all wardrobes, moving in March…',
    messageNote: 'A floor plan or BHK type is enough. Photos on your phone are fine.',
  },
  office: {
    lead: 'We measure your office, understand how the team works, and return a clear scope and quote for the fitout.',
    step: {
      title: 'Tell us about the office',
      description: 'Headcount, cabins, and meeting rooms - share location and approximate carpet area.',
    },
    hint: 'Office is selected. Add another type if the project spans more than one space.',
    messagePlaceholder: 'Floor, workstations, cabins, move-in date…',
    messageNote: 'A headcount or existing layout photo helps us prepare for the survey.',
  },
  clinic: {
    lead: 'We measure your clinic, understand patient and staff flow, and return a clear scope and quote for the fitout.',
    step: {
      title: 'Tell us about the clinic',
      description: 'Consulting rooms, waiting, and services - share location and approximate carpet area.',
    },
    hint: 'Clinic is selected. Add another type if the project spans more than one space.',
    messagePlaceholder: 'Consulting rooms, waiting area, move-in date…',
    messageNote: 'A room list or existing layout photo helps us prepare for the survey.',
  },
  retail: {
    lead: 'We measure your retail or showroom, understand display and customer flow, and return a clear scope and quote.',
    step: {
      title: 'Tell us about the store',
      description: 'Display, billing, and stock - share location and approximate carpet area.',
    },
    hint: 'Retail is selected. Add another type if the project spans more than one space.',
    messagePlaceholder: 'Frontage, display walls, stock room, opening date…',
    messageNote: 'A floor plan or photos of the shell space help us prepare for the survey.',
  },
  coworking: {
    lead: 'We measure your co-working floor, understand desks and meeting rooms, and return a clear scope and quote.',
    step: {
      title: 'Tell us about the co-working space',
      description: 'Hot desks, cabins, and common areas - share location and approximate carpet area.',
    },
    hint: 'Co-working is selected. Add another type if the project spans more than one space.',
    messagePlaceholder: 'Desk count, cabins, pantry, move-in date…',
    messageNote: 'A seat count or existing layout photo helps us prepare for the survey.',
  },
  school: {
    lead: 'Classrooms and campus blocks - tell us your scale and we will plan supply, delivery, and installation.',
    step: {
      title: 'Share classroom needs',
      description: 'Classrooms, labs, or staff rooms - select what you need furnished.',
    },
    hint: 'School is selected. Add another type if the campus needs more than one area.',
    messagePlaceholder: 'Classroom count, benches, teacher tables, timeline…',
    messageNote: 'A room list or tender note is helpful but not required to start.',
  },
  hostel: {
    lead: 'Hostel and PG furniture at scale - tell us bed counts and we will plan supply, delivery, and installation.',
    step: {
      title: 'Share hostel needs',
      description: 'Beds, study units, and common rooms - select what you need furnished.',
    },
    hint: 'Hostel is selected. Add another type if the campus needs more than one area.',
    messagePlaceholder: '120 beds, study tables, wardrobes, timeline…',
    messageNote: 'A bed count or room list is helpful but not required to start.',
  },
  library: {
    lead: 'Libraries and labs built for daily use - tell us your scale and we will plan supply, delivery, and installation.',
    step: {
      title: 'Share library or lab needs',
      description: 'Stacks, reading tables, or lab benches - select what you need furnished.',
    },
    hint: 'Library is selected. Add another type if the campus needs more than one area.',
    messagePlaceholder: 'Reading seats, stacks, lab benches, timeline…',
    messageNote: 'A seating count or room list is helpful but not required to start.',
  },
  admin: {
    lead: 'Admin and staff offices for campuses - tell us your scale and we will plan supply, delivery, and installation.',
    step: {
      title: 'Share admin office needs',
      description: 'Cabins, workstations, and meeting rooms - select what you need furnished.',
    },
    hint: 'Admin is selected. Add another type if the campus needs more than one area.',
    messagePlaceholder: 'Staff count, cabins, conference room, timeline…',
    messageNote: 'A headcount or room list is helpful but not required to start.',
  },
  cafe: {
    lead: 'Visualise your café or restaurant in 3D - counters, seating, and guest flow before opening day.',
    step: {
      title: 'Tell us about the café',
      description: 'Seating, counter, and kitchen support - we design around service and brand feel.',
    },
    hint: 'Café is selected. Add another type if the venue spans more than one format.',
    messagePlaceholder: 'Seating count, counter length, opening month…',
    messageNote: 'A floor plan or photos of the shell space are enough for a first consult.',
  },
  hotel: {
    lead: 'Visualise your hotel or resort interiors in 3D - lobby, rooms, and F&B before guests arrive.',
    step: {
      title: 'Tell us about the hotel',
      description: 'Lobby, rooms, or F&B - we design around guest flow and brand feel.',
    },
    hint: 'Hotel is selected. Add another type if the property spans more than one venue.',
    messagePlaceholder: 'Room count, lobby brief, opening month…',
    messageNote: 'A floor plan or photos of the shell space are enough for a first consult.',
  },
  bar: {
    lead: 'Visualise your bar or lounge in 3D - counter, seating, and lighting before opening night.',
    step: {
      title: 'Tell us about the bar',
      description: 'Counter, seating, and back bar - we design around service and brand feel.',
    },
    hint: 'Bar is selected. Add another type if the venue spans more than one format.',
    messagePlaceholder: 'Covers, bar length, DJ or lounge, opening month…',
    messageNote: 'A floor plan or photos of the shell space are enough for a first consult.',
  },
  salon: {
    lead: 'Visualise your salon or wellness studio in 3D - stations, waiting, and flow before you open.',
    step: {
      title: 'Tell us about the salon',
      description: 'Stations, waiting, and treatment rooms - we design around guest flow and brand feel.',
    },
    hint: 'Salon is selected. Add another type if the venue spans more than one format.',
    messagePlaceholder: 'Chair count, treatment rooms, opening month…',
    messageNote: 'A floor plan or photos of the shell space are enough for a first consult.',
  },
};

export function applyConsultInterestContext(
  config: ConsultFormConfig,
  preselected: string[],
): ConsultFormConfig {
  const value = preselected[0];
  if (!value) return config;

  const option = config.interest.options.find((item) => item.value === value);
  if (!option || option.id === 'others') return config;

  const copy = INTEREST_COPY[option.id];
  if (!copy) return config;

  const lastCrumb = config.breadcrumb[config.breadcrumb.length - 1];
  const leadingCrumbs = config.breadcrumb.slice(0, -1);

  return {
    ...config,
    lead: copy.lead,
    steps: config.steps.map((step, index) => (index === 0 ? { ...step, ...copy.step } : step)),
    messagePlaceholder: copy.messagePlaceholder,
    messageNote: copy.messageNote,
    breadcrumb: lastCrumb
      ? [...leadingCrumbs, { label: option.short }, lastCrumb]
      : config.breadcrumb,
    interest: {
      ...config.interest,
      hint: copy.hint,
    },
  };
}
