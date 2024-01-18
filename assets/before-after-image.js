/**
 *  @class
 *  @function BeforeAfter
 */
if (!customElements.get('before-after')) {
	class BeforeAfter extends HTMLElement {
	  constructor() {
			super();
			this.parent = this.closest('.before-after-image');
			this.slider = this.querySelector('.before-after-image--slider');
			this.position = this.slider.value;
			const _this = this;
			this.observer = new IntersectionObserver(function(entries) {
				if (entries[0].intersectionRatio > 0) {
		      gsap.to(_this.parent, {'--percent': `${_this.position / 10}%`, duration: 1.5, ease:"power2.out"});
					_this.observer.unobserve(_this);
				}
	    },
			{
	      threshold: [0, 1],
				rootMargin: '0% 0% -20% 0%'
	    });
	  }
		connectedCallback() {
			this.slider.addEventListener('input', this.onInput.bind(this));

			if ( document.body.classList.contains('animations-true') ) {
				this.parent.style.setProperty('--percent', '0%');
				this.observer.observe(this);
			}
		}
		onInput() {
			this.parent.style.setProperty('--percent', `${this.slider.value / 10}%`);
		}
	}
	customElements.define('before-after', BeforeAfter);
}
