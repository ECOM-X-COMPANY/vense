/**
 *  @class
 *  @function Cart
 */
class Cart {

  constructor() {
    this.container = document.getElementById('Cart');
    this.setupEventListeners();
  }
  onChange(event) {
    if (event.target.type == 'number') {
      this.updateQuantity(event.target.dataset.index, event.target.value);
    } else if (event.target.getAttribute('id') == 'CartSpecialInstructions') {
      this.saveNotes();
    }
  }
  saveNotes() {
    fetch(`${theme.routes.cart_update_url}.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': `application/json`
      },
      body: JSON.stringify({
        'note': document.getElementById('CartSpecialInstructions').value
      })
    });
  }
  setupEventListeners() {
    this.removeProductEvent();

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    document.addEventListener('cart:refresh', (event) => {
      this.refresh();
    });

    this.container.addEventListener('change', this.debouncedOnChange.bind(this));

    this.termsCheckbox();
  }
  getSectionsToRender() {
    return [{
      id: 'Cart',
      section: 'main-cart',
      selector: '.thb-cart-form'
    },
    {
      id: 'cart-drawer-toggle',
      section: 'cart-bubble',
      selector: '.thb-item-count'
    }];
  }
  displayErrors(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError) {
      lineItemError.removeAttribute('hidden');
      lineItemError.querySelector('.cart-item__error-text').innerHTML = message;
      this.container.querySelector(`#CartItem-${line}`).classList.remove('loading');
    }
  }
  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }
  updateQuantity(line, quantity) {

    this.container.classList.add('cart-disabled');
    if (line) {
      this.container.querySelector(`#CartItem-${line}`).classList.add('loading');
    }

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });
    dispatchCustomEvent('line-item:change:start', {
      quantity: quantity
    });
    fetch(`${theme.routes.cart_change_url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': `application/json`
      },
      ...{
        body
      }
    })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);


        if (parsedState.errors) {
          this.displayErrors(line, parsedState.errors);
          this.container.classList.remove('cart-disabled');
          return;
        }

        this.renderContents(parsedState, line, false);

        this.container.classList.remove('cart-disabled');

        dispatchCustomEvent('line-item:change:end', {
          quantity: quantity,
          cart: parsedState
        });
      });
  }
  refresh() {
    this.container.classList.add('cart-disabled');

    let sections = 'main-cart';

    fetch(`${window.location.pathname}/?sections=${sections}`)
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);


        if (parsedState.errors) {
          this.displayErrors(line, parsedState.errors);
          this.container.classList.remove('cart-disabled');
          return;
        }

        this.renderContents(parsedState, false, true);

        this.container.classList.remove('cart-disabled');
      });
  }
  termsCheckbox() {
    let terms_checkbox = this.container.querySelector('#CartTerms'),
      checkout_button = this.container.querySelector('.button.checkout-button');

    if (terms_checkbox && checkout_button) {
      terms_checkbox.setCustomValidity(theme.strings.requiresTerms);
      checkout_button.addEventListener('click', function (e) {
        if (!terms_checkbox.checked) {
          terms_checkbox.reportValidity();
          terms_checkbox.focus();
          e.preventDefault();
        }
      });
    }
  }
  removeProductEvent() {
    let removes = this.container.querySelectorAll('.remove');

    removes.forEach((remove) => {
      remove.addEventListener('click', (event) => {
        this.updateQuantity(event.target.dataset.index, '0');

        event.preventDefault();
      });
    });
  }
  renderContents(parsedState, line, refresh) {
    this.getSectionsToRender().forEach((section => {
      const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

      if (refresh) {
        if (parsedState[section.section]) {
          elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState[section.section], section.selector);
        }
      } else {
        elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
      }

      this.removeProductEvent();

      if (line && this.container.querySelector(`#CartItem-${line}`)) {
        this.container.querySelector(`#CartItem-${line}`).classList.remove('loading');
      }
      this.termsCheckbox();
    }));
  }
}
window.addEventListener('load', () => {
  if (typeof Cart !== 'undefined') {
    new Cart();
  }
});