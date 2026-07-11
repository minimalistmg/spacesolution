import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images', 'menu');
const width = 192;
const height = 144;
const quality = 82;

/** @type {{ out: string; src: string }[]} */
const menuImages = [
  { out: 'residential.webp', src: 'src/assets/images/hero/bedroom.jpg' },
  { out: 'commercial.webp', src: 'src/assets/images/hero/kitchen-1.jpeg' },
  { out: 'institutional.webp', src: 'src/assets/images/hero/kitchen-2.jpeg' },
  { out: 'turnkey.webp', src: 'src/assets/images/projects/modular-kitchen.jpeg' },
  { out: 'modular-kitchen-guide.webp', src: 'src/assets/images/projects/modular-kitchen.jpeg' },
  { out: 'materials-and-finishes.webp', src: 'src/assets/images/hero/kitchen-1.jpeg' },
  { out: 'space-planning.webp', src: 'src/assets/images/hero/bedroom.jpg' },
  { out: 'interior-styles.webp', src: 'src/assets/images/projects/home-interior-3.jpg' },
  { out: 'budget-planning.webp', src: 'src/assets/images/hero/kitchen-1.jpeg' },
  { out: 'before-you-renovate.webp', src: 'src/assets/images/hero/kitchen-2.jpeg' },
];

mkdirSync(outDir, { recursive: true });

for (const { out, src } of menuImages) {
  const input = join(root, src);
  const output = join(outDir, out);

  await sharp(input)
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .webp({ quality })
    .toFile(output);

  console.log(`Generated ${out}`);
}

console.log(`Menu images written to public/images/menu/ (${width}x${height} webp)`);
