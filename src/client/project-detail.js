/**
 * Bolt-style project detail
 * Edit alongside: src/components/ProjectDetailSection.astro + src/styles/project-detail.css
 */
(function () {
  'use strict';

  function initReadMore(root) {
    var summary = root.querySelector('[data-pd-summary]');
    var button = root.querySelector('[data-pd-read-more]');
    if (!summary || !button) return;

    var collapsed = true;

    function needsToggle() {
      // Temporarily expand to measure full height
      var wasCollapsed = summary.classList.contains('is-collapsed');
      summary.classList.remove('is-collapsed');
      var full = summary.scrollHeight;
      if (wasCollapsed) summary.classList.add('is-collapsed');
      return full > summary.clientHeight + 8 || wasCollapsed && full > 184;
    }

    // Start collapsed only when content overflows
    summary.classList.add('is-collapsed');
    if (!needsToggle()) {
      summary.classList.remove('is-collapsed');
      button.hidden = true;
      return;
    }

    button.hidden = false;
    button.textContent = 'Read More';

    button.addEventListener('click', function () {
      collapsed = !collapsed;
      summary.classList.toggle('is-collapsed', collapsed);
      button.textContent = collapsed ? 'Read More' : 'Read Less';
    });
  }

  function boot() {
    document.querySelectorAll('[data-project-detail]').forEach(initReadMore);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
