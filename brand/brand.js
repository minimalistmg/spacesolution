(function () {
  'use strict';

  var lockup = document.querySelector('[data-brand-lockup]');
  var pixels = document.getElementById('brand-icon-pixels');
  var svg = document.querySelector('.brand-icon-svg');

  function ready() {
    if (lockup) lockup.classList.add('is-ready');
  }

  if (pixels && !pixels.complete) {
    pixels.addEventListener('load', ready, { once: true });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ready).catch(ready);
  } else {
    window.addEventListener('load', ready);
  }
  setTimeout(ready, 500);

  window.BrandMark = {
    svg: svg,
    ribbon: document.getElementById('brand-ribbon'),
    ribbonUpper: document.getElementById('brand-ribbon-upper'),
    ribbonLower: document.getElementById('brand-ribbon-lower'),
    strokeUpper: document.getElementById('brand-stroke-upper'),
    strokeLower: document.getElementById('brand-stroke-lower'),
    ribbonFlat: document.getElementById('brand-ribbon-flat'),
    fillGroup: document.getElementById('brand-icon-fill'),
    strokeGroup: document.getElementById('brand-icon-stroke'),
    pixels: pixels,
  };
})();
