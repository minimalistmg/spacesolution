import {
  CONSULT_PATHS,
  consultFormConfigs,
  type ConsultInterestOption,
} from './consultFormConfigs';

export type HomeConsultRoom = ConsultInterestOption;

export const homeConsultRooms: HomeConsultRoom[] = consultFormConfigs['home-3d'].interest.options;
export const homeConsultSteps = consultFormConfigs['home-3d'].steps;
export const HOME_CONSULT_PATH = CONSULT_PATHS.home3d;
