/**
 * Builds a lightweight architectural apartment .glb for InteractiveInterior.
 * Named meshes support optional Raycaster room labels.
 *
 * Run: node scripts/generate-interior-glb.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { Blob } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/* GLTFExporter expects browser FileReader/Blob APIs. */
class FileReaderPolyfill {
  constructor() {
    this.result = null;
    this.onload = null;
    this.onerror = null;
    this.onloadend = null;
    this.readyState = 0;
  }
  readAsArrayBuffer(blob) {
    this.readyState = 1;
    const toBuffer = async () => {
      if (!blob) throw new Error('No blob');
      if (typeof blob.arrayBuffer === 'function') return blob.arrayBuffer();
      if (blob instanceof ArrayBuffer) return blob;
      if (ArrayBuffer.isView(blob)) {
        return blob.buffer.slice(blob.byteOffset, blob.byteOffset + blob.byteLength);
      }
      throw new Error('Unsupported blob type: ' + Object.prototype.toString.call(blob));
    };
    toBuffer()
      .then((buf) => {
        this.readyState = 2;
        this.result = buf;
        const evt = { target: this };
        if (typeof this.onload === 'function') this.onload(evt);
        if (typeof this.onloadend === 'function') this.onloadend(evt);
      })
      .catch((err) => {
        this.readyState = 2;
        const evt = { target: this, error: err };
        if (typeof this.onerror === 'function') this.onerror(evt);
        if (typeof this.onloadend === 'function') this.onloadend(evt);
      });
  }
}

globalThis.Blob = Blob;
globalThis.FileReader = FileReaderPolyfill;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public/models/interior');
const outFile = path.join(outDir, 'apartment.glb');

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.72,
    metalness: opts.metalness ?? 0.04,
    ...opts,
  });
}

function box(w, h, d, material, name, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.name = name;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function group(name) {
  const g = new THREE.Group();
  g.name = name;
  return g;
}

const scene = new THREE.Scene();
scene.name = 'ApartmentInterior';

const wall = mat(0xf3ebe0, { roughness: 0.9 });
const floor = mat(0xd8cfc2, { roughness: 0.85 });
const wood = mat(0x8b6b4a, { roughness: 0.55 });
const soft = mat(0xe8dfd2, { roughness: 0.78 });
const accent = mat(0xc5a23a, { roughness: 0.45, metalness: 0.15 });
const dark = mat(0x3a2f26, { roughness: 0.6 });
const stone = mat(0xcfc6ba, { roughness: 0.5 });
const glass = mat(0xdde7ef, {
  roughness: 0.12,
  metalness: 0.08,
  transparent: true,
  opacity: 0.42,
});

/* Shell — open cutaway (no ceiling / open camera side) for hero framing */
const shell = group('Shell');
shell.add(box(10.4, 0.18, 7.4, mat(0xb9b2a8, { roughness: 0.92 }), 'Plinth', 0, -0.12, 0.1));
shell.add(box(10.2, 0.12, 7.2, floor, 'Floor', 0, 0, 0));
shell.add(box(0.14, 2.35, 7.2, wall, 'Wall_West', -5.05, 1.2, 0));
shell.add(box(0.14, 2.35, 4.2, wall, 'Wall_East', 5.05, 1.2, -1.2));
shell.add(box(10.2, 2.35, 0.14, wall, 'Wall_North', 0, 1.2, -3.55));
scene.add(shell);

/* Living Room */
const living = group('LivingRoom');
living.add(box(3.2, 0.55, 1.35, soft, 'Sofa', -1.1, 0.4, 1.55));
living.add(box(0.55, 0.45, 0.55, soft, 'Armchair', 1.15, 0.35, 1.9));
living.add(box(1.2, 0.08, 0.7, stone, 'CoffeeTable', -0.7, 0.28, 2.35));
living.add(box(2.2, 0.04, 1.4, mat(0xb9aea0, { roughness: 0.95 }), 'Rug', -0.7, 0.08, 2.1));
living.add(box(2.4, 0.45, 0.4, wood, 'MediaConsole', -0.9, 0.3, -0.35));
living.add(box(1.4, 0.8, 0.05, dark, 'TV', -0.9, 1.15, -0.5));
living.add(box(0.18, 1.2, 0.18, accent, 'FloorLamp', 1.55, 0.7, 2.4));
scene.add(living);

/* Kitchen */
const kitchen = group('Kitchen');
kitchen.add(box(2.6, 0.9, 0.6, wood, 'KitchenBase', -3.55, 0.55, -2.35));
kitchen.add(box(2.6, 0.08, 0.62, stone, 'Counter', -3.55, 1.02, -2.35));
kitchen.add(box(2.2, 0.7, 0.35, soft, 'UpperCabinets', -3.55, 2.0, -2.5));
kitchen.add(box(0.55, 1.8, 0.55, dark, 'Fridge', -4.55, 0.98, -1.55));
kitchen.add(box(1.4, 0.9, 0.7, wood, 'Island', -2.35, 0.55, -1.15));
kitchen.add(box(1.4, 0.08, 0.72, stone, 'IslandTop', -2.35, 1.02, -1.15));
scene.add(kitchen);

/* Dining */
const dining = group('Dining');
dining.add(box(1.5, 0.08, 0.9, wood, 'DiningTable', -0.2, 0.78, -1.85));
dining.add(box(0.12, 0.7, 0.12, wood, 'TableLeg_A', -0.75, 0.4, -2.15));
dining.add(box(0.12, 0.7, 0.12, wood, 'TableLeg_B', 0.35, 0.4, -2.15));
dining.add(box(0.12, 0.7, 0.12, wood, 'TableLeg_C', -0.75, 0.4, -1.55));
dining.add(box(0.12, 0.7, 0.12, wood, 'TableLeg_D', 0.35, 0.4, -1.55));
for (let i = 0; i < 4; i += 1) {
  const side = i < 2 ? -1 : 1;
  const along = i % 2 === 0 ? -0.55 : 0.15;
  dining.add(
    box(0.38, 0.55, 0.38, soft, `DiningChair_${i + 1}`, along, 0.4, -1.85 + side * 0.7)
  );
}
scene.add(dining);

/* Bedroom */
const bedroom = group('Bedroom');
bedroom.add(box(0.1, 2.5, 3.2, wall, 'BedroomPartition', 1.85, 1.3, -1.7));
bedroom.add(box(2.2, 0.45, 1.7, soft, 'Bed', 3.45, 0.35, -1.85));
bedroom.add(box(2.2, 0.75, 0.12, wood, 'Headboard', 3.45, 0.85, -2.65));
bedroom.add(box(0.4, 0.4, 0.4, wood, 'Nightstand', 2.35, 0.28, -2.45));
bedroom.add(box(1.4, 2.1, 0.45, wood, 'Wardrobe', 4.45, 1.15, -0.55));
scene.add(bedroom);

/* Balcony / glass */
const balcony = group('Balcony');
balcony.add(box(2.6, 2.1, 0.06, glass, 'SlidingGlass', 2.2, 1.2, 3.52));
balcony.add(box(2.8, 0.08, 1.1, stone, 'BalconyFloor', 2.2, 0.08, 4.2));
balcony.add(box(2.8, 0.7, 0.05, dark, 'BalconyRail', 2.2, 0.7, 4.7));
scene.add(balcony);

/* Decor / plants */
const decor = group('Decor');
decor.add(box(0.35, 0.9, 0.35, mat(0x6f8f6a, { roughness: 0.85 }), 'Plant_A', 1.7, 0.55, 0.2));
decor.add(box(0.28, 0.7, 0.28, mat(0x7fa074, { roughness: 0.85 }), 'Plant_B', 4.2, 0.45, 3.9));
decor.add(box(0.5, 0.05, 0.35, accent, 'Tray', -0.7, 0.34, 2.35));
scene.add(decor);

fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const exporter = new GLTFExporter();
  const result = await new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (gltf) => resolve(gltf),
      (err) => reject(err),
      { binary: true, onlyVisible: true }
    );
  });

  const buffer = Buffer.from(result);
  fs.writeFileSync(outFile, buffer);
  console.log(`Wrote ${outFile} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

await main();
