/**
 *  @class
 *  @function Pagination
 */

if (!customElements.get('pagination')) {
  class Pagination extends HTMLElement {
    constructor() {
      super();
      const id = this.dataset.section;
      this.button = this.querySelector('.load-more');
      this.grid = document.querySelector('[data-id=' + id + ']');
      this.animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined';
      this.i = 2;
    }
    connectedCallback() {
      if (this.classList.contains('pagination-type--loadmore')) {
        this.loadMore();
      }
      if (this.classList.contains('pagination-type--infinite')) {
        this.infinite();
      }
    }
    addUrlParam(search, key) {
      var newParam = key + '=' + this.i,
        params = '?' + newParam;

      // If the "search" string exists, then build params from it
      if (search) {
        // Try to replace an existance instance
        params = search.replace(new RegExp('([?&])' + key + '[^&]*'), '$1' + newParam);

        // If nothing was replaced, then add the new param to the end
        if (params === search) {
          params += '&' + newParam;
        }
      }

      return params;
    }
    loadMore() {
      let base = this;
      this.button.addEventListener('click', function() {
        base.loadProducts();
        this.blur();
        return false;
      });
    }
    infinite() {
      let base = this;
      base.observer = new IntersectionObserver(function(entries) {
        if (entries[0].intersectionRatio === 1) {
          base.loadProducts();
        }
      }, {
        threshold: [0, 1]
      });
      base.observer.observe(base);
    }
    loadProducts() {
      let base = this,
        url = document.location.pathname + base.addUrlParam(document.location.search, 'page');
      if (base.getAttribute('loading')) {
        return;
      }
      base.i++;
      base.setAttribute('loading', true);
      fetch(url)
        .then(response => response.text())
        .then((responseText) => {
          const html = responseText;
          base.renderProducts(html, url);

          dispatchCustomEvent('pagination:page-changed', {
            url: url
          });
        });
    }
    renderProducts(html, url) {
      let base = this,
        grid_to_replace = new DOMParser().parseFromString(html, 'text/html').getElementById('product-grid');

      if (!grid_to_replace) {
        if (base.observer) {
          base.observer.unobserve(base);
        }
        base.removeAttribute('loading');
        if (base.button) {
          base.button.classList.add('visually-hidden');
        }
        return;
      }
      let products = grid_to_replace.querySelectorAll('.column');

      for (var i = 0; i < products.length; i++) {
        this.grid.appendChild(products[i]);
      }
      if (this.animations_enabled) {
        gsap.set(products, {
          opacity: 0,
          y: 30
        });
        gsap.to(products, {
          duration: 0.5,
          y: 0,
          opacity: 1,
          stagger: 0.05,
          onComplete: function() {
            base.removeAttribute('loading');
          }
        });
      } else {
        base.removeAttribute('loading');
      }
    }
  }
  customElements.define('pagination-theme', Pagination);
}