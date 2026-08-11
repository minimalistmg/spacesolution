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

  var isRestoringConnectDraft = false;

  function isConnectHubOpen() {
    return Boolean(document.querySelector('.hc-hub.is-open'));
  }

  function closeAllConnectHubs() {
    document.querySelectorAll('[data-contact-smart]').forEach(function (root) {
      closeAll(root);
    });
  }

  function closeAll(root) {
    root.querySelectorAll('[data-contact-panel]').forEach(function (panel) {
      panel.hidden = true;
    });
    root.querySelectorAll('[data-contact-trigger]').forEach(function (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    });
    root.classList.remove('is-open');
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

    closeAll(root);

    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');

    if (panelId === 'hub') {
      initConnectFormFields(panel);
      initConnectServiceChips(panel);
      focusFirstEmptyConnectField(panel);
    }
  }

  function initHubHover(root) {
    if (!root.matches('.hc-hub')) return;

    var trigger = root.querySelector('[data-contact-trigger="hub"]');
    var panel = root.querySelector('[data-contact-panel="hub"]');
    if (!trigger || !panel) return;

    initConnectFormFields(panel);
    initConnectServiceChips(panel);

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
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    });

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
    });

    if (root.dataset.clickOutsideInit === 'true') return;
    root.dataset.clickOutsideInit = 'true';

    document.addEventListener('click', function (event) {
      if (!root.classList.contains('is-open')) return;
      if (root.contains(event.target)) return;
      closeAll(root);
    });
  }

  function initRoot(root) {
    initHubHover(root);
  }

  window.SpaceSolutionsHeaderContact = {
    init: function () {
      document.querySelectorAll('[data-contact-smart]').forEach(initRoot);
    },
    validateForm: validateConnectForm,
    clearDraft: clearConnectFormDraft,
    closeAll: closeAllConnectHubs,
    isOpen: isConnectHubOpen,
  };
})();
