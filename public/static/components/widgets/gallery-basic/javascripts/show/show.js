class GalleryBasicWidget {
  constructor(configs){
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);
    this.configs.timeout = parseInt(this.configs.timeout) + 2000;
    this.timeout = this.configs.timeout || 6000;
    this.interval = setInterval(() => {
      this.nextImage();
    }, this.timeout);
  }

  nextImage() {
    this.active = this.widget.find(".active");
    this.next = (this.active.next().length > 0 ? this.active.next() : this.widget.find("figure:first"));
    this.nextLoad = (this.next.next().length > 0 ? this.next.next() : this.widget.find("figure:first"));

    if (this.next && this.nextLoad) {
      // check if next image needs to be loaded
      if (this.nextLoad.hasClass("lazy-load")) {
        let img = this.nextLoad.find("img");
        let src = img.attr("data-src");
        img.attr("src", src);
        this.nextLoad.removeClass("lazy-load");
      }

      // when images are done loading, transition to next slide
      this.next.css("z-index", 2);
      this.active.fadeOut(1500, () => {
        this.active.css("z-index", 1).show().removeClass("active");
        this.next.css("z-index", 3).addClass("active");
      });
    }
  }
}

G5.loadWidgetConfigs('.gallery-basic .config', GalleryBasicWidget);
