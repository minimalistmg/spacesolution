/**
 * Concept 09 — Neumorphism Reveal
 * Based on Shunya Koide — https://codepen.io/shunyadezain/pen/xxZpxKQ
 * Concentric neumorphic rings scale out · brand lockup fades in
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var circles = gsap.utils.toArray('.pl-cir');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'nr',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
  });

  var fill = lockup.querySelector('[data-brand-fill]');
  gsap.set(fill, { opacity: 1 });

  var tl = null;
  var exited = false;
  var loadReady = false;
  var animDone = false;

  function tryExit() {
    if (!loadReady || !animDone || exited) return;
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
    exited = true;
  }

  function exitNow() {
    if (exited) return;
    exited = true;
    if (tl) tl.progress(1);
    gsap.set(host, { opacity: 1, scale: 1 });
    gsap.set(circles, { scale: 1 });
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function play() {
    tl = gsap.timeline({
      onComplete: function () {
        animDone = true;
        tryExit();
      },
    });

    tl.set(circles, { scale: 0, transformOrigin: 'center' })
      .set(host, { scale: 0.72, transformOrigin: 'center', opacity: 0 })
      .to(circles, {
        ease: 'back.out(3)',
        duration: 4,
        scale: gsap.utils.distribute({
          base: 1,
          amount: 3,
          from: 'end',
        }),
        stagger: { each: 0.4 },
      })
      .to(
        host,
        {
          scale: 1,
          opacity: 1,
          duration: 3,
          ease: 'power2.out',
        },
        '-=1.5'
      );
  }

  function settle() {
    gsap.set(host, { opacity: 1, scale: 1 });
    gsap.set(circles, { scale: 0, autoAlpha: 0 });
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  U.waitForReady(800).then(function () {
    loadReady = true;
    tryExit();
  });

  if (reduce) {
    settle();
    return;
  }

  play();

  if (skipBtn) skipBtn.addEventListener('click', exitNow);
})();
