/**

 * Concept 10 — Perspective Grid (3s)

 * Grid reveal → flatten → logo iris from vanishing point → exit

 */

(function () {

  'use strict';



  if (typeof gsap === 'undefined' || typeof BrandMark === 'undefined') return;



  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var rafId = 0;

  var exited = false;



  var preloader = document.querySelector('[data-pl-preloader]');

  var canvas = document.querySelector('[data-pl-grid-canvas]');

  var lockupHost = document.querySelector('[data-pl-lockup-host]');

  var skipBtn = document.querySelector('[data-pl-skip]');



  var lockup = BrandMark.mountLockup(lockupHost, {

    uid: 'pg',

    iconSrc: '../../../brand/icon-source.png',

    center: true,

  });



  var fill = lockup.querySelector('[data-brand-fill]');

  var wire = lockup.querySelector('[data-brand-wire]');

  var wordmark = lockup.querySelector('.brand-wordmark');



  gsap.registerPlugin(CustomEase);

  CustomEase.create('pgSnap', 'M0,0 C0.22,0.9 0.28,1 1,1');



  var grid = {

    w: 0,

    h: 0,

    ctx: null,

    vpX: 0.36,

    vpY: 0.4,

    reveal: 0,

    perspective: 1,

    lift: 1,

  };



  var reveal = { pct: 0 };



  function initGrid() {

    if (!canvas) return;

    grid.ctx = canvas.getContext('2d');

    resizeGrid();

    window.addEventListener('resize', resizeGrid);

  }



  function resizeGrid() {

    if (!canvas || !grid.ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    grid.w = window.innerWidth;

    grid.h = window.innerHeight;

    canvas.width = Math.floor(grid.w * dpr);

    canvas.height = Math.floor(grid.h * dpr);

    canvas.style.width = grid.w + 'px';

    canvas.style.height = grid.h + 'px';

    grid.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawGrid();

  }



  function drawGrid() {

    var ctx = grid.ctx;

    if (!ctx) return;



    var w = grid.w;

    var h = grid.h;

    var vpx = w * grid.vpX;

    var vpy = h * grid.vpY;

    var p = grid.perspective;

    var lift = grid.lift;

    var rev = grid.reveal;



    ctx.clearRect(0, 0, w, h);



    var bg = ctx.createLinearGradient(0, 0, w, h);

    bg.addColorStop(0, '#eef1f6');

    bg.addColorStop(0.45, '#e4e8ef');

    bg.addColorStop(1, '#d6dbe4');

    ctx.fillStyle = bg;

    ctx.fillRect(0, 0, w, h);



    var hCount = 36;

    var vCount = 44;



    for (var i = 0; i <= hCount; i++) {

      var t = i / hCount;

      if (t > rev + 0.02) continue;



      var depth = Math.pow(t, 1.08 + p * 0.12);

      var y = vpy + (h + 100 - vpy) * depth;

      var spreadL = (t * 0.42 + p * t * 1.35) * w * (1 + lift * 0.08 * (1 - t));

      var spreadR = spreadL * (1 + p * 0.38 + lift * 0.06);

      var alpha = (0.06 + t * 0.16) * (0.55 + lift * 0.45 * (1 - t));



      ctx.strokeStyle = 'rgba(84, 55, 39, ' + alpha + ')';

      ctx.lineWidth = 1;

      ctx.beginPath();

      ctx.moveTo(vpx - spreadL, y);

      ctx.lineTo(vpx + spreadR, y);

      ctx.stroke();



      if (p > 0.15 && t > 0.05 && t < rev) {

        ctx.strokeStyle = 'rgba(239, 200, 36, ' + (0.02 + t * 0.04) + ')';

        ctx.lineWidth = 0.5;

        ctx.beginPath();

        ctx.moveTo(vpx - spreadL * 0.98, y);

        ctx.lineTo(vpx + spreadR * 0.98, y);

        ctx.stroke();

      }

    }



    for (var j = -vCount; j <= vCount; j++) {

      var vt = (j + vCount) / (vCount * 2);

      if (vt > rev + 0.02) continue;



      var fan = j / vCount;

      var xBot = vpx + fan * w * (0.72 + p * 0.85);

      var alphaV = 0.05 + Math.abs(fan) * 0.08 + p * 0.04;



      ctx.strokeStyle = 'rgba(84, 55, 39, ' + alphaV + ')';

      ctx.lineWidth = 1;

      ctx.beginPath();

      ctx.moveTo(vpx, vpy);

      ctx.lineTo(xBot, h + 60);

      ctx.stroke();

    }



    if (p > 0.2) {

      var haze = ctx.createRadialGradient(vpx, vpy, 0, vpx, vpy, w * 0.55);

      haze.addColorStop(0, 'rgba(255, 255, 255, ' + (0.18 * lift) + ')');

      haze.addColorStop(0.35, 'rgba(239, 200, 36, ' + (0.04 * lift) + ')');

      haze.addColorStop(1, 'rgba(84, 55, 39, 0)');

      ctx.fillStyle = haze;

      ctx.fillRect(0, 0, w, h);

    }

  }



  function startGridLoop() {

    function loop() {

      drawGrid();

      rafId = requestAnimationFrame(loop);

    }

    cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(loop);

  }



  function stopGridLoop() {

    cancelAnimationFrame(rafId);

    drawGrid();

  }



  function setReveal(pct) {

    lockupHost.style.setProperty('--pl-reveal', pct + '%');

  }



  function exit() {

    if (exited) return;

    exited = true;

    stopGridLoop();

    if (skipBtn) skipBtn.hidden = true;

    document.body.classList.remove('is-preloading');

    gsap.to(preloader, {

      autoAlpha: 0,

      duration: 0.45,

      ease: 'power2.in',

      onComplete: function () {

        preloader.hidden = true;

      },

    });

  }



  function settle() {

    preloader.classList.remove('is-blueprint');

    preloader.classList.add('is-revealed');

    gsap.set(fill, { opacity: 1 });

    gsap.set(wire, { opacity: 0 });

    gsap.set(lockupHost, { autoAlpha: 1 });

    setReveal(120);

    grid.reveal = 1;

    grid.perspective = 0;

    grid.lift = 0;

    drawGrid();

    preloader.hidden = true;

    document.body.classList.remove('is-preloading');

  }



  function play() {

    initGrid();

    startGridLoop();



    gsap.set(fill, { opacity: 0 });

    gsap.set(wire, { opacity: 0.5 });

    gsap.set(wordmark, { autoAlpha: 0, y: 6 });

    gsap.set(lockupHost, { autoAlpha: 1, scale: 0.96 });

    setReveal(0);



    grid.reveal = 0;

    grid.perspective = 1;

    grid.lift = 1;



    var tl = gsap.timeline({

      onComplete: exit,

    });



    /* I — Grid draws out from vanishing point (~1.1s) */

    tl.to(grid, {

      reveal: 1,

      duration: 1.1,

      ease: 'power2.out',

      onUpdate: drawGrid,

    })



      /* II — Grid snaps flat + logo blooms from VP (~0.9s) */

      .to(

        grid,

        {

          perspective: 0,

          lift: 0,

          duration: 0.85,

          ease: 'pgSnap',

          onUpdate: drawGrid,

        },

        '-=0.05'

      )

      .to(

        reveal,

        {

          pct: 130,

          duration: 0.85,

          ease: 'pgSnap',

          onUpdate: function () {

            setReveal(reveal.pct);

          },

        },

        '<'

      )

      .to(lockupHost, { scale: 1, duration: 0.85, ease: 'pgSnap' }, '<')



      /* III — Wire → gold, wordmark in (~0.45s) */

      .add(function () {

        preloader.classList.remove('is-blueprint');

        preloader.classList.add('is-revealed');

      }, '-=0.35')

      .to(wire, { opacity: 0, duration: 0.25, ease: 'power2.out' }, '-=0.35')

      .to(fill, { opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.2')

      .to(wordmark, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')



      /* IV — Brief hold (~0.65s) then exit (0.45s) = 3s total */

      .to({}, { duration: 0.65 });

  }



  if (reduce) {

    settle();

    return;

  }



  play();

  if (skipBtn) skipBtn.addEventListener('click', exit);

})();


