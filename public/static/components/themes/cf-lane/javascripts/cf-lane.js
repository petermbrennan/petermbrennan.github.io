$(window).load(function() {
  cfLane.adjustPhone();
  cfLane.hasCorporateNav();
  cfLane.centerLogo();
  cfLane.adjustPhotoCaption();
  cfLane.firstRowClass();
  cfLane.photoOverlay();
  cfLane.floorPlans();
});

$(window).on('resize orientationchange', function(){
  cfLane.adjustPhone();
  cfLane.centerLogo();
  cfLane.adjustZipPlaceholder();
  cfLane.adjustPhotoCaption();
  cfLane.photoOverlay();
  cfLane.floorPlans();
});



var cfLane = {

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

  minLarge: function(){
    if (Modernizr.mq("(min-width: 1200px)")) {
      return true;
    }
  },

  adjustPhone: function(){
    var headerBtn = $('.navigation-container').find('.button');

    if (headerBtn.length > 0){
      $('.navigation-container').addClass('has-header-btn');
      var hasHeaderBtn = $('.has-header-btn').find('.appended-phone span');

      if (this.minSmall()){
        hasHeaderBtn.css({
          "display" : "block",
          "right" : (headerBtn.width() + 40) + "px",
          "left" : "auto"
        });
      } else {
        hasHeaderBtn.css({
          "display" : "block",
          "left" : 15 + "px",
          "right" : "auto"
        });
      }
    } else {
      $('.navigation-container').addClass('no-header-btn');
      $('.appended-phone span').css("display", "block");
    }
  },

  hasCorporateNav: function(){
    var corpNav = $('nav.corporate-navigation').length > 0;
    if (corpNav){
      return $('body').addClass('has-corp-nav');
    }
  },

  centerLogo: function(){
    var obj = $('header').find('.logo-container');
    if (obj.length > 0){
      obj.css({
        "display" : "block",
        "left" : ((($(window).width() - obj.outerWidth()) / 2) + "px")
      });
    }
  },

  adjustZipPlaceholder: function(){
    var input = $(".zip-search-input input[type='text']");
    return input.attr("placeholder"
      ,(input.length >= 1 && !cfLane.minXsmall())
      ? "City, state, zip"
      : "Search by city, state or zip")
  },

  singleCTA: function(){
    var ctas = $('.action-calls');
    ctas.each(function(i, elem){
      var cta = $(elem).find('li');
      if (cta.length == 1){
        $(elem).closest('nav').addClass('single');
      }
    }.bind(this));
  },

  adjustPhotoCaption: function(){
    var collageRowImage = $(".collage-row").find('figure');

    collageRowImage.each(function(index, elem){
      var  imageHeight= $(elem).height(),
      caption = $(elem).find("a"),
      offsetTop = imageHeight/ 2

      caption.each(function(){
        $(this).css({
          'padding-top': offsetTop,
        });
      });
    });
  },

  firstRowClass: function(){
    var photo = $('[role=main]').find('.row:first-of-type .col-1 .widget.photo');
    if(photo.is(':first-child')){
      $('[role=main]').find('.row:first-of-type').addClass('has-photo')
    } else {
      return
    }
  },

  photoOverlay: function(){
    var links = [ ".collage-row a", ".floor-plans a" ];
    links.forEach(function(link){
      if ($(link).length){
        if (Modernizr.touchevents || Modernizr.pointerevents) {
            // handle the adding of hover class when clicked
            $(link).click(function(e){
                if (!$(this).hasClass("hover")) {
                    $(this).addClass("hover");
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                } else {
                  window.location = $(this).attr('href');
                }
            });
        } else {
            // handle the mouseenter functionality
            $(link).mouseenter(function(){
                $(this).addClass("hover");
            })
            // handle the mouseleave functionality
            .mouseleave(function(){
                $(this).removeClass("hover");
            });
        }
      }
    });
  },

  floorPlans: function(){
    var fp = $('.floor-plans');
    var fp_img = fp.find('img');
    fp_img.each(function(i,elem){
      imgH = $(elem).height();
      imgW = $(elem).width();

      $('.floor-plans .photo figcaption').css({
        "height" : imgH,
        "width" : imgW
      });
    });
  }
};
