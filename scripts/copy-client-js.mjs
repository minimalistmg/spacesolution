import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'src', 'client');
const targetDir = join(root, 'public', 'js');

mkdirSync(targetDir, { recursive: true });

for (const file of ['lib.js', 'main.js']) {
  cpSync(join(sourceDir, file), join(targetDir, file));
}

console.log('Client JS copied to public/js/');
