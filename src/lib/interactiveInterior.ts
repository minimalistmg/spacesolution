/**
 * Premium cinematic camera interaction for an interior GLB.
 * Vanilla Three.js — no R3F. Designed for Astro static sites.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type InteractiveInteriorConfig = {
  modelPath: string;
  fallbackImage: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  modelScale: number;
  hoverScale: number;
  fov: number;
  maxYawDeg: number;
  maxPitchDeg: number;
  hoverZoom: number;
  mouseLerp: number;
  enterDurationMs: number;
  leaveDurationMs: number;
  ambientIntensity: number;
  keyIntensity: number;
  fillIntensity: number;
  maxPixelRatio: number;
  enableLabels: boolean;
};

export const DEFAULT_INTERIOR_CONFIG: InteractiveInteriorConfig = {
  modelPath: '/models/interior/apartment.glb',
  fallbackImage: '/images/menu/residential.webp',
  cameraPosition: [4.8, 3.6, 7.2],
  cameraTarget: [0, 0.9, 0],
  modelScale: 1,
  hoverScale: 1.015,
  fov: 32,
  maxYawDeg: 4,
  maxPitchDeg: 3,
  hoverZoom: 0.35,
  mouseLerp: 0.045,
  enterDurationMs: 900,
  leaveDurationMs: 1100,
  ambientIntensity: 0.55,
  keyIntensity: 1.15,
  fillIntensity: 0.35,
  maxPixelRatio: 1.75,
  enableLabels: true,
};

type RoomHit = {
  label: string;
  object: THREE.Object3D;
};

const ROOM_LABELS: Record<string, string> = {
  LivingRoom: 'Living Room',
  Kitchen: 'Kitchen',
  Dining: 'Dining',
  Bedroom: 'Bedroom',
  Balcony: 'Balcony',
  Decor: 'Details',
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function canUseFinePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function isCoarseOrMobile() {
  return window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (!material) return;
    const mats = Array.isArray(material) ? material : [material];
    mats.forEach((m) => {
      Object.values(m).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      m.dispose();
    });
  });
}

function resolveRoomLabel(object: THREE.Object3D | null): string | null {
  let current: THREE.Object3D | null = object;
  while (current) {
    if (ROOM_LABELS[current.name]) return ROOM_LABELS[current.name];
    current = current.parent;
  }
  return null;
}

export type InteractiveInteriorHandle = {
  destroy: () => void;
};

export async function mountInteractiveInterior(
  root: HTMLElement,
  partial: Partial<InteractiveInteriorConfig> = {}
): Promise<InteractiveInteriorHandle | null> {
  const config = { ...DEFAULT_INTERIOR_CONFIG, ...partial };
  const stage = root.querySelector<HTMLElement>('[data-ii-stage]');
  const canvas = root.querySelector<HTMLCanvasElement>('[data-ii-canvas]');
  const fallback = root.querySelector<HTMLElement>('[data-ii-fallback]');
  const labelEl = root.querySelector<HTMLElement>('[data-ii-label]');
  if (!stage || !canvas) return null;

  const showFallback = () => {
    root.setAttribute('data-ii-mode', 'fallback');
    if (fallback) fallback.hidden = false;
    canvas.hidden = true;
  };

  if (!hasWebGL() || prefersReducedMotion()) {
    showFallback();
    return { destroy() {} };
  }

  const interactive = canUseFinePointer() && !isCoarseOrMobile();
  root.setAttribute('data-ii-mode', interactive ? 'interactive' : 'static');

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: interactive ? 'high-performance' : 'low-power',
    });
  } catch {
    showFallback();
    return { destroy() {} };
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, config.maxPixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = interactive;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(config.fov, 1, 0.1, 100);
  const basePos = new THREE.Vector3(...config.cameraPosition);
  const target = new THREE.Vector3(...config.cameraTarget);
  camera.position.copy(basePos);
  camera.lookAt(target);

  const ambient = new THREE.AmbientLight(0xf4eee4, config.ambientIntensity);
  const key = new THREE.DirectionalLight(0xfff2dd, config.keyIntensity);
  key.position.set(4.5, 6.5, 3.5);
  key.castShadow = interactive;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 24;
  key.shadow.radius = 4;
  const fill = new THREE.DirectionalLight(0xe8f0ff, config.fillIntensity);
  fill.position.set(-4, 3.5, -2);
  const rim = new THREE.DirectionalLight(0xffe6b8, 0.22);
  rim.position.set(0.5, 2.5, -5);
  scene.add(ambient, key, fill, rim);

  const modelRoot = new THREE.Group();
  scene.add(modelRoot);
  let fittedScale = config.modelScale;

  const loader = new GLTFLoader();
  let model: THREE.Group | null = null;
  try {
    const gltf = await loader.loadAsync(config.modelPath);
    model = gltf.scene;
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = interactive;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((m) => {
        if ('envMapIntensity' in m) (m as THREE.MeshStandardMaterial).envMapIntensity = 0.85;
      });
    });
    modelRoot.add(model);

    /* Frame the loaded GLB so any production model lands correctly. */
    const box = new THREE.Box3().setFromObject(modelRoot);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    fittedScale = (6.5 / maxDim) * config.modelScale;
    modelRoot.scale.setScalar(fittedScale);
    modelRoot.position.copy(center).multiplyScalar(-fittedScale);
    modelRoot.position.y += size.y * fittedScale * 0.02;
  } catch {
    showFallback();
    renderer.dispose();
    return { destroy() {} };
  }

  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2(2, 2);
  let hovered: RoomHit | null = null;
  let highlighted: THREE.Mesh | null = null;
  let highlightBase: number | null = null;

  const pointer = { x: 0, y: 0, inside: false };
  const smoothed = { x: 0, y: 0, hover: 0 };
  let enterProgress = 0;
  let leaveProgress = 1;
  let mode: 'idle' | 'enter' | 'track' | 'leave' = 'idle';
  let modeStarted = performance.now();
  let raf = 0;
  let destroyed = false;

  const yawLimit = THREE.MathUtils.degToRad(config.maxYawDeg);
  const pitchLimit = THREE.MathUtils.degToRad(config.maxPitchDeg);
  const spherical = new THREE.Spherical();
  const offset = new THREE.Vector3().subVectors(basePos, target);
  spherical.setFromVector3(offset);
  const baseTheta = spherical.theta;
  const basePhi = spherical.phi;
  const baseRadius = spherical.radius;

  function resize() {
    const width = stage.clientWidth;
    const height = stage.clientHeight || 420;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  }

  function clearHighlight() {
    if (highlighted && highlightBase != null) {
      const mat = highlighted.material as THREE.MeshStandardMaterial;
      if (mat && 'emissiveIntensity' in mat) mat.emissiveIntensity = highlightBase;
    }
    highlighted = null;
    highlightBase = null;
    if (labelEl) {
      labelEl.hidden = true;
      labelEl.textContent = '';
    }
  }

  function setHighlight(mesh: THREE.Mesh | null, label: string | null) {
    if (!config.enableLabels || !interactive) return;
    if (!mesh || !label) {
      clearHighlight();
      return;
    }
    if (highlighted === mesh) {
      if (labelEl) {
        labelEl.hidden = false;
        labelEl.textContent = label;
      }
      return;
    }
    clearHighlight();
    highlighted = mesh;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (mat && 'emissive' in mat) {
      highlightBase = mat.emissiveIntensity ?? 0;
      if (mat.emissive.getHex() === 0) mat.emissive.setHex(0x3a2f16);
      mat.emissiveIntensity = Math.min((highlightBase || 0) + 0.18, 0.35);
    }
    if (labelEl) {
      labelEl.hidden = false;
      labelEl.textContent = label;
    }
  }

  function onPointerMove(event: PointerEvent) {
    if (!interactive) return;
    const rect = stage.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointer.x = THREE.MathUtils.clamp(nx, -1, 1);
    pointer.y = THREE.MathUtils.clamp(ny, -1, 1);
    pointerNdc.set(pointer.x, -pointer.y);

    if (!pointer.inside) {
      pointer.inside = true;
      mode = 'enter';
      modeStarted = performance.now();
    }
  }

  function onPointerLeave() {
    if (!interactive) return;
    pointer.inside = false;
    pointer.x = 0;
    pointer.y = 0;
    mode = 'leave';
    modeStarted = performance.now();
    clearHighlight();
  }

  function updateCamera(dtBoost: number) {
    const now = performance.now();
    if (mode === 'enter') {
      const t = Math.min(1, (now - modeStarted) / config.enterDurationMs);
      enterProgress = easeOutCubic(t);
      leaveProgress = 1;
      if (t >= 1) mode = 'track';
    } else if (mode === 'leave') {
      const t = Math.min(1, (now - modeStarted) / config.leaveDurationMs);
      leaveProgress = 1 - easeOutCubic(t);
      enterProgress = leaveProgress;
      if (t >= 1) {
        mode = 'idle';
        enterProgress = 0;
      }
    } else if (mode === 'track') {
      enterProgress = 1;
    } else {
      enterProgress = 0;
    }

    const lerp = 1 - Math.pow(1 - config.mouseLerp, dtBoost);
    const aimX = pointer.inside ? pointer.x : 0;
    const aimY = pointer.inside ? pointer.y : 0;
    smoothed.x += (aimX - smoothed.x) * lerp;
    smoothed.y += (aimY - smoothed.y) * lerp;
    smoothed.hover += (enterProgress - smoothed.hover) * lerp;

    const yaw = smoothed.x * yawLimit * (isCoarseOrMobile() ? 0.45 : 1);
    const pitch = -smoothed.y * pitchLimit * (isCoarseOrMobile() ? 0.45 : 1);
    spherical.theta = baseTheta + yaw;
    spherical.phi = THREE.MathUtils.clamp(basePhi + pitch, 0.2, Math.PI - 0.2);
    spherical.radius = baseRadius - smoothed.hover * config.hoverZoom;

    camera.position.setFromSpherical(spherical).add(target);
    camera.lookAt(target);

    const scaleFactor = THREE.MathUtils.lerp(1, config.hoverScale / Math.max(config.modelScale, 0.0001), smoothed.hover);
    modelRoot.scale.setScalar(fittedScale * scaleFactor);
  }

  function updateRaycast() {
    if (!interactive || !pointer.inside || !model || !config.enableLabels) return;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObject(model, true);
    if (!hits.length) {
      setHighlight(null, null);
      hovered = null;
      return;
    }
    const hit = hits[0];
    const label = resolveRoomLabel(hit.object);
    if (!label) {
      setHighlight(null, null);
      hovered = null;
      return;
    }
    hovered = { label, object: hit.object };
    setHighlight(hit.object as THREE.Mesh, label);
  }

  let last = performance.now();
  function tick(now: number) {
    if (destroyed) return;
    raf = requestAnimationFrame(tick);
    if (document.hidden) return;
    const dt = Math.min(2.5, (now - last) / 16.67);
    last = now;
    updateCamera(dt);
    if (interactive) updateRaycast();
    renderer.render(scene, camera);
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(stage);
  resize();

  stage.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
  raf = requestAnimationFrame(tick);
  canvas.hidden = false;
  if (fallback) fallback.hidden = true;

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      clearHighlight();
      if (model) disposeObject(model);
      disposeObject(modelRoot);
      renderer.dispose();
    },
  };
}
