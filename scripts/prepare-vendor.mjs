import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vendorDir = join(root, 'public', 'vendor');

mkdirSync(vendorDir, { recursive: true });

const copies = [
  ['node_modules/jquery/dist/jquery.min.js', 'jquery.min.js'],
  ['node_modules/swiper/swiper-bundle.min.js', 'swiper-bundle.min.js'],
];

for (const [source, target] of copies) {
  cpSync(join(root, source), join(vendorDir, target));
}

console.log('Vendor assets copied to public/vendor/');
