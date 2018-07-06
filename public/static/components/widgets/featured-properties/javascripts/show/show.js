class FeaturedPropertiesWidget extends FlexSliderWidget {
  // override here
  isCarousel(){
    return true;
  }

  isMiniGallery(){
    return false;
  }

  showThumbnails(){
    return false;
  }
};

G5.loadWidgetConfigs('.featured-properties .config', FeaturedPropertiesWidget);

