/**
 * Concept demo — cinematic Three.js interior hero.
 * Mirror of src/lib/interactiveInterior.ts for standalone HTML.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const CONFIG = {
  modelPath: '../../../public/models/interior/apartment.glb',
  fallbackImage: '../../../src/assets/images/open-house/open-house-1.png',
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

const ROOM_LABELS = {
  LivingRoom: 'Living Room',
  Kitchen: 'Kitchen',
  Dining: 'Dining',
  Bedroom: 'Bedroom',
  Balcony: 'Balcony',
  Decor: 'Details',
};

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function resolveRoomLabel(object) {
  let current = object;
  while (current) {
    if (ROOM_LABELS[current.name]) return ROOM_LABELS[current.name];
    current = current.parent;
  }
  return null;
}

async function mount(root) {
  const stage = root.querySelector('[data-ii-stage]');
  const canvas = root.querySelector('[data-ii-canvas]');
  const fallback = root.querySelector('[data-ii-fallback]');
  const labelEl = root.querySelector('[data-ii-label]');
  if (!stage || !canvas) return;

  const showFallback = () => {
    root.setAttribute('data-ii-mode', 'fallback');
    if (fallback) fallback.hidden = false;
    canvas.hidden = true;
  };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const interactive =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;

  if (!hasWebGL() || reduce) {
    showFallback();
    return;
  }

  root.setAttribute('data-ii-mode', interactive ? 'interactive' : 'static');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: interactive ? 'high-performance' : 'low-power',
    });
    renderer.setClearColor(0x000000, 0);
  } catch {
    showFallback();
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = interactive;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CONFIG.fov, 1, 0.1, 100);
  const basePos = new THREE.Vector3(...CONFIG.cameraPosition);
  const target = new THREE.Vector3(...CONFIG.cameraTarget);
  camera.position.copy(basePos);
  camera.lookAt(target);

  const ambient = new THREE.AmbientLight(0xf4eee4, CONFIG.ambientIntensity);
  const key = new THREE.DirectionalLight(0xfff2dd, CONFIG.keyIntensity);
  key.position.set(4.5, 6.5, 3.5);
  key.castShadow = interactive;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 4;
  const fill = new THREE.DirectionalLight(0xe8f0ff, CONFIG.fillIntensity);
  fill.position.set(-4, 3.5, -2);
  const rim = new THREE.DirectionalLight(0xffe6b8, 0.22);
  rim.position.set(0.5, 2.5, -5);
  scene.add(ambient, key, fill, rim);

  const modelRoot = new THREE.Group();
  scene.add(modelRoot);
  let fittedScale = CONFIG.modelScale;

  const loader = new GLTFLoader();
  let model = null;
  try {
    const gltf = await loader.loadAsync(CONFIG.modelPath);
    model = gltf.scene;
    model.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = interactive;
      obj.receiveShadow = true;
    });
    modelRoot.add(model);

    /* Frame the loaded GLB so any production model lands correctly. */
    const box = new THREE.Box3().setFromObject(modelRoot);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    fittedScale = (6.5 / maxDim) * CONFIG.modelScale;
    modelRoot.scale.setScalar(fittedScale);
    modelRoot.position.copy(center).multiplyScalar(-fittedScale);
    modelRoot.position.y += size.y * fittedScale * 0.02;
  } catch (err) {
    console.error(err);
    showFallback();
    renderer.dispose();
    return;
  }

  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2(2, 2);
  let highlighted = null;
  let highlightBase = null;

  const pointer = { x: 0, y: 0, inside: false };
  const smoothed = { x: 0, y: 0, hover: 0 };
  let enterProgress = 0;
  let mode = 'idle';
  let modeStarted = performance.now();
  let raf = 0;

  const yawLimit = THREE.MathUtils.degToRad(CONFIG.maxYawDeg);
  const pitchLimit = THREE.MathUtils.degToRad(CONFIG.maxPitchDeg);
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
      const mat = highlighted.material;
      if (mat && 'emissiveIntensity' in mat) mat.emissiveIntensity = highlightBase;
    }
    highlighted = null;
    highlightBase = null;
    if (labelEl) {
      labelEl.hidden = true;
      labelEl.textContent = '';
    }
  }

  function setHighlight(mesh, label) {
    if (!CONFIG.enableLabels || !interactive) return;
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
    const mat = mesh.material;
    if (mat && 'emissive' in mat) {
      highlightBase = mat.emissiveIntensity || 0;
      if (mat.emissive.getHex() === 0) mat.emissive.setHex(0x3a2f16);
      mat.emissiveIntensity = Math.min(highlightBase + 0.18, 0.35);
    }
    if (labelEl) {
      labelEl.hidden = false;
      labelEl.textContent = label;
    }
  }

  function onPointerMove(event) {
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

  function updateCamera(dtBoost) {
    const now = performance.now();
    if (mode === 'enter') {
      const t = Math.min(1, (now - modeStarted) / CONFIG.enterDurationMs);
      enterProgress = easeOutCubic(t);
      if (t >= 1) mode = 'track';
    } else if (mode === 'leave') {
      const t = Math.min(1, (now - modeStarted) / CONFIG.leaveDurationMs);
      enterProgress = 1 - easeOutCubic(t);
      if (t >= 1) {
        mode = 'idle';
        enterProgress = 0;
      }
    } else if (mode === 'track') {
      enterProgress = 1;
    } else {
      enterProgress = 0;
    }

    const lerp = 1 - Math.pow(1 - CONFIG.mouseLerp, dtBoost);
    const aimX = pointer.inside ? pointer.x : 0;
    const aimY = pointer.inside ? pointer.y : 0;
    smoothed.x += (aimX - smoothed.x) * lerp;
    smoothed.y += (aimY - smoothed.y) * lerp;
    smoothed.hover += (enterProgress - smoothed.hover) * lerp;

    spherical.theta = baseTheta + smoothed.x * yawLimit;
    spherical.phi = THREE.MathUtils.clamp(basePhi - smoothed.y * pitchLimit, 0.2, Math.PI - 0.2);
    spherical.radius = baseRadius - smoothed.hover * CONFIG.hoverZoom;

    camera.position.setFromSpherical(spherical).add(target);
    camera.lookAt(target);
    const scaleFactor = THREE.MathUtils.lerp(
      1,
      CONFIG.hoverScale / Math.max(CONFIG.modelScale, 0.0001),
      smoothed.hover
    );
    modelRoot.scale.setScalar(fittedScale * scaleFactor);
  }

  function updateRaycast() {
    if (!interactive || !pointer.inside || !model || !CONFIG.enableLabels) return;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObject(model, true);
    if (!hits.length) {
      setHighlight(null, null);
      return;
    }
    const label = resolveRoomLabel(hits[0].object);
    setHighlight(label ? hits[0].object : null, label);
  }

  let last = performance.now();
  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (document.hidden) return;
    const dt = Math.min(2.5, (now - last) / 16.67);
    last = now;
    updateCamera(dt);
    if (interactive) updateRaycast();
    renderer.render(scene, camera);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();
  stage.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
  raf = requestAnimationFrame(tick);
  canvas.hidden = false;
  if (fallback) fallback.hidden = true;
}

const root = document.querySelector('[data-interactive-interior]');
if (root) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || root.dataset.iiMounted === 'true') return;
        root.dataset.iiMounted = 'true';
        io.disconnect();
        void mount(root);
      });
    },
    { rootMargin: '120px 0px', threshold: 0.05 }
  );
  io.observe(root);
}
