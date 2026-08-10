/**
 * Concept 17 — Editorial Curtain
 * Project photography cycles behind an editorial HUD; the image then parts
 * as a curtain while the brand mark holds centre. Total ≈ 2.95s.
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var FRAMES = [
    {
      src: '../../../src/assets/images/hero/kitchen-2.jpeg',
      caption: 'Modular Kitchen · Kuvempunagar',
    },
    {
      src: '../../../src/assets/images/hero/bedroom.jpg',
      caption: 'Master Bedroom · Vijayanagar',
    },
    {
      src: '../../../src/assets/images/projects/home-interior-3.jpg',
      caption: 'Living & Dining · Jayalakshmipuram',
    },
  ];

  var CLOSED = 'inset(0% 0% 100% 0%)';
  var OPEN = 'inset(0% 0% 0% 0%)';

  var preloader = document.querySelector('[data-pl-preloader]');
  var stacks = Array.prototype.slice.call(document.querySelectorAll('[data-pl-stack]'));
  var halfTop = document.querySelector('.pl-half--top');
  var halfBottom = document.querySelector('.pl-half--bottom');
  var hud = document.querySelector('[data-pl-hud]');
  var counterEl = document.querySelector('[data-pl-counter]');
  var captionEl = document.querySelector('[data-pl-caption]');
  var ruleEl = document.querySelector('[data-pl-rule]');
  var lockupHost = document.querySelector('[data-pl-lockup-host]');
  var skipBtn = document.querySelector('[data-pl-skip]');

  var lockup = BrandMark.mountLockup(lockupHost, {
    uid: 'ec',
    iconSrc: '../../../brand/icon-source.png',
    center: true,
    dark: true,
  });
  var fill = lockup.querySelector('[data-brand-fill]');
  var solutionEl = lockup.querySelector('[data-brand-solution]');

  gsap.registerPlugin(CustomEase);
  CustomEase.create('ecWipe', 'M0,0 C0.62,0 0.2,1 1,1');
  CustomEase.create('ecPart', 'M0,0 C0.7,0 0.2,1 1,1');

  var tl = null;
  var exited = false;

  /** Build the frame stack into both curtain halves. */
  function buildFrames() {
    stacks.forEach(function (stack) {
      var html = '';
      FRAMES.forEach(function (f, i) {
        html +=
          '<div class="pl-frame" data-frame="' + i + '">' +
          '<img src="' + f.src + '" alt="" decoding="async" />' +
          '</div>';
      });
      html += '<div class="pl-grade"></div><div class="pl-grain"></div>';
      stack.innerHTML = html;
    });
  }

  /** All frames at a given index, across both halves. */
  function frameAt(i) {
    return Array.prototype.slice.call(
      document.querySelectorAll('.pl-frame[data-frame="' + i + '"]')
    );
  }

  function imagesAt(i) {
    return frameAt(i).map(function (f) {
      return f.querySelector('img');
    });
  }

  function setCounter(v) {
    if (counterEl) counterEl.textContent = String(Math.round(v)).padStart(3, '0');
  }

  function finish() {
    if (exited) return;
    exited = true;
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
    if (skipBtn) skipBtn.hidden = true;
  }

  /** Skip: collapse whatever is on screen quickly rather than jump-cutting. */
  function skip() {
    if (exited) return;
    if (tl) tl.kill();
    gsap.to(preloader, {
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: finish,
    });
  }

  function settle() {
    buildFrames();
    gsap.set(frameAt(FRAMES.length - 1), { clipPath: OPEN });
    gsap.set(lockupHost, { clipPath: OPEN, autoAlpha: 1 });
    gsap.set(fill, { opacity: 1 });
    gsap.set(solutionEl, { letterSpacing: '0.32em' });
    setCounter(100);
    finish();
  }

  /** Local images decode fast; cap the wait so a cold cache can't stall. */
  function whenFramesReady(cb) {
    var imgs = Array.prototype.slice.call(preloader.querySelectorAll('.pl-frame img'));
    var pending = imgs.length;
    var done = false;

    function go() {
      if (done) return;
      done = true;
      cb();
    }

    if (!pending) return go();

    imgs.forEach(function (img) {
      if (img.complete) {
        if (--pending === 0) go();
        return;
      }
      img.addEventListener('load', function () {
        if (--pending === 0) go();
      });
      img.addEventListener('error', function () {
        if (--pending === 0) go();
      });
    });

    setTimeout(go, 700);
  }

  function play() {
    gsap.set(frameAt(0), { clipPath: OPEN });
    gsap.set(frameAt(1), { clipPath: CLOSED });
    gsap.set(frameAt(2), { clipPath: CLOSED });
    gsap.set(imagesAt(0), { scale: 1.14 });
    gsap.set(imagesAt(1), { scale: 1.14 });
    gsap.set(imagesAt(2), { scale: 1.14 });

    gsap.set(hud, { autoAlpha: 0 });
    gsap.set(lockupHost, { clipPath: CLOSED, y: 16, autoAlpha: 1 });
    gsap.set(fill, { opacity: 1 });
    gsap.set(solutionEl, { letterSpacing: '0.14em' });
    setCounter(0);

    var count = { v: 0 };

    tl = gsap.timeline({ onComplete: finish });

    /* I — Establish: first frame drifts, HUD and hairline come up */
    tl.to(hud, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0)
      .to(imagesAt(0), { scale: 1.0, duration: 1.5, ease: 'power1.out' }, 0)
      .to(ruleEl, { width: '100%', duration: 1.6, ease: 'power1.inOut' }, 0)
      .to(
        count,
        {
          v: 100,
          duration: 1.6,
          ease: 'power1.inOut',
          onUpdate: function () {
            setCounter(count.v);
          },
        },
        0
      )

      /* II — Second project wipes up */
      .to(frameAt(1), { clipPath: OPEN, duration: 0.7, ease: 'ecWipe' }, 0.55)
      .to(imagesAt(1), { scale: 1.0, duration: 1.3, ease: 'power1.out' }, 0.55)
      .call(
        function () {
          if (captionEl) captionEl.textContent = FRAMES[1].caption;
        },
        null,
        0.72
      )

      /* III — Third project wipes up */
      .to(frameAt(2), { clipPath: OPEN, duration: 0.7, ease: 'ecWipe' }, 1.1)
      .to(imagesAt(2), { scale: 1.0, duration: 1.3, ease: 'power1.out' }, 1.1)
      .call(
        function () {
          if (captionEl) captionEl.textContent = FRAMES[2].caption;
        },
        null,
        1.27
      )

      /* IV — HUD clears, the mark wipes in over the photography */
      .to(hud, { autoAlpha: 0, duration: 0.35, ease: 'power2.inOut' }, 1.55)
      .to(
        lockupHost,
        { clipPath: OPEN, y: 0, duration: 0.62, ease: 'power3.out' },
        1.62
      )
      .to(
        solutionEl,
        { letterSpacing: '0.32em', duration: 0.7, ease: 'power3.out' },
        1.78
      )

      /* V — The photograph parts; the mark rides out last */
      .to(halfTop, { yPercent: -100, duration: 0.6, ease: 'ecPart' }, 2.35)
      .to(halfBottom, { yPercent: 100, duration: 0.6, ease: 'ecPart' }, 2.35)
      .to(ruleEl.parentNode, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 2.35)
      .to(
        lockupHost,
        { scale: 1.05, autoAlpha: 0, duration: 0.42, ease: 'power2.in' },
        2.53
      );
  }

  if (reduce) {
    settle();
    return;
  }

  buildFrames();
  whenFramesReady(play);
  if (skipBtn) skipBtn.addEventListener('click', skip);
})();
