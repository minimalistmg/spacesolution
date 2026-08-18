/**
 * Site-wide Lenis - smooth wheel on desktop, native touch, GSAP-synced.
 */
(function () {
  'use strict';

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var lenis = null;
  var gsapTick = null;

  function expose(instance) {
    window.SpaceSolutionsLenis = {
      instance: instance,
      stop: function () {
        if (lenis) lenis.stop();
      },
      start: function () {
        if (lenis) lenis.start();
      },
      scrollTo: function (target, options) {
        if (lenis) {
          lenis.scrollTo(target, options || {});
          return;
        }
        if (typeof target === 'number') {
          window.scrollTo(0, target);
        } else if (target && typeof target.getBoundingClientRect === 'function') {
          var top = target.getBoundingClientRect().top + window.pageYOffset;
          var offset = options && typeof options.offset === 'number' ? options.offset : 0;
          window.scrollTo(0, top + offset);
        }
      },
    };
  }

  function unbindGsap() {
    if (gsapTick && window.gsap) {
      window.gsap.ticker.remove(gsapTick);
    }
    gsapTick = null;
  }

  function destroy() {
    unbindGsap();
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
  }

  function bindGsap(instance) {
    if (window.ScrollTrigger) {
      instance.on('scroll', window.ScrollTrigger.update);
    }

    if (!window.gsap) return;

    gsapTick = function (time) {
      instance.raf(time * 1000);
    };
    window.gsap.ticker.add(gsapTick);
    window.gsap.ticker.lagSmoothing(0);
  }

  function create() {
    if (!window.Lenis || reduceMq.matches) return null;

    var instance = new window.Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: !window.gsap,
      allowNestedScroll: true,
      overscroll: false,
      stopInertiaOnNavigate: true,
      anchors: false,
      prevent: function (node) {
        if (!node || typeof node.closest !== 'function') return false;
        return !!node.closest(
          '[data-lenis-prevent], .mobile-menu, #enquiry-modal, #video-modal, .palette-panel, [data-contact-panel], .global-nav-popover-body'
        );
      },
    });

    bindGsap(instance);

    if (document.documentElement.classList.contains('ss-preloader-pending')) {
      instance.stop();
    }

    return instance;
  }

  function init() {
    destroy();
    lenis = create();
    expose(lenis);
  }

  init();

  window.addEventListener('ss:preloader-done', function () {
    if (!lenis) return;
    lenis.start();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });

  if (typeof reduceMq.addEventListener === 'function') {
    reduceMq.addEventListener('change', init);
  }
})();
