/**
 * Concept 14 — Aperture Iris
 * Six gold-edged blades rotate open from the centre · lockup scale settle
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var ring = document.querySelector('[data-pl-ring]');
  var blades = gsap.utils.toArray('[data-pl-blade]');
  var leaves = gsap.utils.toArray('[data-pl-leaf]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'ai',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
  });

  var iconWrap = lockup.querySelector('.brand-icon-wrap');
  var fill = lockup.querySelector('[data-brand-fill]');
  var wordmark = lockup.querySelector('.brand-wordmark');

  gsap.registerPlugin(CustomEase);
  CustomEase.create('aiIris', 'M0,0 C0.3,0.02 0.14,1 1,1');

  /* Blade i owns the 90° quadrant starting at i*60° — the 30° overlap with its
     neighbour is what keeps the closed iris gapless. Opening slides each leaf
     along its own +Y (outward, square to the cutting edge). */
  var BASE_STEP = 60;
  var OPEN_SPIN = 46;
  var OPEN_SLIDE = 85; /* % of the 90vmax leaf ≈ 76vmax clear of centre */

  var tl = null;
  var exited = false;

  function exit() {
    if (exited) return;
    exited = true;
    if (tl) tl.kill();
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function settle() {
    gsap.set(fill, { opacity: 1 });
    gsap.set(iconWrap, { autoAlpha: 1 });
    gsap.set(wordmark, { autoAlpha: 1, y: 0 });
    gsap.set(lockup, { scale: 1, autoAlpha: 1 });
    gsap.set(ring, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1, autoAlpha: 0.9 });
    gsap.set(leaves, { yPercent: OPEN_SLIDE, autoAlpha: 0 });
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    gsap.set(fill, { opacity: 1 });
    gsap.set(iconWrap, { autoAlpha: 1 });
    gsap.set(wordmark, { autoAlpha: 0, y: 12 });
    gsap.set(lockup, { scale: 0.94, autoAlpha: 1, transformOrigin: '50% 50%' });
    gsap.set(ring, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.86, autoAlpha: 0 });
    gsap.set(blades, {
      transformOrigin: '0 0',
      rotation: function (i) {
        return i * BASE_STEP;
      },
    });
    gsap.set(leaves, { transformOrigin: '0 0', yPercent: 0, autoAlpha: 1 });

    tl = gsap.timeline({
      onComplete: function () {
        U.waitForReady(450).then(exit);
      },
    });

    /* I — Aperture opens: blades twist while their leaves clear the centre
           (0.95s + 0.05s stagger ×5 → ends at 1.20s) */
    tl.to(
      blades,
      {
        rotation: function (i) {
          return i * BASE_STEP + OPEN_SPIN;
        },
        duration: 0.95,
        stagger: 0.05,
        ease: 'aiIris',
      },
      0
    )
      .to(
        leaves,
        {
          yPercent: OPEN_SLIDE,
          duration: 0.95,
          stagger: 0.05,
          ease: 'aiIris',
        },
        0
      )

      /* II — Lens ring blooms behind the mark (0.85s → 1.40s) */
      .to(ring, { autoAlpha: 0.9, scale: 1, duration: 0.55, ease: 'power2.out' }, 0.85)

      /* III — Lockup settles 0.94 → 1, wordmark lifts in (0.95s → 1.45s) */
      .to(lockup, { scale: 1, duration: 0.5, ease: 'power2.out' }, 0.95)
      .to(wordmark, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out' }, 0.98)

      /* IV — Hold (1.45s → 1.75s), then ready-gate + fade → ~2.85s total */
      .to({}, { duration: 0.3 }, 1.45);
  }

  if (reduce) {
    settle();
    return;
  }

  play();
  if (skipBtn) skipBtn.addEventListener('click', exit);
})();
