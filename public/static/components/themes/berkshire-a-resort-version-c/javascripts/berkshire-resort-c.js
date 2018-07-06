$(function() {
  var collage = $('.collage-row');

  if (collage.length > 0) {
    var widgets = collage.find('.widget'),
        tallest = 0;

    widgets.each(function() {
      if ($(this).outerHeight() > tallest) {
        tallest = $(this).outerHeight();
      }
    });

    widgets.css('height', tallest).addClass('collage-fixed');
  }
});