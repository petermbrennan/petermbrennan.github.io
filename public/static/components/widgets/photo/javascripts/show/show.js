$(document).ready(function() {
  const mapConfigs = new PhotoWidgetConfigs;
  mapConfigs.setUpUnveil();
});

class PhotoWidgetConfigs {
  constructor() {
    const photoConfigs = $('.photo-config');
    this.configs = $.map(photoConfigs, config=>  JSON.parse($(config).html()));
  }

  setUpUnveil() {
    return $.each(this.configs, (idx, config)=> new PhotoWidget(config));
  }
}

class PhotoWidget {
  constructor(config) {
    this.widget = $(`#${config.widgetId}`);
    this.lazyImg = this.widget.find('img.lazy-load');
    this.lazyLoad();
  }

  lazyLoad() {
    return this.lazyImg.unveil();
  }
}