import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vendorDir = join(root, 'public', 'vendor');

mkdirSync(vendorDir, { recursive: true });

const copies = [
  ['node_modules/jquery/dist/jquery.min.js', 'jquery.min.js'],
  ['node_modules/swiper/swiper-bundle.min.js', 'swiper-bundle.min.js'],
  ['node_modules/gsap/dist/gsap.min.js', 'gsap.min.js'],
  ['node_modules/gsap/dist/CustomEase.min.js', 'CustomEase.min.js'],
  ['node_modules/gsap/dist/ScrollTrigger.min.js', 'ScrollTrigger.min.js'],
  ['node_modules/gsap/dist/SplitText.min.js', 'SplitText.min.js'],
  ['node_modules/lenis/dist/lenis.min.js', 'lenis.min.js'],
];

for (const [source, target] of copies) {
  cpSync(join(root, source), join(vendorDir, target));
}

const jsDir = join(root, 'public', 'js');
mkdirSync(jsDir, { recursive: true });

const preloaderCopies = [
  ['src/client/preloader-utils.js', 'preloader-utils.js'],
  ['src/client/brand-shape.js', 'brand-shape.js'],
  ['src/client/gold-forge.js', 'gold-forge.js'],
];

for (const [source, target] of preloaderCopies) {
  cpSync(join(root, source), join(jsDir, target));
}

console.log('Vendor assets copied to public/vendor/');
console.log('Preloader assets copied to public/js/');
