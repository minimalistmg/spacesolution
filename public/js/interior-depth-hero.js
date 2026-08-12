/**
 * InteriorDepthHero — home services auto-tour + hover takeover.
 * Expects global gsap (+ optional CustomEase). Services via data-idh-services JSON.
 */
(function () {
  'use strict';

  function whenGsap(cb) {
    if (typeof gsap !== 'undefined') {
      cb();
      return;
    }
    var tries = 0;
    var id = window.setInterval(function () {
      tries += 1;
      if (typeof gsap !== 'undefined' || tries > 40) {
        window.clearInterval(id);
        if (typeof gsap !== 'undefined') cb();
      }
    }, 50);
  }

  function mount(hero) {
    if (hero.dataset.idhReady === 'true') return;
    hero.dataset.idhReady = 'true';

    var SERVICES = [];
    try {
      SERVICES = JSON.parse(hero.getAttribute('data-idh-services') || '[]');
    } catch (e) {
      SERVICES = [];
    }
    if (!SERVICES.length) return;

    var stage = hero.querySelector('[data-idh-stage]');
    var rig = hero.querySelector('[data-idh-rig]');
    var shadow = hero.querySelector('[data-idh-shadow]');
    var glow = hero.querySelector('[data-idh-glow]');
    var sheen = hero.querySelector('[data-idh-sheen]');
    var house = hero.querySelector('[data-idh-house]');
    var fills = Array.prototype.slice.call(hero.querySelectorAll('[data-idh-fill]'));
    var zones = Array.prototype.slice.call(hero.querySelectorAll('[data-idh-zone]'));
    var navButtons = Array.prototype.slice.call(hero.querySelectorAll('[data-idh-nav-btn]'));
    var titleEl = hero.querySelector('[data-idh-title]');
    var titleText = hero.querySelector('[data-idh-title-text]');
    var leadEl = hero.querySelector('[data-idh-lead]');
    var progressBar = hero.querySelector('[data-idh-progress-bar]');
    var hint = hero.querySelector('[data-idh-hint]');
    var eyebrow = hero.querySelector('[data-idh-eyebrow]');

    if (!stage || !rig) return;

    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof CustomEase !== 'undefined') {
      gsap.registerPlugin(CustomEase);
      if (!CustomEase.get('hsIn')) {
        CustomEase.create('hsIn', 'M0,0 C0.12,0.6 0.2,1 1,1');
        CustomEase.create('hsSoft', 'M0,0 C0.22,0.61 0.36,1 1,1');
        CustomEase.create('hsCinema', 'M0,0 C0.16,0.84 0.28,1 1,1');
      }
    }

    var EASE = typeof CustomEase !== 'undefined' ? 'hsSoft' : 'power3.out';
    var EASE_CINEMA = typeof CustomEase !== 'undefined' ? 'hsCinema' : 'expo.out';
    var sceneTween = null;

    var CONFIG = {
      autoMs: 4200,
      maxRotateY: 11,
      maxRotateX: 7,
      maxTranslate: 30,
      maxZ: 42,
      maxScale: 1.05,
      shadowOpposite: 28,
      lerp: 0.085,
      leaveLerp: 0.06,
      /* Shared timing — every room uses the same copy + fill motion */
      copyOut: 0.26,
      copyIn: 0.52,
      fillIn: 0.55,
      fillOut: 0.55,
      fillPulse: 1.1,
    };

    var activeIndex = 0;
    var userControl = false;
    var progressTween = null;
    var idleTween = null;
    var pointer = { nx: 0, ny: 0, inside: false };
    var smoothed = { nx: 0, ny: 0, hover: 0 };

    function clamp(n, min, max) {
      return Math.max(min, Math.min(max, n));
    }

    function serviceById(id) {
      for (var i = 0; i < SERVICES.length; i += 1) {
        if (SERVICES[i].id === id) return { service: SERVICES[i], index: i };
      }
      return { service: SERVICES[0], index: 0 };
    }

    function setNavActive(index) {
      var id = SERVICES[index] ? SERVICES[index].id : '';
      navButtons.forEach(function (btn) {
        var on = btn.getAttribute('data-service') === id;
        btn.classList.toggle('is-active', on);
        if (on) btn.setAttribute('aria-current', 'page');
        else btn.removeAttribute('aria-current');
      });
    }

    function pulseSheen() {
      /* Stage sheen disabled — room fill is the only highlight. */
    }

    function focusFills(serviceId) {
      hero.setAttribute('data-idh-active', serviceId);

      fills.forEach(function (el) {
        var on = el.getAttribute('data-service') === serviceId;
        el.classList.toggle('is-active', on);
        gsap.killTweensOf(el);
        if (on) {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.94 },
            {
              opacity: 0.95,
              scale: 1,
              duration: CONFIG.fillIn,
              ease: EASE,
              onComplete: function () {
                gsap.to(el, {
                  opacity: 0.72,
                  scale: 1.03,
                  duration: CONFIG.fillPulse,
                  ease: 'sine.inOut',
                  yoyo: true,
                  repeat: -1,
                });
              },
            }
          );
        } else {
          gsap.to(el, {
            opacity: 0,
            scale: 0.94,
            duration: CONFIG.fillOut,
            ease: EASE,
            overwrite: true,
          });
        }
      });

      if (house) {
        gsap.to(house, {
          opacity: 1,
          scale: 1,
          duration: CONFIG.fillIn,
          ease: EASE,
          overwrite: 'auto',
        });
      }
    }

    function applyServiceCopy(service) {
      if (!titleText || !leadEl) return;
      titleText.textContent = service.titleLight + ' ' + service.titleDark;
      leadEl.textContent = service.lead;
    }

    /** Soft copy swap only — house keeps its own idle / hover motion. */
    function playScene(service, opts) {
      opts = opts || {};
      hero.style.setProperty('--idh-spot-x', service.spot[0] + '%');
      hero.style.setProperty('--idh-spot-y', service.spot[1] + '%');

      if (!titleText || !leadEl) return;

      if (opts.skipCopy || reduceMotion) {
        applyServiceCopy(service);
        gsap.set(titleText, { yPercent: 0, y: 0, opacity: 1 });
        gsap.set(leadEl, { clearProps: 'all', opacity: 1, y: 0, filter: 'none', scale: 1 });
        return;
      }

      if (sceneTween) sceneTween.kill();
      gsap.killTweensOf([titleText, leadEl]);

      sceneTween = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: function () {
          sceneTween = null;
        },
      });

      /* Exit — title + lead share the same motion */
      sceneTween.to(titleText, { opacity: 0, y: -8, duration: CONFIG.copyOut, ease: 'power1.in' }, 0);
      sceneTween.to(leadEl, { opacity: 0, y: -6, duration: CONFIG.copyOut, ease: 'power1.in' }, 0);

      sceneTween.add(function () {
        applyServiceCopy(service);
        gsap.set(titleText, { opacity: 0, y: 10 });
        gsap.set(leadEl, { opacity: 0, y: 8 });
      });

      /* Enter — identical speed for every room */
      sceneTween.to(titleText, { opacity: 1, y: 0, duration: CONFIG.copyIn });
      sceneTween.to(leadEl, { opacity: 1, y: 0, duration: CONFIG.copyIn }, '-=0.4');
    }

    function startProgress() {
      if (reduceMotion || userControl || !progressBar) return;
      if (progressTween) progressTween.kill();
      gsap.set(progressBar, { scaleX: 0 });
      progressTween = gsap.to(progressBar, {
        scaleX: 1,
        duration: CONFIG.autoMs / 1000,
        ease: 'none',
        onComplete: function () {
          if (!userControl) activate(activeIndex + 1);
        },
      });
    }

    function stopProgress() {
      if (progressTween) {
        progressTween.kill();
        progressTween = null;
      }
      if (progressBar) gsap.to(progressBar, { scaleX: 0, duration: 0.25, ease: EASE });
    }

    function startIdle() {
      if (reduceMotion || idleTween || userControl) return;
      idleTween = gsap
        .timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
        .to(rig, {
          y: 7,
          x: -5,
          rotateX: 2.2,
          rotateY: -3.2,
          z: 12,
          scale: 1.012,
          duration: 2.8,
        })
        .to(rig, {
          y: -5,
          x: 6,
          rotateX: -1.6,
          rotateY: 3.6,
          z: -6,
          scale: 0.99,
          duration: 3.2,
        })
        .to(rig, {
          y: 4,
          x: -3,
          rotateX: 1.2,
          rotateY: -2,
          z: 8,
          scale: 1.008,
          duration: 2.9,
        })
        .to(rig, {
          y: 0,
          x: 0,
          rotateX: 0,
          rotateY: 0,
          z: 0,
          scale: 1,
          duration: 2.4,
        });

      if (house) {
        gsap.to(house, {
          rotateZ: 0.6,
          duration: 3.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
      if (shadow) {
        gsap.to(shadow, {
          scaleX: 1.06,
          x: 8,
          opacity: 0.7,
          duration: 2.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }

    function stopIdle() {
      if (idleTween) {
        idleTween.kill();
        idleTween = null;
      }
      if (house) gsap.killTweensOf(house);
      if (shadow) gsap.killTweensOf(shadow);
      gsap.to(rig, {
        y: 0,
        x: 0,
        rotateX: 0,
        rotateY: 0,
        z: 0,
        scale: 1,
        duration: 0.55,
        ease: EASE,
        overwrite: 'auto',
      });
      if (house) gsap.set(house, { rotateZ: 0 });
    }

    function pauseAutoForUser() {
      userControl = true;
      stopProgress();
      stopIdle();
      if (hint) hint.textContent = 'You’re in control · leave to resume tour';
    }

    function resumeAutoSoon() {
      userControl = false;
      window.setTimeout(function () {
        if (!pointer.inside && !userControl) {
          startProgress();
          startIdle();
          if (hint) hint.textContent = 'Auto touring · hover to take control';
        }
      }, 500);
    }

    function activate(index, opts) {
      opts = opts || {};
      var next = ((index % SERVICES.length) + SERVICES.length) % SERVICES.length;
      if (next === activeIndex && !opts.force) return;
      activeIndex = next;
      var service = SERVICES[activeIndex];
      setNavActive(activeIndex);
      focusFills(service.id);
      playScene(service, { skipCopy: !!opts.skipCopy });
      if (!opts.silentSheen) pulseSheen();
      if (opts.restartProgress !== false && !userControl && !reduceMotion) startProgress();
    }

    function applyTilt(nx, ny, hover) {
      gsap.set(rig, {
        rotateX: -ny * CONFIG.maxRotateX,
        rotateY: nx * CONFIG.maxRotateY,
        x: nx * CONFIG.maxTranslate,
        y: ny * (CONFIG.maxTranslate * 0.6),
        z: hover * CONFIG.maxZ,
        scale: 1 + hover * (CONFIG.maxScale - 1),
      });
      if (shadow) {
        gsap.set(shadow, {
          x: -nx * CONFIG.shadowOpposite,
          y: -ny * CONFIG.shadowOpposite * 0.4 + 4,
          scaleX: 1 + Math.abs(nx) * 0.07,
          opacity: 0.78 + hover * 0.15,
        });
      }
      if (glow) {
        gsap.set(glow, {
          x: nx * 24,
          y: ny * 16,
          opacity: 0.4 + hover * 0.3,
        });
      }
    }

    function onTicker() {
      if (reduceMotion || !canHover) return;
      if (idleTween && !pointer.inside) return;
      var targetHover = pointer.inside ? 1 : 0;
      var lerp = pointer.inside ? CONFIG.lerp : CONFIG.leaveLerp;
      smoothed.nx += (pointer.nx - smoothed.nx) * lerp;
      smoothed.ny += (pointer.ny - smoothed.ny) * lerp;
      smoothed.hover += (targetHover - smoothed.hover) * lerp;
      if (!pointer.inside && Math.abs(smoothed.hover) < 0.001 && Math.abs(smoothed.nx) < 0.001 && Math.abs(smoothed.ny) < 0.001) {
        return;
      }
      applyTilt(smoothed.nx, smoothed.ny, smoothed.hover);
    }

    function onPointerMove(event) {
      if (!canHover || reduceMotion) return;
      var rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.nx = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      pointer.ny = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      if (!pointer.inside) {
        pointer.inside = true;
        pauseAutoForUser();
      }
    }

    function onPointerLeave() {
      pointer.inside = false;
      pointer.nx = 0;
      pointer.ny = 0;
      resumeAutoSoon();
    }

    gsap.set(rig, {
      transformPerspective: 1700,
      transformOrigin: '50% 48%',
      force3D: true,
      rotateX: 12,
      rotateY: -8,
      y: 40,
      z: -60,
      scale: 0.9,
      opacity: 0,
    });
    if (shadow) gsap.set(shadow, { opacity: 0, scale: 0.7 });
    if (glow) gsap.set(glow, { opacity: 0 });
    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 8 });
    if (titleText) gsap.set(titleText, { opacity: 0, y: 14 });
    else if (titleEl) gsap.set(titleEl, { opacity: 0, y: 14 });
    if (leadEl) gsap.set(leadEl, { opacity: 0, y: 10 });
    if (navButtons.length) gsap.set(navButtons, { opacity: 0, y: 8 });
    if (fills.length) gsap.set(fills, { opacity: 0, scale: 0.96 });
    if (progressBar) gsap.set(progressBar, { scaleX: 0 });

    if (reduceMotion) {
      gsap.set([rig, shadow, glow, eyebrow, titleEl, leadEl, navButtons], {
        clearProps: 'all',
        opacity: 1,
      });
      if (titleText) gsap.set(titleText, { yPercent: 0, y: 0, opacity: 1 });
      activate(0, { force: true, silentSheen: true, restartProgress: false });
      return;
    }

    var intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
    if (eyebrow) intro.to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, 0);

    /* Minimal elegant copy intro — soft fade + short lift */
    if (titleText) {
      intro.to(titleText, { opacity: 1, y: 0, duration: 0.65 }, 0.06);
    } else if (titleEl) {
      intro.to(titleEl, { opacity: 1, y: 0, duration: 0.6 }, 0.06);
    }

    if (leadEl) intro.to(leadEl, { opacity: 1, y: 0, duration: 0.55 }, 0.2);
    if (navButtons.length) {
      intro.to(navButtons, { opacity: 1, y: 0, duration: 0.45, stagger: 0.03 }, 0.28);
    }
    intro.to(
      rig,
      {
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        y: 0,
        z: 0,
        scale: 1,
        duration: 1.25,
        ease: EASE_CINEMA,
      },
      0.15
    );
    if (shadow) intro.to(shadow, { opacity: 0.9, scale: 1, duration: 1 }, 0.3);
    intro.add(function () {
      activate(0, { force: true, skipCopy: true });
      startIdle();
    });

    /* Hover left CTA → pause tour + show that room; click follows href */
    var nav = hero.querySelector('[data-idh-nav]');
    navButtons.forEach(function (btn) {
      btn.addEventListener('pointerenter', function () {
        if (!canHover) return;
        pauseAutoForUser();
        activate(serviceById(btn.getAttribute('data-service')).index, {
          force: true,
          restartProgress: false,
        });
      });
    });
    if (nav && canHover) {
      nav.addEventListener('pointerleave', function () {
        resumeAutoSoon();
      });
    }

    zones.forEach(function (zone) {
      zone.addEventListener('pointerenter', function () {
        if (!canHover) return;
        var serviceId = zone.getAttribute('data-service');
        if (serviceId === 'full') return;
        pauseAutoForUser();
        activate(serviceById(serviceId).index);
      });
    });

    if (canHover) {
      gsap.ticker.add(onTicker);
      stage.addEventListener('pointermove', onPointerMove, { passive: true });
      stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }

    /**
     * GSAPify Parallax Text — multi-layer scrub on the copy column.
     * Layers move at different speeds as the hero scrolls out.
     */
    function setupParallaxText() {
      if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
      gsap.registerPlugin(ScrollTrigger);

      var layerMap = {
        back: -72,
        mid: -44,
        front: -28, /* lead + room links */
      };

      Object.keys(layerMap).forEach(function (key) {
        var el = hero.querySelector('[data-idh-px="' + key + '"]');
        if (!el) return;
        gsap.to(el, {
          y: layerMap[key],
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      if (titleEl) {
        gsap.to(titleEl, {
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }

    setupParallaxText();
  }

  function boot() {
    document.querySelectorAll('[data-depth-hero]').forEach(function (hero) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            io.disconnect();
            whenGsap(function () {
              window.requestAnimationFrame(function () {
                mount(hero);
              });
            });
          });
        },
        { rootMargin: '80px 0px', threshold: 0.05 }
      );
      io.observe(hero);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
