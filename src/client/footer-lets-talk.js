/**
 * Space Solution — footer "Let's talk" reveal (scroll pin under main)
 */
(function () {
  'use strict';

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterReveal);
  } else {
    initFooterReveal();
  }
})();
