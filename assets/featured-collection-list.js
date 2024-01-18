/**
 *  @class
 *  @function FeaturedCollectionList
 */

if (!customElements.get('featured-collection-list')) {
  class FeaturedCollectionList extends HTMLElement {
    constructor() {
      super();

      this.images = this.querySelectorAll('.featured-collection-list--img');
      this.buttons = Array.from(this.querySelectorAll('.featured-collection-list--button'));

      if (document.body.classList.contains('animations-true') && typeof gsap !== 'undefined') {
        this.prepareAnimations();
      }
    }
    connectedCallback() {
      this.buttons.forEach((button, i) => {
        button.addEventListener('mouseover', (event) => {
          this.onHover(event, button, i);
        });
      });
      if (Shopify.designMode) {
        this.addEventListener('shopify:block:select', (event) => {
          let index = this.buttons.indexOf(event.target);
          this.buttons[index].dispatchEvent(new Event('mouseover'));
        });
      }
    }
    prepareAnimations() {
      let section = this,
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: section.querySelector('.featured-collection-list--inner--content'),
            start: "top 70%"
          }
        });

      tl.
      fromTo(section.buttons, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5 + section.buttons.length * 0.1,
        stagger: 0.1
      });
    }
    onHover(event, button, i) {
      this.images.forEach((image, index) => {
        image.classList.remove('active');
        if (i == index) {
          image.classList.add('active');
        }
      });
      this.buttons.forEach((this_button, index) => {
        this_button.classList.remove('active');
      });
      button.classList.add('active');
    }
  }
  customElements.define('featured-collection-list', FeaturedCollectionList);
}