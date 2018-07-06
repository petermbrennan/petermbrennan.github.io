class JavascriptWidget {
  constructor(config) {
    this.script = config.script;
    this.noscript = config.noscript;
    this.widgetId = config.widgetId;
    this.srcUrl = config.srcUrl;
    this.appendJavascript();
    this.appendExternalSrc();
  }

  appendJavascript() {
    if (this.script.length) {
      this.appendTag('script', this.script, 'text/javascript');
    }
    if (this.noscript.length) {
      return this.appendTag('noscript', this.noscript);
    }
  }

  appendTag(tag, content, type){
    let newTag = document.createElement(tag);
    if (type) {
      newTag.type = 'text/javascript';
    }
    newTag.id = `${this.widgetId}-${tag}`;
    newTag.innerHTML = content;
    return $('body')[0].appendChild(newTag);
  }

  appendExternalSrc() {
    if (this.srcUrl.length) {
      return this.appendTagWithSrc('script', this.srcUrl);
    }
  }

  appendTagWithSrc(tag) {
    let newTag = document.createElement(tag);
    newTag.id = `${this.widgetId}-src`;
    newTag.src = `${this.srcUrl}`;
    return $('body')[0].appendChild(newTag);
  }
}

G5.loadWidgetConfigs(".javascript-config", JavascriptWidget);
