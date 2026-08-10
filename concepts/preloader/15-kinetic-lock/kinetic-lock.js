/**
 * Concept 15 — Kinetic Lock
 * Ghost "space" marquee whips past, hard-decelerates and locks one word
 * dead-centre · gold icon punches in from above · SOLUTION tracks open
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var marquee = document.querySelector('[data-pl-marquee]');
  var track = document.querySelector('[data-pl-marquee-track]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(host, {
    uid: 'kl',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
  });

  var iconWrap = lockup.querySelector('.brand-icon-wrap');
  var fill = lockup.querySelector('[data-brand-fill]');
  var spaceEl = lockup.querySelector('[data-brand-space]');
  var solutionEl = lockup.querySelector('[data-brand-solution]');

  gsap.registerPlugin(CustomEase);
  CustomEase.create('klWhip', 'M0,0 C0.05,0.75 0.1,1 1,1');
  CustomEase.create('klSettle', 'M0,0 C0.16,0.95 0.3,1 1,1');

  var tl = null;
  var exited = false;

  /** Sit the ghost strip on the same baseline as the real "space" word. */
  function alignMarquee() {
    if (!marquee || !spaceEl) return;
    var r = spaceEl.getBoundingClientRect();
    if (!r.height) return;
    marquee.style.top = r.top + r.height / 2 + 'px';
  }

  /** Whole number of word-pitches that still keeps the track off-screen left. */
  function startOffset() {
    var words = track ? track.children : null;
    if (!words || words.length < 2) return 600;
    var pitch = words[1].offsetLeft - words[0].offsetLeft;
    if (!pitch) return 600;
    var overhang = track.offsetWidth / 2 - window.innerWidth / 2;
    var steps = Math.floor(Math.min(pitch * 5, overhang) / pitch);
    if (steps < 1) steps = 1;
    return steps * pitch;
  }

  function exit() {
    if (exited) return;
    exited = true;
    if (tl) tl.kill();
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function settle() {
    gsap.set(fill, { opacity: 1 });
    gsap.set(iconWrap, { autoAlpha: 1, y: 0, scale: 1 });
    gsap.set(spaceEl, { autoAlpha: 1, scale: 1 });
    gsap.set(solutionEl, { autoAlpha: 1, letterSpacing: '0.32em' });
    if (marquee) gsap.set(marquee, { autoAlpha: 0 });
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    alignMarquee();

    gsap.set(fill, { opacity: 1 });
    gsap.set(iconWrap, { autoAlpha: 0, y: -70, scale: 0.68 });
    gsap.set(spaceEl, { autoAlpha: 0, scale: 1.06 });
    gsap.set(solutionEl, { autoAlpha: 0, letterSpacing: '0.08em' });
    gsap.set(marquee, { autoAlpha: 1 });
    gsap.set(track, { x: startOffset(), skewX: -9, scaleX: 1.05, filter: 'blur(5px)' });

    tl = gsap.timeline({
      onComplete: function () {
        U.waitForReady(250).then(exit);
      },
    });

    /* I — Marquee whips across and hard-decelerates into the lock (1.20s) */
    tl.to(track, { x: 0, duration: 1.2, ease: 'klWhip' }, 0)
      .to(
        track,
        { skewX: 0, scaleX: 1, filter: 'blur(0px)', duration: 0.95, ease: 'klSettle' },
        0
      )

      /* II — Lock: ghost strip drops out, real wordmark takes its place (0.22s) */
      .to(marquee, { autoAlpha: 0, duration: 0.22, ease: 'power2.out' }, 1.2)
      .to(spaceEl, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power3.out' }, 1.2)

      /* III — Gold icon punches down into the lockup (0.40s) */
      .to(
        iconWrap,
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2.4)' },
        1.2
      )

      /* IV — SOLUTION reveals with a tracking expand (0.45s) */
      .to(solutionEl, { autoAlpha: 1, duration: 0.22, ease: 'power2.out' }, 1.5)
      .to(
        solutionEl,
        { letterSpacing: '0.32em', duration: 0.45, ease: 'power3.out' },
        1.5
      )

      /* V — Hold the locked composition (0.15s) → timeline ends at 2.10s */
      .to({}, { duration: 0.15 }, 1.95);
  }

  if (reduce) {
    settle();
    return;
  }

  /* Both the strip baseline and the word pitch are measured from rendered
     glyphs, so they are wrong until Gotham has swapped in. Cap the wait so a
     slow font never stalls the preloader. */
  function startWhenMeasurable() {
    var started = false;
    function go() {
      if (started) return;
      started = true;
      play();
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(go).catch(go);
    }
    setTimeout(go, 300);
  }

  startWhenMeasurable();
  window.addEventListener('resize', function () {
    if (!exited) alignMarquee();
  });
  if (skipBtn) skipBtn.addEventListener('click', exit);
})();
