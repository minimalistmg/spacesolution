/**
 * Concept 19 — Gold Forge
 * Outline traces itself in gold · molten fill pours in from below ·
 * specular sweep sets the metal · wordmark settles.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ss-preloader-seen';
  var PRELOADER_HOLD = false;
  var preloader = document.querySelector('[data-pl-preloader]');

  try {
    if (!PRELOADER_HOLD && sessionStorage.getItem(STORAGE_KEY)) {
      document.documentElement.classList.remove('ss-preloader-pending');
      if (preloader) preloader.hidden = true;
      return;
    }
  } catch (storageError) {
    /* ignore */
  }

  if (typeof gsap === 'undefined') {
    if (!PRELOADER_HOLD) {
      document.documentElement.classList.remove('ss-preloader-pending');
      if (preloader) preloader.hidden = true;
    }
    return;
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var inspect = /[?&]inspect(?:=1|$)/.test(location.search);
  var U = window.PreloaderUtils;

  var host = document.querySelector('[data-pl-lockup-host]');
  var bloom = document.querySelector('[data-pl-bloom]');

  if (!preloader || !host) {
    if (!PRELOADER_HOLD) {
      document.documentElement.classList.remove('ss-preloader-pending');
    }
    return;
  }

  function markSeen() {
    if (PRELOADER_HOLD) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (storageError) {
      /* ignore */
    }
  }

  /* Fair-curve version of the catalogue ribbon. One shape drives the fill, both
     clips and the stroke, so the drawn line sits exactly on the edge of the metal.

     The catalogue path (BrandMark.paths.ribbon) is a bitmap trace: ~700 straight
     segments on integer coordinates. Threading a spline exactly through those
     points — which earlier revisions did — forces the curve to honour every bit
     of trace jitter, so the bend lurches: a curvature comb over it saw-tooths and
     in places flips sides. Smoothing first only softens that, because
     interpolation still has to hit each point.

     So this is a least-squares fit instead, derived offline: 88 control points of
     a closed cubic B-spline solved against 1200 samples of the traced outline,
     with a fairness term penalising uneven bending. Passing near the points
     rather than through them lets the curve ignore the jitter. Curvature
     variation drops 0.43 -> 0.18 and the worst departure from the trace is 5.6 of
     the 564 artboard units, at the two sharp tips, which round very slightly.
     Refit the same way if the catalogue mark is ever redrawn.

     Wound to begin at the bottom tail tip and head right along the tail, so the
     line draws away from the tip and the pour follows the same route. Rotating
     which segment comes first leaves the geometry untouched — the path measures
     2288.46 units either way.

     Lives in _shared/brand-shape.js so concept 20 renders the same curves. */
  var SHAPE = BrandShape.SHAPE;

  /* The fold. The mark is a twisted ribbon, not a flat silhouette, and the two
     faces meet along a crease that runs its whole length. Running a slope
     detector over the Logo Literature scan (brand/_find_creases.py) finds it as
     two arcs of high interior slope — a smooth fill has slope ~0.06 per pixel,
     these run to 18. brand/_extract_creases.py then registers the scan onto this
     artboard and traces them; the scan is cropped on the right and bottom, so
     the small complete icon supplies the registration and the pieces the scan
     loses. Both regions below are open half-planes, closed off well outside the
     artboard, and get clipped to SHAPE. */
  var FOLD_UPPER = BrandShape.FOLD_UPPER;
  var FOLD_LOWER = BrandShape.FOLD_LOWER;

  /* Icon artboard — every geometry number below is in these units. */
  var VB_W = BrandShape.WIDTH;
  var VB_H = BrandShape.HEIGHT;

  /* The pour used to be a full-width rectangle sliding upward, which reads as a
     waterline: the tail and the body filled as separate pieces at the same time
     and only joined up later. Gold should enter at one point and run through the
     form.

     Straight-line distance from the tip can't express that, because the mark
     curls back on itself — a point can sit close to the tip across the gap while
     being far away through the metal. A rotating wedge fails for the same reason;
     no centre orders the form correctly (613 candidates tested, none under a full
     turn). What does work is distance measured *along* the metal: flood the
     interior from the tip travelling only through filled pixels. Baked into a
     greyscale field, one animated threshold then sweeps the front down the ribbon,
     tail tip to top horn. */
  var FIELD_SCALE = 2; /* half resolution — it only drives a mask */
  var FRONT = 0.07; /* molten leading edge, as a fraction of the whole run */

  function buildDistanceField() {
    var w = Math.round(VB_W / FIELD_SCALE);
    var h = Math.round(VB_H / FIELD_SCALE);
    var cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    var ctx = cv.getContext('2d');
    ctx.scale(1 / FIELD_SCALE, 1 / FIELD_SCALE);
    ctx.fill(new Path2D(SHAPE));

    var img = ctx.getImageData(0, 0, w, h);
    var px = img.data;
    var n = w * h;
    var i;

    var solid = new Uint8Array(n);
    for (i = 0; i < n; i++) solid[i] = px[i * 4 + 3] > 128 ? 1 : 0;

    /* SHAPE is wound to start at the tail tip, so its first point is the gate */
    var sx = 23.05 / FIELD_SCALE;
    var sy = 563.17 / FIELD_SCALE;
    var seed = -1;
    var seedD = Infinity;
    for (i = 0; i < n; i++) {
      if (!solid[i]) continue;
      var dx = (i % w) - sx;
      var dy = ((i / w) | 0) - sy;
      var q = dx * dx + dy * dy;
      if (q < seedD) {
        seedD = q;
        seed = i;
      }
    }
    if (seed < 0) return null;

    var dist = new Float32Array(n);
    for (i = 0; i < n; i++) dist[i] = Infinity;

    var NX = [1, -1, 0, 0, 1, 1, -1, -1];
    var NY = [0, 0, 1, -1, 1, -1, 1, -1];
    var NW = [1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2];

    /* Dijkstra, bucketed by distance so it stays linear rather than needing a heap */
    var STEP = 0.5;
    var buckets = [];
    function add(k, v) {
      var b = (v / STEP) | 0;
      (buckets[b] || (buckets[b] = [])).push(k);
    }
    dist[seed] = 0;
    add(seed, 0);

    var far = 0;
    for (var b = 0; b < buckets.length; b++) {
      var list = buckets[b];
      if (!list) continue;
      for (var t = 0; t < list.length; t++) {
        var k = list[t];
        var dk = dist[k];
        if (dk > (b + 1) * STEP) continue; /* superseded since it was queued */
        var x = k % w;
        var y = (k / w) | 0;
        for (var d = 0; d < 8; d++) {
          var X = x + NX[d];
          var Y = y + NY[d];
          if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
          var kk = Y * w + X;
          if (!solid[kk]) continue;
          var v = dk + NW[d];
          if (v < dist[kk]) {
            dist[kk] = v;
            if (v > far) far = v;
            add(kk, v);
          }
        }
      }
    }
    if (!far) return null;

    /* white at the gate, black at the far end, so one threshold walks the front */
    for (i = 0; i < n; i++) {
      var o = i * 4;
      var dv = dist[i];
      var lum = solid[i] && isFinite(dv) ? Math.round(255 * (1 - dv / far)) : 0;
      px[o] = lum;
      px[o + 1] = lum;
      px[o + 2] = lum;
      px[o + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return cv.toDataURL();
  }

  host.innerHTML =
    '<div class="brand-lockup brand-lockup--center gf-lockup" data-gf-lockup>' +
    '<div class="brand-icon-wrap">' +
    '<svg class="brand-icon-svg gf-svg" viewBox="0 0 ' + VB_W + ' ' + VB_H + '" aria-hidden="true">' +
    '<defs>' +
    /* Catalogue metal, fitted rather than guessed.

       Two things set the look, and getting either wrong loses the 3D. First the
       axis: sweeping it and taking binned median colours puts the ramp at 8
       degrees, very nearly horizontal. The brand's own #brandGoldBase has the
       right colours but runs at about 50 degrees, which is why every version
       built on that axis looked wrong however the stops were placed. Second the
       fold — see FOLD_UPPER. A ramp alone, however well fitted, renders a flat
       silhouette; it can score a low average error while losing the crease that
       actually reads as depth.

       All stops here and in the fold gradients are binned medians off the scan,
       so they are the catalogue's own colours rather than picked ones.
       brand/_fit_faces.py derives them; brand/_visual_diff.py checks a render
       back against the scan (mean 1.8/255, median 1) and brand/_residual.py
       splits that error by face, which is what catches a gradient being wrong
       on one arm only. */
    '<clipPath id="gfShape"><path d="' + SHAPE + '"/></clipPath>' +
    /* The lit face. Fitting the ramp to the median of *all* pixels, as an
       earlier revision did, bakes the shadow into the base — then laying the
       fold on top can only land the shaded side and the lit side stays too
       dark, which measured as the left third rendering 17 low. So the two faces
       are fitted separately (brand/_fit_faces.py, 27k lit px) and this is the
       lit one; the fold below supplies the shadow. */
    '<linearGradient id="gfGoldBase" x1="4.06%" y1="0.57%" x2="102.72%" y2="14.44%">' +
    '<stop offset="0%" stop-color="#bf9728"/>' +
    '<stop offset="21%" stop-color="#bf9728"/>' +
    '<stop offset="29%" stop-color="#c59d2b"/>' +
    '<stop offset="38%" stop-color="#cca630"/>' +
    '<stop offset="46%" stop-color="#d4af35"/>' +
    '<stop offset="54%" stop-color="#dcb738"/>' +
    '<stop offset="62%" stop-color="#e3c03c"/>' +
    '<stop offset="71%" stop-color="#eccc54"/>' +
    '<stop offset="79%" stop-color="#f4d76a"/>' +
    '<stop offset="88%" stop-color="#f5dc7d"/>' +
    '<stop offset="100%" stop-color="#f6e190"/>' +
    '</linearGradient>' +
    /* Back face of the fold — a tint laid over the lit ramp at a constant alpha,
       the colour doing all the work. Near the tips the shaded face is browner
       (#bf9728 -> #a2792c, 26 darker). Around two thirds along, the fold turns
       edge-on and the faces meet, so the tint passes through the ramp's own
       colour and vanishes. At the horn it returns, but there the shaded face is
       not darker so much as more saturated — it loses blue — hence the stops
       finishing on a deep gold rather than a brown.

       Both share gfGoldBase's axis, and have to. An objectBoundingBox gradient
       resolves its offset in the normalised box, so the base ramp carries a
       vertical term as well as a horizontal one. These paths run far outside the
       artboard and so cannot use objectBoundingBox themselves; writing them as
       plain horizontal gradients instead dropped that vertical term, and the
       tail — sitting near the bottom of the box — sampled the ramp about 12%
       early and rendered 13 too dark. The userSpace endpoints below reproduce
       the base's offset exactly.

       The arms are fitted separately: the tail's shadow fades off faster along
       the mark than the upper arm's. */
    '<linearGradient id="gfFoldUpper" gradientUnits="userSpaceOnUse" x1="65.9" y1="8.6" x2="577.4" y2="75.0">' +
    '<stop offset="0%" stop-color="#693e33" stop-opacity="0.34"/>' +
    '<stop offset="21%" stop-color="#693e33" stop-opacity="0.34"/>' +
    '<stop offset="29%" stop-color="#6f4a39" stop-opacity="0.34"/>' +
    '<stop offset="38%" stop-color="#886247" stop-opacity="0.34"/>' +
    '<stop offset="46%" stop-color="#9f7d4f" stop-opacity="0.34"/>' +
    '<stop offset="54%" stop-color="#b8995b" stop-opacity="0.34"/>' +
    '<stop offset="62%" stop-color="#ceb162" stop-opacity="0.34"/>' +
    '<stop offset="71%" stop-color="#ddbd4b" stop-opacity="0.34"/>' +
    '<stop offset="79%" stop-color="#f1d12c" stop-opacity="0.34"/>' +
    '<stop offset="88%" stop-color="#efc707" stop-opacity="0.34"/>' +
    '<stop offset="100%" stop-color="#edbd00" stop-opacity="0.34"/>' +
    '</linearGradient>' +
    '<linearGradient id="gfFoldLower" gradientUnits="userSpaceOnUse" x1="65.9" y1="8.6" x2="577.4" y2="75.0">' +
    '<stop offset="0%" stop-color="#693e33" stop-opacity="0.34"/>' +
    '<stop offset="21%" stop-color="#693e33" stop-opacity="0.34"/>' +
    '<stop offset="29%" stop-color="#845c42" stop-opacity="0.34"/>' +
    '<stop offset="38%" stop-color="#977450" stop-opacity="0.34"/>' +
    '<stop offset="46%" stop-color="#ad8b58" stop-opacity="0.34"/>' +
    '<stop offset="54%" stop-color="#c1a861" stop-opacity="0.34"/>' +
    '<stop offset="62%" stop-color="#e0c068" stop-opacity="0.34"/>' +
    '<stop offset="71%" stop-color="#eed15c" stop-opacity="0.34"/>' +
    '<stop offset="79%" stop-color="#f4d96c" stop-opacity="0.34"/>' +
    '<stop offset="88%" stop-color="#efc707" stop-opacity="0.34"/>' +
    '<stop offset="100%" stop-color="#edbd00" stop-opacity="0.34"/>' +
    '</linearGradient>' +
    /* Drawn trace — catalogue edge gold. */
    '<linearGradient id="gfStroke" x1="10%" y1="0%" x2="90%" y2="100%">' +
    '<stop offset="0%" stop-color="#a57e35"/>' +
    '<stop offset="100%" stop-color="#b98a2c"/>' +
    '</linearGradient>' +
    /* Pour front — warm champagne, not saturated orange. */
    '<linearGradient id="gfMeniscus" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="#fff3cf" stop-opacity="0"/>' +
    '<stop offset="42%" stop-color="#fff6de" stop-opacity="0.85"/>' +
    '<stop offset="52%" stop-color="#ffd98a" stop-opacity="0.9"/>' +
    '<stop offset="100%" stop-color="#efc824" stop-opacity="0"/>' +
    '</linearGradient>' +
    /* Tight hot core with a faint halo — a soft wide band just washes the metal out. */
    '<linearGradient id="gfSheen" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="#fffdf2" stop-opacity="0"/>' +
    '<stop offset="38%" stop-color="#fffdf2" stop-opacity="0.14"/>' +
    '<stop offset="50%" stop-color="#ffffff" stop-opacity="1"/>' +
    '<stop offset="62%" stop-color="#fffdf2" stop-opacity="0.14"/>' +
    '<stop offset="100%" stop-color="#fffdf2" stop-opacity="0"/>' +
    '</linearGradient>' +
    '<filter id="gfHot" x="-80%" y="-80%" width="260%" height="260%">' +
    '<feGaussianBlur stdDeviation="4" result="gfH"/>' +
    '<feMerge><feMergeNode in="gfH"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>' +
    /* Falls off to nothing at the rim so the light has no hard edge to leave
       sticking out past the tip. */
    '<radialGradient id="gfSparkFill">' +
    '<stop offset="0%" stop-color="#fff8e2"/>' +
    '<stop offset="45%" stop-color="#fff8e2" stop-opacity="0.72"/>' +
    '<stop offset="100%" stop-color="#fff8e2" stop-opacity="0"/>' +
    '</radialGradient>' +
    /* Spark halo — soft warm white, not orange bloom. */
    '<filter id="gfSpark" x="-100%" y="-100%" width="300%" height="300%">' +
    '<feGaussianBlur stdDeviation="2.2" result="gfS"/>' +
    '<feMerge><feMergeNode in="gfS"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>' +
    /* Both read the same distance field. gfReveal opens everything the front has
       passed; gfBand rides the front itself — the table turns the ramp into a
       stripe, which is the molten edge. Only the intercepts animate. */
    '<filter id="gfReveal" color-interpolation-filters="sRGB">' +
    '<feComponentTransfer data-gf-reveal>' +
    '<feFuncR type="linear" slope="1" intercept="0"/>' +
    '<feFuncG type="linear" slope="1" intercept="0"/>' +
    '<feFuncB type="linear" slope="1" intercept="0"/>' +
    '</feComponentTransfer>' +
    '</filter>' +
    '<filter id="gfBand" color-interpolation-filters="sRGB">' +
    '<feComponentTransfer data-gf-band>' +
    '<feFuncR type="linear" slope="1" intercept="0"/>' +
    '<feFuncG type="linear" slope="1" intercept="0"/>' +
    '<feFuncB type="linear" slope="1" intercept="0"/>' +
    '</feComponentTransfer>' +
    '<feComponentTransfer>' +
    '<feFuncR type="table" tableValues="0 1 0"/>' +
    '<feFuncG type="table" tableValues="0 1 0"/>' +
    '<feFuncB type="table" tableValues="0 1 0"/>' +
    '</feComponentTransfer>' +
    '</filter>' +
    '<mask id="gfPourMask" maskUnits="userSpaceOnUse" x="0" y="0" width="' + VB_W + '" height="' + VB_H + '">' +
    '<image data-gf-field width="' + VB_W + '" height="' + VB_H + '" preserveAspectRatio="none" filter="url(#gfReveal)"/>' +
    '</mask>' +
    '<mask id="gfFrontMask" maskUnits="userSpaceOnUse" x="0" y="0" width="' + VB_W + '" height="' + VB_H + '">' +
    '<image data-gf-field width="' + VB_W + '" height="' + VB_H + '" preserveAspectRatio="none" filter="url(#gfBand)"/>' +
    '</mask>' +
    '</defs>' +

    '<g mask="url(#gfPourMask)" data-gf-metal>' +
    '<path fill="url(#gfGoldBase)" d="' + SHAPE + '"/>' +
    '<g clip-path="url(#gfShape)">' +
    '<path d="' + FOLD_UPPER + '" fill="url(#gfFoldUpper)"/>' +
    '<path d="' + FOLD_LOWER + '" fill="url(#gfFoldLower)"/>' +
    '</g>' +
    '</g>' +

    /* Glow sits outside the mask so the bloom spills past the front rather than
       being cut off square at it. */
    '<g filter="url(#gfHot)">' +
    '<g mask="url(#gfFrontMask)">' +
    '<path data-gf-meniscus d="' + SHAPE + '" fill="url(#gfMeniscus)" opacity="0"/>' +
    '</g>' +
    '</g>' +

    '<g clip-path="url(#gfShape)">' +
    '<rect data-gf-sheen x="-460" y="-320" width="160" height="1280" fill="url(#gfSheen)" opacity="0" style="mix-blend-mode:screen" transform="rotate(-32 282 315)"/>' +
    '</g>' +

    /* Solid drawn trace — holds closed, then dissolves into the filled metal. */
    '<path data-gf-outline fill="none" stroke="url(#gfStroke)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="' + SHAPE + '"/>' +
    /* Rides on the stroke, so it cannot be clipped to the shape without being
       halved. It stays soft-edged instead, which is what keeps it from reading
       as a lump where the tip narrows to a point. */
    '<circle data-gf-spark r="4.6" cx="23.05" cy="563.17" fill="url(#gfSparkFill)" opacity="0" filter="url(#gfSpark)"/>' +
    '</svg>' +
    '</div>' +
    '<div class="brand-wordmark">' +
    '<span class="brand-space">space</span>' +
    '<span class="brand-solution">SOLUTION</span>' +
    '</div>' +
    '</div>';

  var lockup = host.querySelector('[data-gf-lockup]');
  var outline = host.querySelector('[data-gf-outline]');
  var spark = host.querySelector('[data-gf-spark]');
  var meniscus = host.querySelector('[data-gf-meniscus]');
  var sheen = host.querySelector('[data-gf-sheen]');
  var wordmark = host.querySelector('.brand-wordmark');
  var spaceEl = host.querySelector('.brand-space');
  var solutionEl = host.querySelector('.brand-solution');
  var revealFn = host.querySelectorAll('[data-gf-reveal] > *');
  var bandFn = host.querySelectorAll('[data-gf-band] > *');

  var field = buildDistanceField();
  var fieldImgs = host.querySelectorAll('[data-gf-field]');
  var i;
  for (i = 0; i < fieldImgs.length; i++) fieldImgs[i].setAttribute('href', field);

  /* Ramp widths are fixed; only the front's position animates. */
  var REVEAL_SLOPE = 1 / FRONT;
  var BAND_SLOPE = 1 / (FRONT * 1.6);
  for (i = 0; i < revealFn.length; i++) revealFn[i].setAttribute('slope', String(REVEAL_SLOPE));
  for (i = 0; i < bandFn.length; i++) bandFn[i].setAttribute('slope', String(BAND_SLOPE));

  /* The lockup is a fixed-pixel catalogue asset, so a full-screen reveal has to
     fit it to the viewport. Width breakpoints alone can't do it: this lockup is
     taller than it is wide, so on anything landscape it's the viewport *height*
     that runs out first, and a laptop and a desktop at the same width need
     different scales. Measuring instead covers both axes.

     offsetWidth/Height are layout sizes and ignore transforms, so this reads the
     natural size even while the entrance tween is scaling the lockup. */
  var FIT_H = 0.34;
  var FIT_W = 0.48;
  var FIT_MIN = 0.5;
  var FIT_MAX = 1.2;

  function fitLockup() {
    var w = lockup.offsetWidth;
    var h = lockup.offsetHeight;
    if (!w || !h) return;
    var s = Math.min((window.innerHeight * FIT_H) / h, (window.innerWidth * FIT_W) / w);
    s = Math.max(FIT_MIN, Math.min(s, FIT_MAX));
    host.style.setProperty('--gf-scale', String(Math.round(s * 1000) / 1000));
  }

  fitLockup();
  /* Gotham arrives after first paint and widens the wordmark, which changes the
     fit. */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLockup);
  window.addEventListener('resize', fitLockup);

  gsap.registerPlugin(CustomEase);
  /* Slow to commit, then confident — reads as a hand drawing rather than a wipe. */
  CustomEase.create('gfDraw', 'M0,0 C0.22,0 0.1,1 1,1');
  /* Liquid: eases in as it takes, settles gently as it tops out. */
  CustomEase.create('gfPourEase', 'M0,0 C0.34,0.06 0.2,1 1,1');

  var pathLen = outline.getTotalLength();

  /* t is the front's position in field terms: 1 at the gate, -FRONT once the far
     end is covered. Alpha is (luminance - t) / ramp, so shifting the intercept
     walks the front and the ramp trails behind it as molten metal. */
  function setFront(t) {
    var k;
    for (k = 0; k < revealFn.length; k++) {
      revealFn[k].setAttribute('intercept', String(-t * REVEAL_SLOPE));
    }
    for (k = 0; k < bandFn.length; k++) {
      bandFn[k].setAttribute('intercept', String(-t * BAND_SLOPE));
    }
  }

  function setDraw(p) {
    outline.style.strokeDashoffset = String(pathLen * (1 - p));
    var pt = outline.getPointAtLength(pathLen * p);
    spark.setAttribute('cx', String(pt.x));
    spark.setAttribute('cy', String(pt.y));
  }

  var tl = null;
  var exited = false;

  function exit() {
    if (PRELOADER_HOLD || exited) return;
    exited = true;
    markSeen();
    if (tl) tl.kill();
    window.removeEventListener('resize', fitLockup);
    document.documentElement.classList.remove('ss-preloader-pending');
    U.exitPreloader(preloader);
  }

  function settle() {
    markSeen();
    outline.style.strokeDasharray = 'none';
    gsap.set(outline, { opacity: 0, visibility: 'hidden' });
    gsap.set(spark, { opacity: 0 });
    gsap.set(meniscus, { opacity: 0 });
    gsap.set(sheen, { opacity: 0 });
    setFront(-FRONT);
    gsap.set(bloom, { opacity: 1, scale: 1 });
    gsap.set(wordmark, { autoAlpha: 1, y: 0 });
    gsap.set(lockup, { scale: 1, autoAlpha: 1 });
    gsap.set(spaceEl, { autoAlpha: 1, y: 0, letterSpacing: '-0.09em' });
    gsap.set(solutionEl, { autoAlpha: 1, y: 0, x: 0, letterSpacing: '0.32em' });
    if (PRELOADER_HOLD) return;
    document.documentElement.classList.remove('ss-preloader-pending');
    preloader.hidden = true;
  }

  function play() {
    outline.style.strokeDasharray = String(pathLen);
    gsap.set(outline, { opacity: 1 });
    gsap.set(meniscus, { opacity: 0 });
    gsap.set(sheen, { opacity: 0 });
    gsap.set(bloom, { opacity: 0, scale: 0.82 });
    gsap.set(wordmark, { autoAlpha: 1, y: 0 });
    gsap.set(spaceEl, { autoAlpha: 0, y: 8, letterSpacing: '1px' });
    gsap.set(solutionEl, { autoAlpha: 0, y: 8, x: -28, letterSpacing: '0.32em' });
    gsap.set(lockup, { scale: 0.97, autoAlpha: 1, transformOrigin: '50% 50%' });
    setFront(1);
    setDraw(0);

    var draw = { p: 0 };
    var pour = { t: 1 };
    var sweep = { x: -460 };

    tl = gsap.timeline({
      onComplete: function () {
        if (inspect || PRELOADER_HOLD) return;
        /* Timeline already ran 2.14s, so this gate only needs to cover a slow
           load. Building the distance field costs ~14ms up front, which put the
           total at 2998ms — trimming here keeps a usable margin under 3s. */
        U.waitForReady(110).then(exit);
      },
    });

    /* I — A point of light traces the outline shut (0 → 0.95s) */
    tl.set(spark, { opacity: 1 }, 0)
      .to(
        draw,
        {
          p: 1,
          duration: 0.95,
          ease: 'gfDraw',
          onUpdate: function () {
            setDraw(draw.p);
          },
        },
        0
      )
      .to(spark, { opacity: 0, duration: 0.18, ease: 'power2.in' }, 0.93)

      /* II — Molten gold pours in behind the closed outline (0.88 → 1.63s) */
      .to(meniscus, { opacity: 1, duration: 0.14, ease: 'power2.out' }, 0.88)
      .to(
        pour,
        {
          t: -FRONT,
          duration: 0.75,
          ease: 'gfPourEase',
          onUpdate: function () {
            setFront(pour.t);
          },
        },
        0.88
      )
      .to(meniscus, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 1.45)
      .to(bloom, { opacity: 1, scale: 1, duration: 0.68, ease: 'power2.out' }, 1.0)
      /* Closed trace holds solid, then merges as the pour overtakes it. */
      .to(outline, { opacity: 0, duration: 0.48, ease: 'power2.inOut' }, 1.02)
      .set(outline, { visibility: 'hidden' }, 1.52)

      /* III — Specular sweep rakes the metal (1.32 → ~2.67s) */
      .to(sheen, { opacity: 1, duration: 0.28, ease: 'power1.out' }, 1.32)
      .to(
        sweep,
        {
          x: 700,
          duration: 1.15,
          ease: 'power2.inOut',
          onUpdate: function () {
            sheen.setAttribute('x', String(sweep.x));
          },
        },
        1.32
      )
      .to(sheen, { opacity: 0, duration: 0.32, ease: 'power1.in' }, 2.35)

      /* IV — Wordmark: space and SOLUTION reveal together */
      .to(lockup, { scale: 1, duration: 0.46, ease: 'power2.out' }, 2.15)
      .to(spaceEl, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out' }, 2.15)
      .to(
        spaceEl,
        { letterSpacing: '-0.09em', duration: 0.72, ease: 'power3.out' },
        2.15
      )
      .to(
        solutionEl,
        { autoAlpha: 1, y: 0, x: 0, duration: 0.72, ease: 'power3.out' },
        2.15
      )

      /* V — Hold */
      .to({}, { duration: 0.35 }, 3.22);

    if (inspect) {
      tl.pause(0);
      window.__gfTL = tl;
      window.__gfSeek = function (t) {
        tl.time(t);
        tl.pause();
      };
      window.__gfZoom = function (x, y, w, h, scale) {
        var svg = host.querySelector('.gf-svg');
        var wrap = document.querySelector('.pl-lockup-host');
        if (svg) svg.setAttribute('viewBox', x + ' ' + y + ' ' + w + ' ' + h);
        if (scale) wrap.style.setProperty('--gf-scale', String(scale));
      };
    }
  }

  if (reduce) {
    settle();
    return;
  }

  play();
})();
