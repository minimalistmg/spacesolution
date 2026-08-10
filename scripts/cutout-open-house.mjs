/**
 * Remove studio / chroma backgrounds from open-house source images
 * and write transparent PNGs into src/assets/images/open-house/.
 */
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(
  process.env.USERPROFILE ?? process.env.HOME ?? '',
  '.cursor/projects/c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution/assets'
);
const outDir = join(root, 'src/assets/images/open-house');

mkdirSync(outDir, { recursive: true });

const jobs = [
  ['open-house-1-green.png', 'open-house-1.png'],
  ['open-house-2-green.png', 'open-house-2.png'],
  ['open-house-3-green.png', 'open-house-3.png'],
  // Fallbacks if green-named sources missing
  ['residential-open-house.png', 'open-house-1.png'],
  ['residential-open-house-2.png', 'open-house-2.png'],
  ['residential-open-house-3.png', 'open-house-3.png'],
];

function dist2(r, g, b, tr, tg, tb) {
  const dr = r - tr;
  const dg = g - tg;
  const db = b - tb;
  return dr * dr + dg * dg + db * db;
}

async function cutout(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const px = Buffer.from(data);

  // Sample corners for studio backdrop colour
  const samples = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
    [Math.floor(width / 2), 2],
    [2, Math.floor(height / 2)],
  ];

  let sr = 0;
  let sg = 0;
  let sb = 0;
  for (const [x, y] of samples) {
    const i = (y * width + x) * channels;
    sr += px[i];
    sg += px[i + 1];
    sb += px[i + 2];
  }
  sr = Math.round(sr / samples.length);
  sg = Math.round(sg / samples.length);
  sb = Math.round(sb / samples.length);

  // Soft thresholds — studio beige / soft green screens
  const hard = 42 * 42; // fully transparent inside
  const soft = 78 * 78; // feather band

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];

      // Strong green chroma
      const isGreen = g > 140 && g > r + 40 && g > b + 40;
      const dBg = dist2(r, g, b, sr, sg, sb);

      let alpha = px[i + 3];
      if (isGreen) {
        const greenStrength = Math.min(255, (g - Math.max(r, b)) * 3);
        alpha = Math.max(0, 255 - greenStrength);
      } else if (dBg <= hard) {
        alpha = 0;
      } else if (dBg < soft) {
        const t = (dBg - hard) / (soft - hard);
        alpha = Math.round(255 * t);
      }

      // Edge assist: near-frame pixels that are still very light/beige
      const nearEdge = x < 8 || y < 8 || x >= width - 8 || y >= height - 8;
      if (nearEdge && r > 220 && g > 210 && b > 190 && Math.abs(r - g) < 30) {
        alpha = Math.min(alpha, 0);
      }

      px[i + 3] = alpha;
    }
  }

  await sharp(px, { raw: { width, height, channels } }).png().toFile(outputPath);
  console.log(`Wrote ${outputPath}`);
}

const written = new Set();
for (const [srcName, outName] of jobs) {
  if (written.has(outName)) continue;
  const input = join(srcDir, srcName);
  try {
    await sharp(input).metadata();
  } catch {
    continue;
  }
  await cutout(input, join(outDir, outName));
  written.add(outName);
}

if (written.size < 3) {
  console.error('Expected 3 cutouts; got', written.size);
  process.exit(1);
}
