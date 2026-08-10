/**
 * Post-CTA contact confirmation — toast expand (desktop/tablet), bottom sheet (mobile)
 */
(function () {
  'use strict';

  var CONFIRM_ACTIONS = ['call', 'sms', 'whatsapp', 'email'];

  var ACTION_COPY = {
    call: {
      opening: 'Opening call…',
      title: 'Did your call connect?',
      sub: 'We opened your phone app for {phone}.',
      retry: 'No, try again',
    },
    sms: {
      opening: 'Opening messages…',
      title: 'Did your message send?',
      sub: 'Your SMS app should be ready for {phone}.',
      retry: 'Try again',
    },
    whatsapp: {
      opening: 'Opening WhatsApp…',
      title: 'Were you able to reach us?',
      sub: 'We opened WhatsApp for Space Solutions.',
      retry: 'Open again',
    },
    email: {
      opening: 'Opening email…',
      title: 'Did your email app open?',
      sub: 'We opened a draft to Space Solutions.',
      retry: 'Try again',
    },
  };

  var state = {
    action: null,
    retryHref: null,
    retryTarget: null,
    retryTrigger: null,
    pendingConfirm: false,
    expandTimer: null,
    sessionKey: 'ss-contact-confirm-snooze',
  };

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
      opening: base.opening,
      title: base.title,
      sub: base.sub.replace('{phone}', getPhoneDisplay()),
      retry: base.retry,
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

  function clearTimers() {
    if (state.expandTimer) {
      clearTimeout(state.expandTimer);
      state.expandTimer = null;
    }
  }

  function hideAll() {
    var root = getRoot();
    if (!root) return;

    clearTimers();
    root.hidden = true;

    var toast = root.querySelector('[data-cac-ui="toast"]');
    var sheet = root.querySelector('[data-cac-ui="sheet"]');
    if (toast) {
      toast.hidden = true;
      toast.classList.remove('is-expanded');
      var expanded = toast.querySelector('[data-cac-expanded]');
      if (expanded) expanded.hidden = true;
    }
    if (sheet) {
      sheet.hidden = true;
      sheet.classList.remove('is-visible', 'is-expanded');
    }

    state.pendingConfirm = false;
    state.action = null;
    state.retryHref = null;
    state.retryTarget = null;
    state.retryTrigger = null;
  }

  function fillCopy(root, action) {
    var copy = copyFor(action);
    root.querySelectorAll('[data-cac-opening-msg]').forEach(function (el) {
      el.textContent = copy.opening;
    });
    root.querySelectorAll('[data-cac-title]').forEach(function (el) {
      el.textContent = copy.title;
    });
    root.querySelectorAll('[data-cac-sub]').forEach(function (el) {
      el.textContent = copy.sub;
    });
    root.querySelectorAll('[data-cac-outcome="retry"]').forEach(function (el) {
      el.textContent = copy.retry;
    });
  }

  function showConfirmUI(action) {
    var root = getRoot();
    if (!root) return;

    fillCopy(root, action);
    root.hidden = false;

    if (isMobile()) {
      var sheet = root.querySelector('[data-cac-ui="sheet"]');
      if (!sheet) return;
      sheet.hidden = false;
      sheet.classList.add('is-visible', 'is-expanded');
      return;
    }

    var toast = root.querySelector('[data-cac-ui="toast"]');
    if (!toast) return;
    toast.hidden = false;
    toast.classList.add('is-expanded');
    var expanded = toast.querySelector('[data-cac-expanded]');
    if (expanded) expanded.hidden = false;
  }

  function showOpeningUI(action) {
    var root = getRoot();
    if (!root) return;

    fillCopy(root, action);
    root.hidden = false;

    if (isMobile()) {
      var sheet = root.querySelector('[data-cac-ui="sheet"]');
      if (!sheet) return;
      sheet.hidden = false;
      sheet.classList.remove('is-expanded');
      requestAnimationFrame(function () {
        sheet.classList.add('is-visible');
      });
      return;
    }

    var toast = root.querySelector('[data-cac-ui="toast"]');
    if (!toast) return;
    toast.hidden = false;
    toast.classList.remove('is-expanded');
    var expanded = toast.querySelector('[data-cac-expanded]');
    if (expanded) expanded.hidden = true;
  }

  function scheduleConfirm(action, delayMs) {
    clearTimers();
    state.expandTimer = setTimeout(function () {
      if (state.pendingConfirm && state.action === action) {
        showConfirmUI(action);
      }
    }, delayMs);
  }

  function launchExternal(href, target) {
    if (!href) return;
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener');
      return;
    }
    window.location.href = href;
  }

  function beginAction(trigger, action) {
    if (isSnoozed()) return;

    var href = trigger.getAttribute('href') || trigger.getAttribute('data-contact-href') || '';
    var target = trigger.getAttribute('target') || null;
    var leavesPage =
      action === 'call' || action === 'sms' || action === 'email' || (target === '_blank' && href);

    state.action = action;
    state.retryHref = href;
    state.retryTarget = target;
    state.retryTrigger = trigger;
    state.pendingConfirm = true;

    showOpeningUI(action);

    if (leavesPage && isMobile()) {
      scheduleConfirm(action, 1200);
      return;
    }

    scheduleConfirm(action, isMobile() ? 1200 : 1600);
  }

  function onVisibilityReturn() {
    if (!state.pendingConfirm || !state.action) return;
    if (document.visibilityState !== 'visible') return;
    showConfirmUI(state.action);
  }

  function handleOutcome(outcome) {
    if (outcome === 'retry') {
      if (state.retryHref) {
        launchExternal(state.retryHref, state.retryTarget);
        scheduleConfirm(state.action, 1200);
        return;
      }
    }
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

      beginAction(trigger, action);
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
