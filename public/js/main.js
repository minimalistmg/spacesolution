/**
 * Space Solutions — main site interactions
 */
(function ($) {
  'use strict';

  var $header = $('.site-header');
  var $mobileMenu = $('.mobile-menu');
  var $modal = $('#enquiry-modal');
  var $videoModal = $('#video-modal');

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

  function initVideoModal() {
    $('.video-card[data-youtube]').on('click', function () {
      var videoId = $(this).data('youtube');
      var src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
      $videoModal.find('iframe').attr('src', src);
      $videoModal.addClass('open');
      $('body').css('overflow', 'hidden');
    });

    $('.hero-video-btn').on('click', function () {
      var src = 'https://spacesolution.in/wp-content/uploads/2026/04/WhatsApp-Video-2026-03-31-at-2.53.35-PM.mp4';
      $videoModal.find('iframe').hide();
      var $video = $videoModal.find('video');
      if (!$video.length) {
        $video = $('<video controls autoplay></video>');
        $videoModal.find('.video-modal-body').append($video);
      }
      $video.attr('src', src).show();
      $videoModal.addClass('open');
      $('body').css('overflow', 'hidden');
    });

    $videoModal.find('.modal-close').on('click', function () {
      $videoModal.removeClass('open');
      $videoModal.find('iframe').attr('src', '').show();
      $videoModal.find('video').attr('src', '').hide();
      $('body').css('overflow', '');
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
      $videoModal.removeClass('open');
      $mobileMenu.removeClass('open');
      $('body').css('overflow', '');
    }
  });
})(jQuery);
