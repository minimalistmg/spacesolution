/**
 * Concept C — White Gold Curtain
 * Step 1 seal → Step 2 curtains part → Step 3 hero → Step 4 gallery
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var introVeil = document.querySelector('[data-cc-intro]');
  var sparklesRoot = document.querySelector('[data-cc-sparkles]');
  var curtainLeft = document.querySelector('[data-cc-curtain-left]');
  var curtainRight = document.querySelector('[data-cc-curtain-right]');
  var stage = document.querySelector('[data-cc-stage]');
  var lockup = document.querySelector('[data-cc-lockup]');
  var header = document.querySelector('[data-cc-header]');
  var headerInner = document.querySelector('.cc-header-inner');
  var logoSlot = document.querySelector('[data-cc-logo-slot]');
  var copy = document.querySelector('[data-cc-copy]');
  var title = document.querySelector('[data-cc-title]');
  var lead = document.querySelector('[data-cc-lead]');
  var actions = document.querySelector('[data-cc-actions]');
  var gallery = document.querySelector('[data-cc-gallery]');
  var thumbs = gsap.utils.toArray('.cc-thumb');
  var stepLabel = document.querySelector('[data-cc-step]');
  var skipBtn = document.querySelector('[data-cc-skip]');
  var replayBtn = document.querySelector('[data-cc-replay]');

  if (!lockup || !logoSlot || !curtainLeft || !curtainRight) return;

  gsap.registerPlugin(Flip, SplitText, CustomEase);
  CustomEase.create('ccCurtain', 'M0,0 C0.12,0.04 0.16,1 1,1');
  CustomEase.create('ccLift', 'M0,0 C0.18,0.88 0.2,1 1,1');

  var introTl = null;
  var split = null;
  var logoInHeader = false;
  var finished = false;

  function setStep(text) {
    if (stepLabel) stepLabel.textContent = text;
  }

  function seedSparkles() {
    if (!sparklesRoot || sparklesRoot.childElementCount) return;
    for (var i = 0; i < 28; i++) {
      var dot = document.createElement('span');
      dot.className = 'cc-sparkle';
      var size = 4 + Math.random() * 14;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.animationDelay = Math.random() * 2 + 's';
      dot.style.animationDuration = 3 + Math.random() * 3 + 's';
      sparklesRoot.appendChild(dot);
    }
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
    gsap.set(split.lines, { yPercent: 110, autoAlpha: 0 });
  }

  function moveLockupToHeader() {
    if (logoInHeader) return;
    logoInHeader = true;
    lockup.classList.remove('cc-lockup--vertical');
    lockup.classList.add('cc-lockup--horizontal');
    var state = Flip.getState(lockup);
    logoSlot.appendChild(lockup);
    header.classList.add('is-live');
    Flip.from(state, {
      duration: 0.7,
      ease: 'ccCurtain',
      absolute: true,
      scale: true,
      overwrite: 'auto',
    });
  }

  function resetLockupToStage() {
    logoInHeader = false;
    lockup.classList.remove('cc-lockup--horizontal');
    lockup.classList.add('cc-lockup--vertical');
    stage.appendChild(lockup);
    header.classList.remove('is-live');
  }

  function showSettled() {
    finished = true;
    gsap.set(introVeil, { autoAlpha: 0 });
    gsap.set(curtainLeft, { xPercent: -102 });
    gsap.set(curtainRight, { xPercent: 102 });
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(headerInner, { autoAlpha: 1, y: 0 });
    gsap.set(copy, { autoAlpha: 1 });
    gsap.set([lead, actions], { autoAlpha: 1, y: 0 });
    if (split) gsap.set(split.lines, { yPercent: 0, autoAlpha: 1 });
    gsap.set(gallery, { autoAlpha: 1, y: 0 });
    gsap.set(thumbs, { autoAlpha: 1, y: 0 });
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
    seedSparkles();
    resetLockupToStage();
    buildSplit();

    gsap.set(introVeil, { autoAlpha: 1 });
    gsap.set(curtainLeft, { xPercent: 0 });
    gsap.set(curtainRight, { xPercent: 0 });
    gsap.set(stage, { autoAlpha: 1 });
    gsap.set(lockup, { scale: 1, autoAlpha: 1, y: 0 });
    gsap.set(headerInner, { autoAlpha: 0, y: -14 });
    gsap.set(copy, { autoAlpha: 0 });
    gsap.set(lead, { autoAlpha: 0, y: 16 });
    gsap.set(actions, { autoAlpha: 0, y: 16 });
    gsap.set(gallery, { autoAlpha: 0, y: 80 });
    gsap.set(thumbs, { autoAlpha: 0, y: 40 });
    if (skipBtn) skipBtn.hidden = false;
    if (replayBtn) replayBtn.hidden = true;

    introTl = gsap.timeline({
      defaults: { ease: 'ccCurtain' },
      onComplete: function () {
        finished = true;
        if (skipBtn) skipBtn.hidden = true;
        if (replayBtn) replayBtn.hidden = false;
      },
    });

    /* Step 1 — White gold seal */
    introTl.add(function () {
      setStep('Step 1 — White gold seal');
    });
    introTl.to({}, { duration: 1.15 });

    /* Step 2 — Curtains part, header appears */
    introTl.add(function () {
      setStep('Step 2 — Curtains opening');
      moveLockupToHeader();
    });
    introTl.to(
      curtainLeft,
      { xPercent: -102, duration: 1.35, ease: 'power2.inOut' },
      '<0.05'
    );
    introTl.to(
      curtainRight,
      { xPercent: 102, duration: 1.35, ease: 'power2.inOut' },
      '<'
    );
    introTl.to(introVeil, { autoAlpha: 0, duration: 0.85 }, '<0.25');
    introTl.to(stage, { autoAlpha: 0, duration: 0.4 }, '<0.55');
    introTl.to(headerInner, { autoAlpha: 1, y: 0, duration: 0.65 }, '<0.35');

    /* Step 3 — Hero copy */
    introTl.add(function () {
      setStep('Step 3 — Hero landing');
    }, '<0.15');
    introTl.to(copy, { autoAlpha: 1, duration: 0.2 }, '<0.2');
    if (split) {
      introTl.to(
        split.lines,
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '<0.05'
      );
    }
    introTl.to(lead, { autoAlpha: 1, y: 0, duration: 0.5 }, '<0.28');
    introTl.to(actions, { autoAlpha: 1, y: 0, duration: 0.5 }, '<0.1');

    /* Step 4 — Bottom gallery */
    introTl.add(function () {
      setStep('Step 4 — Gallery dock');
    });
    introTl.to(gallery, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'ccLift' }, '<0.15');
    introTl.to(
      thumbs,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'ccLift',
      },
      '<0.05'
    );
    introTl.to({}, { duration: 0.35 });

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

  if (skipBtn) skipBtn.addEventListener('click', skipIntro);
  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(buildIntro, 350);
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
