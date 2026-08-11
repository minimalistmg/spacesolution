/**
 * Cut green-screen gallery assets and assemble spectator walk GIF.
 */
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(
  process.env.USERPROFILE ?? process.env.HOME ?? '',
  '.cursor/projects/c-Users-Maruthi-Gowda-Documents-GitHub-spacesolution/assets'
);
const outDir = join(root, 'src/assets/images/gallery-spectators');
mkdirSync(outDir, { recursive: true });

function dist2(r, g, b, tr, tg, tb) {
  const dr = r - tr;
  const dg = g - tg;
  const db = b - tb;
  return dr * dr + dg * dg + db * db;
}

async function cutout(inputPath, outputPath, { maxHeight = 0 } = {}) {
  if (!existsSync(inputPath)) {
    console.error('missing', inputPath);
    return null;
  }

  let pipeline = sharp(inputPath).ensureAlpha();
  if (maxHeight > 0) {
    pipeline = pipeline.resize({ height: maxHeight, fit: 'inside', withoutEnlargement: true });
  }

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = Buffer.from(data);

  for (let i = 0; i < px.length; i += channels) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const isGreen = g > 140 && g > r + 35 && g > b + 35;
    const dGreen = dist2(r, g, b, 0, 255, 0);
    if (isGreen || dGreen < 55 * 55) {
      px[i + 3] = 0;
    } else if (dGreen < 95 * 95) {
      const t = (Math.sqrt(dGreen) - 55) / 40;
      px[i + 3] = Math.round(255 * Math.max(0, Math.min(1, t)));
    }
  }

  await sharp(px, { raw: { width, height, channels } }).png().toFile(outputPath);
  console.log('wrote', outputPath, width, height);
  return { path: outputPath, width, height };
}

async function buildGif(framePaths, gifPath) {
  // Prefer gifenc if present; otherwise write an APNG-style fallback note via PNG sequence CSS.
  let GIFEncoder;
  try {
    GIFEncoder = require('gifencoder');
  } catch {
    try {
      const mod = await import('gifencoder');
      GIFEncoder = mod.default ?? mod;
    } catch {
      console.warn('gifencoder not installed — installing locally…');
      const { execSync } = await import('node:child_process');
      execSync('npm install gifencoder pngjs --no-save', { cwd: root, stdio: 'inherit' });
      GIFEncoder = require('gifencoder');
    }
  }

  const { PNG } = require('pngjs');
  const meta = await sharp(framePaths[0]).metadata();
  const w = meta.width;
  const h = meta.height;

  const encoder = new GIFEncoder(w, h);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(180);
  encoder.setQuality(10);
  // Transparent GIFs: treat near-black from premultiplied as transparent via disposal
  encoder.setTransparent(0x000000);

  for (const framePath of framePaths) {
    const resized = await sharp(framePath)
      .resize(w, h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Convert RGBA → RGB with magenta key for transparent areas (gifencoder limitation)
    const rgba = resized.data;
    const rgb = Buffer.alloc(w * h * 3);
    const KEY = { r: 0, g: 255, b: 0 }; // keep green as transparent key if leftover
    for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
      const a = rgba[i + 3];
      if (a < 40) {
        rgb[j] = 0;
        rgb[j + 1] = 0;
        rgb[j + 2] = 0;
      } else {
        rgb[j] = rgba[i];
        rgb[j + 1] = rgba[i + 1];
        rgb[j + 2] = rgba[i + 2];
      }
    }

    encoder.setTransparent(0x000000);
    encoder.addFrame(rgb);
  }

  encoder.finish();
  writeFileSync(gifPath, encoder.out.getData());
  console.log('wrote', gifPath);
}

const girlFrames = [
  'gallery-girl-f1-green.png',
  'gallery-girl-f2-green.png',
  'gallery-girl-f3-green.png',
  'gallery-girl-f4-green.png',
  // ping-pong for smoother loop
  'gallery-girl-f3-green.png',
  'gallery-girl-f2-green.png',
];

const cutGirl = [];
for (let i = 0; i < girlFrames.length; i++) {
  const src = girlFrames[i];
  const dest = join(outDir, `girl-frame-${i + 1}.png`);
  // Only unique first 4 for storage; still build gif from all
  const out = await cutout(join(assets, src), dest, { maxHeight: 900 });
  if (out) cutGirl.push(out.path);
}

await cutout(join(assets, 'gallery-bench-green.png'), join(outDir, 'gallery-bench.png'), {
  maxHeight: 420,
});
await cutout(join(assets, 'gallery-plants-green.png'), join(outDir, 'gallery-plants.png'), {
  maxHeight: 520,
});

if (cutGirl.length) {
  await buildGif(cutGirl, join(outDir, 'spectator-girl-walk.gif'));
}
