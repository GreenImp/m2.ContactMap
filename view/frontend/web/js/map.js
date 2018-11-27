define(['jquery',],
  function ($, mapboxgl) {
    'use strict';

    /**
     *
     * @param coords
     * @returns {{lat: number, lng: number}}
     */
    var parseLatLng = function(coords){
      return {
        lat: Number(coords.lat ? ((typeof coords.lat === 'function') ? coords.lat() : coords.lat) : coords[0] || 0),
        lng: Number(coords.lng ? ((typeof coords.lng === 'function') ? coords.lng() : coords.lng) : coords[0] || 0),
      };
    };

    /**
     * List of libraries for each available map type.
     * They should all have the same public methods, but hanle them in their
     * own way internally, specific to the map type
     */
    var mapLibs = Object.freeze({
      google: {
        config: {
          streetViewControl: false,
        },
        /**
         * Authorise the use of the API, generally through the use of an API key
         *
         * @param {string} apiKey
         */
        authoriseAPI: function(apiKey){
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
          get: function(bounds){
            if(bounds){
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
          getCenter: function(bounds){
            return bounds.getCenter();
          },
          /**
           * Extends the bounds to include the given `extendTo` position
           *
           * @param {google.maps.LatLngBounds} bounds
           * @param {{lat: number, lng: number}[]|number[][]|google.maps.LatLng[]} extendTo
           * @returns {google.maps.LatLngBounds}
           */
          extend: function(bounds, extendTo){
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
          add: function(marker, map){
            marker.setMap(map);
          },
          /**
           * Builds a marker
           *
           * @param {{lat: number, lng: number}|number[]} position
           * @param {string} icon
           * @returns {google.maps.Marker}
           */
          build: function(position, icon){
            var positionObj = mapLibs.google.getLatLng(position);

            return new google.maps.Marker({
              position: positionObj,
              draggable: false,
              icon: icon
            });
          },
        },
        /**
         * Builds a map object
         *
         * @param {*} element The DOM element that should become the map
         * @param {{}=} config
         * @returns {google.maps.Map}
         */
        buildMap: function(element, config){
          var mapConfig = $.extend({}, mapLibs.google.config, config);

          return new google.maps.Map(element, mapConfig);
        },
        /**
         * Returns a coordinate object that can be used with this map type
         *
         * @param {{lat: number, lng: number}|number[]} coords
         * @returns {google.maps.LatLng}
         */
        getLatLng: function(coords){
          return new google.maps.LatLng(parseLatLng(coords));
        },
        /**
         * Returns the coordinate objects for each item in the array, that
         * can be used with this map type
         *
         * @param {{lat: number, lng: number}[]|number[][]|google.maps.LatLng[]=} coordList
         * @returns {google.maps.LatLng[]}
         */
        getLatLngs: function(coordList){
          return coordList.map(function(coords){
            return mapLibs.google.getLatLng(coords);
          });
        },
        /**
         * Sets the zoom level on the map
         *
         * @param {Number} zoom
         * @param {google.maps.Map} map
         */
        setZoom: function(zoom, map){
          map.setZoom(zoom);
        },
        /**
         * Centers the map on the specified `center`
         *
         * @param {{lat: number, lng: number}|number[]} center
         * @param {google.maps.Map} map
         */
        setCenter: function(center, map){
          map.setCenter(center);
        },
      },
      mapbox: {
        config: {
          scrollZoom : false,
          style: 'mapbox://styles/mapbox/streets-v10',
        },
        /**
         * Authorise the use of the API, generally through the use of an API key
         *
         * @param {string} apiKey
         */
        authoriseAPI: function(apiKey){
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
          get: function(bounds){
            if(bounds){
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
          getCenter: function(bounds){
            return bounds.getCenter();
          },
          /**
           * Extends the bounds to include the given `extendTo` position
           *
           * @param {mapboxgl.LngLatBounds} bounds
           * @param {{lat: number, lng: number}[]|number[][]|mapboxgl.LngLat[]} extendTo
           * @returns {mapboxgl.LngLatBounds}
           */
          extend: function(bounds, extendTo){
            return bounds.extend(extendTo);
          },
        },
        markers: {
          /**
           * Adds a marker to the map.
           *
           * @param {mapboxgl.Marker} marker
           * @param map
           */
          add: function(marker, map){
            marker.addTo(map);
          },
          /**
           * Builds a marker
           *
           * @param {{lat: number, lng: number}|number[]} position
           * @param {string} icon
           * @returns {mapboxgl.Marker}
           */
          build: function(position, icon){
            var positionObj = mapLibs.mapbox.getLatLng(position);

            return new mapboxgl.Marker().setLngLat(positionObj)
          },
        },
        /**
         * Builds a map object
         *
         * @param {*} element The DOM element that should become the map
         * @param {{}=} config
         * @returns {mapboxgl.Map}
         */
        buildMap: function(element, config){
          var mapConfig = $.extend({}, mapLibs.mapbox.config, config, {container: element});

          return new mapboxgl.Map(mapConfig);
        },
        /**
         * Returns a coordinate object that can be used with this map
         *
         * @param {{lat: number, lng: number}|number[]} coords
         * @returns {mapboxgl.LngLat}
         */
        getLatLng: function(coords){
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
        getLatLngs: function(coordList){
          return coordList.map(function(coords){
            return mapLibs.mapbox.getLatLng(coords);
          });
        },
        /**
         * Sets the zoom level on the map
         *
         * @param {Number} zoom
         * @param {mapboxgl.Map} map
         */
        setZoom: function(zoom, map){
          map.setZoom(zoom);
        },
        /**
         * Centers the map on the specified `center`
         *
         * @param {{lat: number, lng: number}|number[]} center
         * @param {mapboxgl.Map} map
         */
        setCenter: function(center, map){
          map.setCenter(center);
        },
      },
    });


    // TODO - determine which options should be shared between map types and build mapping between generic terms and map type specific
    var defaultConfig = Object.freeze({
      mapBoxClass: 'page-map',
      zoom: null,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      rotateControl: false,
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
        this.mapType = config.mapType || 'google';

        this.config = $.extend({}, defaultConfig, mapLibs[this.mapType].config, config);

        mapLibs[this.mapType].authoriseAPI(config.apiKey);

        if(this.mapType === 'google') {
          google.maps.event.addDomListener(window, 'load', this.initMaps.bind(this));
        }else{
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
        var $mapBox = $(mapBox),
          json = atob($mapBox.attr('data-marker')),
          collection = JSON.parse(json);

        this.locator[key] = {
          bounds: mapLibs[this.mapType].bounds.get(),
          markers: [],
          map: mapLibs[this.mapType].buildMap(mapBox, {
            disableDefaultUI: this.config.disableDefaultUI,
            zoomControl: this.config.zoomControl,
            mapTypeControl: this.config.mapTypeControl,
            scaleControl: this.config.scaleControl,
            streetViewControl: this.config.streetViewControl,
            rotateControl: this.config.rotateControl
          }),
        };

        // loop through each marker data and build the marker
        collection.forEach(function (data) {
          if ((data.lat === null) || (data.lng === null)) {
            return;
          }

          var position = mapLibs[this.mapType].getLatLng(data),
              marker = this.buildMarker(position, collection.icon);

          // add the marker to the list
          this.locator[key].markers.push(marker);

          // extend the map bounds to include the new marker
          mapLibs[this.mapType].bounds.extend(this.locator[key].bounds, position);
        }.bind(this));

        // add markers to the map
        this.addMarkers(key);

        // zoom and pan the map
        if (!this.locator[key].markers.length) {
          // if no markers, set the default zoom and position
          this.setPosition(1, {lat: 0, lng: 0}, this.locator[key].map);
        } else if (this.config.zoom) {
          this.setPosition(this.config.zoom, mapLibs[this.mapType].bounds.getCenter(this.locator[key].bounds), this.locator[key].map);
        } else {
          this.setCenter(mapLibs[this.mapType].bounds.getCenter(this.locator[key].bounds), this.locator[key].map);
        }
      },

      /**
       * Builds a marker
       *
       * @param {{lat: number, lng: number}|number[]} position
       * @param {string} icon
       * @returns {google.maps.Marker|mapboxgl.Marker}
       */
      buildMarker: function (position, icon) {
        return mapLibs[this.mapType].markers.build(position, icon);
      },

      /**
       * Adds a marker to the given map
       *
       * @param {*} marker
       * @param {*} map
       */
      addMarker: function(marker, map){
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
       * Sets the zoom and center position of the map
       *
       * @param {Number} zoom
       * @param {{lat: number, lng: number}|number[]} center
       * @param {*} map
       */
      setPosition: function(zoom, center, map){
        this.setZoom(zoom, map);
        this.setCenter(center, map);
      },

      /**
       * Centers the map on the specified `center`
       *
       * @param {{lat: number, lng: number}|number[]} center
       * @param {*} map
       */
      setCenter: function(center, map){
        mapLibs[this.mapType].setCenter(center, map);
      },

      /**
       * Sets the zoom level on the map
       *
       * @param {Number} zoom
       * @param {*} map
       */
      setZoom: function(zoom, map){
        mapLibs[this.mapType].setZoom(zoom, map);
      }
    };
  });
