(function($) {
  'use strict';

  Drupal.behaviors.dtagovau = {
    attach: function(context, settings) {
      $('main', context).once('behaviors').addClass('processed');
    }
  }

  Drupal.behaviors.dtagovauSmoothScroll = {
    attach: function(context, settings) {
      $('a', context).once('smoothScroll').click(function(event) {
        var speed = 500;
        var href = $(this).attr("href").split('#')[1];
        console.log(href);
        if (href) {
          $(this, context).once('behaviours').addClass('processed');
          console.log($('#' + href));
          var position = $('#' + href).offset().top;
          $('html, body').animate({ scrollTop: position }, speed, "swing");
          event.preventDefault();
        }
      });
    }
  }
  Drupal.behaviors.dtagovauChosenAccessibilityFix = {
    attach: function(context, settings) {
      $('body').on('chosen:ready', function(evt, params) {
        $('.js-form-item.js-form-type-select', context).once('chosenAccessibilityFix').each(function(index, element) {
          $(this).find('.chosen-container-multi input.chosen-search-input').attr('aria-label', $.trim($(this).find('label').text()));
        });
      });
    }
  }
}(jQuery));
