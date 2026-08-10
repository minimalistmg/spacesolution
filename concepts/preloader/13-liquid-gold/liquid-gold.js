/**
 * Concept 13 — Liquid Gold
 * GSAP gold wave pour · drain reveal · brand lockup settle
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var waveWrap = document.querySelector('[data-pl-wave-wrap]');
  var wavePath = document.querySelector('[data-pl-wave-path]');
  var waveSheen = document.querySelector('[data-pl-wave-sheen]');
  var status = document.querySelector('[data-pl-status]');
  var progressFill = document.querySelector('[data-pl-progress-fill]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'lg',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
  });

  var fill = lockup.querySelector('[data-brand-fill]');
  var strokeUp = lockup.querySelector('[data-brand-stroke-up]');
  var strokeLo = lockup.querySelector('[data-brand-stroke-lo]');

  gsap.set(fill, { opacity: 1 });
  gsap.set([strokeUp, strokeLo], { autoAlpha: 0 });

  gsap.registerPlugin(CustomEase);
  CustomEase.create('lgPour', 'M0,0 C0.1,0.04 0.12,0.92 1,1');
  CustomEase.create('lgDrain', 'M0,0 C0.38,0 0.62,0.88 1,1');
  CustomEase.create('lgSettle', 'M0,0 C0.18,0.92 0.22,1 1,1');

  var waveRest =
    'M0,130 C240,95 480,155 720,115 C960,75 1200,145 1440,100 L1440,200 L0,200 Z';
  var waveCrest =
    'M0,38 C300,8 540,72 780,28 C1020,-8 1260,58 1440,18 L1440,200 L0,200 Z';
  var waveSettle =
    'M0,62 C280,34 520,98 760,52 C1000,18 1220,88 1440,44 L1440,200 L0,200 Z';

  var exited = false;
  var tl = null;
  var progress = { value: 0 };

  function setProgress(p, label) {
    progress.value = p;
    gsap.set(progressFill, { width: p + '%' });
    if (status) status.textContent = label || 'Pouring… ' + Math.round(p) + '%';
  }

  function morphWave(d, duration, ease) {
    return gsap.to([wavePath, waveSheen], {
      attr: { d: d },
      duration: duration,
      ease: ease || 'sine.inOut',
    });
  }

  function settleVisual() {
    gsap.set(waveWrap, { height: '0%' });
    gsap.set([wavePath, waveSheen], { attr: { d: waveRest } });
    gsap.set(host, { autoAlpha: 1, scale: 1 });
    setProgress(100, 'Ready');
  }

  function finishExit() {
    if (exited) return;
    exited = true;
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function exitNow() {
    if (exited) return;
    if (tl) tl.kill();
    settleVisual();
    finishExit();
  }

  function settle() {
    settleVisual();
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    gsap.set(waveWrap, { height: '0%' });
    gsap.set([wavePath, waveSheen], { attr: { d: waveRest } });
    gsap.set(host, { autoAlpha: 0, scale: 0.96, transformOrigin: 'center center' });
    setProgress(0, 'Pouring… 0%');

    tl = gsap.timeline();

    tl.to(waveWrap, { height: '60%', duration: 1.15, ease: 'lgPour' })
      .add(morphWave(waveCrest, 1.15, 'sine.inOut'), '<')
      .to(
        progress,
        {
          value: 58,
          duration: 1.15,
          ease: 'lgPour',
          onUpdate: function () {
            setProgress(progress.value, 'Pouring… ' + Math.round(progress.value) + '%');
          },
        },
        '<'
      )
      .to({}, { duration: 0.2 })
      .add(morphWave(waveSettle, 0.3, 'sine.inOut'))
      .to(waveWrap, { height: '0%', duration: 1.05, ease: 'lgDrain' })
      .add(morphWave(waveRest, 1.05, 'sine.inOut'), '<')
      .to(
        progress,
        {
          value: 94,
          duration: 1.05,
          ease: 'lgDrain',
          onUpdate: function () {
            setProgress(progress.value, 'Settling… ' + Math.round(progress.value) + '%');
          },
        },
        '<'
      )
      .set(host, { autoAlpha: 1 }, '-=0.6')
      .to(host, { scale: 1, duration: 0.32, ease: 'lgSettle' }, '-=0.6')
      .to(
        progress,
        {
          value: 100,
          duration: 0.32,
          onUpdate: function () {
            setProgress(progress.value, 'Ready');
          },
        },
        '<'
      )
      .to({}, {
        duration: 0.38,
        onComplete: function () {
          U.waitForReady(700).then(finishExit);
        },
      });
  }

  if (reduce) {
    settle();
    return;
  }

  play();
  if (skipBtn) skipBtn.addEventListener('click', exitNow);
})();
