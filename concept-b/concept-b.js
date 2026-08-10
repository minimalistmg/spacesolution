/**
 * Concept B — Portal Reveal
 * Step 1 brand seal → Step 2 portal open → Step 3 hero → Step 4 gallery
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hero = document.querySelector('[data-cb-hero]');
  var curtain = document.querySelector('[data-cb-curtain]');
  var media = document.querySelector('[data-cb-media]');
  var glow = document.querySelector('[data-cb-glow]');
  var stage = document.querySelector('[data-cb-stage]');
  var lockup = document.querySelector('[data-cb-lockup]');
  var iconWrap = document.querySelector('[data-cb-icon-wrap]');
  var halo = document.querySelector('[data-cb-halo]');
  var wordmark = document.querySelector('[data-cb-wordmark]');
  var header = document.querySelector('[data-cb-header]');
  var headerInner = document.querySelector('.cb-header-inner');
  var logoSlot = document.querySelector('[data-cb-logo-slot]');
  var copy = document.querySelector('[data-cb-copy]');
  var eyebrow = document.querySelector('[data-cb-eyebrow]');
  var title = document.querySelector('[data-cb-title]');
  var lead = document.querySelector('[data-cb-lead]');
  var actions = document.querySelector('[data-cb-actions]');
  var gallery = document.querySelector('[data-cb-gallery]');
  var thumbs = gsap.utils.toArray('.cb-thumb');
  var stepLabel = document.querySelector('[data-cb-step]');
  var skipBtn = document.querySelector('[data-cb-skip]');
  var replayBtn = document.querySelector('[data-cb-replay]');

  if (!hero || !lockup || !media || !logoSlot) return;

  gsap.registerPlugin(Flip, ScrollTrigger, SplitText, CustomEase);
  CustomEase.create('cbPortal', 'M0,0 C0.14,0.06 0.18,1 1,1');
  CustomEase.create('cbDock', 'M0,0 C0.22,0.92 0.24,1 1,1');

  var introTl = null;
  var split = null;
  var logoInHeader = false;
  var finished = false;

  function setStep(text) {
    if (stepLabel) stepLabel.textContent = text;
  }

  function buildSplit() {
    if (split) {
      split.revert();
      split = null;
    }
    if (!title) return;
    var config = { type: 'lines', linesClass: 'line', mask: 'lines' };
    split =
      typeof SplitText.create === 'function'
        ? SplitText.create(title, config)
        : new SplitText(title, config);
    gsap.set(split.lines, { yPercent: 108, autoAlpha: 0 });
  }

  function moveLockupToHeader() {
    if (logoInHeader) return;
    logoInHeader = true;

    lockup.classList.remove('cb-lockup--vertical');
    lockup.classList.add('cb-lockup--horizontal');

    var state = Flip.getState(lockup);
    logoSlot.appendChild(lockup);
    header.classList.add('is-live');

    Flip.from(state, {
      duration: 0.65,
      ease: 'cbPortal',
      absolute: true,
      scale: true,
      overwrite: 'auto',
    });
  }

  function resetLockupToStage() {
    logoInHeader = false;
    lockup.classList.remove('cb-lockup--horizontal');
    lockup.classList.add('cb-lockup--vertical');
    stage.appendChild(lockup);
    header.classList.remove('is-live');
  }

  function showSettled() {
    finished = true;
    gsap.set(curtain, { autoAlpha: 0 });
    gsap.set(media, { clipPath: 'circle(150% at 50% 42%)', scale: 1 });
    gsap.set(glow, { autoAlpha: 0, scale: 1.4 });
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(headerInner, { autoAlpha: 1, y: 0 });
    gsap.set(copy, { autoAlpha: 1 });
    gsap.set([eyebrow, lead, actions], { autoAlpha: 1, y: 0 });
    if (split) gsap.set(split.lines, { yPercent: 0, autoAlpha: 1 });
    gsap.set(gallery, { autoAlpha: 1, x: 0, y: 0 });
    gsap.set(thumbs, { autoAlpha: 1, x: 0, y: 0 });
    moveLockupToHeader();
    setStep('Step 4 — Gallery dock');
    if (skipBtn) skipBtn.hidden = true;
    if (replayBtn) replayBtn.hidden = false;
  }

  function buildIntro() {
    if (introTl) {
      introTl.kill();
      introTl = null;
    }

    finished = false;
    resetLockupToStage();
    buildSplit();

    gsap.set(curtain, { autoAlpha: 1 });
    gsap.set(media, { clipPath: 'circle(0% at 50% 42%)', scale: 1.08 });
    gsap.set(glow, { autoAlpha: 0, scale: 0.6 });
    gsap.set(stage, { autoAlpha: 1 });
    gsap.set(lockup, { scale: 1, autoAlpha: 1, y: 0 });
    gsap.set(halo, { autoAlpha: 0, scale: 0.85 });
    gsap.set(wordmark, { autoAlpha: 1, y: 0 });
    gsap.set(headerInner, { autoAlpha: 0, y: -16 });
    gsap.set(copy, { autoAlpha: 0 });
    gsap.set(eyebrow, { autoAlpha: 0, y: 14 });
    gsap.set(lead, { autoAlpha: 0, y: 18 });
    gsap.set(actions, { autoAlpha: 0, y: 18 });
    gsap.set(gallery, { autoAlpha: 0, xPercent: 0 });
    gsap.set(thumbs, {
      autoAlpha: 0,
      x: window.innerWidth < 901 ? 0 : 72,
      y: window.innerWidth < 901 ? 48 : 0,
    });
    if (skipBtn) skipBtn.hidden = false;
    if (replayBtn) replayBtn.hidden = true;

    introTl = gsap.timeline({
      defaults: { ease: 'cbPortal' },
      onComplete: function () {
        finished = true;
        if (skipBtn) skipBtn.hidden = true;
        if (replayBtn) replayBtn.hidden = false;
      },
    });

    /* Step 1 — Brand seal hold */
    introTl.add(function () {
      setStep('Step 1 — Brand seal');
    });
    introTl.to({}, { duration: 1.1 });

    /* Step 2 — Portal opens */
    introTl.add(function () {
      setStep('Step 2 — Portal opening');
    });
    introTl.to(halo, { autoAlpha: 1, scale: 1.15, duration: 0.8 }, '<');
    introTl.to(glow, { autoAlpha: 1, scale: 1, duration: 1.1 }, '<0.1');
    introTl.to(iconWrap, { scale: 1.08, duration: 1.0 }, '<');
    introTl.to(
      media,
      {
        clipPath: 'circle(34% at 50% 42%)',
        scale: 1.04,
        duration: 1.15,
        ease: 'none',
      },
      '<0.15'
    );
    introTl.to(wordmark, { autoAlpha: 0, y: -12, duration: 0.45 }, '<0.55');
    introTl.to(curtain, { autoAlpha: 0.35, duration: 0.6 }, '<0.2');

    introTl.to(
      media,
      {
        clipPath: 'circle(150% at 50% 42%)',
        scale: 1,
        duration: 1.25,
        ease: 'cbPortal',
      },
      '+=0.15'
    );
    introTl.to(glow, { autoAlpha: 0, scale: 1.5, duration: 0.7 }, '<0.35');
    introTl.to(halo, { autoAlpha: 0, duration: 0.5 }, '<');
    introTl.to(stage, { autoAlpha: 0, duration: 0.45 }, '<0.25');

    /* Step 3 — Hero landing */
    introTl.add(function () {
      setStep('Step 3 — Hero landing');
      moveLockupToHeader();
    }, '<0.15');
    introTl.to(headerInner, { autoAlpha: 1, y: 0, duration: 0.65 }, '<0.05');
    introTl.to(copy, { autoAlpha: 1, duration: 0.2 }, '<0.25');
    introTl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.45 }, '<0.05');
    if (split) {
      introTl.to(
        split.lines,
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.11,
          ease: 'power3.out',
        },
        '<0.08'
      );
    }
    introTl.to(lead, { autoAlpha: 1, y: 0, duration: 0.5 }, '<0.35');
    introTl.to(actions, { autoAlpha: 1, y: 0, duration: 0.5 }, '<0.12');

    /* Step 4 — Gallery dock */
    introTl.add(function () {
      setStep('Step 4 — Gallery dock');
    });
    introTl.to(gallery, { autoAlpha: 1, duration: 0.3 }, '<0.1');
    introTl.to(
      thumbs,
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: 'cbDock',
      },
      '<0.05'
    );
    introTl.to({}, { duration: 0.4 });

    return introTl;
  }

  function skipIntro() {
    if (finished) return;
    if (introTl) introTl.progress(1, false);
    showSettled();
  }

  if (reduceMotion) {
    showSettled();
    if (skipBtn) skipBtn.hidden = true;
    return;
  }

  buildIntro();

  if (skipBtn) {
    skipBtn.addEventListener('click', skipIntro);
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(function () {
        buildIntro();
      }, 350);
    });
  }

  window.addEventListener(
    'wheel',
    function () {
      if (!finished && window.scrollY < 40) skipIntro();
    },
    { passive: true, once: true }
  );

  window.addEventListener(
    'keydown',
    function (e) {
      if (!finished && (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape')) {
        e.preventDefault();
        skipIntro();
      }
    },
    { once: true }
  );
})();
