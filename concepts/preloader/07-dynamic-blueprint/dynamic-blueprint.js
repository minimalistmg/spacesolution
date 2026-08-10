/**
 * Concept 07 — Dynamic Blueprint Reveal (board Concept 7)
 * DrawSVG · mask convergence · concrete reveal
 */
(function () {
  'use strict';
  if (typeof gsap === 'undefined' || !BrandMark) return;

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = PreloaderUtils;
  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var masks = gsap.utils.toArray('[data-pl-mask]');
  var concrete = document.querySelector('[data-pl-concrete]');
  var status = document.querySelector('[data-pl-status]');
  var bar = document.querySelector('[data-pl-progress-fill]');
  var skip = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'db',
    iconSrc: '../../../brand/icon-source.png',
  });
  var strokeUp = lockup.querySelector('[data-brand-stroke-up]');
  var strokeLo = lockup.querySelector('[data-brand-stroke-lo]');
  var fill = lockup.querySelector('[data-brand-fill]');
  var spaceEl = lockup.querySelector('[data-brand-space]');
  var solutionEl = lockup.querySelector('[data-brand-solution]');

  gsap.registerPlugin(CustomEase);
  if (U.hasDrawSVG()) gsap.registerPlugin(DrawSVGPlugin);
  CustomEase.create('dbEase', 'M0,0 C0.16,0.08 0.2,1 1,1');

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
    gsap.set(fill, { opacity: 1 });
    gsap.set([strokeUp, strokeLo], { autoAlpha: 0 });
    gsap.set([spaceEl, solutionEl], { autoAlpha: 1 });
    gsap.set(masks, { scale: 0, autoAlpha: 0 });
    gsap.set(concrete, { opacity: 1 });
    host.classList.add('is-revealed');
    preloader.hidden = true;
    document.body.classList.remove('is-preloading');
  }

  function play() {
    U.setDrawStart(strokeUp);
    U.setDrawStart(strokeLo);
    gsap.set(fill, { opacity: 0 });
    gsap.set([spaceEl, solutionEl], { autoAlpha: 0, y: 10 });
    gsap.set(masks, { scale: 1, autoAlpha: 1 });
    gsap.set(concrete, { opacity: 0 });
    setP(0, 'Blueprinting… 0%');

    var tl = gsap.timeline({ defaults: { ease: 'dbEase' } });

    tl.to(strokeUp, U.drawTo(strokeUp, 0.95))
      .to({}, { onComplete: function () { setP(22, 'Refined trace… 22%'); } })
      .to(strokeLo, U.drawTo(strokeLo, 1.15), '-=0.4')
      .to({}, { onComplete: function () { setP(45, 'Mask convergence… 45%'); } })
      .to(masks, {
        scale: 0,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.06,
        ease: 'power3.inOut',
      })
      .to(fill, { opacity: 1, duration: 0.5 }, '-=0.55')
      .to([strokeUp, strokeLo], { autoAlpha: 0, duration: 0.25 }, '-=0.35')
      .to([spaceEl, solutionEl], { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 }, '-=0.2')
      .to(concrete, { opacity: 1, duration: 0.9 }, '-=0.35')
      .call(function () { host.classList.add('is-revealed'); })
      .to({}, { onComplete: function () { setP(100, 'Brand reveal · 100%'); } })
      .to({}, { duration: 0.4, onComplete: function () { U.waitForReady(1100).then(exit); } });
  }

  if (reduce) { settle(); return; }
  play();
  if (skip) skip.addEventListener('click', exit);
})();
