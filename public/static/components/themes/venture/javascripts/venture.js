// ********************************************
//
//  Venture Blueprint Theme
//
//  JS by Adam Sworob
//
// ********************************************

/*------------------------------------------------------------------

[Table of contents]

1. Variables
2. Body Classes
3. Corporate Home Navigation Item
4. Hero Cinemagraph
5. Header Phone Number
6. Nav Sliding Functionality
7. Photo / Cinemagraph Functionality
8. Contact Info Widget
9. Buttons
10. Directions Widget
11. Gallery Widget
12. Header Background Color
13. Hamburger Menu Hide
14. Add G5 Corporate Class


-------------------------------------------------------------------*/

var venture = {

  initialize: function() {

    // 1. Variables
    this.variables();

    // 2. Body Classes
    this.heroInitialize();
    this.heroEvents();

    // 3. Corporate Home Navigation Item
    this.corporateHomeNavigationItem();

    // 4. Hero Cinemagraph
    this.heroCinemagraph();

    // 5. Header Phone Number
    this.headerPhoneNumber();

    // 7. Photo / Cinemagraph Functionality
    this.photoAndCinemagraphFunctionality();

    // 8. Contact Info Widget
    this.contactInfoWidget();

    // 9. Button Spacing
    this.buttons();

    // 10. Directions Widget
    this.directionsWidget();

    // 11. Gallery Widget
    this.galleryWidget();

    // 12. Header Background Color
    this.headerBackgroundColor();

    // 13. Hamburger Menu Hide
    this.hamburgerMenuShow();
    this.hamburgerMenuHide();
    this.keepMenuVisible();

    // 14. Add G5 Corporate Class
    this.g5CorporateClass();

  },

  onScroll: function() {
    this.keepMenuVisible();
  },

  /*------------------------------------------------------------------
  [ 1. Variables ]
  */

  variables: function() {

    this.body = $("body");
    this.header = $("[role=banner]");
    this.roleMain = $("[role=main]");
    this.mainRow = $(".row");
    this.row1 = $(".row:first-of-type");

    // Cinemagraph
    this.cinemagraph = $(".cinemagraph.widget");

    // Hero CTAs
    this.switchCTAInterval = 5000;
    this.minMsmall = '575px';
    this.minPhone = '768px';
    this.maxHero = '899px';
    this.minHero = '900px';
    this.showCTA = 'show-CTA';

    // Menu Button
    this.menuButton = $("a.collapsable-btn");

    // Navigation
    this.navigation = $("#drop-target-nav");
    this.navigationLocation = this.navigation.find(".navigation");

    // 6. Nav Sliding Functionality
    this.menuButton.click(function() {
      this.toggleMask();
    }.bind(this));

    // 10. Directions Widget
    $('.directions.widget .directions-submit').click(function(e) {
      this.directionsSubmitClick(e);
    }.bind(this));

    // 13. Hamburger Menu Hide
    this.idleTimer = null;
    this.idleState = false;
    this.idleWait = 8000;

  },

  /*------------------------------------------------------------------
  [ 2. Hero ]
  */

  heroInitialize: function() {

    if(this.body.hasClass("web-home-template")) {

      if( !this.row1.hasClass("hero") ) {
        this.row1.addClass("hero");
      }

      this.hero = $(".hero");
      this.heroRow2ActionCalls = this.hero.find(".row-2 .action-calls");
      this.heroRow3 = this.hero.find(".row-3");
      this.heroRow4 = this.hero.find(".row-4");

      if( this.heroRow2ActionCalls.find("li").length > 1) {
        this.body.addClass("hero-other-widget");
      } else if( this.heroRow2ActionCalls.length && !this.heroRow3.length) {
        this.body.addClass("hero-ctas");
      } else if( this.heroRow2ActionCalls.length && this.heroRow3.find(".action-calls").length && !this.heroRow4.length) {
        this.body.addClass("hero-ctas");
      } else if( this.heroRow2ActionCalls.length && this.heroRow3.find(".action-calls").length && this.heroRow4.find(".action-calls").length ) {
        this.body.addClass("hero-ctas");
      } else if (this.hero.find('.gallery-basic')){
        this.body.addClass("hero-gallery hero-other-widget");
      } else {
        this.body.addClass("hero-other-widget");
      }

      this.heroCTAsHero = $(".hero-ctas .hero");
      this.firstCTA = this.heroCTAsHero.find(".row-2");
      this.secondCTA = this.heroCTAsHero.find(".row-3");
      this.thirdCTA = this.heroCTAsHero.find(".row-4");

      // Add Carousel Arrows, Show First CTA to Start, and Add timed-show Class, if there is multiple CTAs
      if(this.secondCTA.length) {
        this.hero.prepend("<div class=\"left-arrow\"><div></div></div>");
        this.hero.append("<div class=\"right-arrow\"><div></div></div>");
        this.hero.addClass("timed-show");
      }

      // Arrow Variables
      this.bothArrows = $(".hero .left-arrow, .hero .right-arrow"),
      this.rightArrow = $(".hero .right-arrow"),
      this.leftArrow = $(".hero .left-arrow");

      // Classes depending on the amount of Call Outs
      if(this.firstCTA.length && !this.secondCTA.length) {
        this.hero.addClass("one-CTA");
      }
      if(this.secondCTA.length && !this.thirdCTA.length) {
        this.hero.addClass("two-CTAs");
      }
      if(this.thirdCTA.length) {
        this.hero.addClass("three-CTAs");
      }

      // First CTA always has overlay, unless hovering over other CTAs (Desktop Specific)
      this.firstCTA.find("a").addClass("overlay");

      // Multiple Hero Widgets
      this.heroOtherCTAs = $(".hero-other-widget .hero");
      for (var i = 3; i <= 6; i++) {
        this.otherRow = this.heroOtherCTAs.find(".row-"+i);
        if (this.otherRow.length) {
          $(this.heroOtherCTAs.find(".row-2")).append(this.otherRow);
        }
      }

      // Inner wrap anchor tags with div/span tags, move CTA heading into anchor, show everything once fully loaded
      this.heroCTAsHero.find(".action-calls a").wrapInner("<div><span></span></div>");
      this.heroCTAsHero.find(".action-calls").each(function() {
        var $this = $(this);
        $this.find("li:first-of-type div").prepend($this.find(".cta-heading"));
      });
      this.firstCTA.addClass("show show-CTA");
      this.secondCTA.addClass("show");
      this.thirdCTA.addClass("show");

      this.touchHeroCTAs = $(".touchevents .hero-ctas .hero");
      this.noTouchHeroCTAs = $(".no-touchevents .hero-ctas .hero");
      this.firstCTAAnchor = this.firstCTA.find(".action-calls a");

      // Fix Custom CTA Style Settings
      this.heroCTAsHero.find(".action-calls").each(function() {
        var $this = $(this);
        this.ctaCustomStyles = $this.find("style");
        this.ctaCustomStylesText = this.ctaCustomStyles.text();
        this.ctaCustomStylesSource = $this.find("a");
        this.ctaCustomStylesApply = $this.find("span");
        if(this.ctaCustomStylesText.includes("background-color")) {
          this.ctaCustomBackgroundColor = this.ctaCustomStylesSource.css("background-color");
          this.ctaCustomStylesApply.css("background-color", this.ctaCustomBackgroundColor);
        }
        if(this.ctaCustomStylesText.includes("border-color")) {
          this.ctaCustomBorderColor = this.ctaCustomStylesSource.css("border-color");
          this.ctaCustomStylesApply.css("border-color", this.ctaCustomBorderColor);
        }
        if(this.ctaCustomStylesText.includes(" color")) {
          this.ctaCustomColor = this.ctaCustomStylesSource.css("color");
          this.ctaCustomStylesApply.css("color", this.ctaCustomColor);
        }
        this.ctaCustomStyles.remove();
      });

    }

  },

  // Remove and Add show-CTA Class
  removeAddShowCTA: function(thisCTA, thatCTA) {
    thisCTA.removeClass(this.showCTA);
    thatCTA.addClass(this.showCTA);
  },

  switchTwoCTAs: function() {
    if( Modernizr.mq('(max-width: ' + this.maxHero + ')') && this.hero.hasClass("two-CTAs") ) {
      if(this.firstCTA.hasClass(this.showCTA)) {
        this.removeAddShowCTA(this.firstCTA, this.secondCTA);
      } else if (this.secondCTA.hasClass(this.showCTA)) {
        this.removeAddShowCTA(this.secondCTA, this.firstCTA);
      } else {

      }
    }
  },

  switchThreeCTAs: function() {
    if(Modernizr.mq('(max-width: ' + this.maxHero + ')') && this.hero.hasClass("three-CTAs") ) {
      if(this.firstCTA.hasClass(this.showCTA)) {
        this.removeAddShowCTA(this.firstCTA, this.secondCTA);
      } else if (this.secondCTA.hasClass(this.showCTA)) {
        this.removeAddShowCTA(this.secondCTA, this.thirdCTA);
      } else if (this.thirdCTA.hasClass(this.showCTA)) {
        this.removeAddShowCTA(this.thirdCTA, this.firstCTA);
      }
      else{

      }
    }
  },

  bothArrowsClick: function() {

    // Once an Arrow is Clicked, Stop Automatic Rotation
    if(this.hero.hasClass("timed-show")) {
      this.hero.removeClass("timed-show");
    }

    // Carousel Arrows for Two CTAs
    if( this.hero.hasClass("two-CTAs") ) {
      this.switchTwoCTAs();
    }

  },

  // Carousel Arrows for Three CTAs
  leftArrowClick: function() {
    if(Modernizr.mq('(max-width: ' + this.maxHero + ')') && this.hero.hasClass("three-CTAs") ) {
      if(this.firstCTA.hasClass(this.showCTA)) {
        this.removeAddShowCTA(this.firstCTA, this.thirdCTA);
      } else if (this.secondCTA.hasClass(this.showCTA)) {
        this.removeAddShowCTA(this.secondCTA, this.firstCTA);
      } else if (this.thirdCTA.hasClass(this.showCTA)) {
        this.removeAddShowCTA(this.thirdCTA, this.secondCTA);
      }
      else{}
    }
  },

  // Carousel Arrows for Two CTAs
  twoCTAsTimedSwitch: function() {
    if( this.hero.hasClass("two-CTAs") ) {
      this.twoTimeSwitch = function(){
        if( this.hero.hasClass("timed-show") ) {
          this.switchTwoCTAs();
        }
      }.bind(this);
      setInterval(this.twoTimeSwitch, this.switchCTAInterval);
    }
  },

  // Carousel Arrows for Three CTAs
  threeCTAsTimedSwitch: function() {
    if(this.hero.hasClass("three-CTAs")) {
      this.threeTimeSwitch = function(e){
        if( this.hero.hasClass("timed-show") ) {
          this.switchThreeCTAs();
        }
      }.bind(this);
      setInterval(this.threeTimeSwitch, this.switchCTAInterval);
    }
  },

  // First CTA always has overlay, unless hovering over other CTAs (Desktop Specific)
  overlayEvents1: function() {
    if( this.firstCTAAnchor.hasClass("overlay") ) {
      this.firstCTAAnchor.removeClass("overlay");
    }
  },
  overlayEvents2: function() {
    if( !this.firstCTAAnchor.hasClass("overlay") ) {
      this.firstCTAAnchor.addClass("overlay");
    }
  },
  overlayEvents3: function(e) {
    var $this = $(e.currentTarget);
    if( !$this.hasClass("overlay") ) {
      $this.addClass("overlay");
    }
  },
  overlayEvents4: function(e) {
    var $this = $(e.currentTarget);
    if( !$this.children().hasClass("overlay") ) {
      this.touchHeroCTAs.find(".action-calls a").removeClass("overlay");
      $this.children().addClass("overlay");
    }
  },

  heroEvents: function() {

    if(this.body.hasClass("web-home-template")) {

      this.twoCTAsTimedSwitch();

      this.threeCTAsTimedSwitch();

      this.bothArrows.click(function() {
        this.bothArrowsClick();
      }.bind(this));

      this.rightArrow.click(function(){
        this.switchThreeCTAs();
      }.bind(this));

      this.leftArrow.click(function() {
        this.leftArrowClick();
      }.bind(this));

      // First CTA always has overlay, unless hovering over other CTAs (Desktop Specific)
      this.noTouchHeroCTAs.find(".action-calls a").hover(
        function() {
          this.overlayEvents1();
        }.bind(this), function() {
          this.overlayEvents2();
        }.bind(this)
      );
      this.noTouchHeroCTAs.find(".row-2 .action-calls a").hover(
        function(e) {
          this.overlayEvents3(e);
        }.bind(this), function() {}
      );
      this.touchHeroCTAs.find(".action-calls li").on('click touch', function (e) {
        this.overlayEvents4(e);
      }.bind(this));

    }

  },

  /*------------------------------------------------------------------
  [ 3. Corporate Home Navigation Item ]
  */

  corporateHomeNavigationItem: function() {
    if($(".site-location #drop-target-nav li.corporate-home").length) {
      $("#drop-target-btn").prepend($("li.corporate-home a").clone().addClass("button corporate-home"));
    }
  },

  /*------------------------------------------------------------------
  [ 4. Hero Cinemagraph ]
  */

  heroCinemagraph: function() {

    if(this.cinemagraph.hasClass("cinemagraph-absolute")) {
      this.cinemagraph.removeClass("cinemagraph-absolute").addClass("cinemagraph-normal");
    }

    if(this.cinemagraph.hasClass("cinemagraph-full-width")) {
      this.cinemagraph.removeClass("cinemagraph-full-width");
    }

  },

  /*------------------------------------------------------------------
  [ 5. Header Phone Number ]
  */

  headerPhoneNumber: function() {
    if(this.header.find(".appended-phone.number").length) {
      if( Modernizr.mq('(min-width: ' + this.minPhone + ')') ) {
        this.header.find(".appended-phone").removeAttr("href");
      }
      this.navigation.prepend(this.header.find(".phone-widget-wrapper .number").clone());
    }
  },


  /*------------------------------------------------------------------
  [ 6. Nav Sliding Functionality ]
  */

  toggleMask: function() {
    this.body.toggleClass("all-is-hidden");
    $("#to-be-pushed").toggleClass("push-left");
    this.navigation.toggleClass("show");
  },


  /*------------------------------------------------------------------
  [ 7. Photo / Cinemagraph Functionality ]
  */

  photoAndCinemagraphFunctionality: function() {

    $( ".photo.photo-block.widget" ).each(function() {
      var $this = $(this);
      if ($this.parents('.column-content').hasClass('column-one') || $this.parent().hasClass('col')) {
        $this.parents(".col").addClass("photoBlockCol");
        $this.parents(".row").addClass("vert-align");
      }
    });

    this.cinemagraph.each(function() {
      var $this = $(this);
      if ($this.parents('.column-content').hasClass('column-one') || $this.parent().hasClass('col')) {
        $this.parents(".col").addClass("photoBlockCol");
        $this.parents(".row").addClass("vert-align");
      }
    });

    $( ".removePhotoBlockCol" ).each(function() {
      var $this = $(this);
      $this.find(".photoBlockCol").removeClass("photoBlockCol");
    });

    $( ".normal-photo" ).each(function() {
      var $this = $(this);
      $this.closest(".photoBlockCol").removeClass("photoBlockCol");
    });

  },

  /*------------------------------------------------------------------
  [ 8. Contact Info Widget ]
  */

  contactInfoWidget: function() {

    // remove old microformat classes after testing
    this.roleMain.find('.contact-info.h-card, .contact-info.h-c-ret').each(function() {

      var $this = $(this);

      if( $this.children().hasClass("phone") && $this.children().hasClass("adr-ret") ) {
        $this.children(".phone").before($this.children(".adr-ret"));
      }

      // remove this after microformat testing
      if( $this.children().hasClass("phone") && $this.children().hasClass("adr") ) {
        $this.children(".phone").before($this.children(".adr"));
      }

      if( $this.children().hasClass("phone") && $this.children().hasClass("email") ) {
        $this.addClass("phone-and-email");
      }

      if( $this.children().hasClass("social-links") ) {
        $this.addClass("has-social-links");
        $this.after($this.children(".social-links").addClass("widget"));
      }

      $this.addClass("show");

    });

  },


  /*------------------------------------------------------------------
  [ 9. Button Spacing ]
  */

  buttons: function() {

    $('.button.widget').each(function() {

      var $this = $(this);
      this.buttonColor = $this.find(".btn").css("background-color");
      this.secondaryColor = $("#secondaryColor").css("background-color");

      if( this.buttonColor !== this.secondaryColor && this.buttonColor !== undefined) {
        this.buttonColorWithOpacity = this.buttonColor.replace(')', ', 0.5)').replace('rgb', 'rgba');
        $this.find("a").css( "border-left-color", this.buttonColorWithOpacity);
        if($this.find("a").css( "border-left-color").indexOf("rgb(") >= 0) {
          this.buttonColorImportant = $this.find("a").css( "border-left-color").replace(')', ', 0.5)').replace('rgb', 'rgba');
          $this.find("a").attr('style', 'border-left-color: ' + this.buttonColorImportant + ' !important')
        }
        $this.addClass("button-color-override");
      }

      if( $this.parent().next().children().hasClass("button") ) {

        $this.addClass("less-margin-bottom");

      }

    });
  },

  /*------------------------------------------------------------------
  [ 10. Directions Widget ]
  */

  directionsWidget: function() {
    this.roleMain.find('.directions.widget .text').each(function(){
      var $this = $(this);
      $this.children(".directions-submit").before($this.children(".directions-start"));
    });
  },

  directionsSubmitClick: function(e) {
    var target = $(e.currentTarget).parent().siblings(".canvas");
    $('html, body').animate({
      scrollTop: target.offset().top
    }, 1000);
  },

  /*------------------------------------------------------------------
  [ 11. Gallery Widget ]
  */

  galleryWidget: function() {

    $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');

  },


  /*------------------------------------------------------------------
  [ 12. Header Background Color ]
  */

  headerBackgroundColor: function() {

    if(this.body.hasClass("web-page-template")) {
      this.header.css("background-color", this.row1.css('background-color'));
    } else{
      if(!this.body.hasClass("area")) {
        this.header.css("background-color", this.hero.css('background-color'));
      }
    }

  },

  /*------------------------------------------------------------------
  [ 13. Hamburger Menu Hide ]
  */

  hamburgerMenuShow: function() {

    if(this.navigationLocation.length) {
      this.menuButton.addClass("navigation-present");
    } else{
      this.menuButton.addClass("navigation-absent");
    }

  },

  hamburgerMenuHide: function() {

    $(document).ready(function () {

      this.body.on('mousemove keydown scroll', function () {

        clearTimeout(this.idleTimer);

        if (this.idleState == true) {

          // Reactivated event
          this.menuButton.removeClass("idle");
        }

        this.idleState = false;

        this.idleTimer = setTimeout(function () {

        // Idle Event
        this.menuButton.addClass("idle");

        this.idleState = true; }.bind(this), this.idleWait);

      }.bind(this));

      this.body.trigger("mousemove keydown scroll");

    }.bind(this));

  },

  keepMenuVisible: function() {
    if(this.mainRow !== undefined) {
      this.documentScrollTop = $(document).scrollTop();
      this.row2 = this.mainRow.get(1);
      if (this.row2){
        this.row2Offset = $(this.row2).offset().top;
        if(this.documentScrollTop < this.row2Offset) {
          this.menuButton.addClass("not-idle");
        } else{
          this.menuButton.removeClass("not-idle");
        }
      }
    }
  },

  /*------------------------------------------------------------------
  [ 14. Add G5 Corporate Class ]
  */

  g5CorporateClass: function() {

    $("head link").each(function(index, value) {

      var $this = $(value);

      if($this.attr('rel') == 'canonical' && $this.attr('href').indexOf("www.getg5.com/") >= 0) {
        this.body.addClass("g5-corporate-website");
      }

    }.bind(this));

  }

}

/*------------------------------------------------------------------
[ X. On Page Ready ]
*/

$(function() {
  venture.initialize();
});


/*------------------------------------------------------------------
[ X. On Scroll ]
*/

$(document).scroll(function() {
  venture.onScroll();
});
