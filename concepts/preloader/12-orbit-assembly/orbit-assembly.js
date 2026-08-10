/**
 * Concept 12 — Orbit Assembly
 * GSAP orbital rings converge · brand lockup assembles (~3.5s)
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
  var rings = gsap.utils.toArray('.pl-orbit');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'oa',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
    dark: true,
  });

  var iconWrap = lockup.querySelector('.brand-icon-wrap');
  var fill = lockup.querySelector('[data-brand-fill]');
  var spaceEl = lockup.querySelector('[data-brand-space]');
  var solutionEl = lockup.querySelector('[data-brand-solution]');

  gsap.registerPlugin(CustomEase);
  CustomEase.create('oaEase', 'M0,0 C0.16,0.06 0.22,1 1,1');

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
    gsap.set(iconWrap, { scale: 1, autoAlpha: 1 });
    gsap.set(spaceEl, { autoAlpha: 1, y: 0 });
    gsap.set(solutionEl, { autoAlpha: 1, letterSpacing: '0.32em' });
    gsap.set(rings, { autoAlpha: 0 });
    host.classList.remove('is-mark-only', 'is-mark-text');
    setLine(100);
    if (label) label.textContent = 'Ready';
    if (sublabel) sublabel.textContent = '';
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    gsap.set(fill, { opacity: 1 });
    host.classList.add('is-mark-only');
    gsap.set(iconWrap, { scale: 0, autoAlpha: 1, transformOrigin: '50% 50%' });
    gsap.set(spaceEl, { autoAlpha: 0, y: 10 });
    gsap.set(solutionEl, { autoAlpha: 0, letterSpacing: '0.1em' });
    gsap.set(rings, {
      autoAlpha: 1,
      scale: 1.35,
      transformOrigin: '50% 50%',
    });
    gsap.set(rings[0], { rotationX: 64, rotationY: 14, rotationZ: 0 });
    gsap.set(rings[1], { rotationX: 54, rotationY: -22, rotationZ: 38 });
    gsap.set(rings[2], { rotationX: 76, rotationY: 6, rotationZ: -28 });
    setLine(0);
    if (label) label.textContent = 'Assembling';
    if (sublabel) sublabel.textContent = '';

    var tl = gsap.timeline({ defaults: { ease: 'oaEase' } });

    tl.to(rings[0], { rotationZ: '+=360', duration: 3.4, ease: 'none' }, 0)
      .to(rings[1], { rotationZ: '-=360', duration: 2.6, ease: 'none' }, 0)
      .to(rings[2], { rotationZ: '+=360', duration: 3.1, ease: 'none' }, 0)
      .to(lineFill, { width: '18%', duration: 1.0 }, 0)
      .to(
        rings,
        {
          scale: 0.32,
          autoAlpha: 0,
          duration: 1.05,
          stagger: 0.07,
          ease: 'power2.in',
        },
        0.85
      )
      .to(iconWrap, { scale: 1, duration: 0.9, ease: 'back.out(2.6)' }, 1.3)
      .to(lineFill, { width: '45%', duration: 0.9 }, 1.3)
      .call(
        function () {
          host.classList.remove('is-mark-only');
          host.classList.add('is-mark-text');
          if (label) label.textContent = 'space';
        },
        null,
        2.1
      )
      .to(spaceEl, { autoAlpha: 1, y: 0, duration: 0.55 })
      .to(lineFill, { width: '72%', duration: 0.55 }, '<')
      .call(
        function () {
          host.classList.remove('is-mark-text');
          if (label) label.textContent = 'Ready';
          if (sublabel) sublabel.textContent = 'SOLUTION';
        },
        null,
        2.65
      )
      .to(solutionEl, { autoAlpha: 1, duration: 0.45 })
      .to(solutionEl, { letterSpacing: '0.32em', duration: 0.7, ease: 'power2.out' }, '-=0.25')
      .to(lineFill, { width: '100%', duration: 0.7 }, '-=0.5')
      .to({}, {
        duration: 0.35,
        onComplete: function () {
          U.waitForReady(800).then(exit);
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
