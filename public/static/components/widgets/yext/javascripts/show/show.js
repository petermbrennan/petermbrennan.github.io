class YextWidget {
  constructor(configs, widget) {
    this.configs = configs;
    this.actionLink = configs.form_action_link;
    this.widget = $('#'+this.configs.widgetId);
    this.yextForm = $(this.widget).find('form');

    this.yextForm.submit(function (e) {
      this.formActionLink(e);
    }.bind(this));
  }

  formActionLink(e) {
    if (this.actionLink.length <= 1) {
      e.preventDefault();
      return false;
    }
    try {
      $(this.yextForm).attr("action", this.actionLink);
    } catch(e) {
      e.preventDefault();
      return false;
    }
  }
}

G5.loadWidgetConfigs(".yext .config", YextWidget);