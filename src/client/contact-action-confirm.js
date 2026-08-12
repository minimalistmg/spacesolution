/**
 * Post-CTA contact confirmation — confirm on return, feedback toasts, session snooze
 */
(function () {
  'use strict';

  var CONFIRM_ACTIONS = ['call', 'sms', 'whatsapp', 'email'];
  var AUTO_DISMISS_CONFIRM_MS = 45000;
  var AUTO_DISMISS_FEEDBACK_MS = 2200;
  var CONFIRM_FALLBACK_MS = 1200;
  var SUCCESS_MSG = 'Thanks! We\u2019ll follow up if needed.';

  var ACTION_COPY = {
    call: {
      badge: 'Call',
      title: 'Did your call connect?',
      sub: 'We opened your phone app for {phone}.',
      yes: 'Yes, we spoke',
      retry: 'Call again',
      micro: 'Call app opened',
    },
    sms: {
      badge: 'SMS',
      title: 'Did your message send?',
      sub: 'Your SMS app should be ready for {phone}.',
      yes: 'Yes, sent',
      retry: 'Try again',
      micro: 'Messages opened in new tab',
    },
    whatsapp: {
      badge: 'WhatsApp',
      title: 'Were you able to reach us?',
      sub: 'We opened WhatsApp for Space Solutions.',
      yes: 'Yes, reached you',
      retry: 'Open again',
      micro: 'WhatsApp opened in new tab',
    },
    email: {
      badge: 'Email',
      title: 'Did your email app open?',
      sub: 'We opened a draft to Space Solutions.',
      yes: 'Yes, it opened',
      retry: 'Try again',
      micro: 'Email opened in new tab',
    },
  };

  var state = {
    action: null,
    retryHref: null,
    retryTarget: null,
    pendingConfirm: false,
    confirmTimer: null,
    feedbackTimer: null,
    autoDismissTimer: null,
    sessionKey: 'ss-contact-confirm-snooze',
  };

  var confirmFocusTrap = null;

  function isMobile() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  function getRoot() {
    return document.getElementById('contact-action-confirm');
  }

  function getPhoneDisplay() {
    var root = getRoot();
    return (root && root.dataset.phoneDisplay) || window.__ssContactConfirmPhone || '';
  }

  function copyFor(action) {
    var base = ACTION_COPY[action] || ACTION_COPY.call;
    return {
      badge: base.badge,
      title: base.title,
      sub: base.sub.replace('{phone}', getPhoneDisplay()),
      yes: base.yes,
      retry: base.retry,
      micro: base.micro,
    };
  }

  function isSnoozed() {
    try {
      return sessionStorage.getItem(state.sessionKey) === '1';
    } catch (error) {
      return false;
    }
  }

  function setSnooze() {
    try {
      sessionStorage.setItem(state.sessionKey, '1');
    } catch (error) {
      /* ignore */
    }
  }

  function clearTimer(key) {
    if (state[key]) {
      clearTimeout(state[key]);
      state[key] = null;
    }
  }

  function clearAllTimers() {
    clearTimer('confirmTimer');
    clearTimer('feedbackTimer');
    clearTimer('autoDismissTimer');
  }

  function closeConnectHub() {
    if (window.SpaceSolutionsHeaderContact && window.SpaceSolutionsHeaderContact.closeAll) {
      window.SpaceSolutionsHeaderContact.closeAll();
    }
  }

  function deactivateConfirmTrap() {
    if (confirmFocusTrap) {
      confirmFocusTrap.deactivate();
      confirmFocusTrap = null;
    }
  }

  function activateConfirmTrap(panel) {
    deactivateConfirmTrap();
    if (!window.SpaceSolutionsFocusTrap || !panel || !isMobile()) return;
    confirmFocusTrap = window.SpaceSolutionsFocusTrap.create(panel);
    confirmFocusTrap.activate();
  }

  function setPanelVisibility(root, panelName) {
    root.querySelectorAll('[data-cac-panel]').forEach(function (el) {
      el.hidden = el.getAttribute('data-cac-panel') !== panelName;
    });
  }

  function hideAll() {
    var root = getRoot();
    if (!root) return;

    clearAllTimers();
    deactivateConfirmTrap();
    root.hidden = true;
    root.removeAttribute('aria-busy');

    var toast = root.querySelector('[data-cac-ui="toast"]');
    var sheet = root.querySelector('[data-cac-ui="sheet"]');
    var banner = root.querySelector('[data-cac-ui="banner"]');

    if (toast) toast.hidden = true;
    if (sheet) {
      sheet.hidden = true;
      sheet.classList.remove('is-visible');
    }
    if (banner) banner.hidden = true;

    state.pendingConfirm = false;
    state.action = null;
    state.retryHref = null;
    state.retryTarget = null;
  }

  function fillCopy(root, action) {
    var copy = copyFor(action);
    root.querySelectorAll('[data-cac-badge]').forEach(function (el) {
      el.textContent = copy.badge;
    });
    root.querySelectorAll('[data-cac-title]').forEach(function (el) {
      el.textContent = copy.title;
    });
    root.querySelectorAll('[data-cac-sub]').forEach(function (el) {
      el.textContent = copy.sub;
    });
    root.querySelectorAll('[data-cac-outcome="yes"]').forEach(function (el) {
      el.textContent = copy.yes;
    });
    root.querySelectorAll('[data-cac-outcome="retry"]').forEach(function (el) {
      el.textContent = copy.retry;
    });
    root.querySelectorAll('[data-cac-micro-msg]').forEach(function (el) {
      el.textContent = copy.micro;
    });
  }

  function scheduleAutoDismissConfirm() {
    clearTimer('autoDismissTimer');
    state.autoDismissTimer = setTimeout(function () {
      if (state.pendingConfirm) hideAll();
    }, AUTO_DISMISS_CONFIRM_MS);
  }

  function scheduleFeedbackDismiss() {
    clearTimer('feedbackTimer');
    state.feedbackTimer = setTimeout(hideAll, AUTO_DISMISS_FEEDBACK_MS);
  }

  function scheduleConfirmFallback(action) {
    clearTimer('confirmTimer');
    state.confirmTimer = setTimeout(function () {
      if (state.pendingConfirm && state.action === action && document.visibilityState === 'visible') {
        showConfirmUI(action);
      }
    }, CONFIRM_FALLBACK_MS);
  }

  function showConfirmUI(action) {
    var root = getRoot();
    if (!root || !state.pendingConfirm) return;

    clearTimer('confirmTimer');
    fillCopy(root, action);
    root.hidden = false;
    root.removeAttribute('aria-busy');

    if (isMobile()) {
      var sheet = root.querySelector('[data-cac-ui="sheet"]');
      var banner = root.querySelector('[data-cac-ui="banner"]');
      if (banner) banner.hidden = true;
      if (!sheet) return;
      sheet.hidden = false;
      requestAnimationFrame(function () {
        sheet.classList.add('is-visible');
      });
      activateConfirmTrap(sheet.querySelector('.cac-sheet-panel'));
      scheduleAutoDismissConfirm();
      return;
    }

    var toast = root.querySelector('[data-cac-ui="toast"]');
    if (!toast) return;
    setPanelVisibility(root, 'confirm');
    toast.hidden = false;
    scheduleAutoDismissConfirm();
  }

  function showSuccessUI() {
    var root = getRoot();
    if (!root) return;

    state.pendingConfirm = false;
    clearTimer('autoDismissTimer');
    deactivateConfirmTrap();
    root.hidden = false;

    if (isMobile()) {
      var sheet = root.querySelector('[data-cac-ui="sheet"]');
      var banner = root.querySelector('[data-cac-ui="banner"]');
      if (sheet) {
        sheet.hidden = true;
        sheet.classList.remove('is-visible');
      }
      if (!banner) return;
      var inner = banner.querySelector('[data-cac-banner-inner]');
      var icon = banner.querySelector('[data-cac-banner-icon]');
      var msg = banner.querySelector('[data-cac-banner-msg]');
      if (inner) {
        inner.classList.remove('is-micro');
        inner.classList.add('is-success');
      }
      if (icon) icon.textContent = '\u2713';
      if (msg) msg.textContent = SUCCESS_MSG;
      banner.hidden = false;
      scheduleFeedbackDismiss();
      return;
    }

    var toast = root.querySelector('[data-cac-ui="toast"]');
    if (!toast) return;
    root.querySelectorAll('[data-cac-success-msg]').forEach(function (el) {
      el.textContent = SUCCESS_MSG;
    });
    setPanelVisibility(root, 'success');
    toast.hidden = false;
    scheduleFeedbackDismiss();
  }

  function showMicroToast(action) {
    var root = getRoot();
    if (!root) return;

    fillCopy(root, action);
    root.hidden = false;

    if (isMobile()) {
      var banner = root.querySelector('[data-cac-ui="banner"]');
      if (!banner) return;
      var inner = banner.querySelector('[data-cac-banner-inner]');
      var icon = banner.querySelector('[data-cac-banner-icon]');
      var msg = banner.querySelector('[data-cac-banner-msg]');
      var copy = copyFor(action);
      if (inner) {
        inner.classList.remove('is-success');
        inner.classList.add('is-micro');
      }
      if (icon) icon.textContent = '\u2197';
      if (msg) msg.textContent = copy.micro;
      banner.hidden = false;
      scheduleFeedbackDismiss();
      return;
    }

    var toast = root.querySelector('[data-cac-ui="toast"]');
    if (!toast) return;
    setPanelVisibility(root, 'micro');
    toast.hidden = false;
    scheduleFeedbackDismiss();
  }

  function launchExternal(href, target) {
    if (!href) return;
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener');
      return;
    }
    window.location.href = href;
  }

  function isNewTabAction(href, target) {
    return target === '_blank' && Boolean(href);
  }

  function beginConfirmFlow(trigger, action) {
    if (isSnoozed()) return false;

    closeConnectHub();

    state.action = action;
    state.retryHref = trigger.getAttribute('href') || trigger.getAttribute('data-contact-href') || '';
    state.retryTarget = trigger.getAttribute('target') || null;
    state.pendingConfirm = true;

    var root = getRoot();
    if (root) root.setAttribute('aria-busy', 'true');

    scheduleConfirmFallback(action);
    return true;
  }

  function onVisibilityReturn() {
    if (!state.pendingConfirm || !state.action) return;
    if (document.visibilityState !== 'visible') return;
    showConfirmUI(state.action);
  }

  function handleOutcome(outcome) {
    if (outcome === 'yes') {
      setSnooze();
      showSuccessUI();
      return;
    }

    if (outcome === 'retry') {
      if (state.retryHref) {
        launchExternal(state.retryHref, state.retryTarget);
        var root = getRoot();
        if (root) root.setAttribute('aria-busy', 'true');
        scheduleConfirmFallback(state.action);
        return;
      }
    }

    setSnooze();
    hideAll();
  }

  function bindRoot() {
    var root = getRoot();
    if (!root || root.dataset.cacBound === '1') return;
    root.dataset.cacBound = '1';

    root.addEventListener('click', function (event) {
      var dismiss = event.target.closest('[data-cac-dismiss]');
      if (dismiss) {
        event.preventDefault();
        setSnooze();
        hideAll();
        return;
      }

      var outcomeBtn = event.target.closest('[data-cac-outcome]');
      if (!outcomeBtn) return;
      event.preventDefault();
      handleOutcome(outcomeBtn.getAttribute('data-cac-outcome'));
    });

    document.addEventListener('visibilitychange', onVisibilityReturn);
    window.addEventListener('focus', onVisibilityReturn);
  }

  function bindActions() {
    if (document.documentElement.dataset.cacActionsBound === '1') return;
    document.documentElement.dataset.cacActionsBound = '1';

    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-contact-action]');
      if (!trigger) return;

      var action = trigger.getAttribute('data-contact-action');
      if (!action || CONFIRM_ACTIONS.indexOf(action) === -1) return;

      event.preventDefault();

      var href = trigger.getAttribute('href') || trigger.getAttribute('data-contact-href') || '';
      var target = trigger.getAttribute('target') || null;

      closeConnectHub();

      if (isNewTabAction(href, target)) {
        hideAll();
        launchExternal(href, target);
        if (!isSnoozed()) showMicroToast(action);
        return;
      }

      if (!beginConfirmFlow(trigger, action)) {
        launchExternal(href, target);
        return;
      }

      launchExternal(href, target);
    });
  }

  window.SpaceSolutionsContactConfirm = {
    init: function () {
      bindRoot();
      bindActions();
    },
    dismiss: hideAll,
  };
})();
