/**
 * Concept 06 — Interlocking Spatial Planes (board Concept 8)
 */
(function () {
  'use strict';
  if (typeof gsap === 'undefined' || !BrandMark) return;

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = PreloaderUtils;
  var preloader = document.querySelector('[data-pl-preloader]');
  var planes = gsap.utils.toArray('[data-pl-plane]');
  var slab = document.querySelector('[data-pl-slab]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var status = document.querySelector('[data-pl-status]');
  var fill = document.querySelector('[data-pl-progress-fill]');
  var skip = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'ip',
    iconSrc: '../../../brand/icon-source.png',
    dark: true,
  });
  gsap.set(lockup.querySelector('[data-brand-fill]'), { opacity: 1 });

  gsap.registerPlugin(CustomEase);
  CustomEase.create('ipEase', 'M0,0 C0.18,0.04 0.22,1 1,1');

  var exited = false;
  var cx = function () { return window.innerWidth * 0.5; };
  var cy = function () { return window.innerHeight * 0.44; };

  function setP(p, msg) {
    gsap.set(fill, { width: p + '%' });
    if (status) status.textContent = msg;
  }

  function exit() {
    if (exited) return;
    exited = true;
    U.exitPreloader(preloader);
    if (skip) skip.hidden = true;
  }

  function settle() {
    preloader.classList.add('is-dark');
    gsap.set(slab, { opacity: 1 });
    gsap.set(planes, { autoAlpha: 0 });
    gsap.set(lockup, { opacity: 1, scale: 1 });
    setP(100, 'Geometric fusion complete');
    preloader.hidden = true;
    document.body.classList.remove('is-preloading');
  }

  function play() {
    gsap.set(lockup, { autoAlpha: 0, scale: 0.88 });
    gsap.set(slab, { opacity: 0 });
    setP(0, 'Plane scatter… 0%');

    var tl = gsap.timeline({ defaults: { ease: 'ipEase' } });

    tl.to({}, { duration: 0.4 })
      .to(planes, {
        rotationX: gsap.utils.wrap([-18, 22, -12, 16]),
        rotationY: gsap.utils.wrap([24, -20, 14, -28]),
        duration: 0.8,
        stagger: 0.06,
      })
      .to({}, { onComplete: function () { setP(28, 'Convergence… 28%'); } })
      .to(planes, {
        x: function () { return cx() - (this.offsetLeft + this.offsetWidth / 2); },
        y: function () { return cy() - (this.offsetTop + this.offsetHeight / 2); },
        rotationX: 0,
        rotationY: 0,
        scale: 0.35,
        duration: 1.2,
        stagger: 0.05,
      })
      .to({}, { onComplete: function () { setP(62, 'Geometric fusion… 62%'); } })
      .to(planes, {
        scale: 0,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.04,
        ease: 'power2.in',
      })
      .to(slab, { opacity: 1, duration: 0.9 }, '-=0.35')
      .call(function () { preloader.classList.add('is-dark'); })
      .to(lockup, { autoAlpha: 1, scale: 1, duration: 0.75 }, '-=0.5')
      .to({}, { onComplete: function () { setP(100, 'Finished · interlocking planes'); } })
      .to({}, { duration: 0.45, onComplete: function () { U.waitForReady(1000).then(exit); } });
  }

  if (reduce) { settle(); return; }
  play();
  if (skip) skip.addEventListener('click', exit);
})();
