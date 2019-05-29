( function( $ ) {
  'use strict';

  Drupal.behaviors.dtagovau = {
    attach: function( context, settings ) {
      $( 'main', context )
        .once( 'behaviors' )
        .addClass( 'processed' );
    }
  }

  Drupal.behaviors.dtagovauSmoothScroll = {
    // This creates a smooth scroll effect for on page links. It also moves the
    // focus correctly for keyboard uses as per https://www.bignerdranch.com/blog/web-accessibility-skip-navigation-links/.
    attach: function( context, settings ) {
      $( '.au-skip-link a,  main[role="main"] a', context )
        .not('.au-accordion__title, .no-smooth-scroll')
        .once( 'dtagovauSmoothScroll' )
        .on( 'click', function( event ) {
          var speed = 500,
              path = $( this ).attr( "href" ).split( '#' )[0],
              $element = $( '#' + $( this ).attr( "href" ).split( '#' )[1] );

          // Get rid of http:// or https:// from the start of the string.
          if ( path.indexOf( '://' ) > -1 ) {
            path = path.substring( path.indexOf( '://' ) + 3 );
          }

          // Knock off the domain.
          if ( path.indexOf( '/' ) > -1 ) {
            path = path.substring( path.indexOf( '/' ) );
          }

          if ( $element.length > 0 && ( !path || path == window.location.pathname ) ) {

            event.preventDefault( );

            var position = $element.offset( ).top;

            // Scroll the viewport to the destination.
            $( 'html, body' ).animate( {
              scrollTop: position
            }, speed, "swing", function( ) {
              // Setting 'tabindex' to -1 takes an element out of normal tab
              // flow but allows it to be focused via JavaScript. We only do
              // this when the animation is complete.
              $element.attr( 'tabindex', -1 ).on( 'blur focusout', function( ) {

                // When focus leaves this element, remove the tabindex attribute.
                $element.removeAttr( 'tabindex' );
              } ).focus( ); // Focus on the content container
            } );
        }
      } );
    }
  }
  Drupal.behaviors.dtagovauChosenAccessibilityFix = {
    // Fixes an accessibility issue with the Chosen library.
    attach: function( context, settings ) {
      $( 'body' )
        .on( 'chosen:ready', function( evt, params ) {
        $( '.js-form-item.js-form-type-select', context )
          .once( 'chosenAccessibilityFix' )
          .each( function( index, element ) {
          $( this )
            .find( '.chosen-container-multi input.chosen-search-input' )
            .attr( 'aria-label', $.trim( $( this ).find( 'label' ).text( ) ) );
        } );
      } );
    }
  }
  Drupal.behaviors.dtagovauSVGSwap = {
    // Swaps out SVG images for PNGs on non-supporting browsers. Taken from
    // https://css-tricks.com/a-complete-guide-to-svg-fallbacks/.
    attach: function( context, settings ) {
      function svgasimg( ) {
        return document.implementation.hasFeature(
          "http://www.w3.org/TR/SVG11/feature#Image", "1.1"
        );
      }
      if ( !svgasimg( ) ) {
        $( 'img, IMG', context )
          .once( 'svg-swapped' )
          .each( function( index, element ) {
            if ( $( this ).attr( 'src' ).match( /svgz?$/ ) ) {
              $( this )
                .attr( 'src', $( this ).attr( 'data-fallback' ) );
            }
          } );
      }
    }
  }
  Drupal.behaviors.dtagovauAutocompleteReposition = {
    // Reposition the autocomplete drop downs for better UI.
    attach: function( context, settings ) {
      if ( $( 'header .ui-autocomplete-input' ).length ) {
        $( 'header .ui-autocomplete-input' )
          .autocomplete( {
          open: function( ) {
            $( 'ul.ui-menu' ).width( $( this )[0].outerWidth );
          },
          position: {
            my: 'left top',
            at: 'left bottom',
            of: 'header .ui-autocomplete-input'
          }
        } );
      }
      if ( $( 'header.au-header--content .ui-autocomplete-input' ).length ) {
        $( 'header.au-header--content .ui-autocomplete-input' )
          .autocomplete( {
          open: function( ) {
            $( 'ul.ui-menu' ).width( $( this )[0].outerWidth );
          },
          position: {
            my: 'left top',
            at: 'left bottom',
            of: 'header .ui-autocomplete-input'
          }
        } );
      }
      if ( $( 'main .ui-autocomplete-input' ).length ) {
        $( 'main .ui-autocomplete-input' )
          .autocomplete( {
          open: function( ) {
            $( 'ul.ui-menu' ).width( $( this )[0].outerWidth );
          },
          position: {
            my: 'left top-24',
            at: 'left bottom',
            of: 'main .ui-autocomplete-input'
          }
        } );
      }
    }
  }
  Drupal.behaviors.dtagovauAccordion = {
    // Update accordions.
    attach: function( context, settings ) {
      $( function( ) {
        $( 'a#superfish-main-toggle' )
          .not( 'sf-expanded' )
          .find( 'span' )
          .html( 'Open menu' );
        $( 'a#superfish-main-toggle.sf-expanded' )
          .find( 'span' )
          .html( 'Open menu' );
        $( 'a#superfish-main-toggle' )
          .click( function( ) {
          if( $( this ).hasClass( 'sf-expanded' ) ) {
            $( this )
              .children( 'span' )
              .html( 'Close menu' );
          } else {
            $( this )
              .children( 'span' )
              .html( 'Open menu' );
          };
        } );
        $( '.js-au-accordion', context )
          .once( 'au-accordion' )
          .click( function( event ) {
            return AU.accordion.Toggle( this );
        } );
      } )

    }
  }
  Drupal.behaviors.dtaOffCanvas = {
    // Off canvas behaviour.
    attach: function( context, settings ) {
      $( '.layout-sidebar-off-canvas', context )
        .once('dtaOffCanvas')
        .addClass('processed')
        .each(function( index ) {
          $('#sidebar-toggle').on('click', function(e) {
            if (!$(this).attr('aria-expanded')) {
              $('#sidebar-toggle, #sidebar, #sidebar-close').attr('aria-expanded', false);
            } else {
              $('#sidebar-toggle, #sidebar, #sidebar-close').attr('aria-expanded', true);
            }
          });
          $('#sidebar-close').on('click', function(e) {
            if (!$(this).attr('aria-expanded')) {
              $('#sidebar-toggle, #sidebar, #sidebar-close').attr('aria-expanded', true);
            } else {
              $('#sidebar-toggle, #sidebar, #sidebar-close').attr('aria-expanded', false);
            }
          });
          $('.backdrop').on('click', function(e) {
            $('#sidebar-toggle, #sidebar, #sidebar-close').attr('aria-expanded', false);
          });
          var currentTarget = window.location.href.split('#')[1];
          if (currentTarget && currentTarget == 'sidebar') {
            $('#sidebar-toggle, #sidebar, #sidebar-close').attr('aria-expanded', true);
          }
        });
    }
  }
  Drupal.behaviors.dtaEventTracking = {
    // Track behaviours in Google Analytics
    attach: function( context, settings ) {
      var extensionList = ['.pdf','.doc','.docx','.xls','.xslx','.rtf','.mp4','.srt','.ppt','.pptx'];
      $.each(extensionList, function(index, extension) {
        $('a[href$="' + extension + '"]', context )
        .once('dtaEventTracking')
        .addClass('event-tracking')
        .click(function(e) {
          var pathName = e.currentTarget.pathname;
          var eventLabel = '';
          var eventCategory = pathName.substr(pathName.lastIndexOf('.') +1).toUpperCase();
          e.currentTarget.title ? eventLabel = e.currentTarget.title : eventLabel = decodeURI(pathName.substr(pathName.lastIndexOf('/') +1));
          ga('send', 'event', eventCategory, 'Download', eventLabel);
        });
      });
    }
  }

  Drupal.behaviors.dtaFormFix = {
    // Add the red border when people tab out of the Mailchimp 'email' field.
    attach: function( context, settings ) {
      $( 'form#mailchimp-signup-subscribe-block-sign-up-for-updates-form .empty-required', context )
        .once( 'dtaFormFix' )
        .addClass( 'processed' )
        .on( 'blur focus', function() {
          $(this).toggleClass( 'empty-required' );
        });
    }
  }
}( jQuery ) );
