/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 *
 * Modified by Steve Craig - https://github.com/thescubageek
 */

;(function($) {

  $.fn.unveil = function(options){
    return this.doUnveil(options);
  };

  $.fn.skipUnveil = function(options){
    var images = this,
        retina = window.devicePixelRatio > 1,
        attrib = retina ? "data-src-retina" : "data-src";

    function unveilAll(){
      images.each(function(idx, elem){
        $e = $(elem);
        var source = $e.attr(attrib);
        source = source || $e.attr("data-src");
        $e.attr("src", source);
        $e.addClass('is-unveiled');
      });
    }
    unveilAll();
    return this;
  };

  /**
   * OPTIONS
   * threshold:      pixel height below fold at which to start unveiling images
   * callback:       callback function after an image is unveiled
   * finalCallback:  callback function after all images are unveiled
   **/

  $.fn.doUnveil = function(options) {
    options = options || [];
    var $w = $(window),
        th = options['threshold'] || 300,
        retina = window.devicePixelRatio > 1,
        attrib = retina ? "data-src-retina" : "data-src",
        images = this,
        force = options['force'] || false,
        loaded;

    this.one("unveil", function() {
      var $e = $(this);
      var source = $e.attr(attrib);
      source = source || $e.attr("data-src");
      if (source) {
        $e.load(function(){
          $e.removeClass('not-unveiled being-unveiled').addClass('is-unveiled');
          $e.parent('div').removeClass('not-unveiled being-unveiled').addClass('is-unveiled');
          unveil();
        });
        $e.attr("src", source);
        $e.removeClass('not-unveiled').addClass('being-unveiled');
        $e.parent('div').removeClass('not-unveiled').addClass('being-unveiled');
        if (typeof options['callback'] === "function") {
          options['callback'].call(this);
        }
      }
    });

    function unveil() {
      if (!images.length) { return; }
      var inview = images.filter(function() {
        var $e = $(this);
        var skipUnveil = !!($e.is(":hidden") || $e.hasClass('is-unveiled') || $e.hasClass('being-unveiled'));
        if (!force && skipUnveil) {
          return false;
        }
        $e.addClass('not-unveiled');

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return (eb >= wt - th && et <= wb + th) || (eb > wb +th && et < wt - th);
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
      if (images.length === 0 && typeof options['finalCallback'] === "function"){
        options['finalCallback'].call();
      }
    }

    function throttle(callback, limit) {
      var wait = false;
      return function () {
        if (!wait) {
          callback.call();
          wait = true;
          setTimeout(function () {
            wait = false;
          }, limit);
        }
      }
    }

    function injectCss(){
      var unveilCss = $('head').find("#unveil-css");
      if (!unveilCss.length){
        var css = 'img.lazy-load{transition: 0.2s opacity ease-in;}img.not-unveiled,img.being-unveiled{opacity: 0;}img.is-unveiled{opacity: 1;}';
        var css2 = 'div.lazy-load{transition: 0.2s opacity ease-in;}div.not-unveiled,div.being-unveiled{opacity: 0;}div.is-unveiled{opacity: 1;}';
        $('head').append('<style id="unveil-css">'+css+css2+'</style>');
      }
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil", throttle(unveil, 100));
    injectCss();
    unveil();
    return this;
  };

})(window.jQuery);