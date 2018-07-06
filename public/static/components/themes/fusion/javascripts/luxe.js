(function($) {

  var methods = {

    init: function() {
      var $this = $(this);
      if ($('#drop-target-btn > span').length > 0) {
        var wrapHeight = $this.outerHeight();
        $this.addClass('stay-put').wrap('<div class="stay-put-wrapper"></div>');
        $this.parent().css('height', wrapHeight);
      } else{
        var checkExist = setInterval(function() {
          if ($('#drop-target-nav .navigation').length) {
            var wrapHeight = $this.outerHeight();
            $this.addClass('stay-put').wrap('<div class="stay-put-wrapper"></div>');
            $this.parent().css('height', wrapHeight);
            clearInterval(checkExist);
          }
        }, 100); // check every 100ms
      }

      $(window).smartresize(function() {
        var wrapHeight = $this.outerHeight();
        $this.parent().css('height', wrapHeight);
      });
    },

    reset: function() {
      var $this = $(this);
      $this.removeClass('stay-put').unwrap();
      $this.parent().css('height', 'auto');
    }
  }

  $.fn.stayPut = function (method) {
    return this.each(function() {
      if (method) {
        methods[method].apply(this);
      }
      else if ( !method ) {
        methods.init.apply(this);
      }
      else {
        $.error('Method ' + method + ' does not exist on jQuery.stayPut');
      }
    });
  };


  // If there is a CTA and Zip search widget, add this class
  // to make them inline with each other
  if ($('body').hasClass('web-home-template')) {
    if (($(".city-state-zip-search").length > 0 && $(".locations-navigation").length > 0)
      || ($(".action-calls").length > 0 && $(".locations-navigation").length > 0)
      || ($(".city-state-zip-search").length > 0 && $(".action-calls").length > 0)) {
      $(".row").first().addClass("hero-widgets");
    }
  }

  // Add class to CTA if there is only one. For centering
  if ($('.action-calls li').length < 2) {
    $('.action-calls li').addClass('single-cta');
  }

  // This fixes a WebKit bug. The phone number widget being prepended
  // to #drop-target-btn was not displaying inline as it's suppose to
  $(window).load(function() {
    document.getElementById('drop-target-btn').style.display='none';
    document.getElementById('drop-target-btn').offsetHeight;
    document.getElementById('drop-target-btn').style.display='';
    $('.navigation-container').stayPut();
    $('.appended-phone').addClass('show-phone');
  });

}(jQuery));
