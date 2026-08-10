/**
 * Concept 05 — Ambiance & Illumination
 * GSAP layered light reveal · backlit logo sign
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var roomImg = document.querySelector('[data-pl-room] img');
  var dark = document.querySelector('[data-pl-dark]');
  var cove = document.querySelector('[data-pl-cove]');
  var full = document.querySelector('[data-pl-full]');
  var status = document.querySelector('[data-pl-status]');
  var progressFill = document.querySelector('[data-pl-progress-fill]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'ai',
    iconSrc: '../../../brand/icon-source.png',
    dark: true,
    center: true,
  });

  var fill = lockup.querySelector('[data-brand-fill]');
  gsap.set(fill, { opacity: 1 });

  gsap.registerPlugin(CustomEase);
  CustomEase.create('aiEase', 'M0,0 C0.16,0.1 0.2,1 1,1');

  var exited = false;
  var progress = { value: 0 };

  function setProgress(p, label) {
    progress.value = p;
    gsap.set(progressFill, { width: p + '%' });
    if (status) status.textContent = label || 'Illumination… ' + Math.round(p) + '%';
  }

  function exit() {
    if (exited) return;
    exited = true;
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function settle() {
    gsap.set(dark, { opacity: 0 });
    gsap.set(cove, { opacity: 1 });
    gsap.set(full, { opacity: 1 });
    gsap.set(lockup, { opacity: 1, filter: 'brightness(1)' });
    host.classList.add('is-lit');
    if (roomImg) roomImg.classList.add('is-lit');
    setProgress(100, 'Creating atmosphere…');
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    gsap.set(dark, { opacity: 1 });
    gsap.set(cove, { opacity: 0 });
    gsap.set(full, { opacity: 0 });
    gsap.set(lockup, { autoAlpha: 0, filter: 'brightness(0.25)' });
    host.classList.remove('is-lit');
    setProgress(0, 'Illumination… 0%');

    var tl = gsap.timeline({ defaults: { ease: 'aiEase' } });

    tl.to({}, { duration: 0.8 })
      .to(progress, {
        value: 32,
        duration: 1.6,
        onUpdate: function () {
          setProgress(progress.value, 'Illumination… ' + Math.round(progress.value) + '% (Cove light)');
        },
      })
      .to(cove, { opacity: 1, duration: 1.2 }, '-=1.4')
      .to(dark, { opacity: 0.55, duration: 1.2 }, '-=1.2')
      .to(lockup, { autoAlpha: 0.5, filter: 'brightness(0.55)', duration: 0.9 }, '-=0.8')
      .to(progress, {
        value: 98,
        duration: 2,
        onUpdate: function () {
          var p = Math.round(progress.value);
          var note = p > 70 ? ' (Pendants & floor)' : ' (Cove light)';
          setProgress(progress.value, 'Illumination… ' + p + '%' + note);
        },
      })
      .to(full, { opacity: 1, duration: 1.4 }, '-=1.6')
      .to(dark, { opacity: 0.12, duration: 1.2 }, '-=1.2')
      .to(lockup, { autoAlpha: 1, filter: 'brightness(1)', duration: 1 }, '-=1')
      .call(function () { host.classList.add('is-lit'); })
      .to(roomImg, {
        duration: 0.01,
        onStart: function () {
          if (roomImg) roomImg.classList.add('is-lit');
        },
      }, '-=0.8')
      .to(progress, {
        value: 100,
        duration: 0.5,
        onUpdate: function () {
          setProgress(progress.value, 'Creating atmosphere…');
        },
      })
      .to({}, {
        duration: 0.5,
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
