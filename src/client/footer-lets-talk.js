/**
 * Space Solution — footer "Let's talk" chair frame animation
 * Chair size is driven by font-size in JS so it always matches the letters.
 */
(function () {
  'use strict';

  var FRAME_COUNT = 23;
  var AUTOPLAY_SPEED = 0.01;
  var FRAME_BASE = '/images/footer/chair/';
  /* Union bounds of stool across all 23 rotation frames (+8px pad) */
  var SRC = { x: 104, y: 40, w: 272, h: 392 };
  /* Keep the tuned display width (based on earlier narrower crop aspect) */
  var DISPLAY_ASPECT = 208 / 392;
  /* Visual chair height as a fraction of font-size */
  var HEIGHT_EM = 0.92;
  /* Tuned at ~128px font: 12px shrink + 4px boost — scale with font-size */
  var WIDTH_SHRINK_PX = 12;
  var SIZE_BOOST_PX = 4;
  var REF_FONT_PX = 128;

  function frameUrl(index) {
    var n = String(index + 1);
    if (n.length < 2) n = '0' + n;
    return FRAME_BASE + 'lounge-chair-' + n + '.webp';
  }

  function loadFrames() {
    var jobs = [];
    for (var i = 0; i < FRAME_COUNT; i += 1) {
      jobs.push(
        new Promise(function (resolve, reject) {
          var img = new Image();
          img.decoding = 'async';
          img.onload = function () {
            resolve(img);
          };
          img.onerror = reject;
          img.src = frameUrl(i);
        })
      );
    }
    return Promise.all(jobs);
  }

  function drawFrame(ctx, img, width, height) {
    var sx = Math.round(img.naturalWidth * (SRC.x / 480));
    var sy = Math.round(img.naturalHeight * (SRC.y / 480));
    var sw = Math.round(img.naturalWidth * (SRC.w / 480));
    var sh = Math.round(img.naturalHeight * (SRC.h / 480));
    var imageRatio = sw / sh;
    var canvasRatio = width / height;
    // Contain: wider source → fit to width; taller source → fit to height
    var scale = imageRatio > canvasRatio ? width / sw : height / sh;
    var drawW = sw * scale;
    var drawH = sh * scale;
    var x = (width - drawW) / 2;
    var y = (height - drawH) / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, sx, sy, sw, sh, x, y, drawW, drawH);
  }

  function applyLetterSizedBox(canvas, letter) {
    var title = letter.closest('.footer-lets-talk-title') || letter;
    var fontSize = parseFloat(getComputedStyle(title).fontSize) || REF_FONT_PX;
    var isMobile = window.matchMedia('(max-width: 767px)').matches;
    var tuneScale = fontSize / REF_FONT_PX;
    var widthShrink = WIDTH_SHRINK_PX * tuneScale;
    var sizeBoost = SIZE_BOOST_PX * tuneScale;
    var cssH = Math.max(1, fontSize * HEIGHT_EM);
    var cssW = Math.max(1, cssH * DISPLAY_ASPECT - widthShrink);
    cssH = Math.max(1, cssW / DISPLAY_ASPECT);
    cssW += sizeBoost;
    cssH += sizeBoost;
    /* Slot narrower than canvas so t/l tuck into empty crop padding around the stool */
    var slotW = Math.max(1, cssW * (isMobile ? 0.64 : 0.72));
    var wrap = canvas.parentElement;

    wrap.style.setProperty('position', 'absolute', 'important');
    wrap.style.setProperty('top', '50%', 'important');
    wrap.style.setProperty('left', '50%', 'important');
    wrap.style.setProperty('right', 'auto', 'important');
    wrap.style.setProperty('bottom', 'auto', 'important');
    wrap.style.setProperty('width', cssW + 'px', 'important');
    wrap.style.setProperty('height', cssH + 'px', 'important');
    wrap.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
    wrap.style.setProperty('overflow', 'hidden', 'important');
    wrap.style.setProperty('max-width', cssW + 'px', 'important');
    wrap.style.setProperty('max-height', cssH + 'px', 'important');

    letter.style.setProperty('display', 'inline-block', 'important');
    letter.style.setProperty('width', slotW + 'px', 'important');
    letter.style.setProperty('min-width', slotW + 'px', 'important');
    letter.style.removeProperty('margin-left');
    letter.style.removeProperty('margin-right');

    canvas.style.setProperty('display', 'block', 'important');
    canvas.style.setProperty('width', '100%', 'important');
    canvas.style.setProperty('height', '100%', 'important');
    canvas.style.setProperty('max-width', '100%', 'important');
    canvas.style.setProperty('max-height', '100%', 'important');

    return { width: cssW, height: cssH };
  }

  function sizeCanvas(canvas, ctx, cssW, cssH) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { width: cssW, height: cssH };
  }

  function initCanvas(canvas, frames) {
    var section = canvas.closest('.footer-lets-talk');
    var letter = canvas.closest('.footer-lets-talk-letter');
    if (!section || !letter) return null;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('no-canvas');
      return null;
    }

    var ctx = canvas.getContext('2d');
    if (!ctx || !frames.length) {
      section.classList.add('no-canvas');
      return null;
    }

    var box = applyLetterSizedBox(canvas, letter);
    var size = sizeCanvas(canvas, ctx, box.width, box.height);
    var progress = 0;
    var running = true;
    var raf = 0;

    function paint() {
      if (!running) return;
      progress = (progress + AUTOPLAY_SPEED) % 1;
      var index = Math.min(
        frames.length - 1,
        Math.floor(progress * frames.length)
      );
      drawFrame(ctx, frames[index], size.width, size.height);
      raf = window.requestAnimationFrame(paint);
    }

    function onResize() {
      box = applyLetterSizedBox(canvas, letter);
      size = sizeCanvas(canvas, ctx, box.width, box.height);
      drawFrame(ctx, frames[Math.floor(progress * frames.length) % frames.length], size.width, size.height);
    }

    drawFrame(ctx, frames[0], size.width, size.height);
    raf = window.requestAnimationFrame(paint);
    section.classList.add('is-ready');
    window.addEventListener('resize', onResize);

    return function destroy() {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }

  function initFooterReveal() {
    var reveal = document.querySelector('.footer-reveal');
    var main = document.querySelector('main');
    if (!reveal || !main) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var syncRaf = 0;
    var scrollRaf = 0;
    var footerH = 0;

    function applyScroll() {
      if (!reveal.classList.contains('is-fixed-reveal') || footerH < 1) return;

      var vh = window.innerHeight || 1;
      var mainBottom = main.getBoundingClientRect().bottom;
      var ty;

      if (mainBottom >= vh) {
        ty = vh;
      } else if (mainBottom > 0) {
        /* Keep footer top glued to main's bottom — reveals Let's talk first */
        ty = mainBottom;
      } else {
        ty = Math.max(mainBottom, -(Math.max(footerH - vh, 0)));
      }

      reveal.style.transform = 'translate3d(0,' + ty + 'px,0)';
    }

    function sync() {
      reveal.style.transform = '';
      reveal.classList.remove('is-fixed-reveal');
      document.documentElement.classList.remove('has-footer-reveal');
      document.documentElement.style.removeProperty('--footer-reveal-h');

      footerH = Math.ceil(reveal.getBoundingClientRect().height);
      if (footerH < 1) return;

      document.documentElement.style.setProperty('--footer-reveal-h', footerH + 'px');
      document.documentElement.classList.add('has-footer-reveal');
      reveal.classList.add('is-fixed-reveal');
      applyScroll();
    }

    function scheduleSync() {
      if (syncRaf) window.cancelAnimationFrame(syncRaf);
      syncRaf = window.requestAnimationFrame(sync);
    }

    function scheduleScroll() {
      if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
      scrollRaf = window.requestAnimationFrame(applyScroll);
    }

    sync();
    window.addEventListener('resize', scheduleSync);
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(scheduleSync).observe(reveal);
    }
  }

  function initFooterLetsTalk() {
    initFooterReveal();

    var canvases = document.querySelectorAll('.footer-lets-talk-chair-canvas');
    if (!canvases.length) return;

    loadFrames()
      .then(function (frames) {
        var destroyers = [];
        canvases.forEach(function (canvas) {
          var destroy = initCanvas(canvas, frames);
          if (destroy) destroyers.push(destroy);
        });

        window.SpaceSolutionsFooterLetsTalk = {
          destroy: function () {
            destroyers.forEach(function (destroy) {
              destroy();
            });
            destroyers = [];
          },
        };

        /* Chair sizing can change footer height — resync reveal */
        window.dispatchEvent(new Event('resize'));
      })
      .catch(function () {
        canvases.forEach(function (canvas) {
          var section = canvas.closest('.footer-lets-talk');
          if (section) section.classList.add('no-canvas');
        });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterLetsTalk);
  } else {
    initFooterLetsTalk();
  }
})();
