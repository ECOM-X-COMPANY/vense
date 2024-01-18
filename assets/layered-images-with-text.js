/**
 *  @class
 *  @function LayeredImages
 */

if (!customElements.get('layered-images')) {
 	class LayeredImages extends HTMLElement {
	  constructor() {
			super();
	  }
		connectedCallback() {
			if ( document.body.classList.contains('animations-true') && typeof gsap !== 'undefined') {
				this.prepareAnimations();
			}
		}
		prepareAnimations() {
			let section = this.closest('.shopify-section'),
					image_1 = section.querySelector('.layered-image-1'),
					image_2 = section.querySelector('.layered-image-2'),
					image_3 = section.querySelector('.layered-image-3');

			let property = () => {
		  	return gsap.getProperty("html", "--header-height", "px");
			};
			gsap.to(image_1, {
        y: '-8%',
				ease: "power1.out",
        scrollTrigger: {
					trigger: this,
          scrub: 1,
          start: () => `top 90%`,
          end: () => `bottom top+=${property()}`
        }
      });

			gsap.to(image_2, {
        y: '30%',
				ease: "power1.out",
        scrollTrigger: {
					trigger: this,
          scrub: 1,
          start: () => `top 90%`,
          end: () => `bottom top+=${property()}`
        }
      });

			gsap.to(image_3, {
        y: '-30%',
				ease: "power1.out",
        scrollTrigger: {
					trigger: this,
          scrub: 1,
          start: () => `top 90%`,
          end: () => `bottom top+=${property()}`
        }
      });

		}
	}
	customElements.define('layered-images', LayeredImages);
}
