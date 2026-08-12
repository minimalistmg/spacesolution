/**
 * Interior depth hero — subtle 2.5D tilt via GSAP quickTo.
 * Pointer / hover only. Respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  var hero = document.querySelector('[data-depth-hero]');
  if (!hero) return;

  var stage = hero.querySelector('[data-depth-stage]');
  var rig = hero.querySelector('[data-depth-rig]');
  var shadow = hero.querySelector('[data-depth-shadow]');
  var layers = hero.querySelectorAll('[data-depth-layer]');

  if (!stage || !rig) return;

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!canHover || reduceMotion) {
    hero.setAttribute('data-depth', 'off');
    return;
  }

  hero.setAttribute('data-depth', 'on');

  var CONFIG = {
    maxRotateY: 4,
    maxRotateX: 3,
    maxTranslate: 16,
    maxScale: 1.025,
    shadowOpposite: 14,
    easeDuration: 0.85,
    ease: 'power3.out',
    leaveDuration: 1.05,
  };

  gsap.set(rig, {
    transformPerspective: 1400,
    transformOrigin: '50% 50%',
    force3D: true,
  });

  if (shadow) {
    gsap.set(shadow, { force3D: true });
  }

  layers.forEach(function (layer) {
    gsap.set(layer, { force3D: true });
  });

  var rotateXTo = gsap.quickTo(rig, 'rotationX', {
    duration: CONFIG.easeDuration,
    ease: CONFIG.ease,
  });
  var rotateYTo = gsap.quickTo(rig, 'rotationY', {
    duration: CONFIG.easeDuration,
    ease: CONFIG.ease,
  });
  var xTo = gsap.quickTo(rig, 'x', {
    duration: CONFIG.easeDuration,
    ease: CONFIG.ease,
  });
  var yTo = gsap.quickTo(rig, 'y', {
    duration: CONFIG.easeDuration,
    ease: CONFIG.ease,
  });
  var scaleTo = gsap.quickTo(rig, 'scale', {
    duration: CONFIG.easeDuration,
    ease: CONFIG.ease,
  });

  var shadowXTo = shadow
    ? gsap.quickTo(shadow, 'x', { duration: CONFIG.easeDuration, ease: CONFIG.ease })
    : null;
  var shadowYTo = shadow
    ? gsap.quickTo(shadow, 'y', { duration: CONFIG.easeDuration, ease: CONFIG.ease })
    : null;
  var shadowScaleTo = shadow
    ? gsap.quickTo(shadow, 'scale', { duration: CONFIG.easeDuration, ease: CONFIG.ease })
    : null;

  var layerTrackers = Array.prototype.map.call(layers, function (layer) {
    var depth = parseFloat(layer.getAttribute('data-depth-layer')) || 1;
    return {
      el: layer,
      depth: depth,
      xTo: gsap.quickTo(layer, 'x', { duration: CONFIG.easeDuration, ease: CONFIG.ease }),
      yTo: gsap.quickTo(layer, 'y', { duration: CONFIG.easeDuration, ease: CONFIG.ease }),
    };
  });

  var targetNX = 0;
  var targetNY = 0;
  var rafPending = false;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function apply(nx, ny) {
    var rotY = nx * CONFIG.maxRotateY;
    var rotX = -ny * CONFIG.maxRotateX;
    var tx = nx * CONFIG.maxTranslate;
    var ty = ny * (CONFIG.maxTranslate * 0.7);
    var scale = 1 + Math.abs(nx) * (CONFIG.maxScale - 1) * 0.55 + Math.abs(ny) * (CONFIG.maxScale - 1) * 0.45;

    rotateYTo(rotY);
    rotateXTo(rotX);
    xTo(tx);
    yTo(ty);
    scaleTo(clamp(scale, 1, CONFIG.maxScale));

    if (shadowXTo && shadowYTo && shadowScaleTo) {
      shadowXTo(-nx * CONFIG.shadowOpposite);
      shadowYTo(-ny * (CONFIG.shadowOpposite * 0.55) + 4);
      shadowScaleTo(1 + Math.abs(nx) * 0.03 + Math.abs(ny) * 0.02);
    }

    layerTrackers.forEach(function (tracker) {
      var bonus = (tracker.depth - 1) * 6;
      tracker.xTo(nx * bonus);
      tracker.yTo(ny * bonus * 0.7);
    });
  }

  function flush() {
    rafPending = false;
    apply(targetNX, targetNY);
  }

  function onPointerMove(event) {
    var rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var nx = (event.clientX - rect.left) / rect.width - 0.5;
    var ny = (event.clientY - rect.top) / rect.height - 0.5;
    targetNX = clamp(nx * 2, -1, 1);
    targetNY = clamp(ny * 2, -1, 1);

    if (!rafPending) {
      rafPending = true;
      window.requestAnimationFrame(flush);
    }
  }

  function onPointerLeave() {
    targetNX = 0;
    targetNY = 0;

    gsap.to(rig, {
      rotationX: 0,
      rotationY: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: CONFIG.leaveDuration,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (shadow) {
      gsap.to(shadow, {
        x: 0,
        y: 0,
        scale: 1,
        duration: CONFIG.leaveDuration,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }

    layerTrackers.forEach(function (tracker) {
      gsap.to(tracker.el, {
        x: 0,
        y: 0,
        duration: CONFIG.leaveDuration,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  }

  stage.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
})();
