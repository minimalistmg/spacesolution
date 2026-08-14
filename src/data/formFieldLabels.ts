/** Shared lead-form copy aligned with Header Connect. */
export const FORM_LABELS = {
  name: 'Name',
  mobile: 'Mobile',
  location: 'Location',
  message: 'Briefly tell us about your project',
  optional: '(optional)',
  submit: 'Send Enquiry',
} as const;

export const FORM_LIMITS = {
  nameMin: 3,
  nameMax: 50,
  mobileLen: 10,
  locationMax: 80,
  messageMin: 3,
  messageMax: 500,
} as const;
