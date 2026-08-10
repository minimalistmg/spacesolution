/**
 * Desint-style showcase — Lenis + GSAP ScrollTrigger / SplitText
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-showcase]');
  if (!root || !window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scroll (Lenis) — skip when reduced motion
  var lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  if (reduceMotion) return;

  // Generic reveal
  gsap.utils.toArray('.desint-reveal').forEach(function (el) {
    gsap.from(el, {
      y: 36,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // Hero title lines
  var heroLines = root.querySelectorAll('.desint-hero-title .desint-line > span');
  if (heroLines.length) {
    gsap.from(heroLines, {
      yPercent: 110,
      duration: 1.05,
      ease: 'power4.out',
      stagger: 0.1,
      delay: 0.05,
    });
  }

  // Optional SplitText on eyebrows if available
  if (SplitText && typeof SplitText.create === 'function') {
    root.querySelectorAll('.desint-eyebrow').forEach(function (el) {
      try {
        var split = SplitText.create(el, { type: 'chars', aria: 'auto' });
        gsap.from(split.chars, {
          yPercent: 80,
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
          stagger: 0.015,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        });
      } catch (error) {
        /* ignore split failures */
      }
    });
  }

  // Hero image parallax
  var heroImg = root.querySelector('.desint-hero-media img');
  if (heroImg) {
    gsap.fromTo(
      heroImg,
      { scale: 1.14 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.desint-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }

  // Horizontal services rail
  var rail = root.querySelector('[data-services-rail]');
  var track = root.querySelector('[data-services-track]');
  if (rail && track) {
    var getScroll = function () {
      return Math.max(0, track.scrollWidth - window.innerWidth);
    };

    gsap.to(track, {
      x: function () {
        return -getScroll();
      },
      ease: 'none',
      scrollTrigger: {
        trigger: rail,
        start: 'top 18%',
        end: function () {
          return '+=' + getScroll();
        },
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  }

  // Process cards stagger
  var processItems = root.querySelectorAll('[data-process-item]');
  if (processItems.length) {
    gsap.from(processItems, {
      y: 40,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.desint-process-list',
        start: 'top 80%',
        once: true,
      },
    });
  }

  // CTA image zoom
  var ctaImg = root.querySelector('.desint-cta-media img');
  if (ctaImg) {
    gsap.fromTo(
      ctaImg,
      { scale: 1.15 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.desint-cta',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }
})();
