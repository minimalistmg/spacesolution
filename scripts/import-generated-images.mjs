// One-off importer: pulls the generated light-palette photography into src/assets
// and upscales it so the astro:assets srcsets have usable large widths.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = resolve(
  process.env.USERPROFILE ?? process.env.HOME ?? '',
  '.cursor/projects/c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution/assets'
);
const OUT_ROOT = resolve('src/assets/images');

const FILES = [
  ['hero-residential.jpg', 'hero/hero-residential.jpg', 2400],
  ['hero-commercial.jpg', 'hero/hero-commercial.jpg', 2400],
  ['hero-institutional.jpg', 'hero/hero-institutional.jpg', 2400],
  ['hero-hospitality.jpg', 'hero/hero-hospitality.jpg', 2400],
  ['cta-banner.jpg', 'hero/cta-banner.jpg', 2400],
  ['living-dining.jpg', 'rooms/living-dining.jpg', 1800],
  ['modular-kitchen.jpg', 'rooms/modular-kitchen-light.jpg', 1800],
  ['bedroom-suite.jpg', 'rooms/bedroom-suite.jpg', 1800],
  ['office-workspace.jpg', 'rooms/office-workspace.jpg', 1800],
  ['retail-showroom.jpg', 'rooms/retail-showroom.jpg', 1800],
  ['clinic-healthcare.jpg', 'rooms/clinic-healthcare.jpg', 1800],
  ['classroom-furniture.jpg', 'rooms/classroom-furniture.jpg', 1800],
  ['hostel-furniture.jpg', 'rooms/hostel-furniture.jpg', 1800],
  ['cafe-restaurant.jpg', 'rooms/cafe-restaurant.jpg', 1800],
  ['hotel-lobby.jpg', 'rooms/hotel-lobby.jpg', 1800],
  ['salon-wellness.jpg', 'rooms/salon-wellness.jpg', 1800],
  ['pooja-room.jpg', 'rooms/pooja-room.jpg', 1800],
  ['library-lab.jpg', 'rooms/library-lab.jpg', 1800],
  ['bar-lounge.jpg', 'rooms/bar-lounge.jpg', 1800],
  ['full-home.jpg', 'rooms/full-home.jpg', 1800],
  ['studio-craft.jpg', 'studio/studio-craft.jpg', 1800],
  ['project-apartment.jpg', 'projects/project-apartment.jpg', 1800],
  ['project-villa.jpg', 'projects/project-villa.jpg', 1800],
  ['project-coworking.jpg', 'projects/project-coworking.jpg', 1800],
];

for (const [source, target, width] of FILES) {
  const input = await readFile(join(SOURCE_DIR, source));
  const outPath = join(OUT_ROOT, target);
  await mkdir(dirname(outPath), { recursive: true });

  const image = sharp(input);
  const meta = await image.metadata();
  const pipeline =
    meta.width && meta.width < width
      ? image.resize({ width, kernel: sharp.kernel.lanczos3 })
      : image.resize({ width, withoutEnlargement: true });

  const out = await pipeline.jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  await writeFile(outPath, out);
  console.log(`${target}  ${meta.width}px -> ${width}px  (${(out.length / 1024).toFixed(0)} KB)`);
}
