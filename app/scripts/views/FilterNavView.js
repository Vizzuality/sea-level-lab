define([
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'text!../../templates/widget-filter-nav.handlebars'
], function(Backbone, _, Handlebars, mps, tpl) {

  'use strict';

  var FilterNavView = Backbone.View.extend({

    className: 'widget filter-nav',
    template: Handlebars.compile(tpl),

    events: {
      'change input': '_publish'
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      $('.widgets').append(this.el);
    },

    _publish: function() {
      mps.publish('filter/change', [this._getParams()]);
    },

    _getParams: function() {
      var params = {};

      this.$el.find('input:checkbox:checked')
        .map(function() {
          params[this.value] = true;
        });

      return params;
    }
  });

  return FilterNavView;

});
