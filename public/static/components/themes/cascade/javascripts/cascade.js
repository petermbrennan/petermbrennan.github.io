// ********************************************
//
//  Cascade Theme
//
//  JS by Adam Sworob
//
// ********************************************

/*------------------------------------------------------------------

[Table of contents]

1. Variables
2. Navigation
3. Stuck Nav Logo
4. Hero Image
5. Cinemagraph Sizing
6. Zip Search Button Text
7. Contact Info HTML
8. Contact Info Sheet Default
9. Directions Submit Container
10. Gallery Widget
11. Divider Image
12. Mosaic Styles
13. Big Col HTML Color
14. CSS Fallbacks
15. Sticky Navigation
16. Poly Shapes
17. Add FortAwesome
18. Menu Button Click


-------------------------------------------------------------------*/

var cascade = {

  initialize: function() {

    // 1. Variables
    this.variables();

    // 2. Navigation
    this.navigation();

    // 3. Stuck Nav Logo
    this.stuckNavLogo();

    // 4. Hero Image
    this.heroImage();

    // 5. Cinemagraph Sizing
    this.cinemagraphSizing();

    // 6. Zip Search Button Text
    this.zipSearchBtnText();

    // 7. Contact Info HTML
    this.contactInfoHTML();

    // 8. Contact Info Sheet Default
    this.contactInfoSheetDefault();

    // 9. Directions Submit Container
    this.directionsSubmitContainer();

    // 10. Gallery Widget
    this.galleryWidget();

    // 11. Divider Image
    this.dividerImage();

    // 12. Mosaic Styles
    this.mosaicStyles();

    // 13. Big Col HTML Color
    this.bgColHTMLColor();

    // 14. CSS Fallbacks
    this.cssFallbacks();

    // 15. Sticky Navigation
    this.stickyNav();

    // 16. Poly Shapes
    this.polyShapes();

    // 17. Add FortAwesome
    this.addFortAwesome();

  },

  onSmartResize: function() {

    // 5. Cinemagraph Sizing
    this.cinemagraphSizing();

    // 15. Sticky Navigation
    this.stickyNav();

    // 16. Poly Shapes
    this.polyShapes();

  },

  onScroll: function() {

    // 15. Sticky Navigation
    this.stickyNav();

  },

  /*------------------------------------------------------------------
  [ 1. Variables ]
  */

  variables: function() {

    this.window = $(window);

    this.body = $("body");

    this.rows = $(".row");

    // Alt Logos

    this.logoImg = $(".logo-container img");

    this.faviconLogo = $("link[rel$='shortcut icon']");

    this.asideLogo = $(".aside-logo #drop-target-aside-before-main .photo:first-of-type");
    this.asideLogoImg = this.asideLogo.find("img");

    // Big Col HTML

    this.bgColHTML = $(".bg-col .html.widget .html-content");

    // Blog Feeds

    this.blogFeed = $(".blog-feed");
    this.blogFeedV2 = $(".blog-feed-v2");

    // City State Zip Search

    this.zipSearchBtn = $(".zip-search-button button");

    // Contact Info HTML

    this.contactAdr = $(".adr > a");
    this.contactEmail = $(".email > a");

    // Contact Info Sheet

    this.contactInfoSheetAny = $(".contact-info-sheet");
    this.contactInfoSheet = $(".contact-info-sheet.default");
    this.infoSheetNav = $(".contact-sheet-nav.default");

    // Directions

    this.directionsSubmit = $(".directions-submit");

    // Header

    this.appendedPhone = $(".appended-phone");
    this.dropTargetBtn = $("#drop-target-btn");

    // Hero

    this.hero = $(".row:first-of-type");
    this.heroCinemagraph = this.hero.find(".cinemagraph");
    this.heroGallery = this.hero.find(".gallery-basic figure");
    this.heroPhoto = this.hero.find(".photo");
    this.heroRandomizer = this.hero.find(".photo-randomizer .photo-wrapper");
    this.heroRow = this.hero.find(".row-1");
    this.heroRowWidget = this.heroRow.find(".widget");
    this.heroBackgroundWidgets = ".cinemagraph, .gallery-basic, .photo, .photo-randomizer";

    // Mosaic Elements

    this.map = "map";
    this.mapMosaic = ".map-mosaic";
    this.mapBrowserEdge = ".map-browser-edge";

    this.photo = "photo";
    this.photoMosaic = ".photo-mosaic";
    this.photoBrowserEdge = ".photo-browser-edge";

    this.mosaicElements = [this.mapMosaic, this.photoMosaic, this.mapBrowserEdge, this.photoBrowserEdge];
    this.mosaicArrayLength = this.mosaicElements.length;
    this.mosaicElementClass = "mosaic-element";

    // Navigation

    this.lastNavItem = $(".top-nav > li:last-child");
    this.corpHomeLink = $(".corporate-home a");
    this.menuButton = $(".collapsable-btn");
    this.menuButton.click(function() {
      this.menuButtonClick();
    }.bind(this));
    this.topNavA = $(".top-nav > li > a");

    // Neighborhood Map

    this.neighborhoodMap = $(".neighborhood-map");

    // Row Divider

    this.rowDivider = $(".row-divider");

    // Shape Classes

    this.shapeClasses = ".chevron, .diagonal-left, .diagonal-right";
    this.shapeClassesAll = this.shapeClasses + ", .straight";

    // Supports
    this.supportsCSS = !!((window.CSS && window.CSS.supports) || window.supportsCSS || false);

  },

  /*------------------------------------------------------------------
  [ 2. Navigation Phone ]
  */

  navigation: function() {

    this.topNavA.wrapInner("<span></span>");

    this.appendedPhoneCopy = this.appendedPhone.clone();
    this.lastNavItem.after(this.appendedPhoneCopy);
    this.appendedPhoneNavItem = $(".top-nav .appended-phone");
    this.appendedPhoneNavItem.attr("id","");
    this.appendedPhoneNavItem.wrap("<li></li>");
    this.menuButton.after(this.appendedPhone);

    this.corpHomeLinkCopy = this.corpHomeLink.clone();
    this.corpHomeLinkCopy.addClass("corporate-home-btn");
    this.dropTargetBtn.append(this.corpHomeLinkCopy);


  },

  /*------------------------------------------------------------------
  [ 3. Stuck Nav Logo ]
  */

  newLogo: function($imgSource) {

    this.body.addClass("two-logos");

    if($imgSource === "favLogo") {
      this.stuckLogoImgURL = this.faviconLogo.attr("href");
    } else {
      this.stuckLogoImgURL = this.asideLogoImg.attr("src");
    }

    this.stuckLogoImg = $("<img>");
    this.stuckLogoImg.attr('src', this.stuckLogoImgURL);
    this.logoImg.after(this.stuckLogoImg);

  },

  stuckNavLogo: function() {

    if(this.asideLogo.length) {

      this.newLogo("");
      this.asideLogo.remove();

    } else if(this.body.hasClass("favicon-logo")) {

      this.newLogo("favLogo");

    } else if(this.body.hasClass("shrink-logo")) {

      // Leave logo as is

    } else{

      this.body.addClass("icon-logo");

    }

  },

  /*------------------------------------------------------------------
  [ 4. Hero Image ]
  */

  heroImage: function() {
    if(this.heroRowWidget.is(this.heroBackgroundWidgets)) {
      this.hero.prepend(this.heroRow);
    }
    if(this.heroCinemagraph.length) {
      this.heroCinemagraphOptions = JSON.parse(this.heroCinemagraph.find("script").text());
      this.heroCinemagraphRatioWidth = this.heroCinemagraphOptions.sourceRatioWidth;
      this.heroCinemagraphRatioHeight = this.heroCinemagraphOptions.sourceRatioHeight;
      this.heroCinemagraphRatio = this.heroCinemagraphRatioWidth/this.heroCinemagraphRatioHeight;
      this.heroCinemagraph.removeClass("cinemagraph-absolute");
      this.heroCinemagraph.removeClass("cinemagraph-full-width");
      this.heroCinemagraph.removeClass("cinemagraph-normal");
    }
    this.heroRow.addClass("show-hero");

  },

  /*------------------------------------------------------------------
  [ 5. Cinemagraph Sizing ]
  */

  cinemagraphSizing: function() {

    if(this.heroCinemagraph.length) {

      this.heroCinemagraphContainer = this.heroCinemagraph.find(".cinemagraph-container");
      this.heroCinemagraphContainerHeight = this.heroCinemagraphContainer.height();
      this.heroCinemagraphContainerWidth = this.heroCinemagraphContainer.width();
      this.heroCinemagraphContainerRatio = this.heroCinemagraphContainerWidth / this.heroCinemagraphContainerHeight;

      if(this.heroCinemagraphContainerRatio > this.heroCinemagraphRatio) {
        this.heroCinemagraphContainer.removeClass("equal-ratio").removeClass("height-ratio").addClass("width-ratio");
      } else if (this.heroCinemagraphContainerRatio < this.heroCinemagraphRatio) {
        this.heroCinemagraphContainer.removeClass("equal-ratio").removeClass("width-ratio").addClass("height-ratio");
      } else {
        this.heroCinemagraphContainer.removeClass("height-ratio").removeClass("width-ratio").addClass("equal-ratio");
      }

    }

  },

  /*------------------------------------------------------------------
  [ 6. Zip Search Button Text ]
  */

  zipSearchBtnText: function() {

    this.zipSearchBtn.text("Search");
    this.zipSearchBtn.addClass("text-appear");

  },

  /*------------------------------------------------------------------
  [ 7. Contact Info HTML ]
  */

  contactInfoHTML: function(){

    this.contactAdr.wrapInner("<span><span></span></span>");
    this.contactEmail.wrapInner("<span></span>");

  },

  /*------------------------------------------------------------------
  [ 8. Contact Info Sheet Default ]
  */

  contactInfoSheetDefault: function(){

    this.contactInfoSheet.removeClass("default").addClass("b-right");
    this.infoSheetNav.removeClass("default").addClass("b-right");

  },

  /*------------------------------------------------------------------
  [ 9. Directions Submit Container ]
  */

  directionsSubmitContainer: function(){

    this.directionsSubmit.wrap("<div class=\"directions-submit-wrapper\"></div>");

  },

  /*------------------------------------------------------------------
  [ 10. Gallery Widget ]
  */

  galleryWidget: function() {

    $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');

  },

  /*------------------------------------------------------------------
  [ 11. Divider Image ]
  */

  dividerImage: function() {
    this.rowDivider.each(function(index, element){
      var $this = $(element);
      this.nextRow = $this.next();
      if(this.nextRow.hasClass("chevron")) {
        $this.addClass("chevron");
      }
      if(this.nextRow.hasClass("diagonal-left")) {
        $this.addClass("diagonal-left");
      }
      if(this.nextRow.hasClass("diagonal-right")) {
        $this.addClass("diagonal-right");
      }
    }.bind(this));

  },

  /*------------------------------------------------------------------
  [ 12. Mosaic Styles ]
  */

  mosaicStyles: function() {

    for (var i = 0; i < this.mosaicArrayLength; i++) {

      this.mosaicClass = this.mosaicElements[i];
      this.mosaicElement = $(this.mosaicClass);
      this.mosaicRow = this.mosaicElement.closest(".row");

      this.mosaicRow.addClass("mosaic-styles");
      if(this.mosaicClass.indexOf("browser-edge") !== -1) {
        this.mosaicRow.addClass("browser-edge-row");
        if(this.mosaicClass.indexOf(this.map) !== -1) {
          this.mosaicCol = this.mosaicElement.find(".map.widget").closest(".col");
        } else {
          this.mosaicCol = this.mosaicElement.closest(".col");
        }
        this.mosaicCol.addClass("browser-edge-col");
      }

      if(this.mosaicClass.indexOf(this.map) !== -1) {
        this.mosaicRow.find("." + this.map).addClass(this.mosaicElementClass);
      } else {
        this.mosaicRow.find("." + this.photo).addClass(this.mosaicElementClass);
      }

      this.mosaicRow.each(function(index, element){
        var $this = $(element);
        this.mosaicNextRow = $this.next();
        if(this.mosaicNextRow.is(this.shapeClasses)) {
          $this.addClass("next-row-has-shape");
        }
      }.bind(this));

    }

  },

  /*------------------------------------------------------------------
  [ 13. Big Col HTML Color ]
  */

  bgColHTMLColor: function() {
    this.bgColHTML.each(function(index, element){

      var $this = $(element);

      this.htmlOptions = JSON.parse($this.siblings("script").text());

      this.htmlBorderColor = $this.css('border-color');
      this.htmlBorderStyle = $this.css('border-style');
      this.htmlBorderWidth = $this.css('border-width');
      this.htmlColor = $this.css('background-color');
      this.htmlPadding = $this.css('padding');

      // this.htmlDesktopPadding = this.htmlOptions.paddingDesktop;
      // this.htmlMobilePadding = this.htmlOptions.paddingMobile;

      this.bgCol = $this.closest(".column");
      this.bgCol.css('border-color', this.htmlBorderColor);
      this.bgCol.css('border-style', this.htmlBorderStyle);
      this.bgCol.css('border-width', this.htmlBorderWidth);
      this.bgCol.css('background-color', this.htmlColor);
      this.bgCol.css('padding', this.htmlPadding);

      $this.addClass("remove-styles");

    });
  },

  /*------------------------------------------------------------------
  [ 14. CSS Fallbacks ]
  */

  objectFitSupport: function() {

    this.hero.addClass("hero-fallbacks");

    if(this.heroRandomizer.length) {
      this.img = this.heroRandomizer.find("img")
      this.imgUrl = this.img.prop("src");
      this.img.remove();
      this.heroRandomizer.css("backgroundImage", 'url(' + this.imgUrl + ')');
    }
    if(this.heroPhoto.length) {
      this.img = this.heroPhoto.find("img");
      this.imgUrl = this.img.prop("src");
      this.img.remove();
      this.heroPhoto.css("backgroundImage", 'url(' + this.imgUrl + ')');
    }
    if(this.heroGallery.length) {
      this.heroGallery.each(function(index, element){
        var $this = $(element);
        this.img = $this.find("img");
        if($this.hasClass("lazy-load")) {
          this.imgUrl = this.img.attr("data-src");
        } else {
          this.imgUrl = this.img.attr("src");
        }
        this.img.remove();
        $this.wrapInner("<div class=\"image\"></div>");
        $this.find(".image").css("backgroundImage", 'url(' + this.imgUrl + ')');
      });
    }

    $(this.photoMosaic).each(function(index, element){
      var $this = $(element);
      this.img = $this.find("img");
      this.imgUrl = this.img.prop("src");
      this.img.remove();
      $this.css("backgroundImage", 'url(' + this.imgUrl + ')');
      $this.addClass("object-fit-support");
      $this.closest(".col").addClass("col-object-fit-support");
    });

  },

  clipPathSupport: function() {

    if(!this.body.hasClass("ie-keep-background")) {

      this.shapeFallbackExceptions = ".mosaic-styles, .row:first-of-type, .ie-keep-background";

      this.body.addClass("clip-path-fallbacks");

      this.secondRow = $(".row:nth-of-type(2)");

      if(!this.secondRow.is(this.shapeClassesAll) && this.body.hasClass("web-page-template")) {
        if(this.body.hasClass("interior-hero-chevron")) {
          this.secondRow.addClass("chevron");
        }
        if(this.body.hasClass("interior-hero-diagonal-left")) {
          this.secondRow.addClass("diagonal-left");
        }
        if(this.body.hasClass("interior-hero-diagonal-right")) {
          this.secondRow.addClass("diagonal-right");
        }
        if(this.body.hasClass("interior-hero-straight")) {
          this.secondRow.addClass("straight");
        }
      }

      if(!this.secondRow.is(this.shapeClassesAll)) {
        this.childTheme = JSON.stringify(dataLayer);
        this.cascadeBold = "Cascade - Bold";
        this.cascadeClassic = "Cascade - Classic";
        if(this.childTheme.indexOf(this.cascadeBold) !== -1) {
          this.secondRow.addClass("diagonal-left");
        }
        if(this.childTheme.indexOf(this.cascadeClassic) !== -1) {
          this.secondRow.addClass("chevron");
        }
      }

      this.rows.each(function(index, element){

        var $this = $(element);

        if(!($this.is(this.shapeFallbackExceptions))) {

          if($this.is(this.shapeClasses)) {
            $this.addClass("shape-fallback");
            $this.prepend("<div class='top-shape'></div>");
            if($this.hasClass("chevron")) {
              $this.find(".top-shape").prepend("<div class='shape-left'></div><div class='shape-right'></div>");
            }
          }

          if(!$this.is(".row:last-of-type")) {

            this.nextRow = $this.next();

            if(this.nextRow.is(this.shapeFallbackExceptions) && this.nextRow.is(this.shapeClasses)) {
              $this.append("<div class='bottom-shape'></div>");

              if(this.nextRow.hasClass("chevron")) {
                $this.addClass("chevron-b-shape-fallback");
              }

              if(this.nextRow.hasClass("diagonal-left")) {
                $this.addClass("left-diagonal-b-shape-fallback");
              }

              if(this.nextRow.hasClass("diagonal-right")) {
                $this.addClass("right-diagonal-b-shape-fallback");
              }

            }

          }

        }

      }.bind(this));

      this.rowFallbacks = $(".shape-fallback");
      this.rowBFallbacks = "[class*='b-shape-fallback']";

    }

  },

  cssFallbacks: function() {

    if(this.supportsCSS) {
      if(!CSS.supports("( clip-path: polygon(50% 0%, 0% 100%, 100% 100%) ) or ( -moz-clip-path: polygon(50% 0%, 0% 100%, 100% 100%) ) or ( -o-clip-path: polygon(50% 0%, 0% 100%, 100% 100%) ) or ( -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%) )")) {
        this.clipPathSupport();
      }
      if(!CSS.supports("(object-fit: cover) or (object-position: center)")) {
        this.objectFitSupport();
      }
    } else {
      this.clipPathSupport();
      this.objectFitSupport();
    }

  },

  /*------------------------------------------------------------------
  [ 15. Sticky Navigation ]
  */

  stickyNav: function() {

    this.heroHeight = this.hero.height();

    if (this.window.scrollTop() >= 200) {
      // Add layout width media query to this,
      // and dial "200" value to be dynamic
      // with different sized logos
      this.body.addClass("stuck");
    } else{
      this.body.removeClass("stuck");
    }

    if (this.window.scrollTop() >= this.heroHeight) {
      this.body.addClass("hide-hero");
    } else{
      this.body.removeClass("hide-hero");
    }

  },

  /*------------------------------------------------------------------
  [ 16. Poly Shapes ]
  */

  polyShapes: function() {

    if(this.body.hasClass("clip-path-fallbacks")) {

      this.rowFallbacks.each(function(index, element) {

        var $this = $(element);

        this.shapeWidth = $(window).width(),
        // this.triangleHeight = Math.round(this.triangleWidth * 112 / 1440);
        this.shapeHeight = this.shapeWidth * 112 / 1440;
        this.topShape = $this.find(".top-shape");
        this.shapeColor = $this.css("background-color");

        if($this.hasClass("chevron")) {
          this.topShapeLeft = this.topShape.find(".shape-left");
          this.topShapeRight = this.topShape.find(".shape-right");
          this.topShape.css({
            "top" : -this.shapeHeight + 'px'
          });
          this.topShapeLeft.css({
            "border-bottom" : this.shapeHeight + 'px solid ' + this.shapeColor,
            "border-right" : this.shapeWidth / 2 + 'px solid transparent'
          });
          this.topShapeRight.css({
            "border-bottom" : this.shapeHeight + 'px solid ' + this.shapeColor,
            "border-left" : this.shapeWidth / 2 + 'px solid transparent'
          });
        }

        if($this.is(".diagonal-left, .diagonal-right")) {
          this.topShape.css({
            "border-bottom" : this.shapeHeight + 'px solid ' + this.shapeColor,
            "top" : -this.shapeHeight + 'px'
          });
        }

        if($this.hasClass("diagonal-right")) {
          this.topShape.css({
            "border-left" : this.shapeWidth + 'px solid transparent'
          });
        }

        if($this.hasClass("diagonal-left")) {
          this.topShape.css({
            "border-right" : this.shapeWidth + 'px solid transparent'
          });
        }

        if($this.is(this.rowBFallbacks)) {
          this.bottomShape = $this.find(".bottom-shape");

          if($this.hasClass("chevron-b-shape-fallback")) {
            this.bottomShape.css({
              "border-left" : this.shapeWidth / 2 + 'px solid transparent',
              "border-right" : this.shapeWidth / 2 + 'px solid transparent',
              "border-top" : this.shapeHeight + 'px solid ' + this.shapeColor,
              "bottom" : -this.shapeHeight + 'px'
            });
          }

          if($this.is("[class*='diagonal-b']")) {
            this.bottomShape.css({
              "border-top" : this.shapeHeight + 'px solid ' + this.shapeColor,
              "bottom" : -this.shapeHeight + 'px'
            });
          }

          if($this.hasClass("right-diagonal-b-shape-fallback")) {
            this.bottomShape.css({
              "border-right" : this.shapeWidth + 'px solid transparent'
            });
          }

          if($this.hasClass("left-diagonal-b-shape-fallback")) {
            this.bottomShape.css({
              "border-left" : this.shapeWidth + 'px solid transparent'
            });
          }
        }

      }.bind(this));

    }

  },

  /*------------------------------------------------------------------
  [ 17. Add FortAwesome ]
  */

  addFortAwesome: function() {

    if(!(this.blogFeed.length || this.blogFeedV2.length || this.contactInfoSheetAny.length || this.neighborhoodMap.length)) {

    }

  },

  /*------------------------------------------------------------------
  [ 18. Menu Button Click ]
  */

  menuButtonClick: function() {
    this.body.toggleClass("menu-open");
  }

};

/*------------------------------------------------------------------
[ X. On Page Ready ]
*/

$(function() {cascade.initialize();});


/*------------------------------------------------------------------
[ X. On Scroll ]
*/

$(document).scroll(function() {cascade.onScroll()});

/*------------------------------------------------------------------
[ X. On Smart Resize ]
*/

$(window).smartresize(function() {cascade.onSmartResize()});
