$(function() {

  $("#drop-target-nav .navigation").css({ maxHeight: $(window).height() - $("header[role=banner] .collapsable-btn").outerHeight(true) + "px" });

  if ($('body').hasClass('web-home-template')) {
    $('.row').find('.col:first-of-type')
             .addClass('first-col')
             .end()
             .find('.col:last-of-type')
             .addClass('last-col');
    $('.row:nth-of-type(even)').addClass('dark-row-home');
    $('.row:nth-of-type(2n+3)').addClass('light-row-home');
  }

  if ($('body').hasClass('web-page-template')) {
    $('.row:nth-of-type(odd)').addClass('dark-row-interior');
    $('.row:nth-of-type(even)').addClass('light-row-interior');
  }

});
