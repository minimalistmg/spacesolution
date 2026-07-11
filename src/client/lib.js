
/**
 * Swiper initialization for hero and testimonial carousels
 */
(function () {
  'use strict';

  var HERO_KEN_BURNS_DELAY_MS = 250;

  window.SpaceLib = {
    heroSwiper: null,
    testimonialSwiper: null,
    heroKenBurnsTimer: null,

    resetHeroKenBurnsImage: function (img) {
      img.classList.remove('is-ken-burns-active');
      img.style.animation = 'none';
      void img.offsetHeight;
      img.style.animation = '';
    },

    stopHeroKenBurns: function (swiper) {
      clearTimeout(this.heroKenBurnsTimer);
      this.heroKenBurnsTimer = null;

      swiper.slides.forEach(function (slide) {
        var img = slide.querySelector('.hero-slide-bg img');
        if (img) {
          img.classList.remove('is-ken-burns-active');
        }
      });
    },

    startHeroKenBurns: function (swiper, delay) {
      var self = this;

      clearTimeout(this.heroKenBurnsTimer);
      this.heroKenBurnsTimer = setTimeout(function () {
        self.heroKenBurnsTimer = null;

        swiper.slides.forEach(function (slide) {
          var img = slide.querySelector('.hero-slide-bg img');
          if (img) {
            img.classList.remove('is-ken-burns-active');
          }
        });

        var activeSlide = swiper.slides[swiper.activeIndex];
        if (!activeSlide) return;

        var activeImg = activeSlide.querySelector('.hero-slide-bg img');
        if (!activeImg) return;

        self.resetHeroKenBurnsImage(activeImg);
        activeImg.classList.add('is-ken-burns-active');
      }, delay || 0);
    },

    initHeroSwiper: function () {
      if (typeof Swiper === 'undefined' || !document.querySelector('.hero-swiper')) {
        return;
      }

      var self = this;

      this.heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
          delay: 5500,
          disableOnInteraction: false
        },
        speed: 1350,
        allowTouchMove: false,
        on: {
          init: function (swiper) {
            self.startHeroKenBurns(swiper, HERO_KEN_BURNS_DELAY_MS);
          },
          slideChangeTransitionStart: function (swiper) {
            self.stopHeroKenBurns(swiper);

            var activeSlide = swiper.slides[swiper.activeIndex];
            if (!activeSlide) return;

            var activeImg = activeSlide.querySelector('.hero-slide-bg img');
            if (activeImg) {
              self.resetHeroKenBurnsImage(activeImg);
            }
          },
          slideChangeTransitionEnd: function (swiper) {
            self.startHeroKenBurns(swiper, HERO_KEN_BURNS_DELAY_MS);
          }
        }
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
    },

    pauseHeroAutoplay: function () {
      if (this.heroSwiper && this.heroSwiper.autoplay) {
        this.heroSwiper.autoplay.stop();
      }
    },

    resumeHeroAutoplay: function () {
      if (this.heroSwiper && this.heroSwiper.autoplay) {
        this.heroSwiper.autoplay.start();
      }
    }
  };
})();
