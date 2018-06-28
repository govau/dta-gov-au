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
            $( 'ul.ui-menu' ).width( $( this )[0].offsetWidth - 17 );
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
            $( 'ul.ui-menu' ).width( $( this )[0].offsetWidth - 17 );
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
            $( 'ul.ui-menu' ).width( $( this )[0].offsetWidth - 17 );
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
  Drupal.behaviors.dtagovauTooltips = {
    // Functionality for tooltips.
    attach: function( context, settings ) {

      function getRems( number ) {
        var baseSize = parseInt( $( 'body' ).css( 'fontSize' ) );
        return number / baseSize + 'rem';
      }

      function showTooltip( $tooltip, $button, $wrapper, $pointer ) {
        // These calculations get the position of the button and move the
        // tooltip around.
        var buttonBottom = Math.floor( $button.position( ).top + $button.height( ) )
        var buttonCenter = Math.floor( $button.position( ).left + ( $button.width( ) / 2 ) );
        var anchorTop = getRems( buttonBottom );
        var anchorLeft = getRems( buttonCenter );

        // Set ARIA attribute on the button.
        $button.attr( 'aria-expanded', true );

        // Turn on the wrapper ( and everything inside it ).
        $tooltip.removeClass( 'hidden' );
        $wrapper.fadeIn( 100 ).removeClass( 'hidden' );

        var wrapperLeft = getRems( $wrapper.position( ).left );

        if ( ( $wrapper.offset( ).left + $wrapper.width( ) ) > $( window ).width( ) ) {
          var overflow = $wrapper.width( ) - ( $( window ).width( ) - $wrapper.offset( ).left );
          wrapperLeft = getRems( -overflow );
        }

        // Position the wrapper.
        $wrapper.css( 'top', anchorTop );
        $tooltip.css( 'left', wrapperLeft );

        // Position the pointer.
        $pointer.css( 'left', anchorLeft );
      }

      function hideTooltip( $tooltip, $button, $wrapper, $pointer ) {
        $button.removeAttr( 'aria-expanded' );
        $wrapper.fadeOut( 100, function( ) {
          $tooltip.addClass( 'hidden' );
        } ).addClass( 'hidden' );
      }

      var $buttons = $( 'button.au-tooltip--button[aria-label]' );

      $( $buttons, context )
        .once( 'dtagovauTooltips' )
        .each( function( index, element ) {
        var $button = $( this );
        var $wrapperDiv = $( '<div class="au-tooltip--inner hidden"></div>' );
        var $pointer = $( '<div class="au-tooltip--pointer"></div>' );
        var $tooltip = $( '#' + $( this ).attr( 'aria-labelledby' ) );

        $tooltip.wrap( $wrapperDiv );

        $( '.au-tooltip--inner' )
          .once( 'pointerPrepend' )
          .prepend( $pointer );

        var $wrapper = $tooltip.parent( '.au-tooltip--inner' );

        $button
          .click( function( event ) {
            event.preventDefault( );
            $button.attr( 'aria-expanded' ) ? hideTooltip( $tooltip, $button, $wrapper, $pointer ) : showTooltip( $tooltip, $button, $wrapper, $pointer );
          } )
          .hover( function( event ) {
            showTooltip( $tooltip, $button, $wrapper, $pointer );
          }, function( event ) {
            hideTooltip( $tooltip, $button, $wrapper, $pointer );
          } )
          .focus( function( ) {
            showTooltip( $tooltip, $button, $wrapper, $pointer );
          } )
          .blur( function( ) {
            hideTooltip( $tooltip, $button, $wrapper, $pointer );
          } )
          .keydown( function( event ) {
            event.keyCode == 27 ? hideTooltip( $tooltip, $button, $wrapper, $pointer ) : null;
          } );

      } );
    }
  }
}( jQuery ) );
