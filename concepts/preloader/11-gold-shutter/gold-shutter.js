/**
 * Concept 11 — Gold Shutter
 * Five gold bars stagger-open upward · icon fade · wordmark slide
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var shutter = document.querySelector('[data-pl-shutter]');
  var blades = gsap.utils.toArray('.pl-shutter__blade');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'gs',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
  });

  var iconWrap = lockup.querySelector('.brand-icon-wrap');
  var fill = lockup.querySelector('[data-brand-fill]');
  var wordmark = lockup.querySelector('.brand-wordmark');

  gsap.registerPlugin(CustomEase);
  CustomEase.create('gsLux', 'M0,0 C0.12,0.88 0.22,1 1,1');
  CustomEase.create('gsLift', 'M0,0 C0.18,0.72 0.08,1 1,1');

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
    gsap.set(iconWrap, { autoAlpha: 1, y: 0 });
    gsap.set(wordmark, { autoAlpha: 1, y: 0 });
    gsap.set(blades, { scaleY: 0, autoAlpha: 0 });
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    gsap.set(fill, { opacity: 1 });
    gsap.set(iconWrap, { autoAlpha: 0.35, y: 0 });
    gsap.set(wordmark, { autoAlpha: 0, y: 28 });
    gsap.set(blades, { scaleY: 1, autoAlpha: 1, transformOrigin: '50% 100%' });

    tl = gsap.timeline({
      defaults: { ease: 'gsLux' },
      onComplete: function () {
        U.waitForReady(400).then(exit);
      },
    });

    /* I — Icon fades in through shutter gaps (~0.7s) */
    tl.to(iconWrap, { autoAlpha: 1, duration: 0.7, ease: 'power2.out' })

      /* II — Shutters lift upward, staggered (~1.15s) */
      .to(
        blades,
        {
          scaleY: 0,
          duration: 0.62,
          stagger: 0.11,
          ease: 'gsLift',
        },
        '-=0.25'
      )

      /* III — Wordmark slides up (~0.65s) */
      .to(
        wordmark,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
        },
        '-=0.45'
      )

      /* IV — Hold full lockup (~0.9s) → total ~3.5s incl. exit */
      .to({}, { duration: 0.9 });
  }

  if (reduce) {
    settle();
    return;
  }

  play();
  if (skipBtn) skipBtn.addEventListener('click', exit);
})();
