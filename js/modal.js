( function( $ ) {
  'use strict';

    Drupal.behaviors.dta_gov_au_modal = {
      attach: function( context, settings ) {
        const SPEED = 200;
        const FOCUSABLE_SELECTORS = $('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]');
        function openModal() {
          //Show the modal
          $( '.modal-box, .modal-overlay' )
            .css( 'display', 'block' )
            .animate( { opacity: 1 }, SPEED );

          // Focus the first element
          $( '.modal-body' )
            .find( FOCUSABLE_SELECTORS )
            .first()
            .focus()
            .attr('autofocus', 'true');

          //Trap tab focus
          var focusableElements = $( 'body' ).find( FOCUSABLE_SELECTORS );

          $( focusableElements ).each(function( index ) {
            $( this ).attr('tabindex', '-1');
          });
          focusableElements = $( '.modal-box' ).find(FOCUSABLE_SELECTORS);
          $(focusableElements).each(function( index ) {
            $( this ).attr('tabindex', index + 1 );
          });

          // Trap screen reader focus
          $( '.modal-box' ).attr( 'aria-hidden', false );
          $( 'body' ).attr( 'aria-hidden', true) ;
        }
        function closeModal() {
          console.log ('Close modal' );
          // Hide the modal
          $( '.modal-box, .modal-overlay' ).animate( { opacity: 0 }, SPEED, function() {
            $(this).css( 'display', 'none' );
          });

          //Untrap the tab focus
          $( 'body' ).find( FOCUSABLE_SELECTORS )
            .each(function( index ) {
              $( this ).removeAttr( 'tabindex' );
            });
          $( '.modal-box' ).find(FOCUSABLE_SELECTORS)
            .each(function( index ) {
              $( this ).attr('tabindex', '-1' );
            });

          // Untrap screen reader focus
          $( '.modal-box' ).attr( 'aria-hidden', true );
          $( 'body' ).attr( 'aria-hidden', false );

          // restore focus to the triggering element
          $( '.modal-controls__open button' ).focus();
        }
        $( '.modal-wrapper', context )
          .once( 'behaviors' )
          .toggleClass( 'no-js js' );
        $( '.modal-controls__open button' ).on( 'click', openModal );
        $( '.modal-controls__close button, .modal-overlay' ).on( 'click', closeModal );
        $( document ).keydown( function( evt ) {
          if ( evt.keyCode == 27 ) {
            closeModal();
          }
        });
      }
    }
  }( jQuery ) );
