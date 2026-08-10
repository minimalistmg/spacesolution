import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const phosphorDir = join(root, 'node_modules', '@phosphor-icons', 'core', 'assets', 'regular');
const targetFile = join(root, 'src', 'data', 'headerMenuIcons.ts');

const menuIconsSource = readFileSync(targetFile, 'utf8');
const menuIconsMatch = menuIconsSource.match(
  /export const menuIconPhosphorFiles = (\{[\s\S]*?\}) as const/,
);
if (!menuIconsMatch) {
  throw new Error('Could not parse menuIconPhosphorFiles from src/data/headerMenuIcons.ts');
}
const menuIconPhosphorFiles = Function(`"use strict"; return (${menuIconsMatch[1]});`)();

function extractPaths(svg) {
  const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((match) => match[1]);
  if (paths.length === 0) {
    throw new Error('No SVG paths found');
  }
  return paths.length === 1 ? paths[0] : paths;
}

const icons = {};

for (const [name, fileName] of Object.entries(menuIconPhosphorFiles)) {
  const svgPath = join(phosphorDir, `${fileName}.svg`);
  const svg = readFileSync(svgPath, 'utf8');
  icons[name] = extractPaths(svg);
}

const startMarker = '// @generated-menu-icon-paths-start';
const endMarker = '// @generated-menu-icon-paths-end';
const startIndex = menuIconsSource.indexOf(startMarker);
const endIndex = menuIconsSource.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  throw new Error('Could not find generated icon path markers in src/data/headerMenuIcons.ts');
}

const generatedBlock = `${startMarker}
const menuIconPaths = ${JSON.stringify(icons, null, 2)} as const satisfies Record<MenuIconName, MenuIconPath>;
${endMarker}`;

const updatedSource =
  menuIconsSource.slice(0, startIndex) +
  generatedBlock +
  menuIconsSource.slice(endIndex + endMarker.length);

writeFileSync(targetFile, updatedSource);
console.log(`Updated menu icon paths in ${targetFile} (${Object.keys(icons).length} icons)`);
