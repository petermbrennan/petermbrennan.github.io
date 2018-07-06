class PdfEmbedWidget {
  static initClass() {
    this.prototype.WIDTH_RATIO = 545;
    this.prototype.HEIGHT_RATIO = 705;
  }

  constructor(configs){
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);
    this.pdfIframe = this.widget.find('iframe');
    this.percWidth = this.frameWidth() / this.wrapperWidth();
    this.resize();
    $(window).on('resize orientationchange', ( e => {
      return this.resize();
    }));
  }

  resize() {
    let newFrameWidth = this.wrapperWidth() * this.percWidth;
    let newFrameHeight = (newFrameWidth * this.HEIGHT_RATIO) / this.WIDTH_RATIO;
    this.pdfIframe.css({width: newFrameWidth, height: newFrameHeight});
  }

  wrapperWidth() {
    return this.widget.width();
  }

  frameWidth() {
    return this.pdfIframe.width();
  }
}
PdfEmbedWidget.initClass();

G5.loadWidgetConfigs('.pdf-embed .config', PdfEmbedWidget);
