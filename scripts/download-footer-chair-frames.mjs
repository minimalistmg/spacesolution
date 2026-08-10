import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/images/footer-chair');

fs.mkdirSync(outDir, { recursive: true });

const base = 'https://textura.works/images/footerChair';

for (let i = 1; i <= 23; i += 1) {
  const name = String(i).padStart(4, '0') + '.webp';
  const url = `${base}/${name}`;
  const dest = path.join(outDir, name);

  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    console.log('skip', name);
    continue;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed ${url}: ${res.status}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log('saved', name, buf.length);
}

console.log('done');
