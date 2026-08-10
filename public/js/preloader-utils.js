(function (global) {
  'use strict';

  function prepStroke(el) {
    if (!el) return 0;
    var len = el.getTotalLength();
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    return len;
  }

  function hasDrawSVG() {
    return typeof DrawSVGPlugin !== 'undefined';
  }

  function setDrawStart(el) {
    if (!el) return;
    if (hasDrawSVG()) {
      gsap.set(el, { drawSVG: '0%' });
    } else {
      prepStroke(el);
    }
  }

  function drawTo(el, duration) {
    if (hasDrawSVG()) {
      return { drawSVG: '100%', duration: duration, ease: 'power2.inOut' };
    }
    prepStroke(el);
    return { strokeDashoffset: 0, duration: duration, ease: 'power2.inOut' };
  }

  /** Wait for window load + fonts + minimum display time */
  function waitForReady(minMs) {
    minMs = minMs || 1200;
    var start = Date.now();
    var loadDone = false;
    var fontDone = false;

    return new Promise(function (resolve) {
      function tryResolve() {
        if (!loadDone || !fontDone) return;
        var elapsed = Date.now() - start;
        var wait = Math.max(0, minMs - elapsed);
        setTimeout(resolve, wait);
      }

      if (document.readyState === 'complete') {
        loadDone = true;
      } else {
        window.addEventListener('load', function () {
          loadDone = true;
          tryResolve();
        }, { once: true });
      }

      if (global.document.fonts && global.document.fonts.ready) {
        global.document.fonts.ready.then(function () {
          fontDone = true;
          tryResolve();
        }).catch(function () {
          fontDone = true;
          tryResolve();
        });
      } else {
        fontDone = true;
      }

      tryResolve();
    });
  }

  function exitPreloader(el, onComplete) {
    if (!el) {
      if (onComplete) onComplete();
      return;
    }
    document.documentElement.classList.remove('ss-preloader-pending');
    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: function () {
        el.hidden = true;
        if (onComplete) onComplete();
      },
    });
  }

  global.PreloaderUtils = {
    prepStroke: prepStroke,
    hasDrawSVG: hasDrawSVG,
    setDrawStart: setDrawStart,
    drawTo: drawTo,
    waitForReady: waitForReady,
    exitPreloader: exitPreloader,
  };
})(window);
