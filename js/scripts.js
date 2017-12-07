(function($) {
  'use strict';

  Drupal.behaviors.dtagovau = {
    attach: function(context, settings) {
      $('main', context).once('behaviors').addClass('processed');
    }
  }
}(jQuery));
