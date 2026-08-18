/**
 * Space Solution - unified footer: continuous infinite horizontal loop + hover pause/elevate
 */
(function () {
  'use strict';

  var HOVER_LIFT = 10;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getGsap() {
    if (typeof gsap === 'undefined') return null;
    return gsap;
  }

  function initLoop(footer, gsapLib) {
    var stage = footer.querySelector('.fgsap-stage');
    var track = footer.querySelector('[data-fgsap-track]');
    var objects = footer.querySelectorAll('.fgsap-object');
    if (!stage || !track || !objects.length) return;
    if (prefersReducedMotion()) return;

    if (typeof footer._fgsapCleanup === 'function') {
      footer._fgsapCleanup();
      footer._fgsapCleanup = null;
    }

    gsapLib.ticker.lagSmoothing(0);

    var speed = 13;
    var x = 0;
    var loopDistance = 0;
    var loopPaused = false;
    var bobTweens = [];

    function measure() {
      var prevX = x;
      gsapLib.set(track, { x: 0, force3D: true });
      var kids = track.children;
      var half = kids.length / 2;
      if (half >= 1 && kids[half]) {
        loopDistance = kids[half].offsetLeft - kids[0].offsetLeft;
      } else {
        loopDistance = track.scrollWidth / 2;
      }
      gsapLib.set(track, { x: prevX, force3D: true });
    }

    measure();
    if (loopDistance < 1) return;

    var tick = function (_time, deltaTime) {
      if (loopPaused || loopDistance < 1) return;
      var dt = typeof deltaTime === 'number' && deltaTime > 0 ? deltaTime : 1 / 60;
      if (dt > 0.05) dt = 0.05;
      x -= speed * dt;
      if (x <= -loopDistance) {
        x += loopDistance * Math.floor((-x) / loopDistance);
      }
      gsapLib.set(track, { x: x, force3D: true });
    };

    gsapLib.ticker.add(tick);

    var remasureTimer = window.setTimeout(function () {
      var progress = loopDistance > 0 ? ((-x % loopDistance) + loopDistance) % loopDistance : 0;
      measure();
      if (loopDistance < 1) return;
      x = -progress;
      gsapLib.set(track, { x: x, force3D: true });
    }, 400);

    var resizeTimer = 0;
    var onResize = function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        var offset = loopDistance > 0 ? ((-x % loopDistance) + loopDistance) % loopDistance : 0;
        measure();
        if (loopDistance < 1) return;
        x = -offset;
        gsapLib.set(track, { x: x, force3D: true });
      }, 120);
    };
    window.addEventListener('resize', onResize);

    function setLoopPaused(shouldPause) {
      loopPaused = shouldPause;
      stage.classList.toggle('is-paused', shouldPause);
    }

    function getLift(obj) {
      return parseFloat(obj.getAttribute('data-lift') || '0') || 0;
    }

    stage.addEventListener('mouseenter', function () {
      setLoopPaused(true);
    });

    stage.addEventListener('mouseleave', function () {
      setLoopPaused(false);
    });

    stage.addEventListener('focusin', function () {
      setLoopPaused(true);
    });

    stage.addEventListener('focusout', function (e) {
      if (!stage.contains(e.relatedTarget)) {
        setLoopPaused(false);
      }
    });

    function startBob(obj, index) {
      var lift = getLift(obj);
      gsapLib.set(obj, {
        y: -lift,
        rotation: 0,
        transformOrigin: '50% 100%',
      });

      var tween = gsapLib.to(obj, {
        y: -(lift + 2),
        duration: 3.2 + (index % 4) * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.2 + index * 0.12,
      });

      bobTweens.push({ obj: obj, tween: tween });
      return tween;
    }

    objects.forEach(function (obj, i) {
      var bobTween = startBob(obj, i);

      function elevate() {
        bobTween.pause();
        gsapLib.to(obj, {
          y: -(getLift(obj) + HOVER_LIFT),
          duration: 0.28,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      function settle() {
        gsapLib.to(obj, {
          y: -getLift(obj),
          duration: 0.28,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: function () {
            if (!obj.matches(':hover') && !obj.matches(':focus-visible')) {
              bobTween.resume();
            }
          },
        });
      }

      obj.addEventListener('mouseenter', function () {
        elevate();
      });

      obj.addEventListener('mouseleave', function () {
        settle();
      });

      obj.addEventListener('focusin', function () {
        elevate();
      });

      obj.addEventListener('focusout', function () {
        settle();
      });
    });

    footer._fgsapCleanup = function () {
      gsapLib.ticker.remove(tick);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(remasureTimer);
      gsapLib.killTweensOf(track);
      gsapLib.killTweensOf(objects);
      bobTweens.length = 0;
      stage.classList.remove('is-paused');
    };
  }

  function initFooter(root) {
    var gsapLib = getGsap();
    if (!gsapLib) return;
    initLoop(root, gsapLib);
  }

  function initAccordion(footer) {
    if (footer.dataset.fgsapAccordionReady === 'true') return;
    footer.dataset.fgsapAccordionReady = 'true';

    var mq = window.matchMedia('(max-width: 767px)');
    var cols = footer.querySelectorAll('[data-fgsap-accordion]');
    if (!cols.length) return;

    function setExpanded(col, expanded) {
      var btn = col.querySelector('.fgsap-col-toggle');
      col.classList.toggle('is-open', expanded);
      if (!btn) return;
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (mq.matches) {
        btn.removeAttribute('tabindex');
      } else {
        btn.setAttribute('tabindex', '-1');
      }
    }

    function syncMode() {
      var mobile = mq.matches;
      footer.classList.toggle('is-accordion-ready', mobile);
      cols.forEach(function (col) {
        setExpanded(col, !mobile);
      });
    }

    cols.forEach(function (col) {
      var btn = col.querySelector('.fgsap-col-toggle');
      if (!btn) return;
      btn.addEventListener('click', function () {
        if (!mq.matches) return;
        setExpanded(col, !col.classList.contains('is-open'));
      });
    });

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', syncMode);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(syncMode);
    }

    syncMode();
  }

  function whenImagesReady(footer, callback) {
    var imgs = Array.prototype.slice.call(footer.querySelectorAll('.fgsap-object-img'));
    if (!imgs.length) {
      callback();
      return;
    }

    var pending = imgs.length;
    var settled = false;
    var finish = function () {
      if (settled) return;
      pending -= 1;
      if (pending <= 0) {
        settled = true;
        callback();
      }
    };

    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth) {
        finish();
        return;
      }
      img.addEventListener('load', finish, { once: true });
      img.addEventListener('error', finish, { once: true });
    });

    window.setTimeout(function () {
      if (!settled) {
        settled = true;
        callback();
      }
    }, 2500);
  }

  function initFooters() {
    document.querySelectorAll('.fgsap-footer').forEach(function (footer) {
      initAccordion(footer);
      if (footer.dataset.fgsapReady === 'true') return;
      footer.dataset.fgsapReady = 'true';

      whenImagesReady(footer, function () {
        requestAnimationFrame(function () {
          initFooter(footer);
        });
      });
    });
  }

  function boot() {
    requestAnimationFrame(initFooters);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
