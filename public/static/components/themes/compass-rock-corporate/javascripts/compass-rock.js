$(function() {

  $('.row').find('.col:first-of-type')
           .addClass('first-col')
           .end()
           .find('.col:last-of-type')
           .addClass('last-col');

  if ($('body').hasClass('web-home-template')) {
    $('.row:nth-of-type(even)').addClass('dark-row');
    $('.row:nth-of-type(2n+3)').addClass('light-row');
  }

  if ($('body').hasClass('web-page-template')) {
    $('.row:nth-of-type(odd)').addClass('dark-row');
    $('.row:nth-of-type(even)').addClass('light-row');
  }

});
