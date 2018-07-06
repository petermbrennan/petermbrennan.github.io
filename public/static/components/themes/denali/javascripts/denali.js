// Checks whether an image is loaded
$.fn.imageLoad = function(fn){
  this.load(fn);
  this.each( function() {
    if ( this.complete && this.naturalWidth !== 0 ) {
      $(this).trigger('load');
    }
  });
}


// Denali theme-specific functions
var Denali = {
  breakpoints: {
    nav: function() {
      if (Modernizr.mq("(min-width: 750px)")) {
        return true;
      }
    },

    hero: function() {
      if (Modernizr.mq("(min-width: 1110px)")) {
        return true;
      }
    },

    large: function() {
      if (Modernizr.mq("(min-width: 1600px)")) {
        return true;
      }
    }
  },

  headerPosition: function() {
    if (this.breakpoints.nav()) {
      var navHeight = $('header[role=banner] .content').outerHeight(),
          contentHeight = $('.layout').outerHeight();

      if (window.innerHeight > navHeight) {
        // fixed position
        $('header[role=banner]').removeClass('absolute-header');
        $('header[role=banner]').addClass('fixed-header');
      }

      else if (navHeight < contentHeight) {
        // absolute position
        $('header[role=banner]').removeClass('fixed-header');
        $('header[role=banner]').addClass('absolute-header');
      }

      else {
        // default floated
        $('header[role=banner]').removeClass('fixed-header');
        $('header[role=banner]').removeClass('absolute-header');
      }
    }

    else {
      $('header[role=banner]').removeClass('fixed-header');
      $('header[role=banner]').removeClass('absolute-header');
    }
  },

  subnavClick: function() {
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
    var corpHome = $('.corporate-home a');

    if (corpHome.length) {
      (corpHome).clone().addClass("btn").wrap("<span class='button corporate-home'></span>").parent().appendTo('header #drop-target-btn');
    }
  },

  gradientSupport: function() {
    if (Modernizr.testAllProps('background-image', 'linear-gradient(black, white)')) {
      $('html').addClass('cssgradients');
    }

    else {
      $('html').addClass('no-cssgradients');
    }
  },

  heroParallax: function() {
    var $fwindow = $(window),
        $body = $(document),
        $hero = $('.row:first-child'),
        $widget = $('.row:first-child .hero-widgets');

    if (this.breakpoints.hero()) {
      $fwindow.on('scroll.hero', function() {
        var scrollTop = $body.scrollTop();
        $hero.css('top', -(scrollTop - scrollTop / 1.25));
        $widget.css('margin-top', -(scrollTop - scrollTop / 1.35));
      });
    }
    else {
      $fwindow.off('scroll.hero');
      $hero.css('top', 0);
      $widget.css('margin-top', 0);
    }
  },

  heroWidgets: function() {
    // Home page hero on first stripe
    $('.web-home-template .row:first-child .column-content > div').not(':first-child').wrapAll('<div class="hero-widgets" />');

    // Any stripe using the 'hero' class
    $('.hero').not(':first-child').find('.column-content > div').wrapAll('<div class="hero-widgets" />');

    // If there is a cinemagraph widget
    // set opacity of hero widgets to 1
    if ($('.web-home-template .row:first-child, .hero').find('.cinemagraph').length > 0) {
      setTimeout(function() {
        $('.hero-widgets').css('opacity', 1);
      }, 100);
    }

    // If there is a cinemagraph widget
    // set opacity of hero widgets to 1
    if ($('.web-home-template .row:first-child, .hero').find('.cinemagraph').length > 0) {
      setTimeout(function() {
        $('.hero-widgets').css('opacity', 1);
      }, 100);
    }

    $('.web-home-template .row:first-child img, .hero img').error(function() {
      $('.hero-widgets').css('opacity', 1);
    }).imageLoad(function() {
      $(this).css('opacity', 1);
      setTimeout(function() {
        $('.hero-widgets').css('opacity', 1);
      }, 100);
    });

    $(window).resize();
  },

  verticallyCenter: function() {
    $('.photo').each(function() {
      var $this = $(this);
      if ($this.parents('.column-content').hasClass('column-one') || $this.parent().hasClass('col')) {
        $this.parents('.row').addClass('vert-align');
      }
    });
  },

  subheadings: function() {
    $('[role=main] h1 + h2').each(function() {
      $(this).prev().addClass('hgroup');
    });
  },

  gallerySlideWrapper: function() {
    $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');
  },

  moveTranslateFooter: function() {
    var translate = $('footer > #drop-target-footer.content > #google_translate_element');
    $(translate).detach();
    $('#drop-target-footer > .contact-info').append($(translate));
  },

  moveTranslateMain: function() {
    var translate_main = $('#google_translate_element');
    var prevEle = $( translate_main ).prev();
    $(translate_main).detach();
    $(prevEle).append($(translate_main));
  },

  centerContactInfo: function() {
    $('section[role=main] .contact-info.widget').parent().addClass('center-ci');
  },

  photoStripes: function() {
    $( ".column .column-one .photo.widget" ).each(function() {
      var $this = $(this);
      $this.closest(".row").addClass("photo-stripe");
    });
  }
}


$(function() {
  if ($('body').hasClass('web-home-template')) {
    // Adds hero parallax effect
    Denali.heroParallax();

    $(window).smartresize(function() {
      Denali.heroParallax();
    });
  }

  // Wraps hero widgets in container
  Denali.heroWidgets();

  // Creates corporate home button in nav
  Denali.corpHomeBtn();

  // Determine position of header
  Denali.headerPosition();

  Denali.photoStripes();

  // Adds class to subnav for correct animation
  Denali.subnavClick();

  // Gradient fallback support for IE9
  Denali.gradientSupport();

  Denali.verticallyCenter();

  Denali.subheadings();

  Denali.centerContactInfo();

  Denali.gallerySlideWrapper();

  Denali.moveTranslateFooter();

  Denali.moveTranslateMain();

  $(window).smartresize(function() {
    Denali.headerPosition();
  });

});
