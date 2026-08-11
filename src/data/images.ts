import kitchen1 from '../assets/images/hero/kitchen-1.jpeg';
import bedroom from '../assets/images/hero/bedroom.jpg';
import kitchen2 from '../assets/images/hero/kitchen-2.jpeg';
import modularKitchen from '../assets/images/projects/modular-kitchen.jpeg';
import homeInterior3 from '../assets/images/projects/home-interior-3.jpg';
import logoHeader from '../assets/images/logos/header.png';
import logoFooter from '../assets/images/logos/footer.png';
import logoMobileMenu from '../assets/images/logos/mobile-menu.png';
import youtubeBt9uVqRqT_c from '../assets/images/youtube/bt9uVqRqT_c.jpg';
import youtubePPfFXoK4Dso from '../assets/images/youtube/PPfFXoK4Dso.jpg';
import youtube86CQ7rvVkmQ from '../assets/images/youtube/86CQ7rvVkmQ.jpg';

import heroResidential from '../assets/images/hero/hero-residential.jpg';
import heroCommercial from '../assets/images/hero/hero-commercial.jpg';
import heroInstitutional from '../assets/images/hero/hero-institutional.jpg';
import heroHospitality from '../assets/images/hero/hero-hospitality.jpg';
import ctaBanner from '../assets/images/hero/cta-banner.jpg';

import livingDining from '../assets/images/rooms/living-dining.jpg';
import modularKitchenLight from '../assets/images/rooms/modular-kitchen-light.jpg';
import bedroomSuite from '../assets/images/rooms/bedroom-suite.jpg';
import officeWorkspace from '../assets/images/rooms/office-workspace.jpg';
import retailShowroom from '../assets/images/rooms/retail-showroom.jpg';
import clinicHealthcare from '../assets/images/rooms/clinic-healthcare.jpg';
import classroomFurniture from '../assets/images/rooms/classroom-furniture.jpg';
import hostelFurniture from '../assets/images/rooms/hostel-furniture.jpg';
import cafeRestaurant from '../assets/images/rooms/cafe-restaurant.jpg';
import hotelLobby from '../assets/images/rooms/hotel-lobby.jpg';
import salonWellness from '../assets/images/rooms/salon-wellness.jpg';
import poojaRoom from '../assets/images/rooms/pooja-room.jpg';
import libraryLab from '../assets/images/rooms/library-lab.jpg';
import barLounge from '../assets/images/rooms/bar-lounge.jpg';
import fullHome from '../assets/images/rooms/full-home.jpg';

import studioCraft from '../assets/images/studio/studio-craft.jpg';
import projectApartment from '../assets/images/projects/project-apartment.jpg';
import projectVilla from '../assets/images/projects/project-villa.jpg';
import projectCoworking from '../assets/images/projects/project-coworking.jpg';

import cutoutChair from '../assets/images/cutouts/cutout-chair.png';
import cutoutLamp from '../assets/images/cutouts/cutout-lamp.png';
import cutoutPendants from '../assets/images/cutouts/cutout-pendants.png';
import cutoutKitchen from '../assets/images/cutouts/cutout-kitchen.png';
import cutoutWardrobe from '../assets/images/cutouts/cutout-wardrobe.png';
import cutoutBed from '../assets/images/cutouts/cutout-bed.png';
import cutoutPooja from '../assets/images/cutouts/cutout-pooja.png';
import cutoutSofa from '../assets/images/cutouts/cutout-sofa.png';

import openHouse1 from '../assets/images/open-house/open-house-1.png';
import openHouse2 from '../assets/images/open-house/open-house-2.png';
import openHouse3 from '../assets/images/open-house/open-house-3.png';

import wallCenterTile from '../assets/images/gallery-backgrounds/wall-center-tile.jpg';
import wallCapLeft from '../assets/images/gallery-backgrounds/wall-cap-left.jpg';
import wallCapRight from '../assets/images/gallery-backgrounds/wall-cap-right.jpg';
import baseboardStrip from '../assets/images/gallery-backgrounds/baseboard-strip.png';
import floorGround from '../assets/images/gallery-backgrounds/floor-ground.jpg';

import viewerBackWoman from '../assets/images/gallery-spectators/viewer-back-woman.png';
import viewerBackMan from '../assets/images/gallery-spectators/viewer-back-man.png';
import viewerBackGirl from '../assets/images/gallery-spectators/viewer-back-girl.png';

import galleryFloorPlant from '../assets/images/gallery-spectators/gallery-floor-plant.png';
import galleryFloorLamp from '../assets/images/gallery-spectators/gallery-floor-lamp.png';
import galleryAccentPlinth from '../assets/images/gallery-spectators/gallery-accent-plinth.png';

export const heroImages = {
  kitchen1,
  bedroom,
  kitchen2,
  residential: heroResidential,
  commercial: heroCommercial,
  institutional: heroInstitutional,
  hospitality: heroHospitality,
  cta: ctaBanner,
};

export const pageHeroImage = heroResidential;

/** Room-level photography, keyed to the service page each one belongs to. */
export const roomImages = {
  livingDining,
  modularKitchen: modularKitchenLight,
  bedroom: bedroomSuite,
  office: officeWorkspace,
  retail: retailShowroom,
  clinic: clinicHealthcare,
  classroom: classroomFurniture,
  hostel: hostelFurniture,
  cafe: cafeRestaurant,
  hotel: hotelLobby,
  salon: salonWellness,
  pooja: poojaRoom,
  libraryLab,
  bar: barLounge,
  fullHome,
};

export const projectImages = {
  modularKitchen,
  homeInterior3,
  apartment: projectApartment,
  villa: projectVilla,
  coworking: projectCoworking,
};

export const studioImages = {
  craft: studioCraft,
};

/** Single-object transparent PNGs for pastel product-style cards. */
export const cutoutImages = {
  chair: cutoutChair,
  lamp: cutoutLamp,
  pendants: cutoutPendants,
  kitchen: cutoutKitchen,
  wardrobe: cutoutWardrobe,
  bed: cutoutBed,
  pooja: cutoutPooja,
  sofa: cutoutSofa,
};

/** Residential hub — isometric open-house dioramas (transition set). */
export const openHouseImages = [openHouse1, openHouse2, openHouse3] as const;

/** About gallery — modular wall/floor patch assets (see docs/about-gallery-scene-brief.md). */
export const galleryPatches = {
  wallCenter: wallCenterTile,
  capLeft: wallCapLeft,
  capRight: wallCapRight,
  baseboard: baseboardStrip,
  floorGround,
} as const;

/** About gallery — back-view watcher cutouts beside video frame. */
export const galleryWatchers = {
  woman: viewerBackWoman,
  man: viewerBackMan,
  boy: viewerBackMan,
  girl: viewerBackGirl,
} as const;

/** About gallery — large-screen accent props before watcher (rotate per slide). */
export const galleryAccentProps = {
  plant: galleryFloorPlant,
  lamp: galleryFloorLamp,
  plinth: galleryAccentPlinth,
} as const;

export const logoImages = {
  header: logoHeader,
  footer: logoFooter,
  mobileMenu: logoMobileMenu,
};

export const youtubeThumbs = {
  bt9uVqRqT_c: youtubeBt9uVqRqT_c,
  PPfFXoK4Dso: youtubePPfFXoK4Dso,
  '86CQ7rvVkmQ': youtube86CQ7rvVkmQ,
};
