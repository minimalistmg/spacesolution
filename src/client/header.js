/**
 * Space Solutions — header navigation (desktop global menu + mobile menu)
 */
(function ($) {
  'use strict';

  var SCROLL_THRESHOLD = 50;

  var $header = $('.site-header');
  var $mobileMenu = $('.mobile-menu');
  var scrollLock = null;

  function isNavOpen() {
    if ($mobileMenu.hasClass('open')) return true;
    if (window.SpaceSolutionsGlobalNav && window.SpaceSolutionsGlobalNav.isOpen()) return true;
    return false;
  }

  function initHeaderScroll() {
    var lastScrollY = $(window).scrollTop();
    var ticking = false;

    function applyScrollState(scrollY) {
      var pastThreshold = scrollY > SCROLL_THRESHOLD;
      var scrollingDown = scrollY > lastScrollY;
      var scrollingUp = scrollY < lastScrollY;
      var shouldHide = false;
      var shouldSolid = false;

      if (isNavOpen()) {
        $header.removeClass('is-hidden');
        lastScrollY = scrollY;
        return;
      }

      // About gallery pin: keep header hidden while scrubbing (either direction)
      if (document.documentElement.classList.contains('is-about-gallery-pinned')) {
        shouldHide = true;
        shouldSolid = true;
      } else if (!pastThreshold) {
        shouldHide = false;
        shouldSolid = false;
      } else if (scrollingDown) {
        shouldHide = true;
        shouldSolid = true;
      } else if (scrollingUp) {
        shouldHide = false;
        shouldSolid = true;
      } else {
        shouldHide = $header.hasClass('is-hidden');
        shouldSolid = true;
      }

      $header.toggleClass('is-hidden', shouldHide);
      $header.toggleClass('scrolled', shouldSolid);
      lastScrollY = scrollY;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        applyScrollState($(window).scrollTop());
        ticking = false;
      });
    }

    applyScrollState(lastScrollY);
    $(window).on('scroll', onScroll);
  }

  function initGlobalNavMenu() {
    var DESKTOP_MQ = window.matchMedia('(min-width: 1024px)');
    var nav = document.querySelector('.header-nav');
    if (!nav) return;

    var popover = nav.querySelector('.global-nav-popover');
    var popoverBody = nav.querySelector('.global-nav-popover-body');
    var triggers = nav.querySelectorAll('.has-mega-menu');
    var panels = nav.querySelectorAll('.global-nav-panel');
    var closeTimer = null;
    var activeIndex = null;
    var panelMetrics = {};
    var panelOrder = [];

    triggers.forEach(function (trigger) {
      panelOrder.push(trigger.getAttribute('data-menu-panel'));
    });

    function isDesktop() {
      return DESKTOP_MQ.matches;
    }

    var MEGA_MENU_WIDTH = 780;
    var widthPanel = nav.querySelector('.global-nav-panel[data-panel-width]');
    if (widthPanel) {
      var configuredWidth = parseInt(widthPanel.getAttribute('data-panel-width'), 10);
      if (configuredWidth && !Number.isNaN(configuredWidth)) {
        MEGA_MENU_WIDTH = configuredWidth;
      }
    }

    function getPanelWidth() {
      return Math.min(MEGA_MENU_WIDTH, window.innerWidth * 0.92);
    }

    var CARET_HEIGHT = 14;

    function measurePanels() {
      panelMetrics = {};

      panels.forEach(function (panel) {
        var panelId = panel.getAttribute('data-menu-panel');
        var width = getPanelWidth();
        var clone = panel.cloneNode(true);

        clone.style.cssText =
          'position:static;visibility:hidden;pointer-events:none;opacity:1;transform:none;width:' +
          width +
          'px;display:flex;flex-direction:column;';

        var measureRoot = document.createElement('div');
        measureRoot.style.cssText =
          'position:absolute;left:-99999px;top:0;visibility:hidden;width:' + width + 'px;';
        measureRoot.appendChild(clone);
        document.body.appendChild(measureRoot);

        panelMetrics[panelId] = {
          width: width,
          height: measureRoot.offsetHeight,
        };

        measureRoot.remove();
      });
    }

    function setExpanded(index) {
      triggers.forEach(function (trigger, triggerIndex) {
        var link = trigger.querySelector('a');
        if (!link) return;
        link.setAttribute('aria-expanded', triggerIndex === index ? 'true' : 'false');
      });
    }

    function updatePanelStates(index) {
      panels.forEach(function (panel) {
        var panelId = panel.getAttribute('data-menu-panel');
        var panelIndex = panelOrder.indexOf(panelId);

        panel.classList.remove('is-active', 'is-before', 'is-after');

        if (panelIndex === index) {
          panel.classList.add('is-active');
        } else if (panelIndex < index) {
          panel.classList.add('is-before');
        } else {
          panel.classList.add('is-after');
        }
      });

      triggers.forEach(function (trigger, triggerIndex) {
        trigger.classList.toggle('is-menu-open', triggerIndex === index);
      });
    }

    function positionPopover(index) {
      var trigger = triggers[index];
      var panelId = trigger.getAttribute('data-menu-panel');
      var metrics = panelMetrics[panelId];
      if (!metrics) return;

      var navRect = nav.getBoundingClientRect();
      var triggerRect = trigger.getBoundingClientRect();
      var triggerCenter = triggerRect.left + triggerRect.width / 2 - navRect.left;
      var left = triggerCenter - metrics.width / 2;
      var minLeft = 0;
      var maxLeft = Math.max(0, navRect.width - metrics.width);
      left = Math.max(minLeft, Math.min(left, maxLeft));

      var arrowLeft = triggerCenter - left;

      popover.style.setProperty('--popover-left', left + 'px');
      popover.style.setProperty('--popover-width', metrics.width + 'px');
      popover.style.setProperty('--popover-height', metrics.height + 'px');
      popover.style.setProperty('--arrow-left', arrowLeft + 'px');
      popover.setAttribute('data-active-panel', panelId);
    }

    function openMenu(index) {
      if (!isDesktop()) return;

      if (window.SpaceSolutionsHeaderContact) {
        window.SpaceSolutionsHeaderContact.closeAll();
      }

      window.clearTimeout(closeTimer);
      var wasOpen = popover.classList.contains('is-open');

      if (!wasOpen) {
        popover.classList.add('is-instant-reposition');
      }

      activeIndex = index;
      updatePanelStates(index);
      positionPopover(index);
      popover.classList.add('is-open');
      popover.setAttribute('aria-hidden', 'false');
      setExpanded(index);
      $header.removeClass('is-hidden');

      if (!wasOpen) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            popover.classList.remove('is-instant-reposition');
          });
        });
      }
    }

    function closeMenu() {
      window.clearTimeout(closeTimer);
      activeIndex = null;
      popover.classList.remove('is-open');
      popover.setAttribute('aria-hidden', 'true');
      popover.removeAttribute('data-active-panel');
      setExpanded(null);

      panels.forEach(function (panel) {
        panel.classList.remove('is-active', 'is-before', 'is-after');
      });

      triggers.forEach(function (trigger) {
        trigger.classList.remove('is-menu-open');
      });
    }

    function scheduleClose() {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(closeMenu, 120);
    }

    function cancelClose() {
      window.clearTimeout(closeTimer);
    }

    measurePanels();

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener('mouseenter', function () {
        openMenu(index);
      });

      trigger.addEventListener('focusin', function () {
        openMenu(index);
      });
    });

    nav.addEventListener('mouseenter', cancelClose);
    nav.addEventListener('mouseleave', scheduleClose);
    nav.addEventListener('focusin', cancelClose);
    nav.addEventListener('focusout', function (event) {
      if (!nav.contains(event.relatedTarget)) {
        scheduleClose();
      }
    });

    window.addEventListener('resize', function () {
      measurePanels();
      if (activeIndex !== null) {
        positionPopover(activeIndex);
      }
    });

    DESKTOP_MQ.addEventListener('change', function () {
      measurePanels();
      closeMenu();
    });

    window.SpaceSolutionsGlobalNav = {
      close: closeMenu,
      isOpen: function () {
        return popover.classList.contains('is-open');
      },
    };
  }

  function initMobileMenu() {
    $('.menu-toggle').on('click', function () {
      $mobileMenu.addClass('open');
      $header.removeClass('is-hidden');
      if (scrollLock && scrollLock.lock) {
        scrollLock.lock();
      }
    });

    $('.mobile-close, .mobile-menu-overlay').on('click', function () {
      $mobileMenu.removeClass('open');
      if (scrollLock && scrollLock.unlock) {
        scrollLock.unlock();
      }
    });
  }

  function initSubmenuMobile() {
    $('.mobile-nav .has-submenu > a').on('click', function (e) {
      e.preventDefault();
      $(this).next('.submenu-mobile').slideToggle(200);
    });
  }

  function closeMobileMenu() {
    if (!$mobileMenu.hasClass('open')) return false;

    $mobileMenu.removeClass('open');
    if (scrollLock && scrollLock.unlock) {
      scrollLock.unlock();
    }

    return true;
  }

  function closeOnEscape() {
    var closed = false;

    if (window.SpaceSolutionsHeaderContact && window.SpaceSolutionsHeaderContact.isOpen()) {
      window.SpaceSolutionsHeaderContact.closeAll();
      closed = true;
    }

    if (window.SpaceSolutionsGlobalNav && window.SpaceSolutionsGlobalNav.isOpen()) {
      window.SpaceSolutionsGlobalNav.close();
      closed = true;
    }

    if (closeMobileMenu()) {
      closed = true;
    }

    return closed;
  }

  window.SpaceSolutionsHeader = {
    init: function (deps) {
      scrollLock = deps && deps.scrollLock ? deps.scrollLock : null;
      initHeaderScroll();
      initGlobalNavMenu();
      initMobileMenu();
      initSubmenuMobile();
    },
    closeOnEscape: closeOnEscape,
    closeMobileMenu: closeMobileMenu,
  };
})(jQuery);
