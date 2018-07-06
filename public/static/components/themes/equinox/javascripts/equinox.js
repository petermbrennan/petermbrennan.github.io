// ********************************************
//
//  Equinox Blueprint Theme
//
//  JS by Adam Sworob
//
// ********************************************

/*------------------------------------------------------------------

[Table of contents]

1. Variables
2. Panels Initialize
3. Hero Cinemagraph Size
4. Hero Cinemagraph
5. Header Size
6. Desktop Resize
7. Sticky Footer Erase
8. Sticky Footer
9. Scroll Enhancement
10. Nav Functionality
11. Split Screen Left Panel Footer Measurement
12. Mobile Navigation
13. Hero Content
14. Info Sheet Nav
15. Timed Social Footer Hide
16. Lead Form Widget
17. Email Form Adjust
18. Photo Classes
19. Directions Widget
20. H Card Alterations
21. Desktop/Mobile Styles
22. Gallery Widget
23. Force Resize
24. Ember Hero No No

-------------------------------------------------------------------*/

var equinox = {

  initialize: function() {

    // 1. Variables
    this.variables();

    // 2. Panels Initialize
    this.layoutInitialize();

    // 3. Hero Cinemagraph Size
    this.heroCinemagraphSize();

    // 5. Desktop Resize
    this.desktopResize();

    // 6. Header Size
    // this.headerSize();

    // 8. Sticky Footer
    // this.stickyFooter();

    // 9. Scroll Enhancement
    this.scrollEnhancement();

    // 11. Split Screen Left Panel Footer Measurement
    this.leftPanelFooterMeasurement();

    // 12. Mobile Navigation
    // this.mobileNavigation();

    // 13. Hero Content
    this.heroContent();

    // 15. Timed Social Footer Hide
    this.timedStickyFooterHide();

    // 16. Lead Form Widget
    // this.leadFormWidget();

    // 18. Photo Classes
    this.photoClass();

    // 19. Directions Widget
    this.directionsWidget();

    // 20. H Card Alterations
    this.hCardAlterations();

    // 21. Desktop/Mobile Styles
    this.desktopMobileStyling();

    // 22. Gallery Widget
    this.galleryWidget();

    // 23. Force Resize
    this.forceResize();

    // 24. Ember Hero No No
    this.emberHeroNoNo();

  },

  onScroll: function() {

    // 9. Scroll Enhancement
    this.scrollEnhancement();

  },

  onSmartResize: function() {

    // 3. Hero Cinemagraph Size
    this.heroCinemagraphSize();

    // 5. Desktop Resize
    this.desktopResize();

    // 6. Header Size
    // this.headerSize();

    // 8. Sticky Footer
    // this.stickyFooter();

    // 9. Scroll Enhancement
    this.scrollEnhancement();

    // 11. Split Screen Left Panel Footer Measurement
    this.leftPanelFooterMeasurement();

    // 12. Mobile Navigation
    // this.mobileNavigation();

    // 13. Hero Content
    this.heroContent();

    // 17. Email Form Adjust
    this.emailFormAdjust();

    // 21. Desktop/Mobile Styles
    this.desktopMobileStyling();

  },


  /*------------------------------------------------------------------
  [ 1. Variables ]
  */

  variables: function() {

    // Common Elements
    this.asideBeforeMain = $("#drop-target-aside-before-main");
    this.body = $("body");
    this.directionsSubmit = $('.directions.widget .directions-submit');
    this.dropTargetMain = $("#drop-target-main");
    this.footer = $("footer[role=contentinfo]");
    this.header = $("header[role=banner]");
    this.leadForm = $(".lead-form");
    this.leftPanel = $("#left-panel");
    this.leftPanelFooter = $(".left-panel-footer");
    this.leftPanelFooterRight = $(".left-panel-footer-right");
    this.menuButton = $(".collapsable-btn");
    this.navCorpHome = $(".corporate-home");
    this.navigation = $(".navigation");
    this.navigationWrapper = $(".collapsable-content");
    this.headerRight = this.header.find(".right");
    this.rightPanel = $("#drop-target-main");
    this.rowsLayout = $(".rows-layout");
    this.photoMosaic = $(".photo-mosaic");
    this.photoBrowserEdge = $(".photo-browser-edge");

    // Elements off elements
    this.contactInfoSheet = this.asideBeforeMain.find(".contact-info-sheet");
    this.heroSocialLinks = this.asideBeforeMain.find(".social-links");
    this.leftPanelFirstRow = this.leftPanel.find(".first-row");
    this.leftPanelLogo = this.leftPanel.find(".logo-container");
    this.mainRow = this.dropTargetMain.find(".row");
    this.navCorpHomeA = this.navCorpHome.find("a");
    this.subNav = this.navigation.find(".has-subnav > a");

    // Elements off elements off elements
    this.arrowDown = this.contactInfoSheet.find(".info-sheet-page-down");
    this.arrowUp = this.contactInfoSheet.find(".info-sheet-page-up");
    this.infoSheetContent = this.contactInfoSheet.find(".info-sheet-content");
    // this.infoSheetNavChat = this.infoSheetNav.find(".info-sheet-chat-btn");
    this.infoSheetContent.prepend("<div class=\"info-sheet-nav-exit\"></div>");
    this.infoSheetContentExit = this.infoSheetContent.find(".info-sheet-nav-exit");
    this.infoSheetContentEmail = this.infoSheetContent.find(".info-sheet-email");
    this.infoSheetNav = this.contactInfoSheet.find(".info-sheet-nav");
    this.infoSheetNavEmail = this.infoSheetNav.find(".info-sheet-email-btn");
    this.infoSheetNavPhone = this.infoSheetNav.find(".info-sheet-phone-btn");
    this.firstRow = this.mainRow.first();
    // this.secondRow = this.mainRow.get(1);
    this.heroEmberApplication = this.firstRow.find(".ember-application");
    this.heroPhoto = this.firstRow.find("figure.photo");

    // Breakpoints
    this.maxXSmall = '(max-width: 479px)';
    this.minXSmall = '(min-width: 480px)';
    this.maxMSmall = '(max-width: 599px)';
    this.minMSmall = '(min-width: 600px)';
    this.maxSmall = '(max-width: 779px)';
    this.minSmall = '(min-width: 780px)';
    this.maxMedium = '(max-width: 1199px)';
    this.minMedium = '(min-width: 1200px)';
    this.maxNav = this.maxMedium;
    this.minNav = this.minMedium;
    this.maxHero = this.maxMedium;
    this.minHero = this.minMedium;
    this.maxLayout = this.maxMedium;
    this.minLayout = this.minMedium;
    this.maxLarge = '(max-width: 1599px)';
    this.minLarge = '(min-width: 1600px)';
    this.maxXLarge = '(max-width: 1999px)';
    this.minXLarge = '(min-width: 2000px)';

    this.maxHeight = '(max-height: 800px)';

    this.betweenMinLayoutAndMaxLarge = this.minLayout + ' and ' + this.maxLarge;

    // YouTube Ratio
    this.youtubeRatio = 16/9;

    // Contact Info Sheet
    this.contactInfoSheetOpen = "";

    // 15. Timed Social Footer Hide
    this.idleTimer = null;
    this.idleState = false;
    this.idleWait = 8000;

    this.menuButton.click(function() {

      // 10. Nav Functionality
      this.navFunctionality();

    }.bind(this));

    // this.infoSheetNavChat.click(function() {
    //   this.infoSheetNavClick();
    // }.bind(this));

    this.infoSheetContentExit.click(function(e) {

      // 14. Info Sheet Nav
      this.infoSheetNavClick(e);

    }.bind(this));

    this.infoSheetNavEmail.click(function(e) {

      // 14. Info Sheet Nav
      this.infoSheetNavClick(e);

    }.bind(this));

    this.infoSheetNavEmail.one( "click", function() {

      // 17. Email Form Adjust
      this.emailFormAdjust();

    }.bind(this));

    this.infoSheetNavPhone.click(function(e) {

      // 14. Info Sheet Nav
      this.infoSheetNavClick(e);

    }.bind(this));

    // 19. Directions Widget
    this.directionsSubmit.click(function(e) {
      this.directionsSubmitClick(e);
    }.bind(this));

  },

  /*------------------------------------------------------------------
  [ 2. Layout Initialize ]
  */

  layoutInitialize: function() {

    // Inner wraps `.top-nav` anchors with span tags for drop down carot, while flex is being applied to the anchors
    if(this.subNav.length) {
      this.subNav.wrapInner("<span></span>");
    }

    // Make a clone of `.corporate-home a`, add class, prepend it to `.left-panel-footer`, declare it a variable
    if(this.navCorpHome.length) {
      this.navCorpHomeA.clone().addClass("corp-home-anchor").prependTo(this.leftPanelFooter);
      this.leftPanelFooterCorpHome = this.leftPanelFooter.find(".corp-home-anchor");
    }

    // Prepend `.contact-info-sheet` to `.left-panel-footer-right`
    if(this.contactInfoSheet.length) {
      this.contactInfoSheet.prependTo(this.leftPanelFooterRight);
    }

    // Append `.social-links` in aside main to `.left-panel-footer-right`
    if(this.heroSocialLinks.length) {
      this.heroSocialLinks.appendTo(this.leftPanelFooterRight);
    }

    if(this.firstRow.length && !this.body.hasClass("not-found-404")) {
      this.firstRow.appendTo(this.leftPanelFirstRow);
      if(this.firstRow.hasClass("text-dark")) {
        this.leftPanelFooter.addClass("text-dark");
      }
    }

    if(this.firstRow.length && this.firstRow.hasClass("no-split")) {

      this.firstRow.removeClass("no-split");

      // Move the hero stripe into `.left-panel .first-row`

      this.body.addClass("no-split");

    } else if(this.body.hasClass("not-found-404")){
      this.body.addClass("no-split");
    } else if(this.body.hasClass("no-split-all-interior") && this.body.hasClass("web-page-template")) {
      this.body.addClass("no-split");
    } else {

      this.body.addClass("split");

      // Move the hero stripe into `.left-panel .first-row`
      this.row_1 = this.leftPanelFirstRow.find(".row-1");
      if(this.row_1.length) {
        this.row_1.prependTo(this.leftPanel);
      }

      this.row_2 = this.leftPanelFirstRow.find(".row-2");
      if(this.row_2.length) {
        this.body.addClass("hero-logo-plus");
      }

      this.firstRow.clone().prependTo(this.rightPanel);
      this.firstRowColumn = this.rightPanel.find(".row:first-of-type .column");
      this.leftPanelFirstRowRow = this.leftPanelFirstRow.find(".row");
      this.leftPanelFirstRowContent = this.leftPanelFirstRowRow.find(".content");
      if(!this.leftPanelFirstRowContent.hasClass("row-single")) {
        this.leftPanelFirstRowContent.addClass("row-single");
      }

      // Appends footer to `.right-panel`
      this.footer.appendTo(this.rightPanel);

      // Fixes Cinemagraph as hero image
      this.heroCinemagraph = this.leftPanel.find(".cinemagraph");
      this.heroCinemagraphContainer = this.heroCinemagraph.find(".cinemagraph-container");
      if(this.heroCinemagraph.length) {
        if(this.heroCinemagraph.hasClass("cinemagraph-absolute")) {
          this.heroCinemagraph.removeClass("cinemagraph-absolute");
        }
        if(this.heroCinemagraph.hasClass("cinemagraph-normal")) {
          this.heroCinemagraph.removeClass("cinemagraph-normal");
        }
        if(this.heroCinemagraph.hasClass("cinemagraph-full-width")) {
          this.heroCinemagraph.removeClass("cinemagraph-full-width");
        }
      }

    }

  },


  /*------------------------------------------------------------------
  [ 3. Hero Cinemagraph Size ]
  */

  heroCinemagraphSized: function(ratioFactor) {

    this.windowHeight = $(window).height();
    this.windowWidth = $(window).width();
    if( (this.windowWidth / this.windowHeight) < (this.youtubeRatio * ratioFactor) ) {
      this.heroCinemagraphContainer.height(this.windowHeight);
      this.heroCinemagraphContainer.width(Math.ceil(this.heroCinemagraphContainer.height() * this.youtubeRatio));
    } else {
      this.heroCinemagraphContainer.width(this.windowWidth);
      this.heroCinemagraphContainer.height(Math.ceil(this.heroCinemagraphContainer.width() * 1/this.youtubeRatio));
    }

  },


  /*------------------------------------------------------------------
  [ 4. Panels Initialize ]
  */

  heroCinemagraphSize: function() {

    if(this.body.hasClass("split") && this.heroCinemagraph.length) {
      if(Modernizr.mq(this.minLayout)) {
        this.heroCinemagraphSized(2);
      } else {
        this.heroCinemagraphSized(1);
      }
    }

  },


  /*------------------------------------------------------------------
  [ 5. Desktop Resize ]
  */

  desktopResize: function() {

    if(Modernizr.mq(this.minLayout)) {
      this.wrapperWidth = Math.ceil(this.headerRight.width());
      this.navRightPadding = parseInt(this.navigationWrapper.css("padding-right"));
      if(this.navRightPadding != this.wrapperWidth) {
        this.navRightPadding = this.wrapperWidth + 20;
        this.navigationWrapper.css("padding-right", this.navRightPadding);
      }
      this.header.addClass("header-visible");
    } else if(this.header.hasClass("header-visible")){
      this.navigationWrapper.removeAttr("style");
      this.header.removeClass("header-visible");
    }

  },


  /*------------------------------------------------------------------
  [ 6. Header Size ]
  */

  // headerSize: function() {

  //   this.headerHeight = this.header.height();
  //   this.navigationTop = parseInt(this.navigation.css("top"));
  //   if(this.body.hasClass("split")) {
  //     this.paddingTop = this.leftPanel.css("padding-top");
  //     if(this.paddingTop != this.headerHeight) {
  //       this.leftPanel.css("padding-top", this.headerHeight)
  //       this.rightPanel.css("padding-top", this.headerHeight)
  //     }
  //   } else{
  //     this.paddingTop = this.rowsLayout.css("padding-top");
  //     if(this.paddingTop != this.headerHeight) {
  //       this.rowsLayout.css("padding-top", this.headerHeight)
  //     }
  //   }
  //   if(this.navigationTop != this.headerHeight) {
  //     this.navigation.css("top", this.headerHeight)
  //   }

  // },


  /*------------------------------------------------------------------
  [ 7. Sticky Footer Erase ]
  */

  // stickyFooterErase: function() {

  //   this.footer.removeClass("sticky");
  //   if(this.body.hasClass("split")) {
  //     this.rightPanel.removeAttr("style");
  //   } else{
  //     this.rowsLayout.removeAttr("style");
  //   }

  // },


  /*------------------------------------------------------------------
  [ 8. Sticky Footer ]
  */

  // Fix This Function Up

  // stickyFooter: function() {

  //   if(Modernizr.mq(this.minLayout)) {
  //     this.rightPanelHeight = this.rightPanel.innerHeight();
  //     // this.rowsLayoutHeight = this.rowsLayout.innerHeight();
  //     this.windowHeight = $(window).height();
  //     if(this.body.hasClass("split") && this.rightPanelHeight === this.windowHeight) {
  //       this.footer.addClass("sticky");
  //       this.rightPanel.css("padding-bottom", this.footer.innerHeight());
  //     // } else if(this.body.hasClass("no-split") && this.rowsLayoutHeight === this.windowHeight) {
  //     } else if(this.body.hasClass("no-split")) {
  //       this.footer.addClass("sticky");
  //       this.rowsLayout.css("padding-bottom", this.footer.innerHeight());
  //     } else{
  //       this.stickyFooterErase();
  //     }
  //   } else{
  //     this.stickyFooterErase();
  //   }

  // },


  /*------------------------------------------------------------------
  [ 9. Scroll Enhancement ]
  */

  scrollEnhancement: function() {

    if(this.body.hasClass("no-split") || this.body.hasClass("split") && Modernizr.mq(this.maxLayout)) {

      this.documentScrollTop = $(document).scrollTop();
      this.headerHeight = this.header.innerHeight();
      this.rightPanelTop = this.rightPanel.offset().top;

      this.rightPanelOffset = this.rightPanelTop - this.headerHeight;

      if(this.documentScrollTop >= this.rightPanelOffset && !this.body.hasClass("social-footer")) {
        this.body.addClass("social-footer");
      } else if(this.documentScrollTop < this.rightPanelOffset && this.body.hasClass("social-footer")) {
        this.body.removeClass("social-footer");
      } else{}
    } else if(this.body.hasClass("split") && Modernizr.mq(this.minLayout) && this.body.hasClass("social-footer")) {
      this.body.removeClass("social-footer");
    }

  },


  /*------------------------------------------------------------------
  [ 10. Nav Functionality ]
  */

  navFunctionality: function() {

    this.body.toggleClass("show-navigation");

    if(this.body.hasClass("info-sheet-nav-clicked")){
      this.body.removeClass("info-sheet-nav-clicked");
    }

    // if(this.infoSheetNavChat.hasClass("active")){
    //   this.infoSheetNavChat.removeClass("active");
    // }

    if(this.infoSheetNavEmail.hasClass("active")){
      this.infoSheetNavEmail.removeClass("active");
      this.contactInfoSheet.removeClass("showing-email");
    }

    if(this.infoSheetNavPhone.hasClass("active")){
      this.infoSheetNavPhone.removeClass("active");
      this.contactInfoSheet.removeClass("showing-phone");
    }

  },


  /*------------------------------------------------------------------
  [ 11. Split Screen Left Panel Footer Measurement ]
  */

  leftPanelFooterMeasurement: function() {
    if(this.body.hasClass("split") && Modernizr.mq(this.minLayout) && this.navCorpHome.length) {
      this.leftPanelFooterWidth = this.leftPanelFooter.width();
      if(!this.body.hasClass("hide-hero-social")) {
        this.leftPanelFooterCorpHomeWidth = this.leftPanelFooterCorpHome.outerWidth();
        this.leftPanelFooterRightWidth = this.leftPanelFooterRight.width();
        this.leftPanelFooterChildrenWidth = this.leftPanelFooterCorpHomeWidth + this.leftPanelFooterRightWidth;
      }
      if(this.leftPanelFooterChildrenWidth >= this.leftPanelFooterWidth && !this.body.hasClass("hide-hero-social")) {
        this.body.addClass("hide-hero-social");
      } else if(this.leftPanelFooterChildrenWidth < this.leftPanelFooterWidth && this.body.hasClass("hide-hero-social")){
        this.body.removeClass("hide-hero-social");
      }
    }

  },

  /*------------------------------------------------------------------
  [ 12. Mobile Navigation ]
  */

  // mobileNavigation: function() {
    // this.navigationWrapperHeight = this.navigationWrapper.height();
    // this.navigationHeight = this.navigation.height();
    // if(Modernizr.mq(this.maxLayout) && navigationHeight < navigationWrapperHeight) {
    //   this.navigationPadding = Math.floor(this.navigationWrapperHeight - this.navigationHeight / 2);
    //   this.navigation.css("padding-bottom", this.navigationPadding);
    //   this.navigation.css("padding-top", this.navigationPadding);
    // } else{
    //   this.navigation.removeAttr("style");
    // }
  // }


  /*------------------------------------------------------------------
  [ 13. Hero Content ]
  */

  heroContent: function() {

    if(this.body.hasClass("hero-logo-plus")) {

      this.firstRowColumnHeight = this.firstRowColumn.height();
      this.leftPanelFirstRowRowHeight = this.leftPanelFirstRowRow.height();
      this.leftPanelLogoHeight = this.leftPanelLogo.height();
      this.leftPanelFirstRowHeight = this.leftPanelFirstRow.height();
      if(Modernizr.mq(this.maxHeight)) {
        this.heroWidgetSpacing = 50;
      } else{
        this.heroWidgetSpacing = (this.leftPanelLogoHeight * 2) + 50;
      }

      if(!this.body.hasClass("hero-exhaust")) {
        this.leftPanelFirstRowPseudo1Height = this.leftPanelFirstRowRowHeight + this.heroWidgetSpacing;
      } else{
        this.leftPanelFirstRowPseudo2Height = this.firstRowColumnHeight + this.heroWidgetSpacing;
      }

      if(this.leftPanelFirstRowPseudo1Height >= this.leftPanelFirstRowHeight && !this.body.hasClass("hero-exhaust")) {
        this.body.addClass("hero-exhaust");
      } else if(this.leftPanelFirstRowPseudo2Height < this.leftPanelFirstRowHeight && this.body.hasClass("hero-exhaust")){
        this.body.removeClass("hero-exhaust");
      }

    }

  },


  /*------------------------------------------------------------------
  [ 14. Info Sheet Nav ]
  */

  infoSheetNavClick: function(e) {

    var $this = $(e.currentTarget);

    // this.chatCheck = $this.hasClass("info-sheet-chat-btn");
    this.emailCheck = $this.hasClass("info-sheet-email-btn");
    this.phoneCheck = $this.hasClass("info-sheet-phone-btn");
    this.exitCheck = $this.hasClass("info-sheet-nav-exit");
    // this.chatDoubleCheck = this.chatCheck && this.contactInfoSheetOpen === "chat";
    this.emailDoubleCheck = this.emailCheck && this.contactInfoSheetOpen === "email";
    this.phoneDoubleCheck = this.phoneCheck && this.contactInfoSheetOpen === "phone";

    if(!this.body.hasClass("info-sheet-nav-clicked")){
      this.body.addClass("info-sheet-nav-clicked");
      if(this.body.hasClass("show-navigation")) {
        this.body.removeClass("show-navigation");
        this.navigationWrapper.removeClass("in");
        this.menuButton.removeClass("on");
        this.menuButton.removeClass("collapsed");
      }
    // } else if(this.chatDoubleCheck || this.emailDoubleCheck || this.phoneDoubleCheck ) {
    } else if(this.emailDoubleCheck || this.phoneDoubleCheck ) {
      this.body.removeClass("info-sheet-nav-clicked");
    } else if(this.exitCheck) {
      this.body.removeClass("info-sheet-nav-clicked");
      this.contactInfoSheet.removeClass("opened");
      if(this.contactInfoSheet.hasClass("showing-phone")) {
        this.contactInfoSheet.removeClass("showing-phone");
        this.infoSheetNavPhone.removeClass("active");
      }
      if(this.contactInfoSheet.hasClass("showing-email")) {
        this.contactInfoSheet.removeClass("showing-email");
        this.infoSheetNavEmail.removeClass("active");
      }
    }

    if(this.phoneCheck) {
      this.contactInfoSheetOpen = "phone";
    } else if(this.emailCheck) {
      this.contactInfoSheetOpen = "email";
    }
    // else if(this.chatCheck) {
    //   this.contactInfoSheetOpen = "chat";
    // }

  },


  /*------------------------------------------------------------------
  [ 15. Timed Social Footer Hide ]
  */

  timedStickyFooterHide: function() {

    $(document).ready(function () {

      this.body.on('mousemove keydown scroll', function () {

        clearTimeout(this.idleTimer);

        if (this.idleState == true) {

          // Reactivated event
          this.leftPanelFooter.removeClass("idle");
        }

        this.idleState = false;

        this.idleTimer = setTimeout(function () {

        // Idle Event
        this.leftPanelFooter.addClass("idle");

        this.idleState = true; }.bind(this), this.idleWait);

      }.bind(this));

      this.body.trigger("mousemove keydown scroll");

    }.bind(this));

  },


  /*------------------------------------------------------------------
  [ 16. Lead Form Widget ]
  */

  // leadFormWidget: function() {
  //   if(this.leadForm.length) {
  //     this.leadForm.each(function (index, value){
  //       var $this = $(this);
  //       $this.find("input[type=submit]").attr("value", "Submit");
  //     });
  //   }
  // },


  /*------------------------------------------------------------------
  [ 17. Email Form Adjust ]
  */

  emailFormAdjust: function() {
    if(this.infoSheetContentEmail) {

      this.infoSheetContentHeight = this.infoSheetContent.height();

      if(!this.body.hasClass("compact-email")) {
        this.infoSheetContentEmailHeight = this.infoSheetContentEmail.innerHeight();
      }

      if(this.infoSheetContentEmailHeight >= this.infoSheetContentHeight && !this.body.hasClass("compact-email")){
        this.body.addClass("compact-email");
      } else if(this.infoSheetContentEmailHeight < this.infoSheetContentHeight && this.body.hasClass("compact-email")){
        this.body.removeClass("compact-email");
      }

    }
  },

  /*------------------------------------------------------------------
  [ 18. Photo Classes ]
  */

  photoClass: function() {
    this.photoMosaic.each( function( index, element ){
      var $this = $(element);
      $this.closest(".col").addClass("photo-class-col photo-class-fill");
    });
    this.photoBrowserEdge.each( function( index, element ){
      var $this = $(element);
      $this.closest(".col").addClass("photo-class-col photo-class-browser-edge");
    });
  },

  /*------------------------------------------------------------------
  [ 19. Directions Widget ]
  */

  directionsWidget: function() {
    this.rightPanel.find('.directions.widget .text').each(function(){
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
  [ 20. H Card Alterations ]
  */

  hCardAlterations: function() {
    this.mainRow.find('.h-card.contact-info, .h-c-ret.contact-info').each(function(){
      var $this = $(this);
      if($this.find(".ratings-summary-outer").length && $this.find(".social-links").length){
        $this.append($this.find(".social-links"));
      }
    });
  },

  /*------------------------------------------------------------------
  [ 21. Desktop/Mobile Styles ]
  */

  desktopMobileStyling: function() {
    if(Modernizr.mq(this.maxSmall)) {
      this.body.addClass("mobile-styling");
      this.body.removeClass("desktop-styling");
    } else if(this.body.hasClass("split") && Modernizr.mq(this.betweenMinLayoutAndMaxLarge)) {
      this.body.addClass("mobile-styling");
      this.body.removeClass("desktop-styling");
    } else{
      this.body.addClass("desktop-styling");
      this.body.removeClass("mobile-styling");
    }
  },

  /*------------------------------------------------------------------
  [ 22. Gallery Widget ]
  */

  galleryWidget: function() {

    $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');

  },

  /*------------------------------------------------------------------
  [ 23. Force Resize ]
  */

  forceResize: function() {

    $(window).trigger('resize');

  },

  /*------------------------------------------------------------------
  [ 24. Ember Hero No No ]
  */

  emberHeroNoNo: function() {

    if(this.heroEmberApplication.length) {
      this.body.addClass("hero-ember-app");
    }

  }


}



/*------------------------------------------------------------------
[ X. On Page Ready ]
*/

$(function() {
  equinox.initialize();
});


/*------------------------------------------------------------------
[ X. On Scroll ]
*/

$(document).scroll(function() {
  equinox.onScroll();
});


/*------------------------------------------------------------------
[ X. On Scroll ]
*/

$(window).smartresize(function() {
  equinox.onSmartResize();
});
