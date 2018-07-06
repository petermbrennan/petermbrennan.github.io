/*global jQuery */
/*!
* FitText.js 1.2
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){

  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})( jQuery );

function ivy_lifestyle_row2_bottom_calculation() {

  if(Modernizr.mq('all and (min-width: 1140px)')) {
    if($('body').hasClass('multiple-rows')){
      var $row3_height = 65 + $('.web-home-template .row:nth-of-type(1) .row-3').outerHeight();
      $('.web-home-template .row:nth-of-type(1) .row-2').before( "<style>@media screen and (min-width:1170px) { .web-home-template .row:nth-of-type(1) .row-2 { bottom:" + $row3_height + "px}}</style>" );
    }
  }
}


$(function() {

  if ($('.corporate-navigation').length < 1 && $('#drop-target-btn .button').length < 1) {
    $('header[role=banner]').addClass('simple-header');
  }

  if($(".web-home-template .row:nth-of-type(1) .row-2").length && $(".web-home-template .row:nth-of-type(1) .row-3").length){
    $("body").addClass('multiple-rows');
  }

  var checkExist = setInterval(function() {
    if ($('header[role=banner] .appended-phone').length) {
      if(($("#drop-target-btn .btn").length < 1)) {
        $('header[role=banner] .appended-phone').addClass('buttonless');
      }
      clearInterval(checkExist);
    }
  }, 100); // check every 100ms

  if(($("#drop-target-btn .btn").length)) {
    $('header[role=banner] .buttons').addClass('hasButton');
  } else {
    $('header[role=banner] .buttons').addClass('no-header-btn');
  }

  ivy_lifestyle_row2_bottom_calculation();

  $('.row h6').closest('.row').addClass('tagline');

  jQuery('h6').fitText(1.5, { minFontSize: '20px', maxFontSize: '45px' });

});

$(window).bind('resize orientationchange', function() {
  ivy_lifestyle_row2_bottom_calculation();
});