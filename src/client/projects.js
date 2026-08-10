/**
 * Bolt-style projects section
 * Edit alongside: src/components/ProjectsSection.astro + src/styles/projects.css
 */
(function () {
  'use strict';

  function syncToolbarHeight(root) {
    var toolbar = root.querySelector('.ss-projects-toolbar');
    if (!toolbar) return;

    var height = Math.ceil(toolbar.getBoundingClientRect().height);
    if (height > 0) {
      root.style.setProperty('--ss-projects-toolbar-h', height + 'px');
    }
  }

  function initProjectsSection(root) {
    var filters = root.querySelectorAll('[data-projects-filter]');
    var items = root.querySelectorAll('[data-projects-item]');
    var empty = root.querySelector('[data-projects-empty]');
    var toolbar = root.querySelector('.ss-projects-toolbar');
    var active = new Set();

    function applyFilter() {
      var visibleCount = 0;

      items.forEach(function (item) {
        var cats = (item.getAttribute('data-categories') || '')
          .split('|')
          .map(function (c) {
            return c.trim();
          })
          .filter(Boolean);

        var show =
          active.size === 0 ||
          cats.some(function (cat) {
            return active.has(cat);
          });

        item.classList.toggle('is-hidden', !show);
        if (show) visibleCount += 1;
      });

      if (empty) {
        empty.classList.toggle('is-visible', visibleCount === 0);
      }

      syncToolbarHeight(root);
    }

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-projects-filter');
        if (!value) return;

        if (active.has(value)) {
          active.delete(value);
          btn.classList.remove('is-active');
        } else {
          active.add(value);
          btn.classList.add('is-active');
        }

        applyFilter();
      });
    });

    root.querySelectorAll('[data-projects-gallery]').forEach(bindDragScroll);

    syncToolbarHeight(root);

    if (typeof ResizeObserver !== 'undefined' && toolbar) {
      var ro = new ResizeObserver(function () {
        syncToolbarHeight(root);
      });
      ro.observe(toolbar);
    } else {
      window.addEventListener('resize', function () {
        syncToolbarHeight(root);
      });
    }
  }

  function bindDragScroll(gallery) {
    var isDown = false;
    var startX = 0;
    var scrollLeft = 0;
    var moved = false;

    gallery.addEventListener('mousedown', function (event) {
      isDown = true;
      moved = false;
      startX = event.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
      gallery.classList.add('is-dragging');
    });

    gallery.addEventListener('mouseleave', function () {
      isDown = false;
      gallery.classList.remove('is-dragging');
    });

    gallery.addEventListener('mouseup', function () {
      isDown = false;
      gallery.classList.remove('is-dragging');
    });

    gallery.addEventListener('mousemove', function (event) {
      if (!isDown) return;
      event.preventDefault();
      var x = event.pageX - gallery.offsetLeft;
      var walk = (x - startX) * 1.25;
      if (Math.abs(walk) > 3) moved = true;
      gallery.scrollLeft = scrollLeft - walk;
    });

    // Prevent accidental navigation when the user dragged the gallery
    var link = gallery.closest('a');
    if (link) {
      link.addEventListener('click', function (event) {
        if (moved) {
          event.preventDefault();
          moved = false;
        }
      });
    }
  }

  function boot() {
    document.querySelectorAll('[data-projects-section]').forEach(initProjectsSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
