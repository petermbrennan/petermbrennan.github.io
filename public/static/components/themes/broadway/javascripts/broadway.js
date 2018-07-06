$(window).load(function() {
  broadway.moveCorpHome();
  broadway.formatPhone();
  broadway.heroWidgetContainer();
  broadway.cinemagraphWidgetContainer();
  broadway.miniGalleryFlexNav();
  broadway.moveLogo();
  broadway.addGalleryContainer();
  broadway.fitNavMenuFonts();
  broadway.firstRowClass();
  broadway.moveTranslateFooter();
  broadway.mobilePhoneIcon();
  broadway.heroGalleryBasic();
});

$(window).on('resize orientationchange', function(){
  broadway.miniGalleryFlexNav();
  broadway.moveLogo();
  broadway.adjustHeader();
  broadway.mobilePhoneIcon();
});

if (typeof $(window).smartresize === 'function'){
  $(window).smartresize(function() {
    broadway.fitNavMenuFonts();
  });
}

var broadway = {
    // menu font scaling controls
  menuFont: {
    family: '',   // font family
    max: 20,      // max font size in px
    min: 12,       // min font size in px
    cur: 0,       // cur font size (leave at 0 to auto-initialize)
    // height: 105,  // max height of target container
    inc: 0.5      // font scale increments
  },
  phone: '.appended-phone .p-tel, .appended-phone .tel',  // remove second def after microformat test
  heroRow: '.web-home-template .row:first-of-type',
  heroCol: '.web-home-template .row:first-of-type .column-content',



  minXsmall: function(){
    if (Modernizr.mq("(min-width: 480px)")) {
      return true;
    }
  },

  minSmall: function(){
    if (Modernizr.mq("(min-width: 700px)")) {
      return true;
    }
  },

  minMedium: function(){
    if (Modernizr.mq("(min-width: 980px)")) {
      return true;
    }
  },

  adjustHeader: function(){
    var secondRowH = $('.row:nth-child(2)').outerHeight(),
        header = $('[role=banner]');

    if($(document).scrollTop() > 1) {
        header.addClass('small');
        $('body').addClass('has-small-nav');
    } else {
        header.removeClass('small');
        $('body').removeClass('has-small-nav');
    }
  },

  // ---------------------------------------------------
  //  Move logo container outside of header for mobile
  // ---------------------------------------------------

  moveLogo: function(){
    var logo = $('.logo-container');
    if (Modernizr.mq("(max-width: 699px)") && logo.length) {
      logo.insertAfter('[role=banner]');
    } else if (Modernizr.mq("(min-width: 700px)") && logo.length) {
      logo.appendTo('[role=banner] .content');
    }

    logo.css({"display": "block"});
  },

  // ---------------------------------------------------
  //  Move Google Translate in Footer
  // ---------------------------------------------------

  moveTranslateFooter: function() {
    var translate = $('footer > #drop-target-footer.content > #google_translate_element');
    $(translate).detach();
    $('#drop-target-footer > .contact-info').append($(translate));
  },

  // ---------------------------------------------------
  //  Clone navigation '.corporate-home li' and add to
  //  header btn
  // ---------------------------------------------------
  moveCorpHome: function(){
    var corpHome = $('.corporate-home a');

    if (corpHome.length) {
        var copyCorpBtn = (corpHome).clone().addClass("btn"),
            newBtn = copyCorpBtn.wrap("<span class='button corp-home'></span>").parent();

      newBtn.appendTo('header #drop-target-btn');
    }
  },

  // ---------------------------------------------------
  //  Wrap '()' around phone zip
  // ---------------------------------------------------
  formatPhone: function(){
    if($(this.phone).length) {
      $(this.phone).text(function (i, el) {
        var phone = (el).replace(/[^0-9]/g, '');
        phone = (phone).replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        return phone;
      });
    }
  },

  // ---------------------------------------------------
  //  Mobile Phone Icon
  // ---------------------------------------------------
  mobilePhoneIcon: function(){
    var icon = "<span class='icn-phone'></span>";
     if ($(this.phone).length) {
       if (Modernizr.mq("(max-width: 699px)") && $(this.phone).parent().hasClass('icn-phone')) {
         return;
       } else if (Modernizr.mq("(max-width: 699px)") && !$(this.phone).parent().hasClass('icn-phone')) {
         $(this.phone).wrap($(icon));
       } else if (Modernizr.mq("(min-width: 700px)") && $(this.phone).parent().hasClass('icn-phone')) {
         $(this.phone).unwrap($(icon));
       }
     }
   },

  // ---------------------------------------------------
  //  Add 2 wrapping containers to hero stripe to add
  //  container styles around more than 1 widget
  // ---------------------------------------------------
  heroWidgetContainer:  function(){
    // var heroCol = $(this.heroRow).find('.column-content'),

    if(broadway.hasHeroImg()){
      var imgRow = $(this.heroCol).find('.row-1'),
          blah = $("<div class='hero-widget-container'><div class='inner-widget-container'></div></div>");

      if ($(this.heroCol).children().length > 1){
        imgRow.after(blah);

        $(this.heroCol).children().map(function(i, el){
            if (!$(el).hasClass('hero-widget-container')){
              if ((!$(el).hasClass('row-1') && !$(el).find('.photo').length) && $(el).hasClass('row-'+i)){
                $(blah).find('.inner-widget-container').append($(el));
              }
            }
        });

        (blah).find('.inner-widget-container').children().each(function(i, el){
          $(el).css('display', 'block');
        });
      }
    }
  },

  hasHeroImg: function(){
    // var heroCol = $(this.heroRow).find('.column-content');
    var widgetType = $(this.heroCol).children().first().find('.widget');

    if ($(widgetType).is('.photo') || $(widgetType).is('.gallery-basic')){
      return true;
    }
  },

  heroGalleryBasic: function(){
    var hasGallery = $(this.heroRow).find('.gallery-basic');
    if (hasGallery.length) {
      $(this.heroRow).children().first().addClass('hero-gallery');
      hasGallery.css('opacity','1');
    }

  },

  cinemagraphWidgetContainer:  function(){
    var heroRow = $('.web-home-template .row:first-of-type'),
        heroCol = (heroRow.find('.column-content')),
        heroCin = heroCol.children().first().find('.cinemagraph');

    if(heroCin.length){
      var cinRow = $(heroCol).find('.row-1'),
          blah = $("<div class='hero-widget-container'><div class='inner-widget-container'></div></div>");

      if (heroCol.children().length > 1){
        cinRow.after(blah);

        (heroCol).children().map(function(i, el){
            if (!$(el).hasClass('hero-widget-container')){
              if ((!$(el).hasClass('row-1') && !$(el).find('.cinemagraph').length) && $(el).hasClass('row-'+i)){
                $(blah).find('.inner-widget-container').append($(el));
              }
            }
        });

        (blah).find('.inner-widget-container').children().each(function(i, el){
          $(el).css('display', 'block');
        });
      }
    }
  },

  // ---------------------------------------------------
  //  Centers mini gallery arrows vertically if < 980px
  // ---------------------------------------------------
  miniGalleryFlexNav: function(){
    var miniG = $('.mini-gallery');

    if(miniG.length > 0) {
      (miniG).each(function(i, el){
        $(el).find('.flex-direction-nav li').each(function(i, el){
          var slideImg = $(el).parent('ul').parent().find('.slides img'),
              imgH = slideImg.height(),
              navT = ((imgH/2) - 25);
          $(el).find('a').each(function(i,el){
            if(!broadway.minMedium()){
              $(el).css('top', navT);
            } else if (broadway.minMedium()) {
              $(el).css('top', '0');
            }
          });
        });
      });
    }
  },

  addGalleryContainer: function(){
     $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');
  },


  /**
  * Attempts to fit any given font-family into the space allocated for the #nav (in desktop mode only)
  **/
  fitNavMenuFonts: function(){
    if (this.minMedium()) {
      var nav = $('.navigation');
      var topTierLinks = nav.find('a');
      var navWidth = Math.floor(nav.width());

      if (!this.menuFont.cur){
        this.menuFont.cur = parseInt(topTierLinks.first().css('font-size'));
      }
      if (!this.menuFont.family.length && nav.length > 0){
        this.menuFont.family = topTierLinks.first().css('font-family');
      }

      // set starting font size (reduces double-tapping on resize events)
      var fontSize = this.menuFont.cur;

      // if actual nav width is less than total width needed, shrink font until it fits or min is reached
      if (navWidth <= this.getNavMenuWidth()){
        while (navWidth <= this.getNavMenuWidth() && fontSize > this.menuFont.min){
          fontSize -= this.menuFont.inc;
          topTierLinks.css('font-size',fontSize+'px');
        }
      }
      // if actual nav width is greater than total width needed, increase font until it fits or max is reached
      else {
        while (navWidth > this.getNavMenuWidth() && fontSize < this.menuFont.max){
          fontSize += this.menuFont.inc;
          topTierLinks.css('font-size',fontSize+'px');
        }
        while (navWidth <= this.getNavMenuWidth() && fontSize >= this.menuFont.min){
          fontSize -= this.menuFont.inc;
          topTierLinks.css('font-size',fontSize+'px');
        }
      }

      // remember last font size
      this.menuFont.cur = fontSize;
    } else {
      if (this.menuFont.cur != this.menuFont.max){
        this.menuFont.cur = this.menuFont.max;
        $('.navigation .top-nav a').css('font-size', this.menuFont.cur);
      }
    }
  },

  /**
   * Sums up the actual outer widths of each LI in the #nav, so we can manually detect overflow
   *
   * @return    {integer}     pixel width of total LIs in #nav
   */
  getNavMenuWidth: function(){
    var nw = 0;
    $('.navigation .top-nav > li').each(function(){
      nw += $(this).outerWidth();
    });
    return nw + this.getBrowserWidthFix();
  },

  /**
   * Firefox and IE don't get the right outerWidth calcs (they use floor versus ceiling),
   * so adjust by the partial remaining partial pixels
   */
  getBrowserWidthFix: function(){
    if ($('body').hasClass('firefox') || $('body').hasClass('msie')){
      return $('.navigation .top-nav > li').length; // add 1px for each LI
    }
    return 0;
  },

  firstRowClass: function(){
    var heroRow = $('.web-page-template .row:first-of-type'),
        heroCol = heroRow.find('.row-single .column-content'),
        heroImg = heroCol.find(".row-1 .photo"),
        heroCin = heroCol.find(".row-1 .cinemagraph");

    if(heroImg.length || heroCin.length){
      $('[role=main]').find('.row:first-of-type').addClass('has-photo');
    }
  },
};


if (broadway.minMedium()){
  $(window).bind('scroll', function(){
    broadway.adjustHeader();
  });
}
