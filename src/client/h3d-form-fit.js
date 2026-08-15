/**
 * Above-the-fold layout for contextual consult forms.
 * Packs space-type cards into one row when possible, then sizes the
 * textarea so the hugging white card stays above the fold when it can.
 */
(function (window) {
  'use strict';

  var DESKTOP_MIN = 901;
  var MIN_TEXTAREA = 72;
  var DESIRED_TEXTAREA = 148;
  var DESIRED_TEXTAREA_EXTRAS = 96;
  var MIN_CARD_WIDTH = 88;
  var FOLD_RESERVE = 16;
  var resizeTimer = null;

  function getCards() {
    return Array.prototype.slice.call(document.querySelectorAll('.h3d-form-card'));
  }

  function hasExtras(card) {
    return card.classList.contains('h3d-form-card--with-extras');
  }

  function desiredTextarea(card) {
    return hasExtras(card) ? DESIRED_TEXTAREA_EXTRAS : DESIRED_TEXTAREA;
  }

  function foldBottom(card) {
    var page = card.closest('.h3d-page');
    if (page) return page.getBoundingClientRect().bottom - FOLD_RESERVE;
    return window.innerHeight - FOLD_RESERVE;
  }

  function formExceedsFold(card) {
    return card.getBoundingClientRect().bottom > foldBottom(card) + 0.5;
  }

  function resetCard(card) {
    card.classList.remove('is-fit-expanded');
    card.dataset.h3dFit = '';

    var page = card.closest('.h3d-page');
    var panes = card.closest('.h3d-panes');
    if (page) page.classList.remove('is-form-expanded');
    if (panes) panes.classList.remove('is-form-expanded');

    var grid = card.querySelector('.h3d-rooms-grid');
    var textarea = card.querySelector('.h3d-fields-message textarea');

    if (grid) {
      grid.classList.remove('is-fit-single-row');
      grid.style.removeProperty('--h3d-fit-cols');
    }

    if (textarea) {
      textarea.classList.remove('is-fit-sized');
      textarea.style.removeProperty('min-height');
      textarea.style.removeProperty('height');
      textarea.style.removeProperty('max-height');
    }
  }

  function setTextareaHeight(card, px) {
    var textarea = card.querySelector('.h3d-fields-message textarea');
    if (!textarea) return;

    var height = Math.max(MIN_TEXTAREA, Math.round(px));
    textarea.classList.add('is-fit-sized');
    textarea.style.minHeight = height + 'px';
    textarea.style.height = height + 'px';
    textarea.style.maxHeight = height + 'px';
  }

  function canUseSingleRow(grid) {
    var count = grid.querySelectorAll('.h3d-room').length;
    if (count < 2) return false;
    return grid.clientWidth / count >= MIN_CARD_WIDTH;
  }

  function applySingleRow(card) {
    var grid = card.querySelector('.h3d-rooms-grid');
    if (!grid || !canUseSingleRow(grid)) return false;

    var count = grid.querySelectorAll('.h3d-room').length;
    grid.classList.add('is-fit-single-row');
    grid.style.setProperty('--h3d-fit-cols', String(count));
    return true;
  }

  function expandCard(card) {
    card.classList.add('is-fit-expanded');
    card.dataset.h3dFit = 'expanded';

    var page = card.closest('.h3d-page');
    var panes = card.closest('.h3d-panes');
    if (page) page.classList.add('is-form-expanded');
    if (panes) panes.classList.add('is-form-expanded');
  }

  function shrinkUntilFits(card) {
    var height = desiredTextarea(card);

    while (height >= MIN_TEXTAREA) {
      setTextareaHeight(card, height);
      if (!formExceedsFold(card)) return true;
      height -= 8;
    }

    setTextareaHeight(card, MIN_TEXTAREA);
    return !formExceedsFold(card);
  }

  function fitCard(card) {
    resetCard(card);

    if (window.innerWidth < DESKTOP_MIN) {
      card.dataset.h3dFit = 'mobile';
      return;
    }

    applySingleRow(card);
    setTextareaHeight(card, desiredTextarea(card));

    if (!formExceedsFold(card)) {
      card.dataset.h3dFit = card.querySelector('.h3d-rooms-grid.is-fit-single-row')
        ? 'single-row'
        : 'default';
      return;
    }

    if (shrinkUntilFits(card)) {
      card.dataset.h3dFit = 'compact';
      return;
    }

    expandCard(card);
    setTextareaHeight(card, desiredTextarea(card));
  }

  function fitAll() {
    getCards().forEach(fitCard);
  }

  function scheduleFit() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(fitAll, 80);
  }

  function init() {
    if (!getCards().length) return;

    fitAll();
    window.requestAnimationFrame(fitAll);

    window.addEventListener('resize', scheduleFit, { passive: true });
    window.addEventListener('load', fitAll, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitAll);
    }
  }

  window.SpaceSolutionsH3dFormFit = {
    init: init,
    refit: fitAll,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
