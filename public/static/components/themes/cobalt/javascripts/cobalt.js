$(window).load(function() {
  cobalt.corpNav();
  cobalt.adjustZipPlaceholder();
  cobalt.adjustPhone();
  var colHeight = $(".photo-bottom").height();
  $('body:has(div.navigation-container:has(span.button))').addClass('has-header-btn');
  $('a.appended-phone:has(span[style*="visibility:hidden;"])').addClass('hideo-the-phoneo');
  $('a.appended-phone:has(span[style*="visibility: visible;"])').css('display','block');
  $(".photo-bottom .col-2 .column").height(colHeight);
  $(".photo-bottom .col-2 .column .bottom-align").css({ position: "absolute", bottom: "0"});
});

$(window).on('resize orientationchange', function(){
  cobalt.adjustZipPlaceholder();
});

var cobalt = {
  isLoc: function(){
    return $('body.site-location');
  },

  corpNav: function(){
    var cNav = $('nav.corporate-navigation');
    if (cNav.length){
      return $('body').addClass('has-corp-nav');
    }
  },

  minMedium: function(){
    if (Modernizr.mq("(min-width: 990px)")) {
      return true;
    }
  },

  adjustPhone: function(){
    var headerBtn = $('.navigation-container').find('.button');
    if (headerBtn.length > 0){
      $('.navigation-container').addClass('header-btn-present');
      if (this.minMedium()){
        $('.header-btn-present').find('.appended-phone').css({
          "display" : "block",
          "right" : (headerBtn.width() + 20) + "px"
        });
      } else {
         $('.header-btn-present').find('.appended-phone').css({
          "display" : "block",
          "right" : (0) + "px"
        });
      }
    } else {
      $('.navigation-container').addClass('no-header-btn');
      $('.appended-phone').css("display", "block");
    }
  },

  adjustZipPlaceholder: function(){
    var input = $(".zip-search-input input[type='text']");
    return input.attr("placeholder"
      ,(input.length >= 1 && !cobalt.minMedium())
      ? "City, state, zip"
      : "Search by city, state or zip")
  }

};

// jquery.object-fit.js
// ====================

(function($, window, document) {

  var resizeTimer, toResize = [];

  var testForObjectFit = function() {
    // Borrowed from Modernizr
      var mStyle = document.createElement('modernizr').style,
    prop = 'objectFit', 
    omPrefixes = 'Webkit Moz O ms',
    cssomPrefixes = omPrefixes.split(' '),
    ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
    props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    for ( var i in props ) {
          var prop = props[i];
          if ( !!~('' + prop).indexOf("-") && mStyle[prop] !== undefined ) {
              return prefixed == 'pfx' ? prop : true;
          }
      }
      return false;
  };
  
  var doObjectFit = function(type) {
    // default type is "contain"
    var type = type || 'contain';
    var supportsObjectFit = testForObjectFit();
    
    return this.each(function() {
      if (supportsObjectFit) {
        $(this).css('object-fit', type);
      }
      else {
        doResize(this, type);
      }
      
    });
  };

  var doResize = function(elem, params) {
    var type = typeof(params) === 'string' ? params : params.type,
      hideOverflow = params.hideOverflow === undefined ? true : params.hideOverflow;

    // Cache the resize request
    toResize.push({elem: elem, params: {type:type, hideOverflow: hideOverflow}});
    // Find the first block level element, as we need the containing element, not just the next one up
    function findParentRatio(jqObject) {
      var p = jqObject.parent(),
        displayType = p.css('display');
      
      if (displayType == 'block' || displayType == '-webkit-box' && p.width() > 0) {
        return { obj: p, width: p.width(), height: p.height(), ratio: (p.width() / p.height()) };
      } else {
        return findParentRatio(p);
      }
    }

    var $this = $(elem),
        ratio,
        parent = findParentRatio($this), // The parent element may not have any width or height, so find one that does
        pic_real_width,
        pic_real_height;

    var image = $("<img/>") // Make in memory copy of image to avoid css issues
      .load(function() {
        pic_real_width = this.width;   // Note: $(this).width() will not
        pic_real_height = this.height; // work for in memory images.

        ratio = pic_real_width / pic_real_height;

        // Set the width/height
        if (type === 'contain') {
          if (parent.ratio > ratio) {
            $this.width(parent.height * ratio);
          } else {
            $this.height(parent.width / ratio).width('100%');
          }
        }
        else if (type === 'cover') {
          // At least one dimension is smaller, so cover needs to size the image
          if (parent.width > pic_real_width || parent.height > pic_real_height) {
            if (parent.ratio > ratio) {
              $this.width(parent.width).height(parent.height * ratio);
            } else {
              $this.height(parent.height).width(parent.width * ratio);
            }
          }
          if (hideOverflow) {
            // Apply overflow-hidden, or it looks ugly
            parent.obj.css('overflow', 'hidden');
          }
        }
      });
    image.attr("src", $this.attr("src")); // Has to be done outside of assignment for IE
  };

  $.fn.objectFit = doObjectFit;

  $(window).resize(function() {
    clearTimeout(resizeTimer);
    for(var i=0, len = toResize.length; i<len; i++) {
      var a = toResize[i];
      resizeTimer = setTimeout(function() { doResize(a.elem, a.params);}, 100);
    }
  });


})(jQuery, window, document);

$('.photo-one .u-photo').objectFit({type: 'cover', hideOverflow: true});
$('.photo-two .u-photo').objectFit({type: 'cover', hideOverflow: true});
$('.photo-three .u-photo').objectFit({type: 'cover', hideOverflow: true});
$('.photo-four .u-photo').objectFit({type: 'cover', hideOverflow: true});