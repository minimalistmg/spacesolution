/**
 * Atelier Cinema — high-end GSAP interior depth hero.
 * CustomEase · SplitText · ticker lerp · layered 3D · spotlight · sheen · slides
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  var hero = document.querySelector('[data-atelier-hero]');
  if (!hero) return;

  var stage = hero.querySelector('[data-ac-stage]');
  var rig = hero.querySelector('[data-ac-rig]');
  var shadow = hero.querySelector('[data-ac-shadow]');
  var glow = hero.querySelector('[data-ac-glow]');
  var sheen = hero.querySelector('[data-ac-sheen]');
  var spotlight = hero.querySelector('[data-ac-spotlight]');
  var frame = hero.querySelector('[data-ac-frame]');
  var slides = hero.querySelectorAll('[data-ac-slide]');
  var hotspots = hero.querySelectorAll('[data-ac-hotspot]');
  var dustHost = hero.querySelector('[data-ac-dust]');
  var cta = hero.querySelector('[data-ac-cta]');
  var ctaSheen = hero.querySelector('[data-ac-cta-sheen]');
  var stats = hero.querySelectorAll('[data-ac-stat]');
  var title = hero.querySelector('[data-ac-title]');
  var lead = hero.querySelector('[data-ac-lead]');
  var eyebrow = hero.querySelector('[data-ac-eyebrow]');
  var hint = hero.querySelector('[data-ac-hint]');

  if (!stage || !rig) return;

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof CustomEase !== 'undefined') {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('atelierIn', 'M0,0 C0.11,0.54 0.18,1 1,1');
    CustomEase.create('atelierSoft', 'M0,0 C0.22,0.61 0.36,1 1,1');
    CustomEase.create('atelierCinema', 'M0,0 C0.16,0.84 0.28,1 1,1');
  }

  if (typeof SplitText !== 'undefined') {
    gsap.registerPlugin(SplitText);
  }

  var EASE_IN = typeof CustomEase !== 'undefined' ? 'atelierIn' : 'power4.out';
  var EASE_SOFT = typeof CustomEase !== 'undefined' ? 'atelierSoft' : 'power3.out';
  var EASE_CINEMA = typeof CustomEase !== 'undefined' ? 'atelierCinema' : 'expo.out';

  var CONFIG = {
    maxRotateY: 9,
    maxRotateX: 6,
    maxTranslate: 28,
    maxZ: 36,
    maxScale: 1.045,
    shadowOpposite: 26,
    glowTravel: 30,
    lerp: 0.075,
    leaveLerp: 0.055,
    slideEvery: 4800,
    magnetic: 10,
  };

  /* —— Dust motes —— */
  var dust = [];
  if (dustHost && !reduceMotion) {
    for (var d = 0; d < 18; d += 1) {
      var mote = document.createElement('span');
      mote.style.left = Math.random() * 100 + '%';
      mote.style.top = Math.random() * 100 + '%';
      dustHost.appendChild(mote);
      dust.push(mote);
    }
  }

  /* —— Intro state —— */
  gsap.set(rig, {
    transformPerspective: 1600,
    transformOrigin: '50% 48%',
    force3D: true,
    rotateX: 14,
    rotateY: -10,
    z: -80,
    y: 60,
    scale: 0.88,
    opacity: 0,
  });

  if (shadow) gsap.set(shadow, { force3D: true, scale: 0.6, opacity: 0, y: 20 });
  if (glow) gsap.set(glow, { force3D: true, opacity: 0, scale: 0.7 });
  if (spotlight) gsap.set(spotlight, { opacity: 0 });
  if (sheen) gsap.set(sheen, { opacity: 0, xPercent: -140 });
  if (hint) gsap.set(hint, { opacity: 0, y: 10 });
  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 16 });
  if (lead) gsap.set(lead, { opacity: 0, y: 22 });
  if (cta) gsap.set(cta, { opacity: 0, y: 24, scale: 0.96 });
  if (stats.length) gsap.set(stats, { opacity: 0, y: 18 });
  if (hotspots.length) gsap.set(hotspots, { opacity: 0, y: 12 });
  if (dust.length) gsap.set(dust, { opacity: 0 });

  slides.forEach(function (slide, i) {
    gsap.set(slide, {
      opacity: i === 0 ? 1 : 0,
      scale: i === 0 ? 1 : 1.06,
      z: 0,
      force3D: true,
    });
    if (i === 0) slide.classList.add('is-active');
  });

  var pointer = { nx: 0, ny: 0, inside: false, sx: 0.58, sy: 0.42 };
  var smoothed = { nx: 0, ny: 0, hover: 0 };
  var slideIndex = 0;
  var slideTimer = null;
  var idleTween = null;
  var hotspotActive = null;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function splitTitle() {
    if (!title) return null;
    if (typeof SplitText === 'undefined') {
      gsap.set(title, { opacity: 0, y: 28 });
      return null;
    }
    return new SplitText(title, { type: 'lines,words,chars', linesClass: 'line' });
  }

  var split = splitTitle();
  if (split) {
    gsap.set(split.chars, { opacity: 0, yPercent: 120, rotateX: -50 });
  }

  function playIntro() {
    var tl = gsap.timeline({ defaults: { ease: EASE_IN } });

    if (eyebrow) {
      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7 }, 0.05);
    }

    if (split) {
      tl.to(
        split.chars,
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 1.05,
          stagger: { each: 0.018, from: 'start' },
          ease: EASE_CINEMA,
        },
        0.12
      );
    } else if (title) {
      tl.to(title, { opacity: 1, y: 0, duration: 0.9 }, 0.12);
    }

    if (lead) tl.to(lead, { opacity: 1, y: 0, duration: 0.75 }, 0.45);
    if (cta) tl.to(cta, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 0.58);

    if (stats.length) {
      tl.to(
        stats,
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: EASE_SOFT },
        0.5
      );
    }

    tl.to(
      rig,
      {
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        z: 0,
        y: 0,
        scale: 1,
        duration: 1.45,
        ease: EASE_CINEMA,
      },
      0.2
    );

    if (shadow) {
      tl.to(shadow, { opacity: 0.9, scale: 1, y: 0, duration: 1.2, ease: EASE_SOFT }, 0.35);
    }
    if (glow) {
      tl.to(glow, { opacity: 0.55, scale: 1, duration: 1.3, ease: EASE_SOFT }, 0.3);
    }
    if (hint) tl.to(hint, { opacity: 1, y: 0, duration: 0.55 }, 1.15);

    if (sheen) {
      tl.to(sheen, { opacity: 0.85, duration: 0.2 }, 0.85);
      tl.to(sheen, { xPercent: 140, duration: 1.35, ease: EASE_SOFT }, 0.85);
      tl.to(sheen, { opacity: 0, duration: 0.35 }, 1.9);
    }

    if (dust.length) {
      tl.add(function () {
        dust.forEach(function (mote, i) {
          gsap.to(mote, {
            opacity: gsap.utils.random(0.15, 0.55),
            duration: 1.2,
            delay: i * 0.04,
          });
          gsap.to(mote, {
            y: gsap.utils.random(-40, 40),
            x: gsap.utils.random(-24, 24),
            duration: gsap.utils.random(4.5, 7.5),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.08,
          });
        });
      }, 0.9);
    }

    tl.add(function () {
      startIdle();
      if (canHover && !reduceMotion) startSlides();
      if (ctaSheen) {
        gsap.to(ctaSheen, {
          x: '220%',
          duration: 1.4,
          ease: 'power2.inOut',
          repeat: -1,
          repeatDelay: 3.2,
        });
      }
    });

    return tl;
  }

  function startIdle() {
    if (reduceMotion || idleTween) return;
    idleTween = gsap.to(rig, {
      y: '+=6',
      rotateX: '+=0.6',
      duration: 3.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  function stopIdle() {
    if (!idleTween) return;
    idleTween.kill();
    idleTween = null;
  }

  function startSlides() {
    if (slides.length < 2 || slideTimer) return;
    slideTimer = window.setInterval(nextSlide, CONFIG.slideEvery);
  }

  function nextSlide() {
    if (pointer.inside) return;
    var prev = slides[slideIndex];
    slideIndex = (slideIndex + 1) % slides.length;
    var next = slides[slideIndex];

    prev.classList.remove('is-active');
    next.classList.add('is-active');

    gsap
      .timeline({ defaults: { ease: EASE_SOFT } })
      .to(prev, { opacity: 0, scale: 0.97, z: -20, duration: 1.1 }, 0)
      .fromTo(
        next,
        { opacity: 0, scale: 1.05, z: 24 },
        { opacity: 1, scale: 1, z: 0, duration: 1.2 },
        0.08
      );

    if (sheen) {
      gsap.fromTo(
        sheen,
        { opacity: 0.7, xPercent: -140 },
        { opacity: 0, xPercent: 140, duration: 1.25, ease: EASE_SOFT }
      );
    }
  }

  function updateHotspots(nx, ny, hover) {
    if (!hotspots.length || !canHover) return;
    var zone = null;
    if (hover > 0.35) {
      if (nx < -0.25 && ny < 0.1) zone = 'kitchen';
      else if (nx > 0.2 && ny < 0.15) zone = 'bedroom';
      else zone = 'living';
    }

    if (zone === hotspotActive) return;
    hotspotActive = zone;

    hotspots.forEach(function (el) {
      var match = el.getAttribute('data-zone') === zone;
      gsap.to(el, {
        opacity: match ? 1 : 0,
        y: match ? 0 : 10,
        z: match ? 50 : 20,
        duration: 0.45,
        ease: EASE_SOFT,
        overwrite: 'auto',
      });
    });
  }

  function applyFrame(nx, ny, hover) {
    var rotY = nx * CONFIG.maxRotateY;
    var rotX = -ny * CONFIG.maxRotateX;
    var tx = nx * CONFIG.maxTranslate;
    var ty = ny * (CONFIG.maxTranslate * 0.65);
    var tz = hover * CONFIG.maxZ;
    var scale = 1 + hover * (CONFIG.maxScale - 1);

    gsap.set(rig, {
      rotateX: rotX,
      rotateY: rotY,
      x: tx,
      y: ty,
      z: tz,
      scale: scale,
    });

    if (shadow) {
      gsap.set(shadow, {
        x: -nx * CONFIG.shadowOpposite,
        y: -ny * CONFIG.shadowOpposite * 0.45 + 6,
        scaleX: 1 + Math.abs(nx) * 0.08 + hover * 0.04,
        scaleY: 1 + Math.abs(ny) * 0.05,
        opacity: 0.75 + hover * 0.2,
      });
    }

    if (glow) {
      gsap.set(glow, {
        x: nx * CONFIG.glowTravel,
        y: ny * CONFIG.glowTravel * 0.6,
        opacity: 0.4 + hover * 0.35,
        scale: 1 + hover * 0.08,
      });
    }

    if (spotlight) {
      gsap.set(spotlight, { opacity: hover * 0.9 });
    }

    var spotX = 50 + nx * 28;
    var spotY = 45 + ny * 22;
    hero.style.setProperty('--ac-spot-x', spotX + '%');
    hero.style.setProperty('--ac-spot-y', spotY + '%');

    updateHotspots(nx, ny, hover);
  }

  function onTicker() {
    if (reduceMotion || !canHover) return;

    var targetHover = pointer.inside ? 1 : 0;
    var lerp = pointer.inside ? CONFIG.lerp : CONFIG.leaveLerp;
    smoothed.nx += (pointer.nx - smoothed.nx) * lerp;
    smoothed.ny += (pointer.ny - smoothed.ny) * lerp;
    smoothed.hover += (targetHover - smoothed.hover) * lerp;

    if (!pointer.inside && Math.abs(smoothed.hover) < 0.001 && Math.abs(smoothed.nx) < 0.001) {
      return;
    }

    applyFrame(smoothed.nx, smoothed.ny, smoothed.hover);
  }

  function onPointerMove(event) {
    if (!canHover || reduceMotion) return;
    var rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    var ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    pointer.nx = clamp(nx, -1, 1);
    pointer.ny = clamp(ny, -1, 1);

    if (!pointer.inside) {
      pointer.inside = true;
      hero.setAttribute('data-depth', 'on');
      stopIdle();
      if (sheen) {
        gsap.fromTo(
          sheen,
          { opacity: 0.55, xPercent: -120 },
          { opacity: 0, xPercent: 120, duration: 1.1, ease: EASE_SOFT, overwrite: true }
        );
      }
    }

    if (cta && canHover) {
      var ctaRect = cta.getBoundingClientRect();
      var cx = ctaRect.left + ctaRect.width / 2;
      var cy = ctaRect.top + ctaRect.height / 2;
      var dx = clamp((event.clientX - cx) / 120, -1, 1);
      var dy = clamp((event.clientY - cy) / 120, -1, 1);
      var dist = Math.hypot(event.clientX - cx, event.clientY - cy);
      if (dist < 180) {
        gsap.to(cta, {
          x: dx * CONFIG.magnetic,
          y: dy * CONFIG.magnetic,
          duration: 0.45,
          ease: EASE_SOFT,
          overwrite: 'auto',
        });
      } else {
        gsap.to(cta, { x: 0, y: 0, duration: 0.6, ease: EASE_SOFT, overwrite: 'auto' });
      }
    }
  }

  function onPointerLeave() {
    pointer.inside = false;
    pointer.nx = 0;
    pointer.ny = 0;
    hotspotActive = null;
    if (hotspots.length) {
      gsap.to(hotspots, { opacity: 0, y: 10, duration: 0.4, ease: EASE_SOFT });
    }
    if (cta) gsap.to(cta, { x: 0, y: 0, duration: 0.7, ease: EASE_SOFT, overwrite: 'auto' });
    window.setTimeout(function () {
      if (!pointer.inside) startIdle();
    }, 700);
  }

  /* Boot */
  if (reduceMotion) {
    gsap.set([rig, shadow, glow, eyebrow, title, lead, cta, stats, hint], {
      clearProps: 'all',
      opacity: 1,
    });
    hero.setAttribute('data-depth', 'off');
    return;
  }

  hero.setAttribute('data-depth', canHover ? 'ready' : 'off');
  playIntro();

  if (canHover) {
    gsap.ticker.add(onTicker);
    stage.addEventListener('pointermove', onPointerMove, { passive: true });
    stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
    if (cta) {
      document.addEventListener('pointermove', onPointerMove, { passive: true });
    }
  }
})();
