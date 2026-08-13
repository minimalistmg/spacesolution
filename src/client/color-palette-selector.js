/**
 * Color palette selector — preview thumbnails and theme application
 * Switcher UI is shown only when the URL contains ?color_pallet=true
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ss-color-palette';
  var SWITCHER_PARAM = 'color_pallet';
  var SWATCH_LABELS = {
    '--cream': 'Wall',
    '--gold': 'Accent',
    '--brown': 'Wood',
    '--dark': 'Dark',
    '--gray-light': 'Light',
    '--gray-text': 'Text',
  };

  var root = document.documentElement;
  var selector = document.getElementById('palette-selector');
  if (!selector) return;

  var palettes = [];
  try {
    palettes = JSON.parse(selector.getAttribute('data-palettes') || '[]');
  } catch (error) {
    palettes = [];
  }

  if (!palettes.length) return;

  function getPalette(id) {
    for (var i = 0; i < palettes.length; i += 1) {
      if (palettes[i].id === id) return palettes[i];
    }
    return palettes[0];
  }

  function setRootColors(palette) {
    if (!palette) return;
    Object.keys(palette.colors).forEach(function (key) {
      root.style.setProperty(key, palette.colors[key]);
    });
    root.setAttribute('data-palette', palette.id);
  }

  var switcherEnabled =
    new URLSearchParams(window.location.search).get(SWITCHER_PARAM) === 'true';
  var defaultPaletteId = palettes[0].id;
  var savedPaletteId = null;
  try {
    savedPaletteId = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    savedPaletteId = null;
  }
  var activePaletteId = savedPaletteId || defaultPaletteId;

  setRootColors(getPalette(activePaletteId));

  if (!switcherEnabled) return;

  selector.hidden = false;

  var fab = document.getElementById('palette-fab');
  var panel = document.getElementById('palette-panel');
  var panelClose = document.getElementById('palette-panel-close');
  var previewModal = document.getElementById('palette-preview-modal');
  var previewBackdrop = document.getElementById('palette-preview-backdrop');
  var previewClose = document.getElementById('palette-preview-close');
  var previewCancel = document.getElementById('palette-preview-cancel');
  var previewApply = document.getElementById('palette-preview-apply');
  var previewTitle = document.getElementById('palette-preview-title');
  var previewTagline = document.getElementById('palette-preview-tagline');
  var previewSwatches = document.getElementById('palette-preview-swatches');
  var previewLarge = document.getElementById('palette-preview-large');
  var pendingPaletteId = null;
  var lastFocus = null;

  function hexToRgb(hex) {
    var value = String(hex || '').replace('#', '');
    if (value.length === 3) {
      value = value
        .split('')
        .map(function (char) {
          return char + char;
        })
        .join('');
    }
    var num = parseInt(value, 16);
    if (Number.isNaN(num)) return { r: 0, g: 0, b: 0 };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }

  function drawInteriorPreview(canvas, palette) {
    if (!canvas || !palette) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var w = canvas.width;
    var h = canvas.height;
    var colors = palette.colors;
    var cream = colors['--cream'] || '#f5f5f5';
    var gold = colors['--gold'] || '#c5a23a';
    var brown = colors['--brown'] || '#3c2516';
    var dark = colors['--dark'] || '#181818';
    var grayLight = colors['--gray-light'] || '#f0f0f0';
    var surface = colors['--surface'] || grayLight;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, w, h * 0.14);
    ctx.fillStyle = gold;
    ctx.fillRect(w * 0.06, h * 0.045, w * 0.16, h * 0.045);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(w * 0.28, h * 0.055, w * 0.08, h * 0.025);
    ctx.fillRect(w * 0.4, h * 0.055, w * 0.08, h * 0.025);
    ctx.fillRect(w * 0.52, h * 0.055, w * 0.08, h * 0.025);
    ctx.fillStyle = gold;
    ctx.fillRect(w * 0.78, h * 0.04, w * 0.16, h * 0.055);

    ctx.fillStyle = cream;
    ctx.fillRect(0, h * 0.14, w, h * 0.58);

    ctx.fillStyle = brown;
    ctx.fillRect(0, h * 0.72, w, h * 0.28);

    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    for (var x = 0; x < w; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.72);
      ctx.lineTo(x - 20, h);
      ctx.stroke();
    }

    ctx.fillStyle = grayLight;
    ctx.fillRect(w * 0.08, h * 0.22, w * 0.28, h * 0.28);
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.08, h * 0.22, w * 0.28, h * 0.28);
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.22);
    ctx.lineTo(w * 0.22, h * 0.5);
    ctx.moveTo(w * 0.08, h * 0.36);
    ctx.lineTo(w * 0.36, h * 0.36);
    ctx.stroke();

    ctx.fillStyle = dark;
    ctx.fillRect(w * 0.52, h * 0.52, w * 0.38, h * 0.14);
    ctx.fillRect(w * 0.5, h * 0.46, w * 0.42, h * 0.07);

    ctx.fillStyle = gold;
    ctx.fillRect(w * 0.58, h * 0.48, w * 0.1, h * 0.05);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.52);
    ctx.lineTo(w * 0.54, h * 0.52);
    ctx.lineTo(w * 0.53, h * 0.42);
    ctx.lineTo(w * 0.51, h * 0.42);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = brown;
    ctx.fillRect(w * 0.46, h * 0.58, w * 0.08, h * 0.14);

    ctx.fillStyle = surface;
    ctx.fillRect(w * 0.62, h * 0.24, w * 0.22, h * 0.14);
    ctx.strokeStyle = gold;
    ctx.lineWidth = 4;
    ctx.strokeRect(w * 0.62, h * 0.24, w * 0.22, h * 0.14);

    ctx.fillStyle = gold;
    ctx.fillRect(0, h * 0.7, w, 4);

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(w * 0.04, h * 0.17, w * 0.42, 26);
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 12px "DM Sans", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(palette.name, w * 0.06, h * 0.17 + 13);
  }

  function renderAllPreviews() {
    var canvases = selector.querySelectorAll('.palette-preview-canvas');
    canvases.forEach(function (canvas) {
      var id = canvas.getAttribute('data-palette-id');
      drawInteriorPreview(canvas, getPalette(id));
    });
  }

  function buildSwatchRow(palette) {
    if (!previewSwatches) return;
    previewSwatches.innerHTML = '';

    ['--cream', '--gold', '--brown', '--dark', '--gray-light'].forEach(function (key) {
      var color = palette.colors[key];
      if (!color) return;

      var item = document.createElement('span');
      var swatch = document.createElement('i');
      swatch.style.background = color;
      var label = document.createElement('em');
      label.textContent = SWATCH_LABELS[key] || key;
      item.appendChild(swatch);
      item.appendChild(label);
      previewSwatches.appendChild(item);
    });
  }

  function applyPalette(id, persist) {
    var palette = getPalette(id);
    if (!palette) return;

    setRootColors(palette);

    if (!palette.colors['--gold-rgb'] && palette.colors['--gold']) {
      var rgb = hexToRgb(palette.colors['--gold']);
      root.style.setProperty('--gold-rgb', rgb.r + ', ' + rgb.g + ', ' + rgb.b);
    }

    if (persist !== false) {
      activePaletteId = palette.id;
      localStorage.setItem(STORAGE_KEY, palette.id);
      updateFabSwatches(palette);
    }

    updateActiveCards();
  }

  function updateFabSwatches(palette) {
    var swatches = fab.querySelectorAll('.palette-fab-swatches i');
    if (!swatches.length || !palette) return;
    var keys = ['--cream', '--gold', '--brown', '--dark'];
    keys.forEach(function (key, index) {
      if (swatches[index] && palette.colors[key]) {
        swatches[index].style.background = palette.colors[key];
      }
    });
  }

  function updateActiveCards() {
    selector.querySelectorAll('.palette-card').forEach(function (card) {
      var isActive = card.getAttribute('data-palette-id') === activePaletteId;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function trapFocus(event, container) {
    if (event.key !== 'Tab') return;
    var focusable = getFocusable(container);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openPanel() {
    lastFocus = document.activeElement;
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    renderAllPreviews();
    var firstCard = panel.querySelector('.palette-card');
    if (firstCard) firstCard.focus();
  }

  function closePanel() {
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    if (previewModal.hidden && lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function openPreview(id) {
    var palette = getPalette(id);
    pendingPaletteId = id;
    lastFocus = document.activeElement;

    previewTitle.textContent = palette.name;
    previewTagline.textContent = palette.tagline;
    buildSwatchRow(palette);
    drawInteriorPreview(previewLarge, palette);

    previewModal.hidden = false;
    previewModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.SpaceSolutionsLenis) window.SpaceSolutionsLenis.stop();
    previewApply.focus();
  }

  function closePreview() {
    previewModal.hidden = true;
    previewModal.setAttribute('aria-hidden', 'true');
    pendingPaletteId = null;
    document.body.style.overflow = '';
    if (
      window.SpaceSolutionsLenis &&
      !document.documentElement.classList.contains('ss-preloader-pending') &&
      !document.body.classList.contains('mobile-menu-open') &&
      !document.body.classList.contains('connect-sheet-open')
    ) {
      window.SpaceSolutionsLenis.start();
    }

    if (!panel.hidden) {
      var activeCard = panel.querySelector('.palette-card.is-active, .palette-card');
      if (activeCard) activeCard.focus();
    } else if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function confirmApply() {
    if (!pendingPaletteId) return;
    applyPalette(pendingPaletteId, true);
    closePreview();
    closePanel();
  }

  fab.addEventListener('click', function (event) {
    event.stopPropagation();
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  panelClose.addEventListener('click', closePanel);

  selector.querySelectorAll('.palette-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openPreview(card.getAttribute('data-palette-id'));
    });
  });

  previewClose.addEventListener('click', closePreview);
  previewCancel.addEventListener('click', closePreview);
  previewApply.addEventListener('click', confirmApply);

  previewModal.addEventListener('click', function (event) {
    if (event.target === previewModal || event.target === previewBackdrop) {
      closePreview();
    }
  });

  document.addEventListener('click', function (event) {
    if (panel.hidden || !previewModal.hidden) return;
    if (selector.contains(event.target)) return;
    closePanel();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (!previewModal.hidden) {
        closePreview();
      } else if (!panel.hidden) {
        closePanel();
      }
      return;
    }

    if (!previewModal.hidden) {
      trapFocus(event, previewModal.querySelector('.palette-preview-dialog') || previewModal);
    } else if (!panel.hidden) {
      trapFocus(event, panel);
    }
  });

  applyPalette(activePaletteId, false);
  updateFabSwatches(getPalette(activePaletteId));
  renderAllPreviews();
  updateActiveCards();
})();
