/**
 * Home services hero — auto-play service tour + hover takeover.
 * Left copy syncs with active offering; right stage shows open-house + cutouts.
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  var SERVICES = [
    {
      id: 'kitchen',
      nav: 'Kitchen',
      titleLight: 'Modular',
      titleDark: 'Kitchen',
      label: 'Modular Kitchen',
      lead:
        'Layouts and storage built for how you cook every day — factory-made, moisture-ready, and installed by one Mysuru team.',
      cta: 'Explore Kitchens',
      href: '/modular-kitchen',
      spot: [28, 38],
    },
    {
      id: 'wardrobe',
      nav: 'Wardrobes',
      titleLight: 'Wardrobes',
      titleDark: '& Storage',
      label: 'Wardrobes & Storage',
      lead:
        'Floor-to-ceiling closets tailored to your room and routine — sliding, hinged, or walk-in systems that stay calm.',
      cta: 'Explore Storage',
      href: '/wardrobes-storage',
      spot: [72, 40],
    },
    {
      id: 'living',
      nav: 'Living',
      titleLight: 'Living',
      titleDark: '& Dining',
      label: 'Living & Dining',
      lead:
        'Seating, flow, and lighting for the heart of the home — TV units, dining storage, and pathways that feel open.',
      cta: 'Explore Living',
      href: '/living-dining',
      spot: [48, 58],
    },
    {
      id: 'bedroom',
      nav: 'Bedrooms',
      titleLight: 'Restful',
      titleDark: 'Bedrooms',
      label: 'Bedrooms',
      lead:
        'Private retreats with storage beds, soft finishes, and wardrobes planned so clutter never steals the calm.',
      cta: 'Explore Bedrooms',
      href: '/bedrooms',
      spot: [74, 36],
    },
    {
      id: 'pooja',
      nav: 'Pooja',
      titleLight: 'Pooja',
      titleDark: 'Room',
      label: 'Pooja Room',
      lead:
        'Quiet mandir spaces with respectful proportions, warm timber, and durable finishes for daily ritual use.',
      cta: 'Explore Pooja',
      href: '/pooja-room',
      spot: [30, 68],
    },
    {
      id: 'full',
      nav: 'Full Home',
      titleLight: 'Full Home',
      titleDark: 'Interiors',
      label: 'Full Home Interiors',
      lead:
        'One design language from kitchen to bedrooms — turnkey planning, factory craft, and a single accountable handover.',
      cta: 'Plan Full Home',
      href: '/full-home-interiors',
      spot: [52, 46],
    },
  ];

  var hero = document.querySelector('[data-home-services-hero]');
  if (!hero) return;

  var stage = hero.querySelector('[data-hs-stage]');
  var rig = hero.querySelector('[data-hs-rig]');
  var shadow = hero.querySelector('[data-hs-shadow]');
  var glow = hero.querySelector('[data-hs-glow]');
  var sheen = hero.querySelector('[data-hs-sheen]');
  var house = hero.querySelector('[data-hs-house]');
  var fills = Array.prototype.slice.call(hero.querySelectorAll('[data-hs-fill]'));
  var zones = Array.prototype.slice.call(hero.querySelectorAll('[data-hs-zone]'));
  var navHost = hero.querySelector('[data-hs-nav]');
  var titleLight = hero.querySelector('[data-hs-title-light]');
  var titleDark = hero.querySelector('[data-hs-title-dark]');
  var titleEl = hero.querySelector('[data-hs-title]');
  var leadEl = hero.querySelector('[data-hs-lead]');
  var cta = hero.querySelector('[data-hs-cta]');
  var ctaLabel = hero.querySelector('[data-hs-cta-label]');
  var ctaSheen = hero.querySelector('[data-hs-cta-sheen]');
  var progress = hero.querySelector('[data-hs-progress]');
  var hint = hero.querySelector('[data-hs-hint]');
  var eyebrow = hero.querySelector('[data-hs-eyebrow]');

  if (!stage || !rig || !navHost) return;

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof CustomEase !== 'undefined') {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('hsIn', 'M0,0 C0.12,0.6 0.2,1 1,1');
    CustomEase.create('hsSoft', 'M0,0 C0.22,0.61 0.36,1 1,1');
    CustomEase.create('hsCinema', 'M0,0 C0.16,0.84 0.28,1 1,1');
  }
  if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);

  var EASE = typeof CustomEase !== 'undefined' ? 'hsSoft' : 'power3.out';
  var EASE_IN = typeof CustomEase !== 'undefined' ? 'hsIn' : 'power4.out';
  var EASE_CINEMA = typeof CustomEase !== 'undefined' ? 'hsCinema' : 'expo.out';

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
  };

  /* Build nav pills */
  var navButtons = SERVICES.map(function (service, index) {
    var li = document.createElement('li');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hs-copy__nav-btn' + (index === 0 ? ' is-active' : '');
    btn.textContent = service.nav;
    btn.setAttribute('data-service', service.id);
    btn.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    li.appendChild(btn);
    navHost.appendChild(li);
    return btn;
  });

  var activeIndex = 0;
  var userControl = false;
  var autoTimer = null;
  var progressTween = null;
  var idleTween = null;
  var copyAnimating = false;

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
    navButtons.forEach(function (btn, i) {
      var on = i === index;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function pulseSheen() {
    /* Stage sheen disabled — room fill is the only highlight. */
  }

  function focusFills(serviceId) {
    fills.forEach(function (el) {
      var on = el.getAttribute('data-service') === serviceId;
      el.classList.toggle('is-active', on);
      gsap.killTweensOf(el);
      if (on) {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.82 },
          {
            opacity: 0.95,
            scale: 1,
            duration: 0.55,
            ease: EASE,
            onComplete: function () {
              gsap.to(el, {
                opacity: 0.72,
                scale: 1.04,
                duration: 1.1,
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
          scale: 0.88,
          duration: 0.4,
          ease: EASE,
          overwrite: true,
        });
      }
    });

    if (house) {
      gsap.to(house, {
        opacity: 1,
        scale: serviceId === 'full' ? 1.02 : 1,
        duration: 0.8,
        ease: EASE,
        overwrite: 'auto',
      });
    }
  }

  function updateCopy(service) {
    if (!titleLight || !titleDark || !leadEl || !cta || !ctaLabel) return;
    copyAnimating = true;

    var tl = gsap.timeline({
      defaults: { ease: EASE },
      onComplete: function () {
        copyAnimating = false;
      },
    });

    tl.to([titleLight, titleDark, leadEl, ctaLabel], {
      opacity: 0,
      y: 10,
      duration: 0.28,
      stagger: 0.02,
    });

    tl.add(function () {
      titleLight.textContent = service.titleLight;
      titleDark.textContent = service.titleDark;
      leadEl.textContent = service.lead;
      ctaLabel.textContent = service.cta;
      cta.setAttribute('href', service.href);
    });

    tl.to([titleLight, titleDark, leadEl, ctaLabel], {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.04,
      ease: EASE_CINEMA,
    });

    hero.style.setProperty('--hs-spot-x', service.spot[0] + '%');
    hero.style.setProperty('--hs-spot-y', service.spot[1] + '%');
  }

  function activate(index, opts) {
    opts = opts || {};
    var next = ((index % SERVICES.length) + SERVICES.length) % SERVICES.length;
    if (next === activeIndex && !opts.force) return;

    activeIndex = next;
    var service = SERVICES[activeIndex];
    setNavActive(activeIndex);
    focusFills(service.id);
    updateCopy(service);
    if (!opts.silentSheen) pulseSheen();

    if (opts.restartProgress !== false && !userControl && !reduceMotion) {
      startProgress();
    }
  }

  function startProgress() {
    if (!progress) return;
    if (progressTween) progressTween.kill();
    gsap.set(progress, { scaleX: 0 });
    progressTween = gsap.to(progress, {
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
    if (progress) gsap.to(progress, { scaleX: 0, duration: 0.25, ease: EASE });
  }

  function startAuto() {
    if (reduceMotion || userControl) return;
    startProgress();
    if (hint) {
      gsap.to(hint, { opacity: 1, duration: 0.35 });
      hint.textContent = 'Auto touring · hover to take control';
    }
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
        startAuto();
        startIdle();
      }
    }, 500);
  }

  function startIdle() {
    if (reduceMotion || idleTween || userControl) return;
    idleTween = gsap
      .timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
      .to(rig, {
        y: 12,
        x: -8,
        rotateX: 3.2,
        rotateY: -4.5,
        z: 18,
        scale: 1.02,
        duration: 2.6,
      })
      .to(rig, {
        y: -8,
        x: 10,
        rotateX: -2.4,
        rotateY: 5.2,
        z: -10,
        scale: 0.985,
        duration: 3.1,
      })
      .to(rig, {
        y: 6,
        x: -4,
        rotateX: 1.8,
        rotateY: -2.8,
        z: 12,
        scale: 1.015,
        duration: 2.8,
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

  /* Intro */
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
  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 12 });
  if (titleEl) gsap.set(titleEl, { opacity: 0, y: 20 });
  if (leadEl) gsap.set(leadEl, { opacity: 0, y: 16 });
  if (cta) gsap.set(cta, { opacity: 0, y: 16 });
  gsap.set(navButtons, { opacity: 0, y: 10 });
  if (fills.length) gsap.set(fills, { opacity: 0, scale: 0.88 });

  if (reduceMotion) {
    gsap.set([rig, shadow, glow, eyebrow, titleEl, leadEl, cta, navButtons], {
      clearProps: 'all',
      opacity: 1,
    });
    activate(0, { force: true, silentSheen: true, restartProgress: false });
    return;
  }

  var intro = gsap.timeline({ defaults: { ease: EASE_IN } });
  if (eyebrow) intro.to(eyebrow, { opacity: 1, y: 0, duration: 0.55 }, 0);
  if (titleEl) intro.to(titleEl, { opacity: 1, y: 0, duration: 0.7 }, 0.08);
  if (leadEl) intro.to(leadEl, { opacity: 1, y: 0, duration: 0.6 }, 0.2);
  if (cta) intro.to(cta, { opacity: 1, y: 0, duration: 0.55 }, 0.32);
  intro.to(navButtons, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04 }, 0.4);
  intro.to(
    rig,
    { opacity: 1, rotateX: 0, rotateY: 0, y: 0, z: 0, scale: 1, duration: 1.25, ease: EASE_CINEMA },
    0.15
  );
  if (shadow) intro.to(shadow, { opacity: 0.9, scale: 1, duration: 1 }, 0.3);
  if (glow) intro.to(glow, { opacity: 0.55, duration: 1 }, 0.28);
  intro.add(function () {
    activate(0, { force: true });
    startIdle();
    if (ctaSheen) {
      gsap.to(ctaSheen, {
        x: '220%',
        duration: 1.35,
        ease: 'power2.inOut',
        repeat: -1,
        repeatDelay: 3,
      });
    }
  });

  /* Events */
  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var found = serviceById(btn.getAttribute('data-service'));
      pauseAutoForUser();
      activate(found.index, { force: true });
    });
  });

  zones.forEach(function (zone) {
    zone.addEventListener('pointerenter', function () {
      if (!canHover) return;
      var serviceId = zone.getAttribute('data-service');
      if (serviceId === 'full') return;
      pauseAutoForUser();
      activate(serviceById(serviceId).index);
    });
    zone.addEventListener('focus', function () {
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
  } else {
    startAuto();
  }
})();
