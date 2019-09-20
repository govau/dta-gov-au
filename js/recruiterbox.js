(function($) {
  'use strict';

  // Original version from https://github.com/Recruiterbox/jsapi-client/blob/master/list_opening/list_opening_query_builder.js.
  var ListOpeningQueryBuilder = function(client) {
    var client_name = client;
    var tags = '';
    var city = '';
    var country = '';
    var state = '';
    var title = '';
    var description = '';
    var allows_remote = '';
    var position_type = '';
    var team = '';
    var id = '';

    return {
      withClientName: function(pclient_name) {
        client_name = pclient_name;
        return this;
      },
      withTags: function(ptags) {
        tags = ptags;
        return this;
      },
      withCity: function(pcity) {
        city = pcity;
        return this;
      },
      withCountry: function(pcountry) {
        country = pcountry;
        return this;
      },
      withState: function(pstate) {
        state = pstate;
        return this;
      },
      withTitle: function(ptitle) {
        title = ptitle;
        return this;
      },
      withDescription: function(pdescription) {
        description = pdescription;
        return this;
      },
      withAllowsRemote: function(pallows_remote) {
        allows_remote = pallows_remote;
        return this;
      },
      withPositionType: function(pposition_type) {
        position_type = pposition_type;
        return this;
      },
      withTeam: function(pteam) {
        team = pteam;
        return this;
      },
      withUrl: function(pid) {
        id = pid;
        return this;
      },
      buildParams: function() {
        return {
          client_name : client_name,
          tags : tags,
          city : city,
          country : country,
          state : state,
          title : title,
          description : description,
          allows_remote : allows_remote,
          position_type : position_type,
          team : team,
          id : id
        };
      }
    }
  }

  function sentenceCase( text ) {
    // This function takes the 'position_type' object, makes it sentence case
    // and replaces underscores with spaces.

    // Make sentence case
    var firstLetter = text.charAt(0).toUpperCase();

    // Replace underscore
    var theRest = text.substr(1).replace( /_/g, ' ' );

    return firstLetter + theRest;
  }

  function buildHTML( object ) {
    var $wrapper = $('<div class="au-current-vacancies__item"></div>');
    var $heading = $('<h3>' + object.title + '</h3>');
    var $link = $('<a href="https://ausdta.recruiterbox.com/jobs/' + object.id + '"></a>');
    var $location = $('<p>Location: ' + object.location.city + '</p>');
    var $position = (object.position_type) ? $('<li>' + sentenceCase(object.position_type) + '</li>') : "";
    var $remote = (object.allows_remote) ? $('<li>Allows remote</li>') : "";
    var $tags = ($position || $remote) ? $('<ul class="au-tags"></ul>').append($position, $remote) : "";

    var $html = $wrapper.append($link.append($heading), $location, $tags);
    return $html;
  }

  Drupal.behaviors.dtagovauRecruiterbox = {
    attach: function(context, settings) {

      // Original version from https://github.com/Recruiterbox/jsapi-client/blob/master/list_opening/list_opening.js.

      var list_opening_query_builder = new ListOpeningQueryBuilder('ausdta');
      var query_params = list_opening_query_builder.buildParams();
      var $root = $('#recruiterbox');

      $($root, context).once('dtagovauRecruiterbox').addClass('processed', 'unloaded').each(function() {
        $.ajax({
          url: 'https://jsapi.recruiterbox.com/v1/openings',
          data: query_params,
          success: function(response) {
            $root.append('<h2>Current vacancies</h2>');
            $.each(response.objects, function( index, value ) {
              $root.append(buildHTML( value ));
            });
            $root.removeClass('unloaded').addClass('loaded');
          },
          error: function() {
            $root.append('<div role="alert" class="au-page-alerts au-page-alerts--info"><p>There was an error retrieving the list of jobs. Please visit our <a href="https://ausdta.recruiterbox.com/">recruitment portal</a> for a full list.</p></div>');
          }
        });
      })
    }
  }
}(jQuery));
