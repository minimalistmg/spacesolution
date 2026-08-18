import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const dst = path.join(root, 'src/assets/images/l3-bands');
const gen = path.join(
  'C:/Users/Maruthi Gowda/.cursor/projects/c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution/assets',
);
const hubRooms = path.join(root, 'src/assets/images/hub-rooms');
const hubSpaces = path.join(root, 'src/assets/images/hub-spaces');

fs.mkdirSync(dst, { recursive: true });

const copies = [
  ['wardrobe-sliding', path.join(hubRooms, 'wardrobes')],
  ['living-tv', path.join(hubRooms, 'living')],
  ['bedroom-master', path.join(hubRooms, 'bedrooms')],
  ['pooja-wall', path.join(hubRooms, 'pooja')],
  ['fullhome-apartment', path.join(hubRooms, 'full-home')],
  ['office-workstations', path.join(hubSpaces, 'office')],
  ['clinic-reception', path.join(hubSpaces, 'clinic')],
  ['retail-boutique', path.join(hubSpaces, 'retail')],
  ['coworking-desks', path.join(hubSpaces, 'coworking')],
  ['school-classroom', path.join(hubSpaces, 'school')],
  ['hostel-bunk', path.join(hubSpaces, 'hostel')],
  ['library-shelving', path.join(hubSpaces, 'library')],
  ['admin-workstations', path.join(hubSpaces, 'admin')],
  ['cafe-seating', path.join(hubSpaces, 'cafe')],
  ['hotel-lobby', path.join(hubSpaces, 'hotel')],
  ['bar-counter', path.join(hubSpaces, 'bar')],
  ['salon-stations', path.join(hubSpaces, 'salon')],
];

const extraPrefixes = [
  'wardrobe-hinged',
  'wardrobe-walkin',
  'wardrobe-loft',
  'living-dining',
  'living-lighting',
  'bedroom-kids',
  'bedroom-guest',
  'pooja-floor',
  'pooja-niche',
  'fullhome-villa',
  'fullhome-phased',
  'office-cabins',
  'office-meeting',
  'clinic-consult',
  'clinic-procedure',
  'retail-flagship',
  'retail-display',
  'coworking-pods',
  'coworking-community',
  'school-staffroom',
  'school-sets',
  'hostel-single',
  'hostel-lockers',
  'library-reading',
  'library-lab',
  'admin-meeting',
  'admin-reception',
  'cafe-counter',
  'cafe-kitchen',
  'hotel-guestroom',
  'hotel-amenities',
  'bar-lounge',
  'bar-lighting',
  'salon-waiting',
  'salon-treatment',
];

const extraFallback = {
  'wardrobe-hinged': path.join(hubRooms, 'wardrobes'),
  'wardrobe-walkin': path.join(hubRooms, 'wardrobes'),
  'wardrobe-loft': path.join(hubRooms, 'wardrobes'),
  'living-dining': path.join(hubRooms, 'living'),
  'living-lighting': path.join(hubRooms, 'living'),
  'bedroom-kids': path.join(hubRooms, 'bedrooms'),
  'bedroom-guest': path.join(hubRooms, 'bedrooms'),
  'pooja-floor': path.join(hubRooms, 'pooja'),
  'pooja-niche': path.join(hubRooms, 'pooja'),
  'fullhome-villa': path.join(hubRooms, 'full-home'),
  'fullhome-phased': path.join(hubRooms, 'full-home'),
  'office-cabins': path.join(hubSpaces, 'office'),
  'office-meeting': path.join(hubSpaces, 'office'),
  'clinic-consult': path.join(hubSpaces, 'clinic'),
  'clinic-procedure': path.join(hubSpaces, 'clinic'),
  'retail-flagship': path.join(hubSpaces, 'retail'),
  'retail-display': path.join(hubSpaces, 'retail'),
  'coworking-pods': path.join(hubSpaces, 'coworking'),
  'coworking-community': path.join(hubSpaces, 'coworking'),
  'school-staffroom': path.join(hubSpaces, 'school'),
  'school-sets': path.join(hubSpaces, 'school'),
  'hostel-single': path.join(hubSpaces, 'hostel'),
  'hostel-lockers': path.join(hubSpaces, 'hostel'),
  'library-reading': path.join(hubSpaces, 'library'),
  'library-lab': path.join(hubSpaces, 'library'),
  'admin-meeting': path.join(hubSpaces, 'admin'),
  'admin-reception': path.join(hubSpaces, 'admin'),
  'cafe-counter': path.join(hubSpaces, 'cafe'),
  'cafe-kitchen': path.join(hubSpaces, 'cafe'),
  'hotel-guestroom': path.join(hubSpaces, 'hotel'),
  'hotel-amenities': path.join(hubSpaces, 'hotel'),
  'bar-lounge': path.join(hubSpaces, 'bar'),
  'bar-lighting': path.join(hubSpaces, 'bar'),
  'salon-waiting': path.join(hubSpaces, 'salon'),
  'salon-treatment': path.join(hubSpaces, 'salon'),
};

async function writeJpeg(input, outPath, gravity = 'centre') {
  await sharp(input)
    .resize(1800, 1350, { fit: 'cover', position: gravity })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(outPath);
}

async function copySet(prefix, srcBase) {
  for (const n of [1, 2, 3]) {
    const src = `${srcBase}-0${n}.jpg`;
    if (!fs.existsSync(src)) throw new Error(`Missing ${src}`);
    await writeJpeg(src, path.join(dst, `${prefix}-0${n}.jpg`));
  }
  console.log('copied', prefix);
}

async function fillPrefix(prefix) {
  const out1 = path.join(dst, `${prefix}-01.jpg`);
  const out2 = path.join(dst, `${prefix}-02.jpg`);
  const out3 = path.join(dst, `${prefix}-03.jpg`);
  const gen1 = path.join(gen, `${prefix}-01.jpg`);
  const gen2 = path.join(gen, `${prefix}-02.jpg`);
  const gen3 = path.join(gen, `${prefix}-03.jpg`);
  const fallback = extraFallback[prefix];

  const sources = [];
  if (fs.existsSync(gen1)) sources.push(gen1);
  if (fs.existsSync(gen2)) sources.push(gen2);
  if (fs.existsSync(gen3)) sources.push(gen3);

  if (sources.length === 0 && fallback) {
    await copySet(prefix, fallback);
    return;
  }

  if (sources.length === 0) {
    throw new Error(`No source for ${prefix}`);
  }

  await writeJpeg(sources[0], out1, 'centre');
  await writeJpeg(sources[1] ?? sources[0], out2, sources[1] ? 'centre' : 'east');
  await writeJpeg(sources[2] ?? sources[0], out3, sources[2] ? 'centre' : 'north');
  console.log('filled', prefix, sources.length);
}

const extrasOnly = process.argv.includes('--extras-only');

if (!extrasOnly) {
  for (const [prefix, srcBase] of copies) {
    await copySet(prefix, srcBase);
  }
}

for (const prefix of extraPrefixes) {
  await fillPrefix(prefix);
}

console.log('done');
