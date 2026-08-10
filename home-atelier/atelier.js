(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var maskStage = document.querySelector('[data-ha-mask-stage]');
  var maskSvg = document.querySelector('.ha-mask-svg');
  var panelL = document.querySelector('[data-ha-panel-l]');
  var panelR = document.querySelector('[data-ha-panel-r]');
  var media = document.querySelector('[data-ha-media]');
  var stage = document.querySelector('[data-ha-stage]');
  var lockup = document.querySelector('[data-ha-lockup]');
  var logoSlot = document.querySelector('[data-ha-logo-slot]');
  var header = document.querySelector('[data-ha-header]');
  var headerInner = document.querySelector('.ha-header-inner');
  var navLinks = gsap.utils.toArray('.ha-nav a');
  var actions = document.querySelector('[data-ha-actions]');
  var wordmark = document.querySelector('[data-ha-wordmark]');
  var copy = document.querySelector('[data-ha-copy]');
  var eyebrow = document.querySelector('[data-ha-eyebrow]');
  var title = document.querySelector('[data-ha-title]');
  var lead = document.querySelector('[data-ha-lead]');
  var cta = document.querySelector('[data-ha-cta]');
  var stats = document.querySelector('[data-ha-stats]');
  var statNums = document.querySelector('[data-ha-stat-num]');
  var skip = document.querySelector('[data-ha-skip]');

  if (!maskStage || !maskSvg || !panelL || !panelR || !lockup || !logoSlot || !stage) return;

  var plugins = [Flip, CustomEase];
  if (typeof SplitText !== 'undefined') plugins.push(SplitText);
  gsap.registerPlugin.apply(null, plugins);
  CustomEase.create('haEase', 'M0,0 C0.12,0.04 0.16,1 1,1');
  CustomEase.create('haBloom', 'M0,0 C0.05,0.95 0.2,1 1,1');

  var hasSplit = typeof SplitText !== 'undefined';
  var split = null;
  var tl = null;
  var done = false;

  function buildSplit() {
    if (split && split.revert) split.revert();
    split = null;
    if (!hasSplit || !title) return;
    try {
      split = SplitText.create(title, { type: 'words', wordsClass: 'word' });
      if (split && split.words) gsap.set(split.words, { yPercent: 120, rotate: 4, autoAlpha: 0 });
    } catch (e) {
      split = null;
    }
  }

  function animateTitle(tlRef, position) {
    if (split && split.words && split.words.length) {
      tlRef.to(split.words, {
        yPercent: 0,
        rotate: 0,
        autoAlpha: 1,
        duration: 0.75,
        stagger: 0.06,
        ease: 'power3.out',
      }, position);
    } else if (title) {
      tlRef.fromTo(title, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' }, position);
    }
  }

  function flipToHeader() {
    lockup.classList.remove('ha-lockup--vertical');
    lockup.classList.add('ha-lockup--horizontal');
    var state = Flip.getState(lockup);
    logoSlot.appendChild(lockup);
    header.classList.add('is-live');
    Flip.from(state, { duration: 0.7, ease: 'haEase', absolute: true, scale: true });
  }

  function resetLockup() {
    lockup.classList.remove('ha-lockup--horizontal');
    lockup.classList.add('ha-lockup--vertical');
    stage.appendChild(lockup);
    header.classList.remove('is-live');
  }

  function settle() {
    done = true;
    gsap.set(maskStage, { autoAlpha: 0 });
    gsap.set([panelL, panelR], { xPercent: 0 });
    if (media) gsap.set(media, { autoAlpha: 1, scale: 1 });
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(headerInner, { autoAlpha: 1, y: 0 });
    if (navLinks.length) gsap.set(navLinks, { autoAlpha: 1, y: 0 });
    if (actions) gsap.set(actions, { autoAlpha: 1, y: 0 });
    if (copy) gsap.set(copy, { autoAlpha: 1 });
    gsap.set([eyebrow, lead, cta, stats].filter(Boolean), { autoAlpha: 1, y: 0 });
    if (split && split.words) gsap.set(split.words, { yPercent: 0, rotate: 0, autoAlpha: 1 });
    else if (title) gsap.set(title, { autoAlpha: 1, y: 0 });
    flipToHeader();
    if (skip) skip.hidden = true;
  }

  function play() {
    if (tl) tl.kill();
    done = false;
    resetLockup();
    buildSplit();

    gsap.set(maskStage, { autoAlpha: 1 });
    gsap.set(maskSvg, { scale: 1, autoAlpha: 1 });
    gsap.set([panelL, panelR], { xPercent: 0 });
    if (media) gsap.set(media, { autoAlpha: 0, scale: 1.06 });
    gsap.set(stage, { autoAlpha: 0 });
    if (wordmark) gsap.set(wordmark, { autoAlpha: 0, y: 12 });
    gsap.set(headerInner, { autoAlpha: 0, y: -14 });
    if (navLinks.length) gsap.set(navLinks, { autoAlpha: 0, y: -8 });
    if (actions) gsap.set(actions, { autoAlpha: 0, y: -8 });
    if (copy) gsap.set(copy, { autoAlpha: 0 });
    gsap.set([eyebrow, lead, cta, stats].filter(Boolean), { autoAlpha: 0, y: 20 });
    if (skip) skip.hidden = false;

    tl = gsap.timeline({
      defaults: { ease: 'haEase' },
      onComplete: function () {
        done = true;
        if (skip) skip.hidden = true;
      },
    });

    tl.to(maskSvg, { scale: 18, duration: 1.35, ease: 'haBloom' })
      .to(maskStage, { autoAlpha: 0, duration: 0.45 }, '-=0.35')
      .to(panelL, { xPercent: -102, duration: 1.1, ease: 'power3.inOut' }, '-=0.95')
      .to(panelR, { xPercent: 102, duration: 1.1, ease: 'power3.inOut' }, '<');

    if (media) tl.to(media, { autoAlpha: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, '-=0.85');

    tl.to(stage, { autoAlpha: 1, duration: 0.01 }, '-=0.75');

    if (wordmark) tl.to(wordmark, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.55');

    tl.to({}, { duration: 0.25 })
      .add(flipToHeader)
      .to(headerInner, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.35');

    if (navLinks.length) {
      tl.to(navLinks, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.04 }, '-=0.3');
    }

    if (actions) tl.to(actions, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.35');

    tl.to(stage, { autoAlpha: 0, duration: 0.35 }, '-=0.15');

    if (copy) tl.to(copy, { autoAlpha: 1, duration: 0.15 }, '-=0.1');
    if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.4 });

    animateTitle(tl, '-=0.05');

    if (lead) tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.35');
    if (cta) tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.25');
    if (stats) tl.to(stats, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.15');

    if (statNums) {
      tl.fromTo(statNums, { innerText: '0' }, {
        innerText: '15+',
        duration: 1.0,
        snap: { innerText: 1 },
        ease: 'power2.out',
      }, '-=0.3');
    }
  }

  if (reduce) {
    buildSplit();
    settle();
    return;
  }

  play();

  if (skip) {
    skip.addEventListener('click', function () {
      if (!done) {
        if (tl) tl.progress(1);
        settle();
      }
    });
  }
})();
