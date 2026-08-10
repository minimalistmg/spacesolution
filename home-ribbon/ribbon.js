(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var intro = document.querySelector('[data-hr-intro]');
  var media = document.querySelector('[data-hr-media]');
  var stage = document.querySelector('[data-hr-stage]');
  var lockup = document.querySelector('[data-hr-lockup]');
  var logoSlot = document.querySelector('[data-hr-logo-slot]');
  var header = document.querySelector('[data-hr-header]');
  var headerInner = document.querySelector('.hr-header-inner');
  var headerLine = document.querySelector('[data-hr-header-line]');
  var nav = document.querySelector('[data-hr-nav]');
  var actions = document.querySelector('[data-hr-actions]');
  var strokeUp = document.querySelector('[data-hr-stroke-up]');
  var strokeLo = document.querySelector('[data-hr-stroke-lo]');
  var fill = document.querySelector('[data-hr-fill]');
  var wordmark = document.querySelector('[data-hr-wordmark]');
  var copy = document.querySelector('[data-hr-copy]');
  var eyebrow = document.querySelector('[data-hr-eyebrow]');
  var title = document.querySelector('[data-hr-title]');
  var lead = document.querySelector('[data-hr-lead]');
  var cta = document.querySelector('[data-hr-cta]');
  var skip = document.querySelector('[data-hr-skip]');

  gsap.registerPlugin(Flip, SplitText, CustomEase);
  if (typeof DrawSVGPlugin !== 'undefined') gsap.registerPlugin(DrawSVGPlugin);
  CustomEase.create('hrEase', 'M0,0 C0.16,0.08 0.2,1 1,1');

  var hasDraw = typeof DrawSVGPlugin !== 'undefined';
  var split = null;
  var tl = null;
  var done = false;

  function buildSplit() {
    if (split && split.revert) split.revert();
    split = null;
    if (typeof SplitText === 'undefined' || !title) return;
    split = SplitText.create(title, { type: 'lines', linesClass: 'line', mask: 'lines' });
    gsap.set(split.lines, { yPercent: 110, autoAlpha: 0 });
  }

  function flipToHeader() {
    lockup.classList.remove('hr-lockup--vertical');
    lockup.classList.add('hr-lockup--horizontal');
    var state = Flip.getState(lockup);
    logoSlot.appendChild(lockup);
    header.classList.add('is-live');
    Flip.from(state, { duration: 0.65, ease: 'hrEase', absolute: true, scale: true });
  }

  function resetLockup() {
    lockup.classList.remove('hr-lockup--horizontal');
    lockup.classList.add('hr-lockup--vertical');
    stage.appendChild(lockup);
    header.classList.remove('is-live');
  }

  function settle() {
    done = true;
    gsap.set(intro, { autoAlpha: 0 });
    gsap.set(media, { clipPath: 'inset(0% 0 0 0)', scale: 1 });
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(fill, { opacity: 1 });
    gsap.set([strokeUp, strokeLo], { autoAlpha: 0 });
    gsap.set(headerInner, { autoAlpha: 1, y: 0 });
    gsap.set(headerLine, { scaleX: 1 });
    gsap.set(copy, { autoAlpha: 1 });
    gsap.set([eyebrow, lead, cta], { autoAlpha: 1, y: 0 });
    if (split) gsap.set(split.lines, { yPercent: 0, autoAlpha: 1 });
    flipToHeader();
    if (skip) skip.hidden = true;
  }

  function prepStroke(el) {
    if (!el) return 0;
    var len = el.getTotalLength();
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    return len;
  }

  function drawStroke(el, dur, pos) {
    if (hasDraw) return { drawSVG: '100%', duration: dur, ease: 'power2.inOut' };
    var len = prepStroke(el);
    return { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut' };
  }

  function play() {
    if (tl) tl.kill();
    done = false;
    resetLockup();
    buildSplit();

    gsap.set(intro, { autoAlpha: 1 });
    gsap.set(media, { clipPath: 'inset(100% 0 0 0)', scale: 1.06 });
    gsap.set(stage, { autoAlpha: 1 });
    gsap.set(fill, { opacity: 0 });
    if (hasDraw) {
      gsap.set(strokeUp, { drawSVG: '0%' });
      gsap.set(strokeLo, { drawSVG: '0%' });
    } else {
      prepStroke(strokeUp);
      prepStroke(strokeLo);
    }
    gsap.set(wordmark, { autoAlpha: 0, y: 16 });
    gsap.set(headerInner, { autoAlpha: 0, y: -14 });
    gsap.set(headerLine, { scaleX: 0 });
    gsap.set(copy, { autoAlpha: 0 });
    gsap.set([eyebrow, lead, cta], { autoAlpha: 0, y: 18 });
    if (skip) skip.hidden = false;

    tl = gsap.timeline({
      defaults: { ease: 'hrEase' },
      onComplete: function () { done = true; if (skip) skip.hidden = true; },
    });

    tl.to(strokeUp, drawStroke(strokeUp, 1.1))
      .to(strokeLo, drawStroke(strokeLo, 1.35), '-=0.5')
      .to(fill, { opacity: 1, duration: 0.55 }, '-=0.35')
      .to([strokeUp, strokeLo], { autoAlpha: 0, duration: 0.3 }, '-=0.2')
      .to(wordmark, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.15')
      .to({}, { duration: 0.35 })
      .to(media, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.1, ease: 'power3.inOut' })
      .to(intro, { autoAlpha: 0, duration: 0.5 }, '-=0.85')
      .add(flipToHeader, '-=0.45')
      .to(headerLine, { scaleX: 1, duration: 0.8 }, '-=0.35')
      .to(headerInner, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.5')
      .to(stage, { autoAlpha: 0, duration: 0.35 }, '-=0.25')
      .to(copy, { autoAlpha: 1, duration: 0.15 }, '-=0.1')
      .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.4 });
    if (split && split.lines) {
      tl.to(split.lines, { yPercent: 0, autoAlpha: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, '-=0.05');
    } else if (title) {
      tl.fromTo(title, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.05');
    }
    tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.25')
      .to(cta, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.2');
  }

  if (reduce) { settle(); return; }
  play();
  if (skip) skip.addEventListener('click', function () { if (!done) { if (tl) tl.progress(1); settle(); } });
})();
