/**
 * Concept 03 — Minimalist Stagger
 * GSAP Timeline · sequential reveal
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var label = document.querySelector('[data-pl-label]');
  var sublabel = document.querySelector('[data-pl-sublabel]');
  var lineFill = document.querySelector('[data-pl-line-fill]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'ms',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
  });

  var iconWrap = lockup.querySelector('.brand-icon-wrap');
  var fill = lockup.querySelector('[data-brand-fill]');
  var spaceEl = lockup.querySelector('[data-brand-space]');
  var solutionEl = lockup.querySelector('[data-brand-solution]');

  gsap.registerPlugin(CustomEase);
  CustomEase.create('msEase', 'M0,0 C0.2,0.9 0.22,1 1,1');

  var exited = false;

  function setLine(p) {
    gsap.set(lineFill, { width: p + '%' });
  }

  function exit() {
    if (exited) return;
    exited = true;
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function settle() {
    gsap.set(fill, { opacity: 1 });
    host.classList.remove('is-mark-only', 'is-mark-text');
    gsap.set(spaceEl, { autoAlpha: 1, y: 0 });
    gsap.set(solutionEl, { autoAlpha: 1, letterSpacing: '0.32em' });
    setLine(100);
    if (label) label.textContent = 'Finished';
    if (sublabel) sublabel.textContent = '';
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    gsap.set(fill, { opacity: 1 });
    host.classList.add('is-mark-only');
    gsap.set(iconWrap, { autoAlpha: 0, scale: 0.92, y: 10 });
    gsap.set(spaceEl, { autoAlpha: 0, y: 14 });
    gsap.set(solutionEl, { autoAlpha: 0, letterSpacing: '0.1em' });
    setLine(0);
    if (label) label.textContent = 'Initiating';
    if (sublabel) sublabel.textContent = '';

    var tl = gsap.timeline({ defaults: { ease: 'msEase' } });

    tl.to({}, { duration: 0.5 })
      .call(function () {
        if (label) label.textContent = '1. Mark';
        if (sublabel) sublabel.textContent = '(swoosh)';
      })
      .to(iconWrap, { autoAlpha: 1, scale: 1, y: 0, duration: 0.75 }, '-=0.1')
      .to(lineFill, { width: '33%', duration: 0.75 }, '<')
      .call(function () {
        host.classList.remove('is-mark-only');
        host.classList.add('is-mark-text');
        if (label) label.textContent = '2. Text';
        if (sublabel) sublabel.textContent = '(space)';
      })
      .to(spaceEl, { autoAlpha: 1, y: 0, duration: 0.65 })
      .to(lineFill, { width: '66%', duration: 0.65 }, '<')
      .call(function () {
        host.classList.remove('is-mark-text');
        if (label) label.textContent = 'Finished';
        if (sublabel) sublabel.textContent = '(SOLUTION)';
      })
      .to(solutionEl, { autoAlpha: 1, duration: 0.5 })
      .to(solutionEl, { letterSpacing: '0.32em', duration: 0.75, ease: 'power2.out' }, '-=0.25')
      .to(lineFill, { width: '100%', duration: 0.8 }, '-=0.5')
      .to({}, {
        duration: 0.45,
        onComplete: function () {
          U.waitForReady(1000).then(exit);
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
