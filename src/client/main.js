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
  var menuImagePreloadStarted = false;
  var scrollLockCount = 0;
  var youtubeApiPromise = null;
  var youtubePlayer = null;
  var youtubeQualityMenuOpen = false;
  var currentYoutubeVideoId = null;
  var youtubeProgressTimer = null;
  var youtubeProgressSeeking = false;

  var YOUTUBE_QUALITY_LABELS = {
    highres: '4K',
    hd1080: '1080p',
    hd720: '720p',
    large: '480p',
    medium: '360p',
    small: '240p',
    tiny: '144p',
    auto: 'Auto'
  };

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function lockPageScroll() {
    scrollLockCount += 1;
    if (scrollLockCount > 1) return;

    var scrollbarWidth = getScrollbarWidth();
    var $body = $('body');

    $body.data('scroll-padding', $body.css('padding-right') || '');
    $header.data('scroll-padding', $header.css('padding-right') || '');

    if (scrollbarWidth > 0) {
      $body.css('padding-right', scrollbarWidth + 'px');
      $header.css('padding-right', scrollbarWidth + 'px');
    }

    $body.css('overflow', 'hidden');
  }

  function unlockPageScroll() {
    if (scrollLockCount <= 0) return;

    scrollLockCount -= 1;
    if (scrollLockCount > 0) return;

    var $body = $('body');

    $body.css('overflow', '');
    $body.css('padding-right', $body.data('scroll-padding') || '');
    $header.css('padding-right', $header.data('scroll-padding') || '');
  }

  function resetPageScroll() {
    scrollLockCount = 0;

    var $body = $('body');

    $body.css('overflow', '');
    $body.css('padding-right', $body.data('scroll-padding') || '');
    $header.css('padding-right', $header.data('scroll-padding') || '');
  }

  function initHeaderScroll() {
    $(window).on('scroll', function () {
      $header.toggleClass('scrolled', $(this).scrollTop() > 50);
    });
  }

  function initMobileMenu() {
    $('.menu-toggle').on('click', function () {
      $mobileMenu.addClass('open');
      lockPageScroll();
    });

    $('.mobile-close, .mobile-menu-overlay').on('click', function () {
      $mobileMenu.removeClass('open');
      unlockPageScroll();
    });
  }

  function validateEnquiryForm($form) {
    var phone = ($form.find('[name="phone"]').val() || '').trim();
    var email = ($form.find('[name="email"]').val() || '').trim();

    if (!phone && !email) {
      return 'Please add a phone number or email so we can reach you.';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address.';
    }

    return '';
  }

  function getFormData(form) {
    var $form = $(form);
    var services = $form
      .find('[name="services"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();

    return {
      name: $form.find('[name="name"]').val(),
      country: $form.find('[name="country"]').val() || '+91',
      phone: $form.find('[name="phone"]').val(),
      email: $form.find('[name="email"]').val(),
      location: $form.find('[name="location"]').val(),
      service: services.join(', '),
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
    var validationMessage = validateEnquiryForm($form);

    showFormFeedback($form, '', false);

    if (validationMessage) {
      showFormFeedback($form, validationMessage, true);
      return Promise.resolve();
    }

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
      lockPageScroll();
    });

    $modal.find('.modal-close').on('click', function () {
      $modal.removeClass('open');
      unlockPageScroll();
    });

    $modal.on('click', function (e) {
      if ($(e.target).is($modal)) {
        $modal.removeClass('open');
        unlockPageScroll();
      }
    });

    $('#enquiry-form').on('submit', function (e) {
      e.preventDefault();
      var form = this;
      submitLeadForm(form, {
        onSuccess: function () {
          setTimeout(function () {
            $modal.removeClass('open');
            unlockPageScroll();
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

  function getMenuImageUrls() {
    var raw = document.body && document.body.getAttribute('data-menu-preload');
    if (!raw) return [];

    try {
      var urls = JSON.parse(raw);
      return Array.isArray(urls) ? urls : [];
    } catch (err) {
      return [];
    }
  }

  function preloadMenuImages() {
    if (menuImagePreloadStarted) {
      return Promise.resolve();
    }

    menuImagePreloadStarted = true;

    var urls = getMenuImageUrls();
    if (!urls.length) {
      return Promise.resolve();
    }

    return Promise.all(
      urls.map(function (url) {
        return new Promise(function (resolve) {
          var img = new Image();
          img.onload = img.onerror = resolve;
          img.src = url;
        });
      })
    );
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

    deferUntilIdle();
  }

  function scheduleMenuImagePreload() {
    function runAfterLoad() {
      preloadMenuImages().then(scheduleHeroVideoPreload);
    }

    if (document.readyState === 'complete') {
      runAfterLoad();
      return;
    }

    window.addEventListener('load', runAfterLoad, { once: true });
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

  function loadYouTubeApi() {
    if (window.YT && window.YT.Player) {
      return Promise.resolve();
    }

    if (youtubeApiPromise) {
      return youtubeApiPromise;
    }

    youtubeApiPromise = new Promise(function (resolve) {
      var previousReady = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = function () {
        if (typeof previousReady === 'function') {
          previousReady();
        }
        resolve();
      };

      var script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    });

    return youtubeApiPromise;
  }

  function stopYoutubeProgressTimer() {
    if (youtubeProgressTimer) {
      clearInterval(youtubeProgressTimer);
      youtubeProgressTimer = null;
    }
  }

  function updateYoutubeProgressUi() {
    if (!youtubePlayer || youtubeProgressSeeking) {
      return;
    }

    if (
      typeof youtubePlayer.getCurrentTime !== 'function' ||
      typeof youtubePlayer.getDuration !== 'function'
    ) {
      return;
    }

    var current = youtubePlayer.getCurrentTime();
    var duration = youtubePlayer.getDuration();

    if (!duration || duration <= 0) {
      return;
    }

    var percent = (current / duration) * 100;
    var $progress = $videoModal.find('.video-youtube-progress');
    $progress.val(percent);
    $progress.css('--youtube-progress', percent + '%');
    $videoModal
      .find('.video-youtube-time')
      .text(formatVideoTime(current) + ' / ' + formatVideoTime(duration));
  }

  function startYoutubeProgressTimer() {
    stopYoutubeProgressTimer();
    updateYoutubeProgressUi();
    youtubeProgressTimer = setInterval(updateYoutubeProgressUi, 250);
  }

  function resetYoutubeProgressUi() {
    stopYoutubeProgressTimer();
    var $progress = $videoModal.find('.video-youtube-progress');
    $progress.val(0);
    $progress.css('--youtube-progress', '0%');
    $videoModal.find('.video-youtube-time').text('0:00 / 0:00');
    $videoModal.find('.video-youtube-end-shield').prop('hidden', true);
  }

  function showYoutubeEndShield() {
    $videoModal.find('.video-youtube-end-shield').prop('hidden', false);
  }

  function getYoutubeWatchUrl(videoId) {
    return 'https://www.youtube.com/watch?v=' + videoId;
  }

  function copyYoutubeLink() {
    if (!currentYoutubeVideoId) {
      return;
    }

    var url = getYoutubeWatchUrl(currentYoutubeVideoId);
    var $copyBtn = $videoModal.find('.video-youtube-copy');
    var copiedLabel = 'Link copied';

    function markCopied() {
      $copyBtn.addClass('is-copied').attr('aria-label', copiedLabel);
      window.setTimeout(function () {
        $copyBtn.removeClass('is-copied').attr('aria-label', 'Copy link');
      }, 1800);
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(url).then(markCopied).catch(function () {
        fallbackCopy(url);
        markCopied();
      });
      return;
    }

    fallbackCopy(url);
    markCopied();
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  function getYoutubeQualityLabel(quality) {
    return YOUTUBE_QUALITY_LABELS[quality] || quality.toUpperCase();
  }

  function updateYoutubeMuteButton() {
    var $muteBtn = $videoModal.find('.video-youtube-mute');
    if (!youtubePlayer || typeof youtubePlayer.isMuted !== 'function') {
      $muteBtn.removeClass('is-muted').attr('aria-label', 'Mute');
      return;
    }

    var isMuted = youtubePlayer.isMuted();
    $muteBtn.toggleClass('is-muted', isMuted);
    $muteBtn.attr('aria-label', isMuted ? 'Unmute' : 'Mute');
  }

  function closeYoutubeQualityMenu() {
    var $menu = $videoModal.find('.video-youtube-quality-menu');
    var $toggle = $videoModal.find('.video-youtube-quality-toggle');

    $menu.removeClass('open');
    $toggle.attr('aria-expanded', 'false');
    youtubeQualityMenuOpen = false;
  }

  function buildYoutubeQualityMenu() {
    var $menu = $videoModal.find('.video-youtube-quality-menu');
    $menu.empty();

    if (!youtubePlayer || typeof youtubePlayer.getAvailableQualityLevels !== 'function') {
      return;
    }

    var levels = youtubePlayer.getAvailableQualityLevels();
    var currentQuality = youtubePlayer.getPlaybackQuality();

    levels.forEach(function (quality) {
      var $item = $('<button type="button" role="option"></button>');
      $item.text(getYoutubeQualityLabel(quality));
      $item.attr('data-quality', quality);
      $item.toggleClass('is-active', quality === currentQuality);
      $item.on('click', function (e) {
        e.stopPropagation();
        youtubePlayer.setPlaybackQuality(quality);
        buildYoutubeQualityMenu();
        closeYoutubeQualityMenu();
      });
      $menu.append($item);
    });
  }

  function destroyYoutubePlayer() {
    closeYoutubeQualityMenu();
    stopYoutubeProgressTimer();
    currentYoutubeVideoId = null;
    youtubeProgressSeeking = false;

    if (youtubePlayer && typeof youtubePlayer.destroy === 'function') {
      youtubePlayer.destroy();
    }

    youtubePlayer = null;

    var host = document.getElementById('youtube-player-host');
    if (host) {
      host.innerHTML = '';
    }

    resetYoutubeProgressUi();
  }

  function initYoutubeControls() {
    var $controls = $videoModal.find('.video-modal-youtube-controls');
    var $progress = $videoModal.find('.video-youtube-progress');

    $videoModal.find('.video-youtube-copy').on('click', function (e) {
      e.stopPropagation();
      copyYoutubeLink();
    });

    $videoModal.find('.video-youtube-mute').on('click', function (e) {
      e.stopPropagation();
      if (!youtubePlayer || typeof youtubePlayer.isMuted !== 'function') return;

      if (youtubePlayer.isMuted()) {
        youtubePlayer.unMute();
      } else {
        youtubePlayer.mute();
      }

      updateYoutubeMuteButton();
    });

    $progress.on('mousedown touchstart', function () {
      youtubeProgressSeeking = true;
    });

    $progress.on('input', function () {
      if (!youtubePlayer || typeof youtubePlayer.getDuration !== 'function') {
        return;
      }

      var duration = youtubePlayer.getDuration();
      if (!duration || duration <= 0) {
        return;
      }

      var seekTime = (Number($(this).val()) / 100) * duration;
      $(this).css('--youtube-progress', $(this).val() + '%');
      $videoModal
        .find('.video-youtube-time')
        .text(formatVideoTime(seekTime) + ' / ' + formatVideoTime(duration));
    });

    $progress.on('change mouseup touchend', function () {
      if (!youtubePlayer || typeof youtubePlayer.getDuration !== 'function') {
        youtubeProgressSeeking = false;
        return;
      }

      var duration = youtubePlayer.getDuration();
      if (duration && duration > 0) {
        var seekTime = (Number($(this).val()) / 100) * duration;
        youtubePlayer.seekTo(seekTime, true);
      }

      youtubeProgressSeeking = false;
      updateYoutubeProgressUi();
    });

    $videoModal.find('.video-youtube-quality-toggle').on('click', function (e) {
      e.stopPropagation();
      var $menu = $videoModal.find('.video-youtube-quality-menu');
      var $toggle = $(this);
      var willOpen = !$menu.hasClass('open');

      closeYoutubeQualityMenu();

      if (willOpen) {
        buildYoutubeQualityMenu();
        $menu.addClass('open');
        $toggle.attr('aria-expanded', 'true');
        youtubeQualityMenuOpen = true;
      }
    });

    $controls.on('click', function (e) {
      e.stopPropagation();
    });

    $(document).on('click', function () {
      if (youtubeQualityMenuOpen) {
        closeYoutubeQualityMenu();
      }
    });
  }

  function closeVideoModal() {
    var $player = $videoModal.find('.video-modal-player');
    var player = $player.get(0);

    destroyYoutubePlayer();
    $videoModal.find('.video-modal-youtube-controls').prop('hidden', true);

    $videoModal.removeClass('open is-youtube');
    $videoModal.find('.video-modal-youtube').removeClass('is-active');
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
    unlockPageScroll();
  }

  function openYoutubeModal(videoId) {
    if (!$videoModal.length || !videoId) return;

    loadYouTubeApi().then(function () {
      var $host = $videoModal.find('.video-modal-youtube');
      var $controls = $videoModal.find('.video-modal-youtube-controls');

      destroyYoutubePlayer();
      currentYoutubeVideoId = videoId;
      $videoModal.find('.video-modal-native').removeClass('is-active');
      $host.addClass('is-active');
      $controls.prop('hidden', false);
      $videoModal.addClass('open is-youtube');
      pauseHeroSlider();
      lockPageScroll();

      youtubePlayer = new YT.Player('youtube-player-host', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: function () {
            updateYoutubeMuteButton();
            buildYoutubeQualityMenu();
            updateYoutubeProgressUi();
          },
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.PLAYING) {
              $videoModal.find('.video-youtube-end-shield').prop('hidden', true);
              startYoutubeProgressTimer();
              return;
            }

            if (
              event.data === YT.PlayerState.PAUSED ||
              event.data === YT.PlayerState.BUFFERING
            ) {
              stopYoutubeProgressTimer();
              updateYoutubeProgressUi();
              return;
            }

            if (event.data === YT.PlayerState.ENDED) {
              stopYoutubeProgressTimer();
              if (youtubePlayer && typeof youtubePlayer.stopVideo === 'function') {
                youtubePlayer.stopVideo();
              }
              showYoutubeEndShield();
              window.setTimeout(function () {
                closeVideoModal();
              }, 120);
            }
          }
        }
      });
    });
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

    destroyYoutubePlayer();
    $videoModal.find('.video-modal-youtube-controls').prop('hidden', true);
    $videoModal.find('.video-modal-youtube').removeClass('is-active');
    $native.addClass('is-active');
    $videoModal.addClass('open').removeClass('is-youtube');
    pauseHeroSlider();
    lockPageScroll();

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
    initYoutubeControls();

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

  function initHashScroll() {
    if (!window.location.hash) return;

    var $target = $(window.location.hash);
    if (!$target.length) return;

    window.setTimeout(function () {
      var headerHeight = $('.site-header').outerHeight() || 0;
      var top = $target.offset().top - headerHeight;
      $('html, body').animate({ scrollTop: top }, 400);
    }, 100);
  }

  $(document).ready(function () {
    initHeaderScroll();
    initMobileMenu();
    initEnquiryModal();
    initVideoModal();
    scheduleMenuImagePreload();
    initScrollAnimations();
    initSubmenuMobile();
    initPortfolioFilter();
    initContactForm();
    initFaqAccordion();
    initHashScroll();

    if (window.SpaceLib) {
      window.SpaceLib.initAll();
    }

    if ($modal.length && !sessionStorage.getItem('enquiryShown')) {
      setTimeout(function () {
        $modal.addClass('open');
        lockPageScroll();
        sessionStorage.setItem('enquiryShown', '1');
      }, 2000);
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $modal.removeClass('open');
      closeVideoModal();
      $mobileMenu.removeClass('open');
      resetPageScroll();
    }
  });
})(jQuery);
