var wellborne = {

  maxMedium: function(){
    if (Modernizr.mq("(max-width: 979px)")) {
      return true;
    }
  },

  minMedium: function(){
    if (Modernizr.mq("(min-width: 980px)")) {
      return true;
    }
  },

  adjustPhone: function(){
    var phoneWidth = $(".u-logo").width();
    var phone = $(".appended-phone .p-tel, .appended-phone .tel");
    if (this.minMedium()){
      phone.width(phoneWidth);
      phone.css({
        "opacity" : "1"
      });
      $('.appended-phone').css("display", "inline-block");
    }
  },

  movePhone: function(){
    if (this.maxMedium()){
      $("header a.appended-phone").appendTo("header .buttons");
    }
    else if (this.minMedium()){
      $("header a.appended-phone").appendTo("header h1");
    }
  },

  hasCorporateNav: function(){
    var corpNav = $('nav.corporate-navigation').length > 0;
    if (corpNav){
      return $('body').addClass('has-corp-nav');
    }
  },

  headerBtn: function(){
    var headerBtn = $('.navigation-container').find('.button');
    if (headerBtn){
      return $('body').addClass('has-header-btn');
    }
  },

  heroWidgets: function() {
    $('.web-home-template .row:first-child .column-content > div').not(':first-child').wrapAll('<div class="hero-widgets" />');

    if ($('.web-home-template .row:first-child, .hero, .cinemagraph-hero').find('.widget:not(.photo):not(.cinemagraph)').length > 0) {
      setTimeout(function() {
        $('.widget').css('visibility', 'visible');
      }, 100);
    }
  },

  objectFit: function() {
    // object fit polyfill for IE and an array of mobile devices

    var objectFitImages=function(){"use strict";var t="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";var e=t+t;var r=/(object-fit|object-position)\s*:\s*([-\w\s%]+)/g;var i=new Image;var n="object-fit"in i.style;var s="object-position"in i.style;var c=typeof i.currentSrc==="string";var o=i.getAttribute;var l=i.setAttribute;var a=false;function u(t){var e=getComputedStyle(t).fontFamily;var i;var n={};while((i=r.exec(e))!==null){n[i[1]]=i[2]}return n}function f(r,i){if(r[e].parsingSrcset){return}var s=u(r);if(!r[t]&&!r[e].skipTest){if(!s["object-fit"]||s["object-fit"]==="fill"){return}if(n&&!s["object-position"]){return}}var l=r.currentSrc||r.src;if(i){l=i}else if(r.srcset&&!c&&window.picturefill){r[e].parsingSrcset=true;if(!r[window.picturefill._.ns]||!r[window.picturefill._.ns].evaled){window.picturefill._.fillImg(r,{reselect:true})}var a=r[window.picturefill._.ns];if(!a.curSrc){a.supported=false;window.picturefill._.fillImg(r,{reselect:true})}delete r[e].parsingSrcset;l=a.curSrc||l}if(r[t]){r[t].s=l;if(i){r[t].srcAttr=i}}else{r[t]={s:l,srcAttr:i||o.call(r,"src"),srcsetAttr:r.srcset};r.src=t;if(r.srcset){r.srcset="";Object.defineProperty(r,"srcset",{value:r[t].srcsetAttr})}g(r)}r.style.backgroundImage='url("'+l+'")';r.style.backgroundPosition=s["object-position"]||"center";r.style.backgroundRepeat="no-repeat";if(/scale-down/.test(s["object-fit"])){if(!r[t].i){r[t].i=new Image;r[t].i.src=l}(function f(){if(r[t].i.naturalWidth){if(r[t].i.naturalWidth>r.width||r[t].i.naturalHeight>r.height){r.style.backgroundSize="contain"}else{r.style.backgroundSize="auto"}return}setTimeout(f,100)})()}else{r.style.backgroundSize=s["object-fit"].replace("none","auto").replace("fill","100% 100%")}}function g(e){var r={get:function(){return e[t].s},set:function(r){delete e[t].i;f(e,r);return r}};Object.defineProperty(e,"src",r);Object.defineProperty(e,"currentSrc",{get:r.get})}function A(t,e){window.addEventListener("resize",b.bind(null,t,e))}function d(t){if(t.target.tagName==="IMG"){f(t.target)}}function p(){if(!s){HTMLImageElement.prototype.getAttribute=function(e){if(this[t]&&(e==="src"||e==="srcset")){return this[t][e+"Attr"]}return o.call(this,e)};HTMLImageElement.prototype.setAttribute=function(e,r){if(this[t]&&(e==="src"||e==="srcset")){this[e==="src"?"src":e+"Attr"]=String(r)}else{l.call(this,e,r)}}}}function b(t,r){var i=!a&&!t;r=r||{};t=t||"img";if(s&&!r.skipTest){return false}if(typeof t==="string"){t=document.querySelectorAll("img")}else if(!t.length){t=[t]}for(var n=0;n<t.length;n++){t[n][e]=r;f(t[n])}if(i){document.body.addEventListener("load",d,true);a=true;t="img"}if(r.watchMQ){delete r.watchMQ;A(t,r)}}b.supportsObjectFit=n;b.supportsObjectPosition=s;p();return b}();

    $('.web-page-template .row:first-of-type .photo img').get().forEach(objectFitImages);
  },

  galleryWidget: function() {
    $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');
  }

};

$(function() {
  wellborne.adjustPhone();
  wellborne.hasCorporateNav();
  wellborne.headerBtn();
  wellborne.movePhone();
  wellborne.heroWidgets();
  wellborne.objectFit();
  wellborne.galleryWidget();
});

$(window).on('resize orientationchange', function(){
  wellborne.adjustPhone();
  wellborne.movePhone();
});
