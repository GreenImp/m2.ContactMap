define(['jquery',],
  function ($, mapboxgl) {
    'use strict';

    /**
     *
     * @param coords
     * @returns {{lat: number, lng: number}}
     */
    var parseLatLng = function (coords) {
      return {
        lat: Number(coords.lat ? ((typeof coords.lat === 'function') ? coords.lat() : coords.lat) : coords[0] || 0),
        lng: Number(coords.lng ? ((typeof coords.lng === 'function') ? coords.lng() : coords.lng) : coords[0] || 0),
      };
    };

    /**
     * Maps the config values to the matching key in `map`
     *
     * @param {{}} config
     * @param {{}} map
     * @returns {{}}
     */
    var mapConfig = function (config, map) {
      var mapped = {};

      if (map) {
        // loop through and insert each item using the mapped key, or its own if no mapped exists
        Object.keys(config).forEach(function (key) {
          mapped[map[key] || key] = config[key];
        });
      } else {
        mapped = config;
      }

      return mapped;
    };

    /**
     * List of libraries for each available map type.
     * They should all have the same public methods, but hanle them in their
     * own way internally, specific to the map type
     */
    var mapLibs = Object.freeze({
      google: {
        config: {
          disableDefaultUI: true,
        },
        /**
         * Authorise the use of the API, generally through the use of an API key
         *
         * @param {string} apiKey
         */
        authoriseAPI: function (apiKey) {
          // nothing to do here - Google Maps API passes the key in the URL when including the JS
        },
        bounds: {
          /**
           * Returns a bounds object that can be used with this map type.
           * If no `bounds` is set, an empty bounds is returned that can
           * be manipulated.
           *
           * @param {{lat: number, lng: number}[]|number[][]|google.maps.LatLng[]=} bounds
           * @returns {google.maps.LatLngBounds}
           */
          get: function (bounds) {
            if (bounds) {
              bounds = mapLibs.google.getLatLngs(bounds);
            }

            return new google.maps.LatLngBounds(bounds);
          },
          /**
           * Returns the center coordinates of the bounds
           *
           * @param {google.maps.LatLngBounds} bounds
           * @returns {google.maps.LatLng}
           */
          getCenter: function (bounds) {
            return bounds.getCenter();
          },
          /**
           * Extends the bounds to include the given `extendTo` position
           *
           * @param {google.maps.LatLngBounds} bounds
           * @param {{lat: number, lng: number}[]|number[][]|google.maps.LatLng[]} extendTo
           * @returns {google.maps.LatLngBounds}
           */
          extend: function (bounds, extendTo) {
            return bounds.extend(extendTo);
          },
        },
        markers: {
          /**
           * Adds a marker to the map.
           *
           * @param {google.maps.Marker} marker
           * @param {google.maps.Map} map
           */
          add: function (marker, map) {
            marker.setMap(map);
          },
          /**
           * Builds a marker
           *
           * @param {{lat: number, lng: number}|number[]} position
           * @param {{}=} options
           * @returns {google.maps.Marker}
           */
          build: function (position, options) {
            var positionObj = mapLibs.google.getLatLng(position),
              opts = $.extend({}, {
                position: positionObj,
                draggable: false,
              }, options);

            return new google.maps.Marker(opts);
          },
        },
        // TODO - add popup functionality
        popups: {
          /**
           * Adds a popup to the map
           *
           * @param {*} popup
           * @param {google.maps.Map} map
           */
          add: function(popup, map){
            console.warn('mapLibs.google.popups.add functionality is not complete');
          },
          /**
           * Builds a popup
           *
           * @param {{lat: number, lng: number}|number[]} position
           * @param {*} content
           * @param {{}=} options
           */
          build: function(position, content, options){
            console.warn('mapLibs.google.popups.build functionality is not complete');
          }
        },
        /**
         * Builds a map object
         *
         * @param {*} element The DOM element that should become the map
         * @param {{}=} config
         * @returns {google.maps.Map}
         */
        buildMap: function (element, config) {
          var mapConfig = $.extend({}, mapLibs.google.config, config);

          return new google.maps.Map(element, mapConfig);
        },
        /**
         * Returns a coordinate object that can be used with this map type
         *
         * @param {{lat: number, lng: number}|number[]} coords
         * @returns {google.maps.LatLng}
         */
        getLatLng: function (coords) {
          return new google.maps.LatLng(parseLatLng(coords));
        },
        /**
         * Returns the coordinate objects for each item in the array, that
         * can be used with this map type
         *
         * @param {{lat: number, lng: number}[]|number[][]|google.maps.LatLng[]=} coordList
         * @returns {google.maps.LatLng[]}
         */
        getLatLngs: function (coordList) {
          return coordList.map(function (coords) {
            return mapLibs.google.getLatLng(coords);
          });
        },
        /**
         * Sets the zoom level on the map
         *
         * @param {Number} zoom
         * @param {google.maps.Map} map
         */
        setZoom: function (zoom, map) {
          map.setZoom(parseInt(zoom, 10));
        },
        /**
         * Centers the map on the specified `center`
         *
         * @param {{lat: number, lng: number}|number[]} center
         * @param {google.maps.Map} map
         */
        setCenter: function (center, map) {
          map.setCenter(center);
        },
      },
      mapbox: {
        config: {
          scrollZoom: false,
          style: 'mapbox://styles/mapbox/streets-v10',
        },
        events: {
          /**
           * Run after the map has been initialised
           *
           * @param {mapboxgl.Map} map
           * @param {{}} config
           */
          onAfterInit: function(map, config){
            if(config.scaleControl) {
              var scale = new mapboxgl.ScaleControl({
                maxWidth: 80,
                unit: 'imperial',
              });

              map.addControl(scale);
            }

            if(config.zoomControl){
              var nav = new mapboxgl.NavigationControl();

              map.addControl(nav, 'top-left');
            }
          },
        },
        /**
         * Authorise the use of the API, generally through the use of an API key
         *
         * @param {string} apiKey
         */
        authoriseAPI: function (apiKey) {
          mapboxgl = mapboxgl || require('mapboxgl');

          mapboxgl.accessToken = apiKey;
        },
        bounds: {
          /**
           * Returns a bounds object that can be used with this map type.
           * If no `bounds` is set, an empty bounds is returned that can
           * be manipulated.
           *
           * @param {{lat: number, lng: number}[]|number[][]|google.maps.LatLng[]=} bounds
           * @returns {mapboxgl.LngLatBounds}
           */
          get: function (bounds) {
            if (bounds) {
              bounds = mapLibs.google.getLatLngs(bounds);
            }

            return new mapboxgl.LngLatBounds(bounds);
          },
          /**
           * Returns the center coordinates of the bounds
           *
           * @param {mapboxgl.LngLatBounds} bounds
           * @returns {mapboxgl.LngLat}
           */
          getCenter: function (bounds) {
            return bounds.getCenter();
          },
          /**
           * Extends the bounds to include the given `extendTo` position
           *
           * @param {mapboxgl.LngLatBounds} bounds
           * @param {{lat: number, lng: number}[]|number[][]|mapboxgl.LngLat[]} extendTo
           * @returns {mapboxgl.LngLatBounds}
           */
          extend: function (bounds, extendTo) {
            return bounds.extend(extendTo);
          },
        },
        configMap: {
          style_url: 'style',
        },
        markers: {
          /**
           * Adds a marker to the map.
           *
           * @param {mapboxgl.Marker} marker
           * @param map
           */
          add: function (marker, map) {
            marker.addTo(map);
          },
          /**
           * Builds a marker
           *
           * @param {{lat: number, lng: number}|number[]} position
           * @param {{}=} options
           * @returns {mapboxgl.Marker}
           */
          build: function (position, options) {
            var positionObj = mapLibs.mapbox.getLatLng(position);

            return new mapboxgl.Marker(options).setLngLat(positionObj);
          },
        },
        popups: {
          config: {
            offset: {
              'top': [0, 5],
              'top-left': [0, 5],
              'top-right': [0, 5],
              'bottom': [0, -41],
              'bottom-left': [0, -41],
              'bottom-right': [0, -41],
              'left': [(27/2) + 5, -41/2],
              'right': [(-27/2) - 5, -41/2],
            }
          },
          /**
           * Adds a popup to the map
           *
           * @param {mapboxgl.Popup} popup
           * @param {mapboxgl.Map} map
           */
          add: function(popup, map){
            popup.addTo(map);
          },
          /**
           * Builds a popup
           *
           * @param {{lat: number, lng: number}|number[]} position
           * @param {*} content
           * @param {{}=} options
           * @returns {mapboxgl.Popup}
           */
          build: function(position, content, options){
            return new mapboxgl.Popup($.extend({}, mapLibs.mapbox.popups.config, options))
              .setLngLat(position)
              .setHTML(content)
          },
        },
        /**
         * Builds a map object
         *
         * @param {*} element The DOM element that should become the map
         * @param {{}=} config
         * @returns {mapboxgl.Map}
         */
        buildMap: function (element, config) {
          var mapConfig = $.extend({}, mapLibs.mapbox.config, config, {container: element});

          return new mapboxgl.Map(mapConfig);
        },
        /**
         * Returns a coordinate object that can be used with this map
         *
         * @param {{lat: number, lng: number}|number[]} coords
         * @returns {mapboxgl.LngLat}
         */
        getLatLng: function (coords) {
          coords = parseLatLng(coords);

          return new mapboxgl.LngLat(coords.lng, coords.lat);
        },
        /**
         * Returns the coordinate objects for each item in the array, that
         * can be used with this map type
         *
         * @param {{lat: number, lng: number}[]|number[][]=} coordList
         * @returns {mapboxgl.LngLat[]}
         */
        getLatLngs: function (coordList) {
          return coordList.map(function (coords) {
            return mapLibs.mapbox.getLatLng(coords);
          });
        },
        /**
         * Sets the zoom level on the map
         *
         * @param {Number} zoom
         * @param {mapboxgl.Map} map
         */
        setZoom: function (zoom, map) {
          map.setZoom(parseInt(zoom, 10));
        },
        /**
         * Centers the map on the specified `center`
         *
         * @param {{lat: number, lng: number}|number[]} center
         * @param {mapboxgl.Map} map
         */
        setCenter: function (center, map) {
          map.setCenter(center);
        },
      },
    });


    var defaultConfig = Object.freeze({
      mapBoxClass: 'page-map',
      zoom: null,
      scaleControl: false,
      zoomControl: false,
    });


    return {
      mapType: null,
      config: {},
      locator: [],

      /**
       * Initialises all the maps
       *
       * @param {{}=} config
       */
      init: function (config) {
        this.mapType = config.map_type || 'google';

        this.config = $.extend({}, defaultConfig, mapLibs[this.mapType].config, mapConfig(config, mapLibs[this.mapType].configMap));

        mapLibs[this.mapType].authoriseAPI(config.api_key);

        if (this.mapType === 'google') {
          google.maps.event.addDomListener(window, 'load', this.initMaps.bind(this));
        } else {
          this.initMaps();
        }
      },

      /**
       * Initialises each individual map
       */
      initMaps: function () {
        // loop through each map on the page and initialise it
        $('.' + this.config.mapBoxClass).each(function (key, mapBox) {
          this.initMap(key, mapBox);
        }.bind(this));
      },

      /**
       * Initialises the map
       *
       * @param {Number|string} key
       * @param {*} mapBox
       */
      initMap: function (key, mapBox) {
        // decode the marker data
        var collection = JSON.parse(atob(mapBox.getAttribute('data-marker'))),
          mapLib = mapLibs[this.mapType],
          popup;

        // build up a storage object for the map
        this.locator[key] = {
          bounds: mapLib.bounds.get(),
          markers: [],
          map: mapLib.buildMap(mapBox, this.config),
        };

        // loop through each marker data and build the markers
        collection.forEach(function (data) {
          var position, marker;

          // don't add the marker if it has no position
          if (!data.position || (data.position.lat === null) || (data.position.lng === null)) {
            return;
          }

          position = mapLib.getLatLng(data.position);
          // build the marker object
          marker = this.buildMarker(position, data.options);

          // add the marker to the list
          this.locator[key].markers.push(marker);

          // extend the map bounds to include the new marker
          mapLib.bounds.extend(this.locator[key].bounds, position);
        }.bind(this));

        // add markers to the map
        this.addMarkers(key);

        // add the popup to the map (If enabled)
        if(this.config.popup && this.config.popup.enabled){
          popup = this.buildPopup(
            this.config.popup.position,
            this.config.popup.rendered_content || this.config.popup.content,
            {
              anchor: (this.config.popup.anchor !== 'dynamic') ? this.config.popup.anchor : null
            }
          );

          this.addPopup(popup, this.locator[key].map);
        }

        // zoom and pan the map
        if (!this.locator[key].markers.length) {
          // if no markers, set the default zoom and position
          this.setPosition(1, {lat: 0, lng: 0}, this.locator[key].map);
        } else if (this.config.zoom) {
          this.setPosition(this.config.zoom, mapLib.bounds.getCenter(this.locator[key].bounds), this.locator[key].map);
        } else {
          this.setCenter(mapLib.bounds.getCenter(this.locator[key].bounds), this.locator[key].map);
        }

        if(mapLib.events && mapLib.events.onAfterInit && (typeof mapLib.events.onAfterInit === 'function')){
          mapLib.events.onAfterInit(this.locator[key].map, this.config);
        }
      },

      /**
       * Builds a marker
       *
       * @param {{lat: number, lng: number}|number[]} position
       * @param {{}=} options
       * @returns {google.maps.Marker|mapboxgl.Marker}
       */
      buildMarker: function (position, options) {
        return mapLibs[this.mapType].markers.build(position, options);
      },

      /**
       * Builds a popup
       *
       * @param {{lat: number, lng: number}|number[]} position
       * @param {*} content
       * @param {{}=} options
       * @returns {*}
       */
      buildPopup: function(position, content, options){
        var config = $.extend({}, options);

        // enforce the generic popup class name
        options.className = (options.className + ' ') + 'page-map__popup';

        return mapLibs[this.mapType].popups.build(position, content, options);
      },

      /**
       * Adds a marker to the given map
       *
       * @param {*} marker
       * @param {*} map
       */
      addMarker: function (marker, map) {
        mapLibs[this.mapType].markers.add(marker, map);
      },

      /**
       * Renders the features on the specified map. If map is set to null, the features will be
       * removed from the map.
       *
       * @param {int} key
       * @return void
       */
      addMarkers: function (key) {
        for (var i = 0; i < this.locator[key].markers.length; i++) {
          this.addMarker(this.locator[key].markers[i], this.locator[key].map);
        }
      },

      /**
       *
       * @param {*} popup
       * @param {*} map
       */
      addPopup: function(popup, map){
        mapLibs[this.mapType].popups.add(popup, map);
      },

      /**
       * Sets the zoom and center position of the map
       *
       * @param {Number} zoom
       * @param {{lat: number, lng: number}|number[]} center
       * @param {*} map
       */
      setPosition: function (zoom, center, map) {
        this.setZoom(zoom, map);
        this.setCenter(center, map);
      },

      /**
       * Centers the map on the specified `center`
       *
       * @param {{lat: number, lng: number}|number[]} center
       * @param {*} map
       */
      setCenter: function (center, map) {
        mapLibs[this.mapType].setCenter(center, map);
      },

      /**
       * Sets the zoom level on the map
       *
       * @param {Number} zoom
       * @param {*} map
       */
      setZoom: function (zoom, map) {
        mapLibs[this.mapType].setZoom(parseInt(zoom, 10), map);
      }
    };
  });
