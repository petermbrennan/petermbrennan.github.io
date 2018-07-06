(function() {


}).call(this);
if (typeof(window.noEvent) === 'undefined') {
  window.noEvent = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
}

var topWindow = window.top;
$(document).ready(function() {
  if ($('body').hasClass('preview') && window.self !== topWindow) {
    topWindow.G5WidgetsHandler = Click2Edit;
    topWindow.G5WidgetsHandler.init();
    topWindow.toggleWidgetButtons = function(){
      return topWindow.G5WidgetsHandler.toggleEnabled();
    };
  }
});

var Click2Edit = {
  thumbPath: "",
  enabled: true,
  id: 'g5-c2e',
  buttons: null,
  shadowColor: '#6dbde2',
  widgetTitle: null,
  editButton: null,
  changeButton: null,
  preventHide: false,
  hideTimeout: null,
  _widget: null,

  init: function() {
    this.thumbPath = this.getThumbPath();
    this.createButtons();
    this.bindToWidgets();
    $(window).on("resize orientationchange scroll", function() {
      if (this.buttons.is(":visible")){
        this.adjust();
      }
    }.bind(this));
  },

  toggleEnabled: function() {
    return this.setEnabled(!this.enabled);
  },

  widgetClasses: function(){
    return ".widget, .row-widget, .column-widget";
  },

  bindToWidgets: function() {
    $(this.widgetClasses()).each(function(index, elem) {
      return this.setWidgetHover(elem);
    }.bind(this));
    $(window).on('appendedPhoneNumberReady', function(e, widgetId){
      return this.setAppendedPhoneWidgetHover($(widgetId).first());
    }.bind(this));
  },

  setWidgetHover: function(elem) {
    if (typeof(elem) === 'undefined') { return; }
    $(elem).addClass('widget-hover').hover(function(e) {
      if (this.enabled) {
        this._widget = $(e.currentTarget);
        this.show();
        return window.noEvent(e);
      }
    }.bind(this), function(e) {
      this.delayHide($(e.currentTarget));
      return window.noEvent(e);
    }.bind(this));
  },

  setAppendedPhoneWidgetHover: function(elem){
    var phoneWidget, phoneTarget;
    var config = this.getWidgetConfig(elem);
    if (config['appendPhone'] === 'true') {
      phoneTarget = $(config['appendElements']).next('.appended-phone');
    } else if (config['prependPhone'] === 'true'){
      phoneTarget = $(config['appendElements']).prev('.appended-phone');
    }
    if (phoneTarget && phoneTarget.length){
      phoneWidget = $(elem);
      phoneTarget.data('id', phoneWidget.data('id'));
      phoneTarget.data('name', phoneWidget.data('name'));
      phoneTarget.data('slug', phoneWidget.data('slug'));
      phoneTarget.data('thumb', phoneWidget.data('thumb'));
      this.setWidgetHover(phoneTarget);
    }
  },

  createButtons: function() {
    this.buttons = $("<div id='" + this.id + "'></div>");
    this.widgetTitle = this.createWidgetTitle();
    this.editButton = this.createWidgetButton('edit');
    this.changeButton = this.createWidgetButton('change');
    this.buttons.append(this.widgetTitle).append(this.editButton).append(this.changeButton);
    this.buttons.hover(function(e) {
      this.preventHide = true;
    }.bind(this), function(e) {
      this.preventHide = false;
    }.bind(this));
    $("body").prepend(this.buttons);
  },

  createWidgetTitle: function() {
    return $("<h3 id='" + this.id + "-title'><img src='#' id='" + this.id + "-thumb'><span id='" + this.id + "-text'>Title</span></h3>");
  },

  setWidgetTitle: function() {
    this.widgetTitle.find("#" + this.id + "-thumb").attr('src', this.thumbPath+"/"+this._widget.data('thumb'));
    this.widgetTitle.find("#" + this.id + "-text").text(this._widget.data('name'));
  },

  createWidgetButton: function(type) {
    var icon;
    icon = "<i class='fa fa-" + (this.getWidgetButtonIcon(type)) + "'></i>";
    this.changeButton = $("<button id='" + this.id + "-" + type + "' class='"+this.id+"-btn'>" + icon + type + "</button>");
    return this.changeButton.on('click', function(e) {
      this.widgetAction(type);
      return window.noEvent(e);
    }.bind(this));
  },

  getWidgetButtonIcon: function(type) {
    if (type === 'edit') { return 'edit'; }
    if (type === 'remove') { return 'trash'; }
    if (type === 'change') { return 'retweet'; }
  },

  widgetAction: function(type) {
    if (type === 'edit') { this.editWidget(); }
    if (type === 'remove') { this.removeWidget(); }
    if (type === 'change') { this.changeWidget(); }
  },

  show: function() {
    this.clearActive();
    if (!this.isLayoutWidget()) {
      this.setActive();
      this.adjust();
      this.buttons.show();
    }
  },

  delayHide: function(elem) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(function(){
      this.hide(elem);
    }.bind(this), 200);
  },

  hide: function(elem) {
    if (!(this.preventHide || this._widget !== elem)) {
      this.clearActive();
    }
  },

  setEnabled: function(enabled) {
    this.enabled = enabled;
    if (!this.enabled) {
      this.clearActive();
    }
    return this.enabled;
  },

  clearActive: function(notCurrent) {
    if (notCurrent == null) {
      notCurrent = false;
    }
    $(".widget-hover").each(function(idx, elem) {
      if (notCurrent || $(elem) !== this._widget) {
        $(elem).removeClass("active-widget");
        $(elem).css({"box-shadow": $(elem).data("shadow")});
        this.buttons.hide();
      }
    }.bind(this));
  },

  setActive: function() {
    this._widget.addClass("active-widget");
    if (!this._widget.data("shadow")) {
      this._widget.data("shadow", this._widget.css("box-shadow"));
    }
    this._widget.css("box-shadow", this.activeBoxShadow());
    this.setWidgetTitle();
    if (this._widget.parents(this.widgetClasses()).length) {
      this.changeButton.show();
    } else {
      this.changeButton.hide();
    }
  },

  activeBoxShadow: function() {
    return "0 0 0 3px "+this.shadowColor+", inset 0 0 0 5px "+this.shadowColor;
  },

  adjust: function() {
    if (!this._widget) { return; }

    this.getWindowDimensions();
    this.getWidgetDimensions();
    this.getButtonDimensions();
    var topOffset = this.elemTop + 0.5 * this.elemHeight - 0.5 * this.buttonsHeight;
    var leftOffset = this.elemLeft + 0.5 * this.elemWidth - 0.5 * this.buttonsWidth;
    if (topOffset < 0) {
      topOffset = 0;
    }
    if (leftOffset < 0) {
      leftOffset = 0;
    }
    if (topOffset + this.buttonsHeight > this.winScrollTop + this.winHeight) {
      topOffset = this.winScrollTop + this.winHeight - this.buttonsHeight;
    }
    if (leftOffset + this.buttonsWidth > this.winScrollLeft + this.winWidth) {
      leftOffset = this.winScrollLeft + this.winWidth - this.buttonsWidth;
    }
    this.buttons.css({
      top: topOffset,
      left: leftOffset
    });
  },

  getWindowDimensions: function() {
    this.winHeight = $(window).height();
    this.winWidth = $(window).width();
    this.winScrollTop = $(window).scrollTop();
    this.winScrollLeft = $(window).scrollLeft();
    this.docHeight = $(document).height();
    this.docWidth = $(document).width();
  },

  getWidgetDimensions: function() {
    var w, slug;
    w = this._widget;
    slug = this._widget.data('slug');
    if (this.isInExceptionList(slug)) {
      w = w.find(this.widgetExceptionList()[slug]).first();
    }
    this.elemWidth = $(w).outerWidth();
    this.elemHeight = $(w).outerHeight();
    this.elemWidth = Math.min(this.elemWidth, this.winWidth);
    this.elemHeight = Math.min(this.elemHeight, this.winHeight);
    this.elemTop = w.offset().top;
    this.elemBottom = this.elemTop + this.elemHeight;
    this.elemLeft = w.offset().left;
    this.elemRight = this.elemLeft + this.elemWidth;
  },

  getButtonDimensions: function() {
    this.buttonsWidth = this.buttons.outerWidth();
    this.buttonsHeight = this.buttons.outerHeight();
  },

  isLayoutWidget: function() {
    var wName;
    wName = this._widget ? this._widget.data('name') : "";
    return !!(wName === 'Content Stripe' || wName === 'Column');
  },

  editWidget: function() {
    if (!this._widget) { return; }
    this.getEditForm(this._widget.data('id'), this._widget.data('name'));
  },

  getEditForm: function(widget_id, widget_name) {
    var callback = function(response) {
      this.openModal(response, widget_name);
    }.bind(this);
    $.get(this.editURL(widget_id), {}, callback, "json");
  },

  openModal: function(response, widget_name) {
    var modal = topWindow.$('#modal');
    var modalBody = modal.find('.modal-body');
    modalBody.html(response["html"]);
    if (modalBody.find('.ckeditor').length >= 1) {
      modalBody.find('.ckeditor').each(function(i) {
        $(this).attr('id', 'ckeditor-' + i);
        topWindow.CKEDITOR.replace($(this).attr('id'));
      });
    }
    this.setGoBackButton();

    modal.find('#myModalLabel').text("Edit " + widget_name);
    modal.modal();
    modalBody.find('.edit_widget').submit(function() {
      var ckes = modalBody.find('.ckeditor');
      if (ckes.length >= 1) {
        ckes.each(function(i) {
          var cke = $(this);
          cke.val(topWindow.CKEDITOR.instances["ckeditor-" + i].getData());
        });
      }
      this.saveEditForm();
      return false;
    }.bind(this));
    return false;
  },

  setGoBackButton: function(){
    var modal = topWindow.$('#modal');
    var modalBody = modal.find('.modal-body');
    var goBack = modal.find('.modal-footer .go-back');
    var formGoBack = modalBody.find('.go-back-btn');
    if (formGoBack.length) {
      goBack.show()
      goBack.off('click').on('click', function(e){
        var parentId = formGoBack.data("parent-id");
        var parentName = formGoBack.data("parent-name");
        if (parentId) {
          this.getEditForm(parentId, parentName);
        } else {
          modal.modal('hide');
        }
        return window.noEvent(e);
      }.bind(this));
    } else {
      goBack.hide();
      goBack.off('click');
    }
  },

  editURL: function(widget_id) {
    widget_id || (widget_id = this._widget.data("id"));
    return "/widgets/" + widget_id + "/edit";
  },

  saveEditForm: function() {
    var modal = topWindow.$('#modal');
    var modalBody = modal.find('.modal-body');
    return topWindow.$.ajax({
      url: modalBody.find('.edit_widget').prop('action'),
      type: 'PUT',
      dataType: 'json',
      data: modalBody.find('.edit_widget').serialize(),
      success: function() {
        modal.modal('hide');
        url = topWindow.$('.preview iframe').prop('src');
        topWindow.$('iframe').prop('src', url);
      }.bind(this),
      error: function(xhr) {
        if (xhr.status === 204) {
          return modal.modal('hide');
        } else if (xhr.responseText.length) {
          return this.insertErrorMessages($.parseJSON(xhr.responseText));
        } else {
          return this.insertErrorMessages({
            errors: {
              base: ["There was a problem saving the widget"]
            }
          });
        }
      }.bind(this)
    });
  },

  removeWidget: function() {
    if (!this._widget) {
      // TODO: implement this sometime
    }
  },

  changeWidget: function() {
    var parentWidget, parentName;
    if (!this._widget) { return; }
    parentWidget = this._widget.parents(this.widgetClasses());
    if (parentWidget.length) {
      parentName = parentWidget.data('name');
      this.getEditForm(parentWidget.data('id'), parentName);
    }
  },

  getWidgetConfig: function(elem){
    return this.parseConfigs($(elem).find('.config'));
  },

  getThumbPath: function() {
    var configs = this.parseConfigs($('#preview-configs'));
    return configs['widget_thumb_path'];
  },

  parseConfigs: function(configs) {
    return configs.length ? JSON.parse(configs.html()) : {};
  },

  isInExceptionList: function(slug) {
    var found = false;
    $.each(this.widgetExceptionList(), function(key, value) {
      if (key === slug){
        found = true;
      }
    });
    return found;
  },

  widgetExceptionList: function() {
    return {
      "photo": "img",
      "contact-info-sheet": ".info-sheet-nav"
    };
  },

  isAppendedPhoneWidget: function(elem){
    return ($(elem).data('slug') === 'phone-number' && !$(elem).find('a.number').length);
  },

  insertErrorMessages: function(errors) {
    var error = "<div class='alert alert-error'>" + errors["errors"]["base"][0] + "</div>";
    return topWindow.$('#modal .modal-body').prepend(error);
  },

};
(function() {
  var FormSubmitDisabler;

  $(function() {
    return $('body[class~=preview] form').each(function() {
      return new FormSubmitDisabler($(this));
    });
  });

  FormSubmitDisabler = (function() {
    function FormSubmitDisabler($element) {
      var $submitInput;
      $submitInput = $element.find('input[type=submit]');
      $submitInput.attr('disabled', 'disabled');
    }

    return FormSubmitDisabler;

  })();

}).call(this);
(function() {
  $(function() {
    var config, pattern, previewConfigs;
    config = $('#preview-configs');
    if (config.length !== 0) {
      previewConfigs = JSON.parse(config.html());
      pattern = "^http|^\/\/|^" + previewConfigs.urn;
      return $('body').delegate('a', 'click', function() {
        var linkHref, previewHref;
        linkHref = $(this).attr('href');
        if (typeof linkHref !== 'undefined' && !linkHref.match(new RegExp(pattern, 'i'))) {
          if (previewConfigs.corporate) {
            previewHref = previewConfigs.slug_corporate + linkHref;
          } else {
            previewHref = linkHref.replace("" + previewConfigs.slug + "/", "" + previewConfigs.urn + "/" + previewConfigs.slug + "/");
          }
          return $(this).attr('href', previewHref);
        }
      });
    }
  });

}).call(this);
