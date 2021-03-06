( function( $, Drupal ) {
  'use strict';

  Drupal.behaviors.dtagovauRoadmap = {
    attach: function( context, settings ) {
      var $form = $( '.au-roadmap form, form#views-exposed-form-business-roadmap-page-taxonomy-page-1' ),
          $root = $( 'div.views-element-container' ),
          currentlyCheckedIDs = [];

      $( $form, context )
        .once( 'dtagovauRoadmap' )
        .addClass( 'processed' )
        .submit( function( event ) {
          event.preventDefault( );
        } )
        .find( 'input[type="checkbox"]' )
        .change( function( event ) {

          // Decide whether the box has been checked or unchecked, and send through
          // the term ID to the relevant function.
          var termID = event.currentTarget.id.replace( /[^0-9\.]/g,'' );

          event.currentTarget.checked ? boxChecked( termID ) : boxUnchecked( termID );

          // If after a change there are no checkboxes ticked ( ie the
          // currentlyChecked array is empty ), then show all the cards.
          // Otherwise, nothing to see here...
          if ( currentlyCheckedIDs.length == 0 ) {
            $( '.au-card--roadmap' )
              .attr('aria-hidden', false)
              .fadeIn( );
          } else {
            // Now that the currentlyChecked array has been updated, we can run
            // through the elements and display them if they have one of the
            // termIDs listed in the currentlyChecked array in their dataset.
            $( '.au-card--roadmap' ).each( function ( index, element ) {

              // Store the current card as a variable.
              var $card = $( this );

              // Create a standalone array from the dataset.
              var dataset = String( $card.data( 'userJourneys' ) ).split( '|' );

              // If the checkVisibility function returns true, show the card.
              // Otherwise, hide it.

              checkVisibility( $card, dataset ) ? $card.attr('aria-hidden', false).fadeIn( ) : $card.attr('aria-hidden', true).fadeOut( );
            } );
          }
        } );

      function boxChecked( termID ) {
        // Find the currently checked item in the currentlyChecked arrays.
        if ( $.inArray( termID, currentlyCheckedIDs ) === -1 ) {
          currentlyCheckedIDs.push( termID );
        }
      }

      function boxUnchecked( termID ) {
        if ( $.inArray( termID, currentlyCheckedIDs ) !== -1 ) {
          currentlyCheckedIDs.splice( $.inArray( termID, currentlyCheckedIDs ), 1 );
        }
      }

      function checkVisibility( $card, dataset ) {
        // Set a boolean to return later. It defaults to false.
        var visible = false;

        // Iterate over the dataset and compare to the currentlyChecked
        // array.
        $.each( dataset, function( index, term ) {

          // If the term is in the currentlyChecked array, set visible to true
          // and exit the loop - once a match is found we don't need to keep
          // looking.
          if( $.inArray( term, currentlyCheckedIDs ) !== -1 ) {
            visible = true;
            return;
          }
        } );
        return visible;
      }
    }
  }
  Drupal.behaviors.dtagovauRoadmapRemoveAccordion = {
    attach: function( context, settings ) {
      // This function removes accordion classes at a certain breakpoint.
      var $form = $( '.au-roadmap form, form#views-exposed-form-business-roadmap-page-taxonomy-page-1' ),
          $accordion = $form.find( '.au-accordion' ),
          $accordionTitle = $accordion.find( '.au-accordion__title' ),
          $accordionBody = $accordion.find( '.au-accordion__body' ),
          breakpoint = 710;

      $( window, context )
        .once( 'dtagovauRoadmapRemoveAccordion' )
        .on( 'load resize', function mobileViewUpdate( ) {
          var viewportWidth = $( window ).width( );
          if ( viewportWidth > breakpoint ) {
            $accordion.hasClass( 'au-accordion' ) ? $accordion.removeClass( 'au-accordion' ) : null;
            $accordionTitle.hasClass( 'au-accordion__title' ) ? $accordionTitle.removeClass( 'au-accordion__title' ) : null;
            $accordionBody.hasClass( 'au-accordion--closed' ) ? $accordionBody.removeClass( 'au-accordion--closed' ) : null;
          } else {
            $accordion.hasClass( 'au-accordion' ) ? null : $accordion.addClass( 'au-accordion' );
            $accordionTitle.hasClass( 'au-accordion__title' ) ? null : $accordionTitle.addClass( 'au-accordion__title' );
            $accordionBody.hasClass( 'au-accordion--closed' ) ? null : $accordionBody.addClass( 'au-accordion--closed' );
          }
      } );
    }
  }
  Drupal.behaviors.dtagovauRoadmapYearSkipLinks = {
    // This function adds 'Skip to' links for each year.
    attach: function( context, settings ) {

      var $root = $( '.au-roadmap' ),
          $groups = $root.find( '.view-grouping h2' );

      function skipTo( $node, year ) {

        var nextYear = parseInt( year ) + 1,
            link = $( '<a class="au-direction-link au-direction-link--down" href="#year-' + nextYear + '">Skip to ' + nextYear + '</a>' );

        $node.next( '.skip-link-wrapper' ).append( link );
      }

      function backTo( $node, year, separate ) {

        var lastYear = parseInt( year ) - 1;

        ( separate ) ? $node.next( '.skip-link-wrapper' ).prepend(
                      '<a class="au-direction-link au-direction-link--up separator" href="#year-' + lastYear + '">Back to ' + lastYear + '</a>'
                    )
                   : $node.next( '.skip-link-wrapper' ).prepend(
                     '<a class="au-direction-link au-direction-link--up" href="#year-' + lastYear + '">Back to ' + lastYear + '</a>'
                   );

      }

      $( $groups, context )
        .once( 'dtagovauRoadmapYearSkipLinks' )
        .each( function( index, element ) {

          var $node = $( this ),
              year = $.trim( $node.text( ) ),
              separate = false,
              $wrapper = '<div class="skip-link-wrapper"></div>';

          // Each heading ( node ) needs an anchor link and a wrapper.
          $node.prepend( '<a id="year-' + year + '" name="' + year + '"></a>' );
          $node.after( $wrapper );

          if ( index == 0 ) {
            //This is the first one. We need a skip link to the next year only.

            skipTo( $node, year );

          }
          if ( index > 0 && index < $groups.length - 1 ) {
            // These are the 'middle' items and need both skip to and back to
            // links, along with a separator.

            var separate = true;

            skipTo( $node, year );
            backTo( $node, year, separate );

          }
          if ( index == $groups.length -1 ) {
            // This is the last item. It needs a 'backTo' link only.

            backTo( $node, year, separate );
          }
        } );

    }
  }
  Drupal.behaviors.dtagovauRoadmapSmoothScroll = {
    // We need to add the smooth scroll in again because Drupal by necessity
    // loads this library after the main library.
    attach: function( context, settings ) {
      $( '.skip-link-wrapper a.au-direction-link', context )
        .once( 'dtagovauRoadmapSmoothScroll' )
        .on( 'click', function( event ) {

          event.preventDefault( );

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
  Drupal.behaviors.dtagovauRoadmapTooltips = {
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

        // Turn on the wrapper ( and everything inside it ).
        $tooltip.removeClass( 'hidden' );
        $wrapper.removeClass( 'hidden' ).fadeIn( 200 );

      }

      function hideTooltip( $tooltip, $button, $wrapper, $pointer ) {
        $button.removeAttr( 'aria-expanded' );
        $wrapper.fadeOut( 200, function( ) {
          $tooltip.addClass( 'hidden' );
          $wrapper.addClass( 'hidden' );
        });
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
          .on( "click focus blur keydown", function( e ) {
            e.stopPropagation();
            if( e.type === 'click' ) {
              if( $( this ).data( 'focussed' )) {
                $( this ).data( 'focussed', false );
              } else {
                $button.attr( 'aria-expanded' ) ? hideTooltip( $tooltip, $button, $wrapper, $pointer ) : showTooltip( $tooltip, $button, $wrapper, $pointer );
              }
            } else if( e.type === 'focus' ) {
              $( this ).data( 'focussed', true );
              showTooltip( $tooltip, $button, $wrapper, $pointer );
            } else if( e.type === 'blur' ) {
              $( this ).data( 'focussed', false );
              hideTooltip( $tooltip, $button, $wrapper, $pointer );
            } else if( e.type === 'keydown' ) {
              event.keyCode == 27 ? hideTooltip( $tooltip, $button, $wrapper, $pointer ) : null;
            }
          });
      } );
    }
  }
} )( jQuery, Drupal );
