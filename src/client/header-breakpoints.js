/**
 * Shared header navigation breakpoints and focus-trap helper.
 */
(function (win) {
  'use strict';

  var BP = {
    MOBILE_CONNECT_MAX: 767,
    TABLET_MIN: 768,
    MOBILE_NAV_MAX: 1366,
    DESKTOP_MIN: 1367,
  };

  var mq = {
    mobileConnect: '(max-width: ' + BP.MOBILE_CONNECT_MAX + 'px)',
    mobileNav: '(max-width: ' + BP.MOBILE_NAV_MAX + 'px)',
    desktopNav: '(min-width: ' + BP.DESKTOP_MIN + 'px)',
    tabletNav:
      '(min-width: ' +
      BP.TABLET_MIN +
      'px) and (max-width: ' +
      BP.MOBILE_NAV_MAX +
      'px) and (pointer: fine)',
    phoneNav:
      '(max-width: ' +
      BP.MOBILE_CONNECT_MAX +
      'px), (min-width: ' +
      BP.TABLET_MIN +
      'px) and (max-width: ' +
      BP.MOBILE_NAV_MAX +
      'px) and (pointer: coarse)',
    coarsePointer: '(pointer: coarse)',
  };

  function createFocusTrap(container, options) {
    options = options || {};
    var focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var active = false;
    var previousFocus = null;

    function getFocusables() {
      return Array.prototype.slice
        .call(container.querySelectorAll(focusableSelector))
        .filter(function (el) {
          return !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true';
        });
    }

    function onKeyDown(event) {
      if (!active || event.key !== 'Tab') return;

      var focusables = getFocusables();
      if (!focusables.length) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    return {
      activate: function () {
        if (active || !container) return;
        active = true;
        previousFocus = document.activeElement;

        document.addEventListener('keydown', onKeyDown, true);

        if (typeof options.initialFocus === 'function') {
          options.initialFocus();
          return;
        }

        if (options.initialFocus && typeof options.initialFocus.focus === 'function') {
          options.initialFocus.focus({ preventScroll: true });
          return;
        }

        var focusables = getFocusables();
        if (focusables.length) {
          focusables[0].focus({ preventScroll: true });
        }
      },
      deactivate: function () {
        if (!active) return;
        active = false;
        document.removeEventListener('keydown', onKeyDown, true);

        if (previousFocus && typeof previousFocus.focus === 'function') {
          previousFocus.focus({ preventScroll: true });
        }

        previousFocus = null;
      },
    };
  }

  win.SpaceSolutionsHeaderBreakpoints = {
    BP: BP,
    mq: mq,
    isMobileConnect: function () {
      return win.matchMedia(mq.mobileConnect).matches;
    },
    isMobileNav: function () {
      return win.matchMedia(mq.mobileNav).matches;
    },
    isDesktopNav: function () {
      return win.matchMedia(mq.desktopNav).matches;
    },
    isTabletNav: function () {
      return win.matchMedia(mq.tabletNav).matches;
    },
    isPhoneNav: function () {
      return win.matchMedia(mq.phoneNav).matches;
    },
    isCoarsePointer: function () {
      return win.matchMedia(mq.coarsePointer).matches;
    },
  };

  win.SpaceSolutionsFocusTrap = {
    create: createFocusTrap,
  };
})(window);
