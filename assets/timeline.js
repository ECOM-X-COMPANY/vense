/**
 *  @class
 *  @function Timeline
 */

if (!customElements.get('time-line')) {
 	class Timeline extends HTMLElement {
		constructor() {
			super();
			this.id = this.dataset.id;
			this.scroller = this.querySelector('.timeline--scroll-container');
			this.animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined';
			this.scrollSet = false;
			this.items = this.querySelectorAll('.timeline--slide');
			this.labels = this.querySelectorAll('.timeline--scroll-pagination li');

			if ( this.animations_enabled ) {
				this.scrollSet = gsap.quickSetter('#time-line-progress-'+ this.id, "scaleX");
			}
	  }
		connectedCallback() {
			const _this = this;
			if ( this.animations_enabled ) {
				_this.scroller.addEventListener('scroll', () => this.onScroll());
			}

			_this.labels.forEach((item, i) => {
				_this.setLabelPosition(item);
			});
		}
		setLabelPosition(item) {
			let contentWidth = this.scroller.querySelector('.timeline--scroll-inner').offsetWidth,
					arr = Array.prototype.slice.call(this.labels),
					i = arr.indexOf(item),
					itemWidth = this.items[i].offsetWidth;

			item.style.flex = (itemWidth / contentWidth);
		}
		onScroll() {
			let scrollLeft = this.scroller.scrollLeft,
					scrollerWidth = this.scroller.offsetWidth,
					contentWidth = this.scroller.querySelector('.timeline--scroll-inner').offsetWidth,
					scrollPercent = (scrollLeft) / ( contentWidth - scrollerWidth );

			this.scrollSet(scrollPercent);
		}
	}
	customElements.define('time-line', Timeline);
}
