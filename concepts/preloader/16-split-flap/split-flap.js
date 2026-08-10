/**
 * Concept 16 — Split-Flap Mosaic
 * A departure-board grid flaps forward in a diagonal wave, uncovering the lockup.
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var mosaic = document.querySelector('[data-pl-mosaic]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var narrow = window.innerWidth < 760;
  var COLS = narrow ? 6 : 10;
  var ROWS = narrow ? 9 : 6;
  var GOLD_RATIO = 0.12;

  var lockup = BrandMark.mountLockup(host, {
    uid: 'sf',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
  });

  var fill = lockup.querySelector('[data-brand-fill]');
  var wire = lockup.querySelector('[data-brand-wire]');

  gsap.registerPlugin(CustomEase);
  /* Mechanical flap — hangs, then snaps over the hinge */
  CustomEase.create('sfFlap', 'M0,0 C0.3,0 0.1,1 1,1');
  CustomEase.create('sfSettle', 'M0,0 C0.14,0.86 0.18,1 1,1');

  var tiles = [];
  var tl = null;
  var exited = false;

  function buildTiles() {
    var frag = document.createDocumentFragment();
    var total = ROWS * COLS;
    var built = [];

    for (var i = 0; i < total; i++) {
      var tile = document.createElement('div');
      tile.className = 'pl-tile';
      if (Math.random() < GOLD_RATIO) tile.className += ' pl-tile--gold';
      frag.appendChild(tile);
      built.push(tile);
    }

    mosaic.style.setProperty('--pl-cols', String(COLS));
    mosaic.style.setProperty('--pl-rows', String(ROWS));
    mosaic.appendChild(frag);
    return built;
  }

  function exit() {
    if (exited) return;
    exited = true;
    if (tl) tl.kill();
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function settle() {
    gsap.set(fill, { opacity: 1 });
    gsap.set(wire, { opacity: 0 });
    gsap.set(lockup, { scale: 1, autoAlpha: 1 });
    if (tiles.length) gsap.set(tiles, { autoAlpha: 0 });
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    gsap.set(fill, { opacity: 1 });
    gsap.set(wire, { opacity: 0 });
    gsap.set(lockup, { scale: 0.962, transformOrigin: '50% 50%' });
    gsap.set(tiles, {
      autoAlpha: 1,
      rotationX: 0,
      transformOrigin: '50% 0%',
    });

    tl = gsap.timeline({
      onComplete: function () {
        U.waitForReady(500).then(exit);
      },
    });

    /* I — Diagonal flap wave from the top-left corner (0 → 1.36s) */
    tl.to(tiles, {
      rotationX: -90,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'sfFlap',
      stagger: { amount: 0.86, from: 'start', grid: [ROWS, COLS] },
    })

      /* II — Lockup scale settle as the last flaps clear (1.02 → 1.44s) */
      .to(lockup, { scale: 1, duration: 0.42, ease: 'sfSettle' }, '-=0.34')

      /* III — Short hold before handing off to the exit fade (→ 1.66s) */
      .to({}, { duration: 0.22 });
  }

  if (reduce) {
    settle();
    return;
  }

  tiles = buildTiles();
  play();
  if (skipBtn) skipBtn.addEventListener('click', exit);
})();
