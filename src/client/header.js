/**
 * Space Solution — header navigation (desktop global menu + mobile menu)
 */
(function ($) {
  'use strict';

  var SCROLL_THRESHOLD = 50;
  // Ignore sub-threshold reversals (touchpad jitter, compositor rounding, overscroll).
  var DIRECTION_DELTA = 12;
  var breakpoints = window.SpaceSolutionsHeaderBreakpoints;

  var $header = $('.site-header');
  var $mobileMenu = $('.mobile-menu');
  var scrollLock = null;
  var mobileMenuFocusTrap = null;

  function isMobileNavViewport() {
    return breakpoints ? breakpoints.isMobileNav() : window.matchMedia('(max-width: 1366px)').matches;
  }

  function isTabletViewport() {
    return breakpoints ? breakpoints.isTabletNav() : window.matchMedia('(min-width: 768px) and (max-width: 1366px) and (pointer: fine)').matches;
  }

  function deactivateMobileMenuFocusTrap() {
    if (!mobileMenuFocusTrap) return;
    mobileMenuFocusTrap.deactivate();
    mobileMenuFocusTrap = null;
  }

  function activateMobileMenuFocusTrap() {
    if (!window.SpaceSolutionsFocusTrap || !$mobileMenu.length) return;

    deactivateMobileMenuFocusTrap();

    mobileMenuFocusTrap = window.SpaceSolutionsFocusTrap.create($mobileMenu[0], {
      initialFocus: function () {
        var preferred = $mobileMenu.find('.mobile-menu-rail-item.is-active').first();
        var fallback = $mobileMenu.find('.mobile-menu-rail-item').first();
        var target = preferred.length ? preferred[0] : fallback.length ? fallback[0] : null;
        if (target && typeof target.focus === 'function') {
          target.focus({ preventScroll: true });
        }
      },
    });
    mobileMenuFocusTrap.activate();
  }

  function isNavOpen() {
    if ($mobileMenu.hasClass('open')) return true;
    if (window.SpaceSolutionsGlobalNav && window.SpaceSolutionsGlobalNav.isOpen()) return true;
    return false;
  }

  function getScrollY() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (y < 0) return 0;
    var maxY = document.documentElement.scrollHeight - window.innerHeight;
    if (maxY > 0 && y > maxY) return maxY;
    return y;
  }

  function initHeaderScroll() {
    var lastScrollY = getScrollY();
    var directionDelta = 0;
    var ticking = false;

    function applyScrollState(scrollY) {
      var pastThreshold = scrollY > SCROLL_THRESHOLD;
      var delta = scrollY - lastScrollY;
      lastScrollY = scrollY;

      if (isNavOpen()) {
        $header.removeClass('is-hidden');
        directionDelta = 0;
        return;
      }

      if (isMobileNavViewport()) {
        $header.removeClass('is-hidden');
        $header.toggleClass('scrolled', pastThreshold);
        directionDelta = 0;
        return;
      }

      if (!pastThreshold) {
        $header.removeClass('is-hidden scrolled');
        directionDelta = 0;
        return;
      }

      $header.addClass('scrolled');

      if (!delta) return;

      directionDelta += delta;

      if (directionDelta > DIRECTION_DELTA) {
        $header.addClass('is-hidden');
        directionDelta = DIRECTION_DELTA;
      } else if (directionDelta < -DIRECTION_DELTA) {
        $header.removeClass('is-hidden');
        directionDelta = -DIRECTION_DELTA;
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        applyScrollState(getScrollY());
        ticking = false;
      });
    }

    applyScrollState(lastScrollY);
    $(window).on('scroll', onScroll);
  }

  function initGlobalNavMenu() {
    var desktopMq = breakpoints
      ? window.matchMedia(breakpoints.mq.desktopNav)
      : window.matchMedia('(min-width: 1367px)');
    var coarseMq = breakpoints
      ? window.matchMedia(breakpoints.mq.coarsePointer)
      : window.matchMedia('(pointer: coarse)');
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
      return desktopMq.matches;
    }

    function blurNavFocus() {
      if (nav.contains(document.activeElement) && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
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

      blurNavFocus();
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
        if (coarseMq.matches) return;
        openMenu(index);
      });

      trigger.addEventListener('focusin', function () {
        openMenu(index);
      });

      trigger.addEventListener('click', function (event) {
        if (!isDesktop() || !coarseMq.matches) return;

        var link = trigger.querySelector('a');
        if (!link) return;

        if (popover.classList.contains('is-open') && activeIndex === index) {
          return;
        }

        event.preventDefault();
        openMenu(index);
      });
    });

    nav.addEventListener('mouseenter', cancelClose);
    nav.addEventListener('mouseleave', function () {
      if (coarseMq.matches) return;
      scheduleClose();
    });
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

    desktopMq.addEventListener('change', function () {
      measurePanels();
      closeMenu();
    });

    coarseMq.addEventListener('change', function () {
      closeMenu();
    });

    window.SpaceSolutionsGlobalNav = {
      close: closeMenu,
      isOpen: function () {
        return popover.classList.contains('is-open');
      },
    };
  }

  function initMobileMasterDetail() {
    var $menu = $('.mobile-menu--master-detail');
    if (!$menu.length) return;

    function setActivePanel(panelId) {
      $menu.find('.mobile-menu-rail-item').each(function () {
        var $item = $(this);
        var isActive = $item.data('panel') === panelId;
        $item.toggleClass('is-active', isActive).attr('aria-selected', isActive ? 'true' : 'false');
      });

      $menu.find('.mobile-menu-detail-pane').each(function () {
        var $pane = $(this);
        var isActive = $pane.data('panel') === panelId;
        $pane.toggleClass('is-active', isActive);
        if (isActive) {
          $pane.removeAttr('hidden');
        } else {
          $pane.prop('hidden', true);
        }
      });
    }

    $menu.on('click', '.mobile-menu-rail-item', function () {
      setActivePanel(String($(this).data('panel')));
    });

    $menu.on('click', '[data-mobile-menu-connect]', function (event) {
      event.preventDefault();
      if (window.SpaceSolutionsHeaderContact && window.SpaceSolutionsHeaderContact.openMobile) {
        window.SpaceSolutionsHeaderContact.openMobile({ fromMenu: true });
      }
    });
  }

  function resetMobileMenuDragState() {
    if (!$mobileMenu.length) return;
    $mobileMenu.removeClass('is-menu-dragging').css('transform', '');
  }

  function setMobileMenuOpen(isOpen) {
    $mobileMenu.toggleClass('open', isOpen);
    $('body').toggleClass('mobile-menu-open', isOpen);
    $('.menu-toggle, .menu-toggle-fab, .menu-toggle-round').attr('aria-expanded', isOpen ? 'true' : 'false');
    $('.menu-toggle-fab, .menu-toggle-round').attr('aria-label', isOpen ? 'Close menu' : 'Open menu');
    $('.mobile-menu-backdrop').attr('aria-hidden', isOpen ? 'false' : 'true');
    resetMobileMenuDragState();

    if (isOpen) {
      if (isTabletViewport() && window.SpaceSolutionsHeaderContact) {
        window.SpaceSolutionsHeaderContact.closeAll();
      }
      $header.removeClass('is-hidden');
      if (scrollLock && scrollLock.lock) {
        scrollLock.lock();
      }
      activateMobileMenuFocusTrap();
      return;
    }

    deactivateMobileMenuFocusTrap();

    if (scrollLock && scrollLock.unlock) {
      scrollLock.unlock();
    }
  }

  function initMobileMenuDrag() {
    var menu = $mobileMenu[0];
    if (!menu || menu.dataset.menuDragInit === 'true') return;
    menu.dataset.menuDragInit = 'true';

    var MOBILE_MENU_MQ = breakpoints
      ? window.matchMedia(breakpoints.mq.mobileNav)
      : window.matchMedia('(max-width: 1366px)');
    var DRAG_START = 6;
    var DRAG_CLOSE_X = 80;
    var DRAG_CLOSE_Y = 72;

    var tracking = false;
    var dragging = false;
    var axis = null;
    var startX = 0;
    var startY = 0;
    var deltaX = 0;
    var deltaY = 0;
    var activePointerId = null;
    var scrollEl = null;

    function isDragEnabled() {
      return (
        MOBILE_MENU_MQ.matches &&
        $mobileMenu.hasClass('open') &&
        !document.body.classList.contains('connect-sheet-open')
      );
    }

    function getScrollContainer(target) {
      if (!menu.contains(target)) return null;

      var pane = target.closest('.mobile-menu-detail-pane');
      if (pane && !pane.hasAttribute('hidden')) return pane;

      var rail = target.closest('.mobile-menu-rail');
      if (rail) return rail;

      return null;
    }

    function getScrollTop() {
      return scrollEl ? scrollEl.scrollTop : 0;
    }

    function setDraggingState(isDragging) {
      $mobileMenu.toggleClass('is-menu-dragging', isDragging);
    }

    function applyDragOffset() {
      if (axis === 'x') {
        menu.style.transform = 'translateX(' + Math.max(0, deltaX) + 'px)';
        return;
      }

      if (axis === 'y') {
        menu.style.transform = 'translateY(' + Math.max(0, deltaY) + 'px)';
      }
    }

    function resetDragOffset() {
      setDraggingState(false);
      menu.style.transform = '';
    }

    function releaseCapture(pointerId) {
      if (menu.hasPointerCapture(pointerId)) {
        menu.releasePointerCapture(pointerId);
      }
    }

    function stopTracking() {
      if (activePointerId !== null) {
        releaseCapture(activePointerId);
      }
      tracking = false;
      dragging = false;
      axis = null;
      activePointerId = null;
      deltaX = 0;
      deltaY = 0;
      scrollEl = null;
    }

    function closeFromDrag() {
      setDraggingState(false);
      menu.style.transform = axis === 'y' ? 'translateY(100%)' : 'translateX(100%)';

      var finished = false;

      function finishClose() {
        if (finished) return;
        finished = true;
        menu.style.transform = '';
        setMobileMenuOpen(false);
      }

      menu.addEventListener(
        'transitionend',
        function (event) {
          if (event.target !== menu || event.propertyName !== 'transform') return;
          finishClose();
        },
        { once: true }
      );

      window.setTimeout(finishClose, 350);
    }

    function finishDrag() {
      if (!tracking) return;

      var shouldClose = false;

      if (dragging) {
        if (axis === 'x' && deltaX > DRAG_CLOSE_X) {
          shouldClose = true;
        } else if (axis === 'y' && deltaY > DRAG_CLOSE_Y) {
          shouldClose = true;
        }
      }

      stopTracking();

      if (shouldClose) {
        closeFromDrag();
        return;
      }

      resetDragOffset();
    }

    function onPointerDown(event) {
      if (!isDragEnabled()) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      tracking = true;
      dragging = false;
      axis = null;
      activePointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      deltaX = 0;
      deltaY = 0;
      scrollEl = getScrollContainer(event.target);
    }

    function onPointerMove(event) {
      if (!tracking || activePointerId !== event.pointerId) return;

      var moveX = event.clientX - startX;
      var moveY = event.clientY - startY;

      if (!dragging) {
        var absX = Math.abs(moveX);
        var absY = Math.abs(moveY);

        if (absX < DRAG_START && absY < DRAG_START) return;

        if (moveX > DRAG_START && absX > absY) {
          axis = 'x';
        } else if (moveY > DRAG_START && absY >= absX) {
          if (getScrollTop() > 0) {
            stopTracking();
            return;
          }
          axis = 'y';
        } else {
          return;
        }

        dragging = true;
        setDraggingState(true);
        menu.setPointerCapture(event.pointerId);
      }

      event.preventDefault();

      deltaX = Math.max(0, moveX);
      deltaY = Math.max(0, moveY);
      applyDragOffset();
    }

    function onPointerEnd(event) {
      if (!tracking || activePointerId !== event.pointerId) return;
      releaseCapture(event.pointerId);
      finishDrag();
    }

    menu.addEventListener('pointerdown', onPointerDown, true);
    menu.addEventListener('pointermove', onPointerMove, { passive: false, capture: true });
    menu.addEventListener('pointerup', onPointerEnd, true);
    menu.addEventListener('pointercancel', onPointerEnd, true);
  }

  function initMobileMenuOutsideClose() {
    if (document.documentElement.dataset.mobileMenuOutsideInit === 'true') return;
    document.documentElement.dataset.mobileMenuOutsideInit = 'true';

    document.addEventListener(
      'pointerdown',
      function (event) {
        if (!isTabletViewport() || !$mobileMenu.hasClass('open')) return;

        var target = event.target;
        if (!target || typeof target.closest !== 'function') return;
        if (target.closest('.mobile-menu')) return;
        if (target.closest('.menu-toggle-round, .menu-toggle-fab, .menu-toggle')) return;

        setMobileMenuOpen(false);
      },
      true
    );
  }

  function initMobileMenuViewportGuard() {
    var mobileNavMq = breakpoints
      ? window.matchMedia(breakpoints.mq.mobileNav)
      : window.matchMedia('(max-width: 1366px)');

    mobileNavMq.addEventListener('change', function (event) {
      if (!event.matches) {
        closeMobileMenu();
      }
    });
  }

  function initMobileMenu() {
    $('.menu-toggle, .menu-toggle-fab, .menu-toggle-round').on('click', function () {
      setMobileMenuOpen(!$mobileMenu.hasClass('open'));
    });

    $('.mobile-menu-overlay, .mobile-menu-backdrop').on('pointerdown', function (event) {
      if (!isTabletViewport()) return;
      event.preventDefault();
      setMobileMenuOpen(false);
    });

    initMobileMenuOutsideClose();
  }

  function closeMobileMenu() {
    if (!$mobileMenu.hasClass('open')) return false;

    setMobileMenuOpen(false);
    return true;
  }

  function closeOnEscape() {
    if (window.SpaceSolutionsHeaderContact && window.SpaceSolutionsHeaderContact.isOpen()) {
      window.SpaceSolutionsHeaderContact.closeAll();
      return true;
    }

    if (window.SpaceSolutionsGlobalNav && window.SpaceSolutionsGlobalNav.isOpen()) {
      window.SpaceSolutionsGlobalNav.close();
      return true;
    }

    if (closeMobileMenu()) {
      return true;
    }

    return false;
  }

  window.SpaceSolutionsHeader = {
    init: function (deps) {
      scrollLock = deps && deps.scrollLock ? deps.scrollLock : null;
      initHeaderScroll();
      initGlobalNavMenu();
      initMobileMenu();
      initMobileMenuViewportGuard();
      initMobileMenuDrag();
      initMobileMasterDetail();
    },
    closeOnEscape: closeOnEscape,
    closeMobileMenu: closeMobileMenu,
  };
})(jQuery);
