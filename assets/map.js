if (!customElements.get('google-map')) {
	class GoogleMap extends HTMLElement {
		constructor() {
			super();
			this.container = this.querySelector('.google-map--map');
			this.mapZoom = parseInt(this.container.dataset.mapZoom, 10);
			this.mapStyle = this.container.dataset.mapStyle;
			this.mapType = this.container.dataset.mapType;
			this.panControl = this.container.dataset.panControl;
			this.zoomControl = this.container.dataset.zoomControl;
			this.mapTypeControl = this.container.dataset.maptypeControl || false;
			this.scaleControl = this.container.dataset.scaleControl || false;
			this.streetViewControl = this.container.dataset.streetviewControl || false;
			this.locations = this.querySelectorAll('.thb-location');
			this.location_informations = this.querySelectorAll('collapsible-row');
			this.map = false;
		}
		connectedCallback() {
			if (!window.google) {
				return;
			}
			let _this = this;
			this.bounds = new google.maps.LatLngBounds();
			this.renderMap();

			let map = this.map,
				bounds = this.bounds,
				mapResize = this.mapResize,
				zoom = this.mapZoom;

			window.addEventListener('resize', function () { mapResize(map, bounds); });
			google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
				if (zoom > 0) {
					map.setCenter(bounds.getCenter());
					map.setZoom(zoom);
				} else {
					map.setCenter(bounds.getCenter());
					map.fitBounds(bounds);
				}
			});
			this.location_informations.forEach((information) => {
				let arr = Array.prototype.slice.call(this.location_informations),
					i = arr.indexOf(information);
				if (document.body.classList.contains('animations-true') && typeof gsap !== 'undefined') {
					information.addEventListener('click', () => {
						[].forEach.call(_this.location_informations, function (el) {
							el.details.style.overflow = 'hidden';
							el.shrink();
						});
						information.open();
						_this.scrollToPin(i);
					});
				} else {
					information.querySelector('summary').addEventListener('click', () => {
						[].forEach.call(_this.location_informations, function (el) {
							el.querySelector('details').removeAttribute('open');
						});
						this.setAttribute('open', '');
						_this.scrollToPin(i);
					});
				}

			});
			window.dispatchEvent(new Event('resize'));
		}
		getMapOptions() {
			let mapOptions = {
				zoom: this.mapZoom,
				draggable: !("ontouchend" in document),
				scrollwheel: false,
				panControl: this.panControl,
				zoomControl: this.zoomControl,
				mapTypeControl: this.mapTypeControl,
				scaleControl: this.scaleControl,
				streetViewControl: this.streetViewControl,
				fullscreenControl: false,
				mapTypeId: this.mapType,
				gestureHandling: 'cooperative'
			};

			if (this.mapStyle === 'retro') {
				mapOptions.styles = [
					{
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#ebe3cd"
							}
						]
					},
					{
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#523735"
							}
						]
					},
					{
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#f5f1e6"
							}
						]
					},
					{
						"featureType": "administrative",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#c9b2a6"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#dcd2be"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"elementType": "labels",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#ae9e90"
							}
						]
					},
					{
						"featureType": "landscape.natural",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#dfd2ae"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#dfd2ae"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "labels.text",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#93817c"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#a5b076"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#447530"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#f5f1e6"
							}
						]
					},
					{
						"featureType": "road.arterial",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#fdfcf8"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#f8c967"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#e9bc62"
							}
						]
					},
					{
						"featureType": "road.highway.controlled_access",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#e98d58"
							}
						]
					},
					{
						"featureType": "road.highway.controlled_access",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#db8555"
							}
						]
					},
					{
						"featureType": "road.local",
						"elementType": "labels",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "road.local",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#806b63"
							}
						]
					},
					{
						"featureType": "transit.line",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#dfd2ae"
							}
						]
					},
					{
						"featureType": "transit.line",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#8f7d77"
							}
						]
					},
					{
						"featureType": "transit.line",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#ebe3cd"
							}
						]
					},
					{
						"featureType": "transit.station",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#dfd2ae"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#b9d3c2"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#92998d"
							}
						]
					}
				];
			} else if (this.mapStyle === 'night') {
				mapOptions.styles = [
					{
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#242f3e"
							}
						]
					},
					{
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#746855"
							}
						]
					},
					{
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#242f3e"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"elementType": "labels",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "administrative.locality",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#d59563"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "labels.text",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#d59563"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#263c3f"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#6b9a76"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#38414e"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#212a37"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#9ca5b3"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#746855"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#1f2835"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#f3d19c"
							}
						]
					},
					{
						"featureType": "road.local",
						"elementType": "labels",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "transit",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#2f3948"
							}
						]
					},
					{
						"featureType": "transit.station",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#d59563"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#17263c"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#515c6d"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#17263c"
							}
						]
					}
				];
			}
			return mapOptions;
		} // getMapOptions()
		renderMap() {
			let mapOptions = this.getMapOptions(),
				container = this.container;
			this.map = new google.maps.Map(container, mapOptions);

			this.locations.forEach((location, i) => {
				this.renderMarker(i, location, this.map, location.dataset.rendered);
				location.dataset.rendered = true;
			});

		}
		mapResize(map, bounds) {
			setTimeout(function () {
				map.setCenter(bounds.getCenter());
				map.fitBounds(bounds);
			}, 50);
		}
		renderMarker(i, location, map, rendered) {

			let options = JSON.parse(location.dataset.option),
				lat = options.latitude,
				long = options.longitude,
				latlng = new google.maps.LatLng(lat, long),
				marker = options.marker_image,
				marker_size = options.marker_size,
				retina = options.retina_marker,
				pinimageLoad = new Image(),
				that = this;

			location.dataset.latlng = latlng;
			this.bounds.extend(latlng);

			pinimageLoad.src = marker;

			pinimageLoad.addEventListener('load', function () {
				that.setMarkers(i, latlng, marker, marker_size, retina, rendered);
			});
		}
		setMarkers(i, latlng, marker, marker_size, retina, rendered) {
			let _this = this,
				map = this.map;

			if (retina && !rendered) {
				marker_size[0] = marker_size[0] / 2;
				marker_size[1] = marker_size[1] / 2;
			}

			function CustomMarker(latlng, map) {
				this.latlng = latlng;
				this.setMap(map);
			}

			CustomMarker.prototype = new google.maps.OverlayView();

			CustomMarker.prototype.draw = function () {
				var self = this;
				var div = this.div_;
				if (!div) {
					div = this.div_ = document.createElement('div');
					this.div_.classList.add('thb-pin');
					this.div_.innerHTML =
						`<div class="pulse"></div>
						<div class="shadow"></div>
						<div class="pin-wrap"><img src="${marker}" width="${marker_size[0]}'" height="${marker_size[1]}" /></div>`;
					this.pinShadow = this.div_.querySelector('.shadow');
					this.pulse = this.div_.querySelector('.pulse');
					this.div_.style.position = 'absolute';
					this.div_.style.cursor = 'pointer';

					var panes = this.getPanes();
					panes.overlayImage.appendChild(this.div_);

				}
				div.addEventListener('click', function (event) {
					if (_this.location_informations) {
						if (document.body.classList.contains('animations-true') && typeof gsap !== 'undefined') {
							[].forEach.call(_this.location_informations, function (el) {
								el.details.style.overflow = 'hidden';
								el.shrink();
							});
							_this.location_informations[i].open();
						} else {
							[].forEach.call(_this.location_informations, function (el) {
								el.querySelector('details').removeAttribute('open');
							});
							_this.location_informations[i].querySelector('details').setAttribute('open', '');
						}
					}
				});

				var point = this.getProjection().fromLatLngToDivPixel(latlng);

				if (point) {
					var shadow_offset = ((marker_size[0] - 39) / 2);

					this.div_.style.left = point.x - (marker_size[0] / 2) + 'px';
					this.div_.style.top = point.y - (marker_size[1] / 2) + 'px';
					this.div_.style.width = marker_size[0] + 'px';
					this.div_.style.height = marker_size[1] + 'px';
					this.pinShadow.style.marginLeft = shadow_offset + 'px';
					this.pulse.style.marginLeft = shadow_offset + 'px';
				}


			};


			CustomMarker.prototype.getPosition = function () {
				return this.latlng;
			};

			var g_marker = new CustomMarker(latlng, map);
		}
		scrollToPin(i) {
			let location = this.locations[i],
				options = JSON.parse(location.dataset.option),
				lat = options.latitude,
				long = options.longitude,
				latlng = new google.maps.LatLng(lat, long);
			this.map.setZoom(10);
			this.map.panTo(latlng);
		}
	}

	customElements.define('google-map', GoogleMap);
}
