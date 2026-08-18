/**
 * Space Solution - main site interactions
 */
(function ($) {
  'use strict';

  var $header = $('.site-header');
  var $videoModal = $('#video-modal');
  var HERO_VIDEO_SRC = '/videos/home-interior-showreel-mysuru.mp4';
  var heroVideoPreloadStarted = false;
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

  function lockVideoBrowserChrome(video) {
    if (!video) return;
    video.disablePictureInPicture = true;
    if ('disableRemotePlayback' in video) {
      video.disableRemotePlayback = true;
    }
    video.setAttribute('disablepictureinpicture', '');
    video.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');
  }

  function lockAllVideoBrowserChrome() {
    document.querySelectorAll('video').forEach(lockVideoBrowserChrome);
  }

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

    if (window.SpaceSolutionsLenis) {
      window.SpaceSolutionsLenis.stop();
    }
  }

  function unlockPageScroll() {
    if (scrollLockCount <= 0) return;

    scrollLockCount -= 1;
    if (scrollLockCount > 0) return;

    var $body = $('body');

    $body.css('overflow', '');
    $body.css('padding-right', $body.data('scroll-padding') || '');
    $header.css('padding-right', $header.data('scroll-padding') || '');

    if (
      window.SpaceSolutionsLenis &&
      !document.documentElement.classList.contains('ss-preloader-pending')
    ) {
      window.SpaceSolutionsLenis.start();
    }
  }

  function resetPageScroll() {
    scrollLockCount = 0;

    var $body = $('body');

    $body.css('overflow', '');
    $body.css('padding-right', $body.data('scroll-padding') || '');
    $header.css('padding-right', $header.data('scroll-padding') || '');

    if (
      window.SpaceSolutionsLenis &&
      !document.documentElement.classList.contains('ss-preloader-pending')
    ) {
      window.SpaceSolutionsLenis.start();
    }
  }

  function validateConsultForm($form) {
    var NAME_MIN = 3;
    var NAME_MAX = 50;
    var MOBILE_LEN = 10;
    var MESSAGE_MIN = 3;
    var MESSAGE_MAX = 500;

    var name = ($form.find('[name="name"]').val() || '').trim();
    var phone = ($form.find('[name="phone"]').val() || '').replace(/\D/g, '');
    var message = ($form.find('[name="message"]').val() || '').trim();

    if (name.length < NAME_MIN) {
      return 'Name must be at least 3 characters';
    }

    if (name.length > NAME_MAX) {
      return 'Name must be 50 characters or less';
    }

    if (!phone) {
      return 'Enter a 10-digit mobile number';
    }

    if (phone.length !== MOBILE_LEN) {
      return 'Mobile must be exactly 10 digits';
    }

    if (message && message.length < MESSAGE_MIN) {
      return 'Message must be at least 3 characters';
    }

    if (message.length > MESSAGE_MAX) {
      return 'Message must be 500 characters or less';
    }

    return '';
  }

  function validateEnquiryForm($form) {
    if (($form.is('#header-connect-form') || $form.is('#header-connect-form-mobile')) && window.SpaceSolutionsHeaderContact) {
      return window.SpaceSolutionsHeaderContact.validateForm($form.get(0));
    }

    var $categoryFields = $form.find('[name="category"]');
    if ($categoryFields.length) {
      var isCategoryRadio = $categoryFields.first().attr('type') === 'radio';
      var selectedCategory = isCategoryRadio
        ? ($form.find('[name="category"]:checked').val() || '').trim()
        : ($categoryFields.val() || '').trim();
      if (!selectedCategory) {
        return 'Please select what you are interested in';
      }
    }

    return validateConsultForm($form);
  }

  function getFormData(form) {
    var $form = $(form);
    var categoryInput = $form.find('[name="category"]:checked');
    var category = (
      (categoryInput.length ? categoryInput.val() : $form.find('[name="category"]').val()) || ''
    ).trim();
    var subServices = $form
      .find('[name="sub_services"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();
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
      carpet_area: ($form.find('[name="carpet_area"]').val() || '').trim(),
      unit_count: ($form.find('[name="unit_count"]').val() || '').trim(),
      opening_target: ($form.find('[name="opening_target"]').val() || '').trim(),
      message: $form.find('[name="message"]').val(),
      category: category,
      service: subServices.length ? subServices.join(', ') : services.join(', '),
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

  function showFormSuccessNext($form) {
    var $feedback = $form.find('.form-feedback');
    if (!$feedback.length) return;

    var wa = $form.attr('data-whatsapp') || 'https://wa.me/916364564563';
    $feedback
      .html(
        '<span class="form-success-next">We’ll call this number within one business day. Prefer WhatsApp? <a class="form-success-whatsapp" href="' +
          wa +
          '" target="_blank" rel="noopener">Message us</a>.</span>'
      )
      .removeClass('error')
      .addClass('success');
  }

  function showLeadSubPanel(form, categoryId) {
    if (!form || !categoryId) return;

    form.querySelectorAll('[data-connect-sub-panel]').forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-connect-sub-panel') !== categoryId;
    });
  }

  function clearInactiveLeadSubServices(form, activeCategoryId) {
    if (!form) return;

    form.querySelectorAll('[name="sub_services"]').forEach(function (input) {
      if (input.getAttribute('data-category-id') !== activeCategoryId) {
        input.checked = false;
      }
    });
  }

  function applyLeadFormDefaults(form, defaults) {
    if (!form || !defaults || !defaults.category) return;

    var $form = $(form);
    var matched = false;

    $form.find('[name="category"]').each(function () {
      var isMatch =
        this.getAttribute('data-category-id') === defaults.category || this.value === defaults.category;
      this.checked = isMatch;
      if (isMatch) matched = true;
    });

    var active =
      ($form.find('[name="category"]:checked').attr('data-category-id') || defaults.category || '').trim();
    var selected = defaults.subServices || [];

    $form.find('[name="sub_services"]').each(function () {
      var matchesCategory = this.getAttribute('data-category-id') === active;
      this.checked = matchesCategory && selected.indexOf(this.value) !== -1;
    });

    if (matched || active) {
      showLeadSubPanel(form, active);
    }
  }

  function getLeadFormDefaults($form, $trigger) {
    var category = '';
    var sub = '';

    if ($trigger && $trigger.length) {
      category = ($trigger.attr('data-enquiry-category') || '').trim();
      sub = ($trigger.attr('data-enquiry-interest') || '').trim();
    }

    if (!category) {
      category = ($form.attr('data-default-category') || '').trim();
    }

    if (!sub) {
      sub = ($form.attr('data-default-sub') || '').trim();
    }

    return {
      category: category,
      subServices: sub
        ? sub
            .split(',')
            .map(function (value) {
              return value.trim();
            })
            .filter(Boolean)
        : []
    };
  }

  function syncLeadFormAfterReset(form) {
    if (!form || form.getAttribute('data-lead-connect') !== 'true') return;

    var checked = form.querySelector('[name="category"]:checked');
    if (!checked) return;

    var activeCategoryId = checked.getAttribute('data-category-id');
    clearInactiveLeadSubServices(form, activeCategoryId);
    showLeadSubPanel(form, activeCategoryId);
  }

  function submitLeadForm(form, options) {
    var $form = $(form);
    var $submit = $form.find('[type="submit"]');
    var $submitLabel = $submit.find('[data-submit-label]');
    var originalText = $submitLabel.length ? $submitLabel.text() : $submit.text();
    var validationMessage = validateEnquiryForm($form);

    showFormFeedback($form, '', false);

    if (validationMessage) {
      showFormFeedback($form, validationMessage, true);
      return Promise.resolve();
    }

    $submit.prop('disabled', true);
    if ($submitLabel.length) {
      $submitLabel.text('Sending...');
    } else {
      $submit.text('Sending...');
    }

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

        form.reset();
        syncLeadFormAfterReset(form);

        if ((form.id === 'header-connect-form' || form.id === 'header-connect-form-mobile') && window.SpaceSolutionsHeaderContact) {
          window.SpaceSolutionsHeaderContact.clearDraft();
        }

        showFormSuccessNext($form);

        if (options.onSuccess) {
          options.onSuccess();
        }
      })
      .catch(function (err) {
        showFormFeedback($form, err.message || 'Something went wrong. Please try again.', true);
      })
      .finally(function () {
        $submit.prop('disabled', false);
        if ($submitLabel.length) {
          $submitLabel.text(originalText);
        } else {
          $submit.text(originalText);
        }
      });
  }

  function initEnquiryTriggers() {
    $('[data-open-modal="enquiry"]').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var defaults = getLeadFormDefaults($('#header-connect-form'), $(this));
      if (window.SpaceSolutionsHeaderContact && window.SpaceSolutionsHeaderContact.open) {
        window.SpaceSolutionsHeaderContact.open({ defaults: defaults });
      }
    });
  }

  function initConnectLeadInterest() {
    $('form[data-lead-connect="true"]').each(function () {
      var form = this;
      if (form.dataset.leadInterestInit === 'true') return;
      form.dataset.leadInterestInit = 'true';

      var selectedCategory = form.querySelector('[name="category"]:checked');
      if (selectedCategory) {
        showLeadSubPanel(form, selectedCategory.getAttribute('data-category-id'));
      }

      form.querySelectorAll('[name="category"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
          var categoryId = radio.getAttribute('data-category-id');
          clearInactiveLeadSubServices(form, categoryId);
          showLeadSubPanel(form, categoryId);
        });
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
    lockVideoBrowserChrome(player);

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
        '<video class="video-modal-player" playsinline preload="none" loop disablepictureinpicture disableremoteplayback controlslist="nodownload noplaybackrate noremoteplayback">' +
          '<source src="' + HERO_VIDEO_SRC + '" type="video/mp4">' +
          '</video>'
      );
      $native.prepend($player);
    }

    var player = $player.get(0);
    if (!player) return;
    lockVideoBrowserChrome(player);

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

  function initConsultMobileFields() {
    $('#enquiry-form, #contact-form, [id^="consult-form-"], [id^="home-consult-form"]').each(function () {
      var $form = $(this);
      var $mobile = $form.find('[name="phone"]');
      if (!$mobile.length || $mobile.data('mobileGuard') === true) return;
      $mobile.data('mobileGuard', true);

      $mobile.on('input', function () {
        var digits = this.value.replace(/\D/g, '').slice(0, 10);
        if (this.value !== digits) {
          this.value = digits;
        }
      });

      $mobile.on('blur', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
      });
    });
  }

  function initContactForm() {
    var $contactForm = $('#contact-form');
    if ($contactForm.length) {
      $contactForm.attr('data-source', 'contact');
      $contactForm.on('submit', function (e) {
        e.preventDefault();
        submitLeadForm(this, {});
      });
    }

    initConsultMobileFields();

    $('[id^="consult-form-"], [id^="home-consult-form"]').on('submit', function (e) {
      e.preventDefault();
      submitLeadForm(this, {});
    });
  }

  function initHeaderConnectForm() {
    var $headerForm = $('#header-connect-form');
    if (!$headerForm.length) return;

    $headerForm.attr('data-source', 'connect');

    $headerForm.on('submit', function (e) {
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
      var el = $target.get(0);

      if (window.SpaceSolutionsLenis && window.SpaceSolutionsLenis.instance) {
        window.SpaceSolutionsLenis.scrollTo(el, { offset: -headerHeight, duration: 1 });
        return;
      }

      var top = $target.offset().top - headerHeight;
      $('html, body').animate({ scrollTop: top }, 400);
    }, 100);
  }

  $(document).ready(function () {
    if (window.SpaceSolutionsHeader) {
      window.SpaceSolutionsHeader.init({
        scrollLock: {
          lock: lockPageScroll,
          unlock: unlockPageScroll,
        },
      });
    }

    if (window.SpaceSolutionsHeaderContact) {
      window.SpaceSolutionsHeaderContact.init();
    }

    if (window.SpaceSolutionsContactConfirm) {
      window.SpaceSolutionsContactConfirm.init();
    }

    initEnquiryTriggers();
    initConnectLeadInterest();
    initVideoModal();
    lockAllVideoBrowserChrome();
    scheduleHeroVideoPreload();
    initScrollAnimations();
    initPortfolioFilter();
    initContactForm();
    initHeaderConnectForm();
    initFaqAccordion();
    initHashScroll();

    if (window.SpaceLib) {
      window.SpaceLib.initAll();
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      closeVideoModal();
      if (window.SpaceSolutionsHeader) {
        window.SpaceSolutionsHeader.closeOnEscape();
      }
      resetPageScroll();
    }
  });
})(jQuery);
