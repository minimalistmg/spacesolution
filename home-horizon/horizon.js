(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.querySelector('[data-hh-hero]');
  var media = document.querySelector('[data-hh-media]');
  var line = document.querySelector('[data-hh-line]');
  var stage = document.querySelector('[data-hh-stage]');
  var lockup = document.querySelector('[data-hh-lockup]');
  var logoSlot = document.querySelector('[data-hh-logo-slot]');
  var header = document.querySelector('[data-hh-header]');
  var headerInner = document.querySelector('.hh-header-inner');
  var hint = document.querySelector('[data-hh-hint]');
  var copy = document.querySelector('[data-hh-copy]');
  var eyebrow = document.querySelector('[data-hh-eyebrow]');
  var title = document.querySelector('[data-hh-title]');
  var lead = document.querySelector('[data-hh-lead]');
  var cta = document.querySelector('[data-hh-cta]');
  var progress = document.querySelector('[data-hh-progress]');

  if (!hero || !media || !lockup || !logoSlot || !line) return;

  var plugins = [Flip, ScrollTrigger, CustomEase];
  if (typeof SplitText !== 'undefined') plugins.push(SplitText);
  if (typeof DrawSVGPlugin !== 'undefined') plugins.push(DrawSVGPlugin);
  gsap.registerPlugin.apply(null, plugins);
  CustomEase.create('hhEase', 'M0,0 C0.14,0.06 0.18,1 1,1');

  var hasDraw = typeof DrawSVGPlugin !== 'undefined';
  var hasSplit = typeof SplitText !== 'undefined';
  var split = null;
  var flipped = false;

  function buildSplit() {
    if (split && split.revert) split.revert();
    split = null;
    if (!hasSplit || !title) return;
    try {
      split = SplitText.create(title, { type: 'lines', linesClass: 'line', mask: 'lines' });
      if (split && split.lines) gsap.set(split.lines, { yPercent: 110, autoAlpha: 0 });
    } catch (e) {
      split = null;
    }
  }

  function animateTitle(tl, position) {
    if (split && split.lines && split.lines.length) {
      tl.to(split.lines, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      }, position);
    } else if (title) {
      tl.fromTo(title, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' }, position);
    }
  }

  function prepLine() {
    if (hasDraw) {
      gsap.set(line, { drawSVG: '0%' });
      return;
    }
    var len = line.getTotalLength();
    line.style.strokeDasharray = String(len);
    line.style.strokeDashoffset = String(len);
  }

  function flipLogo(toHeader) {
    if (toHeader === flipped) return;
    flipped = toHeader;
    if (!toHeader) return;
    lockup.classList.remove('hh-lockup--vertical');
    lockup.classList.add('hh-lockup--horizontal');
    var state = Flip.getState(lockup);
    logoSlot.appendChild(lockup);
    header.classList.add('is-live');
    Flip.from(state, { duration: 0.55, ease: 'hhEase', absolute: true, scale: true });
  }

  function settle() {
    gsap.set(media, { clipPath: 'inset(0% 0 0 0)', scale: 1 });
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(headerInner, { autoAlpha: 1, y: 0 });
    gsap.set(copy, { autoAlpha: 1 });
    gsap.set([eyebrow, lead, cta], { autoAlpha: 1, y: 0 });
    if (split && split.lines) gsap.set(split.lines, { yPercent: 0, autoAlpha: 1 });
    else if (title) gsap.set(title, { autoAlpha: 1, y: 0 });
    if (progress) gsap.set(progress, { scaleY: 1 });
    flipLogo(true);
  }

  if (reduce) {
    buildSplit();
    settle();
    return;
  }

  buildSplit();
  prepLine();
  gsap.set(media, { clipPath: 'inset(50% 0 0 0)', scale: 1.05 });
  gsap.set(headerInner, { autoAlpha: 0, y: -12 });
  gsap.set(copy, { autoAlpha: 0 });
  gsap.set([eyebrow, lead, cta], { autoAlpha: 0, y: 16 });
  if (progress) gsap.set(progress, { scaleY: 0, transformOrigin: 'top center' });

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=260%',
      pin: true,
      scrub: 0.55,
      anticipatePin: 1,
      onUpdate: function (self) {
        if (progress) gsap.set(progress, { scaleY: self.progress });
        flipLogo(self.progress >= 0.48);
      },
    },
  });

  tl.to(line, hasDraw ? { drawSVG: '100%', duration: 1.2 } : { strokeDashoffset: 0, duration: 1.2 }, 0);

  if (hint) tl.to(hint, { autoAlpha: 0.3, duration: 0.4 }, 0.2);

  tl.to(media, { clipPath: 'inset(18% 0 0 0)', scale: 1.03, duration: 1.1 }, 0.6);

  if (hint) tl.to(hint, { autoAlpha: 0, duration: 0.3 }, 1.0);

  tl.to(media, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.2, ease: 'hhEase' }, 1.5)
    .to(stage, { autoAlpha: 0, duration: 0.5 }, 2.0)
    .to(headerInner, { autoAlpha: 1, y: 0, duration: 0.6 }, 2.1)
    .to(copy, { autoAlpha: 1, duration: 0.15 }, 2.5)
    .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.4 }, 2.55);

  animateTitle(tl, 2.65);

  tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.45 }, 3.0)
    .to(cta, { autoAlpha: 1, y: 0, duration: 0.45 }, 3.15)
    .to({}, { duration: 0.4 });

  ScrollTrigger.refresh();
})();
