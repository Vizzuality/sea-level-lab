define([
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'text!../../templates/widget-layers-nav.handlebars'
], function(Backbone, _, Handlebars, mps, tpl) {

  'use strict';

  var LayersNavView = Backbone.View.extend({

    className: 'widget layers-nav',
    template: Handlebars.compile(tpl),

    events: {
      'click li': '_toggleLayer'
    },

    initialize: function() {
      _.bindAll(this, '_subscribe', '_toggleSelected');
      this.render();
      this._subscribe();
    },

    // render: function() {
    //   this.$el.html(this.template());
    //   $('.widgets').append(this.el);
    // },

    _subscribe: function() {
      mps.subscribe('map/toggle-layer', this._toggleSelected);
    },

    _toggleSelected: function(layerName) {
      this.$el.find('li[data-layer="' + layerName + '"]')
        .toggleClass('selected');
    },

    _toggleLayer: function(event) {
      var $currentTarget = $(event.currentTarget);
      var layerName = $currentTarget.data('layer');

      if (layerName) {
        mps.publish('map/toggle-layer', [layerName]);
      }
    }

  });

  return LayersNavView;

});
