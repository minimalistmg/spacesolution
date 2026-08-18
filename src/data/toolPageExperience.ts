export interface ToolExperience {
  resultTitle: string;
  resultLead: string;
  insightCards: { title: string; description: string }[];
  guidanceTitle: string;
  guidance: string[];
  service: { label: string; href: string };
  guide: { label: string; href: string };
}

const experiences: Record<string, ToolExperience> = {
  'kitchen-cost-estimator': {
    resultTitle: 'Turn the range into a kitchen brief',
    resultLead: 'Use the result to set a working budget before materials, internals, and site conditions are confirmed.',
    insightCards: [
      { title: 'Usually included', description: 'Modular carcasses, shutters, standard hardware, and a countertop allowance.' },
      { title: 'Usually separate', description: 'Appliances, civil changes, gas piping, and major plumbing shifts.' },
      { title: 'Largest cost driver', description: 'Shutter finish, hardware grade, counter choice, and total cabinet run.' },
      { title: 'Keep a buffer', description: 'Allow 10 to 15% until the site measure and appliance schedule are locked.' },
    ],
    guidanceTitle: 'Check these before accepting the range',
    guidance: [
      'Measure usable cabinet walls, not the full room perimeter.',
      'Confirm whether the counter and backsplash are part of the same scope.',
      'List tall units, corner hardware, and appliance housings separately.',
    ],
    service: { label: 'Modular Kitchen', href: '/modular-kitchen' },
    guide: { label: 'Modular Kitchen Guide', href: '/design-library/modular-kitchen-guide' },
  },
  'home-budget-calculator': {
    resultTitle: 'Read the budget room by room',
    resultLead: 'The total is a planning envelope. Kitchen and wardrobes usually take the largest share.',
    insightCards: [
      { title: 'Kitchen', description: 'Plan roughly 25 to 35% when the kitchen includes counters and full internals.' },
      { title: 'Wardrobes', description: 'Plan roughly 25 to 30%, depending on ceiling height and shutter finish.' },
      { title: 'Living and bedrooms', description: 'TV units, bed walls, studies, and pooja joinery form the remaining core scope.' },
      { title: 'Contingency', description: 'Hold 10 to 15% for site changes, electrical work, and finish upgrades.' },
    ],
    guidanceTitle: 'Build a useful full-home brief',
    guidance: [
      'Separate must-have rooms from work that can be phased later.',
      'Use one finish band across rooms before comparing upgrades.',
      'Keep loose furniture and major civil work outside the joinery allowance.',
    ],
    service: { label: 'Full Home Interiors', href: '/full-home-interiors' },
    guide: { label: 'Before You Renovate', href: '/design-library/before-you-renovate' },
  },
  'kitchen-layout-recommender': {
    resultTitle: 'Confirm the layout with real clearances',
    resultLead: 'The recommendation is a starting point. Doors, windows, plumbing, and aisle width decide whether it works.',
    insightCards: [
      { title: 'L-shaped', description: 'A flexible choice for open corners and medium apartment kitchens.' },
      { title: 'U-shaped', description: 'More counter and storage when three usable walls are available.' },
      { title: 'Parallel', description: 'Efficient for narrow rooms when the aisle stays clear between two runs.' },
      { title: 'Island', description: 'Best for larger open plans with circulation around every side.' },
    ],
    guidanceTitle: 'Measure before choosing',
    guidance: [
      'Mark doors, windows, plumbing, gas, and electrical points.',
      'Keep appliance doors from colliding across a narrow aisle.',
      'Confirm the work triangle during a site measure before production.',
    ],
    service: { label: 'Modular Kitchen', href: '/modular-kitchen' },
    guide: { label: 'Space Planning', href: '/design-library/space-planning' },
  },
  'office-space-calculator': {
    resultTitle: 'Turn area into a workable seat plan',
    resultLead: 'The estimate should leave room for circulation, meetings, support spaces, and future growth.',
    insightCards: [
      { title: 'Workstations', description: 'Open desks form the core area, including chair movement and local aisles.' },
      { title: 'Meeting rooms', description: 'Allow for the table, chairs, screen wall, and door clearance.' },
      { title: 'Support spaces', description: 'Reception, pantry, storage, print, and server needs sit outside desk count.' },
      { title: 'Growth buffer', description: 'Keep 5 to 10% spare capacity if the team is expected to grow.' },
    ],
    guidanceTitle: 'Check density before locking seats',
    guidance: [
      'Count regular staff, visitors, shifts, and hybrid attendance separately.',
      'Protect the main circulation route from desk and chair movement.',
      'Confirm power, data, HVAC, and fire requirements with the final plan.',
    ],
    service: { label: 'Office Interiors', href: '/office-interiors' },
    guide: { label: 'Space Planning', href: '/design-library/space-planning' },
  },
  'commercial-fitout-estimator': {
    resultTitle: 'Understand what moves the fitout range',
    resultLead: 'Area sets the base, while service intensity, partitions, joinery, and finish level move the final number.',
    insightCards: [
      { title: 'Interior works', description: 'Partitions, ceilings, flooring, paint, and basic lighting form the broad fitout layer.' },
      { title: 'Joinery', description: 'Workstations, counters, storage, and display are driven by quantity and finish.' },
      { title: 'Specialist services', description: 'HVAC, fire, IT, medical, kitchen, and display systems may sit outside the range.' },
      { title: 'Contingency', description: 'Keep 10 to 15% until drawings and service loads are coordinated.' },
    ],
    guidanceTitle: 'Compare estimates on the same scope',
    guidance: [
      'Separate shell work, services, joinery, and loose furniture.',
      'Define whether approvals and specialist equipment are included.',
      'Set the opening date before agreeing the procurement sequence.',
    ],
    service: { label: 'Commercial Interiors', href: '/commercial-interiors' },
    guide: { label: 'Materials & Finishes', href: '/design-library/materials-and-finishes' },
  },
  'clinic-room-planner': {
    resultTitle: 'Turn room counts into a patient path',
    resultLead: 'Reception, waiting, consultation, procedure, and support rooms should work as one sequence.',
    insightCards: [
      { title: 'Arrival', description: 'Reception and waiting need clear access without blocking consultation doors.' },
      { title: 'Consultation', description: 'Allow desk, patient seating, exam space, storage, and privacy.' },
      { title: 'Procedure', description: 'Wet points, equipment clearances, and clean storage need early coordination.' },
      { title: 'Support', description: 'Staff, records, sterilisation, utility, and accessible circulation are essential.' },
    ],
    guidanceTitle: 'Check the clinical brief',
    guidance: [
      'Map patient, staff, and clean-dirty movement separately.',
      'Confirm equipment and plumbing before fixing cabinet sizes.',
      'Validate local accessibility, fire, and healthcare requirements.',
    ],
    service: { label: 'Clinic Interiors', href: '/clinic-interiors' },
    guide: { label: 'Space Planning', href: '/design-library/space-planning' },
  },
  'classroom-furniture-calculator': {
    resultTitle: 'Convert student count into a room set',
    resultLead: 'The furniture quantity should still preserve teaching sightlines, aisles, and age-appropriate dimensions.',
    insightCards: [
      { title: 'Student furniture', description: 'Desk or bench quantity follows students per room and the teaching model.' },
      { title: 'Teacher zone', description: 'Include a teacher table, board wall, and lockable storage.' },
      { title: 'Shared storage', description: 'Bag, book, and activity storage prevents aisles from becoming cluttered.' },
      { title: 'Spare units', description: 'Keep a small replacement allowance for high-use campus furniture.' },
    ],
    guidanceTitle: 'Validate every classroom type',
    guidance: [
      'Use different furniture heights for different age groups.',
      'Check aisles, door swings, supervision, and board visibility.',
      'Standardise modules where maintenance and bulk replacement matter.',
    ],
    service: { label: 'School Interiors', href: '/school-interiors' },
    guide: { label: 'Space Planning', href: '/design-library/space-planning' },
  },
  'hostel-bed-planner': {
    resultTitle: 'Plan beds, study, and storage together',
    resultLead: 'A bed count only works when every resident also has safe access, storage, and a place to study.',
    insightCards: [
      { title: 'Bed type', description: 'Single, bunk, or loft beds change capacity and circulation.' },
      { title: 'Study provision', description: 'Allow a desk or ledge, chair clearance, light, and power for each resident.' },
      { title: 'Personal storage', description: 'Wardrobes or lockers should be counted per bed, not per room.' },
      { title: 'Common areas', description: 'Lounges, dining, laundry, and luggage storage sit outside bedroom capacity.' },
    ],
    guidanceTitle: 'Check occupancy before ordering',
    guidance: [
      'Protect ladder, door, and emergency circulation clearances.',
      'Confirm mattress sizes and storage allocation before production.',
      'Standardise room types to simplify installation and maintenance.',
    ],
    service: { label: 'Hostel Furniture', href: '/hostel-furniture' },
    guide: { label: 'Materials & Finishes', href: '/design-library/materials-and-finishes' },
  },
  'bulk-furniture-estimator': {
    resultTitle: 'Turn quantity into a production brief',
    resultLead: 'Repeatability lowers risk. Mixed sizes, finishes, and custom details increase cost and production time.',
    insightCards: [
      { title: 'Unit quantity', description: 'Larger repeatable batches improve factory planning and consistency.' },
      { title: 'Complexity', description: 'Drawers, curves, upholstery, and mixed materials move the unit rate.' },
      { title: 'Site handling', description: 'Floor access, storage, assembly, and phased handover affect installation.' },
      { title: 'Spares', description: 'A small spare quantity helps facility teams replace damaged units later.' },
    ],
    guidanceTitle: 'Standardise before requesting prices',
    guidance: [
      'Approve one prototype before the full factory run.',
      'Freeze dimensions, finishes, hardware, and quantities together.',
      'Plan delivery batches around available site storage and access.',
    ],
    service: { label: 'Institutional Interiors', href: '/institutional-interiors' },
    guide: { label: 'Materials & Finishes', href: '/design-library/materials-and-finishes' },
  },
  'cafe-seating-calculator': {
    resultTitle: 'Balance covers with comfortable service',
    resultLead: 'More seats do not always produce a better café. Aisles, counter queues, and dwell time matter.',
    insightCards: [
      { title: 'Table mix', description: 'Combine two-tops, four-tops, and flexible tables for changing group sizes.' },
      { title: 'Banquettes', description: 'Wall seating can improve capacity in narrow rooms without adding chair aisles.' },
      { title: 'Service circulation', description: 'Protect paths between kitchen, pickup, tables, washrooms, and exit.' },
      { title: 'Turnover model', description: 'Fast casual and long-stay cafés need different space per cover.' },
    ],
    guidanceTitle: 'Test the floor before fixing covers',
    guidance: [
      'Draw chairs in their occupied position, not tucked under tables.',
      'Include queue, pickup, waiter station, and accessible seating.',
      'Check the final plan against fire and local operating requirements.',
    ],
    service: { label: 'Café & Restaurant Interiors', href: '/cafe-restaurant-interiors' },
    guide: { label: 'Space Planning', href: '/design-library/space-planning' },
  },
  'hospitality-fitout-estimator': {
    resultTitle: 'Separate rooms from public-area spend',
    resultLead: 'Guest-room repetition and public-area complexity behave differently and should be reviewed separately.',
    insightCards: [
      { title: 'Guest rooms', description: 'Bed walls, wardrobes, desks, luggage units, and vanities repeat by room type.' },
      { title: 'Public areas', description: 'Lobby, dining, corridors, and amenities carry more custom detailing.' },
      { title: 'Operator items', description: 'Soft FF&E, equipment, technology, and brand standards may be separate.' },
      { title: 'Opening buffer', description: 'Keep time and budget for samples, mock-ups, snagging, and room turnover.' },
    ],
    guidanceTitle: 'Build the estimate by room type',
    guidance: [
      'Count standard, premium, suite, and accessible rooms separately.',
      'Approve a mock-up room before releasing the full factory batch.',
      'Track joinery, soft FF&E, services, and equipment as separate packages.',
    ],
    service: { label: 'Hotel Interiors', href: '/hotel-interiors' },
    guide: { label: 'Interior Styles', href: '/design-library/interior-styles' },
  },
  'opening-day-countdown': {
    resultTitle: 'Use the remaining days as a phase plan',
    resultLead: 'A date becomes useful when design freeze, procurement, factory work, installation, and snagging have owners.',
    insightCards: [
      { title: 'Design freeze', description: 'Lock layouts, materials, services, and quantities before procurement.' },
      { title: 'Procurement', description: 'Release long-lead finishes, hardware, equipment, and loose furniture early.' },
      { title: 'Factory and site', description: 'Coordinate production with civil readiness, access, and storage.' },
      { title: 'Snag and train', description: 'Protect time for testing, cleaning, stocking, staff training, and soft opening.' },
    ],
    guidanceTitle: 'Protect the critical path',
    guidance: [
      'Assign one owner and target date to every milestone.',
      'Do not release factory work before dimensions and finishes are frozen.',
      'Keep a soft-opening buffer instead of planning completion on launch day.',
    ],
    service: { label: 'Hospitality Interiors', href: '/hospitality-interiors' },
    guide: { label: 'Before You Renovate', href: '/design-library/before-you-renovate' },
  },
};

export function getToolExperience(slug: string): ToolExperience {
  return experiences[slug] ?? experiences['commercial-fitout-estimator'];
}
