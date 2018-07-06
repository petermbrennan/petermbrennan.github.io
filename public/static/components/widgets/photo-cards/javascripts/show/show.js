class PhotoCardsWidget {
  constructor(configs) {
    this.configs = configs;
    this.widget = $('#'+this.configs.widgetId);
    this.photoWrappers = this.widget.find('.photo-card-wrapper');

    if (this.widget.hasClass('a-flip')) {
      this.widget.imagesLoaded(() => {
        this.setupFlip();
        this.widget.addClass('photo-cards-loaded');

        $(window).smartresize(() => {
          this.resetFlip();
          this.setupFlip();
        });
      });
    }

    this.touchHovers();

    this.widget.find('.photo-card-caption:has(p img)').addClass('has-image');
  }

  setupFlip() {
    this.widget.css('opacity', 1);

    this.widget.find('.photo-card-wrapper').each(function() {
      var $this = $(this),
          image = $this.find('img'),
          padding = parseInt($this.css('padding-top')) * 2,
          wrapperWidth = image.outerWidth() + padding + 'px',
          insideWidth = image.outerWidth() + 'px';

      $this.css('width', wrapperWidth);
      $this.find('.photo-card-front, .photo-card-back').css('width', insideWidth);

      var insideHeight = image.outerHeight() + 'px',
          wrapperHeight = image.outerHeight() + padding + 'px';

      $this.css('height', wrapperHeight);
      $this.find('.photo-card-front, .photo-card-back').css('height', insideHeight);
    });
  }

  resetFlip() {
    this.widget.find('.photo-card-wrapper, .photo-card-front, .photo-card-back').removeAttr('style');
  }

  touchHovers(links) {
    this.widget.find('.photo-card-wrapper').on('touchend', (e)=> {
      this.photoWrappers.removeClass('hover');
      $(e.currentTarget).addClass('hover');
      e.stopPropagation();
    });

    $('body').on('touchend', ()=> {
      this.photoWrappers.removeClass('hover');
    });

    $('.photo-cards a').on('touchend', (e)=> {
      var wrapper = $(e.currentTarget).closest('.photo-card-wrapper');
      if (!wrapper.hasClass('hover')) {
        e.preventDefault();
      }
    });
  }
}

G5.loadWidgetConfigs('.photo-cards .config', PhotoCardsWidget);
