$ = jQuery.noConflict();

var componentGarden = {
  init: function(){
    this.highlightNearest();
    $(window).on('scroll', this.highlightNearest);
  },
  highlightNearest: function(){
    var scrollTop = $(window).scrollTop();
    var minDiff = null;
    var nearest = null;
    $('.h-g5-component').each(function(){
      var componentTop = $(this).position().top;
      var scrollDiff = Math.abs(scrollTop - componentTop);
      if (nearest === null || (scrollDiff < minDiff && componentTop < scrollTop+$(window).height())) {
        minDiff = scrollDiff;
        nearest = $(this).children('a').first().attr('name');
      }
    }).promise().done(function(){
      $('#toc li.nearest').removeClass('nearest');
      if (nearest){
        $('#toc li a[href="#'+nearest+'"]').parent('li').addClass('nearest');
      }
    });
  },
};

$(document).ready(function(){
  componentGarden.init();
});
