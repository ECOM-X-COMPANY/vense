/**
 *  @class
 *  @function BackToTop
 */
if (!customElements.get('back-to-top')) {
	class BackToTop extends HTMLElement {
	  constructor() {
			super();
			this.pageHeight = window.innerHeight;
	  }

		connectedCallback() {
			this.addEventListener('click', this.onClick);
			window.addEventListener('scroll', this.checkVisible.bind(this));
		}

		checkVisible(event) {
			window.requestAnimationFrame(() => {
				let y = window.scrollY;
		    if (y > this.pageHeight) {
		      this.classList.add('back-to-top--active');
		    } else {
					this.classList.remove('back-to-top--active');
				}
			});
	  }

		onClick() {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: "smooth"
			});
	  }
	}
	customElements.define('back-to-top', BackToTop);
}
