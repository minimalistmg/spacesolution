/**
 * Concept 02 — Spatial Flow
 * Three.js particles · GSAP progress ring
 */
(function () {
  'use strict';

  if (typeof THREE === 'undefined' || typeof gsap === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;
  var Brand = window.BrandMark;

  var preloader = document.querySelector('[data-pl-preloader]');
  var canvas = document.querySelector('[data-pl-canvas]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var ringFill = document.querySelector('[data-pl-ring-fill]');
  var ringPct = document.querySelector('[data-pl-ring-pct]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = Brand.mountLockup(host, {
    uid: 'sf',
    iconSrc: '../../../brand/icon-source.png',
    dark: true,
  });
  var fill = lockup.querySelector('[data-brand-fill]');
  gsap.set(fill, { opacity: 1 });

  var RING_LEN = 327;
  var progress = { value: 0 };
  var exited = false;
  var raf = 0;

  var renderer, scene, camera, points, geometry, positions, targets, velocities;
  var count = reduce ? 400 : 1800;

  function sampleTargets() {
    var up = Brand.samplePath(Brand.paths.strokeUp, Math.floor(count * 0.35));
    var lo = Brand.samplePath(Brand.paths.strokeLo, Math.floor(count * 0.65));
    var all = up.concat(lo);
    while (all.length < count) all.push(up[all.length % up.length]);
    return all.slice(0, count);
  }

  function initThree() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, w / h, 1, 3000);
    camera.position.z = 900;

    targets = sampleTargets();
    geometry = new THREE.BufferGeometry();
    positions = new Float32Array(count * 3);
    velocities = [];

    for (var i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * w * 1.4 - w * 0.35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * h * 0.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      velocities.push({
        x: (Math.random() - 0.5) * 0.6,
        y: (Math.random() - 0.5) * 0.6,
        z: (Math.random() - 0.5) * 0.3,
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var material = new THREE.PointsMaterial({
      color: 0xefc824,
      size: reduce ? 2.2 : 1.8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
  }

  function normTargets() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var out = [];
    for (var i = 0; i < targets.length; i++) {
      out.push({
        x: (targets[i].x / 564) * w * 0.28 + w * 0.52,
        y: -(targets[i].y / 630) * h * 0.38 + h * 0.08,
        z: (Math.random() - 0.5) * 40,
      });
    }
    return out;
  }

  function tick() {
    var norm = normTargets();
    var pull = 0.012 + progress.value * 0.045;
    var pos = geometry.attributes.position.array;

    for (var i = 0; i < count; i++) {
      var ix = i * 3;
      var tx = norm[i].x;
      var ty = norm[i].y;
      var tz = norm[i].z;

      if (progress.value < 0.15) {
        pos[ix] += velocities[i].x * 2.2;
        pos[ix + 1] += velocities[i].y * 1.4;
        pos[ix + 2] += velocities[i].z;
        if (pos[ix] > window.innerWidth * 0.45) pos[ix] = -window.innerWidth * 0.4;
      } else {
        pos[ix] += (tx - pos[ix]) * pull;
        pos[ix + 1] += (ty - pos[ix + 1]) * pull;
        pos[ix + 2] += (tz - pos[ix + 2]) * pull;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    points.rotation.z = Math.sin(Date.now() * 0.00025) * 0.04 * progress.value;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  function setProgress(p) {
    progress.value = p / 100;
    var offset = RING_LEN - (RING_LEN * p) / 100;
    gsap.set(ringFill, { strokeDashoffset: offset });
    if (ringPct) ringPct.textContent = Math.round(p) + '%';
  }

  function onResize() {
    if (!renderer) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function exit() {
    if (exited) return;
    exited = true;
    cancelAnimationFrame(raf);
    if (renderer) renderer.dispose();
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function settle() {
    setProgress(100);
    gsap.set(lockup, { autoAlpha: 1, x: 0 });
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    initThree();
    window.addEventListener('resize', onResize);
    tick();

    gsap.set(lockup, { autoAlpha: 0, x: 28 });
    setProgress(0);

    var tl = gsap.timeline({
      onUpdate: function () {
        setProgress(tl.progress() * 100);
      },
    });

    tl.to({}, { duration: 0.8 })
      .to(progress, { value: 0.2, duration: 1.4, ease: 'power1.inOut' }, 0)
      .to({}, { duration: 1.6 })
      .to(progress, { value: 0.55, duration: 1.8, ease: 'power2.inOut' })
      .to(lockup, { autoAlpha: 0.35, x: 12, duration: 0.8 }, '-=1.2')
      .to(progress, { value: 0.85, duration: 1.4, ease: 'power2.inOut' })
      .to(lockup, { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power2.out' }, '-=0.8')
      .to(progress, { value: 1, duration: 0.6 })
      .to({}, {
        duration: 0.35,
        onComplete: function () {
          U.waitForReady(900).then(exit);
        },
      });
  }

  if (reduce) {
    settle();
    return;
  }

  play();
  if (skipBtn) skipBtn.addEventListener('click', exit);
})();
