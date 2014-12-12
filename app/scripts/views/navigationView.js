define([
  'backbone',
  'underscore',
  'jquery'
], function(Backbone, _, $) {

  'use strict';


  var NavigationView = Backbone.View.extend({

    el: '.mod-navigation',
    events: {
      'click a': 'goTo'
    },

    initialize: function() {

    },

    goTo: function(e) {
      e.preventDefault();

      this.$myDoc = $(document);


      this.$currentAnchor = $(e.currentTarget).attr('href');
      this.$currentAnchorObject = this.$myDoc.find(this.$currentAnchor);
      this.$currentAnchorHeight = this.$currentAnchorObject.offset().top;

      this.whereShouldIgo = this.$currentAnchorHeight;

      console.log( this.$currentAnchor);
      console.log( this.$currentAnchorHeight);

      this.$myDoc.scrollTop(this.whereShouldIgo);
    }

  });

  return NavigationView;

});
