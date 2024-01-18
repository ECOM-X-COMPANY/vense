/**
 *  @class
 *  @function SlideShow
 */
class SlideShow {
  constructor() {
    let _this = this,
      slideshows = document.querySelectorAll('.carousel');

    if (!slideshows) {
      return;
    }

    slideshows.forEach((slideshow) => {

      let dots = slideshow.dataset.dots === 'true',
        slideshow_slides = Array.from(slideshow.querySelectorAll('.carousel__slide')),
        autoplay = slideshow.dataset.autoplay == 'false' ? false : parseInt(slideshow.dataset.autoplay, 10),
        align = slideshow.dataset.align == 'center' ? 'center' : 'left',
        fade = slideshow.dataset.fade == 'true' ? true : false,
        prev_button = slideshow.querySelector('.flickity-prev'),
        next_button = slideshow.querySelector('.flickity-next'),
        custom_dots = slideshow.querySelector('.flickity-page-dots'),
        progress_bar = slideshow.parentNode.querySelector('.flickity-progress--bar'),
        animations = [],
        rightToLeft = document.dir === 'rtl',
        animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined',
        selectedIndex = 0,
        args = {
          wrapAround: true,
          cellAlign: align,
          pageDots: false,
          contain: true,
          fade: fade,
          autoPlay: autoplay,
          rightToLeft: rightToLeft,
          prevNextButtons: false,
          cellSelector: '.carousel__slide',
          on: {}
        };

      if (slideshow_slides.length < 1) {
        return;
      }
      if (slideshow.classList.contains('image-with-text-slideshow__image')) {
        let main_slideshow = slideshow.parentNode.querySelector('.image-with-text-slideshow__content'),
          image_slideshow_slides = slideshow.querySelectorAll('.image-with-text-slideshow__image-media');
        args.draggable = false;
        args.asNavFor = main_slideshow;

        if (image_slideshow_slides.length) {
          if (image_slideshow_slides[0].classList.contains('desktop-height-auto')) {
            args.adaptiveHeight = true;
          }
        }
      }
      if (slideshow.classList.contains('customer-reviews__image')) {
        let main_slideshow = slideshow.parentNode.querySelector('.customer-reviews__content');
        args.draggable = false;
        args.asNavFor = main_slideshow;
      }
      if (slideshow.classList.contains('image-with-text-slideshow__content') ||
        slideshow.classList.contains('testimonials__carousel') ||
        slideshow.classList.contains('customer-reviews__content') ||
        slideshow.classList.contains('customer-reviews__image')) {
        args.adaptiveHeight = true;
      }
      if (slideshow.classList.contains('custom-dots')) {

        if (animations_enabled && slideshow.classList.contains('main-slideshow')) {
          _this.prepareAnimations(slideshow, animations);
        }
        args.pauseAutoPlayOnHover = false;

        args.on = {
          staticClick: function () {
            this.unpausePlayer();
          },
          ready: function () {
            let flkty = this;
            // Animations.
            if (animations_enabled && slideshow.classList.contains('main-slideshow')) {
              _this.animateSlides(0, slideshow, animations);
            }

            // Custom Dots.
            if (dots && custom_dots) {
              let dots = custom_dots.querySelectorAll('li');
              dots.forEach((dot, i) => {
                dot.addEventListener('click', (e) => {
                  flkty.select(i);
                });
              });
              dots[this.selectedIndex].classList.add('is-selected');
            }
            document.fonts.ready.then(function () {
              flkty.resize();
            });

            // Video Support.
            let video_container = flkty.cells[0].element.querySelector('.slideshow__slide-video-bg');
            if (video_container) {

              if (video_container.querySelector('iframe')) {
                video_container.querySelector('iframe').onload = function () {
                  _this.videoPlay(video_container);
                };
              } else if (video_container.querySelector('video')) {
                video_container.querySelector('video').onloadstart = function () {
                  _this.videoPlay(video_container);
                };
              }
            }
          },
          change: function (index) {
            let previousIndex = fizzyUIUtils.modulo(this.selectedIndex - 1, this.slides.length);

            // Animations.
            if (animations_enabled && slideshow.classList.contains('main-slideshow')) {
              setTimeout(() => {
                _this.animateReverse(previousIndex, slideshow, animations);
              }, 300);
              _this.animateSlides(index, slideshow, animations);
            }

            // Custom Dots.
            if (dots && custom_dots) {
              let dots = custom_dots.querySelectorAll('li');
              dots.forEach((dot, i) => {
                dot.classList.remove('is-selected');
              });
              dots[this.selectedIndex].classList.add('is-selected');
            }

            // AutoPlay
            if (autoplay) {
              this.stopPlayer();
              this.playPlayer();
            }

            // Video Support.
            // previous slide
            let video_container_prev = flkty.cells[previousIndex].element.querySelector('.slideshow__slide-video-bg');
            if (video_container_prev) {
              _this.videoPause(video_container_prev);
            }
            // current slide
            let video_container = flkty.cells[index].element.querySelector('.slideshow__slide-video-bg');
            if (video_container) {
              if (video_container.querySelector('iframe')) {
                if (video_container.querySelector('iframe').classList.contains('lazyload')) {
                  video_container.querySelector('iframe').addEventListener('lazybeforeunveil', _this.videoPlay(video_container));
                  lazySizes.loader.checkElems();
                } else {
                  _this.videoPlay(video_container);
                }
              } else if (video_container.querySelector('video')) {
                _this.videoPlay(video_container);
              }
            }

          }
        };
      }
      if (slideshow.classList.contains('main-slideshow')) {
        if (slideshow.classList.contains('desktop-height-image') || slideshow.classList.contains('mobile-height-image')) {
          args.adaptiveHeight = true;
        }
      }
      if (slideshow.classList.contains('products')) {
        args.wrapAround = false;
        args.on.ready = function () {
          var flickity = this;
          if (next_button) {
            window.addEventListener('resize.center_arrows', function () {
              _this.centerArrows(flickity, slideshow, prev_button, next_button);
            });
          }
          window.dispatchEvent(new Event('resize.center_arrows'));
        };
      }
      if (progress_bar) {
        args.wrapAround = false;
        args.on.scroll = function (progress) {
          progress = Math.max(0, Math.min(1, progress));

          progress_bar.style.width = progress * 100 + '%';

        };
      }
      const flkty = new Flickity(slideshow, args);

      selectedIndex = flkty.selectedIndex;

      slideshow.dataset.initiated = true;


      if (prev_button) {
        prev_button.addEventListener('click', (event) => {
          flkty.previous();
        });
        prev_button.addEventListener('keyup', (event) => {
          flkty.previous();
        });
        next_button.addEventListener('click', (event) => {
          flkty.next();
        });
        next_button.addEventListener('keyup', (event) => {
          flkty.next();
        });
      }
      if (Shopify.designMode) {
        slideshow.addEventListener('shopify:block:select', (event) => {
          let index = slideshow_slides.indexOf(event.target);
          flkty.select(index);
        });
      }
    });

  }
  videoPause(video_container) {
    setTimeout(() => {
      if (video_container.dataset.provider === 'hosted') {
        video_container.querySelector('video').pause();
      } else if (video_container.dataset.provider === 'youtube') {
        video_container.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: ""
        }), "*");
      } else if (video_container.dataset.provider === 'vimeo') {
        video_container.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
          method: "pause"
        }), "*");
      }
    }, 10);
  }
  videoPlay(video_container) {
    setTimeout(() => {
      if (video_container.dataset.provider === 'hosted') {
        video_container.querySelector('video').play();
      } else if (video_container.dataset.provider === 'youtube') {
        video_container.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
          event: "command",
          func: "playVideo",
          args: ""
        }), "*");
      } else if (video_container.dataset.provider === 'vimeo') {
        video_container.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
          method: "play"
        }), "*");
      }
    }, 10);
  }
  prepareAnimations(slideshow, animations) {
    if (!slideshow.dataset.animationsReady) {
      new SplitText(slideshow.querySelectorAll('h1, p:not(.subheading)'), {
        type: 'lines, words',
        linesClass: 'line-child'
      });
      slideshow.querySelectorAll('.slideshow__slide').forEach((item, i) => {
        let tl = gsap.timeline({
          paused: true
        }),
          button_offset = 0;


        animations[i] = tl;

        if (slideshow.dataset.transition == 'swipe') {
          tl
            .to(item, {
              duration: 0.7,
              clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)"
            }, "start");
        }
        tl
          .to(item.querySelector('.slideshow__slide-bg'), {
            duration: 1.5,
            scale: 1
          }, "start");

        if (item.querySelector('.subheading')) {
          tl
            .fromTo(item.querySelector('.subheading'), {
              opacity: 0
            }, {
              duration: 0.5,
              opacity: 1
            }, 0);

          button_offset += 0.5;
        }
        if (item.querySelector('h1')) {
          let h1_duration = 0.5 + ((item.querySelectorAll('h1 .line-child div').length - 1) * 0.05);
          tl
            .from(item.querySelectorAll('h1 .line-child div'), {
              duration: h1_duration,
              yPercent: '100',
              stagger: 0.05
            }, 0);
          button_offset += h1_duration;
        }
        if (item.querySelector('p:not(.subheading)')) {

          let p_duration = 0.5 + ((item.querySelectorAll('p:not(.subheading) .line-child div').length - 1) * 0.02);
          tl
            .from(item.querySelectorAll('p:not(.subheading) .line-child div'), {
              duration: p_duration,
              yPercent: '100',
              stagger: 0.02
            }, 0);
          button_offset += p_duration;
        }
        if (item.querySelectorAll('.button')) {
          tl
            .fromTo(item.querySelectorAll('.button'), {
              y: '100%'
            }, {
              duration: 0.5,
              y: '0%',
              stagger: 0.1,
            }, button_offset * 0.2);
        }
        item.dataset.timeline = tl;
      });
      slideshow.dataset.animationsReady = true;
    }
  }
  animateSlides(i, slideshow, animations) {
    let flkty = Flickity.data(slideshow),
      active_slide = flkty.selectedElement;
    document.fonts.ready.then(function () {
      animations[i].timeScale(1).restart();
    });
  }
  animateReverse(i, slideshow, animations) {
    animations[i].timeScale(3).reverse();
  }
  centerArrows(flickity, slideshow, prev_button, next_button) {
    let first_cell = flickity.cells[0],
      max_height = 0,

      image_height = first_cell.element.querySelector('.product-featured-image').clientHeight;

    flickity.cells.forEach((item, i) => {
      if (item.size.height > max_height) {
        max_height = item.size.height;
      }
    });

    if (max_height > image_height) {
      let difference = (max_height - image_height) / -2;

      prev_button.style.transform = 'translateY(' + difference + 'px)';
      next_button.style.transform = 'translateY(' + difference + 'px)';
    }
  }
}
if (typeof SlideShow !== 'undefined') {
  new SlideShow();
}