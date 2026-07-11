/**
 * Library initialization — Tailwind config & third-party setup
 */
(function () {
  'use strict';

  if (typeof tailwind !== 'undefined') {
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            gold: '#c5a23a',
            dark: '#1a1a1a'
          },
          fontFamily: {
            sans: ['Montserrat', 'sans-serif']
          }
        }
      }
    };
  }

  window.SpaceLib = {
    heroSwiper: null,
    testimonialSwiper: null,

    initHeroSwiper: function () {
      if (typeof Swiper === 'undefined' || !document.querySelector('.hero-swiper')) {
        return;
      }

      this.heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        speed: 800
      });
    },

    initTestimonialSwiper: function () {
      if (typeof Swiper === 'undefined' || !document.querySelector('.testimonial-swiper')) {
        return;
      }

      this.testimonialSwiper = new Swiper('.testimonial-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 24,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false
        },
        pagination: {
          el: '.testimonial-pagination',
          clickable: true
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 1 }
        }
      });
    },

    initAll: function () {
      this.initHeroSwiper();
      this.initTestimonialSwiper();
    }
  };
})();
