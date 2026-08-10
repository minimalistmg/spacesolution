/**
 * Concept 18 — WebGL Dissolve
 * A three.js fragment shader carries the portfolio through gold-edged noise
 * dissolves, then dissolves the whole layer away to reveal the site.
 * Total ≈ 3.05s. Falls back to a DOM-only reveal without WebGL.
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SHOTS = [
    { src: '../../../src/assets/images/hero/kitchen-2.jpeg', label: 'Modular Kitchen · Kuvempunagar' },
    { src: '../../../src/assets/images/hero/bedroom.jpg', label: 'Master Bedroom · Vijayanagar' },
    { src: '../../../src/assets/images/projects/home-interior-3.jpg', label: 'Living & Dining · Jayalakshmipuram' },
  ];

  var preloader = document.querySelector('[data-pl-preloader]');
  var canvas = document.querySelector('[data-pl-canvas]');
  var uiTop = document.querySelector('.pl-ui__top');
  var uiFoot = document.querySelector('.pl-ui__foot');
  var track = document.querySelector('[data-pl-track]');
  var trackFill = document.querySelector('[data-pl-track-fill]');
  var statusEl = document.querySelector('[data-pl-status]');
  var pctEl = document.querySelector('[data-pl-pct]');
  var lockupHost = document.querySelector('[data-pl-lockup-host]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(lockupHost, {
    uid: 'wd',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
    dark: true,
  });
  var fill = lockup.querySelector('[data-brand-fill]');
  var solutionEl = lockup.querySelector('[data-brand-solution]');

  gsap.registerPlugin(CustomEase);
  CustomEase.create('wdDissolve', 'M0,0 C0.45,0 0.15,1 1,1');

  var tl = null;
  var exited = false;
  var rafId = 0;
  var renderer = null;
  var uniforms = null;

  var VERT = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = vec4(position.xy, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform sampler2D uTexA;',
    'uniform sampler2D uTexB;',
    'uniform vec2 uResA;',
    'uniform vec2 uResB;',
    'uniform vec2 uRes;',
    'uniform float uMix;',
    'uniform float uFade;',
    'uniform float uTime;',
    'uniform vec3 uGold;',

    /* Fit an image over the viewport without distorting it. */
    'vec2 coverUv(vec2 uv, vec2 res, vec2 img) {',
    '  if (img.x < 1.0 || img.y < 1.0) return uv;',
    '  vec2 s = res / img;',
    '  float sc = max(s.x, s.y);',
    '  vec2 size = img * sc;',
    '  vec2 off = (res - size) * 0.5;',
    '  return (uv * res - off) / size;',
    '}',

    'float hash(vec2 p) {',
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);',
    '}',

    'float vnoise(vec2 p) {',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0));',
    '  float d = hash(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);',
    '}',

    'float fbm(vec2 p) {',
    '  float v = 0.0;',
    '  float a = 0.5;',
    '  for (int i = 0; i < 5; i++) {',
    '    v += a * vnoise(p);',
    '    p *= 2.03;',
    '    a *= 0.5;',
    '  }',
    '  return v;',
    '}',

    'void main() {',
    '  vec2 uv = vUv;',
    '  vec3 a = texture2D(uTexA, coverUv(uv, uRes, uResA)).rgb;',
    '  vec3 b = texture2D(uTexB, coverUv(uv, uRes, uResB)).rgb;',

    /* Noise field biased left-to-right so the dissolve also sweeps. */
    '  float n = fbm(uv * 3.2 + uTime * 0.03);',
    '  float field = n * 0.66 + uv.x * 0.34;',
    '  float w = 0.10;',
    '  float m = smoothstep(uMix - w, uMix + w, field);',
    '  vec3 col = mix(b, a, m);',

    /* Molten gold rim riding the dissolve boundary. */
    '  float band = 1.0 - clamp(abs(field - uMix) / w, 0.0, 1.0);',
    '  col += uGold * pow(band, 2.2) * 0.6;',

    '  col = mix(col, col * vec3(1.05, 0.98, 0.89), 0.55);',
    '  float vig = smoothstep(1.15, 0.30, length(uv - 0.5));',
    '  col *= mix(0.66, 1.0, vig);',
    '  col += (hash(uv * uRes + uTime) - 0.5) * 0.035;',

    /* Final pass: dissolve the entire layer to transparent. */
    '  float fn = fbm(uv * 4.4 + 17.0);',
    '  float ffield = fn * 0.70 + (1.0 - uv.y) * 0.30;',
    '  float fw = 0.12;',
    '  float alpha = 1.0 - smoothstep(uFade - fw, uFade + fw, ffield);',
    '  float fband = 1.0 - clamp(abs(ffield - uFade) / fw, 0.0, 1.0);',
    '  col += uGold * pow(fband, 2.0) * 0.75 * step(0.0001, uFade);',

    '  gl_FragColor = vec4(col, alpha);',
    '}',
  ].join('\n');

  function setPct(v) {
    if (pctEl) pctEl.textContent = String(Math.round(v)).padStart(3, '0');
  }

  function finish() {
    if (exited) return;
    exited = true;
    cancelAnimationFrame(rafId);
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
    if (skipBtn) skipBtn.hidden = true;
    if (renderer) renderer.dispose();
  }

  function skip() {
    if (exited) return;
    if (tl) tl.kill();
    gsap.to(preloader, {
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: finish,
    });
  }

  function settle() {
    gsap.set(lockupHost, { opacity: 1 });
    gsap.set(fill, { opacity: 1 });
    gsap.set(solutionEl, { letterSpacing: '0.32em' });
    setPct(100);
    finish();
  }

  function hasWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  /** DOM-only sequence used when WebGL or three.js is unavailable. */
  function playFallback() {
    preloader.classList.add('is-fallback');
    gsap.set(lockupHost, { opacity: 0, y: 14, scale: 0.96 });
    gsap.set(solutionEl, { letterSpacing: '0.14em' });
    var count = { v: 0 };

    tl = gsap.timeline({ onComplete: finish });
    tl.to([uiTop, uiFoot], { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
      .to(trackFill, { width: '100%', duration: 1.2, ease: 'power1.inOut' }, 0)
      .to(count, {
        v: 100,
        duration: 1.2,
        ease: 'power1.inOut',
        onUpdate: function () { setPct(count.v); },
      }, 0)
      .to([uiTop, uiFoot], { opacity: 0, duration: 0.3 }, 1.25)
      .to(track, { scaleX: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 1.25)
      .to(lockupHost, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, 1.35)
      .to(solutionEl, { letterSpacing: '0.32em', duration: 0.6, ease: 'power3.out' }, 1.45)
      .to(preloader, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 2.1);
  }

  function initGL(textures) {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    function dims(t) {
      var img = t.image;
      return new THREE.Vector2(img ? img.width : 1, img ? img.height : 1);
    }

    uniforms = {
      uTexA: { value: textures[0] },
      uTexB: { value: textures[1] },
      uResA: { value: dims(textures[0]) },
      uResB: { value: dims(textures[1]) },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMix: { value: -0.15 },
      uFade: { value: 0.0 },
      uTime: { value: 0.0 },
      uGold: { value: new THREE.Color(0.937, 0.784, 0.141) },
    };

    var mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })
    );
    scene.add(mesh);

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resize);

    var start = performance.now();
    function loop() {
      uniforms.uTime.value = (performance.now() - start) / 1000;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(loop);
    }
    loop();

    return function swap(from, to) {
      uniforms.uTexA.value = textures[from];
      uniforms.uTexB.value = textures[to];
      uniforms.uResA.value.copy(dims(textures[from]));
      uniforms.uResB.value.copy(dims(textures[to]));
    };
  }

  function play(textures) {
    var swap = initGL(textures);

    gsap.set(lockupHost, { opacity: 0, y: 14, scale: 0.96 });
    gsap.set(fill, { opacity: 1 });
    gsap.set(solutionEl, { letterSpacing: '0.14em' });
    setPct(0);

    var count = { v: 0 };
    tl = gsap.timeline({ onComplete: finish });

    /* I — UI settles in while the first dissolve runs */
    tl.to([uiTop, uiFoot], { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
      .to(trackFill, { width: '100%', duration: 1.7, ease: 'power1.inOut' }, 0)
      .to(
        count,
        {
          v: 100,
          duration: 1.7,
          ease: 'power1.inOut',
          onUpdate: function () { setPct(count.v); },
        },
        0
      )

      /* II — Portfolio dissolve 1 → 2 */
      .to(uniforms.uMix, { value: 1.15, duration: 0.85, ease: 'wdDissolve' }, 0.15)
      .call(function () {
        swap(1, 2);
        uniforms.uMix.value = -0.15;
        if (statusEl) statusEl.textContent = SHOTS[1].label;
      }, null, 1.02)

      /* III — Portfolio dissolve 2 → 3 */
      .to(uniforms.uMix, { value: 1.15, duration: 0.85, ease: 'wdDissolve' }, 1.05)
      .call(function () {
        if (statusEl) statusEl.textContent = SHOTS[2].label;
      }, null, 1.55)

      /* IV — UI clears, the hairline collapses into the mark */
      .to([uiTop, uiFoot], { opacity: 0, duration: 0.32, ease: 'power2.inOut' }, 1.72)
      .to(track, { scaleX: 0, opacity: 0, duration: 0.45, ease: 'power3.inOut' }, 1.72)
      .to(
        lockupHost,
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' },
        1.85
      )
      .to(solutionEl, { letterSpacing: '0.32em', duration: 0.7, ease: 'power3.out' }, 1.98)

      /* V — The whole shader layer dissolves off in gold flecks */
      .to(uniforms.uFade, { value: 1.25, duration: 0.62, ease: 'power2.inOut' }, 2.45)
      .to(lockupHost, { opacity: 0, scale: 1.04, duration: 0.4, ease: 'power2.in' }, 2.68);
  }

  function loadTextures() {
    var loader = new THREE.TextureLoader();
    return Promise.all(
      SHOTS.map(function (s) {
        return new Promise(function (resolve) {
          loader.load(
            s.src,
            function (t) {
              t.colorSpace = THREE.SRGBColorSpace;
              t.minFilter = THREE.LinearFilter;
              t.generateMipmaps = false;
              resolve(t);
            },
            undefined,
            function () { resolve(null); }
          );
        });
      })
    );
  }

  if (reduce) {
    settle();
    return;
  }

  if (typeof THREE === 'undefined' || !hasWebGL()) {
    playFallback();
  } else {
    loadTextures().then(function (textures) {
      if (textures.some(function (t) { return !t; })) {
        playFallback();
        return;
      }
      play(textures);
    });
  }

  if (skipBtn) skipBtn.addEventListener('click', skip);
})();
