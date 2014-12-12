
define([
  'underscore',
  'd3',
  'layers/CanvasLayer'
], function(_, d3, CanvasLayer) {

  'use strict';

  var BCNLayer = CanvasLayer.extend({

    init: function() {
      this._super();
     	this.name = 'ss';
      this.urlTemplate = 'https://api.tiles.mapbox.com/v4/darkit.SS/%z/%x/%y.png?access_token=pk.eyJ1IjoiZGFya2l0IiwiYSI6IkhtblZxN2MifQ.4Se0dQvGFVxnnCrzPkoz3g';
    },

    // this.params have the filter params (sea meters);



	filterTileImgdata: function(imgdata, w, h, z) {
    //console.log(this.params);

    var components = 4; //rgba
    var pixel_pos;
    var zoom = 6;
    //---> power scale
    //var exp=config.compression;
    // var exp=zoom<19?0.3+((zoom-3)/20):1;
    // var myscale=d3.scale.pow().exponent(exp).domain([0,256]).range([0,256]);

    var level=0;
      if (this.params['0m']) {
        level=0;
      }else  if (this.params['1m']) {
        level=1;
      }else  if (this.params['3m']) {
        level=3;
      }else  if (this.params['5m']) {
       level=5;
    }

	      for(var i=0; i < w; ++i) {
	        for(var j=0; j < h; ++j) {
	          var pixel_pos = (j*w + i) * components;
	          var seaLevel = imgdata[pixel_pos] - 2;
	          //var intensity = imgdata[pixel_pos + 1];
	          //yearLoss = 2005;

	          if (seaLevel >= -1 && seaLevel < level+1) {
	            var c = 3;
	            imgdata[pixel_pos] = 137;
              imgdata[pixel_pos + 1] = 188;
              imgdata[pixel_pos + 2] = 228;
              imgdata[pixel_pos + 3] = 191;
              //imgdata[pixel_pos + 3] = 75;
	            //if (zoom < 13) {
	              //imgdata[pixel_pos+ 3] = intensity < 10 ? 0: (12/zoom)*255*c/3;
	              //imgdata[pixel_pos+ 3] = myscale(intensity);
	            //} else {
	              //imgdata[pixel_pos+ 3] = intensity < 10 ? 0: 255*c/3;
	              //imgdata[pixel_pos+ 3] = intensity ;
	            //}

	          } else {
	            imgdata[pixel_pos + 3] = 0;
	          }

	        }
	      }
	    }

	});

	return BCNLayer;

});

