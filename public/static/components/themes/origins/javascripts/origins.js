// Checks whether an image is loaded
if ( !$.isFunction($.fn.imageLoad) ) {
  $.fn.imageLoad = function(fn){
    this.load(fn);
    this.each( function() {
      if ( this.complete && this.naturalWidth !== 0 ) {
        $(this).trigger('load');
      }
    });
  }
}

if ( !$.isFunction($.fn.stayPut) ) {
  $.fn.stayPut = function (method) {
    return this.each(function() {
      var $this = $(this);
      var wrapHeight = $this.outerHeight();
      $this.addClass('stay-put').wrap('<div class="stay-put-wrapper"></div>');
      $this.parent().css('height', wrapHeight);

      $(window).smartresize(function() {
        var wrapHeight = $this.outerHeight();
        $this.parent().css('height', wrapHeight);
      });
    });
  };
}

// Origins theme-specific functions
var Origins = {
  init: function() {
    Origins.hideHeader();

    if (Origins.hasNavigation()) {
      Origins.corpHomeBtn();
      Origins.subnavClick();
    }

    $('.navigation-container').stayPut();
    Origins.heroWidgets();
    Origins.subheadings();
    Origins.gallerySlideWrapper();
  },

  breakpoints: {
    mobile: function() {
      return Modernizr.mq("(max-width: 699px)")
    }
  },

  hasNavigation: function() {
    return $('#drop-target-nav [class*=navigation]').length > 0;
  },

  hideHeader: function() {
    // If nav widget and header button are not present, hide menu button
    if ($('#drop-target-nav [class*=navigation]').length <= 0 && $('#drop-target-btn .button').length <= 0 && $('header .appended-phone').length <= 0) {
      $('.collapsable-btn').hide();
      $('header[role=banner]').addClass('hide-header');
    }
  },

  subnavClick: function() {
    // Adds class to subnav for correct animation
    $('.has-subnav > a').on('click', function() {
      var $this = $(this);
      if ($this.parent().hasClass('subnav-open')) {
        $this.removeClass('arrow-closed');
      }
      else {
        $this.addClass('arrow-closed');
      }
    });
  },

  corpHomeBtn: function() {
    // Creates corporate home button in nav
    // Taken from corp home link inside the navigation
    var corpHome = $('.corporate-home a');

    if (corpHome.length) {
      $('.corporate-navigation').remove();
      $('.navigation .corporate-home').prev().addClass('last-link'); // Adds class to link before corp home for css
      (corpHome).clone()
                .addClass("btn")
                .wrap("<span class='button corporate-home'></span>")
                .parent()
                .prependTo('header #drop-target-btn');
    }
  },

  heroWidgets: function() {
    // Wraps hero widgets in container

    // Home page hero on first stripe
    $('.web-home-template .row:first-child .column-content > div').not('.row-1').wrapAll('<div class="hero-widgets" />');

    // Any stripe using the 'hero' class
    $('.hero .column-content > div').not('.row-1').wrapAll('<div class="hero-widgets" />');
  },

  subheadings: function() {
    // Adds a wrapper around h1 & h2s when they are used together
    $('.html h1 + h2').each(function() {
      $(this).prev().andSelf().wrapAll('<div class="hgroup" />');
    });
  },

  gallerySlideWrapper: function() {
    // Adds wrapper around photo for better caption positioning via css
    $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');
  }
}


$(function() {

  Origins.init();

});
