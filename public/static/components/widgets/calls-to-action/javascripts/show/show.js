class CallsToActionWidget {
  constructor(configs){
    this.configs = configs;
    this.widget = $('#'+configs.widgetId);
    this.setupCTAs();
  }

  setupCTAs(){
    this.widget.find('.cta-item a').on('click', (e)=>{
      this.trackCTAEvents($(e.currentTarget));
    });
    if (G5.isPreview){
      this.setupPreviewUrls();
    }
  }

  setupPreviewUrls(){
    for(let i = 1; i <= 4; i++){
      let previewUrl = this.configs[`previewUrl${i}`];
      let ctaLink = this.widget.find(`.cta-item-${i} a`);
      if (previewUrl.length && ctaLink.length){
        ctaLink.attr('href', previewUrl);
      }
    }
  }

  trackCTAEvents(cta) {
    if (typeof(ga) === 'function'){
      let txt = cta.text();
      try { ga('send','event', 'CTA', 'click', txt) } catch (err) {}
      try { ga('g5.send','event', 'CTA', 'click', txt) } catch (err) {}
    }
  }
}

G5.loadWidgetConfigs(".action-calls .config", CallsToActionWidget);