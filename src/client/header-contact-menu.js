/**
 * Header contact Connect hub
 */
(function () {
  'use strict';

  var NAME_MIN = 3;
  var NAME_MAX = 50;
  var MOBILE_LEN = 10;
  var MESSAGE_MIN = 3;
  var MESSAGE_MAX = 500;
  var CONNECT_DRAFT_KEY = 'ss-connect-form-draft';
  var breakpoints = window.SpaceSolutionsHeaderBreakpoints;
  var MOBILE_CONNECT_MQ = breakpoints
    ? window.matchMedia(breakpoints.mq.mobileConnect)
    : window.matchMedia('(max-width: 767px)');
  var connectSheetScrollLocked = false;
  var mobileSheetCloseTimer = null;
  var hubFocusTraps = new WeakMap();

  var isRestoringConnectDraft = false;

  function isMobileConnect() {
    return breakpoints ? breakpoints.isMobileConnect() : MOBILE_CONNECT_MQ.matches;
  }

  function isTabletViewport() {
    return breakpoints
      ? breakpoints.isTabletNav()
      : window.matchMedia('(min-width: 768px) and (max-width: 1366px) and (pointer: fine)').matches;
  }

  function shouldTrapConnectFocus() {
    return isMobileConnect() || isTabletViewport();
  }

  function deactivateHubFocusTrap(root) {
    var trap = hubFocusTraps.get(root);
    if (!trap) return;
    trap.deactivate();
    hubFocusTraps.delete(root);
  }

  function activateHubFocusTrap(root, panel) {
    if (!window.SpaceSolutionsFocusTrap || !panel) return;

    deactivateHubFocusTrap(root);

    var trap = window.SpaceSolutionsFocusTrap.create(panel);
    trap.activate();
    hubFocusTraps.set(root, trap);
  }

  function closeMobileMenuIfOpen() {
    if (window.SpaceSolutionsHeader && window.SpaceSolutionsHeader.closeMobileMenu) {
      window.SpaceSolutionsHeader.closeMobileMenu();
    }
  }

  function getHubSheet(root) {
    if (!root._hubSheet) {
      root._hubSheet = {
        backdrop: root.querySelector('[data-contact-backdrop]'),
        panel: root.querySelector('[data-contact-panel="hub"]'),
        portalMarker: null,
      };
    }
    return root._hubSheet;
  }

  function ensureMobileSheetPortal(root) {
    var sheet = getHubSheet(root);
    if (!sheet.panel || !sheet.backdrop || !isMobileConnect()) return;
    if (sheet.panel.parentNode === document.body) return;

    sheet.portalMarker = document.createComment('hc-hub-portal');
    root.insertBefore(sheet.portalMarker, sheet.backdrop);
    document.body.appendChild(sheet.backdrop);
    document.body.appendChild(sheet.panel);
  }

  function restoreMobileSheetPortal(root) {
    var sheet = getHubSheet(root);
    if (!sheet.panel || !sheet.backdrop) return;
    if (sheet.panel.parentNode !== document.body) return;

    if (sheet.portalMarker && sheet.portalMarker.parentNode) {
      sheet.portalMarker.parentNode.insertBefore(sheet.backdrop, sheet.portalMarker);
      sheet.portalMarker.parentNode.insertBefore(sheet.panel, sheet.portalMarker);
    } else {
      root.appendChild(sheet.backdrop);
      root.appendChild(sheet.panel);
    }
  }

  function syncMobileSheetPortal(root) {
    if (isMobileConnect()) {
      ensureMobileSheetPortal(root);
      return;
    }
    restoreMobileSheetPortal(root);
  }

  function setMobileSheetVisible(root, visible) {
    var sheet = getHubSheet(root);
    root.classList.toggle('is-mobile-sheet-visible', visible);
    if (sheet.panel) {
      sheet.panel.classList.toggle('is-mobile-sheet-visible', visible);
    }
    if (sheet.backdrop) {
      sheet.backdrop.classList.toggle('is-mobile-sheet-visible', visible);
    }
    document.body.classList.toggle('connect-sheet-open', visible && isMobileConnect());
  }

  function isMobileMenuOpen() {
    return document.body.classList.contains('mobile-menu-open');
  }

  function lockConnectSheetScroll() {
    if (connectSheetScrollLocked || isMobileMenuOpen()) return;
    connectSheetScrollLocked = true;
    document.body.dataset.connectSheetScroll = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }

  function unlockConnectSheetScroll() {
    if (!connectSheetScrollLocked) return;
    connectSheetScrollLocked = false;
    if (isMobileMenuOpen()) return;
    document.body.style.overflow = document.body.dataset.connectSheetScroll || '';
    delete document.body.dataset.connectSheetScroll;
  }

  function isConnectHubOpen() {
    return Boolean(document.querySelector('.hc-hub.is-open'));
  }

  function closeAllConnectHubs() {
    document.querySelectorAll('[data-contact-smart]').forEach(function (root) {
      if (isMobileConnect() && root.classList.contains('is-open')) {
        closeMobileSheet(root);
        return;
      }
      closeAll(root);
    });
  }

  function closeAll(root) {
    if (mobileSheetCloseTimer) {
      window.clearTimeout(mobileSheetCloseTimer);
      mobileSheetCloseTimer = null;
    }

    deactivateHubFocusTrap(root);

    var sheet = getHubSheet(root);

    if (sheet.panel) {
      sheet.panel.hidden = true;
    }

    root.querySelectorAll('[data-contact-trigger]').forEach(function (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (typeof trigger.blur === 'function') {
        trigger.blur();
      }
    });
    root.classList.remove('is-open');
    root.classList.remove('hc-hub--from-menu');
    setMobileSheetVisible(root, false);

    if (sheet.backdrop) {
      sheet.backdrop.hidden = true;
      sheet.backdrop.setAttribute('aria-hidden', 'true');
    }

    if (sheet.panel) {
      sheet.panel.style.transform = '';
      sheet.panel.classList.remove('is-sheet-dragging');
      var surface = sheet.panel.querySelector('.hc-hub-panel-surface');
      if (surface) {
        surface.style.transform = '';
        surface.classList.remove('is-sheet-dragging');
      }
    }

    unlockConnectSheetScroll();

    if (window.SpaceSolutionsContactConfirm) {
      window.SpaceSolutionsContactConfirm.dismiss();
    }
  }

  function closeMobileSheet(root) {
    if (!root.classList.contains('is-open')) return;

    if (!isMobileConnect()) {
      closeAll(root);
      return;
    }

    setMobileSheetVisible(root, false);

    if (mobileSheetCloseTimer) {
      window.clearTimeout(mobileSheetCloseTimer);
    }

    mobileSheetCloseTimer = window.setTimeout(function () {
      closeAll(root);
      mobileSheetCloseTimer = null;
    }, 280);
  }

  function openMobileSheet(root, trigger, panel) {
    var sheet = getHubSheet(root);
    var backdrop = sheet.backdrop;

    if (mobileSheetCloseTimer) {
      window.clearTimeout(mobileSheetCloseTimer);
      mobileSheetCloseTimer = null;
    }

    ensureMobileSheetPortal(root);
    closeAllConnectHubs();

    panel.hidden = false;
    if (backdrop) {
      backdrop.hidden = false;
      backdrop.setAttribute('aria-hidden', 'false');
    }

    trigger.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    lockConnectSheetScroll();

    initConnectFormFields(panel);
    initConnectServiceChips(panel);

    var formScroll = panel.querySelector('.hc-hub-body');
    if (formScroll) {
      formScroll.classList.toggle('is-scroll-at-top', formScroll.scrollTop <= 0);
    }

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        setMobileSheetVisible(root, true);
        if (shouldTrapConnectFocus()) {
          activateHubFocusTrap(root, panel);
        }
      });
    });
  }

  var AUTOSUGGEST_PADDING = ' ';

  function getFieldErrorEl(field) {
    if (!field || !field.id) return null;
    return document.getElementById(field.id + '-error');
  }

  function setFieldError(field, message) {
    if (!field) return;

    var errorEl = getFieldErrorEl(field);
    if (errorEl) {
      errorEl.textContent = message || '';
    }

    field.classList.toggle('is-invalid', Boolean(message));

    var form = field.closest('#header-connect-form');
    if (form) {
      form.classList.toggle(
        'has-field-errors',
        Boolean(form.querySelector('.hc-hub-field-error:not(:empty)'))
      );
    }
  }

  function formatConnectName(value) {
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(function (word) {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  function getConnectNameValue(field) {
    if (!field) return '';
    var value = field.value || '';
    if (value === AUTOSUGGEST_PADDING) return '';
    return value.trim();
  }

  function getConnectMobileValue(field) {
    if (!field) return '';
    return (field.value || '').replace(/\D/g, '');
  }

  function readConnectFormDraft() {
    try {
      var raw = localStorage.getItem(CONNECT_DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveConnectFormDraft(form) {
    if (isRestoringConnectDraft || !form) return;

    var nameField = form.querySelector('[name="name"]');
    var mobileField = form.querySelector('[name="phone"]');
    var messageField = form.querySelector('[name="message"]');
    var draft = {
      name: getConnectNameValue(nameField),
      mobile: getConnectMobileValue(mobileField),
      message: (messageField && messageField.value || '').trim(),
    };

    if (!draft.name && !draft.mobile && !draft.message) {
      localStorage.removeItem(CONNECT_DRAFT_KEY);
      return;
    }

    try {
      localStorage.setItem(CONNECT_DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      /* ignore quota / privacy mode */
    }
  }

  function loadConnectFormDraft(form) {
    if (!form || form.dataset.draftLoaded === 'true') return;

    var draft = readConnectFormDraft();
    form.dataset.draftLoaded = 'true';

    if (!draft) return;

    isRestoringConnectDraft = true;

    var nameField = form.querySelector('[name="name"]');
    var mobileField = form.querySelector('[name="phone"]');
    var messageField = form.querySelector('[name="message"]');

    if (nameField && draft.name) {
      nameField.value = draft.name;
    }

    if (mobileField && draft.mobile) {
      mobileField.value = String(draft.mobile).replace(/\D/g, '');
    }

    if (messageField && draft.message) {
      messageField.value = draft.message;
    }

    isRestoringConnectDraft = false;
  }

  function clearConnectFormDraft() {
    try {
      localStorage.removeItem(CONNECT_DRAFT_KEY);
    } catch (error) {
      /* ignore */
    }
  }

  function validateConnectNameField(field) {
    var value = getConnectNameValue(field);

    if (value.length < NAME_MIN) {
      return 'Name must be at least 3 characters';
    }

    if (value.length > NAME_MAX) {
      return 'Name must be 50 characters or less';
    }

    return '';
  }

  function validateConnectMobileField(field) {
    if (!field) return 'Enter a 10-digit mobile number';

    var value = getConnectMobileValue(field);

    if (!value) {
      return 'Enter a 10-digit mobile number';
    }

    if (value.length !== MOBILE_LEN) {
      return 'Mobile must be exactly 10 digits';
    }

    return '';
  }

  function validateConnectMessageField(field) {
    if (!field) return 'Message must be at least 3 characters';

    var value = (field.value || '').trim();

    if (value.length < MESSAGE_MIN) {
      return 'Message must be at least 3 characters';
    }

    if (value.length > MESSAGE_MAX) {
      return 'Message must be 500 characters or less';
    }

    return '';
  }

  function validateConnectField(field) {
    if (!field) return '';

    if (field.name === 'name') {
      return validateConnectNameField(field);
    }

    if (field.name === 'phone') {
      return validateConnectMobileField(field);
    }

    if (field.name === 'message') {
      return validateConnectMessageField(field);
    }

    return '';
  }

  function showConnectFieldValidation(field) {
    setFieldError(field, validateConnectField(field));
  }

  function validateConnectForm(form) {
    if (!form) return '';

    var nameField = form.querySelector('[name="name"]');
    var mobileField = form.querySelector('[name="phone"]');
    var messageField = form.querySelector('[name="message"]');
    var fields = [nameField, mobileField, messageField];
    var firstError = '';

    fields.forEach(function (field) {
      var error = validateConnectField(field);
      setFieldError(field, error);
      if (!firstError && error) {
        firstError = error;
      }
    });

    return firstError;
  }

  function shouldKeepHubOpen(root, panel) {
    if (root.contains(document.activeElement)) return true;
    if (panel.querySelector('.hc-hub-field-error:not(:empty)')) return true;
    if (panel.closest('.hc-hub') && panel.closest('.hc-hub').classList.contains('is-open')) {
      var form = panel.querySelector('#header-connect-form');
      if (form && form.classList.contains('has-field-errors')) return true;
    }
    return false;
  }

  function prepareNameFieldForFocus(nameField) {
    if (!nameField.value.trim()) {
      nameField.value = AUTOSUGGEST_PADDING;
    }
  }

  function clearNameFieldPadding(nameField) {
    if (nameField.value === AUTOSUGGEST_PADDING) {
      nameField.value = '';
      return;
    }

    if (nameField.value.charAt(0) === AUTOSUGGEST_PADDING) {
      nameField.value = nameField.value.trimStart();
    }
  }

  function initConnectNameField(nameField, form) {
    if (!nameField || nameField.dataset.autosuggestGuard === 'true') return;
    nameField.dataset.autosuggestGuard = 'true';

    nameField.addEventListener('input', function () {
      clearNameFieldPadding(nameField);
      setFieldError(nameField, '');
      saveConnectFormDraft(form);
    });

    nameField.addEventListener('blur', function () {
      clearNameFieldPadding(nameField);

      if (nameField.value.trim()) {
        nameField.value = formatConnectName(nameField.value);
      } else {
        nameField.value = '';
      }

      showConnectFieldValidation(nameField);
      saveConnectFormDraft(form);
    });
  }

  function initConnectMobileField(mobileField, form) {
    if (!mobileField || mobileField.dataset.mobileGuard === 'true') return;
    mobileField.dataset.mobileGuard = 'true';

    mobileField.addEventListener('input', function () {
      var raw = mobileField.value;
      var digits = raw.replace(/\D/g, '');

      if (raw !== digits) {
        mobileField.value = digits;
        setFieldError(mobileField, 'Numbers only');
        saveConnectFormDraft(form);
        return;
      }

      setFieldError(mobileField, '');
      saveConnectFormDraft(form);
    });

    mobileField.addEventListener('blur', function () {
      mobileField.value = mobileField.value.replace(/\D/g, '');
      showConnectFieldValidation(mobileField);
      saveConnectFormDraft(form);
    });
  }

  function initConnectMessageField(messageField, form) {
    if (!messageField || messageField.dataset.messageGuard === 'true') return;
    messageField.dataset.messageGuard = 'true';

    messageField.addEventListener('input', function () {
      setFieldError(messageField, '');
      saveConnectFormDraft(form);
    });

    messageField.addEventListener('blur', function () {
      showConnectFieldValidation(messageField);
      saveConnectFormDraft(form);
    });
  }

  function initConnectFormFields(panel) {
    var form = panel.querySelector('#header-connect-form');
    if (!form || form.dataset.fieldValidationInit === 'true') return;
    form.dataset.fieldValidationInit = 'true';

    var nameField = form.querySelector('[name="name"]');
    var mobileField = form.querySelector('[name="phone"]');
    var messageField = form.querySelector('[name="message"]');

    loadConnectFormDraft(form);

    initConnectNameField(nameField, form);
    initConnectMobileField(mobileField, form);
    initConnectMessageField(messageField, form);

    form.addEventListener(
      'submit',
      function (event) {
        var error = validateConnectForm(form);
        if (error) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      true
    );
  }

  function isConnectFieldEmpty(field) {
    if (!field) return true;
    if (field.name === 'name') return !getConnectNameValue(field);
    if (field.name === 'phone') return !getConnectMobileValue(field);
    return !((field.value || '').trim());
  }

  function getFirstEmptyConnectField(form) {
    var fields = [
      form.querySelector('[name="name"]'),
      form.querySelector('[name="phone"]'),
      form.querySelector('[name="message"]'),
    ];

    for (var i = 0; i < fields.length; i++) {
      if (fields[i] && isConnectFieldEmpty(fields[i])) {
        return fields[i];
      }
    }

    return null;
  }

  function focusConnectField(field) {
    if (!field || typeof field.focus !== 'function') return;

    if (field.name === 'name') {
      var form = field.closest('#header-connect-form');
      if (form) {
        initConnectNameField(field, form);
      }
    }

    window.requestAnimationFrame(function () {
      if (field.name === 'name') {
        prepareNameFieldForFocus(field);
      }

      field.focus({ preventScroll: true });

      if (field.name === 'name' && typeof field.setSelectionRange === 'function') {
        field.setSelectionRange(field.value.length, field.value.length);
      }
    });
  }

  function focusFirstEmptyConnectField(panel) {
    var form = panel.querySelector('#header-connect-form');
    if (!form) return;

    var field = getFirstEmptyConnectField(form);
    if (field) {
      focusConnectField(field);
    }
  }

  function initConnectServiceChips(panel) {
    var form = panel.querySelector('#header-connect-form');
    if (!form || form.dataset.serviceFocusInit === 'true') return;
    form.dataset.serviceFocusInit = 'true';

    form.querySelectorAll('.hc-hub-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        window.requestAnimationFrame(function () {
          focusFirstEmptyConnectField(panel);
        });
      });
    });
  }

  function openPanel(root, trigger, panelId) {
    var panel = root.querySelector('[data-contact-panel="' + panelId + '"]');
    if (!panel) return;

    if (!panel.hidden && trigger.getAttribute('aria-expanded') === 'true') return;

    if (isTabletViewport()) {
      closeMobileMenuIfOpen();
    }

    closeAll(root);

    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');

    if (panelId === 'hub') {
      initConnectFormFields(panel);
      initConnectServiceChips(panel);
      if (!isMobileConnect()) {
        focusFirstEmptyConnectField(panel);
      }
    }

    if (shouldTrapConnectFocus()) {
      activateHubFocusTrap(root, panel);
    }
  }

  function initMobileSheetDrag(root, panel) {
    var surface = panel.querySelector('.hc-hub-panel-surface');
    var scrollEl = panel.querySelector('.hc-hub-body');
    if (!surface || panel.dataset.sheetDragInit === 'true') return;
    panel.dataset.sheetDragInit = 'true';

    var startY = 0;
    var deltaY = 0;
    var dragging = false;
    var tracking = false;
    var activePointerId = null;
    var DRAG_START = 6;
    var DRAG_CLOSE = 72;
    var captureTarget = surface;

    function getScrollTop() {
      return scrollEl ? scrollEl.scrollTop : 0;
    }

    function syncScrollDismissState() {
      if (!scrollEl) return;
      scrollEl.classList.toggle('is-scroll-at-top', getScrollTop() <= 0);
    }

    if (scrollEl) {
      scrollEl.addEventListener('scroll', syncScrollDismissState, { passive: true });
      syncScrollDismissState();
    }

    function setDraggingState(isDragging) {
      surface.classList.toggle('is-sheet-dragging', isDragging);
      panel.classList.toggle('is-sheet-dragging', isDragging);
    }

    function applyDragOffset(y) {
      panel.style.transform = 'translateY(' + y + 'px)';
    }

    function resetDragOffset() {
      panel.style.transform = '';
      setDraggingState(false);
    }

    function releaseCapture(pointerId) {
      if (captureTarget.hasPointerCapture(pointerId)) {
        captureTarget.releasePointerCapture(pointerId);
      }
    }

    function stopTracking() {
      if (activePointerId !== null) {
        releaseCapture(activePointerId);
      }
      tracking = false;
      dragging = false;
      activePointerId = null;
      deltaY = 0;
      resetDragOffset();
    }

    function finishDrag() {
      if (!tracking) return;

      var shouldClose = dragging && deltaY > DRAG_CLOSE;
      stopTracking();

      if (shouldClose) {
        closeMobileSheet(root);
      }
    }

    function onPointerDown(event) {
      if (!isMobileConnect() || !root.classList.contains('is-open')) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      tracking = true;
      dragging = false;
      activePointerId = event.pointerId;
      startY = event.clientY;
      deltaY = 0;
    }

    function onPointerMove(event) {
      if (!tracking || activePointerId !== event.pointerId) return;

      var moveDelta = event.clientY - startY;

      if (!dragging) {
        if (moveDelta <= 0) return;
        if (getScrollTop() > 0) {
          tracking = false;
          activePointerId = null;
          return;
        }
        if (moveDelta < DRAG_START) return;

        dragging = true;
        setDraggingState(true);
        captureTarget.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
      deltaY = Math.max(0, moveDelta);
      applyDragOffset(deltaY);
    }

    function onPointerEnd(event) {
      if (!tracking || activePointerId !== event.pointerId) return;
      releaseCapture(event.pointerId);
      finishDrag();
    }

    panel.addEventListener('pointerdown', onPointerDown, true);
    panel.addEventListener('pointermove', onPointerMove, { passive: false, capture: true });
    panel.addEventListener('pointerup', onPointerEnd, true);
    panel.addEventListener('pointercancel', onPointerEnd, true);
  }

  function initHubHover(root) {
    if (!root.matches('.hc-hub')) return;

    var sheet = getHubSheet(root);
    var trigger = root.querySelector('[data-contact-trigger="hub"]');
    var panel = sheet.panel;
    var backdrop = sheet.backdrop;
    if (!trigger || !panel) return;

    initConnectFormFields(panel);
    initConnectServiceChips(panel);
    initMobileSheetDrag(root, panel);

    var closeTimer = null;

    function openHub() {
      if (isMobileConnect() || isTabletViewport()) return;

      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      openPanel(root, trigger, 'hub');
    }

    function scheduleClose() {
      if (isMobileConnect() || isTabletViewport()) return;

      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        if (shouldKeepHubOpen(root, panel)) {
          closeTimer = null;
          return;
        }
        closeAll(root);
        closeTimer = null;
      }, 140);
    }

    root.addEventListener('mouseenter', openHub);
    root.addEventListener('mouseleave', scheduleClose);

    panel.addEventListener('focusin', function () {
      if (isMobileConnect() || isTabletViewport()) return;

      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    });

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }

      if (isMobileConnect()) {
        if (root.classList.contains('is-open')) {
          closeMobileSheet(root);
        } else {
          openMobileSheet(root, trigger, panel);
        }
        return;
      }

      if (root.classList.contains('is-open')) {
        closeAll(root);
        return;
      }

      if (isTabletViewport()) {
        closeMobileMenuIfOpen();
      }

      openPanel(root, trigger, 'hub');
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeMobileSheet(root);
      });
    }

    if (root.dataset.clickOutsideInit === 'true') return;
    root.dataset.clickOutsideInit = 'true';

    document.addEventListener('click', function (event) {
      if (isMobileConnect()) return;
      if (!root.classList.contains('is-open')) return;
      if (root.contains(event.target)) return;
      closeAll(root);
    });
  }

  function openMobileConnect(options) {
    options = options || {};
    var root = document.querySelector('[data-contact-smart]');
    if (!root || !isMobileConnect()) return false;

    var trigger = root.querySelector('[data-contact-trigger="hub"]');
    var panel = getHubSheet(root).panel;
    if (!trigger || !panel) return false;

    if (options.fromMenu && isMobileMenuOpen()) {
      root.classList.add('hc-hub--from-menu');
    }

    openMobileSheet(root, trigger, panel);
    return true;
  }

  function initRoot(root) {
    getHubSheet(root);
    syncMobileSheetPortal(root);
    initHubHover(root);
  }

  MOBILE_CONNECT_MQ.addEventListener('change', function () {
    closeAllConnectHubs();
    document.querySelectorAll('[data-contact-smart]').forEach(syncMobileSheetPortal);
  });

  window.SpaceSolutionsHeaderContact = {
    init: function () {
      document.querySelectorAll('[data-contact-smart]').forEach(initRoot);
    },
    validateForm: validateConnectForm,
    clearDraft: clearConnectFormDraft,
    closeAll: function () {
      document.querySelectorAll('[data-contact-smart]').forEach(function (root) {
        if (isMobileConnect() && root.classList.contains('is-open')) {
          closeMobileSheet(root);
          return;
        }
        closeAll(root);
      });
    },
    openMobile: openMobileConnect,
    isOpen: isConnectHubOpen,
  };
})();
