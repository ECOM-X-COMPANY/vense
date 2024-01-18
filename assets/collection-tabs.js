/**
 *  @class
 *  @function CollectionTabs
 */

if (!customElements.get('collection-tabs')) {
  class CollectionTabs extends HTMLElement {

    constructor() {
      super();


    }
    connectedCallback() {
      setTimeout(() => {
        this.buttons = Array.from(this.querySelectorAll('button'));
        this.links = this.closest('.section-header').querySelectorAll('.linked-to-tab');
        this.target = this.dataset.target;

        this.buttons.forEach((button, i) => {
          button.addEventListener('click', (event) => {
            let handle = button.dataset.collection;
            [].forEach.call(this.buttons, function(el) {
              el.classList.remove('active');
            });

            if (this.links.length) {
              [].forEach.call(this.links, function(el) {
                el.classList.remove('active');
              });
              this.links[i].classList.add('active');
            }
            button.classList.add('active');

            if (handle) {
              this.toggleCollection(handle);
            }

            event.preventDefault();
          });
        });
      }, 10);
      if (Shopify.designMode) {
        this.addEventListener('shopify:block:select', (event) => {
          let index = this.buttons.indexOf(event.target);

          this.buttons[index].dispatchEvent(new Event('click'));
        });
      }
    }
    toggleCollection(handle) {
      let slider = document.getElementById(this.target),
        products = slider.querySelectorAll(`.columns:not([data-collection="${handle}"])`),
        active_products = slider.querySelectorAll(`[data-collection="${handle}"]`),
        flkty = Flickity.data(slider);

      [].forEach.call(products, function(el) {
        el.classList.remove('carousel__slide');
        slider.append(el);
      });
      [].forEach.call(active_products, function(el) {
        el.classList.add('carousel__slide');
      });
      flkty.insert(active_products);
      flkty.reloadCells();
      flkty.select(0, 0, 1);
    }
  }
  customElements.define('collection-tabs', CollectionTabs);
}