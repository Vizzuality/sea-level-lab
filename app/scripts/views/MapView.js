define([
  'backbone',
  'underscore',
  'mps',
  'layers/SFLayer',
], function(Backbone, _, mps, SFLayer) {

  'use strict';

  var MapView = Backbone.View.extend({

    initialize: function(settings) {
      _.bindAll(this, '_toggleLayer', '_addLayer');

      this.options = settings.options;
      this.layer = settings.layer;
      this.styles = settings.styles;
      this.controlView = settings.controlView.toString();

      this.render();
    },

    render: function() {
      var self = this;
      var styles = [{
          featureType: "landscape",
          stylers: [
            {color: "#ffffff" },
            {visibility: "simplified" }
          ]
        },{
          featureType: "poi",
          stylers: [
            { visibility: "off" }
          ]
        },{
          featureType: "road",
          stylers: [
            {color: "#cfe0ef" }
          ]
        },{
          featureType: "water",
          stylers: [
            {color: "#89bce4" }
          ]
        },{
          featureType: "transit",
          stylers: [
            {color: "#ccdeef" },
            {visibility: "off" }
          ]
        },{
          elementType: "labels",
          stylers: [
            {visibility: "off" }
          ]
        }
      ];

      this.styledMap = new google.maps.StyledMapType(styles);

      this.map = new google.maps.Map(this.el, this.options);
      this.ControlMap = new google.maps.Map(document.getElementById(this.controlView), this.options);

      this.map.mapTypes.set('map_style', this.styledMap);
      this.map.setMapTypeId('map_style');

      this.ControlMap.mapTypes.set('map_style', this.styledMap);
      this.ControlMap.setMapTypeId('map_style');

      var timer;

      google.maps.event.addListener(this.map, 'center_changed', function() {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(function() {
          self.ControlMap.setCenter(self.map.getCenter());
          self.ControlMap.setZoom(self.map.getZoom());
        }, 300);
      });

      google.maps.event.addListener(this.ControlMap, 'center_changed', function() {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(function() {
          self.map.setCenter(self.ControlMap.getCenter());
          self.map.setZoom(self.ControlMap.getZoom());
        }, 300);
      });

      this._resize();
      this._subscribe();
    },

    _subscribe: function(argument) {
      mps.subscribe('map/toggle-layer', this._toggleLayer);

      mps.subscribe('filter/change', _.bind(function(params) {
        this.layer.setParams(params);
        // if (this._isLayerRendered('sf')) {
        //   this.layer.updateTiles();
        // }
        this.layer.updateTiles();
      }, this));
    },

    _toggleLayer: function(layerName) {
      // if (layerName === 'sf') {
      //   if (this._isLayerRendered(layerName)) {
      //     this._removeLayer(layerName);
      //   } else {
      //     this._addLayer(this.layer);
      //   }
      // }
      if (this._isLayerRendered(layerName)) {
        this._removeLayer(layerName);
      } else {
        this._addLayer(this.layer);
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
