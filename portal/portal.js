/**
 * Portal Scrub — homepage header + hero landing
 * GSAP: ScrollTrigger · DrawSVG · Flip · SplitText · CustomEase · Observer
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hero = document.querySelector('[data-portal-hero]');
  var logo = document.querySelector('[data-portal-logo]');
  var logoSlot = document.querySelector('[data-logo-slot]');
  var mark = document.querySelector('[data-portal-mark]');
  var stage = document.querySelector('[data-portal-stage]');
  var ring = document.querySelector('[data-portal-ring]');
  var hint = document.querySelector('[data-portal-hint]');
  var media = document.querySelector('.portal-hero-media');
  var video = document.querySelector('[data-portal-video]');
  var header = document.querySelector('[data-portal-header]');
  var headerInner = header ? header.querySelector('.header-inner') : null;
  var headerLine = document.querySelector('[data-header-line]');
  var nav = document.querySelector('[data-portal-nav]');
  var actions = document.querySelector('[data-portal-actions]');
  var copy = document.querySelector('[data-portal-copy]');
  var eyebrow = document.querySelector('[data-portal-eyebrow]');
  var title = document.querySelector('[data-portal-title]');
  var lead = document.querySelector('[data-portal-lead]');
  var ctas = document.querySelector('[data-portal-ctas]');
  var gallery = document.querySelector('[data-portal-gallery]');
  var thumbs = gsap.utils.toArray('[data-portal-gallery] .portal-thumb');
  var progressBar = document.querySelector('[data-portal-progress]');

  if (!hero || !logo || !logoSlot || !ring || !media) return;

  var plugins = [Flip, ScrollTrigger, SplitText, CustomEase];
  if (typeof DrawSVGPlugin !== 'undefined') plugins.push(DrawSVGPlugin);
  if (typeof Observer !== 'undefined') plugins.push(Observer);
  gsap.registerPlugin.apply(null, plugins);

  CustomEase.create('portalOpen', 'M0,0 C0.16,0.08 0.2,1 1,1');
  CustomEase.create('galleryDock', 'M0,0 C0.2,0.9 0.22,1 1,1');

  var hasDrawSVG = typeof DrawSVGPlugin !== 'undefined';
  var logoFlipped = false;
  var videoPlaying = false;
  var split = null;

  function playVideo() {
    if (!video || reduceMotion || videoPlaying) return;
    videoPlaying = true;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  function moveLogo(toHeader) {
    if (toHeader === logoFlipped) return;
    if (toHeader && logo.parentElement === logoSlot) {
      logoFlipped = true;
      header.classList.add('is-ready');
      return;
    }
    if (!toHeader && logo.parentElement !== logoSlot) {
      logoFlipped = false;
      return;
    }

    var state = Flip.getState(logo);

    if (toHeader) {
      logoSlot.appendChild(logo);
      logo.classList.remove('portal-logo--seal');
      logo.classList.add('portal-logo--header');
      logoFlipped = true;
      header.classList.add('is-ready');
    } else {
      mark.appendChild(logo);
      logo.classList.remove('portal-logo--header');
      logo.classList.add('portal-logo--seal');
      logoFlipped = false;
      if (header) header.classList.remove('is-ready');
    }

    Flip.from(state, {
      duration: 0.55,
      ease: 'portalOpen',
      absolute: true,
      scale: true,
      overwrite: 'auto',
    });
  }

  function showSettled() {
    gsap.set(media, { clipPath: 'circle(150% at 50% 48%)', scale: 1 });
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(headerInner, { autoAlpha: 1 });
    gsap.set(headerLine, { scaleX: 1 });
    gsap.set(copy, { autoAlpha: 1 });
    gsap.set([eyebrow, lead, ctas], { autoAlpha: 1, y: 0 });
    gsap.set(gallery, { autoAlpha: 1, x: 0, y: 0 });
    gsap.set(thumbs, { autoAlpha: 1, x: 0, y: 0 });
    gsap.set(progressBar, { scaleY: 1 });
    moveLogo(true);
    playVideo();
  }

  function buildSplit() {
    if (split) {
      split.revert();
      split = null;
    }
    var config = { type: 'lines', linesClass: 'line', mask: 'lines' };
    split =
      typeof SplitText.create === 'function'
        ? SplitText.create(title, config)
        : new SplitText(title, config);
    gsap.set(split.lines, { yPercent: 110, autoAlpha: 0 });
  }

  function initScrub() {
    buildSplit();

    gsap.set(ring, hasDrawSVG ? { drawSVG: '0%' } : { strokeDasharray: 1000, strokeDashoffset: 1000 });
    gsap.set(media, { clipPath: 'circle(0% at 50% 48%)', scale: 1.08 });
    gsap.set(headerInner, { autoAlpha: 0, y: -12 });
    gsap.set(headerLine, { scaleX: 0 });
    gsap.set(copy, { autoAlpha: 0 });
    gsap.set(eyebrow, { autoAlpha: 0, y: 12 });
    gsap.set(lead, { autoAlpha: 0, y: 18 });
    gsap.set(ctas, { autoAlpha: 0, y: 18 });
    gsap.set(gallery, { autoAlpha: 0, xPercent: 0 });
    gsap.set(thumbs, {
      autoAlpha: 0,
      x: window.innerWidth < 901 ? 0 : 80,
      y: window.innerWidth < 901 ? 60 : 0,
    });
    gsap.set(progressBar, { scaleY: 0, transformOrigin: 'top center' });
    gsap.set(hint, { autoAlpha: 1 });
    gsap.set(mark, { scale: 1, autoAlpha: 1 });

    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=280%',
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          gsap.set(progressBar, { scaleY: self.progress });
          if (self.progress > 0.18) playVideo();
          moveLogo(self.progress >= 0.52);
        },
      },
    });

    /* 1 — Seal the portal ring */
    if (hasDrawSVG) {
      tl.to(ring, { drawSVG: '100%', duration: 1.1 }, 0);
    } else {
      tl.to(ring, { strokeDashoffset: 0, duration: 1.1 }, 0);
    }
    tl.to(hint, { autoAlpha: 0.35, duration: 0.4 }, 0.3);

    /* 2 — Portal opens into video */
    tl.to(
      media,
      {
        clipPath: 'circle(38% at 50% 48%)',
        scale: 1.04,
        duration: 1.2,
        ease: 'portalOpen',
      },
      0.85
    );
    tl.to(mark, { scale: 1.12, duration: 1.0 }, 0.9);
    tl.to(hint, { autoAlpha: 0, duration: 0.35 }, 1.1);

    /* 3 — Full open + header draw + Flip logo */
    tl.to(
      media,
      {
        clipPath: 'circle(150% at 50% 48%)',
        scale: 1,
        duration: 1.35,
        ease: 'portalOpen',
      },
      1.85
    );
    tl.to(stage, { autoAlpha: 0, duration: 0.55 }, 2.2);
    tl.to(headerLine, { scaleX: 1, duration: 0.9 }, 2.15);
    tl.to(headerInner, { autoAlpha: 1, y: 0, duration: 0.7 }, 2.25);

    /* 4 — SplitText lines + copy */
    tl.to(copy, { autoAlpha: 1, duration: 0.2 }, 2.7);
    tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.45 }, 2.75);
    tl.to(
      split.lines,
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      },
      2.85
    );
    tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.5 }, 3.2);
    tl.to(ctas, { autoAlpha: 1, y: 0, duration: 0.5 }, 3.35);

    /* 5 — Gallery dock (springy) */
    tl.to(
      gallery,
      {
        autoAlpha: 1,
        duration: 0.35,
      },
      3.55
    );
    tl.to(
      thumbs,
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'galleryDock',
      },
      3.6
    );

    /* Hold the finished composition briefly in scrub space */
    tl.to({}, { duration: 0.55 });

    return tl;
  }

  function initObserverNudge() {
    if (typeof Observer === 'undefined' || reduceMotion) return;

    var nudged = false;
    Observer.create({
      target: window,
      type: 'wheel,touch',
      onDown: function () {
        if (nudged || window.scrollY > 40) return;
        nudged = true;
        gsap.to(hint, {
          y: 10,
          autoAlpha: 0.8,
          duration: 0.35,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        });
      },
      tolerance: 20,
      preventDefault: false,
    });
  }

  if (reduceMotion) {
    showSettled();
    return;
  }

  initScrub();
  initObserverNudge();
  ScrollTrigger.refresh();
})();
