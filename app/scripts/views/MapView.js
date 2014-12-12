define([
  'backbone',
  'underscore',
  'mps',
  'layers/SFLayer',
], function(Backbone, _, mps, SFLayer) {

  'use strict';

  var MapView = Backbone.View.extend({

    //el: '.map',

    initialize: function(settings) {
      _.bindAll(this, '_toggleLayer', '_addLayer');
      this.sfLayer = new SFLayer();

      this.options = settings.options;

      //this.layer = setting.layer;

      console.log(settings.layer.layer);
      console.log(this.sfLayer);

      this.render();
    },

    render: function() {
      this.map = new google.maps.Map(this.el, this.options);
      this._resize();
      this._subscribe();
    },

    _subscribe: function(argument) {
      mps.subscribe('map/toggle-layer', this._toggleLayer);

      mps.subscribe('filter/change', _.bind(function(params) {
        this.sfLayer.setParams(params);
        if (this._isLayerRendered('sf')) {
          this.sfLayer.updateTiles();
        }
      }, this));
    },

    _toggleLayer: function(layerName) {
      if (layerName === 'sf') {
        if (this._isLayerRendered(layerName)) {
          this._removeLayer(layerName);
        } else {
          this._addLayer(this.sfLayer);
        }
      }
    },

    _addLayer: function(layer){
      this.map.overlayMapTypes.insertAt(0, layer);
    },

    _isLayerRendered: function(layerName) {
      var overlaysLength = this.map.overlayMapTypes.getLength();
      if (overlaysLength > 0) {
        for (var i = 0; i< overlaysLength; i++) {
          var layer = this.map.overlayMapTypes.getAt(i);
          if (layer && layer.name === layerName) {
            return true;
          }
        }
      }
    },

    _removeLayer: function(layerName) {
      var overlaysLength = this.map.overlayMapTypes.getLength();
      if (overlaysLength > 0) {
        for (var i = 0; i< overlaysLength; i++) {
          var layer = this.map.overlayMapTypes.getAt(i);
          if (layer && layer.name === layerName) {
            this.map.overlayMapTypes.removeAt(i);
          }
        }
      }
    },

    _resize: function() {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setZoom(this.map.getZoom());
      this.map.setCenter(this.map.getCenter());
    }

  });

  return MapView;

});
