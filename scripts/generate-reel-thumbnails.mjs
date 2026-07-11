import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images', 'reels');
const width = 360;
const height = 640;
const quality = 84;

/** @type {{ out: string; src: string }[]} */
const reelThumbnails = [
  { out: 'modular-kitchen.webp', src: 'src/assets/images/projects/modular-kitchen.jpeg' },
  { out: 'home-interior.webp', src: 'src/assets/images/projects/home-interior-3.jpg' },
  { out: 'bedroom.webp', src: 'src/assets/images/hero/bedroom.jpg' },
  { out: 'kitchen-1.webp', src: 'src/assets/images/hero/kitchen-1.jpeg' },
  { out: 'kitchen-2.webp', src: 'src/assets/images/hero/kitchen-2.jpeg' },
  { out: 'project-video-1.webp', src: 'src/assets/images/youtube/bt9uVqRqT_c.jpg' },
  { out: 'project-video-2.webp', src: 'src/assets/images/youtube/PPfFXoK4Dso.jpg' },
  { out: 'project-video-3.webp', src: 'src/assets/images/youtube/86CQ7rvVkmQ.jpg' },
];

mkdirSync(outDir, { recursive: true });

for (const { out, src } of reelThumbnails) {
  const input = join(root, src);
  const output = join(outDir, out);

  await sharp(input)
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .webp({ quality })
    .toFile(output);

  console.log(`Generated ${out}`);
}

console.log(`Reel thumbnails written to public/images/reels/ (${width}x${height} webp)`);
