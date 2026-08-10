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

  function init() {
    heroIntro();
    mediaParallax();
    headlineReveals();
    statCounters();
    gridReveals();
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Fonts settling changes line boxes, which invalidates split positions.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }
})();
