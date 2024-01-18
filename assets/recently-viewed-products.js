/**
 *  @class
 *  @function RecentlyViewedProducts
 */
if (!customElements.get('recently-viewed-products')) {
  class RecentlyViewedProducts extends HTMLElement {
    constructor() {
      super();

      this.url = theme.routes.search_url + '?view=recently-viewed&type=product&q=';
      this.container = this.querySelector('.products');
      this.currentId = this.dataset.productHandle;
      this.max = 4;
      this.products = '';
      if (window.localStorage) {
        let recentIds = window.localStorage.getItem('recently-viewed');
        if (recentIds && typeof(recentIds) !== undefined) {
          window.recentlyViewedIds = JSON.parse(recentIds);
        }
      }
    }
    connectedCallback() {
      this.buildUrl();
    }
    buildUrl() {
      let i = 0;
      window.recentlyViewedIds.forEach((val) => {
        // Skip current product
        if (val === this.currentId) {
          return;
        }
        // Stop at max
        if (i >= this.max) {
          return;
        }
        this.products += 'handle:' + val + ' OR ';
        i++;
      });

      this.url = this.url + encodeURIComponent(this.products);

      this.fetchProducts();
    }
    fetchProducts() {
      fetch(this.url)
        .then(response => response.text())
        .then(text => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('.products');

          if (recommendations && recommendations.innerHTML.trim().length) {
            this.container.innerHTML = recommendations.innerHTML;
            this.classList.add('product-recommendations--loaded');
          }

        })
        .catch(e => {
          console.error(e);
        });
    }
  }

  customElements.define('recently-viewed-products', RecentlyViewedProducts);
}