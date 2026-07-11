import type { IconName } from './iconPaths';

export interface EnquiryServiceOption {
  label: string;
  value: string;
  icon: IconName;
}

export const enquiryServiceOptions: EnquiryServiceOption[] = [
  { label: 'Residential', value: 'Residential Interiors', icon: 'house' },
  { label: 'Commercial', value: 'Commercial Interiors', icon: 'building' },
  { label: 'Hospitality', value: 'Hospitality Interiors', icon: 'store' },
  { label: 'Institutional', value: 'Institutional Interiors', icon: 'school' },
  { label: 'Turnkey Fitout', value: 'Turnkey Fitout Solutions', icon: 'tools' },
];
