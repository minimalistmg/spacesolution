/**
 * Chroma-key green (#00FF00-ish) studio backs → true alpha PNGs.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const srcDir =
  'C:/Users/Maruthi Gowda/.cursor/projects/c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution/assets';
const outDir = path.resolve('src/assets/images/cutouts');

const MAP = [
  ['chroma-chair.png', 'cutout-chair.png'],
  ['chroma-lamp.png', 'cutout-lamp.png'],
  ['chroma-pendants.png', 'cutout-pendants.png'],
  ['chroma-kitchen.png', 'cutout-kitchen.png'],
  ['chroma-wardrobe.png', 'cutout-wardrobe.png'],
  ['chroma-bed.png', 'cutout-bed.png'],
  ['chroma-pooja.png', 'cutout-pooja.png'],
  ['chroma-sofa.png', 'cutout-sofa.png'],
];

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function greenAlpha(r, g, b) {
  const [h, s, v] = rgbToHsv(r, g, b);
  // Strong green key
  const hueOk = h >= 70 && h <= 170;
  const satOk = s >= 0.28;
  const valOk = v >= 0.18;
  if (hueOk && satOk && valOk) {
    // Soft edge: more green → more transparent
    const greenDominance = (g - Math.max(r, b)) / 255;
    if (greenDominance > 0.12 && s > 0.4) return 0;
    if (greenDominance > 0.05) return Math.round(255 * (1 - Math.min(1, greenDominance * 4)));
    return Math.round(255 * (1 - Math.min(1, (s - 0.28) * 2)));
  }
  // Spill suppress: slightly pull green channel on edges
  return 255;
}

function despill(r, g, b, a) {
  if (a > 240) return [r, g, b];
  const maxRB = Math.max(r, b);
  if (g > maxRB) {
    const ng = Math.round(maxRB + (g - maxRB) * (a / 255) * 0.35);
    return [r, ng, b];
  }
  return [r, g, b];
}

async function processOne(srcName, outName) {
  const input = path.join(srcDir, srcName);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const out = Buffer.alloc(data.length);
  let transparent = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    let a = greenAlpha(r, g, b);
    const [nr, ng, nb] = despill(r, g, b, a);
    out[i] = nr;
    out[i + 1] = ng;
    out[i + 2] = nb;
    out[i + 3] = a;
    if (a < 10) transparent++;
  }

  // Clean small green speckles inside subject: if nearly opaque neighbors, restore
  // (skip — chroma should be enough)

  const outPath = path.join(outDir, outName);
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  console.log(
    `${srcName} → ${outName} (transparent ${((transparent / (w * h)) * 100).toFixed(1)}%)`
  );
}

fs.mkdirSync(outDir, { recursive: true });
for (const [src, out] of MAP) {
  await processOne(src, out);
}
console.log('done');
