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
  'views/MapView',
  'views/FilterNavView',
  'views/LayersNavView'
], function($, _, Backbone, gmap, mps, MapView, FilterNavView, LayersNavView) {

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

            options: {
              minZoom: 8,
              zoom: 12,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(37.7441, -122.4289)
            }

          });

          new MapView({
            el: '#barcelona .flooding-view',

            options: {
              minZoom: 8,
              zoom: 12,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(41.4186, 2.2598)
            }
          });

          new MapView({
            el: '#miammi .flooding-view',

            options: {
              minZoom: 8,
              zoom: 12,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(25.8280, -80.1736)
            }
          });

          new MapView({
            el: '#san-sebastian .flooding-view',

            options: {
              minZoom: 8,
              zoom: 13,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(43.3099, -1.9913)
            }
          });

          new MapView({
            el: '#aarhon .flooding-view',

            options: {
              minZoom: 8,
              zoom: 12,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(56.1489, 10.2317)
            }
          });

          this.filterNavView = new FilterNavView();
          this.layersNavView = new LayersNavView();
          this.mapView = true;
        }
        // Initialize sf layer
        mps.publish('map/toggle-layer', ['sf']);
        mps.publish('filter/change', [{'5m': true}]);
      }, this));
    }
  });

  var router = new Router();

  return router;

});
