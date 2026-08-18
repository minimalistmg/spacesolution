/**
 * Space Solution - interactive tools calculators
 * Rough INR planning estimates for Mysuru / Karnataka projects.
 */
(function () {
  'use strict';

  var root = document.getElementById('tool-calc');
  if (!root) return;

  var FINISH_LABELS = {
    1: 'Practical',
    2: 'Balanced',
    3: 'Premium',
  };

  function formatInr(amount) {
    var rounded = Math.round(amount / 1000) * 1000;
    try {
      return '₹' + rounded.toLocaleString('en-IN');
    } catch (error) {
      return '₹' + String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  function formatRange(low, high) {
    return formatInr(low) + ' – ' + formatInr(high);
  }

  function readFields() {
    var values = {};
    var inputs = root.querySelectorAll('input[data-field-id]');
    for (var i = 0; i < inputs.length; i += 1) {
      var input = inputs[i];
      var id = input.getAttribute('data-field-id');
      values[id] = Number(input.value);
    }
    return values;
  }

  function updateFieldOutputs() {
    var inputs = root.querySelectorAll('input[data-field-id]');
    for (var i = 0; i < inputs.length; i += 1) {
      var input = inputs[i];
      var id = input.getAttribute('data-field-id');
      var output = root.querySelector('[data-output-for="' + id + '"]');
      if (!output) continue;

      var prefix = input.getAttribute('data-prefix') || '';
      var suffix = input.getAttribute('data-suffix') || '';
      var banded = input.getAttribute('data-banded') === 'true';
      var value = Number(input.value);
      var text = prefix + value + (suffix ? ' ' + suffix : '');

      if (banded && FINISH_LABELS[value]) {
        text += ' · ' + FINISH_LABELS[value];
      }

      output.textContent = text;
    }
  }

  /**
   * Simple planning formulas (indicative Mysuru mid-market bands).
   * Assumptions are shown under the result for transparency.
   */
  function computeEstimate(formula, v) {
    var low = 0;
    var high = 0;
    var note = '';

    switch (formula) {
      case 'kitchen': {
        var rates = { 1: 1400, 2: 2200, 3: 3200 };
        var rate = rates[v.finish] || rates[2];
        var base = (v.area || 80) * rate;
        var counter = (v.counter || 12) * (v.finish === 3 ? 4500 : v.finish === 1 ? 2200 : 3200);
        var total = base + counter;
        low = total * 0.88;
        high = total * 1.18;
        note =
          'Assumes modular carcass + shutters at roughly ₹' +
          rate.toLocaleString('en-IN') +
          '/sq.ft of kitchen area, plus a countertop allowance. Appliances, civil work, and gas piping are excluded.';
        break;
      }
      case 'home': {
        var homeRates = { 1: 950, 2: 1450, 3: 2100 };
        var homeRate = homeRates[v.finish] || homeRates[2];
        var roomFactor = 1 + Math.max(0, (v.rooms || 4) - 3) * 0.04;
        var homeTotal = (v.area || 1200) * homeRate * roomFactor;
        low = homeTotal * 0.85;
        high = homeTotal * 1.2;
        note =
          'Assumes turnkey carpentry and finishes near ₹' +
          homeRate.toLocaleString('en-IN') +
          '/sq.ft, adjusted for room count. Major civil, HVAC, and loose furniture brands may sit outside this band.';
        break;
      }
      case 'office': {
        var seatCost = { 1: 18000, 2: 28000, 3: 42000 };
        var roomCost = { 1: 120000, 2: 200000, 3: 320000 };
        var finish = v.finish || 2;
        var officeTotal =
          (v.seats || 20) * (seatCost[finish] || seatCost[2]) +
          (v.rooms || 0) * (roomCost[finish] || roomCost[2]);
        low = officeTotal * 0.9;
        high = officeTotal * 1.25;
        note =
          'Assumes modular workstations plus meeting-room furniture/partitions. IT, HVAC, flooring upgrades, and brand lighting are usually extra.';
        break;
      }
      case 'commercial': {
        var intensityRates = { 1: 1100, 2: 1800, 3: 2800 };
        var intensity = v.intensity || 2;
        var commercialTotal = (v.area || 1500) * (intensityRates[intensity] || intensityRates[2]);
        low = commercialTotal * 0.88;
        high = commercialTotal * 1.22;
        note =
          'Assumes interior partitions, finishes, and joinery at the selected intensity. MEP, fire systems, and specialised display tech are excluded.';
        break;
      }
      case 'clinic': {
        var clinicTotal =
          (v.consult || 3) * 175000 + (v.treatment || 1) * 240000 + (v.waiting || 12) * 4500;
        low = clinicTotal * 0.9;
        high = clinicTotal * 1.25;
        note =
          'Assumes consultation cabinetry, treatment-room storage, and waiting seats. Medical equipment, plumbing for labs, and HVAC are not included.';
        break;
      }
      case 'classroom': {
        var storageFactor = { 1: 0.9, 2: 1, 3: 1.2 };
        var perStudent = 4200 * (storageFactor[v.storage] || 1);
        var perRoom = 28000 * (storageFactor[v.storage] || 1);
        var classTotal = (v.students || 120) * perStudent + (v.rooms || 4) * perRoom;
        low = classTotal * 0.9;
        high = classTotal * 1.2;
        note =
          'Assumes durable student desks/benches plus a teacher unit per classroom. AV equipment and lab furniture are separate.';
        break;
      }
      case 'hostel': {
        var hostelStorage = { 1: 0.9, 2: 1, 3: 1.25 };
        var factor = hostelStorage[v.storage] || 1;
        var hostelTotal = (v.beds || 80) * 14000 * factor + (v.rooms || 40) * 9000 * factor;
        low = hostelTotal * 0.9;
        high = hostelTotal * 1.2;
        note =
          'Assumes bed frames with study table and basic wardrobe allowances per room. Mattresses, soft furnishings, and common-area furniture are optional extras.';
        break;
      }
      case 'bulk': {
        var unitRates = { 1: 6500, 2: 11000, 3: 18000 };
        var complexity = v.complexity || 2;
        var bulkTotal = (v.units || 100) * (unitRates[complexity] || unitRates[2]);
        low = bulkTotal * 0.92;
        high = bulkTotal * 1.18;
        note =
          'Assumes repeatable factory pieces at the selected complexity. Custom sizes, mixed finishes, or site-built work will move the range.';
        break;
      }
      case 'cafe': {
        var cafeFinish = { 1: 9000, 2: 14000, 3: 22000 };
        var finishLevel = v.finish || 2;
        var seatPart = (v.seats || 36) * (cafeFinish[finishLevel] || cafeFinish[2]);
        var areaPart = (v.area || 600) * (finishLevel === 3 ? 900 : finishLevel === 1 ? 450 : 650);
        var cafeTotal = seatPart + areaPart;
        low = cafeTotal * 0.88;
        high = cafeTotal * 1.22;
        var sqPerSeat = (v.area || 600) / Math.max(1, v.seats || 36);
        var densityNote =
          sqPerSeat < 12
            ? ' Density looks tight for comfortable service aisles.'
            : sqPerSeat > 20
              ? ' Density looks generous - good for longer dwell times.'
              : ' Density looks balanced for a casual café.';
        note =
          'Assumes tables, chairs/banquettes, and front-of-house joinery allowances.' +
          densityNote +
          ' Kitchen equipment is excluded.';
        break;
      }
      case 'hospitality': {
        var keyRates = { 1: 85000, 2: 140000, 3: 230000 };
        var publicRates = { 1: 1600, 2: 2400, 3: 3600 };
        var hospFinish = v.finish || 2;
        var hospTotal =
          (v.keys || 24) * (keyRates[hospFinish] || keyRates[2]) +
          (v.publicArea || 2500) * (publicRates[hospFinish] || publicRates[2]);
        low = hospTotal * 0.88;
        high = hospTotal * 1.22;
        note =
          'Assumes guest-room joinery/furniture packages plus public-area fitout at the selected band. Soft FF&E and operator-mandated FF&E may be itemised separately.';
        break;
      }
      default:
        note = 'Adjust the inputs to refresh this planning estimate.';
        break;
    }

    return { low: low, high: high, note: note };
  }

  function initRangeEstimate() {
    var formula = root.getAttribute('data-formula') || '';
    var valueEl = document.getElementById('tool-result-value');
    var noteEl = document.getElementById('tool-result-note');
    if (!valueEl || !noteEl) return;

    function refresh() {
      updateFieldOutputs();
      var result = computeEstimate(formula, readFields());
      valueEl.textContent = formatRange(result.low, result.high);
      noteEl.textContent = result.note;
    }

    root.addEventListener('input', function (event) {
      if (event.target && event.target.matches('input[data-field-id]')) {
        refresh();
      }
    });

    refresh();
  }

  function initLayoutPicker() {
    var options = root.querySelectorAll('.tool-option');
    var valueEl = document.getElementById('tool-result-value');
    if (!options.length || !valueEl) return;

    function selectOption(button) {
      for (var i = 0; i < options.length; i += 1) {
        options[i].classList.remove('is-selected');
        options[i].setAttribute('aria-selected', 'false');
      }
      button.classList.add('is-selected');
      button.setAttribute('aria-selected', 'true');
      valueEl.textContent = button.getAttribute('data-recommendation') || '';
    }

    for (var i = 0; i < options.length; i += 1) {
      options[i].addEventListener('click', function (event) {
        selectOption(event.currentTarget);
      });
    }
  }

  function toDateInputValue(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function initCountdown() {
    var input = document.getElementById('tool-countdown-date');
    var valueEl = document.getElementById('tool-result-value');
    var noteEl = document.getElementById('tool-result-note');
    if (!input || !valueEl) return;

    var defaultDays = Number(root.getAttribute('data-default-days') || 45);
    if (!Number.isFinite(defaultDays) || defaultDays < 1) defaultDays = 45;

    var initial = new Date();
    initial.setDate(initial.getDate() + defaultDays);
    input.value = toDateInputValue(initial);

    function refresh() {
      if (!input.value) {
        valueEl.textContent = ' - ';
        if (noteEl) {
          noteEl.textContent = 'Choose a target opening date to see days remaining.';
        }
        return;
      }

      var target = startOfDay(new Date(input.value + 'T00:00:00'));
      var today = startOfDay(new Date());
      var diffMs = target.getTime() - today.getTime();
      var days = Math.round(diffMs / 86400000);

      if (days > 1) {
        valueEl.textContent = days + ' days';
        if (noteEl) {
          noteEl.textContent =
            'Use this buffer to freeze drawings, confirm materials, and schedule installation with Space Solution.';
        }
      } else if (days === 1) {
        valueEl.textContent = '1 day';
        if (noteEl) {
          noteEl.textContent = 'Opening is tomorrow - focus on snag lists and essential zones only.';
        }
      } else if (days === 0) {
        valueEl.textContent = 'Opening day';
        if (noteEl) {
          noteEl.textContent = 'Today is your target date. Soft-open essentials if full fitout is still catching up.';
        }
      } else {
        valueEl.textContent = Math.abs(days) + (Math.abs(days) === 1 ? ' day ago' : ' days ago');
        if (noteEl) {
          noteEl.textContent =
            'That date has passed. Pick a new target and we can help reverse-plan a revised launch.';
        }
      }
    }

    input.addEventListener('change', refresh);
    input.addEventListener('input', refresh);
    refresh();
  }

  var type = root.getAttribute('data-calc-type');
  if (type === 'range-estimate') initRangeEstimate();
  if (type === 'layout-picker') initLayoutPicker();
  if (type === 'countdown') initCountdown();
})();
