/**
 * Clean AI footer object cutouts: remove bg + soft contact shadows, trim, write to public.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cursorAssets = join(
  process.env.USERPROFILE || '',
  '.cursor/projects/c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution/assets'
);
const outDir = join(root, 'public/images/footer-objects');

const FILES = [
  'ss-obj-kitchen.png',
  'ss-obj-wardrobe.png',
  'ss-obj-living-dining.png',
  'ss-obj-bedroom.png',
  'ss-obj-pooja.png',
  'ss-obj-office.png',
  'ss-obj-clinic.png',
  'ss-obj-retail.png',
  'ss-obj-coworking.png',
  'ss-obj-school.png',
  'ss-obj-hostel.png',
  'ss-obj-library.png',
  'ss-obj-cafe.png',
  'ss-obj-hotel.png',
  'ss-obj-bar.png',
  'ss-obj-salon.png',
];

function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function sat(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function isSoftShadow(r, g, b, a) {
  if (a < 8) return true;
  const L = lum(r, g, b);
  const S = sat(r, g, b);
  // Soft contact shadows: dull grey mist, not black metal (L < 45) and not cream wood
  if (S < 0.1 && L > 55 && L < 225) return true;
  if (S < 0.14 && L > 90 && L < 210 && a < 230) return true;
  return false;
}

function isNearWhite(r, g, b, a) {
  if (a < 12) return true;
  const L = lum(r, g, b);
  const S = sat(r, g, b);
  return L >= 246 || (L >= 238 && S < 0.05);
}

async function cleanCutout(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const px = data;
  const n = width * height;
  const mark = new Uint8Array(n);

  const idx = (x, y) => y * width + x;

  // Flood-fill background from image borders
  const q = [];
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = idx(x, y);
    if (mark[i]) return;
    const o = i * 4;
    const r = px[o];
    const g = px[o + 1];
    const b = px[o + 2];
    const a = px[o + 3];
    if (!(isNearWhite(r, g, b, a) || isSoftShadow(r, g, b, a))) return;
    mark[i] = 1;
    q.push(i);
  };

  for (let x = 0; x < width; x++) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (q.length) {
    const i = q.pop();
    const x = i % width;
    const y = (i / width) | 0;
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  // Also clear any remaining soft-shadow pixels anywhere (baked under furniture)
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (mark[i]) {
      px[o + 3] = 0;
      continue;
    }
    const r = px[o];
    const g = px[o + 1];
    const b = px[o + 2];
    const a = px[o + 3];
    if (isSoftShadow(r, g, b, a)) {
      // Only strip if mostly grey (protect warm wood / gold)
      const S = sat(r, g, b);
      const L = lum(r, g, b);
      if (S < 0.09 && L > 70 && L < 215) {
        px[o + 3] = 0;
      } else if (S < 0.12 && L > 120 && L < 200) {
        px[o + 3] = Math.min(a, 40);
      }
    }
  }

  // Despill near-transparent fringe
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (px[o + 3] > 0 && px[o + 3] < 40 && isNearWhite(px[o], px[o + 1], px[o + 2], 255)) {
      px[o + 3] = 0;
    }
  }

  const cleaned = await sharp(px, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();

  const trimmed = await sharp(cleaned)
    .trim({ threshold: 8 })
    .extend({ top: 4, bottom: 4, left: 4, right: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await sharp(trimmed).toFile(outputPath);
  const meta = await sharp(trimmed).metadata();
  return `${meta.width}x${meta.height}`;
}

mkdirSync(outDir, { recursive: true });

for (const file of FILES) {
  const src = join(cursorAssets, file);
  if (!existsSync(src)) {
    console.error('Missing source:', src);
    continue;
  }
  const dest = join(outDir, file);
  const size = await cleanCutout(src, dest);
  console.log(`OK ${file} -> ${size}`);
}

console.log('Done. Public files:', readdirSync(outDir).filter((f) => f.startsWith('ss-obj-')).join(', '));
