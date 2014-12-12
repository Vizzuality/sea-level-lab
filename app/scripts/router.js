/**
 * The router module.
 *
 * Router handles app routing and URL parameters and updates Presenter.
 *
 * @return singleton instance of Router class (extends Backbone.Router).
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'gmap',
  'mps',
  'layers/SFLayer',
  'layers/BCNLayer',
  'layers/BOSTONLayer',
  'layers/SSLayer',
  'layers/AARHONLayer',
  'views/MapView',
  'views/FilterNavView',
  'views/LayersNavView',
  'views/NavigationView'
], function($, _, Backbone, gmap, mps,  SFLayer, BCNLayer, BOSTONLayer, SSLayer, AARHONLayer, MapView, FilterNavView, LayersNavView, NavigationView) {

  'use strict';

  var Router = Backbone.Router.extend({

    routes: {
      '*path': 'map'
    },

    map: function() {
      gmap.init(_.bind(function() {
        if (!this.mapView) {

          new MapView({
            el: '#san-francisco .flooding-view',

            controlView: 'san-francisco-control',

            options: {
              minZoom: 8,
              zoom: 12,
              disableDefaultUI: true,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(37.7441, -122.4289)
            },

            layer: new SFLayer()
          });

          new MapView({
            el: '#barcelona .flooding-view',

            controlView: 'barcelona-control',

            options: {
              minZoom: 8,
              zoom: 12,
              disableDefaultUI: true,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(41.4186, 2.2598)
            },

            layer: new BCNLayer()
          });

          new MapView({
            el: '#boston .flooding-view',

            controlView: 'boston-control',

            options: {
              minZoom: 8,
              zoom: 12,
              disableDefaultUI: true,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(42.3666, -71.049)
            },

            layer: new BOSTONLayer()
          });

          new MapView({
            el: '#san-sebastian .flooding-view',

            controlView: 'san-sebastian-control',

            options: {
              minZoom: 8,
              zoom: 13,
              disableDefaultUI: true,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(43.3099, -1.9913)
            },

            layer: new SSLayer()

          });

          new MapView({
            el: '#aarhon .flooding-view',

            controlView: 'aarhon-control',

            options: {
              minZoom: 8,
              zoom: 13,
              disableDefaultUI: true,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(56.1489, 10.2317)
            },

            layer: new AARHONLayer()

          });

          this.filterNavView = new FilterNavView();
          this.layersNavView = new LayersNavView();
          this.mapView = true;
        }


        // Initialize layer
        mps.publish('map/toggle-layer', ['sf']);
        mps.publish('map/toggle-layer', ['bcn']);
        mps.publish('map/toggle-layer', ['ss']);
        mps.publish('map/toggle-layer', ['boston']);
        mps.publish('map/toggle-layer', ['aarhon']);
        mps.publish('filter/change', [{'1m': true}]);
      }, this));
    }
  });

  new NavigationView;
  var router = new Router();

  return router;

});
