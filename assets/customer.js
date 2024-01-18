/**
 *  @class
 *  @function  CustomerAddresses
 */

class CustomerAddresses {

  constructor() {
    this.add_new = document.querySelector('.add-address');
    this.edit_addresses = document.querySelectorAll('.edit-address-button');
    this.delete_addresses = document.querySelectorAll('.delete-address-button');
    // Add functionality to buttons
    this.add_new.addEventListener('click', (e) => this.toggle_addnew(e));
    this.edit_addresses.forEach((edit_address) => {
      this.edit_address(edit_address);
    });
    this.delete_addresses.forEach((delete_address) => {
      this.delete_address(delete_address);
    });
    this.setupCountries();
  }

  toggle_addnew(e) {
    e.preventDefault();
    let add_new_sidepanel = document.querySelector('#Side-Panel-Add-Address');

    document.getElementsByTagName("body")[0].classList.add('open-cc');

    add_new_sidepanel.classList.add('active');
  }
  edit_address(edit_address) {
    let _this = this,
      button = edit_address,
      target = button.closest('.my-address').querySelector('#' + button.dataset.controls);

    button.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementsByTagName("body")[0].classList.add('open-cc');
      target.classList.add('active');
    });
  }
  delete_address(delete_address) {
    delete_address.addEventListener('click', (e) => {
      // eslint-disable-next-line no-alert
      if (confirm(e.target.getAttribute('data-confirm-message'))) {
        Shopify.postLink(e.target.getAttribute('data-target'), {
          parameters: {
            _method: 'delete'
          },
        });
      }
    });
  }
  setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {

      document.querySelectorAll('[data-address-country-select]').forEach((select) => {
        const formId = select.dataset.formId;
        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`
        });
      });

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew'
      });
    }
  }
}
window.addEventListener('load', () => {
  if (typeof CustomerAddresses !== 'undefined') {
    new CustomerAddresses();
  }
});