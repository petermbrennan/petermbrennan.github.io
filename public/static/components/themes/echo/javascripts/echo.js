// Echo theme-specific functions
var Echo = {
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

  ctaWrap: function() {
    $('.row:first-child a').wrapInner( "<span></span>");
    $('.cta-bg a').wrapInner( "<span></span>");
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
  }
}

$(function() {

  // Determine position of header
  Echo.headerPosition();
  Echo.ctaWrap();
  // Adds class to subnav for correct animation
  Echo.subnavClick();
  $(window).smartresize(function() {
    Echo.headerPosition();
  });

});