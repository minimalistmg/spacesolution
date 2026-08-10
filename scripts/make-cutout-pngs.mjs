/**
 * Convert product shots with white/checkerboard studio backs into true alpha PNGs.
 * Flood-fills from edges; softens the silhouette.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const srcDir =
  'C:/Users/Maruthi Gowda/.cursor/projects/c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution/assets';
const outDir = path.resolve('src/assets/images/cutouts');

const FILES = [
  'cutout-chair.png',
  'cutout-lamp.png',
  'cutout-pendants.png',
  'cutout-kitchen.png',
  'cutout-wardrobe.png',
  'cutout-bed.png',
  'cutout-pooja.png',
];

const COLOR_DIST = 42;
const EDGE_BAND = 6;

function dist(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function collectBgSeeds(data, w, h) {
  const seeds = [];
  const push = (x, y) => {
    const i = (y * w + x) * 4;
    seeds.push([data[i], data[i + 1], data[i + 2]]);
  };
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < EDGE_BAND; y++) {
      push(x, y);
      push(x, h - 1 - y);
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < EDGE_BAND; x++) {
      push(x, y);
      push(w - 1 - x, y);
    }
  }
  // Cluster coarsely into palette buckets
  const buckets = new Map();
  for (const [r, g, b] of seeds) {
    const key = `${r >> 4}_${g >> 4}_${b >> 4}`;
    const cur = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0 };
    cur.r += r;
    cur.g += g;
    cur.b += b;
    cur.n += 1;
    buckets.set(key, cur);
  }
  return [...buckets.values()]
    .filter((c) => c.n > 20)
    .map((c) => [c.r / c.n, c.g / c.n, c.b / c.n]);
}

function isBg(r, g, b, palette) {
  // Near-white / light gray always bg (checker cells)
  if (r > 235 && g > 235 && b > 235) return true;
  if (Math.abs(r - g) < 12 && Math.abs(g - b) < 12 && r > 175 && r < 245) return true;
  for (const [pr, pg, pb] of palette) {
    if (dist(r, g, b, pr, pg, pb) <= COLOR_DIST) return true;
  }
  return false;
}

function floodBgMask(data, w, h, palette) {
  const mask = new Uint8Array(w * h); // 1 = background
  const queue = new Int32Array(w * h);
  let qh = 0;
  let qt = 0;

  const tryEnqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const idx = y * w + x;
    if (mask[idx]) return;
    const i = idx * 4;
    if (!isBg(data[i], data[i + 1], data[i + 2], palette)) return;
    mask[idx] = 1;
    queue[qt++] = idx;
  };

  for (let x = 0; x < w; x++) {
    tryEnqueue(x, 0);
    tryEnqueue(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    tryEnqueue(0, y);
    tryEnqueue(w - 1, y);
  }

  while (qh < qt) {
    const idx = queue[qh++];
    const x = idx % w;
    const y = (idx / w) | 0;
    tryEnqueue(x + 1, y);
    tryEnqueue(x - 1, y);
    tryEnqueue(x, y + 1);
    tryEnqueue(x, y - 1);
  }

  // Second pass: remove leftover checker islands not connected to subject
  // (pixels matching bg palette but trapped) — skip; flood is enough.

  return mask;
}

function featherAlpha(mask, w, h, radius = 2) {
  const alpha = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!mask[idx]) {
        alpha[idx] = 255;
        continue;
      }
      // Background: look for nearby subject for soft edge
      let minD = radius + 1;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (!mask[ny * w + nx]) {
            const d = Math.hypot(dx, dy);
            if (d < minD) minD = d;
          }
        }
      }
      if (minD > radius) alpha[idx] = 0;
      else alpha[idx] = Math.round(255 * (1 - minD / (radius + 0.01)));
    }
  }
  return alpha;
}

async function processFile(file) {
  const input = path.join(srcDir, file);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const palette = collectBgSeeds(data, w, h);
  const mask = floodBgMask(data, w, h, palette);
  const alpha = featherAlpha(mask, w, h, 2);

  const out = Buffer.from(data);
  let transparent = 0;
  for (let i = 0, p = 0; i < out.length; i += 4, p++) {
    out[i + 3] = alpha[p];
    if (alpha[p] < 10) transparent++;
  }

  const outPath = path.join(outDir, file);
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  const pct = ((transparent / (w * h)) * 100).toFixed(1);
  console.log(`${file} → ${outPath} (transparent ${pct}%)`);
}

fs.mkdirSync(outDir, { recursive: true });
for (const file of FILES) {
  await processFile(file);
}
console.log('done');
