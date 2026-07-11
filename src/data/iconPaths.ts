import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons/faPlayCircle';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faBuilding } from '@fortawesome/free-solid-svg-icons/faBuilding';
import { faSchool } from '@fortawesome/free-solid-svg-icons/faSchool';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faAward } from '@fortawesome/free-solid-svg-icons/faAward';
import { faIndustry } from '@fortawesome/free-solid-svg-icons/faIndustry';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faPencilRuler } from '@fortawesome/free-solid-svg-icons/faPencilRuler';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons/faQuoteRight';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faBed } from '@fortawesome/free-solid-svg-icons/faBed';
import { faDraftingCompass } from '@fortawesome/free-solid-svg-icons/faDraftingCompass';
import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons/faLayerGroup';
import { faWind } from '@fortawesome/free-solid-svg-icons/faWind';
import { faCouch } from '@fortawesome/free-solid-svg-icons/faCouch';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faStore } from '@fortawesome/free-solid-svg-icons/faStore';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons/faScrewdriverWrench';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons/faVolumeHigh';
import { faVolumeXmark } from '@fortawesome/free-solid-svg-icons/faVolumeXmark';
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';

export type IconName =
  | 'play'
  | 'pause'
  | 'play-circle'
  | 'house'
  | 'building'
  | 'school'
  | 'arrow-right'
  | 'award'
  | 'industry'
  | 'clock'
  | 'tags'
  | 'users'
  | 'pencil-ruler'
  | 'quote-right'
  | 'bars'
  | 'times'
  | 'angle-double-right'
  | 'location-dot'
  | 'phone'
  | 'envelope'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'bed'
  | 'drafting-compass'
  | 'bolt'
  | 'layer-group'
  | 'wind'
  | 'couch'
  | 'check-circle'
  | 'store'
  | 'tools'
  | 'facebook'
  | 'instagram'
  | 'whatsapp'
  | 'volume-high'
  | 'volume-xmark'
  | 'expand'
  | 'gear'
  | 'link'
  | 'copy';

function toIconData(definition: IconDefinition) {
  const [width, height, , , path] = definition.icon;
  return {
    width,
    height,
    path: Array.isArray(path) ? path.join(' ') : path,
  };
}

const icons = {
  play: toIconData(faPlay),
  pause: toIconData(faPause),
  'play-circle': toIconData(faPlayCircle),
  house: toIconData(faHouse),
  building: toIconData(faBuilding),
  school: toIconData(faSchool),
  'arrow-right': toIconData(faArrowRight),
  award: toIconData(faAward),
  industry: toIconData(faIndustry),
  clock: toIconData(faClock),
  tags: toIconData(faTags),
  users: toIconData(faUsers),
  'pencil-ruler': toIconData(faPencilRuler),
  'quote-right': toIconData(faQuoteRight),
  bars: toIconData(faBars),
  times: toIconData(faTimes),
  'angle-double-right': toIconData(faAnglesRight),
  'location-dot': toIconData(faLocationDot),
  phone: toIconData(faPhone),
  envelope: toIconData(faEnvelope),
  'chevron-down': toIconData(faChevronDown),
  'chevron-left': toIconData(faChevronLeft),
  'chevron-right': toIconData(faChevronRight),
  bed: toIconData(faBed),
  'drafting-compass': toIconData(faDraftingCompass),
  bolt: toIconData(faBolt),
  'layer-group': toIconData(faLayerGroup),
  wind: toIconData(faWind),
  couch: toIconData(faCouch),
  'check-circle': toIconData(faCircleCheck),
  store: toIconData(faStore),
  tools: toIconData(faScrewdriverWrench),
  facebook: toIconData(faFacebookF),
  instagram: toIconData(faInstagram),
  whatsapp: toIconData(faWhatsapp),
  'volume-high': toIconData(faVolumeHigh),
  'volume-xmark': toIconData(faVolumeXmark),
  expand: toIconData(faExpand),
  gear: toIconData(faGear),
  link: toIconData(faLink),
  copy: toIconData(faCopy),
} satisfies Record<IconName, { width: number; height: number; path: string }>;

export function getIcon(name: IconName) {
  return icons[name];
}
