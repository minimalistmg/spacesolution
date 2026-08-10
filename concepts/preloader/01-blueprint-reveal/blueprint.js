/**
 * Concept 01 — Blueprint Reveal
 * GSAP DrawSVG · SplitText · Timeline
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var U = window.PreloaderUtils;

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var progressFill = document.querySelector('[data-pl-progress-fill]');
  var progressPct = document.querySelector('[data-pl-progress-pct]');
  var enterBtn = document.querySelector('[data-pl-enter]');
  var skipBtn = document.querySelector('[data-pl-skip]');
  var concrete = document.querySelector('[data-pl-concrete]');
  var pen = document.querySelector('[data-pl-pen]');

  var lockup = BrandMark.mountLockup(host, { uid: 'bp', iconSrc: '../../../brand/icon-source.png' });
  var strokeUp = lockup.querySelector('[data-brand-stroke-up]');
  var strokeLo = lockup.querySelector('[data-brand-stroke-lo]');
  var fill = lockup.querySelector('[data-brand-fill]');
  var wire = lockup.querySelector('[data-brand-wire]');
  var spaceEl = lockup.querySelector('[data-brand-space]');
  var solutionEl = lockup.querySelector('[data-brand-solution]');

  if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
  gsap.registerPlugin(CustomEase);
  if (U.hasDrawSVG()) gsap.registerPlugin(DrawSVGPlugin);
  CustomEase.create('plEase', 'M0,0 C0.16,0.08 0.2,1 1,1');

  var tl = null;
  var ready = false;
  var exited = false;
  var splitSpace = null;
  var splitSolution = null;

  function setProgress(p) {
    gsap.set(progressFill, { width: p + '%' });
    if (progressPct) progressPct.textContent = Math.round(p) + '%';
  }

  function buildSplit() {
    if (splitSpace && splitSpace.revert) splitSpace.revert();
    if (splitSolution && splitSolution.revert) splitSolution.revert();
    if (typeof SplitText !== 'undefined') {
      splitSpace = SplitText.create(spaceEl, { type: 'chars', charsClass: 'char' });
      splitSolution = SplitText.create(solutionEl, { type: 'chars', charsClass: 'char' });
    } else {
      splitSpace = { chars: [spaceEl] };
      splitSolution = { chars: [solutionEl] };
    }
  }

  function movePenTo(el, dur) {
    if (!pen || !el || reduce) return gsap.to({}, { duration: dur });
    var box = el.getBoundingClientRect();
    return gsap.to(pen, {
      x: box.left + box.width * 0.5,
      y: box.top + box.height * 0.5,
      duration: dur,
      ease: 'power1.inOut',
    });
  }

  function exit() {
    if (exited) return;
    exited = true;
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function settle() {
    gsap.set(fill, { opacity: 1 });
    gsap.set([strokeUp, strokeLo], { autoAlpha: 0 });
    gsap.set(spaceEl, { autoAlpha: 1 });
    gsap.set(solutionEl, { autoAlpha: 1, letterSpacing: '0.32em' });
    gsap.set(concrete, { opacity: 1, scale: 1 });
    setProgress(100);
    if (enterBtn) {
      enterBtn.hidden = false;
      enterBtn.classList.add('is-visible');
    }
    ready = true;
  }

  function play() {
    if (tl) tl.kill();
    buildSplit();

    gsap.set(fill, { opacity: 0 });
    gsap.set(wire, { opacity: 0.18 });
    U.setDrawStart(strokeUp);
    U.setDrawStart(strokeLo);
    gsap.set(strokeUp, { autoAlpha: 1, stroke: '#22d3ee' });
    gsap.set(strokeLo, { autoAlpha: 1, stroke: '#22d3ee' });
    gsap.set(splitSpace.chars, { autoAlpha: 0, y: 8 });
    gsap.set(splitSolution.chars, { autoAlpha: 0 });
    gsap.set(solutionEl, { letterSpacing: '0.08em' });
    gsap.set(concrete, { opacity: 0, scale: 1.04 });
    gsap.set(pen, { autoAlpha: reduce ? 0 : 1 });
    setProgress(0);
    if (enterBtn) {
      enterBtn.hidden = true;
      enterBtn.classList.remove('is-visible');
    }

    tl = gsap.timeline({
      defaults: { ease: 'plEase' },
      onUpdate: function () {
        setProgress(tl.progress() * 100);
      },
    });

    tl.to({}, { duration: 0.4 })
      .add(function () { movePenTo(strokeUp, 0); })
      .to(strokeUp, U.drawTo(strokeUp, 1.0))
      .to({}, { duration: 0.1, onUpdate: function () { setProgress(25); } })
      .add(function () { movePenTo(strokeLo, 0); })
      .to(strokeLo, U.drawTo(strokeLo, 1.25), '-=0.15')
      .to({}, { duration: 0.1, onUpdate: function () { setProgress(50); } })
      .to(fill, { opacity: 1, duration: 0.55 }, '-=0.35')
      .to(wire, { opacity: 0, duration: 0.3 }, '-=0.4')
      .to([strokeUp, strokeLo], { autoAlpha: 0, duration: 0.25 }, '-=0.2')
      .to(pen, { autoAlpha: 0, duration: 0.2 }, '-=0.25')
      .to(splitSpace.chars, {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power2.out',
      }, '-=0.05')
      .to({}, { duration: 0.1, onUpdate: function () { setProgress(75); } })
      .to(splitSolution.chars, {
        autoAlpha: 1,
        duration: 0.35,
        stagger: 0.03,
      }, '-=0.1')
      .to(solutionEl, { letterSpacing: '0.32em', duration: 0.7, ease: 'power2.out' }, '-=0.35')
      .to(concrete, { opacity: 1, scale: 1, duration: 0.9 }, '-=0.45')
      .to({}, {
        duration: 0.2,
        onComplete: function () {
          setProgress(100);
          ready = true;
          if (enterBtn) {
            enterBtn.hidden = false;
            enterBtn.classList.add('is-visible');
          }
        },
      });

    U.waitForReady(1400).then(function () {
      if (!ready && tl) tl.progress(1);
    });
  }

  if (reduce) {
    settle();
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
    return;
  }

  play();

  if (enterBtn) enterBtn.addEventListener('click', exit);
  if (skipBtn) skipBtn.addEventListener('click', exit);
})();
