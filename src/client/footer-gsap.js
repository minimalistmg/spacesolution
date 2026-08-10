/**
 * Space Solutions — unified footer: continuous infinite horizontal loop + slow shake
 */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getGsap() {
    if (typeof gsap === 'undefined') return null;
    return gsap;
  }

  function initLoop(footer, gsapLib) {
    var track = footer.querySelector('[data-fgsap-track]');
    var objects = footer.querySelectorAll('.fgsap-object');
    if (!track || !objects.length) return;
    if (prefersReducedMotion()) return;

    if (typeof footer._fgsapCleanup === 'function') {
      footer._fgsapCleanup();
      footer._fgsapCleanup = null;
    }

    // Keep motion continuous even after long background-tab pauses
    gsapLib.ticker.lagSmoothing(0);

    var speed = 13; // px per second — constant velocity, never stops
    var x = 0;
    var loopDistance = 0;

    function measure() {
      var prevX = x;
      // Measure with transform cleared so offsetLeft is accurate
      gsapLib.set(track, { x: 0, force3D: true });
      var kids = track.children;
      var half = kids.length / 2;
      // Exact seam: distance from first item to its duplicate (includes flex gap)
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
      if (loopDistance < 1) return;
      var dt = typeof deltaTime === 'number' && deltaTime > 0 ? deltaTime : 1 / 60;
      // Cap dt so a huge hitch doesn't jump a full loop in one frame
      if (dt > 0.05) dt = 0.05;
      x -= speed * dt;
      // Seamless wrap onto the duplicated half — no tween restart, no pause
      if (x <= -loopDistance) {
        x += loopDistance * Math.floor((-x) / loopDistance);
      }
      gsapLib.set(track, { x: x, force3D: true });
    };

    gsapLib.ticker.add(tick);

    // Remeasure after layout/fonts settle so the seam stays exact
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

    objects.forEach(function (obj, i) {
      var lift = parseFloat(obj.getAttribute('data-lift') || '0') || 0;

      // Keep objects upright (right angle) — gentle vertical bob only
      gsapLib.set(obj, {
        y: -lift,
        rotation: 0,
        transformOrigin: '50% 100%',
      });

      gsapLib.to(obj, {
        y: -(lift + 2),
        duration: 3.2 + (i % 4) * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.2 + i * 0.12,
      });
    });

    footer._fgsapCleanup = function () {
      gsapLib.ticker.remove(tick);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(remasureTimer);
      gsapLib.killTweensOf(track);
      gsapLib.killTweensOf(objects);
    };
  }

  function initFooter(root) {
    var gsapLib = getGsap();
    if (!gsapLib) return;
    initLoop(root, gsapLib);
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

    // Safety: never block forever if a lazy/broken image stalls
    window.setTimeout(function () {
      if (!settled) {
        settled = true;
        callback();
      }
    }, 2500);
  }

  function initFooters() {
    document.querySelectorAll('.fgsap-footer').forEach(function (footer) {
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
