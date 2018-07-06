// Checks whether an image is loaded
$.fn.imageLoad = function(fn){
  this.load(fn);
  this.each( function() {
    if ( this.complete && this.naturalWidth !== 0 ) {
      $(this).trigger('load');
    }
  });
}

// Focus theme-specific functions
var Focus = {
  breakpoints: {
    mobile: function() {
      return Modernizr.mq("(max-width: 699px)")
    }
  },

  showNav: function() {
    // If nav widget is not present, hide menu button
    if ($('header[role=banner] .navigation').length) {
      $('.collapsable-btn').fadeIn();
    }
  },

  mobileNavOn: function() {
    // Sets up fixed mobile nav
    var nav = $('.navigation-container'),
        navPos = nav.offset().top,
        wrapHeight = nav.outerHeight();

    // Wrap fixed nav in wrapper with set height
    nav.addClass('stay-put')
       .wrap('<div class="stay-put-wrapper"></div>')
       .parent()
       .css('height', wrapHeight);

    // When user scrolls to nav, make it stick to top of window
    $(window).on("scroll.mobileNav", function() {
      var scroll = $(this).scrollTop();

      if (scroll >= navPos) {
        nav.addClass('fixed');
      }
      else {
        nav.removeClass('fixed');
      }
    });
  },

  mobileNavOff: function() {
    // Tear down mobile nav
    $('.navigation-container').unwrap().removeClass('stay-put fixed');
    $(window).off("scroll.mobileNav");
  },

  hasMobileNav: function() {
    // Determine if the mobile fixed nav is set
    return $('.navigation-container').hasClass('stay-put');
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
      $('.navigation .corporate-home').prev().addClass('last-link'); // Adds class to link before corp home for css
      (corpHome).clone().addClass("btn").wrap("<span class='button corporate-home'></span>").parent().prependTo('header #drop-target-btn');
    }
  },

  heroWidgets: function() {
    // Wraps hero widgets in container

    // Home page hero on first stripe
    $('.web-home-template .row:first-child .column-content > div').not('.row-1').wrapAll('<div class="hero-widgets" />');

    // Any stripe using the 'hero' class
    $('.hero .column-content > div').not('.row-1').wrapAll('<div class="hero-widgets" />');

    setTimeout(function() {
      $('.hero-widgets').css('opacity', 1);
    }, 100);

    // $(window).resize();
  },

  internalHero: function() {
    if ($('body').hasClass('web-page-template')) {
      var hero = $('.row:first-child');

      if (!Focus.breakpoints.mobile()) {
        var headerHeight = Math.max($('header[role=banner]').outerHeight(), $('.logo-container').outerHeight());
        hero.css('padding-top', headerHeight);
      }

      else {
        hero.css('padding-top', '');
      }
    }
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
  },

  centerContactInfo: function() {
    // Adds class to center contact info widget via css
    $('section[role=main] .contact-info.widget').parent().addClass('center-ci');
  }
}


$(function() {

  Focus.showNav();

  if (Focus.breakpoints.mobile()) {
    Focus.mobileNavOn();
  }

  Focus.corpHomeBtn();

  Focus.internalHero();

  Focus.heroWidgets();

  Focus.subnavClick();

  Focus.subheadings();

  // Denali.centerContactInfo();

  Focus.gallerySlideWrapper();

  $(window).smartresize(function() {
    if (Focus.breakpoints.mobile() && !Focus.hasMobileNav()) {
      Focus.mobileNavOn();
    }
    else if (Focus.hasMobileNav()) {
      Focus.mobileNavOff();
    }

    Focus.internalHero();
  });

});