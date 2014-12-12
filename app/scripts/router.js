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
  'views/MapView',
  'views/FilterNavView',
  'views/LayersNavView'
], function($, _, Backbone, gmap, mps,  SFLayer, MapView, FilterNavView, LayersNavView) {

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
              minZoom: 3,
              zoom: 12,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(37.7441, -122.4289)
            },

            layer: {
             layer: new SFLayer()
            }



          });

          new MapView({
            el: '#barcelona .flooding-view',

            options: {
              minZoom: 3,
              zoom: 5,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(2.1487679, 41.39479)
            },

            layer: {
             layer: new SFLayer()
            }

          });

          new MapView({
            el: '#miammi .flooding-view',

            options: {
              minZoom: 3,
              zoom: 12,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              center: new google.maps.LatLng(37.7441, -122.4289)
            },

            layer: {
             layer: new SFLayer()
            }

          });

          // new MapView({
          //   el: '#barcelona .flooding-view',

          //   options: {
          //     minZoom: 3,
          //     zoom: 12,
          //     mapTypeId: google.maps.MapTypeId.SATELLITE,
          //     center: new google.maps.LatLng(37.7441, -122.4289)
          //   }
          // });

          // new MapView({
          //   el: '#san-sebastian .flooding-view',

          //   options: {
          //     minZoom: 3,
          //     zoom: 12,
          //     mapTypeId: google.maps.MapTypeId.SATELLITE,
          //     center: new google.maps.LatLng(37.7441, -122.4289)
          //   }
          // });

          // new MapView({
          //   el: '#aarhon .flooding-view',

          //   options: {
          //     minZoom: 3,
          //     zoom: 12,
          //     mapTypeId: google.maps.MapTypeId.SATELLITE,
          //     center: new google.maps.LatLng(37.7441, -122.4289)
          //   }
          // });

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
