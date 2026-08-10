/**
 * Concept 04 — Materiality & Form
 * GSAP MotionPath · material swatches → lockup assembly
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var swatches = gsap.utils.toArray('[data-pl-swatch]');
  var walnut = document.querySelector('[data-pl-walnut]');
  var glow = document.querySelector('[data-pl-glow]');
  var status = document.querySelector('[data-pl-status]');
  var progressFill = document.querySelector('[data-pl-progress-fill]');
  var progressPct = document.querySelector('[data-pl-progress-pct]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'mf',
    iconSrc: '../../../brand/icon-source.png',
    dark: true,
  });

  var fill = lockup.querySelector('[data-brand-fill]');
  var spaceEl = lockup.querySelector('[data-brand-space]');
  var solutionEl = lockup.querySelector('[data-brand-solution]');
  var iconWrap = lockup.querySelector('.brand-icon-wrap');
  var wordmark = lockup.querySelector('.brand-wordmark');

  gsap.registerPlugin(MotionPathPlugin, CustomEase);
  CustomEase.create('mfEase', 'M0,0 C0.18,0.06 0.22,1 1,1');

  var exited = false;
  var tl = null;

  function setProgress(p, label) {
    gsap.set(progressFill, { width: p + '%' });
    if (progressPct) progressPct.textContent = Math.round(p) + '%';
    if (label && status) status.textContent = label;
  }

  function exit() {
    if (exited) return;
    exited = true;
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function settle() {
    gsap.set(fill, { opacity: 1 });
    gsap.set(lockup, { opacity: 1, scale: 1 });
    gsap.set([spaceEl, solutionEl], { autoAlpha: 1 });
    gsap.set(walnut, { opacity: 1 });
    gsap.set(swatches, { autoAlpha: 0 });
    setProgress(100, 'Ready');
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    gsap.set(fill, { opacity: 0 });
    gsap.set(lockup, { autoAlpha: 0, scale: 0.92 });
    gsap.set(iconWrap, { autoAlpha: 0, scale: 0.85 });
    gsap.set(wordmark, { autoAlpha: 0, y: 12 });
    gsap.set(walnut, { opacity: 0 });
    gsap.set(glow, { opacity: 0 });
    setProgress(0, 'Selecting materials…');

    var center = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.42 };

    tl = gsap.timeline({
      defaults: { ease: 'mfEase' },
      onUpdate: function () {
        if (!status) return;
      },
    });

    tl.to({}, { duration: 0.5, onStart: function () { setProgress(10, 'Blueprint layout…'); } })
      .to(swatches, {
        scale: 1.06,
        duration: 0.6,
        stagger: 0.08,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      })
      .to({}, { duration: 0.1, onComplete: function () { setProgress(35, 'Kinetic in-lay…'); } })
      .to(swatches, {
        duration: 1.1,
        stagger: 0.06,
        motionPath: {
          path: [
            { x: center.x - 120, y: center.y - 80 },
            { x: center.x, y: center.y - 20 },
            { x: center.x + 40, y: center.y },
          ],
          curviness: 1.4,
        },
        scale: 0.2,
        autoAlpha: 0,
        rotation: gsap.utils.wrap([-24, 18, -12, 22]),
      })
      .to(walnut, { opacity: 1, duration: 0.9 }, '-=0.7')
      .to(lockup, { autoAlpha: 1, scale: 1, duration: 0.55 }, '-=0.5')
      .to(iconWrap, { autoAlpha: 1, scale: 1, duration: 0.65 }, '-=0.45')
      .to(fill, { opacity: 1, duration: 0.5 }, '-=0.35')
      .to({}, { duration: 0.1, onComplete: function () { setProgress(68, 'Materializing design…'); } })
      .to(wordmark, { autoAlpha: 1, y: 0, duration: 0.5 })
      .fromTo(spaceEl, { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.45 }, '-=0.25')
      .fromTo(solutionEl, { autoAlpha: 0, letterSpacing: '0.12em' }, {
        autoAlpha: 1,
        letterSpacing: '0.32em',
        duration: 0.65,
      }, '-=0.15')
      .to({}, { duration: 0.1, onComplete: function () { setProgress(100, 'Craft complete'); } })
      .to(glow, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .to(glow, { opacity: 0.55, duration: 0.6 })
      .to({}, {
        duration: 0.4,
        onComplete: function () {
          U.waitForReady(1100).then(exit);
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
