export interface ToolPage {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  lead: string;
  body: string[];
  howItWorks: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  related: { label: string; href: string }[];
  calculator:
    | {
        type: 'range-estimate';
        fields: {
          id: string;
          label: string;
          min: number;
          max: number;
          step: number;
          value: number;
          suffix?: string;
          prefix?: string;
        }[];
        formula:
          | 'kitchen'
          | 'home'
          | 'office'
          | 'commercial'
          | 'clinic'
          | 'classroom'
          | 'hostel'
          | 'bulk'
          | 'cafe'
          | 'hospitality';
      }
    | {
        type: 'layout-picker';
        options: { id: string; label: string; description: string }[];
      }
    | { type: 'countdown'; defaultDays: number };
}

export const toolsHubIntro = {
  title: 'Planning Tools',
  heroDescription:
    'Quick estimators and planners for kitchens, homes, offices, and hospitality fitouts - built for Mysuru and Karnataka projects.',
  intro:
    'Use these free tools to get a rough sense of budget, layout, or capacity before you book a consultation. Figures are indicative; every Space Solution quote is based on a site measure and your finish choices.',
  trustLine: 'Practical planning aids from the Space Solution design team · Mysuru',
};

export const toolPages: ToolPage[] = [
  {
    slug: 'kitchen-cost-estimator',
    title: 'Kitchen Cost Estimator',
    seoTitle: 'Kitchen Cost Estimator Mysuru | Modular Kitchen Budget | Space Solution',
    metaDescription:
      'Estimate modular kitchen cost in Mysuru by size and finish level. Get a rough INR planning range before your Space Solution consultation today.',
    eyebrow: 'Home interiors tool',
    lead: 'Get a ballpark modular kitchen budget for your Mysuru home - adjust size and finish to see a rough INR range.',
    body: [
      'Planning a modular kitchen in Mysuru or elsewhere in Karnataka usually starts with two questions: how much space you have, and how premium the finishes need to feel. This estimator uses simple area and finish inputs to give you a planning range - not a final quote.',
      'In most Indian apartments and villas, kitchen cost is driven by carcass material, shutter finish, hardware, and countertop choice. Laminate and acrylic sit in different bands from PU or veneer, and stone or quartz tops change the total quickly.',
      'Use the result to decide whether a turnkey kitchen fits your overall home budget, then share your layout photos or drawings with our team for a measured proposal. Space Solution manufactures and installs modular kitchens from our Mysuru studio.',
      'If you are renovating an older kitchen, allow a little buffer for plumbing shifts, electrical points, and appliance cut-outs - those site realities are easiest to settle on a visit.',
    ],
    howItWorks: [
      {
        title: 'Set your kitchen size',
        description: 'Enter approximate carpet area or the footprint you expect for cabinets and counters.',
      },
      {
        title: 'Choose a finish band',
        description: 'Slide between practical laminate, mid-range acrylic, and premium PU or veneer looks.',
      },
      {
        title: 'Review the range',
        description: 'Read the indicative INR estimate, then book a consultation for a site-based quote.',
      },
    ],
    faqs: [
      {
        question: 'Is this kitchen estimate a final quote?',
        answer:
          'No. It is a planning range based on typical Mysuru rates for modular kitchens. Final pricing follows measurement, drawing approval, and selected materials.',
      },
      {
        question: 'What does the estimate usually include?',
        answer:
          'The formula assumes base and wall units, standard hardware, and common countertop allowances. Appliances, civil work, and gas piping are usually separate.',
      },
      {
        question: 'Can you design for compact 2BHK kitchens?',
        answer:
          'Yes. Many Space Solution projects are efficient L-shaped or parallel kitchens for Mysuru apartments. Bring your flat size and we will suggest a workable layout.',
      },
      {
        question: 'How soon can I get a detailed quote?',
        answer:
          'After a short consultation and site measure, we prepare drawings and a clear bill of quantities so you can compare finishes with confidence.',
      },
    ],
    related: [
      { label: 'Home Budget Calculator', href: '/tools/home-budget-calculator' },
      { label: 'Kitchen Layout Recommender', href: '/tools/kitchen-layout-recommender' },
      { label: 'Modular Kitchen Guide', href: '/design-library/modular-kitchen-guide' },
      { label: 'Residential Interiors', href: '/residential-interiors' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'kitchen',
      fields: [
        { id: 'area', label: 'Kitchen area', min: 40, max: 250, step: 5, value: 80, suffix: 'sq.ft' },
        { id: 'finish', label: 'Finish level', min: 1, max: 3, step: 1, value: 2 },
        { id: 'counter', label: 'Counter length', min: 6, max: 30, step: 1, value: 12, suffix: 'ft' },
      ],
    },
  },
  {
    slug: 'home-budget-calculator',
    title: 'Home Budget Calculator',
    seoTitle: 'Home Interior Budget Calculator Mysuru | Space Solution',
    metaDescription:
      'Calculate a rough full-home interior budget for Mysuru apartments and villas. Plan carpentry, finishes, and room scope before you enquire with us.',
    eyebrow: 'Home interiors tool',
    lead: 'Sketch a full-home interior budget by carpet area, room count, and finish preference - useful before you renovate in Mysuru.',
    body: [
      'Full-home interiors in Karnataka cover living, bedrooms, kitchen, wardrobes, and often a pooja niche or study. Budgeting early helps you prioritise what must be built now and what can wait for a second phase.',
      'Cost per square foot shifts with material choices: laminate wardrobes differ from veneer, and imported tiles or custom lighting change the stretch of a villa package. This calculator stays intentionally simple so you can explore ranges quickly.',
      'Space Solution works on apartments and independent homes across Mysuru. Share your floor plan after you try the tool, and we will align scope - modular kitchen, bedrooms, living storage - to a clear proposal.',
      'If you already have civil work underway, tell us what is fixed (flooring, false ceiling, painting) so carpentry and furniture can be quoted without overlap.',
    ],
    howItWorks: [
      {
        title: 'Enter carpet area',
        description: 'Use the approximate built-up or carpet area you want to furnish and finish.',
      },
      {
        title: 'Add room count',
        description: 'Include bedrooms plus living or dining zones that need storage or panelling.',
      },
      {
        title: 'Pick a finish band',
        description: 'See how practical, balanced, or premium choices move your planning budget.',
      },
    ],
    faqs: [
      {
        question: 'Does this cover civil and electrical work?',
        answer:
          'The range focuses on interior fitout and carpentry typical of turnkey packages. Major civil, plumbing, or electrical rewiring should be listed separately.',
      },
      {
        question: 'Can I phase the project?',
        answer:
          'Yes. Many Mysuru clients start with kitchen and master bedroom, then add living storage later. Ask us for a phased bill of quantities.',
      },
      {
        question: 'How accurate is the per-square-foot band?',
        answer:
          'It is a planning guide based on common residential scopes. Site access, ceiling height, and custom joinery always refine the number.',
      },
      {
        question: 'What should I do after I get a range?',
        answer:
          'Book a consultation with your carpet area and must-have rooms. We will turn this band into a measured scope, materials list, and timeline.',
      },
    ],
    related: [
      { label: 'Kitchen Cost Estimator', href: '/tools/kitchen-cost-estimator' },
      { label: 'Turnkey Fitout', href: '/turnkey-fitout' },
      { label: 'Before You Renovate', href: '/design-library/before-you-renovate' },
      { label: 'Residential Interiors', href: '/residential-interiors' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'home',
      fields: [
        { id: 'area', label: 'Home carpet area', min: 600, max: 5000, step: 50, value: 1200, suffix: 'sq.ft' },
        { id: 'rooms', label: 'Key rooms to finish', min: 2, max: 10, step: 1, value: 4 },
        { id: 'finish', label: 'Finish level', min: 1, max: 3, step: 1, value: 2 },
      ],
    },
  },
  {
    slug: 'kitchen-layout-recommender',
    title: 'Kitchen Layout Recommender',
    seoTitle: 'Kitchen Layout Recommender | Modular Kitchen Plans Mysuru',
    metaDescription:
      'Pick a kitchen layout that fits your home - L-shaped, U-shaped, parallel, or island - with practical guidance for Mysuru apartments and villas.',
    eyebrow: 'Home interiors tool',
    lead: 'Choose the kitchen shape that matches your room proportions, then read a short recommendation for workflow and storage.',
    body: [
      'Layout is the first modular kitchen decision. The wrong shape wastes circulation; the right one makes cooking, washing, and serving feel natural even in a compact Mysuru 2BHK.',
      'L-shaped kitchens suit many open living plans. Parallel (galley) layouts excel in narrow utility corridors. U-shaped kitchens maximise counter when you have width. Island plans need clear walking space on all sides.',
      'This recommender is not a substitute for a measured drawing, but it helps you arrive at a consultation with a clear preference. Our designers then map the work triangle, chimney position, and appliance zones to your walls.',
      'Bring photos of your existing kitchen and any preferred appliance brands - those details often decide whether a peninsula or breakfast ledge is worth adding.',
    ],
    howItWorks: [
      {
        title: 'Browse layout types',
        description: 'Read short notes on L-shaped, U-shaped, parallel, straight, and island kitchens.',
      },
      {
        title: 'Select what fits',
        description: 'Tap the option closest to your room shape and how you cook each day.',
      },
      {
        title: 'Share it with us',
        description: 'Use the recommendation as a starting brief in your Space Solution enquiry.',
      },
    ],
    faqs: [
      {
        question: 'Which layout is best for Indian cooking?',
        answer:
          'Most homes do well with L-shaped or parallel layouts that keep the hob, sink, and fridge within a short triangle and leave space for masala and tawa storage.',
      },
      {
        question: 'Do island kitchens work in apartments?',
        answer:
          'Only when width allows clear circulation. Many Mysuru flats are better with a peninsula or breakfast ledge instead of a full island.',
      },
      {
        question: 'Can you redesign an existing civil kitchen?',
        answer:
          'Yes. We often reorganise wet and dry zones, add tall units, and improve lighting without major demolition when services allow.',
      },
      {
        question: 'What happens after I pick a layout?',
        answer:
          'Share the recommendation in a consultation. We confirm clearances on a site measure, then lock drawings before factory production.',
      },
    ],
    related: [
      { label: 'Kitchen Cost Estimator', href: '/tools/kitchen-cost-estimator' },
      { label: 'Modular Kitchen Guide', href: '/design-library/modular-kitchen-guide' },
      { label: 'Home Budget Calculator', href: '/tools/home-budget-calculator' },
      { label: 'Residential Interiors', href: '/residential-interiors' },
    ],
    calculator: {
      type: 'layout-picker',
      options: [
        {
          id: 'l-shaped',
          label: 'L-shaped',
          description:
            'Best for open-plan Mysuru apartments. Efficient corner storage, clear dining sightlines, and a comfortable work triangle for everyday Indian cooking.',
        },
        {
          id: 'u-shaped',
          label: 'U-shaped',
          description:
            'Ideal when you have a wider kitchen. Maximum counter and tall-unit storage; keep the open side wide enough for two people to pass.',
        },
        {
          id: 'parallel',
          label: 'Parallel / galley',
          description:
            'Strong choice for long, narrow kitchens. Keep aisles about 3.5–4 ft clear and place hob and sink on opposite or staggered runs for safety.',
        },
        {
          id: 'straight',
          label: 'Straight single run',
          description:
            'Works in studio or compact homes. Prioritise a tall pantry unit and good task lighting; add a trolley or peninsula if you need prep space.',
        },
        {
          id: 'island',
          label: 'Island / peninsula',
          description:
            'Suited to villas and larger open plans. Confirm 3+ ft clearance on working sides and plan electrical points early for hob or charging niches.',
        },
      ],
    },
  },
  {
    slug: 'office-space-calculator',
    title: 'Office Space Calculator',
    seoTitle: 'Office Space Calculator Mysuru | Workstation Planning | Space Solution',
    metaDescription:
      'Estimate office fitout needs by seats and meeting rooms. Plan workstations, cabins, and support zones for Mysuru commercial interiors with ease.',
    eyebrow: 'Commercial tool',
    lead: 'Translate headcount and meeting rooms into a rough office fitout budget and footprint guide for Mysuru workplaces.',
    body: [
      'Office interiors in Mysuru range from compact professional suites to multi-bay coworking floors. Seats, meeting rooms, and storage drive both carpet area and carpentry cost.',
      'This calculator gives a planning figure for modular workstations, basic partitions, and common support furniture. IT flooring, server rooms, and specialised labs need a separate scope.',
      'Space Solution delivers commercial interiors with factory-made furniture where possible - faster install, cleaner sites, and consistent finishes across phases.',
      'If you are taking a shell-and-core floor, note column grids and toilet cores before locking a seating count; those constraints often decide aisle widths and cabin sizes.',
    ],
    howItWorks: [
      {
        title: 'Enter seat count',
        description: 'Include fixed workstations and hot-desks you expect on day one.',
      },
      {
        title: 'Add meeting rooms',
        description: 'Count closed rooms or booths that need acoustic treatment and furniture.',
      },
      {
        title: 'Review the estimate',
        description: 'Use the INR range to brief stakeholders, then request a measured layout.',
      },
    ],
    faqs: [
      {
        question: 'How much area per employee should I assume?',
        answer:
          'Many Mysuru offices plan roughly 50–80 sq.ft per person including circulation, but dense coworking can go lower and executive floors higher.',
      },
      {
        question: 'Are cabins included?',
        answer:
          'The estimate assumes a mix of open seats plus a few enclosed rooms via the meeting-room slider. Large director suites should be called out in consultation.',
      },
      {
        question: 'Can you supply only furniture?',
        answer:
          'Yes. We can deliver modular workstations and storage as a furniture package, or handle full turnkey fitout including partitions and finishes.',
      },
      {
        question: 'What should I do after I get a headcount range?',
        answer:
          'Bring your floor plate, team size, and cabin needs to a consultation. We will convert the estimate into a workstation plan and fitout quote.',
      },
    ],
    related: [
      { label: 'Commercial Fitout Estimator', href: '/tools/commercial-fitout-estimator' },
      { label: 'Clinic Room Planner', href: '/tools/clinic-room-planner' },
      { label: 'Commercial Interiors', href: '/commercial-interiors' },
      { label: 'Contact', href: '/contact' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'office',
      fields: [
        { id: 'seats', label: 'Workstations / seats', min: 4, max: 200, step: 1, value: 20 },
        { id: 'rooms', label: 'Meeting rooms', min: 0, max: 20, step: 1, value: 2 },
        { id: 'finish', label: 'Fitout level', min: 1, max: 3, step: 1, value: 2 },
      ],
    },
  },
  {
    slug: 'commercial-fitout-estimator',
    title: 'Commercial Fitout Estimator',
    seoTitle: 'Commercial Fitout Cost Estimator Mysuru | Space Solution',
    metaDescription:
      'Get a rough commercial interior fitout cost by area and intensity for retail, offices, and showrooms across Mysuru and the rest of Karnataka.',
    eyebrow: 'Commercial tool',
    lead: 'Estimate a commercial fitout band from carpet area and how intensive the joinery and finishes need to be.',
    body: [
      'Retail, clinics, and office floors each stress the budget differently. Display joinery, reception feature walls, and brand lighting push costs above a simple paint-and-furniture refresh.',
      'This tool uses area plus an intensity slider so you can compare a light refresh with a full branded fitout. It is meant for early landlord or investor conversations in Mysuru.',
      'Space Solution manages design-to-install commercial projects with clear milestones. After you have a range, we can walk the site, check services, and issue a scoped quotation.',
      'Factor in GST, approvals, and any landlord shell conditions separately - those rarely belong inside a first carpentry estimate.',
    ],
    howItWorks: [
      {
        title: 'Enter carpet area',
        description: 'Use the leasable or carpet area you intend to fit out.',
      },
      {
        title: 'Set intensity',
        description: 'Slide from light refresh toward heavy custom joinery and feature finishes.',
      },
      {
        title: 'Share the range',
        description: 'Align stakeholders, then book a Space Solution consultation for drawings.',
      },
    ],
    faqs: [
      {
        question: 'Does this include HVAC and fire systems?',
        answer:
          'No. Those MEPs are usually specialised packages. Our estimate focuses on interior finishes, partitions, and furniture typical of commercial fitouts.',
      },
      {
        question: 'Can you work with our architect?',
        answer:
          'Yes. We often execute as the interior fitout partner on architect-led commercial projects across Karnataka.',
      },
      {
        question: 'What timeline should we expect?',
        answer:
          'Compact offices can move quickly once drawings are frozen; larger retail floors need phased procurement. We confirm schedule after measuring the site.',
      },
      {
        question: 'How do I turn this estimate into a quote?',
        answer:
          'Share your carpet area, finish preference, and opening date. After a site survey we issue a scoped commercial proposal, not a per-square-foot guess.',
      },
    ],
    related: [
      { label: 'Office Space Calculator', href: '/tools/office-space-calculator' },
      { label: 'Clinic Room Planner', href: '/tools/clinic-room-planner' },
      { label: 'Commercial Interiors', href: '/commercial-interiors' },
      { label: 'Turnkey Fitout', href: '/turnkey-fitout' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'commercial',
      fields: [
        { id: 'area', label: 'Carpet area', min: 300, max: 15000, step: 50, value: 1500, suffix: 'sq.ft' },
        { id: 'intensity', label: 'Fitout intensity', min: 1, max: 3, step: 1, value: 2 },
      ],
    },
  },
  {
    slug: 'clinic-room-planner',
    title: 'Clinic Room Planner',
    seoTitle: 'Clinic Interior Planner Mysuru | Consultation Room Layout Budget',
    metaDescription:
      'Plan clinic consultation and treatment rooms with a rough furniture and fitout budget for healthcare interiors across Mysuru and nearby towns.',
    eyebrow: 'Commercial tool',
    lead: 'Map consultation rooms, treatment spaces, and reception needs into a simple clinic fitout estimate.',
    body: [
      'Clinic interiors need clear patient flow, easy-to-clean surfaces, and furniture that supports long working days. Mysuru practices - dental, general, specialty - often grow room by room.',
      'This planner multiplies room counts by typical fitout allowances for cabinetry, seating, and partitions. Medical equipment itself is never included in the carpentry figure.',
      'Space Solution designs clinic reception, waiting, and consultation rooms with durable materials suited to high footfall. Share your specialty and we will refine storage and hygiene details.',
      'If you are fitting out inside a commercial complex, confirm landlord guidelines for plumbing and waste early - they affect wet areas and lab benches.',
    ],
    howItWorks: [
      {
        title: 'Count consultation rooms',
        description: 'Include doctor cabins that need desk storage and patient seating.',
      },
      {
        title: 'Add treatment rooms',
        description: 'Capture procedural spaces that need stronger cabinetry and wash zones.',
      },
      {
        title: 'Read the planning budget',
        description: 'Use the range to brief partners, then request a detailed clinic layout.',
      },
    ],
    faqs: [
      {
        question: 'Is medical equipment priced here?',
        answer:
          'No. The tool covers interior furniture and fitout allowances only. Equipment vendors should quote separately.',
      },
      {
        question: 'Can you design dental or dermatology clinics?',
        answer:
          'Yes. We adapt cabinetry, lighting, and waiting layouts to the specialty after understanding patient volume and staff workflow.',
      },
      {
        question: 'Do you handle branding and signage?',
        answer:
          'Reception feature walls and basic wayfinding can be part of the interior scope. External building signage often needs society or landlord approval.',
      },
      {
        question: 'What should I bring to a clinic consultation?',
        answer:
          'A floor plan or photos, the number of consultation rooms, and how patients move from waiting to procedure. We will refine this planner into a measured layout.',
      },
    ],
    related: [
      { label: 'Commercial Fitout Estimator', href: '/tools/commercial-fitout-estimator' },
      { label: 'Office Space Calculator', href: '/tools/office-space-calculator' },
      { label: 'Commercial Interiors', href: '/commercial-interiors' },
      { label: 'Contact', href: '/contact' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'clinic',
      fields: [
        { id: 'consult', label: 'Consultation rooms', min: 1, max: 20, step: 1, value: 3 },
        { id: 'treatment', label: 'Treatment rooms', min: 0, max: 15, step: 1, value: 1 },
        { id: 'waiting', label: 'Waiting seats', min: 4, max: 60, step: 1, value: 12 },
      ],
    },
  },
  {
    slug: 'classroom-furniture-calculator',
    title: 'Classroom Furniture Calculator',
    seoTitle: 'Classroom Furniture Calculator | School Fitout Mysuru | Space Solution',
    metaDescription:
      'Estimate classroom furniture needs by students and rooms for schools and coaching centres across Mysuru and institutional campuses in Karnataka.',
    eyebrow: 'Institutional tool',
    lead: 'Project desks, benches, and teacher furniture for classrooms - a quick institutional planning aid.',
    body: [
      'Schools, coaching centres, and training institutes in Karnataka need durable classroom sets that survive daily use. Seat counts and room totals are the simplest way to start a furniture budget.',
      'This calculator assumes sturdy dual desks or bench sets plus a teacher unit per classroom. Smart boards, AV, and lab furniture should be added as separate lines.',
      'Space Solution supplies institutional furniture with consistent manufacturing quality - helpful when you are outfitting many identical rooms across a campus.',
      'Share age group and storage needs (bags, books, science kits) during consultation so we can recommend the right desk depth and edge profiles.',
    ],
    howItWorks: [
      {
        title: 'Enter student count',
        description: 'Use total learners you want to seat across the rooms you are furnishing.',
      },
      {
        title: 'Set classroom count',
        description: 'Add how many rooms need a full teacher and student furniture set.',
      },
      {
        title: 'Check the estimate',
        description: 'Review the indicative INR total, then enquire for campus-wide pricing.',
      },
    ],
    faqs: [
      {
        question: 'Do you offer dual desks and individual seats?',
        answer:
          'Yes. We can quote dual desks, individual chairs, or lecture-style seating depending on pedagogy and room width.',
      },
      {
        question: 'Can furniture match our school colours?',
        answer:
          'Laminate and edge colours can follow your brand guidelines within available commercial finishes.',
      },
      {
        question: 'Is delivery available outside Mysuru?',
        answer:
          'We regularly supply institutional projects across Karnataka. Logistics are confirmed with the quotation.',
      },
      {
        question: 'How do I get a classroom furniture quote?',
        answer:
          'Share room sizes, student count, and whether you need dual desks or individual seats. We will convert this calculator into a packaged campus quote.',
      },
    ],
    related: [
      { label: 'Hostel Bed Planner', href: '/tools/hostel-bed-planner' },
      { label: 'Bulk Furniture Estimator', href: '/tools/bulk-furniture-estimator' },
      { label: 'Institutional Interiors', href: '/institutional-interiors' },
      { label: 'Contact', href: '/contact' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'classroom',
      fields: [
        { id: 'students', label: 'Students to seat', min: 20, max: 2000, step: 10, value: 120 },
        { id: 'rooms', label: 'Classrooms', min: 1, max: 60, step: 1, value: 4 },
        { id: 'storage', label: 'Storage level', min: 1, max: 3, step: 1, value: 2 },
      ],
    },
  },
  {
    slug: 'hostel-bed-planner',
    title: 'Hostel Bed Planner',
    seoTitle: 'Hostel Bed Planner | Hostel Furniture Estimate Mysuru',
    metaDescription:
      'Plan hostel beds, rooms, and storage furniture with a rough budget for student housing and staff hostels on campuses across Karnataka state.',
    eyebrow: 'Institutional tool',
    lead: 'Size a hostel furniture package from bed count, rooms, and storage preference.',
    body: [
      'Hostel interiors prioritise durable beds, study tables, and lockable storage in tight footprints. Getting bed density right affects both comfort and fire egress.',
      'Use this planner to sketch a furniture budget before you approach a campus build or renovation in Mysuru. Bunk versus single beds change both cost and clear heights.',
      'Space Solution manufactures hostel sets that install quickly floor by floor - useful when academic calendars leave a short vacation window.',
      'Mention gender segregation, accessible rooms, and laundry adjacencies in your brief; they influence wardrobe and aisle planning.',
    ],
    howItWorks: [
      {
        title: 'Set bed count',
        description: 'Enter how many sleeping berths you need across the block.',
      },
      {
        title: 'Add rooms',
        description: 'Count rooms or cubicles so study tables and wardrobes scale correctly.',
      },
      {
        title: 'Choose storage level',
        description: 'Increase the slider if you need deeper wardrobes or luggage benches.',
      },
    ],
    faqs: [
      {
        question: 'Do you supply bunk beds?',
        answer:
          'Yes. We can quote single or bunk configurations with matching study furniture, subject to ceiling height and safety norms.',
      },
      {
        question: 'Can mattresses be included?',
        answer:
          'Mattresses are optional add-ons. Many campuses procure them separately; we can include them if you prefer one vendor.',
      },
      {
        question: 'What about warden and common rooms?',
        answer:
          'Add those areas in a consultation. This tool focuses on sleeping rooms; lounges and dining need a separate furniture list.',
      },
      {
        question: 'How do I move from this planner to an order?',
        answer:
          'Bring bed count, room sizes, and bunk versus single preference. We will confirm a furniture list, finishes, and delivery schedule for the campus.',
      },
    ],
    related: [
      { label: 'Classroom Furniture Calculator', href: '/tools/classroom-furniture-calculator' },
      { label: 'Bulk Furniture Estimator', href: '/tools/bulk-furniture-estimator' },
      { label: 'Institutional Interiors', href: '/institutional-interiors' },
      { label: 'Contact', href: '/contact' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'hostel',
      fields: [
        { id: 'beds', label: 'Beds / berths', min: 10, max: 1000, step: 2, value: 80 },
        { id: 'rooms', label: 'Rooms', min: 5, max: 500, step: 1, value: 40 },
        { id: 'storage', label: 'Storage level', min: 1, max: 3, step: 1, value: 2 },
      ],
    },
  },
  {
    slug: 'bulk-furniture-estimator',
    title: 'Bulk Furniture Estimator',
    seoTitle: 'Bulk Furniture Cost Estimator | Institutional Supply Mysuru',
    metaDescription:
      'Estimate bulk furniture packages for campuses, offices, and multi-room projects. Plan unit counts and complexity with Space Solution Mysuru.',
    eyebrow: 'Institutional tool',
    lead: 'Price a bulk furniture run by unit count and how custom each piece needs to be.',
    body: [
      'Bulk orders - campus desks, office storage, multi-villa wardrobe sets - benefit from factory repetition. Unit cost falls when drawings freeze early and finishes stay consistent.',
      'This estimator multiplies quantity by a complexity band so procurement teams can hold a working number before tendering. It is not a substitute for a bill of quantities.',
      'Space Solution is set up for repeatable manufacturing from Mysuru, with installation crews who understand large-site logistics across Karnataka.',
      'If you already have CAD or PDF drawings, attach them to your enquiry so we can validate sizes and hardware schedules quickly.',
    ],
    howItWorks: [
      {
        title: 'Enter unit quantity',
        description: 'Count desks, beds, cabinets, or other repeat pieces in the package.',
      },
      {
        title: 'Set complexity',
        description: 'Slide up for custom sizes, mixed finishes, or heavier hardware.',
      },
      {
        title: 'Get a planning total',
        description: 'Compare scenarios, then request a formal quotation with drawings.',
      },
    ],
    faqs: [
      {
        question: 'What is the minimum order?',
        answer:
          'We handle both boutique and large runs. For the best unit rates, batch similar items; tell us your phasing if delivery must be staggered.',
      },
      {
        question: 'Can finishes match an existing campus?',
        answer:
          'Often yes, within commercial laminate and metal options. Bring samples or codes from earlier blocks for the closest match.',
      },
      {
        question: 'Do you install as well as supply?',
        answer:
          'Yes. Supply-only and supply-plus-install packages are both available depending on your site readiness.',
      },
      {
        question: 'What happens after I get a bulk estimate?',
        answer:
          'Share item types, quantities, and delivery phases. We will lock specifications and a factory schedule so the campus receives a consistent batch.',
      },
    ],
    related: [
      { label: 'Classroom Furniture Calculator', href: '/tools/classroom-furniture-calculator' },
      { label: 'Hostel Bed Planner', href: '/tools/hostel-bed-planner' },
      { label: 'Institutional Interiors', href: '/institutional-interiors' },
      { label: 'Commercial Fitout Estimator', href: '/tools/commercial-fitout-estimator' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'bulk',
      fields: [
        { id: 'units', label: 'Furniture units', min: 10, max: 5000, step: 10, value: 100 },
        { id: 'complexity', label: 'Complexity', min: 1, max: 3, step: 1, value: 2 },
      ],
    },
  },
  {
    slug: 'cafe-seating-calculator',
    title: 'Café Seating Calculator',
    seoTitle: 'Café Seating Calculator Mysuru | Restaurant Capacity Planner',
    metaDescription:
      'Estimate cafe and restaurant seating capacity with a rough furniture fitout budget for hospitality spaces across Mysuru and Karnataka today.',
    eyebrow: 'Hospitality tool',
    lead: 'Balance covers, floor area, and service style to sketch a café seating and furniture budget.',
    body: [
      'Cafés in Mysuru compete on atmosphere as much as menu. Seat density, aisle width, and counter visibility decide whether a room feels generous or cramped at peak hour.',
      'This calculator pairs cover count with area to suggest whether your layout is tight, balanced, or generous - and attaches a rough furniture/fitout band for planning.',
      'Space Solution designs café and casual dining interiors with durable table bases, banquette options, and service counters that survive busy weekends.',
      'Mention takeaway queues and outdoor seating in your consultation; they often need separate furniture and weather-ready materials.',
    ],
    howItWorks: [
      {
        title: 'Set cover count',
        description: 'Enter how many guests you want to seat at one time.',
      },
      {
        title: 'Enter floor area',
        description: 'Use the dining carpet area, excluding kitchen if possible.',
      },
      {
        title: 'Review density notes',
        description: 'See capacity feedback plus an indicative furniture budget.',
      },
    ],
    faqs: [
      {
        question: 'How many square feet per seat is comfortable?',
        answer:
          'Casual cafés often land near 12–18 sq.ft per cover including aisles; fine dining needs more. The tool flags when your inputs look tight.',
      },
      {
        question: 'Can you build custom banquettes?',
        answer:
          'Yes. Banquettes maximise wall seating in narrow Mysuru shopfronts and can hide storage for service items.',
      },
      {
        question: 'Is the commercial kitchen included?',
        answer:
          'No. Kitchen equipment and exhaust are specialised. We can coordinate front-of-house furniture with your kitchen vendor.',
      },
      {
        question: 'How do I turn seating numbers into a fitout plan?',
        answer:
          'Bring your shopfront size, cover target, and service style to a consultation. We will plan banquettes, loose seats, and circulation for opening day.',
      },
    ],
    related: [
      { label: 'Hospitality Fitout Estimator', href: '/tools/hospitality-fitout-estimator' },
      { label: 'Opening Day Countdown', href: '/tools/opening-day-countdown' },
      { label: 'Hospitality Interiors', href: '/hospitality-interiors' },
      { label: 'Contact', href: '/contact' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'cafe',
      fields: [
        { id: 'seats', label: 'Seats / covers', min: 8, max: 200, step: 1, value: 36 },
        { id: 'area', label: 'Dining area', min: 200, max: 4000, step: 25, value: 600, suffix: 'sq.ft' },
        { id: 'finish', label: 'Finish level', min: 1, max: 3, step: 1, value: 2 },
      ],
    },
  },
  {
    slug: 'hospitality-fitout-estimator',
    title: 'Hospitality Fitout Estimator',
    seoTitle: 'Hospitality Fitout Estimator Mysuru | Hotel & Resort Interiors',
    metaDescription:
      'Estimate hotel, resort, and F&B fitout budgets by room keys and public area size for hospitality interiors with Space Solution Mysuru today.',
    eyebrow: 'Hospitality tool',
    lead: 'Combine guest-room keys and public-area size for a rough hospitality interior fitout range.',
    body: [
      'Hotels, boutique stays, and large F&B rooms need coordinated FF&E and joinery across many repeat units. Early budget bands help owners sequence soft opening phases.',
      'This estimator weighs room count against lobby or dining carpet area. It assumes mid-market hospitality finishes typical of Karnataka properties - not ultra-luxury imported packages.',
      'Space Solution supports hospitality projects with drawings, factory production, and staged installation so floors can open without blocking operations elsewhere.',
      'Bring brand guidelines and any operator standards to your consultation; they affect wardrobe internals, lighting levels, and durability ratings.',
    ],
    howItWorks: [
      {
        title: 'Enter room keys',
        description: 'Count guest rooms or keys that need a furniture and joinery package.',
      },
      {
        title: 'Add public area',
        description: 'Include lobby, dining, or lounge carpet area you expect to fit out.',
      },
      {
        title: 'Set finish band',
        description: 'Compare practical, enhanced, and premium hospitality looks.',
      },
    ],
    faqs: [
      {
        question: 'Does this include loose FF&E like carpets and curtains?',
        answer:
          'The band assumes a blended joinery and furniture package. Soft FF&E can be included or bought separately - we clarify line by line in the quote.',
      },
      {
        question: 'Can you refurbish existing rooms?',
        answer:
          'Yes. Many projects are phased refurbishments. We survey a sample room before locking rates for the full key count.',
      },
      {
        question: 'Do you work outside Mysuru?',
        answer:
          'We deliver hospitality interiors across Karnataka. Travel and logistics are itemised when the site is farther from our studio.',
      },
      {
        question: 'What should I do after I get a hospitality range?',
        answer:
          'Share key count or covers, finish tier, and opening date. After a site review we issue a scoped fitout proposal you can build to.',
      },
    ],
    related: [
      { label: 'Café Seating Calculator', href: '/tools/cafe-seating-calculator' },
      { label: 'Opening Day Countdown', href: '/tools/opening-day-countdown' },
      { label: 'Hospitality Interiors', href: '/hospitality-interiors' },
      { label: 'Commercial Fitout Estimator', href: '/tools/commercial-fitout-estimator' },
    ],
    calculator: {
      type: 'range-estimate',
      formula: 'hospitality',
      fields: [
        { id: 'keys', label: 'Guest rooms / keys', min: 4, max: 200, step: 1, value: 24 },
        { id: 'publicArea', label: 'Public area', min: 400, max: 20000, step: 50, value: 2500, suffix: 'sq.ft' },
        { id: 'finish', label: 'Finish level', min: 1, max: 3, step: 1, value: 2 },
      ],
    },
  },
  {
    slug: 'opening-day-countdown',
    title: 'Opening Day Countdown',
    seoTitle: 'Opening Day Countdown | Fitout Timeline Planner | Space Solution',
    metaDescription:
      'Count down to your cafe, clinic, or store opening day in Mysuru. Plan fitout milestones early and book your Space Solution consultation now.',
    eyebrow: 'Hospitality tool',
    lead: 'Set your target opening date and see how many days remain to finish design, production, and installation.',
    body: [
      'Opening a café, clinic, or boutique in Mysuru means coordinating approvals, civil snags, furniture lead times, and staffing. A visible countdown keeps the fitout conversation honest.',
      'Use this tool to test whether your launch date still leaves room for drawings, manufacturing, and site install. If the gap is tight, we can discuss phased soft openings.',
      'Space Solution helps owners reverse-plan from opening day - what must freeze this week, what can follow after the first week of trade.',
      'Pair this countdown with our hospitality or commercial estimators so budget and calendar move together before you sign a lease fitout clause.',
    ],
    howItWorks: [
      {
        title: 'Pick your opening date',
        description: 'Choose the day you hope to welcome guests or patients.',
      },
      {
        title: 'See days remaining',
        description: 'The counter updates instantly so you can judge if the timeline is realistic.',
      },
      {
        title: 'Plan the next step',
        description: 'If time is short, enquire early so drawings and factory slots can be reserved.',
      },
    ],
    faqs: [
      {
        question: 'How long does a typical café fitout take?',
        answer:
          'Compact cafés can complete in a few weeks after drawings freeze; larger hospitality floors need longer. Site readiness and approvals matter as much as furniture lead time.',
      },
      {
        question: 'What if my date already passed?',
        answer:
          'The tool will show that the date is behind you. Pick a new target and we can still help plan a revised launch.',
      },
      {
        question: 'Can you work to a fixed inauguration?',
        answer:
          'We will be frank about what is possible. Sometimes a soft opening with essential zones finished is wiser than rushing every detail.',
      },
      {
        question: 'How do I lock a realistic opening plan?',
        answer:
          'Bring your target date, remaining civil work, and must-have zones. We will map design freeze, factory lead time, and installation against that date.',
      },
    ],
    related: [
      { label: 'Café Seating Calculator', href: '/tools/cafe-seating-calculator' },
      { label: 'Hospitality Fitout Estimator', href: '/tools/hospitality-fitout-estimator' },
      { label: 'Hospitality Interiors', href: '/hospitality-interiors' },
      { label: 'Contact', href: '/contact' },
    ],
    calculator: {
      type: 'countdown',
      defaultDays: 45,
    },
  },
];

export function getToolPage(slug: string): ToolPage | undefined {
  return toolPages.find((tool) => tool.slug === slug);
}

export function getToolSlugs(): string[] {
  return toolPages.map((tool) => tool.slug);
}
