(function(){var i;i=function(){function i(i){this.configs=i,this.widget=$("#"+this.configs.widgetId),this.setupAccordion()}return i.prototype.setupAccordion=function(){var i;return"true"===this.configs.start_open&&(i=this.widget.find(".accordion-section-title").first(),i.addClass("active").next(".accordion-section-content").slideDown(300).addClass("open")),this.widget.find(".accordion-section-title").click(function(i){return function(t){var n,e;return n=$(t.currentTarget),e=n.attr("href"),n.is(".active")?(n.removeClass("active"),i.widget.find(e).slideUp(300).removeClass("open")):(n.addClass("active"),i.widget.find(e).slideDown(300).addClass("open")),!1}}(this))},i}(),G5.loadWidgetConfigs(".accordion .config",i)}).call(this);