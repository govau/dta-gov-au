(function($, Drupal) {
  'use strict';

  var currentlyChecked = [];

  Drupal.behaviors.dtagovauRoadmap = {
    attach: function(context, settings) {
      var $form = $('form#views-exposed-form-business-roadmap-page-taxonomy-page-1'),
          $root = $('div.views-element-container');

      $($form, context)
        .once('dtagovauRoadmap')
        .addClass('processed')
        .submit(function(event) {
          event.preventDefault();
        })
        .find('input[type="checkbox"]')
        .change(function(event) {

          // Decide whether the box has been checked or unchecked, and send through
          // the term ID to the relevant function.
          var termID = event.currentTarget.id.replace(/[^0-9\.]/g,'');

          event.currentTarget.checked ? boxChecked(termID) : boxUnchecked(termID);

          // If after a change there are no checkboxes ticked (ie the
          // currentlyChecked array is empty), then show all the cards.
          // Otherwise, nothing to see here...
          if (currentlyChecked.length == 0) {
            $('.au-card--roadmap').fadeIn();
          } else {
            // Now that the currentlyChecked array has been updated, we can run
            // through the elements and display them if they have one of the
            // termIDs listed in the currentlyChecked array in their dataset.
            $('.au-card--roadmap').each(function (index, element) {

              // Store the current card as a variable.
              var $card = $(this);

              // Create a standalone array from the dataset.
              var dataset = $card.data('userJourneys').split('|');

              // If the checkVisibility function returns true, show the card.
              // Otherwise, hide it.

              console.log(checkVisibility($card, dataset));

              checkVisibility($card, dataset) ? $card.fadeIn() : $card.fadeOut();
            });
          }
        });

      function boxChecked(termID) {
        console.log('Checked ' + termID);
        // Find the currently checked item in the currentlyChecked array.

        if ($.inArray(termID, currentlyChecked) === -1) {
          currentlyChecked.push(termID);
        }
        console.log(currentlyChecked);
      }

      function boxUnchecked(termID) {
        console.log('Unchecked ' + termID);
        if ($.inArray(termID, currentlyChecked) !== -1) {
          currentlyChecked.splice($.inArray(termID, currentlyChecked), 1);
        }
        console.log(currentlyChecked);
      }

      function checkVisibility($card, dataset) {
        // Set a boolean to return later. It defaults to false.
        var visible = false;

        // Iterate over the dataset and compare to the currentlyChecked
        // array.
        $.each(dataset, function(index, term) {

          // If the term is in the currentlyChecked array, set visible to true
          // and exit the loop - once a match is found we don't need to keep
          // looking.
          if($.inArray(term, currentlyChecked) !== -1) {
            visible = true;
            return;
          }
        });
        return visible;
      }
    }
  }
  Drupal.behaviors.dtagovauRoadmapRemoveAccordion = {
    attach: function(context, settings) {
      // This function removes accordion classes at a certain breakpoint.
      var $form = $('form#views-exposed-form-business-roadmap-page-taxonomy-page-1'),
          $accordion = $form.find('.au-accordion'),
          $accordionTitle = $accordion.find('.au-accordion__title'),
          $accordionBody = $accordion.find('.au-accordion__body'),
          breakpoint = 710;

      $(window, context)
        .once('dtagovauRoadmapRemoveAccordion')
        .on('load resize', function mobileViewUpdate() {
          var viewportWidth = $(window).width();
          if (viewportWidth > breakpoint) {
            $accordion.hasClass('au-accordion') ? $accordion.removeClass('au-accordion') : null;
            $accordionTitle.hasClass('au-accordion__title') ? $accordionTitle.removeClass('au-accordion__title') : null;
            $accordionBody.hasClass('au-accordion--closed') ? $accordionBody.removeClass('au-accordion--closed') : null;
          } else {
            $accordion.hasClass('au-accordion') ? null : $accordion.addClass('au-accordion');
            $accordionTitle.hasClass('au-accordion__title') ? null : $accordionTitle.addClass('au-accordion__title');
            $accordionBody.hasClass('au-accordion--closed') ? null : $accordionBody.addClass('au-accordion--closed');
          }
      });
    }
  }
  Drupal.behaviors.dtagovauRoadmapYearSkipLinks = {
    // This function adds 'Skip to' links for each year.
    attach: function( context, settings ) {

      var $root = $('.business-roadmap'),
          $groups = $root.find('.view-grouping h2');

      function skipTo( $node, year ) {

        var nextYear = parseInt( year ) + 1;

        $node.next('.skip-link-wrapper').append( `<a class="au-direction-link au-direction-link--down" href="#year-${ nextYear }">Skip to ${ nextYear }</a>` );
      }

      function backTo( $node, year, separate ) {

        var lastYear = parseInt( year ) - 1;

        (separate) ? $node.next('.skip-link-wrapper').prepend(
                      `<a class="au-direction-link au-direction-link--up separator" href="#year-${ lastYear }">Back to ${ lastYear }</a>`
                    )
                   : $node.next('.skip-link-wrapper').prepend(
                      `<a class="au-direction-link au-direction-link--up" href="#year-${ lastYear }">Back to ${ lastYear }</a>`
                   );

      }

      $( $groups, context )
        .once( 'dtagovauRoadmapYearSkipLinks' )
        .each(function( index, element ) {

          var $node = $(this),
              year = $.trim( $node.text() ),
              separate = false,
              $wrapper = '<div class="skip-link-wrapper"></div>';

          // Each heading (node) needs an anchor link and a wrapper.
          $node.prepend( `<a id="year-${ year }" name="year-${ year }"></a>` );
          $node.after( $wrapper );

          if ( index == 0 ) {
            //This is the first one. We need a skip link to the next year only.

            skipTo( $node, year );

          }
          if ( index > 0 && index < $groups.length ) {
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
        });

    }
  }
})(jQuery, Drupal);
