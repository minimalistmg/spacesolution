/**
 * Footer reveal driven by Lenis (or native scroll).
 * The footer remains fixed to the viewport bottom while `.page-cover`
 * uncovers it. GSAP adds subtle internal parallax during the reveal.
 */
(function () {
  'use strict';

  if (window.__spaceSolutionFooterReveal) return;
  window.__spaceSolutionFooterReveal = true;

  function initFooterReveal() {
    var cover = document.querySelector('.page-cover');
    var footer = document.querySelector('.footer-reveal');
    if (!cover || !footer) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var footerH = 0;
    var viewH = 0;
    var content = footer.querySelector('.fgsap-inner');
    var stage = footer.querySelector('.fgsap-stage');
    var setContentY = null;
    var setStageY = null;

    function measure() {
      footer.classList.remove('is-reveal-pinned');
      document.documentElement.classList.remove('has-footer-reveal');

      footerH = Math.round(footer.getBoundingClientRect().height);
      viewH = window.innerHeight || document.documentElement.clientHeight || 1;
      if (footerH < 1) return false;

      document.documentElement.style.setProperty('--footer-reveal-h', footerH + 'px');
      document.documentElement.classList.add('has-footer-reveal');
      footer.classList.add('is-reveal-pinned');

      if (window.gsap) {
        setContentY = content ? window.gsap.quickSetter(content, 'y', 'px') : null;
        setStageY = stage ? window.gsap.quickSetter(stage, 'y', 'px') : null;
      }

      return true;
    }

    function apply() {
      if (footerH < 1 || !footer.classList.contains('is-reveal-pinned')) return;

      var coverBottom = cover.getBoundingClientRect().bottom;
      var progress = (viewH - coverBottom) / footerH;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      /* Footer stays still; only its contents drift gently into place. */
      if (setContentY) setContentY((1 - progress) * 28);
      if (setStageY) setStageY((1 - progress) * 14);
    }

    function sync() {
      if (!measure()) return;
      apply();
    }

    sync();

    var lenis = window.SpaceSolutionsLenis && window.SpaceSolutionsLenis.instance;
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', apply);
    }

    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', sync);
    window.addEventListener('ss:preloader-done', sync);

    function loop() {
      apply();
      window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);

    window.setTimeout(sync, 400);
    window.setTimeout(sync, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterReveal);
  } else {
    initFooterReveal();
  }
})();
