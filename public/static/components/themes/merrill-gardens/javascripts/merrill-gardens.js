// Checks whether an image is loaded
$.fn.imageLoad = function(fn){
  this.load(fn);
  this.each( function() {
    if ( this.complete && this.naturalWidth !== 0 ) {
      $(this).trigger('load');
    }
  });
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

// Focus theme-specific functions
var MG = {
  body: $('body'),

  breakpoints: {
    mobile: function() {
      return Modernizr.mq("(max-width: 699px)")
    },

    locationLayout: function() {
      return Modernizr.mq("(min-width: 1000px)")
    }
  },

  siteType: {
    location: function() {
      return MG.body.hasClass('site-location');
    },
    corporate: function() {
      return MG.body.hasClass('site-corporate');
    },
    corporateHome: function() {
      return MG.body.hasClass('site-corporate') && MG.body.hasClass('web-home-template');
    }
  },

  navPosition: function() {
    var sidebar = $('.sidebar-wrapper');

    if (this.breakpoints.locationLayout()) {
      var navHeight = $('.header-wrapper').outerHeight(),
          sidebarHeight = sidebar.height(),
          contentHeight = navHeight + sidebarHeight;

      if (window.innerHeight >= contentHeight) {
        sidebar.addClass('fixed-sidebar');
      }
      else {
        sidebar.removeClass('fixed-sidebar');
      }
    }
    else {
      sidebar.removeClass('fixed-sidebar');
    }
  },

  showNav: function() {
    // If nav widget is not present, hide menu button
    if ($('header[role=banner] .navigation').length) {
      $('.collapsable-btn').fadeIn();
    }
  },

  corpMenu: function() {
    var corpHome = $('.corporate-home a').clone().html('Merrill Gardens Home').addClass("corporate-home-link");

    if (corpHome.length > 0) {
      $('#drop-target-btn').prepend(corpHome);
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

  corpHero: function() {
    var hero = $('.row:first-child');

    hero.find('.col').each(function() {
      $(this).find('.column-content > div').not('.row-1').wrapAll('<div class="hero-widgets" />');
    });
  },

  iframeVideos: function() {
    var $vimeoVideo = $('[class*="blog-feed"] iframe[src*="player.vimeo.com"]');
    var $youtubeVideo = $('[class*="blog-feed"] iframe[src*="youtube.com"]');
    if($vimeoVideo.length) {
      $vimeoVideo.each(function() {
        var $this = $(this);
        $this.removeAttr("style");
        $this.wrap("<div class=\" video-wrapper \"></div>");
      })
    }
    if($youtubeVideo.length) {
      $youtubeVideo.each(function() {
        var $this = $(this);
        $this.removeAttr("height");
        $this.removeAttr("width");
        $this.wrap("<div class=\" video-wrapper \"></div>");
      })
    }
  },

  heroWidgets: function() {
    // Any stripe using the 'hero' class
    // Wraps hero widgets in container
    $('.row[class*=hero]').each(function() {
      $(this).find('.column-content > div').not('.row-1').wrapAll('<div class="hero-widgets" />');
    })
  },

  gallerySlideWrapper: function() {
    // Adds wrapper around photo for better caption positioning via css
    $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');
  },

  locationHome: function() {
    if (MG.body.hasClass('web-home-template')) {
      // move sidebar above main content
      // on mobile, move address above html block in sidebar
      $('.sidebar-wrapper').prependTo('.site-wrapper');

    }
  }
}


$(function() {
  $('.header-wrapper').stayPut();

  MG.showNav();

  if (MG.siteType.location()) {
    MG.locationHome();
    MG.corpMenu();

    $(window).on('typekitReady', function(){
      MG.navPosition();
    });
    if (Typekit.isReady){
      MG.navPosition();
    }

    $(window).smartresize(function() {
      MG.navPosition();
    });
  }

  if (MG.siteType.corporateHome()) {
    MG.corpHero();
  };

  MG.heroWidgets();
  MG.iframeVideos();

  MG.subnavClick();
  MG.gallerySlideWrapper();
});
