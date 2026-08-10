/**
 * Concept 08 — Gallery Reveal (Materiality Variant 4)
 * GSAP Flip · pedestal cubes → wall installation
 */
(function () {
  'use strict';
  if (typeof gsap === 'undefined' || !BrandMark) return;

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = PreloaderUtils;
  var preloader = document.querySelector('[data-pl-preloader]');
  var gallery = document.querySelector('[data-pl-gallery]');
  var wall = document.querySelector('[data-pl-wall]');
  var cubes = gsap.utils.toArray('[data-pl-cube]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var status = document.querySelector('[data-pl-status]');
  var bar = document.querySelector('[data-pl-progress-fill]');
  var skip = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'gr',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
  });
  gsap.set(lockup.querySelector('[data-brand-fill]'), { opacity: 1 });

  gsap.registerPlugin(Flip, CustomEase);
  CustomEase.create('grEase', 'M0,0 C0.16,0.06 0.2,1 1,1');

  var exited = false;

  function setP(p, msg) {
    gsap.set(bar, { width: p + '%' });
    if (status) status.textContent = msg;
  }

  function exit() {
    if (exited) return;
    exited = true;
    U.exitPreloader(preloader);
    if (skip) skip.hidden = true;
  }

  function settle() {
    gsap.set(gallery, { autoAlpha: 0 });
    gsap.set(wall, { opacity: 1, pointerEvents: 'auto' });
    gsap.set(lockup, { opacity: 1, scale: 1 });
    preloader.hidden = true;
    document.body.classList.remove('is-preloading');
  }

  function play() {
    gsap.set(wall, { opacity: 0 });
    gsap.set(lockup, { autoAlpha: 0, scale: 0.88 });
    gsap.set(cubes, { autoAlpha: 0, y: 28 });
    setP(15, 'Curation area… 15%');

    var tl = gsap.timeline({ defaults: { ease: 'grEase' } });

    tl.to(cubes, {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: 'power2.out',
    })
      .to({}, { onComplete: function () { setP(50, 'Material selection… 50%'); } })
      .to(cubes, {
        y: -40,
        scale: 1.15,
        duration: 0.5,
        stagger: 0.06,
        yoyo: true,
        repeat: 1,
      })
      .to({}, { onComplete: function () { setP(90, 'Assembled form… 90%'); } })
      .to(cubes, {
        scale: 0,
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power2.in',
      })
      .to(gallery, { autoAlpha: 0, duration: 0.35 }, '-=0.2')
      .to(wall, { opacity: 1, duration: 0.8 }, '-=0.25')
      .to(lockup, { autoAlpha: 1, scale: 1, duration: 0.75 }, '-=0.5')
      .to({}, { onComplete: function () { setP(100, 'Gallery installation · 100%'); } })
      .to({}, { duration: 0.5, onComplete: function () { U.waitForReady(1000).then(exit); } });
  }

  if (reduce) { settle(); return; }
  play();
  if (skip) skip.addEventListener('click', exit);
})();
