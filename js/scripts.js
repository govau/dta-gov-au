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
        if (href) {
          $(this, context).once('behaviours').addClass('processed');
          var element = '#' + href;
          var position = $(element).offset().top;
          $('html, body').animate({ scrollTop: position }, speed, "swing");
          event.preventDefault();
        }
      });
    }
  }
  Drupal.behaviors.dtagovauChosenAccessibilityFix = {
    // Fixes an accessibility issue with the Chosen library.
    attach: function(context, settings) {
      $('body').on('chosen:ready', function(evt, params) {
        $('.js-form-item.js-form-type-select', context).once('chosenAccessibilityFix').each(function(index, element) {
          $(this).find('.chosen-container-multi input.chosen-search-input').attr('aria-label', $.trim($(this).find('label').text()));
        });
      });
    }
  }
  Drupal.behaviors.dtagovauSVGSwap = {
    // Swaps out SVG images for PNGs on non-supporting browsers. Taken from
    // https://css-tricks.com/a-complete-guide-to-svg-fallbacks/.
    attach: function(context, settings) {
      function svgasimg() {
        return document.implementation.hasFeature(
          "http://www.w3.org/TR/SVG11/feature#Image", "1.1"
        );
      }
      if (!svgasimg()) {
        $('img, IMG', context)
          .once('svg-swapped')
          .each(function(index, element) {
            if ($(this).attr('src').match(/svgz?$/)) {
              $(this).attr('src', $(this).attr('data-fallback'));
            }
          });
      }
    }
  }
  Drupal.behaviors.dtagovauAutocompleteReposition = {
    // Reposition the autocomplete drop downs for better UI.
    attach: function(context, settings) {
      if ($('header .ui-autocomplete-input').length) {
        $('header .ui-autocomplete-input').autocomplete({
          open: function() {
            $('ul.ui-menu').width( $(this)[0].offsetWidth - 17);
          },
          position: {
            my: 'left top',
            at: 'left bottom',
            of: 'header .ui-autocomplete-input'
          }
        });
      }
      if ($('header.au-header--content .ui-autocomplete-input').length) {
        $('header.au-header--content .ui-autocomplete-input').autocomplete({
          open: function() {
            $('ul.ui-menu').width( $(this)[0].offsetWidth - 17);
          },
          position: {
            my: 'left top',
            at: 'left bottom',
            of: 'header .ui-autocomplete-input'
          }
        });
      }
      if ($('main .ui-autocomplete-input').length) {
        $('main .ui-autocomplete-input').autocomplete({
          open: function() {
            $('ul.ui-menu').width( $(this)[0].offsetWidth - 17);
          },
          position: {
            my: 'left top-24',
            at: 'left bottom',
            of: 'main .ui-autocomplete-input'
          }
        });
      }
    }
  }
  Drupal.behaviors.dtagovauAccordion = {
    // Update accordions.
    attach: function(context, settings) {
      $(function() {
        $('a#superfish-main-toggle').not('sf-expanded').find('span').html('Open menu');
        $('a#superfish-main-toggle.sf-expanded').find('span').html('Open menu');
        $('a#superfish-main-toggle').click(function() {
          if($(this).hasClass('sf-expanded')) {
            $(this).children('span').html('Close menu');
          } else {
            $(this).children('span').html('Open menu');
          };
        });
      })

    }
  }
}(jQuery));
