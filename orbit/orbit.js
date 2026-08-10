/**
 * Flip Orbit — homepage header + hero landing
 * GSAP: Flip · SplitText · CustomEase · MotionPathPlugin · Timeline
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap === 'undefined') return;

  var logo = document.querySelector('[data-orbit-logo]');
  var logoStage = document.querySelector('[data-logo-stage]');
  var logoSlot = document.querySelector('[data-logo-slot]');
  var header = document.querySelector('[data-orbit-header]');
  var nav = document.querySelector('[data-orbit-nav]');
  var actions = document.querySelector('[data-orbit-actions]');
  var veil = document.querySelector('.orbit-veil');
  var media = document.querySelector('.home-hero-media');
  var video = document.querySelector('[data-orbit-video]');
  var copy = document.querySelector('[data-orbit-copy]');
  var eyebrow = document.querySelector('[data-orbit-eyebrow]');
  var title = document.querySelector('[data-orbit-title]');
  var lead = document.querySelector('[data-orbit-lead]');
  var ctas = document.querySelector('[data-orbit-ctas]');
  var thumbs = gsap.utils.toArray('[data-orbit-gallery] .orbit-thumb');
  var replayBtn = document.querySelector('[data-orbit-replay]');
  var tracer = null;

  if (!logo || !logoSlot) return;

  gsap.registerPlugin(Flip, SplitText, CustomEase, MotionPathPlugin);

  CustomEase.create('orbitHold', 'M0,0 C0.12,0 0.24,1 1,1');
  CustomEase.create('orbitTravel', 'M0,0 C0.16,0.02 0.18,1 1,1');

  var split = null;
  var master = null;
  var started = false;

  function killSplit() {
    if (split) {
      split.revert();
      split = null;
    }
  }

  function resetToIntro() {
    if (master) {
      master.kill();
      master = null;
    }
    killSplit();
    gsap.killTweensOf([
      logo,
      veil,
      media,
      header,
      nav,
      actions,
      copy,
      eyebrow,
      lead,
      ctas,
      thumbs,
      logoStage,
    ]);

    if (tracer) {
      gsap.set(tracer, { autoAlpha: 0 });
    }

    document.body.classList.add('is-intro');
    header.classList.remove('is-ready');
    if (replayBtn) replayBtn.hidden = true;

    if (logo.parentElement !== logoStage) {
      logoStage.appendChild(logo);
    }
    logo.classList.remove('orbit-logo--header');
    logo.classList.add('orbit-logo--hero');

    gsap.set(logo, { clearProps: 'all' });
    gsap.set(logoStage, { autoAlpha: 1 });
    gsap.set(veil, { autoAlpha: 1 });
    gsap.set(media, { autoAlpha: 0, scale: 1.06 });
    gsap.set(header, { autoAlpha: 0, y: -16 });
    gsap.set([nav, actions], { autoAlpha: 0, y: -10 });
    gsap.set(copy, { autoAlpha: 0 });
    gsap.set(eyebrow, { autoAlpha: 0, x: -12 });
    gsap.set(lead, { autoAlpha: 0, y: 16 });
    gsap.set(ctas, { autoAlpha: 0, y: 18 });
    gsap.set(thumbs, { autoAlpha: 0, y: 48 });

    if (video) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch (e) {
        /* ignore seek errors before metadata */
      }
    }
  }

  function playVideo() {
    if (!video || reduceMotion) return;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  function showSettled() {
    document.body.classList.remove('is-intro');
    header.classList.add('is-ready');

    if (logo.parentElement !== logoSlot) {
      logoSlot.appendChild(logo);
    }
    logo.classList.remove('orbit-logo--hero');
    logo.classList.add('orbit-logo--header');

    gsap.set(logo, { clearProps: 'transform,opacity,visibility' });
    gsap.set(logoStage, { autoAlpha: 0 });
    gsap.set(veil, { autoAlpha: 0 });
    gsap.set(media, { autoAlpha: 1, scale: 1 });
    gsap.set(header, { autoAlpha: 1, y: 0 });
    gsap.set([nav, actions], { autoAlpha: 1, y: 0 });
    gsap.set(copy, { autoAlpha: 1 });
    gsap.set([eyebrow, lead, ctas], { autoAlpha: 1, x: 0, y: 0 });
    gsap.set(thumbs, { autoAlpha: 1, y: 0 });
    playVideo();
    if (replayBtn) replayBtn.hidden = false;
  }

  function buildOrbit() {
    resetToIntro();

    if (reduceMotion) {
      showSettled();
      return;
    }

    var splitConfig = {
      type: 'chars,lines',
      charsClass: 'char',
      linesClass: 'line',
      mask: 'lines',
    };
    split =
      typeof SplitText.create === 'function'
        ? SplitText.create(title, splitConfig)
        : new SplitText(title, splitConfig);

    gsap.set(split.chars, { autoAlpha: 0, yPercent: 120, rotateX: -40 });

    master = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: function () {
        document.body.classList.remove('is-intro');
        if (replayBtn) replayBtn.hidden = false;
      },
    });

    /* 1 — Brand hold */
    master.fromTo(
      logo,
      { autoAlpha: 0, scale: 0.86, filter: 'blur(8px)' },
      {
        autoAlpha: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.05,
        ease: 'orbitHold',
      }
    );

    master.to({}, { duration: 0.55 });

    /* 2 — Flip logo into header slot (orbit spin) + MotionPath tracer */
    master.add(function () {
      var state = Flip.getState(logo);
      var fromRect = logo.getBoundingClientRect();
      var slotRect = logoSlot.getBoundingClientRect();

      logoSlot.appendChild(logo);
      logo.classList.remove('orbit-logo--hero');
      logo.classList.add('orbit-logo--header');

      if (!tracer) {
        tracer = document.createElement('span');
        tracer.className = 'orbit-tracer';
        document.body.appendChild(tracer);
      }

      gsap.set(tracer, {
        autoAlpha: 0.85,
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2,
      });

      gsap.to(tracer, {
        duration: 1.35,
        ease: 'orbitTravel',
        autoAlpha: 0,
        motionPath: {
          path: [
            { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 },
            {
              x: (fromRect.left + slotRect.left) / 2 + 40,
              y: Math.min(fromRect.top, slotRect.top) - 80,
            },
            { x: slotRect.left + slotRect.width / 2, y: slotRect.top + slotRect.height / 2 },
          ],
          curviness: 1.4,
          autoRotate: false,
        },
      });

      return Flip.from(state, {
        duration: 1.35,
        ease: 'orbitTravel',
        absolute: true,
        scale: true,
        spin: -0.12,
        onStart: function () {
          header.classList.add('is-ready');
        },
      });
    });

    master.fromTo(
      logoStage,
      { autoAlpha: 1 },
      { autoAlpha: 0, duration: 0.35, ease: 'power2.out' },
      '-=1.15'
    );

    /* 3 — Header chrome + veil lifts as video wakes */
    master.to(veil, { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' }, '-=1.05');
    master.fromTo(
      header,
      { autoAlpha: 0, y: -18 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.95'
    );
    master.to(nav, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.45');
    master.to(actions, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.4');

    master.to(
      media,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1.25,
        ease: 'power2.out',
        onStart: playVideo,
      },
      '-=0.85'
    );

    /* 4 — Copy + SplitText chars */
    master.to(copy, { autoAlpha: 1, duration: 0.2 }, '-=0.55');
    master.to(
      eyebrow,
      { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.35'
    );
    master.to(
      split.chars,
      {
        autoAlpha: 1,
        yPercent: 0,
        rotateX: 0,
        duration: 0.85,
        stagger: 0.018,
        ease: 'power3.out',
      },
      '-=0.25'
    );
    master.to(lead, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.35');
    master.to(ctas, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.3');

    /* 5 — Gallery thumbs rise */
    master.to(
      thumbs,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      },
      '-=0.15'
    );
  }

  function start() {
    if (started) return;
    started = true;
    buildOrbit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      started = true;
      buildOrbit();
    });
  }
})();
