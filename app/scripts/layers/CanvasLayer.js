define([
  'Class',
  'underscore'
], function(Class, _) {

  'use strict';

  var CanvasLayer = Class.extend({

    init: function () {
      _.bindAll(this, 'filterTileImgdata');
      this.dataMaxZoom = 18;
      this.tileSize = new google.maps.Size(256, 256);
      this.tiles = {};
      this.params = {};
    },

    /**
     * Called whenever the Google Maps API determines that the map needs to
     * display new tiles for the given viewport.
     *
     * @param  {obj}     coord         coordenades {x ,y}
     * @param  {integer} zoom          current map zoom
     * @param  {object}  ownerDocument
     *
     * @return {canvas}  canvas        tile canvas
     */
    getTile: function(coord, zoom, ownerDocument) {
      /**
       * Testing cache.
       * Doesnt keep all the tiles anymore, just the ones
       * on the current zoom.
       */
      var tileId = this._getTileId(coord.x, coord.y, zoom);
      var objKeys = Object.keys(this.tiles);

      for (var i = 0; i < objKeys.length; i++) {
        if (this.tiles[objKeys[i]].z !== zoom) {
          delete this.tiles[objKeys[i]];
        }
      }

      if (this.tiles[tileId]) {
        return this.tiles[tileId].canvas;
      }
      ///

      var canvas = ownerDocument.createElement('canvas');
      canvas.style.border = 'none';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.width = this.tileSize.width;
      canvas.height = this.tileSize.height;

      var url = this._getUrl.apply(this,
        this._getTileCoords(coord.x, coord.y, zoom));

      this._getImage(url, _.bind(function(image) {
        var canvasData = {
          canvas: canvas,
          image: image,
          x: coord.x,
          y: coord.y,
          z: zoom
        };

        this._cacheTile(canvasData);
        this._drawCanvasImage(canvasData);
      }, this));

      return canvas;
    },

    _drawCanvasImage: function(canvasData) {
      var canvas = canvasData.canvas;
      var image = canvasData.image;
      var x = canvasData.x;
      var y = canvasData.y;
      var z = canvasData.z;

      var ctx = canvas.getContext('2d');
      var zsteps = this._getZoomSteps(z);

      if (zsteps < 0) {
        ctx.drawImage(image, 0, 0);
      } else {
        ctx.imageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;

        var srcX = 256 / Math.pow(2, zsteps) * (x % Math.pow(2, zsteps));
        var srcY = 256 / Math.pow(2, zsteps) * (y % Math.pow(2, zsteps));
        var srcW = 256 / Math.pow(2, zsteps);
        var srcH = 256 / Math.pow(2, zsteps);

        ctx.clearRect(0, 0, 256, 256);
        ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, 256, 256);
      }

      var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.filterTileImgdata(I.data, canvas.width, canvas.height, z);
      ctx.putImageData(I, 0, 0);
    },

    _getZoomSteps: function(z) {
      return z - this.dataMaxZoom;
    },

    _getImage: function(url, callback) {
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var url = URL.createObjectURL(this.response);
        var image = new Image();

        image.onload = function () {
          image.crossOrigin = '';
          callback(image);
          URL.revokeObjectURL(url);
        };
        image.src = url;
      };

      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.send();
    },

    _getUrl: function(x, y, z) {
      return this.urlTemplate.replace('%z', z).replace('%x', x).replace('%y', y);
    },

    _getTileCoords: function(x, y, z) {
      if (z > this.dataMaxZoom) {
        x = Math.floor(x / (Math.pow(2, z - this.dataMaxZoom)));
        y = Math.floor(y / (Math.pow(2, z - this.dataMaxZoom)));
        z = this.dataMaxZoom;
      } else {
        y = (y > Math.pow(2, z) ? y % Math.pow(2, z) : y);
        if (x >= Math.pow(2, z)) {
          x = x % Math.pow(2, z);
        } else if (x < 0) {
          x = Math.pow(2, z) - Math.abs(x);
        }
      }

      return [x, y, z];
    },

    _cacheTile: function(canvasData) {
      var tileId = this._getTileId(canvasData.x, canvasData.y, canvasData.z);
      canvasData.canvas.setAttribute('id', tileId);
      this.tiles[tileId] = canvasData;
    },

    _getTileId: function(x, y, z) {
      return x + '_' + y + '_' + z;
    },

    setParams: function(params) {
      this.params = params || {};
    },

    updateTiles: function() {
      for(var i in this.tiles) {
        this._drawCanvasImage(this.tiles[i]);
      }
    },

    filterTileImgdata: function(imgdata, w, h, zoom) {
    }
  });

  return CanvasLayer;

});
