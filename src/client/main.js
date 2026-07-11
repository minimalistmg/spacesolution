/**
 * Space Solutions — main site interactions
 */
(function ($) {
  'use strict';

  var $header = $('.site-header');
  var $mobileMenu = $('.mobile-menu');
  var $modal = $('#enquiry-modal');
  var $videoModal = $('#video-modal');
  var HERO_VIDEO_SRC = '/images/videos/hero-showreel.mp4';
  var heroVideoPreloadStarted = false;

  function initHeaderScroll() {
    $(window).on('scroll', function () {
      $header.toggleClass('scrolled', $(this).scrollTop() > 50);
    });
  }

  function initMobileMenu() {
    $('.menu-toggle').on('click', function () {
      $mobileMenu.addClass('open');
      $('body').css('overflow', 'hidden');
    });

    $('.mobile-close, .mobile-menu-overlay').on('click', function () {
      $mobileMenu.removeClass('open');
      $('body').css('overflow', '');
    });
  }

  function getFormData(form) {
    var $form = $(form);
    return {
      name: $form.find('[name="name"]').val(),
      country: $form.find('[name="country"]').val() || '+91',
      phone: $form.find('[name="phone"]').val(),
      email: $form.find('[name="email"]').val(),
      location: $form.find('[name="location"]').val(),
      service: $form.find('[name="service"]').val(),
      source: $form.data('source') || 'enquiry'
    };
  }

  function showFormFeedback($form, message, isError) {
    var $feedback = $form.find('.form-feedback');
    if (!$feedback.length) return;
    $feedback
      .text(message)
      .removeClass('error success')
      .addClass(isError ? 'error' : 'success');
  }

  function submitLeadForm(form, options) {
    var $form = $(form);
    var $submit = $form.find('[type="submit"]');
    var originalText = $submit.text();

    showFormFeedback($form, '', false);
    $submit.prop('disabled', true).text('Sending...');

    return fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getFormData(form))
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.data.error || 'Failed to submit. Please try again.');
        }

        showFormFeedback($form, result.data.message, false);

        if (options.onSuccess) {
          options.onSuccess();
        }

        form.reset();
      })
      .catch(function (err) {
        showFormFeedback($form, err.message || 'Something went wrong. Please try again.', true);
      })
      .finally(function () {
        $submit.prop('disabled', false).text(originalText);
      });
  }

  function initEnquiryModal() {
    $('#enquiry-form').attr('data-source', 'enquiry');

    $('[data-open-modal="enquiry"]').on('click', function (e) {
      e.preventDefault();
      $modal.addClass('open');
      $('body').css('overflow', 'hidden');
    });

    $modal.find('.modal-close').on('click', function () {
      $modal.removeClass('open');
      $('body').css('overflow', '');
    });

    $modal.on('click', function (e) {
      if ($(e.target).is($modal)) {
        $modal.removeClass('open');
        $('body').css('overflow', '');
      }
    });

    $('#enquiry-form').on('submit', function (e) {
      e.preventDefault();
      var form = this;
      submitLeadForm(form, {
        onSuccess: function () {
          setTimeout(function () {
            $modal.removeClass('open');
            $('body').css('overflow', '');
          }, 1500);
        }
      });
    });
  }

  function formatVideoTime(seconds) {
    if (!isFinite(seconds)) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + String(secs).padStart(2, '0');
  }

  function pauseHeroSlider() {
    if (window.SpaceLib) {
      window.SpaceLib.pauseHeroAutoplay();
    }
  }

  function resumeHeroSlider() {
    if (window.SpaceLib) {
      window.SpaceLib.resumeHeroAutoplay();
    }
  }

  function preloadHeroVideo() {
    if (heroVideoPreloadStarted || !$('.hero-video-btn').length) return;

    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && conn.saveData) return;

    var player = $videoModal.find('.video-modal-player').get(0);
    if (!player) return;

    heroVideoPreloadStarted = true;
    if (player.readyState >= 3) return;

    player.preload = 'auto';
    player.load();
  }

  function scheduleHeroVideoPreload() {
    if (!$('.hero-video-btn').length) return;

    function runPreload() {
      preloadHeroVideo();
    }

    function deferUntilIdle() {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(runPreload, { timeout: 5000 });
      } else {
        setTimeout(runPreload, 1500);
      }
    }

    if (document.readyState === 'complete') {
      deferUntilIdle();
      return;
    }

    window.addEventListener('load', deferUntilIdle, { once: true });
  }

  function tryPlayVideo(player, $native) {
    var $playBtn = $native.find('.video-ctrl-play');
    var $muteBtn = $native.find('.video-ctrl-mute');

    function markPlaying() {
      $playBtn.addClass('is-playing').attr('aria-label', 'Pause');
    }

    function attemptPlay() {
      var promise = player.play();
      if (!promise || !promise.then) {
        markPlaying();
        return;
      }

      promise
        .then(markPlaying)
        .catch(function () {
          player.muted = true;
          $muteBtn.addClass('is-muted').attr('aria-label', 'Unmute');
          return player.play();
        })
        .then(function () {
          if (!player.paused) {
            markPlaying();
          }
        })
        .catch(function () {
          $playBtn.removeClass('is-playing').attr('aria-label', 'Play');
        });
    }

    if (player.readyState >= 2) {
      attemptPlay();
    } else {
      player.addEventListener('loadeddata', attemptPlay, { once: true });
      player.addEventListener('canplay', attemptPlay, { once: true });
    }
  }

  function closeVideoModal() {
    var $player = $videoModal.find('.video-modal-player');
    var player = $player.get(0);

    $videoModal.removeClass('open is-youtube');
    $videoModal.find('.video-modal-youtube').removeClass('is-active').attr('src', '');
    $videoModal.find('.video-modal-native').removeClass('is-active');

    if (player) {
      player.pause();
      player.currentTime = 0;
    }

    $videoModal.find('.video-ctrl-play').removeClass('is-playing').attr('aria-label', 'Play');
    $videoModal.find('.video-ctrl-mute').removeClass('is-muted').attr('aria-label', 'Mute');
    $videoModal.find('.video-ctrl-progress').val(0);
    $videoModal.find('.video-ctrl-time').text('0:00 / 0:00');

    resumeHeroSlider();
    $('body').css('overflow', '');
  }

  function openYoutubeModal(videoId) {
    var src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
    $videoModal.find('.video-modal-native').removeClass('is-active');
    $videoModal.find('.video-modal-youtube').addClass('is-active').attr('src', src);
    $videoModal.addClass('open is-youtube');
    pauseHeroSlider();
    $('body').css('overflow', 'hidden');
  }

  function initNativeVideoControls() {
    var $native = $videoModal.find('.video-modal-native');
    var $player = $native.find('.video-modal-player');
    var player = $player.get(0);
    if (!player) return;

    var $playBtn = $native.find('.video-ctrl-play');
    var $muteBtn = $native.find('.video-ctrl-mute');
    var $progress = $native.find('.video-ctrl-progress');
    var $time = $native.find('.video-ctrl-time');
    var $fullscreenBtn = $native.find('.video-ctrl-fullscreen');

    function updateTime() {
      var current = player.currentTime || 0;
      var duration = player.duration || 0;
      $time.text(formatVideoTime(current) + ' / ' + formatVideoTime(duration));
      if (duration) {
        $progress.val(String((current / duration) * 100));
      }
    }

    function setPlayingState(isPlaying) {
      $playBtn.toggleClass('is-playing', isPlaying);
      $playBtn.attr('aria-label', isPlaying ? 'Pause' : 'Play');
    }

    $playBtn.on('click', function (e) {
      e.stopPropagation();
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
    });

    $muteBtn.on('click', function (e) {
      e.stopPropagation();
      player.muted = !player.muted;
      $muteBtn.toggleClass('is-muted', player.muted);
      $muteBtn.attr('aria-label', player.muted ? 'Unmute' : 'Mute');
    });

    $progress.on('input', function (e) {
      e.stopPropagation();
      if (!player.duration) return;
      player.currentTime = (Number(this.value) / 100) * player.duration;
      updateTime();
    });

    $fullscreenBtn.on('click', function (e) {
      e.stopPropagation();
      var target = $native.get(0);
      if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }
      if (target && target.requestFullscreen) {
        target.requestFullscreen();
      } else if (player.webkitEnterFullscreen) {
        player.webkitEnterFullscreen();
      }
    });

    $player.on('loadedmetadata timeupdate play pause ended', function () {
      updateTime();
      setPlayingState(!player.paused && !player.ended);
    });

    $player.on('click', function (e) {
      e.stopPropagation();
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
    });
  }

  function openHeroVideoModal() {
    if (!$videoModal.length) return;

    var $youtube = $videoModal.find('.video-modal-youtube');
    var $native = $videoModal.find('.video-modal-native');
    var $body = $videoModal.find('.video-modal-body');
    var $player = $videoModal.find('.video-modal-player');

    if (!$native.length && $body.length) {
      $native = $('<div class="video-modal-native"></div>');
      $body.append($native);
    }

    if (!$player.length && $native.length) {
      $player = $(
        '<video class="video-modal-player" playsinline preload="none" loop>' +
          '<source src="' + HERO_VIDEO_SRC + '" type="video/mp4">' +
          '</video>'
      );
      $native.prepend($player);
    }

    var player = $player.get(0);
    if (!player) return;

    $youtube.removeClass('is-active').attr('src', '');
    $native.addClass('is-active');
    $videoModal.addClass('open').removeClass('is-youtube');
    pauseHeroSlider();
    $('body').css('overflow', 'hidden');

    $native.find('.video-ctrl-play').removeClass('is-playing').attr('aria-label', 'Play');
    $native.find('.video-ctrl-mute').removeClass('is-muted').attr('aria-label', 'Mute');

    player.currentTime = 0;
    player.muted = false;

    if (player.readyState < 2) {
      player.preload = 'auto';
      player.load();
    }

    tryPlayVideo(player, $native);
  }

  function initVideoModal() {
    if (!$videoModal.length) return;

    initNativeVideoControls();

    $('.video-card[data-youtube]').on('click', function () {
      openYoutubeModal($(this).data('youtube'));
    });

    $('.hero-video-btn').on('click', function () {
      openHeroVideoModal();
    });

    $videoModal.find('.video-modal-close').on('click', function (e) {
      e.stopPropagation();
      closeVideoModal();
    });

    $videoModal.on('click', function (e) {
      if ($(e.target).is($videoModal)) {
        closeVideoModal();
      }
    });

    $videoModal.find('.video-modal-panel').on('click', function (e) {
      e.stopPropagation();
    });
  }

  function initScrollAnimations() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initSubmenuMobile() {
    $('.mobile-nav .has-submenu > a').on('click', function (e) {
      e.preventDefault();
      $(this).next('.submenu-mobile').slideToggle(200);
    });
  }

  function initPortfolioFilter() {
    var $items = $('.portfolio-item');
    if (!$items.length) return;

    $('.portfolio-filters button').on('click', function () {
      var filter = $(this).data('filter');
      $('.portfolio-filters button').removeClass('active');
      $(this).addClass('active');

      $items.each(function () {
        var category = $(this).data('category');
        $(this).toggleClass('hidden', filter !== 'all' && category !== filter);
      });
    });
  }

  function initContactForm() {
    var $contactForm = $('#contact-form');
    if (!$contactForm.length) return;

    $contactForm.attr('data-source', 'contact');

    $contactForm.on('submit', function (e) {
      e.preventDefault();
      submitLeadForm(this, {});
    });
  }

  function initFaqAccordion() {
    $('.faq-question').on('click', function () {
      var $item = $(this).closest('.faq-item');
      var isOpen = $item.hasClass('open');
      $('.faq-item').removeClass('open');
      if (!isOpen) {
        $item.addClass('open');
      }
    });
  }

  $(document).ready(function () {
    initHeaderScroll();
    initMobileMenu();
    initEnquiryModal();
    initVideoModal();
    scheduleHeroVideoPreload();
    initScrollAnimations();
    initSubmenuMobile();
    initPortfolioFilter();
    initContactForm();
    initFaqAccordion();

    if (window.SpaceLib) {
      window.SpaceLib.initAll();
    }

    if ($modal.length && !sessionStorage.getItem('enquiryShown')) {
      setTimeout(function () {
        $modal.addClass('open');
        sessionStorage.setItem('enquiryShown', '1');
      }, 2000);
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $modal.removeClass('open');
      closeVideoModal();
      $mobileMenu.removeClass('open');
      $('body').css('overflow', '');
    }
  });
})(jQuery);
