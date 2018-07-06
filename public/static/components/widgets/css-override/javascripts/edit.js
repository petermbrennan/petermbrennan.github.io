(function() {
  var topWindow = window.top;
  var topModal = window.top.$('#modal');

  var modalBody = $('#modal .modal-body'),
      cssOverride = modalBody.find('textarea');

  setTimeout(function() {
    cssOverride.css('height', modalBody.height() - 100);
  }, 250);

  topModal.off('transitionend').on('transitionend', function(){
    setTimeout(function() {
      cssOverride.css('height', modalBody.height() - 100);
    }, 100);
  }.bind(this));

  $(topWindow).on('resize orientationchange', function(){
    setTimeout(function() {
      cssOverride.css('height', modalBody.height() - 100);
    }, 100);
  });

}).call(this);