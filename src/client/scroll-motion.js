/**
 * Scroll and entrance motion for the landing pages.
 *
 * Deliberately additive: `.fade-up` stays owned by main.js's IntersectionObserver,
 * so this file only drives the hero timeline, media parallax, headline splits and
 * stat counters. If GSAP fails to load, every element is already in its final
 * state and the page simply renders static.
 */
(function () {
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  var EASE_OUT = 'power3.out';
  var lenis = null;

  /**
   * Lenis + GSAP ticker — same pattern as showcase.
   * Keeps pinned scrub sections from shaking against native wheel scroll.
   */
  function initSmoothScroll() {
    if (!window.Lenis || lenis) return;

    // CSS smooth scroll fights ScrollTrigger scrub (jitter / shake).
    document.documentElement.style.scrollBehavior = 'auto';

    lenis = new window.Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    window.__ssLenis = lenis;
  }

  function heroIntro() {
    var reveals = gsap.utils.toArray('[data-hero-reveal]');
    var still = document.querySelector('[data-hero-parallax]');
    var reel = document.querySelector('.home-hero-reel');
    var badge = document.querySelector('.home-hero-badge');

    if (!reveals.length && !still) return;

    var tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

    if (still) {
      tl.from(still, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.1,
        ease: 'expo.out',
      }).from(
        still.querySelector('img'),
        { scale: 1.16, duration: 1.4, ease: 'expo.out' },
        '<'
      );
    }

    if (reveals.length) {
      tl.from(reveals, { y: 26, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.15);
    }

    if (reel) {
      tl.from(reel, { y: 30, opacity: 0, duration: 0.7 }, 0.55);
    }

    if (badge) {
      tl.from(badge, { scale: 0.6, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0.7);
    }
  }

  /** Slow vertical drift on large photography, clipped by the parent's overflow. */
  function mediaParallax() {
    // Only elements whose frame is taller than the image can drift without
    // exposing a gap — see the `height: 114%` rules on these two wrappers.
    var targets = gsap.utils.toArray('[data-hero-parallax] img, .service-block-image img');

    targets.forEach(function (image) {
      gsap.fromTo(
        image,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: image.closest('figure, div, section') || image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }

  /** Line-by-line reveal on display headings. */
  function headlineReveals() {
    var SplitText = window.SplitText;
    if (!SplitText) return;

    var headings = gsap.utils.toArray(
      '.section-title, .section-heading-lg, .page-hero-title, .cta h1'
    );

    headings.forEach(function (heading) {
      var split;
      try {
        split = new SplitText(heading, { type: 'lines', linesClass: 'motion-line' });
      } catch (error) {
        return;
      }

      gsap.set(heading, { perspective: 600 });
      gsap.from(split.lines, {
        yPercent: 105,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
      });
    });
  }

  /** Counts the leading number of a stat up from zero, preserving any suffix. */
  function statCounters() {
    var values = gsap.utils.toArray('.home-hero-stat-value');

    values.forEach(function (node) {
      var match = /^(\d+)(.*)$/.exec(node.textContent.trim());
      if (!match) return;

      var target = parseInt(match[1], 10);
      var suffix = match[2];
      var counter = { value: 0 };

      gsap.to(counter, {
        value: target,
        duration: 1.4,
        ease: 'power2.out',
        delay: 0.5,
        onUpdate: function () {
          node.textContent = Math.round(counter.value) + suffix;
        },
      });
    });
  }

  /** Cards rise and settle as their grid scrolls into frame. */
  function gridReveals() {
    var groups = gsap.utils.toArray(
      '.services-grid, .portfolio-grid, .why-grid, .story-band-grid, .pastel-story-grid, .process-steps, .why-steps'
    );

    groups.forEach(function (group) {
      var items = Array.prototype.slice.call(group.children);
      if (!items.length) return;

      // Take these off main.js's fade-up observer so the two systems can't
      // fight over opacity on the same node.
      items.forEach(function (item) {
        item.classList.remove('fade-up');
        item.classList.add('visible');
      });

      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 0.75,
        ease: EASE_OUT,
        stagger: 0.07,
        scrollTrigger: { trigger: group, start: 'top 82%', once: true },
      });
    });
  }

  /**
   * About gallery — pin full viewport, hold → horizontal scrub → hold.
   * Driven by Lenis + GSAP ticker when available (no native-wheel shake).
   */
  var galleryPinned = false;

  function aboutGalleryHorizontal() {
    if (galleryPinned) return;

    var section = document.querySelector('[data-about-gallery]');
    if (!section) return;

    // Wait until page-shell scale is gone so we can use a stable fixed pin.
    if (document.documentElement.classList.contains('ss-preloader-pending')) {
      return;
    }

    var pin = section.querySelector('.about-gallery-pin');
    var track = section.querySelector('[data-about-gallery-track]');
    if (!pin || !track) return;

    var slides = gsap.utils.toArray(track.querySelectorAll('.about-gallery-slide'));
    if (slides.length < 2) return;

    galleryPinned = true;
    document.documentElement.style.scrollBehavior = 'auto';

    function peekPx(vw) {
      // CSS: clamp(120px, 14vw, 200px)
      return Math.min(200, Math.max(120, Math.round(vw * 0.14)));
    }

    function syncSize() {
      var vh = window.innerHeight;
      var vw = document.documentElement.clientWidth || window.innerWidth;
      var peek = peekPx(vw);
      var slideW = Math.max(vw - peek, 320);

      section.style.setProperty('--gallery-h', vh + 'px');
      section.style.setProperty('--gallery-peek', peek + 'px');
      gsap.set(pin, { height: vh, maxHeight: vh });
      slides.forEach(function (slide) {
        gsap.set(slide, { width: slideW, flexBasis: slideW, maxWidth: slideW });
      });
      if (lenis && typeof lenis.resize === 'function') lenis.resize();
    }

    function travel() {
      var viewport = section.querySelector('.about-gallery-viewport');
      var viewW = viewport ? viewport.clientWidth : window.innerWidth;
      return Math.max(track.scrollWidth - viewW, 0);
    }

    syncSize();
    gsap.set(track, { x: 0, force3D: true });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () {
            var hold = window.innerHeight;
            var scrubDist = Math.max(travel(), window.innerHeight * (slides.length - 1));
            return '+=' + (hold + scrubDist + hold);
          },
          pin: pin,
          pinSpacing: true,
          pinType: 'fixed',
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onRefresh: syncSize,
          onToggle: function (self) {
            document.documentElement.classList.toggle('is-about-gallery-pinned', !!self.isActive);
            if (self.isActive) {
              var header = document.querySelector('.site-header');
              if (header) header.classList.add('is-hidden', 'scrolled');
            }
          },
        },
      })
      .to(track, { x: 0, duration: 1, ease: 'none' })
      .to(track, {
        x: function () {
          return -travel();
        },
        duration: function () {
          return Math.max(travel() / window.innerHeight, slides.length - 1);
        },
        ease: 'none',
      })
      .to(track, {
        x: function () {
          return -travel();
        },
        duration: 1,
        ease: 'none',
      });

    window.addEventListener('resize', function () {
      syncSize();
      ScrollTrigger.refresh();
    });
  }

  function init() {
    initSmoothScroll();
    heroIntro();
    mediaParallax();
    headlineReveals();
    statCounters();
    gridReveals();
    aboutGalleryHorizontal();
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function refreshTriggers() {
    ScrollTrigger.refresh();
  }

  // Fonts / late layout (preloader, images) — keep pin distances accurate
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshTriggers);
  }

  window.addEventListener('load', refreshTriggers);

  // Preloader scales [data-ss-page-shell]; build gallery pin + refresh after clear.
  window.addEventListener('ss:preloader-done', function () {
    requestAnimationFrame(function () {
      aboutGalleryHorizontal();
      refreshTriggers();
      window.setTimeout(function () {
        if (lenis && typeof lenis.resize === 'function') lenis.resize();
        refreshTriggers();
      }, 50);
    });
  });

  window.setTimeout(refreshTriggers, 600);

  // If preloader already finished before this script ran, remeasure once more.
  if (!document.documentElement.classList.contains('ss-preloader-pending')) {
    window.setTimeout(refreshTriggers, 0);
  }
})();
