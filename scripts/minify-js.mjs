import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify } from 'terser';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'src', 'client');
const targetDir = join(root, 'public', 'js');

mkdirSync(targetDir, { recursive: true });

for (const file of ['lib.js', 'main.js']) {
  const source = readFileSync(join(sourceDir, file), 'utf8');
  const result = await minify(source, {
    compress: true,
    mangle: true,
    format: { comments: false },
  });

  if (!result.code) {
    throw new Error(`Failed to minify ${file}`);
  }

  writeFileSync(join(targetDir, file), result.code);
  console.log(`Minified src/client/${file} -> public/js/${file}`);
}
