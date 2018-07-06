$(function() {

  // If location name is too long, change font size until it fits
  var $body = $('body'),
      bizName = $('.row:first .html h2'),
      bizNameSize = parseInt(bizName.css('font-size')),
      homePage = $body.hasClass('site-location')  && $body.hasClass('web-home-template'),
      corpHome = $body.hasClass('site-corporate') && $body.hasClass('web-home-template');

  var longName = function() {
    return bizName[0].scrollWidth > bizName.innerWidth();
  };

  var shortName = function() {
    return bizName[0].scrollWidth <= bizName.innerWidth();
  };

  var resizeName = function() {
    if (Modernizr.mq("(min-width: 625px)")) {
      if (longName()) {
        while (longName()) {
          bizNameSize--;
          bizName.css('font-size', bizNameSize.toString() + 'px');
        };
      }
      else {
        while (shortName() && bizNameSize < 70) {
          bizNameSize++;
          bizName.css('font-size', bizNameSize.toString() + 'px');
        };
      }
    }
    else {
      bizName.removeAttr('style');
    }
  }

  var heroParallax = function() {
    var $fwindow = $(window),
        $body = $(document),
        $hero = $('.row:first-child .photo'),
        heroTop = $hero.css('top');

    if (Modernizr.mq("(min-width: 625px)")) {
      $fwindow.on('scroll', function() {
        var scrollTop = $body.scrollTop(),
            newTop = parseInt(heroTop) + (scrollTop - scrollTop / 2);

        $hero.css('top', newTop);
      });
    }
    else {
      $fwindow.off('scroll');
      $hero.css('top', heroTop);
    }
  }

  if (corpHome && !$('.row:first-child').hasClass('parallax-off')) {
    heroParallax();
  }

  if (homePage && bizName.length) {
    resizeName();
  }


  // Adds bold to location name in Contact Info widget
  $('.contact-info .p-name').each(function(){
    var name = $(this);
    name.html( name.text().replace(/(^\w+)/,'<strong>$1</strong>') );
  });


  // Adds gallery photo wrapper for caption positioning
  $('.full-gallery.gallery-slideshow .slides li').wrapInner('<div class="slide-wrapper"></div>');


  // If both columns have html widget, add mobile styling so they are spaced properly
  $('.row').each(function() {
    var self = $(this),
        test = (self.find('.col-1 .column-content > .row-1 .html').length) && (self.find('.col-2 .column-content > .row-1 .html').length);

    if (test) {
      self.addClass('collapse-html');
    }
  });


  if (homePage && bizName.length) {
    $(window).smartresize(function() {
      resizeName();
    });
  };
});
