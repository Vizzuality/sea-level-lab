'use strict';

require.config({

  paths: {
    jquery: '../vendor/jquery/dist/jquery',
    underscore: '../vendor/underscore/underscore',
    backbone: '../vendor/backbone/backbone',
    handlebars: '../vendor/handlebars/handlebars',
    Class: '../vendor/Class.js/Class',
    gmap: 'gmap',
    text: '../vendor/requirejs-text/text',
    mps: '../vendor/minpubsub/minpubsub',
    d3: '../vendor/d3/d3'
  },

  shim: {
    jquery: {
      exports: '$'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    Class: {
      exports: 'Class'
    },
    handlebars: {
      exports: 'Handlebars'
    },
    d3: {
      exports: 'd3'
    }
  }
});

/**
 * Application entry point.
 */
require([
  'backbone',
  'router'
], function(Backbone, router) {
  if (!Backbone.History.started) {
    Backbone.history.start({pushState: true});
  }
});
