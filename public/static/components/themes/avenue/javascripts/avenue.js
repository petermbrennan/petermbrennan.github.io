var avenue = {

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

  // smooth faux parallax action for hero object
  heroParallax: function() {
    var $fwindow = $(window),
        $body = $(document),
        $hero = $('.row:first-child'),
        $widget = $('.row:first-child .hero-widgets');

    if (this.breakpoints.hero()) {
      $fwindow.on('scroll', function() {
        var scrollTop = $body.scrollTop();
        $hero.css('top', -(scrollTop - scrollTop / 1.25));
        $widget.css('margin-top', -(scrollTop - scrollTop / 1.35));
      });
    }
    else {
      $fwindow.off('scroll');
      $hero.css('top', 0);
      $widget.css('margin-top', 0);
    }
  },

  // helps adjust styling for other bar elements
  hasHeaderBtn: function(){
    if ($('header .navigation-container .buttons').find('.button').length > 0) {
      return $('body').addClass('has-header-btn');
    }
  },

  // pin navigation to hero bottom, then top on scroll
  navBarScroll: function(){
    var $navpin = $('.pin-to-bottom');

    if ($navpin.length > 0) {
      var $navpos = $navpin.offset();
    }

    if (this.breakpoints.hero() && $navpin.length > 0) {
      $(window).bind('scroll', function () {
        if ($(window).scrollTop() > $navpos.top) {
          $navpin.addClass('pin-to-top');
        } else {
          $navpin.removeClass('pin-to-top');
        }
      });
    } else if (this.breakpoints.hero() && $navpin.length == 0) {
      $('.navbar-content').addClass('pin-to-bottom');
    } else {
      $navpin.addClass('pin-to-top');
      $navpin.removeClass('pin-to-bottom');
    }
  },

  // insert arrow after last character if subnav - replace with graphic on Amazon cloud
  navArrow: function() {
    $('[role=banner] .navigation > ul > li.has-subnav > a').append('<img class="nav-arrow" alt="" src="//themes.g5dxm.com/avenue/nav-arrow.png" />');
  },

  // Home page hero widgets on first stripe
  heroWidgets: function() {
    var firstRow = $('.web-home-template .row:first-child .column-content > div');
    firstRow.not(':first-child').not(':nth-child(3)').wrapAll('<div class="hero-widgets" />');

    // Delay view of hero widgets to avoid resizing
    if ((firstRow).find('.widget').length > 0) {
      setTimeout(function() {
        $('.widget').css('opacity', 1);
      }, 100);
    }
  },

  // html editor uses inline styles for centering but we need stylesheet control if centered
  headingPosition: function() {
    var maincontent = $('[role=main]'),
        h1center = $('[role=main] h1'),
        h2center = $('[role=main] h2'),
        h3center = $('[role=main] h3');

    $('[role=main] h1[style*="' + 'text-align: center' + '"]').addClass('center-for-reals');
    $('[role=main] h2[style*="' + 'text-align: center' + '"]').addClass('center-for-reals');
    $('[role=main] h3[style*="' + 'text-align: center' + '"]').addClass('center-for-reals');

    // pause for repositioning
    if ((maincontent).find(h1center, h2center, h3center).length > 0) {
      setTimeout(function() {
        $(h1center).css('opacity', 1);
        $(h2center).css('opacity', 1);
        $(h3center).css('opacity', 1);
      }, 100);
    }
    // $( '[role=main] h2[style*="' + 'text-align:center' + '"], [role=main] h2[style*="' + 'text-align: center' + '"]' ).addClass( 'center-for-reals' );
  },

  // funky positioning for corp home button
  corpHomeButton: function() {
    var corpHome = $('.corporate-home a');

    if (corpHome.length) {
      (corpHome).clone().addClass("btn").wrap("<span class='button corporate-home'></span>").parent().appendTo('header .navigation-container');
    }
  },

  // pizzazz that hamburger!
  mobileMenu: function() {
    var mobilemenu = {

    el: {
      ham: $('.mobile-button'),
      menuTop: $('.m-top'),
      menuMiddle: $('.m-middle'),
      menuBottom: $('.m-bottom')
    },

    init: function() {
      mobilemenu.bindUIactions();
    },

    bindUIactions: function() {
      mobilemenu.el.ham
          .on(
            'click',
          function(event) {
          mobilemenu.activateMenu(event);
          event.preventDefault();
        }
      );
    },

    activateMenu: function() {
      mobilemenu.el.menuTop.toggleClass('m-top-click');
      mobilemenu.el.menuMiddle.toggleClass('m-middle-click');
      mobilemenu.el.menuBottom.toggleClass('m-bottom-click');
    }
  };

  mobilemenu.init();
  },

  // there is no way a typical logo will work in current design as-is
  adjustLogoSize: function() {
    var logoHeight = $('.logo-container img');

    if (logoHeight.height() > 110) {
      (logoHeight).addClass("too-tall");
    }
  },

  // yes, let's please be this nitpicky
  contactInfoOrder: function() {
    var phone = $('[role=main] .contact-info .phone'),
          address = $('[role=main] .contact-info .adr-ret, [role=main] .contact-info .adr');

    address.insertBefore(phone);

    // Delay view of contact-info until swap complete
    if ($('[role=main]').find('.contact-info').length > 0) {
      setTimeout(function() {
        $('.contact-info').css('opacity', 1);
      }, 100);
    }
  },

  // object fit polyfill for IE and an array of mobile devices
  objectFit: function() {

    var objectFitImages=function(){"use strict";var t="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";var e=t+t;var r=/(object-fit|object-position)\s*:\s*([-\w\s%]+)/g;var i=new Image;var n="object-fit"in i.style;var s="object-position"in i.style;var c=typeof i.currentSrc==="string";var o=i.getAttribute;var l=i.setAttribute;var a=false;function u(t){var e=getComputedStyle(t).fontFamily;var i;var n={};while((i=r.exec(e))!==null){n[i[1]]=i[2]}return n}function f(r,i){if(r[e].parsingSrcset){return}var s=u(r);if(!r[t]&&!r[e].skipTest){if(!s["object-fit"]||s["object-fit"]==="fill"){return}if(n&&!s["object-position"]){return}}var l=r.currentSrc||r.src;if(i){l=i}else if(r.srcset&&!c&&window.picturefill){r[e].parsingSrcset=true;if(!r[window.picturefill._.ns]||!r[window.picturefill._.ns].evaled){window.picturefill._.fillImg(r,{reselect:true})}var a=r[window.picturefill._.ns];if(!a.curSrc){a.supported=false;window.picturefill._.fillImg(r,{reselect:true})}delete r[e].parsingSrcset;l=a.curSrc||l}if(r[t]){r[t].s=l;if(i){r[t].srcAttr=i}}else{r[t]={s:l,srcAttr:i||o.call(r,"src"),srcsetAttr:r.srcset};r.src=t;if(r.srcset){r.srcset="";Object.defineProperty(r,"srcset",{value:r[t].srcsetAttr})}g(r)}r.style.backgroundImage='url("'+l+'")';r.style.backgroundPosition=s["object-position"]||"center";r.style.backgroundRepeat="no-repeat";if(/scale-down/.test(s["object-fit"])){if(!r[t].i){r[t].i=new Image;r[t].i.src=l}(function f(){if(r[t].i.naturalWidth){if(r[t].i.naturalWidth>r.width||r[t].i.naturalHeight>r.height){r.style.backgroundSize="contain"}else{r.style.backgroundSize="auto"}return}setTimeout(f,100)})()}else{r.style.backgroundSize=s["object-fit"].replace("none","auto").replace("fill","100% 100%")}}function g(e){var r={get:function(){return e[t].s},set:function(r){delete e[t].i;f(e,r);return r}};Object.defineProperty(e,"src",r);Object.defineProperty(e,"currentSrc",{get:r.get})}function A(t,e){window.addEventListener("resize",b.bind(null,t,e))}function d(t){if(t.target.tagName==="IMG"){f(t.target)}}function p(){if(!s){HTMLImageElement.prototype.getAttribute=function(e){if(this[t]&&(e==="src"||e==="srcset")){return this[t][e+"Attr"]}return o.call(this,e)};HTMLImageElement.prototype.setAttribute=function(e,r){if(this[t]&&(e==="src"||e==="srcset")){this[e==="src"?"src":e+"Attr"]=String(r)}else{l.call(this,e,r)}}}}function b(t,r){var i=!a&&!t;r=r||{};t=t||"img";if(s&&!r.skipTest){return false}if(typeof t==="string"){t=document.querySelectorAll("img")}else if(!t.length){t=[t]}for(var n=0;n<t.length;n++){t[n][e]=r;f(t[n])}if(i){document.body.addEventListener("load",d,true);a=true;t="img"}if(r.watchMQ){delete r.watchMQ;A(t,r)}}b.supportsObjectFit=n;b.supportsObjectPosition=s;p();return b}();

    $('.web-page-template .row:first-of-type .photo img').get().forEach(objectFitImages);
    $('.gallery .flex-control-thumbs li img').get().forEach(objectFitImages);
  }

}

$(function() {
  if ($('body').hasClass('web-home-template')) {
    avenue.heroParallax();
    avenue.navBarScroll();

    $(window).smartresize(function() {
      avenue.heroParallax();
      avenue.navBarScroll();
    });
  }

  avenue.navArrow();
  avenue.hasHeaderBtn();
  avenue.heroWidgets();
  avenue.headingPosition();
  avenue.corpHomeButton();
  avenue.mobileMenu();
  avenue.adjustLogoSize();
  avenue.contactInfoOrder();
  avenue.objectFit();
});
