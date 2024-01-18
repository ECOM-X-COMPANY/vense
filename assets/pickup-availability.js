if (!customElements.get('pickup-availability')) {
  customElements.define('pickup-availability', class PickupAvailability extends HTMLElement {
    constructor() {
      super();

      if (!this.hasAttribute('available')) return;

      this.onClickRefreshList = this.onClickRefreshList.bind(this);
      this.fetchAvailability(this.dataset.variantId);

    }

    fetchAvailability(variantId) {
      let rootUrl = this.dataset.rootUrl;
      if (!rootUrl.endsWith("/")) {
        rootUrl = rootUrl + "/";
      }
      const variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;

      fetch(variantSectionUrl)
        .then(response => response.text())
        .then(text => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('.shopify-section');
          this.renderPreview(sectionInnerHTML);

        })
        .catch(e => {
          const button = this.querySelector('button');
          if (button) button.removeEventListener('click', this.onClickRefreshList);
          this.renderError();
        });
    }

    onClickRefreshList(evt) {
      this.fetchAvailability(this.dataset.variantId);
    }

    renderError() {
      this.innerHTML = '';

			if ( this.querySelector('button') ) {
	      this.querySelector('button').addEventListener('click', this.onClickRefreshList);
			}
    }

    renderPreview(sectionInnerHTML) {
      const drawer = document.querySelector('.pickup-availability-drawer');
      if (drawer) drawer.remove();
      if (!sectionInnerHTML.querySelector('.pickup-availability-information')) {
        this.innerHTML = "";
        this.removeAttribute('available');
        return;
      }

      this.innerHTML = sectionInnerHTML.querySelector('.pickup-availability-information').innerHTML;
      this.setAttribute('available', '');

      document.getElementById('Pickup-Availability').innerHTML = sectionInnerHTML.querySelector('.side-availability').innerHTML;

      const button = this.querySelector('button');
      if (button) button.addEventListener('click', (evt) => {
        document.getElementById('Pickup-Availability').classList.toggle("active");
        document.getElementsByTagName("body")[0].classList.toggle('open-cc');

        evt.preventDefault();
      });
    }
  });
}
