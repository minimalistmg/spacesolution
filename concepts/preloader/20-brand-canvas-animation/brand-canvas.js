/**
 * Concept 20 — Brand Canvas
 *
 * Same mark and same beats as concept 19, rendered in a 2D canvas instead of
 * SVG. That swap is the point: in SVG the pour has to be a mask driven by filter
 * primitives, so its leading edge is a mathematical contour. Here the gold is
 * *deposited* — grains flow out of the tail tip in geodesic order and each one
 * paints itself into an accumulation buffer, so the edge is made of the grains
 * and breaks up the way poured metal does. Embers lift off that edge and a
 * specular bar rakes the surface once it sets.
 *
 * Geometry comes from _shared/brand-shape.js, shared with concept 19.
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  if (!window.BrandShape || !window.PreloaderUtils) return;

  var U = window.PreloaderUtils;
  var B = window.BrandShape;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var inspect = /[?&]inspect(?:=1|&|$)/.test(location.search);

  var preloader = document.querySelector('[data-pl-preloader]');
  var host = document.querySelector('[data-pl-lockup-host]');
  var bloom = document.querySelector('[data-pl-bloom]');
  var skipBtn = document.querySelector('[data-pl-skip]');
  if (!preloader || !host) return;

  var VB_W = B.WIDTH;
  var VB_H = B.HEIGHT;

  /* ---------------------------------------------------------------- palette */

  /* Lifted from concept 19 so both concepts read as the same metal. The base
     ramp was fitted to the lit face of the catalogue mark; the two fold ramps
     are the shaded back faces, laid over it at a constant alpha with the colour
     doing the work. */
  var BASE_STOPS = [
    [0, '#bf9728'], [0.21, '#bf9728'], [0.29, '#c59d2b'], [0.38, '#cca630'],
    [0.46, '#d4af35'], [0.54, '#dcb738'], [0.62, '#e3c03c'], [0.71, '#eccc54'],
    [0.79, '#f4d76a'], [0.88, '#f5dc7d'], [1, '#f6e190'],
  ];
  var FOLD_UP_STOPS = [
    [0, '#693e33'], [0.21, '#693e33'], [0.29, '#6f4a39'], [0.38, '#886247'],
    [0.46, '#9f7d4f'], [0.54, '#b8995b'], [0.62, '#ceb162'], [0.71, '#ddbd4b'],
    [0.79, '#f1d12c'], [0.88, '#efc707'], [1, '#edbd00'],
  ];
  var FOLD_LO_STOPS = [
    [0, '#693e33'], [0.21, '#693e33'], [0.29, '#845c42'], [0.38, '#977450'],
    [0.46, '#ad8b58'], [0.54, '#c1a861'], [0.62, '#e0c068'], [0.71, '#eed15c'],
    [0.79, '#f4d96c'], [0.88, '#efc707'], [1, '#edbd00'],
  ];
  var FOLD_ALPHA = 0.34;
  var STROKE_A = '#a57e35';
  var STROKE_B = '#b98a2c';

  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  function addStops(grad, stops, alpha) {
    for (var i = 0; i < stops.length; i++) {
      grad.addColorStop(stops[i][0], alpha == null ? stops[i][1] : rgba(stops[i][1], alpha));
    }
    return grad;
  }

  /* ------------------------------------------------------------------ setup */

  host.innerHTML =
    '<div class="bc-lockup" data-bc-lockup>' +
    '<canvas class="bc-canvas" data-bc-canvas aria-hidden="true"></canvas>' +
    '<div class="brand-wordmark">' +
    '<span class="brand-space">space</span>' +
    '<span class="brand-solution">SOLUTION</span>' +
    '</div>' +
    '</div>';

  var lockup = host.querySelector('[data-bc-lockup]');
  var canvas = host.querySelector('[data-bc-canvas]');
  var wordmark = host.querySelector('.brand-wordmark');
  var ctx = canvas.getContext('2d');

  var markPath = new Path2D(B.SHAPE);
  var foldUpPath = new Path2D(B.FOLD_UPPER);
  var foldLoPath = new Path2D(B.FOLD_LOWER);

  /* Canvas has no path length or bbox, so one offscreen SVG path supplies both:
     the length and head position for the drawn trace, and the box the base ramp
     is expressed in (concept 19 states its axis in objectBoundingBox units). */
  var svgNS = 'http://www.w3.org/2000/svg';
  var probeSvg = document.createElementNS(svgNS, 'svg');
  probeSvg.setAttribute('width', '0');
  probeSvg.setAttribute('height', '0');
  probeSvg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  var probe = document.createElementNS(svgNS, 'path');
  probe.setAttribute('d', B.SHAPE);
  probeSvg.appendChild(probe);
  document.body.appendChild(probeSvg);
  var pathLen = probe.getTotalLength();
  var bbox = probe.getBBox();

  /* ------------------------------------------------- geodesic distance field */

  var FIELD_SCALE = 2; /* it only orders the grains, so half resolution is plenty */

  /* Grains are seeded on the field grid and released in order of geodesic
     distance from the tail tip, which is what makes the gold run *through* the
     form instead of rising as a waterline across it. Straight-line distance
     would jump the gap between the tail and the body. */
  function buildGrains() {
    var fw = Math.ceil(VB_W / FIELD_SCALE);
    var fh = Math.ceil(VB_H / FIELD_SCALE);
    var cv = document.createElement('canvas');
    cv.width = fw;
    cv.height = fh;
    var c = cv.getContext('2d');
    c.setTransform(1 / FIELD_SCALE, 0, 0, 1 / FIELD_SCALE, 0, 0);
    c.fillStyle = '#fff';
    c.fill(markPath);

    var px = c.getImageData(0, 0, fw, fh).data;
    var n = fw * fh;
    var solid = new Uint8Array(n);
    var i;
    for (i = 0; i < n; i++) solid[i] = px[i * 4 + 3] > 128 ? 1 : 0;

    var sx = B.TIP.x / FIELD_SCALE;
    var sy = B.TIP.y / FIELD_SCALE;
    var seed = -1;
    var seedD = Infinity;
    for (i = 0; i < n; i++) {
      if (!solid[i]) continue;
      var dx = (i % fw) - sx;
      var dy = ((i / fw) | 0) - sy;
      var q = dx * dx + dy * dy;
      if (q < seedD) {
        seedD = q;
        seed = i;
      }
    }
    if (seed < 0) return null;

    /* Chamfer sweeps rather than a heap: alternating raster passes converge on
       the 8-neighbour geodesic distance, and the mark is only about one and a
       half turns of spiral, so it settles in a handful of passes. */
    var INF = 1e9;
    var dist = new Float32Array(n);
    for (i = 0; i < n; i++) dist[i] = INF;
    dist[seed] = 0;

    var S2 = Math.SQRT2;
    var x, y, idx, best, pass;
    for (pass = 0; pass < 40; pass++) {
      var changed = 0;
      for (y = 0; y < fh; y++) {
        for (x = 0; x < fw; x++) {
          idx = y * fw + x;
          if (!solid[idx]) continue;
          best = dist[idx];
          if (x > 0 && solid[idx - 1] && dist[idx - 1] + 1 < best) best = dist[idx - 1] + 1;
          if (y > 0 && solid[idx - fw] && dist[idx - fw] + 1 < best) best = dist[idx - fw] + 1;
          /* Gate the diagonals on both orthogonals so the walk cannot squeeze
             through a corner where the mark is only one cell thick. */
          if (x > 0 && y > 0 && solid[idx - fw - 1] && solid[idx - 1] && solid[idx - fw] &&
              dist[idx - fw - 1] + S2 < best) best = dist[idx - fw - 1] + S2;
          if (x < fw - 1 && y > 0 && solid[idx - fw + 1] && solid[idx + 1] && solid[idx - fw] &&
              dist[idx - fw + 1] + S2 < best) best = dist[idx - fw + 1] + S2;
          if (best < dist[idx]) {
            dist[idx] = best;
            changed++;
          }
        }
      }
      for (y = fh - 1; y >= 0; y--) {
        for (x = fw - 1; x >= 0; x--) {
          idx = y * fw + x;
          if (!solid[idx]) continue;
          best = dist[idx];
          if (x < fw - 1 && solid[idx + 1] && dist[idx + 1] + 1 < best) best = dist[idx + 1] + 1;
          if (y < fh - 1 && solid[idx + fw] && dist[idx + fw] + 1 < best) best = dist[idx + fw] + 1;
          if (x < fw - 1 && y < fh - 1 && solid[idx + fw + 1] && solid[idx + 1] && solid[idx + fw] &&
              dist[idx + fw + 1] + S2 < best) best = dist[idx + fw + 1] + S2;
          if (x > 0 && y < fh - 1 && solid[idx + fw - 1] && solid[idx - 1] && solid[idx + fw] &&
              dist[idx + fw - 1] + S2 < best) best = dist[idx + fw - 1] + S2;
          if (best < dist[idx]) {
            dist[idx] = best;
            changed++;
          }
        }
      }
      if (!changed) break;
    }

    var max = 0;
    for (i = 0; i < n; i++) if (dist[i] < INF && dist[i] > max) max = dist[i];
    if (max <= 0) return null;

    var order = [];
    for (i = 0; i < n; i++) if (solid[i] && dist[i] < INF) order.push(i);
    order.sort(function (a, b) {
      return dist[a] - dist[b];
    });

    var count = order.length;
    var gx = new Float32Array(count);
    var gy = new Float32Array(count);
    var gt = new Float32Array(count);
    for (i = 0; i < count; i++) {
      idx = order[i];
      gx[i] = ((idx % fw) + 0.5) * FIELD_SCALE;
      gy[i] = (((idx / fw) | 0) + 0.5) * FIELD_SCALE;
      gt[i] = dist[idx] / max;
    }
    return { x: gx, y: gy, t: gt, n: count };
  }

  var grains = buildGrains();
  if (!grains) return;

  /* First index whose normalised distance is >= v. */
  function lowerBound(v) {
    var lo = 0;
    var hi = grains.n;
    while (lo < hi) {
      var mid = (lo + hi) >> 1;
      if (grains.t[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  /* ---------------------------------------------------------------- sprites */

  /* One pre-rendered disc, stamped thousands of times. Building a gradient per
     grain would cost more than the rest of the frame put together. */
  function discSprite(inner, outer, size) {
    var cv = document.createElement('canvas');
    cv.width = cv.height = size;
    var c = cv.getContext('2d');
    var g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.55, outer);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, size, size);
    return cv;
  }

  var grainSprite = discSprite('rgba(255,255,255,1)', 'rgba(255,255,255,0.55)', 48);
  var hotSprite = discSprite('rgba(255,247,214,0.95)', 'rgba(255,196,74,0.35)', 64);
  var emberSprite = discSprite('rgba(255,243,207,1)', 'rgba(247,190,60,0.4)', 32);

  var GRAIN_R = 3.6; /* artboard units; grid pitch is 2, so the discs overlap */

  /* ------------------------------------------------------------- offscreens */

  var deposit = document.createElement('canvas');
  var depositCx = deposit.getContext('2d');
  var metal = document.createElement('canvas');
  var metalCx = metal.getContext('2d');

  var backW = 0;
  var backH = 0;
  var scaleX = 1;
  var scaleY = 1;
  var laid = 0; /* how many grains are already in the deposit buffer */

  function paintMetal() {
    metalCx.setTransform(1, 0, 0, 1, 0, 0);
    metalCx.clearRect(0, 0, backW, backH);
    metalCx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

    var g = metalCx.createLinearGradient(
      bbox.x + 0.0406 * bbox.width, bbox.y + 0.0057 * bbox.height,
      bbox.x + 1.0272 * bbox.width, bbox.y + 0.1444 * bbox.height
    );
    metalCx.fillStyle = addStops(g, BASE_STOPS);
    metalCx.fill(markPath);

    metalCx.save();
    metalCx.clip(markPath);
    /* Both fold ramps share the base ramp's axis in user space — see concept 19;
       giving them a plain horizontal axis drops the base's vertical term and
       renders the tail too dark. */
    metalCx.fillStyle = addStops(
      metalCx.createLinearGradient(65.9, 8.6, 577.4, 75.0), FOLD_UP_STOPS, FOLD_ALPHA);
    metalCx.fill(foldUpPath);
    metalCx.fillStyle = addStops(
      metalCx.createLinearGradient(65.9, 8.6, 577.4, 75.0), FOLD_LO_STOPS, FOLD_ALPHA);
    metalCx.fill(foldLoPath);
    metalCx.restore();
  }

  function resetDeposit() {
    depositCx.setTransform(1, 0, 0, 1, 0, 0);
    depositCx.clearRect(0, 0, backW, backH);
    depositCx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    /* Clipped once, so no grain can ever spill past the silhouette and the fill
       edge stays exactly the mark's edge. */
    depositCx.clip(markPath);
    /* Grains overlap only partially, so additive alpha is what closes the gaps
       between them; source-over would leave a lace of holes. */
    depositCx.globalCompositeOperation = 'lighter';
    laid = 0;
  }

  function layTo(front) {
    var target = front >= 1 ? grains.n : lowerBound(front);
    if (target < laid) {
      resetDeposit();
      target = front >= 1 ? grains.n : lowerBound(front);
    }
    var d = GRAIN_R * 2;
    for (var i = laid; i < target; i++) {
      depositCx.drawImage(grainSprite, grains.x[i] - GRAIN_R, grains.y[i] - GRAIN_R, d, d);
    }
    laid = target;
    if (front >= 1) {
      /* Grains alone leave pinholes at this resolution. Once the front is home
         the shape is filled outright, which is invisible by then and guarantees
         the finished mark is solid. */
      depositCx.save();
      depositCx.globalCompositeOperation = 'source-over';
      depositCx.fillStyle = '#fff';
      depositCx.fill(markPath);
      depositCx.restore();
    }
  }

  function sizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(rect.width * dpr));
    var h = Math.max(1, Math.round(rect.height * dpr));
    if (w === backW && h === backH) return;

    backW = w;
    backH = h;
    canvas.width = w;
    canvas.height = h;
    deposit.width = w;
    deposit.height = h;
    metal.width = w;
    metal.height = h;
    scaleX = w / VB_W;
    scaleY = h / VB_H;

    paintMetal();
    resetDeposit();
    layTo(S.front);
  }

  /* --------------------------------------------------------------- lockup fit */

  /* The lockup is a fixed-size catalogue asset, so a full-screen reveal has to
     fit it to the viewport, and on anything landscape it is the height that runs
     out first. Measuring both axes covers laptop and desktop alike. */
  var FIT_H = 0.62;
  var FIT_W = 0.6;
  var FIT_MIN = 0.9;
  var FIT_MAX = 3.4;

  function fitLockup() {
    var w = lockup.offsetWidth;
    var h = lockup.offsetHeight;
    if (!w || !h) return;
    var s = Math.min((window.innerHeight * FIT_H) / h, (window.innerWidth * FIT_W) / w);
    s = Math.max(FIT_MIN, Math.min(s, FIT_MAX));
    host.style.setProperty('--bc-scale', String(Math.round(s * 1000) / 1000));
    /* The backing store follows the on-screen box, transform included, so the
       scale-up has to be applied before the canvas is resized. */
    sizeCanvas();
  }

  /* ----------------------------------------------------------------- embers */

  var EMBER_MAX = 150;
  var ember = {
    x: new Float32Array(EMBER_MAX),
    y: new Float32Array(EMBER_MAX),
    vx: new Float32Array(EMBER_MAX),
    vy: new Float32Array(EMBER_MAX),
    life: new Float32Array(EMBER_MAX),
    max: new Float32Array(EMBER_MAX),
    r: new Float32Array(EMBER_MAX),
    n: 0,
  };

  function spawnEmber(x, y) {
    var i = ember.n < EMBER_MAX ? ember.n++ : (Math.random() * EMBER_MAX) | 0;
    ember.x[i] = x;
    ember.y[i] = y;
    ember.vx[i] = (Math.random() - 0.5) * 26;
    ember.vy[i] = -18 - Math.random() * 46;
    ember.max[i] = 0.35 + Math.random() * 0.4;
    ember.life[i] = ember.max[i];
    ember.r[i] = 1.4 + Math.random() * 2.4;
  }

  function stepEmbers(dt) {
    for (var i = 0; i < ember.n; i++) {
      if (ember.life[i] <= 0) continue;
      ember.life[i] -= dt;
      ember.x[i] += ember.vx[i] * dt;
      ember.y[i] += ember.vy[i] * dt;
      ember.vy[i] += 26 * dt; /* they slow, arc over and fall back */
      ember.vx[i] *= 1 - 1.4 * dt;
    }
  }

  /* ------------------------------------------------------------------ state */

  var S = { draw: 0, front: 0, outline: 0, hot: 0, sheen: 0, sheenX: -460 };
  var lastTime = -1;

  var FRONT_BAND = 0.06; /* width of the molten edge, in normalised distance */

  function render() {
    if (!backW) return;
    var now = gsap.ticker.time;
    var dt = lastTime < 0 ? 0 : Math.min(0.05, now - lastTime);
    lastTime = now;

    layTo(S.front);
    stepEmbers(dt);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, backW, backH);

    /* Metal, revealed only where gold has actually been laid down. */
    if (S.front > 0) {
      ctx.drawImage(metal, 0, 0);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(deposit, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

    /* The molten edge: the slice of grains the front is passing through right
       now, stamped hot and additively over the metal. */
    if (S.hot > 0 && S.front > 0 && S.front < 1.001) {
      var hi = lowerBound(S.front);
      var lo = lowerBound(S.front - FRONT_BAND);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = S.hot;
      var step = Math.max(1, ((hi - lo) / 260) | 0);
      for (var i = lo; i < hi; i += step) {
        var heat = (grains.t[i] - (S.front - FRONT_BAND)) / FRONT_BAND;
        var r = 3 + 5 * heat;
        ctx.globalAlpha = S.hot * (0.18 + 0.72 * heat * heat);
        ctx.drawImage(hotSprite, grains.x[i] - r, grains.y[i] - r, r * 2, r * 2);
      }
      ctx.restore();

      if (hi > lo && dt > 0) {
        var wanted = Math.min(4, Math.round(dt * 150));
        for (var k = 0; k < wanted; k++) {
          var pick = lo + (((hi - lo) * Math.random()) | 0);
          spawnEmber(grains.x[pick], grains.y[pick]);
        }
      }
    }

    if (ember.n) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var e = 0; e < ember.n; e++) {
        if (ember.life[e] <= 0) continue;
        var f = ember.life[e] / ember.max[e];
        ctx.globalAlpha = f * f * 0.85;
        var er = ember.r[e] * (0.5 + f);
        ctx.drawImage(emberSprite, ember.x[e] - er, ember.y[e] - er, er * 2, er * 2);
      }
      ctx.restore();
    }

    /* The drawn trace, and the point of light that closes it. */
    if (S.outline > 0) {
      ctx.save();
      ctx.globalAlpha = S.outline;
      var sg = ctx.createLinearGradient(
        bbox.x + 0.1 * bbox.width, bbox.y,
        bbox.x + 0.9 * bbox.width, bbox.y + bbox.height
      );
      sg.addColorStop(0, STROKE_A);
      sg.addColorStop(1, STROKE_B);
      ctx.strokeStyle = sg;
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([pathLen, pathLen]);
      ctx.lineDashOffset = pathLen * (1 - S.draw);
      ctx.stroke(markPath);
      ctx.setLineDash([]);
      ctx.restore();

      if (S.draw > 0 && S.draw < 1) {
        var head = probe.getPointAtLength(pathLen * S.draw);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = S.outline;
        ctx.drawImage(hotSprite, head.x - 9, head.y - 9, 18, 18);
        ctx.restore();
      }
    }

    /* Specular bar rakes across the set metal. */
    if (S.sheen > 0) {
      ctx.save();
      ctx.clip(markPath);
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = S.sheen;
      ctx.translate(VB_W / 2, VB_H / 2);
      ctx.rotate((-32 * Math.PI) / 180);
      ctx.translate(-VB_W / 2, -VB_H / 2);
      var bar = ctx.createLinearGradient(S.sheenX, 0, S.sheenX + 160, 0);
      bar.addColorStop(0, 'rgba(255,253,242,0)');
      bar.addColorStop(0.38, 'rgba(255,253,242,0.14)');
      bar.addColorStop(0.5, 'rgba(255,255,255,1)');
      bar.addColorStop(0.62, 'rgba(255,253,242,0.14)');
      bar.addColorStop(1, 'rgba(255,253,242,0)');
      ctx.fillStyle = bar;
      ctx.fillRect(S.sheenX, -320, 160, 1280);
      ctx.restore();
    }
  }

  /* ------------------------------------------------------------- transitions */

  var tl = null;
  var exited = false;

  function exit() {
    if (exited) return;
    exited = true;
    if (tl) tl.kill();
    gsap.ticker.remove(render);
    window.removeEventListener('resize', fitLockup);
    U.exitPreloader(preloader);
    if (skipBtn) skipBtn.hidden = true;
  }

  function settle() {
    S.draw = 1;
    S.front = 1;
    S.outline = 0;
    S.hot = 0;
    S.sheen = 0;
    ember.n = 0;
    render();
    gsap.set(bloom, { opacity: 1, scale: 1 });
    gsap.set(wordmark, { autoAlpha: 1, y: 0 });
    gsap.set(lockup, { scale: 1, autoAlpha: 1 });
    document.body.classList.remove('is-preloading');
    preloader.hidden = true;
  }

  function play() {
    gsap.set(bloom, { opacity: 0, scale: 0.82 });
    gsap.set(wordmark, { autoAlpha: 0, y: 14 });
    gsap.set(lockup, { scale: 0.97, autoAlpha: 1, transformOrigin: '50% 50%' });

    S.draw = 0;
    S.front = 0;
    S.outline = 1;
    S.hot = 0;
    S.sheen = 0;
    S.sheenX = -460;

    tl = gsap.timeline({
      onComplete: function () {
        if (inspect) return;
        U.waitForReady(110).then(exit);
      },
    });

    /* I — a point of light traces the outline shut (0 → 0.95s) */
    tl.to(S, { draw: 1, duration: 0.95, ease: 'bcDraw' }, 0)

      /* II — gold pours in from the tail tip behind the closed line (0.88 → 1.63s) */
      .to(S, { hot: 1, duration: 0.14, ease: 'power2.out' }, 0.88)
      .to(S, { front: 1, duration: 0.75, ease: 'bcPour' }, 0.88)
      .to(S, { hot: 0, duration: 0.22, ease: 'power2.in' }, 1.46)
      .to(bloom, { opacity: 1, scale: 1, duration: 0.68, ease: 'power2.out' }, 1.0)
      /* The trace holds solid, then merges as the pour overtakes it. */
      .to(S, { outline: 0, duration: 0.48, ease: 'power2.inOut' }, 1.02)

      /* III — specular sweep sets the metal (1.32 → 1.88s) */
      .to(S, { sheen: 1, duration: 0.12, ease: 'power1.out' }, 1.32)
      .to(S, { sheenX: 700, duration: 0.55, ease: 'power2.inOut' }, 1.32)
      .to(S, { sheen: 0, duration: 0.16, ease: 'power1.in' }, 1.72)

      /* IV — wordmark settles in (1.52 → 1.94s) */
      .to(lockup, { scale: 1, duration: 0.46, ease: 'power2.out' }, 1.52)
      .to(wordmark, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 1.54)

      /* V — hold, then the ready gate and a 0.65s fade → ~2.95s all in */
      .to({}, { duration: 0.2 }, 1.94);

    if (inspect) {
      tl.pause(0);
      window.__bcTL = tl;
      window.__bcSeek = function (t) {
        tl.time(t);
        tl.pause();
        render();
      };
    }
  }

  gsap.registerPlugin(CustomEase);
  /* Slow to commit, then confident — reads as a hand drawing rather than a wipe. */
  CustomEase.create('bcDraw', 'M0,0 C0.22,0 0.1,1 1,1');
  /* Liquid: eases in as it takes, settles gently as it tops out. */
  CustomEase.create('bcPour', 'M0,0 C0.34,0.06 0.2,1 1,1');

  fitLockup();
  /* Gotham lands after first paint and widens the wordmark, which changes the fit. */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLockup);
  window.addEventListener('resize', fitLockup);

  if (reduce) {
    settle();
    return;
  }

  gsap.ticker.add(render);
  play();
  if (skipBtn) skipBtn.addEventListener('click', exit);
})();
