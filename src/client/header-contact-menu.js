/**
 * Header contact Connect hub
 */
(function () {
  'use strict';

  var CYCLE_MS = 2200;

  function buildVcard(name, phone, email) {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:' + name,
      'TEL;TYPE=CELL:' + phone,
      'EMAIL:' + email,
      'ORG:Space Solutions',
      'END:VCARD',
    ].join('\n');
  }

  function downloadVcard(trigger) {
    var name = trigger.getAttribute('data-vcard-name') || 'Space Solutions';
    var phone = trigger.getAttribute('data-vcard-phone') || '';
    var email = trigger.getAttribute('data-vcard-email') || '';
    if (!phone) return;

    var blob = new Blob([buildVcard(name, phone, email)], { type: 'text/vcard;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'space-solutions.vcf';
    link.click();
    URL.revokeObjectURL(url);
  }

  function copyPhoneNumber(trigger) {
    var value = trigger.getAttribute('data-copy-value') || '';
    if (!value) return;

    var label = trigger.querySelector('.hc-menu-link-label');
    var originalLabel = label ? label.textContent : '';

    function markCopied() {
      if (!label) return;
      label.textContent = 'Copied!';
      setTimeout(function () {
        label.textContent = originalLabel;
      }, 1600);
    }

    function fallbackCopy() {
      var input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        markCopied();
      } catch (error) {
        /* noop */
      }
      document.body.removeChild(input);
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(value).then(markCopied).catch(fallbackCopy);
      return;
    }

    fallbackCopy();
  }

  function closeAll(root) {
    root.querySelectorAll('[data-contact-panel]').forEach(function (panel) {
      panel.hidden = true;
    });
    root.querySelectorAll('[data-contact-trigger]').forEach(function (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    });
    root.classList.remove('is-open');
    resumeHubCycle(root);
  }

  function openPanel(root, trigger, panelId) {
    var panel = root.querySelector('[data-contact-panel="' + panelId + '"]');
    if (!panel) return;

    if (!panel.hidden && trigger.getAttribute('aria-expanded') === 'true') return;

    closeAll(root);

    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    pauseHubCycle(root);
  }

  function initHubHover(root) {
    if (!root.matches('[data-hub-cycle-root]')) return;

    var trigger = root.querySelector('[data-contact-trigger="hub"]');
    var panel = root.querySelector('[data-contact-panel="hub"]');
    if (!trigger || !panel) return;

    var closeTimer = null;

    function openHub() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      openPanel(root, trigger, 'hub');
    }

    function scheduleClose() {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        closeAll(root);
        closeTimer = null;
      }, 140);
    }

    [trigger, panel].forEach(function (el) {
      el.addEventListener('mouseenter', openHub);
      el.addEventListener('mouseleave', scheduleClose);
    });

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
    });
  }

  function initHubCycle(hub) {
    if (!hub || hub.dataset.hubCycleBound === '1') return;

    var track = hub.querySelector('[data-hub-cycle-track]');
    var dots = hub.querySelectorAll('[data-hub-cycle-dot]');
    var items = hub.querySelectorAll('[data-hub-cycle-track] .hc-hub-cycle-item');
    var icons = hub.querySelectorAll('.hc-hub-cycle-icon-slot .hc-hub-cycle-icon');
    if (!track || !items.length) return;

    hub.dataset.hubCycleBound = '1';
    var index = 0;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setIndex(next) {
      index = next;
      items.forEach(function (item, itemIndex) {
        item.classList.toggle('is-active', itemIndex === index);
      });
      icons.forEach(function (icon, iconIndex) {
        icon.classList.toggle('is-active', iconIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });

      var label = items[index] && items[index].querySelector('.hc-hub-cycle-label');
      if (label) {
        hub.setAttribute('data-hub-cycle-label', label.textContent.trim());
      }
    }

    function tick() {
      setIndex((index + 1) % items.length);
    }

    hub._hubCycleStart = function () {
      if (reducedMotion || hub.classList.contains('is-open')) return;
      if (hub._hubCycleTimer) clearInterval(hub._hubCycleTimer);
      hub._hubCycleTimer = setInterval(tick, CYCLE_MS);
    };

    hub._hubCycleStop = function () {
      if (hub._hubCycleTimer) {
        clearInterval(hub._hubCycleTimer);
        hub._hubCycleTimer = null;
      }
    };

    hub.addEventListener('mouseenter', function () {
      hub.classList.add('is-cycle-paused');
      hub._hubCycleStop();
    });

    hub.addEventListener('mouseleave', function () {
      hub.classList.remove('is-cycle-paused');
      if (!hub.classList.contains('is-open')) hub._hubCycleStart();
    });

    setIndex(0);
    hub._hubCycleStart();
  }

  function pauseHubCycle(root) {
    if (root && root._hubCycleStop) root._hubCycleStop();
  }

  function resumeHubCycle(root) {
    if (root && root._hubCycleStart && !root.classList.contains('is-cycle-paused')) {
      root._hubCycleStart();
    }
  }

  function initRoot(root) {
    if (root.matches('[data-hub-cycle-root]')) {
      initHubCycle(root);
      initHubHover(root);
    }

    root.addEventListener('click', function (event) {
      var copyPhone = event.target.closest('[data-contact-copy-phone]');
      if (copyPhone && root.contains(copyPhone)) {
        event.preventDefault();
        copyPhoneNumber(copyPhone);
        return;
      }

      var vcard = event.target.closest('[data-contact-vcard]');
      if (!vcard || !root.contains(vcard)) return;
      event.preventDefault();
      downloadVcard(vcard);
    });
  }

  window.SpaceSolutionsHeaderContact = {
    init: function () {
      document.querySelectorAll('[data-contact-smart]').forEach(initRoot);
    },
  };
})();
