$(window).load(function() {
  wellborneTraditions.adjustPhone();
  wellborneTraditions.hasCorporateNav();
  wellborneTraditions.hasTagline();
  wellborneTraditions.countCTAs();
  wellborneTraditions.centerCallout();
  wellborneTraditions.homeMfIui();
  wellborneTraditions.adjustZipPlaceholder();
  wellborneTraditions.taglinePadding();
  wellborneTraditions.addWidgetClass();
  wellborneTraditions.adjustAreaPage();
  wellborneTraditions.moveTranslateFooter();
  wellborneTraditions.galleryWidget();
});

$(window).on('resize orientationchange', function(){
  wellborneTraditions.adjustPhone();
  wellborneTraditions.centerCallout();
  wellborneTraditions.hasTagline();
  wellborneTraditions.taglinePadding();
  wellborneTraditions.adjustZipPlaceholder();
});

var wellborneTraditions = {

  minXsmall: function(){
    if (Modernizr.mq("(min-width: 480px)")) {
      return true;
    }
  },

  minSmall: function(){
    if (Modernizr.mq("(min-width: 640px)")) {
      return true;
    }
  },

  minMedium: function(){
    if (Modernizr.mq("(min-width: 910px)")) {
      return true;
    }
  },

  areaPage: function() {
    if ($('body').hasClass('area')) {
      return true;
    }
  },

  homeMfIui: function(){
    var homeMf = $(".callout-wrapper").find(".home-multifamily-iui");
    if (homeMf.length) {
      $(".callout-wrapper").find('.row-grid').addClass('home-mf-iui');
    }
  },

  adjustPhone: function(){
    var headerBtn = $('.navigation-container').find('.button');
    if (headerBtn.length > 0){
      $('.navigation-container').addClass('has-header-btn');
      if (this.minSmall()){
        $('.has-header-btn').find('.appended-phone').css({
          "display" : "block",
          "right" : (headerBtn.width() + 10) + "px"
        });
      } else {
         $('.has-header-btn').find('.appended-phone').css({
          "display" : "block",
          "right" : (70) + "px"
        });
      }
    } else {
      $('.navigation-container').addClass('no-header-btn');
      $('.appended-phone').css("display", "block");
    }
  },

  hasCorporateNav: function(){
    var corpNav = $('nav.corporate-navigation').length > 0;
    if (corpNav){
      return $('body').addClass('has-corp-nav');
    } else if (!corpNav && !$('body').hasClass('site-corporate')){
        return $('body').addClass('sans-corp-nav');
    }
  },

  centerCallout: function(){
    var obj = $('.callout-wrapper').find('.row-grid');
    if (this.minMedium()){
      obj.css({
        "display": "block",
        "position": "absolute",
        "left": ((($(window).width() - obj.outerWidth()) / 2) + "px")
      });
    } else if (!this.minMedium()){
      obj.css({
        "display": "block",
        "position": "relative",
        "left":"0px"
      });
    }
  },

  hasTagline: function(){
    var mainCallout = $('.callout-wrapper .col');
    mainCallout.each(function() {
      if ($(this).find(".html").length > 0){
        var tagline = $(this).addClass("tagline");
      }
    });
  },

  taglinePadding: function(){
    var calloutW = $('.callout-wrapper .row-grid');
    var tagline = calloutW.find($('.tagline'));
    // > 910px with tagline
    if (this.minMedium() && tagline.length) {
      $('.callout-wrapper').next().css({
        "padding-top": ((calloutW.outerHeight()* 0.85) + "px")
      });
    // < 910px with tagline
    } else if (!this.minMedium() && tagline.length) {
      $('.callout-wrapper').next().css({"padding-top": "32px"});
    // > 910px without tagline
    } else if (this.minMedium() && !tagline.length) {
      $('.callout-wrapper').next().css({"padding-top": "48px"});
    // otherwise set to 48px
    } else {
      $('.callout-wrapper').next().css({"padding-top": "48px"});
    }
  },

  moveTranslateFooter: function() {
    var translate = $('footer > #drop-target-footer.content > #google_translate_element');
    $(translate).detach();
    $('#drop-target-footer > .contact-info').append($(translate));
  },

  countCTAs: function(){
    var ctas = $('.callout-wrapper').find('.col').find('li');
    var ctaContainer = $('.callout-wrapper').find('.row-grid');
    ctas.each(function(i, elem){
      $(elem).addClass("cta-"+(i+1));
      if ($('.callout-wrapper .action-calls').children().length == 1 && $('.callout-wrapper .city-state-zip-search').length > 0) {
        $(ctaContainer).addClass('cta-search');
      } else if ($('.callout-wrapper .action-calls').find('li').length == 1 && $('.callout-wrapper .tagline').length > 0 && !$('.callout-wrapper .locations-navigation').length){
        $(ctaContainer).addClass('single-tag');
      } else if ($('.callout-wrapper .action-calls').find('li').length >= 1 && !$('.callout-wrapper .locations-navigation').length){
        $(ctaContainer).addClass(this.getNumberName(ctas.length));
      }
    }.bind(this));
  },

  getNumberName: function(num) {
    var numbers = ['single','double','triple','quadruple', 'quintuple'];
    if (num > 0){
      var value = numbers.length ? numbers[num-1] : "";
      return value;
    }
  },

  calculateWidth: function(elem){
    var totalWidth = 0;

    $(elem).each(function(index) {
        totalWidth += parseInt($(elem).width(), 10);
    });
  },

  addWidgetClass: function(){
    var widgetClasses = ['.city-state-zip-search', '.corporate-search', '.locations-navigation', '.self-storage-search-home'];
    var rowGrid = $('.callout-wrapper .row-grid');

    $(widgetClasses).each(function(i, elem){
      var wrapperClass = $('.callout-wrapper ').find(elem);
      if (wrapperClass.hasClass('city-state-zip-search') && $('.callout-wrapper .action-calls').length == 0 && $(rowGrid).find('.tagline').length) {
        rowGrid.addClass('corp-zip-title');
      } else if (wrapperClass.hasClass('city-state-zip-search') && $('.callout-wrapper .action-calls').length <= 0) {
         rowGrid.addClass('corp-zip');
      } else if (wrapperClass.hasClass('corporate-search')){
        rowGrid.addClass('corp-search');
      } else if (wrapperClass.hasClass('locations-navigation') && !rowGrid.find('.tagline').length) {
        rowGrid.addClass('corp-locs');
      } else if (wrapperClass.hasClass('locations-navigation')) {
        rowGrid.addClass('locs-title');
      } else if (wrapperClass.hasClass('self-storage-search-home')) {
        rowGrid.addClass('ss-search-home');
      }
    });
  },

  adjustZipPlaceholder: function(){
    var input = $(".zip-search-input input[type='text']");
    return input.attr("placeholder"
      ,(input.length >= 1 && !wellborneTraditions.minXsmall())
      ? "City, state, zip"
      : "Search by city, state or zip")
  },

  adjustAreaPage: function(){
    if (this.areaPage) {
      var logoH = $('.logo img').height();
      $('.area-page').css('margin-top', (logoH * 0.75));
    }
  },

  galleryWidget: function() {
    $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');
  }

};
