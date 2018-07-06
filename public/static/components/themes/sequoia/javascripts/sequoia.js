// Checks whether an image is loaded
$.fn.imageLoad = function(fn){
  this.load(fn);
  this.each( function() {
    if ( this.complete && this.naturalWidth !== 0 ) {
      $(this).trigger('load');
    }
  });
}


// sequoia theme-specific functions
var sequoia = {
  breakpoints: {
    hero: function() {
      if (Modernizr.mq("(min-width: 980px)")) {
        return true;
      }
    }
  },

  init: function() {
    if (!$('.site-corporate .row:first-child').hasClass('text-light')) {
      $('.collapsable-btn').addClass('dark');
    }

    $('.collapsable-btn').css('opacity', 1);
  },

  menuClick: function() {
    $('.collapsable-btn').on('click', function() {
      $('.navigation-container').toggleClass('menu-open');
    });
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
        $hero = $('.row:first-child .cinemagraph').length ? $('.row:first-child .cinemagraph') : $('.row:first-child .photo'),
        $caption = $hero.find('figcaption'),
        $widget = $('.row:first-child .hero-widgets');

    if (this.breakpoints.hero()) {
      $fwindow.on('scroll', function() {
        var scrollTop = $body.scrollTop();
        $hero.css('top', (scrollTop - scrollTop / 1.95));
        // $widget.css('margin-top', -(scrollTop - scrollTop / 1));
        // $caption.css('margin-top', -(scrollTop - scrollTop / 1));
      });
    }
    else {
      $fwindow.off('scroll');
      $hero.css('top', 0);
      $widget.css('margin-top', 0);
      $caption.css('margin-top', 0);
    }
  },

  heroWidgets: function() {
    // Home page hero on first stripe
    $('.row:first-child .column-content > div').not(':first-child').wrapAll('<div class="hero-widgets"></div>');

    // Any stripe using the 'hero' class
    $('.hero .column-content > div').not(':first-child').wrapAll('<div class="hero-widgets"></div>');

    var $logo = $('.logo-container'),
        $heroWidgets = $('.hero-widgets');

    // If there is a cinemagraph widget
    // set opacity of hero widgets to 1
    if ($('.row:first-child, .hero').find('.cinemagraph').length > 0) {
      setTimeout(function() {
        $heroWidgets.css('opacity', 1);
        $logo.css('opacity', 1);
      }, 100);
    }

    $('.row:first-child img, .hero img').error(function() {
      $heroWidgets.css('opacity', 1);
      $logo.css('opacity', 1);
    }).imageLoad(function() {
      $(this).css('opacity', 1);
      setTimeout(function() {
        $heroWidgets.css('opacity', 1);
        $logo.css('opacity', 1);
      }, 100);
    });

    $(window).resize();
  },

  subheadings: function() {
    $('[role=main] h1 + h2').each(function() {
      $(this).addClass('hgroup');
    });
  },

  gallerySlideWrapper: function() {
    $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');
  },

  centerContactInfo: function() {
    $('section[role=main] .contact-info.widget').parent().addClass('center-ci');
  },

  miniHeroes: function() {
    $('.mini-heroes .column-content').each(function() {
      $(this).find('> div').not(':first-child').wrapAll('<div class="mini-hero-widgets"></div>');
    });
  },

  moveHours: function() {
    $('.row').each(function(i) {
      var $this = $(this);

      if ($this.find('.contact-info').length && $this.find('.hours').length) {
        var $adr = $this.find('.contact-info .h-adr');
        $this.find('.hours').insertAfter($adr).addClass('appended-hours').removeClass('widget');
      }
    });
  },

  mosaicLinks: function() {
    $('.mosaic-collage').each(function() {
      var $this = $(this),
          $mosaicLink = $this.find('figure a'),
          linkHref = $mosaicLink.attr('href');

      $mosaicLink.closest('.column-content').find('.html').wrap('<a href="' + linkHref + '"></a>');
    });
  }
}


$(function() {
  sequoia.init();

  sequoia.heroParallax();

  $(window).smartresize(function() {
    sequoia.heroParallax();
  });

  sequoia.menuClick();

  // Wraps hero widgets in container
  sequoia.heroWidgets();

  sequoia.miniHeroes();

  // Adds class to subnav for correct animation
  sequoia.subnavClick();

  // sequoia.verticallyCenter();

  sequoia.subheadings();

  // sequoia.centerContactInfo();

  sequoia.gallerySlideWrapper();

  sequoia.moveHours();

  sequoia.mosaicLinks();

  // Gradient fallback support for IE9
  sequoia.gradientSupport();
});
