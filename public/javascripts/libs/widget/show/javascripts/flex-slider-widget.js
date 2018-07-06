class FlexSliderWidget {
  // extend this class to implement flex slider based widgets
  constructor(configs){
    this.configs = configs;
    this.widget = $("#"+this.configs.widgetId);
    this.lazyLoadSlides();
    this.setupFlexslider();
    this.setupResize();
  }

  lazyLoadSlides(){
    var slides = this.widget.find('img.lazy-slide');
    slides.each((idx, e)=>{
      let img = $(e);
      img.attr('src', img.data('src')).removeAttr('data-src');
    });
    slides.on('load', (e)=>{
      this.resize();
      this.widget.addClass("loaded");
    });
  }

  setupFlexslider(){
    this.initializeFlexSlider();
    var size = this.getLargestImage();
    var imageHeight = size['height'];

    if (this.isMiniGallery()){
      this.setMiniNavHeight(imageHeight);
    } else {
      this.setImageHeight(imageHeight);
    }
  }

  initializeFlexSlider() {
    if (this.isCarousel()){
      this.initializeGalleryCarousel();
    } else {
      this.initializeGallerySlideshow();
    }
  }

  initializeGalleryCarousel() {
    this.widget.find('.gallery-carousel').flexslider({
      animation: 'slide',
      animationLoop: true,
      itemWidth: 350,
      itemMargin: 15,
      slideshowSpeed: this.slideshowSpeed(),
      minItems: this.getGridSize(),
      maxItems: this.getGridSize(),
      start: (slider)=>{
        this.flexslider = slider;
      }
    });
  }

  initializeGallerySlideshow() {
    let showThumbs = (this.showThumbnails() ? "thumbnails" : true);
    this.widget.find('.gallery-slideshow').flexslider({
      animation: 'fade',
      useCSS: true,
      touch: true,
      directionNav: true,
      slideshowSpeed: this.slideshowSpeed(),
      controlNav: showThumbs,
      start: (slider)=>{
        this.flexslider = slider;
      }
    });
  }

  getGridSize() {
    let windowWidth = window.innerWidth;
    return windowWidth < 641 ? 1 : (windowWidth < 910 ? 2 : 3);
  }

  setupResize() {
    $(window).smartresize(()=>{
      this.resize();
    });
    setTimeout(()=>{ this.resize() }, 300);
  }

  resize() {
    this.isMiniGallery() ? this.resetMiniFlexslider() : this.resetFlexslider();
  }

  resetFlexslider() {
    let size = this.getLargestImage();
    this.setImageHeight(size['height']);

    if (this.isCarousel()){
      let gridSize = this.getGridSize();
      if (this.flexslider){
        this.flexslider.vars.minItems = gridSize;
        this.flexslider.vars.maxItems = gridSize;
      }
    }
  }

  resetMiniFlexslider() {
    let size = this.getLargestImage();
    this.setMiniNavHeight(size['height']);
  }

  setMiniNavHeight(imageHeight){
    this.widget.find('.flex-direction-nav a').height(imageHeight);
  }

  getLargestImage(){
    var slides = this.widget.find('.slides li');
    var images = this.widget.find('.slides img');
    slides.addClass('loading');
    images.css('max-height', 'none');

    var imageHeight = 0;
    var imageWidth = 0;
    var size = [];
    images.each(function(idx, img){
      let curHeight = $(img).height();
      if (curHeight > imageHeight){
        imageHeight = curHeight;
        imageWidth = $(img).width();
      }
    });

    slides.removeClass('loading');
    size['height'] = imageHeight;
    size['width'] = imageWidth;
    return size;
  }

  // Sets max height of images so they all fit in the window
  setImageHeight(imageHeight){
    var windowHeight = $(window).height();
    var navHeight = this.widget.find('.flex-control-nav').outerHeight(true);
    var fixedHeight = null;

    if (windowHeight <= imageHeight + navHeight){
      fixedHeight = windowHeight - navHeight;
      if (fixedHeight < 320){
        fixedHeight = imageHeight;
      }
    } else {
      fixedHeight = imageHeight;
    }

    if (!this.isCarousel()){
      this.widget.find('.slides img').css('max-height', fixedHeight);
      this.widget.find('.slides li').css('height', fixedHeight);
    }

    this.widget.find('.flex-control-nav').css('bottom', -navHeight);
    this.widget.find('.flexslider').css('margin-bottom', navHeight);
  }

  isMiniGallery(){
    return this.configs['mini_gallery'] === 'yes'
  }

  isCarousel(){
    return this.configs['carousel'] === 'yes'
  }

  showThumbnails(){
    return this.configs['show_thumbnails'] === 'yes'
  }

  imagePadding(){
    this.configs['image_padding'] || 0
  }

  slideshowSpeed() {
    return this.configs.slideshow_speed || 6000;
  }
}
