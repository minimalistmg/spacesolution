/**
 * Process gallery watcher + accent prop PNGs → true alpha, canonical MD filenames.
 * Handles green screen, black studio, and baked checkerboard backgrounds.
 */
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/assets/images/gallery-spectators');
const cutoutsDir = join(root, 'src/assets/images/cutouts');
mkdirSync(dir, { recursive: true });

/** @type {[string, string][]} */
const MAP = [
  ['spectator-man-back.png', 'viewer-back-man.png'],
  ['spectator-woman-back.png', 'viewer-back-girl.png'],
  ['gallery-plants.png', 'gallery-floor-plant.png'],
  [join(cutoutsDir, 'cutout-lamp.png'), 'gallery-floor-lamp.png'],
  ['gallery-bench.png', 'gallery-accent-plinth.png'],
];

/** If chroma pass fails, copy source to canonical name so Astro imports resolve. */
const COPY_FALLBACK = [
  ['spectator-man-back.png', 'viewer-back-man.png'],
  ['spectator-woman-back.png', 'viewer-back-girl.png'],
  ['gallery-plants.png', 'gallery-floor-plant.png'],
  ['gallery-bench.png', 'gallery-accent-plinth.png'],
];

function dist2(r, g, b, tr, tg, tb) {
  const dr = r - tr;
  const dg = g - tg;
  const db = b - tb;
  return dr * dr + dg * dg + db * db;
}

function isGreen(r, g, b) {
  if (g > 140 && g > r + 35 && g > b + 35) return true;
  return dist2(r, g, b, 0, 255, 0) < 55 * 55;
}

function isNeutralBg(r, g, b) {
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  if (spread > 22) return false;
  const v = (r + g + b) / 3;
  return v >= 160 || v <= 30;
}

function matchesBg(r, g, b, bgSamples) {
  if (isGreen(r, g, b)) return true;
  if (!isNeutralBg(r, g, b)) return false;
  for (const [br, bg, bb] of bgSamples) {
    if (Math.sqrt(dist2(r, g, b, br, bg, bb)) < 36) return true;
  }
  return false;
}

function sampleCorners(data, w, h, channels) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [2, 2],
    [w - 3, 2],
    [2, h - 3],
    [w - 3, h - 3],
  ];
  const samples = [];
  for (const [x, y] of pts) {
    const i = (y * w + x) * channels;
    samples.push([data[i], data[i + 1], data[i + 2]]);
  }
  return samples;
}

function floodFillBackground(px, w, h, channels, bgSamples) {
  const seen = new Uint8Array(w * h);
  const queue = [];

  for (let x = 0; x < w; x++) {
    queue.push(x, 0, x, h - 1);
  }
  for (let y = 1; y < h - 1; y++) {
    queue.push(0, y, w - 1, y);
  }

  while (queue.length) {
    const y = queue.pop();
    const x = queue.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const idx = y * w + x;
    if (seen[idx]) continue;
    seen[idx] = 1;

    const i = idx * channels;
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    if (!matchesBg(r, g, b, bgSamples)) continue;

    px[i + 3] = 0;

    queue.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
}

function featherEdges(px, w, h, channels) {
  const alpha = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      alpha[y * w + x] = px[(y * w + x) * channels + 3];
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const i = idx * channels;
      if (alpha[idx] > 0 && alpha[idx] < 255) continue;
      if (alpha[idx] === 0) continue;

      let nearTransparent = false;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (alpha[ny * w + nx] === 0) nearTransparent = true;
        }
      }
      if (nearTransparent) {
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];
        if (isGreen(r, g, b) || isNeutralBg(r, g, b)) px[i + 3] = 0;
      }
    }
  }
}

function despill(r, g, b, a) {
  if (a > 240) return [r, g, b];
  const maxRB = Math.max(r, b);
  if (g > maxRB + 8) return [r, Math.round(maxRB + (g - maxRB) * 0.35), b];
  return [r, g, b];
}

async function processOne(inputPath, outputName) {
  if (!existsSync(inputPath)) {
    console.error('missing', inputPath);
    return;
  }

  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = Buffer.from(data);
  const bgSamples = sampleCorners(px, width, height, channels);

  floodFillBackground(px, width, height, channels, bgSamples);
  featherEdges(px, width, height, channels);

  for (let i = 0; i < px.length; i += channels) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const a = px[i + 3];
    const [nr, ng, nb] = despill(r, g, b, a);
    px[i] = nr;
    px[i + 1] = ng;
    px[i + 2] = nb;
  }

  const outPath = join(dir, outputName);
  await sharp(px, { raw: { width, height, channels } }).png({ compressionLevel: 9 }).toFile(outPath);

  let transparent = 0;
  for (let i = 3; i < px.length; i += channels) if (px[i] < 10) transparent++;
  console.log(
    'wrote',
    outputName,
    width,
    height,
    `(${((transparent / (width * height)) * 100).toFixed(1)}% transparent)`
  );
}

for (const [input, output] of MAP) {
  const inputPath = input.includes('cutouts') ? input : join(dir, input);
  await processOne(inputPath, output);
}

for (const [src, dest] of COPY_FALLBACK) {
  const outPath = join(dir, dest);
  if (!existsSync(outPath)) {
    const srcPath = join(dir, src);
    if (existsSync(srcPath)) {
      copyFileSync(srcPath, outPath);
      console.log('fallback copy', src, '→', dest);
    }
  }
}

console.log('done');
