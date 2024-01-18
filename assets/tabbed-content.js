/**
 *  @class
 *  @function TabbedContent
 */
if (!customElements.get('tabbed-content')) {
	class TabbedContent extends HTMLElement {
		static get observedAttributes() {
	    return ['selected-index'];
	  }
	  constructor() {
			super();
	  }

		connectedCallback() {
			this.selectedIndex = this.selectedIndex;
			this.animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined';
			this.scroller = this.querySelector('.tabbed-content--scroll');
			this.buttons = Array.from(this.scroller.querySelectorAll('button'));
			this.panels = Array.from(this.querySelectorAll('.tabbed-content--content'));
			this.tl = false;
			if ( this.animations_enabled ) {
				this.tl = gsap.timeline({
					paused: true
				});
			}

			this.buttons.forEach((button, index) => {
				button.addEventListener('click', () => {
					this.selectedIndex = index;
				});
			});
			if (Shopify.designMode) {
	      this.addEventListener('shopify:block:select', (event) => {
					this.selectedIndex = this.buttons.indexOf(event.target);
				});
	    }
		}
		get selectedIndex() {
	    return parseInt(this.getAttribute('selected-index')) || 0;
	  }
	  set selectedIndex(index) {
	    this.setAttribute('selected-index', index);
	  }
		attributeChangedCallback(name, oldValue, newValue) {
	    if (name === "selected-index" && oldValue !== null && oldValue !== newValue) {
				this.buttons[oldValue].classList.remove('active');
				this.buttons[newValue].classList.add('active');
				if ( this.animations_enabled && !this.tl.isActive() ) {
					this.transitionFromTo(this.panels[parseInt(oldValue)], this.panels[parseInt(newValue)]);
				} else {
					this.panels[parseInt(oldValue)].classList.remove('active');
					this.panels[parseInt(newValue)].classList.add('active');
				}

	    }
	  }
		transitionFromTo(oldPanel, newPanel) {
			this.tl
				.clear()
				.to(oldPanel, { autoAlpha: 0, duration: 0.25 })
				.set(oldPanel, { className:"-=active" })
				.set(newPanel, { className:"+=active" })
				.to(newPanel, { autoAlpha: 1, duration: 0.25 });

			this.tl.play();
		}
	}
	customElements.define('tabbed-content', TabbedContent);
}
